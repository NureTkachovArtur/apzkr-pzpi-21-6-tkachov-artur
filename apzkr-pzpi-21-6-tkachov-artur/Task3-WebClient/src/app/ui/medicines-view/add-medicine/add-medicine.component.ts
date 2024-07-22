import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { POSTValues } from '../../admin-panel/medicines/create-medicine/create-medicine.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-medicine',
  templateUrl: './add-medicine.component.html',
  styleUrl: './add-medicine.component.css'
})
export class AddMedicineComponent {

  url: string = environment.apiBaseUrl;
  loaded: boolean = false;
  values: POSTValues = new POSTValues();

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
  ) {
  }

  ngOnInit() {
    this.values.patientId = +window.history.state['patientId'];
    this.loaded = true;
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

  getBack() {
    this.router.navigate(['/medicines', this.values.patientId]);
  }

}
