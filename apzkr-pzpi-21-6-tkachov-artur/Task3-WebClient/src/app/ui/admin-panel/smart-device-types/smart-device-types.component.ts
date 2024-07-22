import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-smart-device-types',
  templateUrl: './smart-device-types.component.html',
  styleUrl: './smart-device-types.component.css',
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        animate('0.3s', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class SmartDeviceTypesComponent {

  url: string = environment.apiBaseUrl;
  smartDeviceTypes: any;
  smartDeviceTypesFiltered: any;
  smartDeviceTypesFilteredAndSorted: any;
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
      name: {
        asc: false,
        desc: false
      }
    };

    this.getSmartDeviceTypes();
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
      this.smartDeviceTypesFilteredAndSorted.sort((a: any, b: any) => a.smartDeviceTypeId - b.smartDeviceTypeId);
    } else if (this.sortBy.id.desc) {
      this.smartDeviceTypesFilteredAndSorted.sort((a: any, b: any) => b.smartDeviceTypeId - a.smartDeviceTypeId);
    } else if (this.sortBy.name.asc) {
      this.smartDeviceTypesFilteredAndSorted.sort((a: any, b: any) => a.name.localeCompare(b.name));
    } else if (this.sortBy.name.desc) {
      this.smartDeviceTypesFilteredAndSorted.sort((a: any, b: any) => b.name.localeCompare(a.name));
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

  sortByName() {
    if (!this.sortBy.name.asc && !this.sortBy.name.desc) {
      this.deactivate();
      this.sortBy.name.asc = true
    } else if (this.sortBy.name.asc) {
      this.sortBy.name.asc = false;
      this.sortBy.name.desc = true;
    } else if (this.sortBy.name.desc) {
      this.sortBy.name.asc = true;
      this.sortBy.name.desc = false;
    }

    this.sort();
  }

  getSmartDeviceTypes() {
    this.http.get(this.url + "/SmartDeviceTypes").subscribe(data => {
      this.smartDeviceTypes = data;
      this.smartDeviceTypesFilteredAndSorted = [...this.smartDeviceTypes];
      this.loaded = true;
    });
  }

  deleteSmartDeviceType(smartDeviceTypeId: number) {
    this.http.delete(this.url + "/SmartDeviceTypes/" + smartDeviceTypeId).subscribe(res => {
      this.getSmartDeviceTypes();
    });
  }

}
