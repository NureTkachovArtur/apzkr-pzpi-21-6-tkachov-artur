import { Component, EventEmitter, Input, Output } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';
import { POSTValues } from './create-patient.model';

@Component({
  selector: 'app-create-patient',
  templateUrl: './create-patient.component.html',
  styleUrl: './create-patient.component.css'
})
export class CreatePatientComponent {

  @Output() onSubmitEvent = new EventEmitter<any>();
  @Input() createView: any;

  url: string = environment.apiBaseUrl;
  loaded: boolean = true;
  values: POSTValues = new POSTValues();

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService
  ) {
  }

  saveChanges() {
    if (!this.values.password ||
      !this.values.confirmPassword ||
      (this.values.password != this.values.confirmPassword)) {
      this.toastr.error("Паролі не є коректними", "Помилка");
      return;
    }

    if (!this.values.email ||
      !this.values.userName ||
      !this.values.age ||
      !this.values.gender ||
      !this.values.address) {
      this.toastr.error("Не всі поля заповнені", "Помилка");
      return;
    }

    this.authService.registerPatientAdmin(this.values);
  }

  getBack() {
    this.router.navigate(['/admin-panel']);
  }

}
