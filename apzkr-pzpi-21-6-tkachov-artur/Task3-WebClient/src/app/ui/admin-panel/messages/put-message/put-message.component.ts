import { Component } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PUTValues } from './put-message.model';
import { compDicts } from '../../../../helpers';

@Component({
  selector: 'app-put-message',
  templateUrl: './put-message.component.html',
  styleUrl: './put-message.component.css'
})
export class PutMessageComponent {

  messageId: number = 0;
  url: string = environment.apiBaseUrl;
  changes: PUTValues = new PUTValues();
  changesBefore: PUTValues = new PUTValues();
  values: any;
  loaded: boolean = false;
  patients: any;
  messageTypes: any;
  users: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(data => {
      this.messageId = data['messageId'];
      this.getMessage();
    });
  }

  getMessage() {
    this.http.get(this.url + "/Messages/" + this.messageId).subscribe((data: any) => {
      this.values = data;

      this.changes.createdAt =     data.createdAt;
      this.changes.isRead =        data.isRead;
      this.changes.isReceived =    data.isReceived;
      this.changes.messageId =     data.messageId;
      this.changes.messageTypeId = data.messageTypeId;
      this.changes.patientId =     data.patientId;
      this.changes.receiverId =    data.receiverId;
      this.changes.text =          data.text;

      this.changesBefore = { ...this.changes };

      this.getPatients();
      this.getMessageTypes();
      this.getUsers();
    });
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

  saveChanges() {
    if (compDicts(this.changes, this.changesBefore)) {
      this.getBack();
      return;
    }

    this.http.put(this.url + "/Messages/" + this.messageId, this.changes).subscribe(res => {
      this.getBack();
    });
  }

  getBack() {
    this.router.navigate(['/admin-panel']);
  }

}
