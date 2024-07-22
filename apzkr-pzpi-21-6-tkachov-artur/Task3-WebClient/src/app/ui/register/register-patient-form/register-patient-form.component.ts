import { Component, EventEmitter, Input, Output } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { RegisterData } from './register-patient-form.model';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register-patient-form',
  templateUrl: './register-patient-form.component.html',
  styleUrl: './register-patient-form.component.css'
})
export class RegisterPatientFormComponent {
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
      !this.registrationData.address ||
      !this.registrationData.age ||
      !this.registrationData.userName ||
      !this.registrationData.gender) {
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
