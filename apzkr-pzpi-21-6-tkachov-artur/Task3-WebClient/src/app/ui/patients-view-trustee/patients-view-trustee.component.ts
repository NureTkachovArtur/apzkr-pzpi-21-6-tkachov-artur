import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { environment } from '../../../environments/environment';
import { POSTValues } from '../admin-panel/patient-trustees/create-patient-trustee/create-patient-trustee.model';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-patients-view-trustee',
  templateUrl: './patients-view-trustee.component.html',
  styleUrl: './patients-view-trustee.component.css',
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        animate('0.3s', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class PatientsViewTrusteeComponent {

  url: string = environment.apiBaseUrl;
  patients: any = [];
  patientsAll: any = [];
  trusteeId: any;
  loaded: boolean = false;
  values: POSTValues = new POSTValues();
  @ViewChild('closePOSTbutton') closePOSTButton!: ElementRef<HTMLElement>;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private authService: AuthService
  ) {
    this.authService.getCurrentUser().subscribe(data => {
      this.trusteeId = this.authService.getUserInfo()!.id;
      this.getPatients();
    });
  }

  getPatients() {
    this.http.get(this.url + '/Trustees/patients/' + this.trusteeId).subscribe(data => {
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
    this.values.trusteeId = this.trusteeId;

    if (!this.values.patientId) {
      this.toastr.error("Не всі поля заповнені", "Помилка");
      return;
    }

    this.http.post(this.url + "/PatientTrustees", this.values).subscribe(
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
    this.http.delete(this.url + "/PatientTrustees/" + patientId + '/' + this.trusteeId).subscribe(res => {
      for (let i = 0; i < this.patients.length; i++) {
        if (this.patients[i].patientId == patientId) {
          this.patients.splice(i, 1);
          break;
        }
      }
    });
  }

}
