import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  url: string = environment.apiBaseUrl;
  userType: string = "Patient";
  createView: boolean = false;

  constructor(private http: HttpClient, private toastr: ToastrService, private authService: AuthService) { }

  registerDoctor(event: any) {
    this.authService.registerDoctor(event);
  }

  registerTrustee(event: any) {
    this.authService.registerTrustee(event);
  }

  registerPatient(event: any) {
    this.authService.registerPatient(event);
  }
}
