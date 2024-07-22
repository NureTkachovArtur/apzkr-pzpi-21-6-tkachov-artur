import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-medication-schedules',
  templateUrl: './medication-schedules.component.html',
  styleUrl: './medication-schedules.component.css',
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        animate('0.3s', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class MedicationSchedulesComponent {

  url: string = environment.apiBaseUrl;
  mSchedules: any;
  mSchedulesFiltered: any;
  mSchedulesFilteredAndSorted: any;
  loaded: boolean = false;
  sortBy: any = {};

  constructor(
    private http: HttpClient
  ) {
    this.sortBy = {
      medicationScheduleId: {
        asc: true,
        desc: false
      },
      patientId: {
        asc: false,
        desc: false
      },
      medicineName: {
        asc: false,
        desc: false
      }
    };

    this.getMSchedules();
  }

  deactivate() {
    for (let key1 in this.sortBy) {
      for (let key2 in this.sortBy[key1]) {
        if (this.sortBy[key1][key2]) {
          this.sortBy[key1][key2] = false;
          return;
        }
      }
    }
  }

  sort() {
    if (this.sortBy.medicationScheduleId.asc) {
      this.mSchedulesFilteredAndSorted.sort((a: any, b: any) => a.medicationScheduleId - b.medicationScheduleId);
    } else if (this.sortBy.medicationScheduleId.desc) {
      this.mSchedulesFilteredAndSorted.sort((a: any, b: any) => b.medicationScheduleId - a.medicationScheduleId);
    } else if (this.sortBy.patientId.asc) {
      this.mSchedulesFilteredAndSorted.sort((a: any, b: any) => a.patientId - b.patientId);
    } else if (this.sortBy.patientId.desc) {
      this.mSchedulesFilteredAndSorted.sort((a: any, b: any) => b.patientId - a.patientId);
    } else if (this.sortBy.medicineName.asc) {
      this.mSchedulesFilteredAndSorted.sort((a: any, b: any) => a.medicine.name.localeCompare(b.medicine.name));
    } else if (this.sortBy.medicineName.desc) {
      this.mSchedulesFilteredAndSorted.sort((a: any, b: any) => b.medicine.name.localeCompare(a.medicine.name));
    }
  }

  sortById() {
    if (!this.sortBy.medicationScheduleId.asc && !this.sortBy.medicationScheduleId.desc) {
      this.deactivate();
      this.sortBy.medicationScheduleId.asc = true
    } else if (this.sortBy.medicationScheduleId.asc) {
      this.sortBy.medicationScheduleId.asc = false;
      this.sortBy.medicationScheduleId.desc = true;
    } else if (this.sortBy.medicationScheduleId.desc) {
      this.sortBy.medicationScheduleId.asc = true;
      this.sortBy.medicationScheduleId.desc = false;
    }

    this.sort();
  }

  sortByPatientId() {
    if (!this.sortBy.patientId.asc && !this.sortBy.patientId.desc) {
      this.deactivate();
      this.sortBy.patientId.asc = true
    } else if (this.sortBy.patientId.asc) {
      this.sortBy.patientId.asc = false;
      this.sortBy.patientId.desc = true;
    } else if (this.sortBy.patientId.desc) {
      this.sortBy.patientId.asc = true;
      this.sortBy.patientId.desc = false;
    }

    this.sort();
  }

  sortByMedicineName() {
    if (!this.sortBy.medicineName.asc && !this.sortBy.medicineName.desc) {
      this.deactivate();
      this.sortBy.medicineName.asc = true
    } else if (this.sortBy.medicineName.asc) {
      this.sortBy.medicineName.asc = false;
      this.sortBy.medicineName.desc = true;
    } else if (this.sortBy.medicineName.desc) {
      this.sortBy.medicineName.asc = true;
      this.sortBy.medicineName.desc = false;
    }

    this.sort();
  }

  getMSchedules() {
    this.http.get(this.url + "/MedicationSchedules").subscribe(data => {
      this.mSchedules = data;
      this.mSchedulesFilteredAndSorted = [...this.mSchedules];
      this.loaded = true;
    });
  }

  deleteMSchedule(mScheduleId: number) {
    this.http.delete(this.url + "/MedicationSchedules/" + mScheduleId).subscribe(res => {
      this.getMSchedules();
    });
  }

}
