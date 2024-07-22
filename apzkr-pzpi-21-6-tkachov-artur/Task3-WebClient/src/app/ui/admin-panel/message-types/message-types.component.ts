import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-message-types',
  templateUrl: './message-types.component.html',
  styleUrl: './message-types.component.css',
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        animate('0.3s', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class MessageTypesComponent {

  url: string = environment.apiBaseUrl;
  messageTypes: any;
  messageTypesFiltered: any;
  messageTypesFilteredAndSorted: any;
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
      name: {
        asc: false,
        desc: false
      }
    };

    this.getMessageTypes();
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
      this.messageTypesFilteredAndSorted.sort((a: any, b: any) => a.messageTypeId - b.messageTypeId);
    } else if (this.sortBy.id.desc) {
      this.messageTypesFilteredAndSorted.sort((a: any, b: any) => b.messageTypeId - a.messageTypeId);
    } else if (this.sortBy.name.asc) {
      this.messageTypesFilteredAndSorted.sort((a: any, b: any) => a.name.localeCompare(b.name));
    } else if (this.sortBy.name.desc) {
      this.messageTypesFilteredAndSorted.sort((a: any, b: any) => b.name.localeCompare(a.name));
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

  sortByName() {
    if (!this.sortBy.name.asc && !this.sortBy.name.desc) {
      this.deactivate();
      this.sortBy.name.asc = true
    } else if (this.sortBy.name.asc) {
      this.sortBy.name.asc = false;
      this.sortBy.name.desc = true;
    } else if (this.sortBy.name.desc) {
      this.sortBy.name.asc = true;
      this.sortBy.name.desc = false;
    }

    this.sort();
  }

  getMessageTypes() {
    this.http.get(this.url + "/MessageTypes").subscribe(data => {
      this.messageTypes = data;
      this.messageTypesFilteredAndSorted = [...this.messageTypes];
      this.loaded = true;
    });
  }

  deleteMessageType(messageTypeId: number) {
    this.http.delete(this.url + "/MessageTypes/" + messageTypeId).subscribe(res => {
      this.getMessageTypes();
    });
  }

}
