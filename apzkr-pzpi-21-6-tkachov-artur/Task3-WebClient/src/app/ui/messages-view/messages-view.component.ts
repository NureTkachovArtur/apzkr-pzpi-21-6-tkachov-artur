import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map } from 'rxjs';

@Component({
  selector: 'app-messages-view',
  templateUrl: './messages-view.component.html',
  styleUrl: './messages-view.component.css',
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        animate('0.3s', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class MessagesViewComponent {

  url: string = environment.apiBaseUrl;
  messages: any = [];
  user: any;
  loaded: boolean = false;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.getCurrentUser().subscribe(data => {
      this.user = data;
      this.user.role = this.authService.getUserInfo()!.role;
      this.getMessages();
    });
  }

  getMessages() {
    this.http.get(this.url + '/Messages/user/' + this.user.applicationUser.id).subscribe(data => {
      this.messages = data;
      if (this.messages.length == 0) {
        this.loaded = true;
        return;
      }
      this.getMessageTypes();
    });
  }

  getMessageTypes() {
    this.http.get(this.url + '/MessageTypes').subscribe((data: any) => {
      var messageTypes: any = {};
      for (var type of data) {
        messageTypes[type.messageTypeId] = type.name;
      }
      for (var msg of this.messages) {
        msg.type = messageTypes[msg.messageTypeId];
      }
      this.getPatientData();
    });
  }

  getPatientData() {
    var patientsToGet: any = {};
    var patientObservables = [];

    for (var msg of this.messages) {
      patientsToGet[msg.patientId] = null;
    }

    for (var patientId in patientsToGet) {
      patientObservables.push(
        this.http.get(this.url + '/Patients/' + patientId).pipe(
          map(data => ({ patientId, data }))
        )
      );
    }

    forkJoin(patientObservables).subscribe((results: any) => {
      for (let result of results) {
        patientsToGet[result.data.patientId] = result.data;
      }
      for (var msg of this.messages) {
        msg.patient = patientsToGet[msg.patientId];
      }

      this.loaded = true;
    });
  }

  deleteMessage(messageId: number) {
    this.http.delete(this.url + "/Messages/" + messageId).subscribe(res => {
      for (let i = 0; i < this.messages.length; i++) {
        if (this.messages[i].messageId == messageId) {
          this.messages.splice(i, 1);
          break;
        }
      }
    });
  }

}
