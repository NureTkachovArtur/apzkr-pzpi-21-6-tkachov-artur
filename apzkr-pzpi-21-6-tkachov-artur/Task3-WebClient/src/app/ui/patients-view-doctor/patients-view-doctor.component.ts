import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';
import { POSTValues } from '../admin-panel/patient-doctors/create-patient-doctor/create-patient-doctor.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-patients-view-doctor',
  templateUrl: './patients-view-doctor.component.html',
  styleUrl: './patients-view-doctor.component.css',
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        animate('0.3s', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class PatientsViewDoctorComponent {

  url: string = environment.apiBaseUrl;
  patients: any = [];
  patientsAll: any = [];
  doctorId: any;
  loaded: boolean = false;
  values: POSTValues = new POSTValues();
  @ViewChild('closePOSTbutton') closePOSTButton!: ElementRef<HTMLElement>;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private authService: AuthService
  ) {
    this.authService.getCurrentUser().subscribe(data => {
      this.doctorId = this.authService.getUserInfo()!.id;
      this.getPatients();
    });
  }

  getPatients() {
    this.http.get(this.url + '/Doctors/patients/' + this.doctorId).subscribe(data => {
      this.patients = data;
      this.loaded = true;
    });
  }

  getPatientsAll() {
    this.http.get(this.url + '/Patients').subscribe(data => {
      this.patientsAll = data;
    });
  }

  closeModal() {
    const el: HTMLElement = this.closePOSTButton.nativeElement;
    el.click();
  }

  getPatientProfilePicture(profilePictureUrl: string) {
    return profilePictureUrl ? `https://localhost:7027/api/Files/${profilePictureUrl}`
      : 'https://localhost:7027/api/Files/default-profile-picture.jpg';
  }

  createPatient() {
    this.values.doctorId = this.doctorId;

    if (!this.values.patientId) {
      this.toastr.error("Не всі поля заповнені", "Помилка");
      return;
    }

    this.http.post(this.url + "/PatientDoctors", this.values).subscribe(
      (response: any) => {
        if (!response.ok) {
          this.toastr.error(response.message, "Помилка");
        } else {
          this.getPatients();
          this.closeModal();
        }
      },
      error => {
        this.toastr.error("Проблема сервера, спробуйте пізніше", "Помилка");
      }
    );
  }

  deletePatient(patientId: number) {
    this.http.delete(this.url + "/PatientDoctors/" + patientId + '/' + this.doctorId).subscribe(res => {
      for (let i = 0; i < this.patients.length; i++) {
        if (this.patients[i].patientId == patientId) {
          this.patients.splice(i, 1);
          break;
        }
      }
    });
  }

}
