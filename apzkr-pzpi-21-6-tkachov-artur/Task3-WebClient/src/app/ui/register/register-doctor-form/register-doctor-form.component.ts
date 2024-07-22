import { Component, EventEmitter, Input, Output } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { RegisterData } from './register-doctor-form.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register-doctor-form',
  templateUrl: './register-doctor-form.component.html',
  styleUrl: './register-doctor-form.component.css'
})
export class RegisterDoctorFormComponent {

  @Output() onSubmitEvent = new EventEmitter<any>();
  @Input() createView: any;

  url: string = environment.apiBaseUrl;
  registrationData: RegisterData = new RegisterData();

  constructor(private http: HttpClient, private toastr: ToastrService) {
  }

  onSubmit() {
    if (!this.registrationData.email ||
      !this.registrationData.password ||
      !this.registrationData.confirmPassword ||
      !this.registrationData.phoneNumber ||
      !this.registrationData.userName) {
      this.toastr.error("Не всі обов'язкові поля заповнені", "Помилка");
      return;
    }

    if (this.registrationData.password != this.registrationData.confirmPassword) {
      this.toastr.error("Паролі не співпадають", "Помилка");
      return;
    }

    this.onSubmitEvent.emit(this.registrationData);
  }
}
