import { Component } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { POSTValues } from './create-medication-schedule.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-create-medication-schedule',
  templateUrl: './create-medication-schedule.component.html',
  styleUrl: './create-medication-schedule.component.css'
})
export class CreateMedicationScheduleComponent {

  url: string = environment.apiBaseUrl;
  loaded: boolean = false;
  patientChosed: boolean = false;
  values: POSTValues = new POSTValues();
  patients: any;
  medicines: any;
  smartDevices: any;

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
    if (!this.values.patientId ||
      !this.values.medicineId ||
      !this.values.smartDeviceId ||
      !this.values.medicationStartDate ||
      !this.values.dosesPerDay ||
      !this.values.daysLeft ||
      !this.values.everyNDay) {
      this.toastr.error("Не всі поля заповнені", "Помилка");
      return;
    }

    this.http.post(this.url + "/MedicationSchedules", this.values).subscribe(
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
    this.patientChosed = true;
    this.getMedicines();
    this.getSmartDevices();
  }

  getMedicines() {
    this.http.get(this.url + "/Patients/medicines/" + this.values.patientId).subscribe(data => {
      this.medicines = data;
    });
  }

  getSmartDevices() {
    this.http.get(this.url + "/Patients/devices/" + this.values.patientId).subscribe(data => {
      this.smartDevices = data;
    });
  }

  getBack() {
    this.router.navigate(['/admin-panel']);
  }

}
