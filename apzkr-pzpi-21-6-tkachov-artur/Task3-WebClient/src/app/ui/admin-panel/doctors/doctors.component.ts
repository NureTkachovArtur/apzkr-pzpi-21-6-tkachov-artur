import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styleUrl: './doctors.component.css',
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        animate('0.3s', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class DoctorsComponent {

  search: any;
  url: string = environment.apiBaseUrl;
  doctors: any;
  doctorsFiltered: any;
  doctorsFilteredAndSorted: any;
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

    this.getDoctors();
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
      this.doctorsFilteredAndSorted.sort((a: any, b: any) => a.doctorId - b.doctorId);
    } else if (this.sortBy.id.desc) {
      this.doctorsFilteredAndSorted.sort((a: any, b: any) => b.doctorId - a.doctorId);
    } else if (this.sortBy.userName.asc) {
      this.doctorsFilteredAndSorted.sort((a: any, b: any) => a.applicationUser.userName.localeCompare(b.applicationUser.userName));
    } else if (this.sortBy.userName.desc) {
      this.doctorsFilteredAndSorted.sort((a: any, b: any) => b.applicationUser.userName.localeCompare(a.applicationUser.userName));
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

  searchDoctor(event: string) {
    this.doctorsFiltered = this.doctors.filter((p: any) =>
      p.applicationUser.userName.toLowerCase().includes(event.toLowerCase()));
    this.doctorsFilteredAndSorted = [...this.doctorsFiltered];
  }

  getDoctors() {
    this.http.get(this.url + "/Doctors").subscribe(data => {
      this.doctors = data;
      this.doctorsFilteredAndSorted = [...this.doctors];
      this.loaded = true;
    });
  }

  deleteDoctor(doctorId: number) {
    this.http.delete(this.url + "/Doctors/acc/" + doctorId).subscribe(res => {
      this.getDoctors();
    });
  }

}
