import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-patient-doctors',
  templateUrl: './patient-doctors.component.html',
  styleUrl: './patient-doctors.component.css',
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        animate('0.3s', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class PatientDoctorsComponent {

  url: string = environment.apiBaseUrl;
  patientDoctors: any;
  patientDoctorsFiltered: any;
  patientDoctorsFilteredAndSorted: any;
  loaded: boolean = false;
  sortBy: any = {};

  constructor(
    private http: HttpClient
  ) {
    this.sortBy = {
      doctorId: {
        asc: false,
        desc: false
      },
      patientId: {
        asc: false,
        desc: false
      }
    };

    this.getPatientDoctors();
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
    if (this.sortBy.doctorId.asc) {
      this.patientDoctorsFilteredAndSorted.sort((a: any, b: any) => a.doctorId - b.doctorId);
    } else if (this.sortBy.doctorId.desc) {
      this.patientDoctorsFilteredAndSorted.sort((a: any, b: any) => b.doctorId - a.doctorId);
    } else if (this.sortBy.patientId.asc) {
      this.patientDoctorsFilteredAndSorted.sort((a: any, b: any) => a.patientId - b.patientId);
    } else if (this.sortBy.patientId.desc) {
      this.patientDoctorsFilteredAndSorted.sort((a: any, b: any) => b.patientId - a.patientId);
    }
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

  sortByDoctorId() {
    if (!this.sortBy.doctorId.asc && !this.sortBy.doctorId.desc) {
      this.deactivate();
      this.sortBy.doctorId.asc = true
    } else if (this.sortBy.doctorId.asc) {
      this.sortBy.doctorId.asc = false;
      this.sortBy.doctorId.desc = true;
    } else if (this.sortBy.doctorId.desc) {
      this.sortBy.doctorId.asc = true;
      this.sortBy.doctorId.desc = false;
    }

    this.sort();
  }

  getPatientDoctors() {
    this.http.get(this.url + "/PatientDoctors").subscribe(data => {
      this.patientDoctors = data;
      this.patientDoctorsFilteredAndSorted = [...this.patientDoctors];
      this.loaded = true;
    });
  }

  deletePatientDoctor(pd: any) {
    this.http.delete(this.url + "/PatientDoctors/" + pd.patientId + "/" + pd.doctorId).subscribe(res => {
      this.getPatientDoctors();
    });
  }

}
