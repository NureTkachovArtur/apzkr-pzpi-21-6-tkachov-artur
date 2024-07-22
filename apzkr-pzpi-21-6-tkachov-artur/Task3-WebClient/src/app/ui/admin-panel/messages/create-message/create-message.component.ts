import { Component } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../../services/auth/auth.service';
import { POSTValues } from './create-message.model';

@Component({
  selector: 'app-create-message',
  templateUrl: './create-message.component.html',
  styleUrl: './create-message.component.css'
})
export class CreateMessageComponent {

  url: string = environment.apiBaseUrl;
  loaded: boolean = false;
  patientChosed: boolean = false;
  values: POSTValues = new POSTValues();
  patients: any;
  messageTypes: any;
  users: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {
    this.getPatients();
    this.getMessageTypes();
    this.getUsers();
  }

  saveChanges() {
    if (!this.values.patientId ||
      !this.values.createdAt ||
      !this.values.messageTypeId ||
      !this.values.receiverId ||
      !this.values.text) {
      this.toastr.error("Не всі поля заповнені", "Помилка");
      return;
    }

    this.http.post(this.url + "/Messages", this.values).subscribe(
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
    });
  }

  getMessageTypes() {
    this.http.get(this.url + "/MessageTypes/").subscribe(data => {
      this.messageTypes = data;
    });
  }

  getUsers() {
    this.http.get(this.url + "/Accounts/").subscribe(data => {
      this.users = data;
      this.loaded = true;
    });
  }

  getBack() {
    this.router.navigate(['/admin-panel']);
  }

}
