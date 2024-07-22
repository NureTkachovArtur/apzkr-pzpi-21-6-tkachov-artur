import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-smart-devices',
  templateUrl: './smart-devices.component.html',
  styleUrl: './smart-devices.component.css',
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        animate('0.3s', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class SmartDevicesComponent {

  url: string = environment.apiBaseUrl;
  smartDevices: any;
  smartDevicesFiltered: any;
  smartDevicesFilteredAndSorted: any;
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
      smartDeviceTypeId: {
        asc: false,
        desc: false
      },
      patientId: {
        asc: false,
        desc: false
      }
    };

    this.getSmartDevices();
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
      this.smartDevicesFilteredAndSorted.sort((a: any, b: any) => a.smartDeviceId - b.smartDeviceId);
    } else if (this.sortBy.id.desc) {
      this.smartDevicesFilteredAndSorted.sort((a: any, b: any) => b.smartDeviceId - a.smartDeviceId);
    } else if (this.sortBy.smartDeviceTypeId.asc) {
      this.smartDevicesFilteredAndSorted.sort((a: any, b: any) => a.smartDeviceTypeId - b.smartDeviceTypeId);
    } else if (this.sortBy.smartDeviceTypeId.desc) {
      this.smartDevicesFilteredAndSorted.sort((a: any, b: any) => b.smartDeviceTypeId - a.smartDeviceTypeId);
    } else if (this.sortBy.patientId.asc) {
      this.smartDevicesFilteredAndSorted.sort((a: any, b: any) => a.patientId - b.patientId);
    } else if (this.sortBy.patientId.desc) {
      this.smartDevicesFilteredAndSorted.sort((a: any, b: any) => b.patientId - a.patientId);
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

  sortBySmartDeviceTypeId() {
    if (!this.sortBy.smartDeviceTypeId.asc && !this.sortBy.smartDeviceTypeId.desc) {
      this.deactivate();
      this.sortBy.smartDeviceTypeId.asc = true
    } else if (this.sortBy.smartDeviceTypeId.asc) {
      this.sortBy.smartDeviceTypeId.asc = false;
      this.sortBy.smartDeviceTypeId.desc = true;
    } else if (this.sortBy.smartDeviceTypeId.desc) {
      this.sortBy.smartDeviceTypeId.asc = true;
      this.sortBy.smartDeviceTypeId.desc = false;
    }

    this.sort();
  }

  getSmartDevices() {
    this.http.get(this.url + "/SmartDevices").subscribe(data => {
      this.smartDevices = data;
      this.smartDevicesFilteredAndSorted = [...this.smartDevices];
      this.loaded = true;
    });
  }

  deleteSmartDevice(smartDeviceId: number) {
    this.http.delete(this.url + "/SmartDevices/" + smartDeviceId).subscribe(res => {
      this.getSmartDevices();
    });
  }

}
