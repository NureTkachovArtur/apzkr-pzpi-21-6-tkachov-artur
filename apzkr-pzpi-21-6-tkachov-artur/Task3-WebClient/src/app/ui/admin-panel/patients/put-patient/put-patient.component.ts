import { Component } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PUTValues } from './put-patient.model';
import { compDicts } from '../../../../helpers';

@Component({
  selector: 'app-put-patient',
  templateUrl: './put-patient.component.html',
  styleUrl: './put-patient.component.css'
})
export class PutPatientComponent {

  id: number = 0;
  url: string = environment.apiBaseUrl;
  changes: PUTValues = new PUTValues();
  changesBefore: PUTValues = new PUTValues();
  entity: any;
  loaded: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(data => {
      this.id = data['patientId'];
      this.getPatient();
      this.changesBefore = { ...this.changes };
    });
  }

  getPatient() {
    this.http.get(this.url + "/Patients/" + this.id).subscribe((data: any) => {
      this.entity = data;

      this.changes.patientId =    data.patientId;
      this.changes.userName =     data.applicationUser.userName;
      this.changes.email =        data.applicationUser.email;
      this.changes.lastName =     data.applicationUser.lastName;
      this.changes.middleName =   data.applicationUser.middleName;
      this.changes.firstName =    data.applicationUser.firstName;
      this.changes.phoneNumber =  data.applicationUser.phoneNumber;
      this.changes.address =      data.address;
      this.changes.age =          data.age;
      this.changes.gender =       data.gender;

      this.loaded = true;
    });
  }

  saveChanges() {
    if (compDicts(this.changes, this.changesBefore)) {
      this.getBack();
      return;
    }

    this.http.put(this.url + "/Patients/" + this.id, this.changes).subscribe(res => {
      this.getBack();
    });
  }

  getBack() {
    this.router.navigate(['/admin-panel']);
  }

}
