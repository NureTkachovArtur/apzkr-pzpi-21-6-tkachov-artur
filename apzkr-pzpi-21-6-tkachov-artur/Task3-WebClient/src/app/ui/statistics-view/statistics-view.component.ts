import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, map } from 'rxjs';

@Component({
  selector: 'app-statistics-view',
  templateUrl: './statistics-view.component.html',
  styleUrl: './statistics-view.component.css'
})
export class StatisticsViewComponent {

  url: string = environment.apiBaseUrl;
  schedules: any = [];
  patient: any;
  patientId: number = 0;
  userRole: string = '';
  loaded: boolean = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.userRole = this.authService.getUserInfo()!.role;
    this.route.params.subscribe(data => {
      this.patientId = data['id'];
      this.getPatient();
    });
  }
  
  getPatient() {
    this.http.get(this.url + '/Patients/' + this.patientId).subscribe(data => {
      this.patient = data;
      this.getSchedules();
    });
  }

  getSchedules() {
    this.http.get(this.url + '/MedicationSchedules/patient/' + this.patientId).subscribe(data => {
      this.schedules = data;

      if (!this.schedules.length) {
        this.loaded = true;
      }
      this.getEvents();
      this.getMedicines();
    });
  }

  getEvents() {
    this.http.get(this.url + '/ScheduleEvents/patient/' + this.patientId).subscribe((data: any) => {
      const statCount: any = {};
      const takenDoses: any = {};
      const missedDosesCount: any = {};
      const statDates: any = {};

      for (var stat of data) {
        // Тут рахую скільки у кожного розкладу прийнятих ТА пропущених доз.
        if (stat.activated || stat.missedDose) {
          var id = stat.medicationSchedule.medicationScheduleId;
          if (id in statCount) {
            statCount[id] = statCount[id] + 1;
          } else {
            statCount[id] = 1;
          }
        }

        // Тут рахую скільки у кожного розкладу прийнятих доз.
        if (stat.activated) {
          var id = stat.medicationSchedule.medicationScheduleId;
          if (id in takenDoses) {
            takenDoses[id] = takenDoses[id] + 1;
          } else {
            takenDoses[id] = 1;
          }
        }

        // Тут рахую скільки у кожного розкладу пропущено доз.
        if (stat.missedDose) {
          if (id in missedDosesCount) {
            missedDosesCount[id] = missedDosesCount[id] + 1;
          } else {
            missedDosesCount[id] = 1;
          }
        }

        // Тут рахую коли саме у кожного розкаду були прийняті дози.
        if (!stat.missedDose && stat.activated) {
          var date = stat.medicationTime.slice(0, -3).replace('T', ' ').replaceAll('-', '/');
          if (id in statDates) {
            statDates[id].push(date);
          } else {
            statDates[id] = [date];
          }
        }
      }

      for (var sc of this.schedules) {
        if (sc.medicationScheduleId in statCount) {
          sc.statsCount = statCount[sc.medicationScheduleId];
        } else {
          sc.statsCount = 0;
        }

        if (sc.medicationScheduleId in takenDoses) {
          sc.takeDoses = takenDoses[sc.medicationScheduleId];
        } else {
          sc.takeDoses = 0;
        }

        if (sc.medicationScheduleId in missedDosesCount) {
          sc.missedDoses = missedDosesCount[sc.medicationScheduleId];
        } else {
          sc.missedDoses = 0;
        }

        if (sc.medicationScheduleId in statDates) {
          sc.statsDates = statDates[sc.medicationScheduleId];
        } else {
          sc.statsDates = [];
        }
      }
    });
  }

  getMedicines() {
    var medicineToGet: any = {};
    for (var sc of this.schedules) {
      medicineToGet[sc.medicineId] = null;
    }

    var observables = [];
    for (var medicineId in medicineToGet) {
      observables.push(
        this.http.get(this.url + '/Medicines/' + medicineId).pipe(
          map(data => ({ medicineId, data }))
        )
      );
    }

    forkJoin(observables).subscribe((results: any) => {
      for (let result of results) {
        medicineToGet[result.data.medicineId] = result.data;
      }
      for (var sc of this.schedules) {
        sc.medicine = medicineToGet[sc.medicineId];
      }

      this.loaded = true;
    });
  }

}
