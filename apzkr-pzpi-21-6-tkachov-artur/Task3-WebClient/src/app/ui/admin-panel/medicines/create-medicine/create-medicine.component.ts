import { Component } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { POSTValues } from './create-medicine.model';

@Component({
  selector: 'app-create-medicine',
  templateUrl: './create-medicine.component.html',
  styleUrl: './create-medicine.component.css'
})
export class CreateMedicineComponent {

  url: string = environment.apiBaseUrl;
  loaded: boolean = false;
  values: POSTValues = new POSTValues();
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
    if (!this.values.patientId ||
      !this.values.description ||
      !this.values.dosage ||
      !this.values.expirationDate ||
      !this.values.instruction ||
      !this.values.name ||
      !this.values.quantity) {
      this.toastr.error("Не всі поля заповнені", "Помилка");
      return;
    }

    this.http.post(this.url + "/Medicines", this.values).subscribe(
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

  getBack() {
    this.router.navigate(['/admin-panel']);
  }

}
