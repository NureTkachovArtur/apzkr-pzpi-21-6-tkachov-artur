import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css'
})
export class AdminPanelComponent {

  activated: any = {}

  constructor() {
    this.activated = {
      administrators: true,
      doctors: false,
      medicationSchedules: false,
      scheduleEvents: false,
      medicines: false,
      messages: false,
      messageTypes: false,
      patientDoctors: false,
      patients: false,
      patientTrustees: false,
      smartDevices: false,
      smartDeviceTypes: false,
      trustees: false
    }
  }

  deactivate() {
    for (let key in this.activated) {
      if (this.activated[key]) {
        this.activated[key] = false;
        return;
      }
    }
  }

  activateAdministrators() {
    if (this.activated.administrators) {
      return;
    }

    this.deactivate();
    this.activated.administrators = true;
  }

  activateDoctors() {
    if (this.activated.doctors) {
      return;
    }

    this.deactivate();
    this.activated.doctors = true;
  }

  activateMedicationSchedules() {
    if (this.activated.medicationSchedules) {
      return;
    }

    this.deactivate();
    this.activated.medicationSchedules = true;
  }

  activateScheduleEvents() {
    if (this.activated.scheduleEvents) {
      return;
    }

    this.deactivate();
    this.activated.scheduleEvents = true;
  }

  activateMedicines() {
    if (this.activated.medicines) {
      return;
    }

    this.deactivate();
    this.activated.medicines = true;
  }

  activateMessages() {
    if (this.activated.messages) {
      return;
    }

    this.deactivate();
    this.activated.messages = true;
  }

  activateMessageTypes() {
    if (this.activated.messageTypes) {
      return;
    }

    this.deactivate();
    this.activated.messageTypes = true;
  }

  activatePatientDoctors() {
    if (this.activated.patientDoctors) {
      return;
    }

    this.deactivate();
    this.activated.patientDoctors = true;
  }

  activatePatients() {
    if (this.activated.patients) {
      return;
    }

    this.deactivate();
    this.activated.patients = true;
  }

  activatePatientTrustees() {
    if (this.activated.patientTrustees) {
      return;
    }

    this.deactivate();
    this.activated.patientTrustees = true;
  }

  activateSmartDevices() {
    if (this.activated.smartDevices) {
      return;
    }

    this.deactivate();
    this.activated.smartDevices = true;
  }

  activateSmartDeviceTypes() {
    if (this.activated.smartDeviceTypes) {
      return;
    }

    this.deactivate();
    this.activated.smartDeviceTypes = true;
  }

  activateTrustees() {
    if (this.activated.trustees) {
      return;
    }

    this.deactivate();
    this.activated.trustees = true;
  }

}
