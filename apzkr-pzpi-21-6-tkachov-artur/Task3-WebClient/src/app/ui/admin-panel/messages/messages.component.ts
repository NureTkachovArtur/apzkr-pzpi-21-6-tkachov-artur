import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css',
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        animate('0.3s', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class MessagesComponent {

  url: string = environment.apiBaseUrl;
  messages: any;
  messagesFiltered: any;
  messagesFilteredAndSorted: any;
  loaded: boolean = false;
  sortBy: any = {};

  constructor(
    private http: HttpClient
  ) {
    this.sortBy = {
      id: {
        asc: true,
        desc: false
      },
      messageTypeId: {
        asc: false,
        desc: false
      },
      patientId: {
        asc: false,
        desc: false
      }
    };

    this.getMessages();
  }

  deactivate() {
    for (let key1 in this.sortBy) {
      for (let key2 in this.sortBy[key1]) {
        if (this.sortBy[key1][key2]) {
          this.sortBy[key1][key2] = false;
          return;
        }
      }
    }
  }

  sort() {
    if (this.sortBy.id.asc) {
      this.messagesFilteredAndSorted.sort((a: any, b: any) => a.messageId - b.messageId);
    } else if (this.sortBy.id.desc) {
      this.messagesFilteredAndSorted.sort((a: any, b: any) => b.messageId - a.messageId);
    } else if (this.sortBy.messageTypeId.asc) {
      this.messagesFilteredAndSorted.sort((a: any, b: any) => a.messageTypeId - b.messageTypeId);
    } else if (this.sortBy.messageTypeId.desc) {
      this.messagesFilteredAndSorted.sort((a: any, b: any) => b.messageTypeId - a.messageTypeId);
    } else if (this.sortBy.patientId.asc) {
      this.messagesFilteredAndSorted.sort((a: any, b: any) => a.patientId - b.patientId);
    } else if (this.sortBy.patientId.desc) {
      this.messagesFilteredAndSorted.sort((a: any, b: any) => b.patientId - a.patientId);
    }
  }

  sortById() {
    if (!this.sortBy.id.asc && !this.sortBy.id.desc) {
      this.deactivate();
      this.sortBy.id.asc = true
    } else if (this.sortBy.id.asc) {
      this.sortBy.id.asc = false;
      this.sortBy.id.desc = true;
    } else if (this.sortBy.id.desc) {
      this.sortBy.id.asc = true;
      this.sortBy.id.desc = false;
    }

    this.sort();
  }

  sortByPatientId() {
    if (!this.sortBy.patientId.asc && !this.sortBy.patientId.desc) {
      this.deactivate();
      this.sortBy.patientId.asc = true
    } else if (this.sortBy.patientId.asc) {
      this.sortBy.patientId.asc = false;
      this.sortBy.patientId.desc = true;
    } else if (this.sortBy.patientId.desc) {
      this.sortBy.patientId.asc = true;
      this.sortBy.patientId.desc = false;
    }

    this.sort();
  }

  sortByMessageTypeId() {
    if (!this.sortBy.messageTypeId.asc && !this.sortBy.messageTypeId.desc) {
      this.deactivate();
      this.sortBy.messageTypeId.asc = true
    } else if (this.sortBy.messageTypeId.asc) {
      this.sortBy.messageTypeId.asc = false;
      this.sortBy.messageTypeId.desc = true;
    } else if (this.sortBy.messageTypeId.desc) {
      this.sortBy.messageTypeId.asc = true;
      this.sortBy.messageTypeId.desc = false;
    }

    this.sort();
  }

  getMessages() {
    this.http.get(this.url + "/Messages").subscribe(data => {
      this.messages = data;
      this.messagesFilteredAndSorted = [...this.messages];
      this.loaded = true;
    });
  }

  deleteMessage(messageId: number) {
    this.http.delete(this.url + "/Messages/" + messageId).subscribe(res => {
      this.getMessages();
    });
  }

}
