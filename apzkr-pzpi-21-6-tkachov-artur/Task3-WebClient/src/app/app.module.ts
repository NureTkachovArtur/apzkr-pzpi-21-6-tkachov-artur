import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { HomeComponent } from './ui/home/home.component';
import { AuthInterceptor } from './interceptors/auth-interceptor.interceptor';
import { LoginComponent } from './ui/login/login.component';
import { RegisterComponent } from './ui/register/register.component';
import { RegisterPatientFormComponent } from './ui/register/register-patient-form/register-patient-form.component';
import { RegisterTrusteeFormComponent } from './ui/register/register-trustee-form/register-trustee-form.component';
import { RegisterDoctorFormComponent } from './ui/register/register-doctor-form/register-doctor-form.component';
import { HeaderComponent } from './reusable/header/header.component';
import { AdminPanelComponent } from './ui/admin-panel/admin-panel.component';
import { AdministratorsComponent } from './ui/admin-panel/administrators/administrators.component';
import { DoctorsComponent } from './ui/admin-panel/doctors/doctors.component';
import { MedicationSchedulesComponent } from './ui/admin-panel/medication-schedules/medication-schedules.component';
import { MedicinesComponent } from './ui/admin-panel/medicines/medicines.component';
import { MessagesComponent } from './ui/admin-panel/messages/messages.component';
import { MessageTypesComponent } from './ui/admin-panel/message-types/message-types.component';
import { PatientDoctorsComponent } from './ui/admin-panel/patient-doctors/patient-doctors.component';
import { PatientsComponent } from './ui/admin-panel/patients/patients.component';
import { PatientTrusteesComponent } from './ui/admin-panel/patient-trustees/patient-trustees.component';
import { SmartDevicesComponent } from './ui/admin-panel/smart-devices/smart-devices.component';
import { SmartDeviceTypesComponent } from './ui/admin-panel/smart-device-types/smart-device-types.component';
import { TrusteesComponent } from './ui/admin-panel/trustees/trustees.component';
import { CreateSmartDeviceTypeComponent } from './ui/admin-panel/smart-device-types/create-smart-device-type/create-smart-device-type.component';
import { PutSmartDeviceTypeComponent } from './ui/admin-panel/smart-device-types/put-smart-device-type/put-smart-device-type.component';
import { CreateSmartDeviceComponent } from './ui/admin-panel/smart-devices/create-smart-device/create-smart-device.component';
import { PutSmartDeviceComponent } from './ui/admin-panel/smart-devices/put-smart-device/put-smart-device.component';
import { CreatePatientTrusteeComponent } from './ui/admin-panel/patient-trustees/create-patient-trustee/create-patient-trustee.component';
import { PutPatientComponent } from './ui/admin-panel/patients/put-patient/put-patient.component';
import { CreatePatientComponent } from './ui/admin-panel/patients/create-patient/create-patient.component';
import { CreateTrusteeComponent } from './ui/admin-panel/trustees/create-trustee/create-trustee.component';
import { PutTrusteeComponent } from './ui/admin-panel/trustees/put-trustee/put-trustee.component';
import { CreatePatientDoctorComponent } from './ui/admin-panel/patient-doctors/create-patient-doctor/create-patient-doctor.component';
import { CreateMessageTypeComponent } from './ui/admin-panel/message-types/create-message-type/create-message-type.component';
import { PutMessageTypeComponent } from './ui/admin-panel/message-types/put-message-type/put-message-type.component';
import { CreateMessageComponent } from './ui/admin-panel/messages/create-message/create-message.component';
import { PutMessageComponent } from './ui/admin-panel/messages/put-message/put-message.component';
import { CreateMedicineComponent } from './ui/admin-panel/medicines/create-medicine/create-medicine.component';
import { PutMedicineComponent } from './ui/admin-panel/medicines/put-medicine/put-medicine.component';
import { CreateMedicationScheduleComponent } from './ui/admin-panel/medication-schedules/create-medication-schedule/create-medication-schedule.component';
import { PutMedicationScheduleComponent } from './ui/admin-panel/medication-schedules/put-medication-schedule/put-medication-schedule.component';
import { CreateDoctorComponent } from './ui/admin-panel/doctors/create-doctor/create-doctor.component';
import { PutDoctorComponent } from './ui/admin-panel/doctors/put-doctor/put-doctor.component';
import { CreateAdministratorComponent } from './ui/admin-panel/administrators/create-administrator/create-administrator.component';
import { PutAdministratorComponent } from './ui/admin-panel/administrators/put-administrator/put-administrator.component';
import { ProfileComponent } from './ui/profile/profile.component';
import { EditProfileComponent } from './ui/profile/edit-profile/edit-profile.component';
import { MedicinesViewComponent } from './ui/medicines-view/medicines-view.component';
import { EditMedicineComponent } from './ui/medicines-view/edit-medicine/edit-medicine.component';
import { AddMedicineComponent } from './ui/medicines-view/add-medicine/add-medicine.component';
import { MessagesViewComponent } from './ui/messages-view/messages-view.component';
import { ScheduleViewComponent } from './ui/schedule-view/schedule-view.component';
import { StatisticsViewComponent } from './ui/statistics-view/statistics-view.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { PatientsViewDoctorComponent } from './ui/patients-view-doctor/patients-view-doctor.component';
import { PatientsViewTrusteeComponent } from './ui/patients-view-trustee/patients-view-trustee.component';
import { ScheduleEventComponent } from './ui/admin-panel/schedule-events/schedule-events.component';
import { CreateScheduleEventComponent } from './ui/admin-panel/schedule-events/create-schedule-event/create-schedule-event.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    RegisterPatientFormComponent,
    RegisterTrusteeFormComponent,
    RegisterDoctorFormComponent,
    HeaderComponent,
    AdminPanelComponent,
    AdministratorsComponent,
    DoctorsComponent,
    MedicationSchedulesComponent,
    ScheduleEventComponent,
    MedicinesComponent,
    MessagesComponent,
    MessageTypesComponent,
    PatientDoctorsComponent,
    PatientsComponent,
    PatientTrusteesComponent,
    SmartDevicesComponent,
    SmartDeviceTypesComponent,
    TrusteesComponent,
    CreateSmartDeviceTypeComponent,
    PutSmartDeviceTypeComponent,
    CreateSmartDeviceComponent,
    PutSmartDeviceComponent,
    CreatePatientTrusteeComponent,
    PutPatientComponent,
    CreatePatientComponent,
    CreateTrusteeComponent,
    PutTrusteeComponent,
    CreatePatientDoctorComponent,
    CreateMessageTypeComponent,
    PutMessageTypeComponent,
    CreateMessageComponent,
    PutMessageComponent,
    CreateMedicineComponent,
    PutMedicineComponent,
    CreateScheduleEventComponent,
    CreateMedicationScheduleComponent,
    PutMedicationScheduleComponent,
    CreateDoctorComponent,
    PutDoctorComponent,
    CreateAdministratorComponent,
    PutAdministratorComponent,
    ProfileComponent,
    EditProfileComponent,
    MedicinesViewComponent,
    EditMedicineComponent,
    AddMedicineComponent,
    MessagesViewComponent,
    ScheduleViewComponent,
    StatisticsViewComponent,
    PatientsViewDoctorComponent,
    PatientsViewTrusteeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    FullCalendarModule,
    ToastrModule.forRoot({
      maxOpened: 3
    })
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
