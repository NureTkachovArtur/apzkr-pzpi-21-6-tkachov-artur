import { Component } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PUTValues } from './put-medication-schedule.model';
import { compDicts } from '../../../../helpers';

@Component({
  selector: 'app-put-medication-schedule',
  templateUrl: './put-medication-schedule.component.html',
  styleUrl: './put-medication-schedule.component.css'
})
export class PutMedicationScheduleComponent {

  medicationScheduleId: number = 0;
  url: string = environment.apiBaseUrl;
  changes: PUTValues = new PUTValues();
  changesBefore: PUTValues = new PUTValues();
  values: any;
  loaded: boolean = false;
  patients: any;
  medicines: any;
  smartDevices: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(data => {
      this.medicationScheduleId = data['mScheduleId'];
      this.getMedicationSchedule();
    });
  }

  getMedicationSchedule() {
    this.http.get(this.url + "/MedicationSchedules/" + this.medicationScheduleId).subscribe((data: any) => {
      this.values = data;

      this.changes.dosesPerDay               = data.dosesPerDay;
      this.changes.medicationIntervalMinutes = data.medicationIntervalMinutes;
      this.changes.medicationScheduleId      = data.medicationScheduleId;
      this.changes.medicationStartDate       = data.medicationStartDate;
      this.changes.medicineId                = data.medicineId;
      this.changes.patientId                 = data.patientId;
      this.changes.smartDeviceId             = data.smartDeviceId;
      this.changes.daysLeft                  = data.daysLeft;
      this.changes.everyNDay                 = data.everyNDay;

      this.changesBefore = { ...this.changes };

      this.getPatients();
      this.getMedicines();
      this.getSmartDevices();
    });
  }

  getPatients() {
    this.http.get(this.url + "/Patients").subscribe(data => {
      this.patients = data;
    });
  }

  setPatient(event: any) {
    this.getMedicines();
    this.getSmartDevices();
  }

  getMedicines() {
    this.http.get(this.url + "/Patients/medicines/" + this.changesBefore.patientId).subscribe(data => {
      this.medicines = data;
    });
  }

  getSmartDevices() {
    this.http.get(this.url + "/Patients/devices/" + this.changesBefore.patientId).subscribe(data => {
      this.smartDevices = data;
      this.loaded = true;
    });
  }

  saveChanges() {
    if (compDicts(this.changes, this.changesBefore)) {
      this.getBack();
      return;
    }

    this.http.put(this.url + "/MedicationSchedules/" + this.medicationScheduleId, this.changes).subscribe(res => {
      this.getBack();
    });
  }

  getBack() {
    this.router.navigate(['/admin-panel']);
  }

}
