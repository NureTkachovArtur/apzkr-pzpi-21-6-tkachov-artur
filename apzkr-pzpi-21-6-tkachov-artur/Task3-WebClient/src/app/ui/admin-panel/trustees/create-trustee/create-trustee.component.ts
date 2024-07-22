import { Component } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';
import { POSTValues } from './create-trustee.model';

@Component({
  selector: 'app-create-trustee',
  templateUrl: './create-trustee.component.html',
  styleUrl: './create-trustee.component.css'
})
export class CreateTrusteeComponent {

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
      !this.values.userName) {
      this.toastr.error("Не всі поля заповнені", "Помилка");
      return;
    }

    this.authService.registerTrusteeAdmin(this.values);
  }

  getBack() {
    this.router.navigate(['/admin-panel']);
  }

}
