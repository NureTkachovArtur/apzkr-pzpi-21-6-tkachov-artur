import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, ViewChild, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CalendarOptions, DateSelectArg, EventApi, EventClickArg, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import { forkJoin, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { changeDayInDate, currentDate } from '../../helpers';
import { AuthService } from '../../services/auth/auth.service';
import { POSTValues } from '../admin-panel/medication-schedules/create-medication-schedule/create-medication-schedule.model';
import { ToastrService } from 'ngx-toastr';
import { PUTValues } from '../admin-panel/medication-schedules/put-medication-schedule/put-medication-schedule.model';

@Component({
  selector: 'app-schedule-view',
  templateUrl: './schedule-view.component.html',
  styleUrl: './schedule-view.component.css',
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        animate('0.3s', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class ScheduleViewComponent {

  // CALENDAR SETTINGS
  INITIAL_EVENTS: EventInput[] = [];
  calendarOptions = signal<CalendarOptions>({
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,listDay'
    },
    initialView: 'dayGridMonth',
    initialEvents: this.INITIAL_EVENTS,
    weekends: true,
    editable: false,
    selectable: true,
    selectMirror: false,
    dayMaxEvents: true,
    firstDay: 1,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    eventDisplay: 'block',
    nextDayThreshold: '09:00:00'
  });
  currentEvents = signal<EventApi[]>([]);

  // DATA SETTINGS
  url: string = environment.apiBaseUrl;
  _events: any = [];
  patientId: any;
  patient: any;
  userRole: any;
  loaded: boolean = false;

  // MODAL DIALOG SETTINGS
  modalDialogMode: string = '';
  values: any = new POSTValues();
  medicines: any;
  smartDevices: any;
  @ViewChild('hiddenButton') hiddenButton!: ElementRef<HTMLElement>;
  @ViewChild('closePUT') closePUT!: ElementRef<HTMLElement>;
  @ViewChild('buttonAdd') buttonAdd!: ElementRef<HTMLElement>;
  @ViewChild('closePOSTbutton') closePOSTButton!: ElementRef<HTMLElement>;
  changes: PUTValues = new PUTValues();
  changesBefore: PUTValues = new PUTValues();
  selectedEventId: number = 0;
  selectedToday: boolean = true;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private authService: AuthService,
    private changeDetector: ChangeDetectorRef,
    private toastr: ToastrService
  ) {
    this.userRole = this.authService.getUserInfo()!.role;
    this.route.params.subscribe(data => {
      this.patientId = data['id'];
      this.getScheduleEvents();
      this.getMedicines();
      this.getSmartDevices();

      if (this.userRole != 'Patient') {
        this.getPatient();
      }
    });
  }

  getMedicines() {
    this.http.get(this.url + "/Patients/medicines/" + this.patientId).subscribe(data => {
      this.medicines = data;
    });
  }

  getSmartDevices() {
    this.http.get(this.url + "/Patients/devices/" + this.patientId).subscribe(data => {
      this.smartDevices = data;
      if (this.modalDialogMode == 'put') {
        this.closePUTModal();
      }
    });
  }

  closePUTModal() {
    const el: HTMLElement = this.hiddenButton.nativeElement;
    el.click();
  }

  closePOSTModal() {
    const el: HTMLElement = this.closePOSTButton.nativeElement;
    el.click();
  }

  buttonAddPressed() {
    this.values.medicationStartDate = currentDate();
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    if (this.userRole == 'Trustee') {
      return;
    }

    var selectedDay = +selectInfo.startStr.split('-').at(2)!;
    var currentDay = new Date().getDate();
    if (currentDay > selectedDay) {
      return;
    }

    this.modalDialogMode = 'post';
    var date = changeDayInDate(this.values.medicationStartDate, selectedDay);
    const el: HTMLElement = this.buttonAdd.nativeElement;
    el.click();
    this.values.medicationStartDate = date;
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (this.userRole == 'Trustee') {
      return;
    }

    this.selectedEventId = clickInfo.event._def.extendedProps['eventId'];
    var selectedEvent = null;
    for (var _event of this._events) {
      if (_event.scheduleEventId == this.selectedEventId) {
        selectedEvent = _event;
        break;
      }
    }

    var eventsOfSelectedDay = [];
    var selectedDay = new Date(_event.medicationTime).getDate();
    for (var sdf of this._events) {
      if (sdf.MedicationTime == selectedDay && !sdf.activated) {
        eventsOfSelectedDay.push(sdf);
      }
    }

    var currentDate = new Date();
    var currentDay = currentDate.getDate();
    if (currentDay != selectedDay) {
      this.selectedToday = false;
    } else {
      this.selectedToday = true;
    }

    if (selectedEvent.pastNeededTime || selectedEvent.activated) {
      this.selectedToday = false;
    }

    if (this.selectedToday) {
      var count = 0;
      for (var _event of eventsOfSelectedDay) {
        if (!_event.activated && !_event.missedDose) {
          if (_event.scheduleEventId == this.selectedEventId && count == 0) {
            this.selectedToday = true;
            break;
          } else {
            this.selectedToday = false;
          }
          count += 1;
        }
      }
    }

    this.modalDialogMode = 'put';
    const scheduleId = clickInfo.event._def.extendedProps['scheduleId'];
    this.setValues(scheduleId);
    this.getMedicines();
    this.getSmartDevices();
  }

  setValues(scheduleId: number) {
    var correctDate: any = undefined;
    for (var _event of this._events) {
      if (_event.scheduleEventId == this.selectedEventId) {
        correctDate = _event.medicationTime;
        break;
      }
    }

    this.http.get(this.url + "/MedicationSchedules/" + scheduleId).subscribe((data: any) => {
      this.changes.dosesPerDay = data.dosesPerDay;
      this.changes.medicationIntervalMinutes = data.medicationIntervalMinutes;
      this.changes.medicationScheduleId = data.medicationScheduleId;
      this.changes.medicationStartDate = correctDate;
      this.changes.medicineId = data.medicineId;
      this.changes.smartDeviceId = data.smartDeviceId;
      this.changes.daysLeft = data.daysLeft;
      this.changes.everyNDay = data.everyNDay;

      this.changesBefore = { ...this.changes };
    });
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges();
  }

  getScheduleEvents() {
    this.http.get(this.url + "/ScheduleEvents/patient/" + this.patientId).subscribe((data: any) => {
      this._events = data;

      if (data.length != 0) {
        this.getMedicineData();
        return;
      }

      this.loaded = true;
    });
  }

  getMedicineData() {
    var medicineToGet: any = {};
    for (var sc of this._events) {
      medicineToGet[sc.medicationSchedule.medicineId] = null;
    }

    var observables = [];
    for (var medicineId in medicineToGet) {
      observables.push(
        this.http.get(this.url + '/Medicines/' + medicineId).pipe(
          map(data => ({ medicineId, data }))
        )
      );
    }

    forkJoin(observables).subscribe((results: any) => {
      for (let result of results) {
        medicineToGet[result.data.medicineId] = result.data;
      }
      for (var sc of this._events) {
        sc.medicine = medicineToGet[sc.medicationSchedule.medicineId];
      }

      this.addCalendarEvents();
    });
  }

  addCalendarEvents() {
    for (var sc of this._events) {
      var color = undefined;
      if (sc.activated) {
        color = 'green';
      } else if (sc.pastNeededTime) {
        color = 'red';
      }

      this.INITIAL_EVENTS.push({
        id: sc.scheduleEventId,
        scheduleId: sc.medicationSchedule.medicationScheduleId,
        title: sc.medicine.name,
        start: sc.medicationTime,
        eventId: sc.scheduleEventId,
        color: color
      })
    }

    this.loaded = true;
  }

  getPatient() {
    this.http.get(this.url + '/Patients/' + this.patientId).subscribe(data => {
      this.patient = data;
    });
  }

  saveSchedulePOST() {
    this.values.patientId = +this.patientId;
    this.values.medicineId = +this.values.medicineId;
    this.values.smartDeviceId = +this.values.smartDeviceId;

    if (!this.values.patientId ||
      !this.values.medicineId ||
      !this.values.smartDeviceId ||
      !this.values.medicationStartDate ||
      !this.values.dosesPerDay ||
      !this.values.daysLeft ||
      !this.values.everyNDay) {
      this.toastr.error("Не всі поля заповнені", "Помилка");
      return;
    }

    this.http.get(this.url + '/Medicines/' + this.values.medicineId).subscribe((data : any) => {
      const quantityNeeded = this.values.dosesPerDay * this.values.daysLeft * data.dosage;
      if (quantityNeeded > data.quantity) {
        this.toastr.show("Кількість ліків недостатнья для цього розкладу", "Мало ліків");
        return;
      } else {
        this.http.post(this.url + "/MedicationSchedules", this.values).subscribe(
          (response: any) => {
            if (!response.ok) {
              this.toastr.error(response.message, "Помилка");
            } else {
              this.resetEvents();
              this.closePOSTModal();
            }
          },
          error => {
            this.toastr.error("Проблема сервера, спробуйте пізніше", "Помилка");
          }
        );
      }
    });
  }

  resetEvents() {
    this.INITIAL_EVENTS = [];
    this.getScheduleEvents();
  }

  deleteSchedule(scheduleId: number) {
    this.http.delete(this.url + "/MedicationSchedules/" + scheduleId).subscribe(res => {
      for (let i = 0; i < this._events.length; i++) {
        if (this._events[i].medicationSchedule.medicationScheduleId == scheduleId) {
          this._events.splice(i, 1);
        }
      }
    });
  }

  submitDose() {
    if (!this.selectedToday) {
      return;
    }
    const minutesBeforeToDose = 15;

    var selectedEvent = null;
    for (var _event of this._events) {
      if (_event.scheduleEventId == this.selectedEventId) {
        selectedEvent = _event;
        break;
      }
    }

    var currentDate = new Date();
    var currentTimeInMinutes = (currentDate.getHours() * 60) + currentDate.getMinutes();
    var needeedDate = new Date(selectedEvent.medicationTime);
    var needeedTimeInMinutes = (needeedDate.getHours() * 60) + needeedDate.getMinutes();
    if (needeedTimeInMinutes - currentTimeInMinutes > minutesBeforeToDose) {
      this.toastr.show('Ще надто рано для прийняття ліків', 'Не поспішайте');
      return;
    }

    this.http.put(this.url + '/ScheduleEvents/activate/' + this.selectedEventId, {}).subscribe((response : any) => {
      if (!response.ok) {
        this.toastr.error(response.message, "Помилка");
      } else {
        this.toastr.success('Дані було збережено', 'Успіх');
        this.resetEvents();
      }
    });

    this.selectedEventId = 0;
  }

}
