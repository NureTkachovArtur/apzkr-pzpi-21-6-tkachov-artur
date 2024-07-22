import { Component } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { POSTValues } from './create-schedule-event.model';

@Component({
  selector: 'app-create-schedule-event',
  templateUrl: './create-schedule-event.component.html',
  styleUrl: './create-schedule-event.component.css'
})
export class CreateScheduleEventComponent {

  url: string = environment.apiBaseUrl;
  loaded: boolean = false;
  values: POSTValues = new POSTValues();
  medicalSchedules: any;
  patientId: number = 0;
  patients: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {
    this.getPatients();
  }

  saveChanges() {
    if (!this.values.medicationTime) {
      this.toastr.error("Не всі поля заповнені", "Помилка");
      return;
    }

    this.http.post(this.url + "/ScheduleEvents", this.values).subscribe(
      (response: any) => {
        if (!response.ok) {
          this.toastr.error(response.message, "Помилка");
        } else {
          this.getBack();
        }
      },
      error => {
        this.toastr.error("Проблема сервера, спробуйте пізніше", "Помилка");
      }
    );
  }

  getPatients() {
    this.http.get(this.url + "/Patients").subscribe(data => {
      this.patients = data;
      this.loaded = true;
    });
  }

  setPatient(event: any) {
    this.getScheduleEvents();
  }

  getScheduleEvents() {
    this.http.get(this.url + "/Patients/medicines/" + this.patientId).subscribe(data => {
      this.medicalSchedules = data;
    });
  }

  getBack() {
    this.router.navigate(['/admin-panel']);
  }

}
