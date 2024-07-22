import { Component } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PUTValues } from './put-smart-device-type.model';
import { compDicts } from '../../../../helpers';

@Component({
  selector: 'app-put-smart-device-type',
  templateUrl: './put-smart-device-type.component.html',
  styleUrl: './put-smart-device-type.component.css'
})
export class PutSmartDeviceTypeComponent {

  smartDeviceTypeId: number = 0;
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
      this.smartDeviceTypeId = data['sDeviceTypeId'];
      this.getSmartDeviceType();
    });
  }

  getSmartDeviceType() {
    this.http.get(this.url + "/SmartDeviceTypes/" + this.smartDeviceTypeId).subscribe((data: any) => {
      this.values = data;

      this.changes.smartDeviceTypeId = data.smartDeviceTypeId;
      this.changes.name = data.name;

      this.changesBefore = { ...this.changes };
      this.loaded = true;
    });
  }

  saveChanges() {
    if (compDicts(this.changes, this.changesBefore)) {
      this.getBack();
      return;
    }

    this.http.put(this.url + "/SmartDeviceTypes/" + this.smartDeviceTypeId, this.changes).subscribe(res => {
      this.getBack();
    });
  }

  getBack() {
    this.router.navigate(['/admin-panel']);
  }

}
