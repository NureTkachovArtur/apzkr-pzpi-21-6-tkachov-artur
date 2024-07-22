import { Component } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PUTValues } from './put-smart-device.model';
import { compDicts } from '../../../../helpers';

@Component({
  selector: 'app-put-smart-device',
  templateUrl: './put-smart-device.component.html',
  styleUrl: './put-smart-device.component.css'
})
export class PutSmartDeviceComponent {

  smartDeviceId: number = 0;
  url: string = environment.apiBaseUrl;
  changes: PUTValues = new PUTValues();
  changesBefore: PUTValues = new PUTValues();
  values: any;
  loaded: boolean = false;
  patients: any;
  types: any;
  users: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(data => {
      this.smartDeviceId = data['sDeviceId'];
      this.getSmartDevice();
    });
  }

  getSmartDevice() {
    this.http.get(this.url + "/SmartDevices/" + this.smartDeviceId).subscribe((data: any) => {
      this.values = data;

      this.changes.smartDeviceId = data.smartDeviceId;
      this.changes.smartDeviceTypeId = data.smartDeviceTypeId;
      this.changes.patientId = data.patientId;

      this.changesBefore = { ...this.changes };

      this.getPatients();
      this.getSmartDeviceTypes();
    });
  }

  getPatients() {
    this.http.get(this.url + "/Patients").subscribe(data => {
      this.patients = data;
    });
  }

  getSmartDeviceTypes() {
    this.http.get(this.url + "/SmartDeviceTypes/").subscribe(data => {
      this.types = data;
      this.loaded = true;
    });
  }

  saveChanges() {
    if (compDicts(this.changes, this.changesBefore)) {
      this.getBack();
      return;
    }

    this.http.put(this.url + "/SmartDevices/" + this.smartDeviceId, this.changes).subscribe(res => {
      this.getBack();
    });
  }

  getBack() {
    this.router.navigate(['/admin-panel']);
  }

}
