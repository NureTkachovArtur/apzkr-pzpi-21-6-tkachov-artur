import { Component } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PUTValues } from './put-medicine.model';
import { compDicts } from '../../../../helpers';

@Component({
  selector: 'app-put-medicine',
  templateUrl: './put-medicine.component.html',
  styleUrl: './put-medicine.component.css'
})
export class PutMedicineComponent {

  medicineId: number = 0;
  url: string = environment.apiBaseUrl;
  changes: PUTValues = new PUTValues();
  changesBefore: PUTValues = new PUTValues();
  values: any;
  loaded: boolean = false;
  patients: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(data => {
      this.medicineId = data['medicineId'];
      this.getMedicine();
    });
  }

  getMedicine() {
    this.http.get(this.url + "/Medicines/" + this.medicineId).subscribe((data: any) => {
      this.values = data;

      this.changes.description =    data.description;
      this.changes.dosage =         data.dosage;
      this.changes.expirationDate = data.expirationDate;
      this.changes.medicineId =     data.medicineId;
      this.changes.patientId =      data.patientId;
      this.changes.instruction =    data.instruction;
      this.changes.name =           data.name;
      this.changes.quantity =       data.quantity;

      this.changesBefore = { ...this.changes };

      this.getPatients();
    });
  }

  getPatients() {
    this.http.get(this.url + "/Patients").subscribe(data => {
      this.patients = data;
      this.loaded = true;
    });
  }

  saveChanges() {
    if (compDicts(this.changes, this.changesBefore)) {
      this.getBack();
      return;
    }

    this.http.put(this.url + "/Medicines/" + this.medicineId, this.changes).subscribe(res => {
      this.getBack();
    });
  }

  getBack() {
    this.router.navigate(['/admin-panel']);
  }

}
