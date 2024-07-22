import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-schedule-events',
  templateUrl: './schedule-events.component.html',
  styleUrl: './schedule-events.component.css',
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        animate('0.3s', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class ScheduleEventComponent {

  url: string = environment.apiBaseUrl;
  sEvents: any;
  sEventsFiltered: any;
  sEventsFilteredAndSorted: any;
  loaded: boolean = false;
  sortBy: any = {};

  constructor(
    private http: HttpClient
  ) {
    this.sortBy = {
      scheduleEventId: {
        asc: true,
        desc: false
      },
      medicationScheduleId: {
        asc: false,
        desc: false
      }
    };

    this.getSEvents();
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
    if (this.sortBy.scheduleEventId.asc) {
      this.sEventsFilteredAndSorted.sort((a: any, b: any) => a.scheduleEventId - b.scheduleEventId);
    } else if (this.sortBy.scheduleEventId.desc) {
      this.sEventsFilteredAndSorted.sort((a: any, b: any) => b.scheduleEventId - a.scheduleEventId);
    } else if (this.sortBy.medicationScheduleId.asc) {
      this.sEventsFilteredAndSorted.sort((a: any, b: any) => a.medicationSchedule.medicationScheduleId - b.medicationSchedule.medicationScheduleId);
    } else if (this.sortBy.medicationScheduleId.desc) {
      this.sEventsFilteredAndSorted.sort((a: any, b: any) => b.medicationSchedule.medicationScheduleId - a.medicationSchedule.medicationScheduleId);
    }
  }

  sortById() {
    if (!this.sortBy.scheduleEventId.asc && !this.sortBy.scheduleEventId.desc) {
      this.deactivate();
      this.sortBy.scheduleEventId.asc = true
    } else if (this.sortBy.scheduleEventId.asc) {
      this.sortBy.scheduleEventId.asc = false;
      this.sortBy.scheduleEventId.desc = true;
    } else if (this.sortBy.scheduleEventId.desc) {
      this.sortBy.scheduleEventId.asc = true;
      this.sortBy.scheduleEventId.desc = false;
    }

    this.sort();
  }

  sortByMedicationScheduleId() {
    if (!this.sortBy.medicationScheduleId.asc && !this.sortBy.medicationScheduleId.desc) {
      this.deactivate();
      this.sortBy.medicationScheduleId.asc = true
    } else if (this.sortBy.medicationScheduleId.asc) {
      this.sortBy.medicationScheduleId.asc = false;
      this.sortBy.medicationScheduleId.desc = true;
    } else if (this.sortBy.medicationScheduleId.desc) {
      this.sortBy.medicationScheduleId.asc = true;
      this.sortBy.medicationScheduleId.desc = false;
    }

    this.sort();
  }

  getSEvents() {
    this.http.get(this.url + "/ScheduleEvents").subscribe(data => {
      this.sEvents = data;
      this.sEventsFilteredAndSorted = [...this.sEvents];
      this.loaded = true;
    });
  }

  deleteSEvent(mStatisticId: number) {
    this.http.delete(this.url + "/ScheduleEvents/" + mStatisticId).subscribe(res => {
      this.getSEvents();
    });
  }

}
