import { Component } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PUTValues } from './put-message-type.model';
import { compDicts } from '../../../../helpers';

@Component({
  selector: 'app-put-message-type',
  templateUrl: './put-message-type.component.html',
  styleUrl: './put-message-type.component.css'
})
export class PutMessageTypeComponent {

  messageTypeId: number = 0;
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
      this.messageTypeId = data['mTypeId'];
      this.getMessageType();
    });
  }

  getMessageType() {
    this.http.get(this.url + "/MessageTypes/" + this.messageTypeId).subscribe((data: any) => {
      this.values = data;

      this.changes.messageTypeId = data.messageTypeId;
      this.changes.name          = data.name;

      this.changesBefore = { ...this.changes };
      this.loaded = true;
    });
  }

  saveChanges() {
    if (compDicts(this.changes, this.changesBefore)) {
      this.getBack();
      return;
    }

    this.http.put(this.url + "/MessageTypes/" + this.messageTypeId, this.changes).subscribe(res => {
      this.getBack();
    });
  }

  getBack() {
    this.router.navigate(['/admin-panel']);
  }

}
