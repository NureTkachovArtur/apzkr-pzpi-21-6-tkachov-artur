import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-medicines',
  templateUrl: './medicines.component.html',
  styleUrl: './medicines.component.css',
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        animate('0.3s', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class MedicinesComponent {

  search: any;
  url: string = environment.apiBaseUrl;
  medicines: any;
  medicinesFiltered: any;
  medicinesFilteredAndSorted: any;
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
      medicineName: {
        asc: false,
        desc: false
      },
      patientId: {
        asc: false,
        desc: false
      }
    };

    this.getMedicines();
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
      this.medicinesFilteredAndSorted.sort((a: any, b: any) => a.medicineId - b.medicineId);
    } else if (this.sortBy.id.desc) {
      this.medicinesFilteredAndSorted.sort((a: any, b: any) => b.medicineId - a.medicineId);
    } else if (this.sortBy.medicineName.asc) {
      this.medicinesFilteredAndSorted.sort((a: any, b: any) => a.name.localeCompare(b.name));
    } else if (this.sortBy.medicineName.desc) {
      this.medicinesFilteredAndSorted.sort((a: any, b: any) => b.name.localeCompare(a.name));
    } else if (this.sortBy.patientId.asc) {
      this.medicinesFilteredAndSorted.sort((a: any, b: any) => a.patientId - b.patientId);
    } else if (this.sortBy.patientId.desc) {
      this.medicinesFilteredAndSorted.sort((a: any, b: any) => b.patientId - a.patientId);
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

  sortByMedicineName() {
    if (!this.sortBy.medicineName.asc && !this.sortBy.medicineName.desc) {
      this.deactivate();
      this.sortBy.medicineName.asc = true
    } else if (this.sortBy.medicineName.asc) {
      this.sortBy.medicineName.asc = false;
      this.sortBy.medicineName.desc = true;
    } else if (this.sortBy.medicineName.desc) {
      this.sortBy.medicineName.asc = true;
      this.sortBy.medicineName.desc = false;
    }

    this.sort();
  }

  searchMedicine(event: string) {
    this.medicinesFiltered = this.medicines.filter((p: any) =>
      p.name.toLowerCase().includes(event.toLowerCase()));
    this.medicinesFilteredAndSorted = [...this.medicinesFiltered];
  }

  getMedicines() {
    this.http.get(this.url + "/Medicines").subscribe(data => {
      this.medicines = data;
      this.medicinesFilteredAndSorted = [...this.medicines];
      this.loaded = true;
    });
  }

  deleteMedicine(medicineId: number) {
    this.http.delete(this.url + "/Medicines/" + medicineId).subscribe(res => {
      this.getMedicines();
    });
  }

}
