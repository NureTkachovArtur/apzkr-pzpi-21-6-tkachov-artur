import { Component, EventEmitter, Input, Output } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { PUTValues as PUTValuesPatient } from '.././edit-profile/edit-profile.model';
import { PUTValues as PUTValuesDoctor } from '../../admin-panel/doctors/put-doctor/put-doctor.model';
import { PUTValues as PUTValuesTrustee } from '../../admin-panel/trustees/put-trustee/put-trustee.model';
import { compDicts } from '../../../helpers';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent {

  @Input() user: any;
  @Output() onSaveEvent = new EventEmitter<any>();
  @Output() onCancelEvent = new EventEmitter<any>();
  url: string = environment.apiBaseUrl;
  changes: any;
  changesBefore: any;
  loaded: boolean = false;

  constructor(
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(data => {
      this.setValues();
      this.changesBefore = { ...this.changes };
    });
  }

  setValues() {
    if (this.user.role == 'Patient') {
      this.setValuesPatient();
    } else if (this.user.role == 'Doctor') {
      this.setValuesDoctor();
    } else if (this.user.role == 'Trustee') {
      this.setValuesTrustee();
    }
    this.loaded = true;
  }

  setValuesPatient() {
    this.changes = new PUTValuesPatient();
    this.changesBefore = new PUTValuesPatient();

    this.changes.uid = this.user.applicationUser.id;
    this.changes.userName = this.user.applicationUser.userName;
    this.changes.email = this.user.applicationUser.email;
    this.changes.lastName = this.user.applicationUser.lastName;
    this.changes.middleName = this.user.applicationUser.middleName;
    this.changes.firstName = this.user.applicationUser.firstName;
    this.changes.phoneNumber = this.user.applicationUser.phoneNumber;
    this.changes.address = this.user.address;
    this.changes.age = this.user.age;
    this.changes.gender = this.user.gender;
  }

  setValuesDoctor() {
    this.changes = new PUTValuesDoctor();
    this.changesBefore = new PUTValuesDoctor();

    this.changes.doctorId = this.user.doctorId;
    this.changes.userName = this.user.applicationUser.userName;
    this.changes.email = this.user.applicationUser.email;
    this.changes.lastName = this.user.applicationUser.lastName;
    this.changes.middleName = this.user.applicationUser.middleName;
    this.changes.firstName = this.user.applicationUser.firstName;
    this.changes.phoneNumber = this.user.applicationUser.phoneNumber;
  }

  setValuesTrustee() {
    this.changes = new PUTValuesTrustee();
    this.changesBefore = new PUTValuesTrustee();

    this.changes.trusteeId = this.user.trusteeId;
    this.changes.userName = this.user.applicationUser.userName;
    this.changes.email = this.user.applicationUser.email;
    this.changes.lastName = this.user.applicationUser.lastName;
    this.changes.middleName = this.user.applicationUser.middleName;
    this.changes.firstName = this.user.applicationUser.firstName;
    this.changes.phoneNumber = this.user.applicationUser.phoneNumber;
  }

  saveChanges() {
    if (compDicts(this.changesBefore, this.changes)) {
      this.cancelChanges();
      return;
    }

    this.onSaveEvent.emit(this.changes);
  }

  cancelChanges() {
    this.onCancelEvent.emit();
  }

}
