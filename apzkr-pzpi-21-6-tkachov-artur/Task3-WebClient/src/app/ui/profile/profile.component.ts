import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { PUTValues as PUTValuesPatient } from './edit-profile/edit-profile.model';
import { PUTValues as PUTValuesDoctor } from '../admin-panel/doctors/put-doctor/put-doctor.model';
import { PUTValues as PUTValuesTrustee } from '../admin-panel/trustees/put-trustee/put-trustee.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  url: string = environment.apiBaseUrl;
  user: any;
  userId: number = 0;
  activeUserRole: string = '';
  userLoaded: boolean = false;
  editingProfile: boolean = false;
  showModal: boolean = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {
  }

  ngOnInit() {
    var info = this.authService.getUserInfo()!;
    this.activeUserRole = info.role;
    this.userId = info.id;
    this.getUser();
  }

  saveUser(data: any) {
    if (this.activeUserRole == 'Patient') {
      this.savePatient(data);
    } else if (this.activeUserRole == 'Doctor') {
      this.saveDoctor(data);
    } else if (this.activeUserRole == 'Trustee') {
      this.saveTrustee(data);
    }
  }

  savePatient(data: PUTValuesPatient) {
    this.http.put(this.url + "/Patients/uid/" + data.uid, data).subscribe(res => {
      this.getPatient();
      this.cancelEditing();
    });
  }

  saveDoctor(data: PUTValuesDoctor) {
    this.http.put(this.url + "/Doctors/" + data.doctorId, data).subscribe(res => {
      this.getDoctor();
      this.cancelEditing();
    });
  }

  saveTrustee(data: PUTValuesTrustee) {
    this.http.put(this.url + "/Trustees/" + data.trusteeId, data).subscribe(res => {
      this.getTrustee();
      this.cancelEditing();
    });
  }

  cancelEditing() {
    this.editingProfile = false;
  }

  getUser(): void {
    if (this.activeUserRole == 'Patient') {
      this.getPatient();
    } else if (this.activeUserRole == 'Doctor') {
      this.getDoctor();
    } else if (this.activeUserRole == 'Trustee') {
      this.getTrustee();
    }
  }

  getPatient(): void {
    this.http.get(this.url + "/Patients/" + this.userId).subscribe((data: any) => {
      this.user = data;

      var firstName = this.user.applicationUser.firstName;
      var lastName = this.user.applicationUser.lastName;
      var middleName = this.user.applicationUser.middleName;

      if (firstName && lastName && middleName) {
        this.user.fullName = lastName + ' ' + firstName + ' ' + middleName;
      } else {
        this.user.fullName = 'Не вказано';
      }

      if (!this.user.age) {
        this.user.age = 'Не вказано';
      }

      if (!this.user.address) {
        this.user.address = 'Не вказано';
      }

      this.user.genderURK = this.user.gender == 'f' ? "Жінка" : "Чоловік";
      this.user.role = this.activeUserRole;
      this.userLoaded = true;
    });
  }

  getDoctor(): void {
    this.http.get(this.url + "/Doctors/" + this.userId).subscribe((data: any) => {
      this.user = data;

      var firstName = this.user.applicationUser.firstName;
      var lastName = this.user.applicationUser.lastName;
      var middleName = this.user.applicationUser.middleName;

      if (firstName && lastName && middleName) {
        this.user.fullName = lastName + ' ' + firstName + ' ' + middleName;
      } else {
        this.user.fullName = 'Не вказано';
      }
      this.user.role = this.activeUserRole;
      this.userLoaded = true;
    });
  }

  getTrustee(): void {
    this.http.get(this.url + "/Trustees/" + this.userId).subscribe((data: any) => {
      this.user = data;

      var firstName = this.user.applicationUser.firstName;
      var lastName = this.user.applicationUser.lastName;
      var middleName = this.user.applicationUser.middleName;

      if (firstName && lastName && middleName) {
        this.user.fullName = lastName + ' ' + firstName + ' ' + middleName;
      } else {
        this.user.fullName = 'Не вказано';
      }
      this.user.role = this.activeUserRole;
      this.userLoaded = true;
    });
  }

  openModalDialog() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  confirmDelete() {
    var urlPart = this.activeUserRole + 's';
    this.http.delete(this.url + `/${urlPart}/acc/` + this.userId).subscribe(res => {
      this.router.navigate(['/home']);
    });
  }

  logout() {
    this.authService.logout();
  }

  getUserProfilePicture() {
    return this.user.applicationUser.profilePictureUrl ?
      `https://localhost:7027/api/Files/${this.user.applicationUser.profilePictureUrl}`
      : 'https://localhost:7027/api/Files/default-profile-picture.jpg';
  }

  onProfilePictureClick(): void {
    const fileInput = document.getElementById('profilePictureInput') as HTMLInputElement;
    fileInput.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file: File = input.files[0];

      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', file.type);

      this.http.post(this.url + `/Accounts/${this.user.applicationUser.id}/upload-profile-picture`, formData).subscribe(
        (response: any) => {
          this.user.applicationUser.profilePictureUrl = response.profilePictureUrl;
        }
      );
    }
  }

}
