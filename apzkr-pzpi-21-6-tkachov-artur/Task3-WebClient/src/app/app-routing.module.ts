import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './ui/home/home.component';
import { LoginComponent } from './ui/login/login.component';
import { RegisterComponent } from './ui/register/register.component';
import { AdminPanelComponent } from './ui/admin-panel/admin-panel.component';
import { CreatePatientComponent } from './ui/admin-panel/patients/create-patient/create-patient.component';
import { PutPatientComponent } from './ui/admin-panel/patients/put-patient/put-patient.component';
import { CreateMessageComponent } from './ui/admin-panel/messages/create-message/create-message.component';
import { PutMessageComponent } from './ui/admin-panel/messages/put-message/put-message.component';
import { CreateSmartDeviceTypeComponent } from './ui/admin-panel/smart-device-types/create-smart-device-type/create-smart-device-type.component';
import { PutSmartDeviceTypeComponent } from './ui/admin-panel/smart-device-types/put-smart-device-type/put-smart-device-type.component';
import { CreateSmartDeviceComponent } from './ui/admin-panel/smart-devices/create-smart-device/create-smart-device.component';
import { PutSmartDeviceComponent } from './ui/admin-panel/smart-devices/put-smart-device/put-smart-device.component';
import { CreateDoctorComponent } from './ui/admin-panel/doctors/create-doctor/create-doctor.component';
import { PutDoctorComponent } from './ui/admin-panel/doctors/put-doctor/put-doctor.component';
import { CreateTrusteeComponent } from './ui/admin-panel/trustees/create-trustee/create-trustee.component';
import { PutTrusteeComponent } from './ui/admin-panel/trustees/put-trustee/put-trustee.component';
import { CreateAdministratorComponent } from './ui/admin-panel/administrators/create-administrator/create-administrator.component';
import { PutAdministratorComponent } from './ui/admin-panel/administrators/put-administrator/put-administrator.component';
import { CreateMedicationScheduleComponent } from './ui/admin-panel/medication-schedules/create-medication-schedule/create-medication-schedule.component';
import { PutMedicationScheduleComponent } from './ui/admin-panel/medication-schedules/put-medication-schedule/put-medication-schedule.component';
import { CreateScheduleEventComponent } from './ui/admin-panel/schedule-events/create-schedule-event/create-schedule-event.component';
import { CreateMedicineComponent } from './ui/admin-panel/medicines/create-medicine/create-medicine.component';
import { PutMedicineComponent } from './ui/admin-panel/medicines/put-medicine/put-medicine.component';
import { CreateMessageTypeComponent } from './ui/admin-panel/message-types/create-message-type/create-message-type.component';
import { PutMessageTypeComponent } from './ui/admin-panel/message-types/put-message-type/put-message-type.component';
import { CreatePatientDoctorComponent } from './ui/admin-panel/patient-doctors/create-patient-doctor/create-patient-doctor.component';
import { CreatePatientTrusteeComponent } from './ui/admin-panel/patient-trustees/create-patient-trustee/create-patient-trustee.component';
import { isAdminGuard } from './guards/is-admin.guard';
import { ProfileComponent } from './ui/profile/profile.component';
import { authorizedGuard } from './guards/authorized.guard';
import { notAuthorizedGuard } from './guards/not-authorized.guard';
import { MedicinesViewComponent } from './ui/medicines-view/medicines-view.component';
import { AddMedicineComponent } from './ui/medicines-view/add-medicine/add-medicine.component';
import { EditMedicineComponent } from './ui/medicines-view/edit-medicine/edit-medicine.component';
import { MessagesViewComponent } from './ui/messages-view/messages-view.component';
import { ScheduleViewComponent } from './ui/schedule-view/schedule-view.component';
import { StatisticsViewComponent } from './ui/statistics-view/statistics-view.component';
import { PatientsViewDoctorComponent } from './ui/patients-view-doctor/patients-view-doctor.component';
import { PatientsViewTrusteeComponent } from './ui/patients-view-trustee/patients-view-trustee.component';

const routes: Routes = [
  { path: "home", component: HomeComponent },
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "login", component: LoginComponent, canActivate: [notAuthorizedGuard] },
  { path: "register", component: RegisterComponent, canActivate: [notAuthorizedGuard] },

  { path: "admin-panel", component: AdminPanelComponent, canActivate: [isAdminGuard] },
  { path: "create-patient", component: CreatePatientComponent, canActivate: [isAdminGuard] },
  { path: "put-patient/:patientId", component: PutPatientComponent, canActivate: [isAdminGuard] },
  { path: "create-message", component: CreateMessageComponent, canActivate: [isAdminGuard] },
  { path: "put-message/:messageId", component: PutMessageComponent, canActivate: [isAdminGuard] },
  { path: "create-message-type", component: CreateMessageTypeComponent, canActivate: [isAdminGuard] },
  { path: "put-message-type/:mTypeId", component: PutMessageTypeComponent, canActivate: [isAdminGuard] },
  { path: "create-smart-device-type", component: CreateSmartDeviceTypeComponent, canActivate: [isAdminGuard] },
  { path: "put-smart-device-type/:sDeviceTypeId", component: PutSmartDeviceTypeComponent, canActivate: [isAdminGuard] },
  { path: "create-smart-device", component: CreateSmartDeviceComponent, canActivate: [isAdminGuard] },
  { path: "put-smart-device/:sDeviceId", component: PutSmartDeviceComponent, canActivate: [isAdminGuard] },
  { path: "create-doctor", component: CreateDoctorComponent, canActivate: [isAdminGuard] },
  { path: "put-doctor/:doctorId", component: PutDoctorComponent, canActivate: [isAdminGuard] },
  { path: "create-trustee", component: CreateTrusteeComponent, canActivate: [isAdminGuard] },
  { path: "put-trustee/:trusteeId", component: PutTrusteeComponent, canActivate: [isAdminGuard] },
  { path: "create-administrator", component: CreateAdministratorComponent, canActivate: [isAdminGuard] },
  { path: "put-administrator/:administratorId", component: PutAdministratorComponent, canActivate: [isAdminGuard] },
  { path: "create-mschedule", component: CreateMedicationScheduleComponent, canActivate: [isAdminGuard] },
  { path: "put-mschedule/:mScheduleId", component: PutMedicationScheduleComponent, canActivate: [isAdminGuard] },
  { path: "create-event", component: CreateScheduleEventComponent, canActivate: [isAdminGuard] },
  { path: "create-medicine", component: CreateMedicineComponent, canActivate: [isAdminGuard] },
  { path: "put-medicine/:medicineId", component: PutMedicineComponent, canActivate: [isAdminGuard] },
  { path: "create-patientdoctor", component: CreatePatientDoctorComponent, canActivate: [isAdminGuard] },
  { path: "create-patienttrustee", component: CreatePatientTrusteeComponent, canActivate: [isAdminGuard] },

  { path: "profile", component: ProfileComponent, canActivate: [authorizedGuard] },
  { path: "medicines/:id", component: MedicinesViewComponent, canActivate: [authorizedGuard] },
  { path: "add-medicine", component: AddMedicineComponent, canActivate: [authorizedGuard] },
  { path: "edit-medicine/:id", component: EditMedicineComponent, canActivate: [authorizedGuard] },
  { path: "messages", component: MessagesViewComponent, canActivate: [authorizedGuard] },
  { path: "schedule/:id", component: ScheduleViewComponent, canActivate: [authorizedGuard] },
  { path: "statistics/:id", component: StatisticsViewComponent, canActivate: [authorizedGuard] },
  { path: "patients", component: PatientsViewDoctorComponent, canActivate: [authorizedGuard] },
  { path: "observables", component: PatientsViewTrusteeComponent, canActivate: [authorizedGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
