import { Component } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { POSTValues } from './create-patient-doctor.model';

@Component({
  selector: 'app-create-patient-doctor',
  templateUrl: './create-patient-doctor.component.html',
  styleUrl: './create-patient-doctor.component.css'
})
export class CreatePatientDoctorComponent {

  url: string = environment.apiBaseUrl;
  loaded: boolean = false;
  values: POSTValues = new POSTValues();
  patients: any;
  doctors: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {
    this.getPatients();
    this.getDoctors();
  }

  saveChanges() {
    if (!this.values.patientId ||
      !this.values.doctorId) {
      this.toastr.error("Не всі поля заповнені", "Помилка");
      return;
    }

    this.http.post(this.url + "/PatientDoctors", this.values).subscribe(
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
    });
  }

  getDoctors() {
    this.http.get(this.url + "/Doctors").subscribe(data => {
      this.doctors = data;
      this.loaded = true;
    });
  }

  getBack() {
    this.router.navigate(['/admin-panel']);
  }

}
