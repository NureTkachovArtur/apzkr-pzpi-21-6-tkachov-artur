import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { PUTValues } from '../../admin-panel/medicines/put-medicine/put-medicine.model';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { compDicts } from '../../../helpers';

@Component({
  selector: 'app-edit-medicine',
  templateUrl: './edit-medicine.component.html',
  styleUrl: './edit-medicine.component.css'
})
export class EditMedicineComponent {

  medicineId: number = 0;
  url: string = environment.apiBaseUrl;
  changes: PUTValues = new PUTValues();
  changesBefore: PUTValues = new PUTValues();
  values: any;
  loaded: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(data => {
      this.medicineId = data['id'];
      this.getMedicine();
    });
  }

  getMedicine() {
    this.http.get(this.url + "/Medicines/" + this.medicineId).subscribe((data: any) => {
      this.values = data;

      this.changes.description = data.description;
      this.changes.dosage = data.dosage;
      this.changes.expirationDate = data.expirationDate;
      this.changes.medicineId = data.medicineId;
      this.changes.patientId = data.patientId;
      this.changes.instruction = data.instruction;
      this.changes.name = data.name;
      this.changes.quantity = data.quantity;

      this.changesBefore = { ...this.changes };
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
    this.router.navigate(['/medicines', this.changes.patientId]);
  }

}
