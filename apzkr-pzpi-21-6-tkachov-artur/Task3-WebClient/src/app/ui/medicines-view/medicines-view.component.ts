import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-medicines-view',
  templateUrl: './medicines-view.component.html',
  styleUrl: './medicines-view.component.css',
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        animate('0.3s', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class MedicinesViewComponent {

  url: string = environment.apiBaseUrl;
  medicines: any = [];
  patientId: any;
  patient: any;
  userRole: any;
  loaded: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.userRole = this.authService.getUserInfo()!.role;
    this.route.params.subscribe(data => {
      this.patientId = data['id'];
      this.getMedicines();
    });
  }

  getMedicines() {
    this.http.get(this.url + "/Medicines/patient/" + this.patientId).subscribe((data: any) => {
      this.medicines = data;
      if (this.userRole != 'Patient') {
        this.getPatient();
      } else {
        this.loaded = true;
      }
    });
  }

  getPatient() {
    this.http.get(this.url + '/Patients/' + this.patientId).subscribe(data => {
      this.patient = data;
      this.loaded = true;
    });
  }

  createMedicine() {
    this.router.navigate(['/add-medicine'], { state: { patientId: this.patientId } });
  }

  editMedicine(medicineId: number) {
    this.router.navigate(['/edit-medicine', medicineId]);
  }

  deleteMedicine(medicineId: number) {
    this.http.delete(this.url + "/Medicines/" + medicineId).subscribe(res => {
      for (let i = 0; i < this.medicines.length; i++) {
        if (this.medicines[i].medicineId == medicineId) {
          this.medicines.splice(i, 1);
          break;
        }
      }
    });
  }

}
