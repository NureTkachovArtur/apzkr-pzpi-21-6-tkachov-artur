import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-administrators',
  templateUrl: './administrators.component.html',
  styleUrl: './administrators.component.css',
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        animate('0.3s', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class AdministratorsComponent {

  search: any;
  url: string = environment.apiBaseUrl;
  administrators: any;
  administratorsFiltered: any;
  administratorsFilteredAndSorted: any;
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
      userName: {
        asc: false,
        desc: false
      }
    };

    this.getAdministrators();
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
      this.administratorsFilteredAndSorted.sort((a: any, b: any) => a.administratorId - b.administratorId);
    } else if (this.sortBy.id.desc) {
      this.administratorsFilteredAndSorted.sort((a: any, b: any) => b.administratorId - a.administratorId);
    } else if (this.sortBy.userName.asc) {
      this.administratorsFilteredAndSorted.sort((a: any, b: any) => a.applicationUser.userName.localeCompare(b.applicationUser.userName));
    } else if (this.sortBy.userName.desc) {
      this.administratorsFilteredAndSorted.sort((a: any, b: any) => b.applicationUser.userName.localeCompare(a.applicationUser.userName));
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

  sortByUserName() {
    if (!this.sortBy.userName.asc && !this.sortBy.userName.desc) {
      this.deactivate();
      this.sortBy.userName.asc = true
    } else if (this.sortBy.userName.asc) {
      this.sortBy.userName.asc = false;
      this.sortBy.userName.desc = true;
    } else if (this.sortBy.userName.desc) {
      this.sortBy.userName.asc = true;
      this.sortBy.userName.desc = false;
    }

    this.sort();
  }

  searchAdministrator(event: string) {
    this.administratorsFiltered = this.administrators.filter((p: any) =>
      p.applicationUser.userName.toLowerCase().includes(event.toLowerCase()));
    this.administratorsFilteredAndSorted = [...this.administratorsFiltered];
  }

  getAdministrators() {
    this.http.get(this.url + "/Administrators").subscribe(data => {
      this.administrators = data;
      this.administratorsFilteredAndSorted = [...this.administrators];
      this.loaded = true;
    });
  }

  deleteAdministrator(administratorId: number) {
    this.http.delete(this.url + "/Administrators/acc/" + administratorId).subscribe(res => {
      this.getAdministrators();
    });
  }

}
