import { Component } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../../services/auth/auth.service';
import { POSTValues } from './create-patient-trustee.model';

@Component({
  selector: 'app-create-patient-trustee',
  templateUrl: './create-patient-trustee.component.html',
  styleUrl: './create-patient-trustee.component.css'
})
export class CreatePatientTrusteeComponent {

  url: string = environment.apiBaseUrl;
  loaded: boolean = false;
  values: POSTValues = new POSTValues();
  patients: any;
  trustees: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {
    this.getPatients();
    this.getTrustees();
  }

  saveChanges() {
    if (!this.values.patientId ||
      !this.values.trusteeId) {
      this.toastr.error("Не всі поля заповнені", "Помилка");
      return;
    }

    this.http.post(this.url + "/PatientTrustees", this.values).subscribe(
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

  getTrustees() {
    this.http.get(this.url + "/Trustees").subscribe(data => {
      this.trustees = data;
      this.loaded = true;
    });
  }

  getBack() {
    this.router.navigate(['/admin-panel']);
  }

}
