import { Component } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { POSTValues } from './create-smart-device.model';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-create-smart-device',
  templateUrl: './create-smart-device.component.html',
  styleUrl: './create-smart-device.component.css'
})
export class CreateSmartDeviceComponent {

  url: string = environment.apiBaseUrl;
  loaded: boolean = true;
  patientChosed: boolean = false;
  values: POSTValues = new POSTValues();
  types: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {
    this.getSmartDeviceTypes();
  }

  saveChanges() {
    if (!this.values.smartDeviceTypeId) {
      this.toastr.error("Не всі поля заповнені", "Помилка");
      return;
    }

    this.http.post(this.url + "/SmartDevices", this.values).subscribe(
      (response: any) => {
        if (!response.ok) {
          this.toastr.error(response.message, "Помилка");
        } else {
          this.downloadJson(response.data);
          this.getBack();
        }
      },
      error => {
        this.toastr.error("Проблема сервера, спробуйте пізніше", "Помилка");
      }
    );
  }

  downloadJson(data: any) {
    const jsonStr = JSON.stringify(data);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    saveAs(blob, 'config.json');
  }

  getSmartDeviceTypes() {
    this.http.get(this.url + "/SmartDeviceTypes/").subscribe(data => {
      this.types = data;
    });
  }

  getBack() {
    this.router.navigate(['/admin-panel']);
  }

}
