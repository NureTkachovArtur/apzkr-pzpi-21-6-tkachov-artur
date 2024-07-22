import { Component } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { POSTValues } from './create-smart-device-type.model';

@Component({
  selector: 'app-create-smart-device-type',
  templateUrl: './create-smart-device-type.component.html',
  styleUrl: './create-smart-device-type.component.css'
})
export class CreateSmartDeviceTypeComponent {

  url: string = environment.apiBaseUrl;
  loaded: boolean = true;
  values: POSTValues = new POSTValues();

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {
  }

  saveChanges() {
    if (!this.values.name) {
      this.toastr.error("Не всі поля заповнені", "Помилка");
      return;
    }

    this.http.post(this.url + "/SmartDeviceTypes", this.values).subscribe(
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
    this.router.navigate(['/admin-panel']);
  }

}
