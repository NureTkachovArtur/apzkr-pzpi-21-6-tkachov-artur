import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-patient-trustees',
  templateUrl: './patient-trustees.component.html',
  styleUrl: './patient-trustees.component.css',
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        animate('0.3s', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class PatientTrusteesComponent {

  url: string = environment.apiBaseUrl;
  patientTrustees: any;
  patientTrusteesFiltered: any;
  patientTrusteesFilteredAndSorted: any;
  loaded: boolean = false;
  sortBy: any = {};

  constructor(
    private http: HttpClient
  ) {
    this.sortBy = {
      trusteeId: {
        asc: false,
        desc: false
      },
      patientId: {
        asc: false,
        desc: false
      }
    };

    this.getPatientTrustees();
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
    if (this.sortBy.trusteeId.asc) {
      this.patientTrusteesFilteredAndSorted.sort((a: any, b: any) => a.trusteeId - b.trusteeId);
    } else if (this.sortBy.trusteeId.desc) {
      this.patientTrusteesFilteredAndSorted.sort((a: any, b: any) => b.trusteeId - a.trusteeId);
    } else if (this.sortBy.patientId.asc) {
      this.patientTrusteesFilteredAndSorted.sort((a: any, b: any) => a.patientId - b.patientId);
    } else if (this.sortBy.patientId.desc) {
      this.patientTrusteesFilteredAndSorted.sort((a: any, b: any) => b.patientId - a.patientId);
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

  sortByTrusteeId() {
    if (!this.sortBy.trusteeId.asc && !this.sortBy.trusteeId.desc) {
      this.deactivate();
      this.sortBy.trusteeId.asc = true
    } else if (this.sortBy.trusteeId.asc) {
      this.sortBy.trusteeId.asc = false;
      this.sortBy.trusteeId.desc = true;
    } else if (this.sortBy.trusteeId.desc) {
      this.sortBy.trusteeId.asc = true;
      this.sortBy.trusteeId.desc = false;
    }

    this.sort();
  }

  getPatientTrustees() {
    this.http.get(this.url + "/PatientTrustees").subscribe(data => {
      this.patientTrustees = data;
      this.patientTrusteesFilteredAndSorted = [...this.patientTrustees];
      this.loaded = true;
    });
  }

  deletePatientTrustee(pd: any) {
    this.http.delete(this.url + "/PatientTrustees/" + pd.patientId + "/" + pd.trusteeId).subscribe(res => {
      this.getPatientTrustees();
    });
  }

}
