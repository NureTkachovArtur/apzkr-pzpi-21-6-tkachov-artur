import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginData } from '../../ui/login/login.model';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import moment from 'moment';
import * as jwt_decode from 'jwt-decode';
import { Observable, of } from 'rxjs';

var rolesToUKR: { [role: string]: string; } = {
  "Administrator": "Адміністоратор",
  "Patient": "Пацієнт",
  "Trustee": "Опікун",
  "Doctor": "Лікар"
};

export class User {
  id: number = 0;
  email: string = '';
  role: string = '';
  roleUKR: string = '';
  userName: string = '';
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  url: string = environment.apiBaseUrl;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router
  ) { }

  login(loginData: LoginData) {
    if (loginData.Email.length == 0 || loginData.Password.length == 0) {
      this.toastr.error('Не всі поля заповнені', 'Помилка');
      return;
    }

    this.http.post(this.url + '/Accounts/login', loginData).subscribe(
      (response: any) => {
        if (!response.flag) {
          this.toastr.error(response.message, 'Помилка');
        } else {
          this.setSession(response);
          var role = this.getUserInfo()!.role;
          if (role == "Administrator") {
            this.router.navigate(['admin-panel']);
          } else {
            this.router.navigate(['profile']);
          }
        }
      },
      (error) => {
        this.toastr.error('Проблема сервера, спробуйте пізніше', 'Помилка');
      }
    );
  }

  registerDoctor(event: any) {
    this.http.post(this.url + '/Accounts/register-doctor', event).subscribe(
      (response: any) => {
        if (!response.flag) {
          this.toastr.error(response.message, 'Помилка');
        } else {
          this.login({ Email: event.email, Password: event.password });
        }
      },
      (error) => {
        this.toastr.error('Проблема сервера, спробуйте пізніше', 'Помилка');
      }
    );
  }

  registerDoctorAdmin(event: any) {
    this.http.post(this.url + '/Accounts/register-doctor', event).subscribe(
      (response: any) => {
        if (!response.flag) {
          this.toastr.error(response.message, 'Помилка');
        } else {
          this.router.navigate(['/admin-panel']);
        }
      },
      (error) => {
        this.toastr.error('Проблема сервера, спробуйте пізніше', 'Помилка');
      }
    );
  }

  registerPatient(event: any) {
    this.http.post(this.url + '/Accounts/register-patient', event).subscribe(
      (response: any) => {
        if (!response.flag) {
          this.toastr.error(response.message, 'Помилка');
        } else {
          this.login({ Email: event.email, Password: event.password });
        }
      },
      (error) => {
        this.toastr.error('Проблема сервера, спробуйте пізніше', 'Помилка');
      }
    );
  }

  registerPatientAdmin(event: any) {
    this.http.post(this.url + '/Accounts/register-patient', event).subscribe(
      (response: any) => {
        if (!response.flag) {
          this.toastr.error(response.message, 'Помилка');
        } else {
          this.router.navigate(['/admin-panel']);
        }
      },
      (error) => {
        this.toastr.error('Проблема сервера, спробуйте пізніше', 'Помилка');
      }
    );
  }

  registerTrustee(event: any) {
    this.http.post(this.url + '/Accounts/register-trustee', event).subscribe(
      (response: any) => {
        if (!response.flag) {
          this.toastr.error(response.message, 'Помилка');
        } else {
          this.login({ Email: event.email, Password: event.password });
        }
      },
      (error) => {
        this.toastr.error('Проблема сервера, спробуйте пізніше', 'Помилка');
      }
    );
  }

  registerTrusteeAdmin(event: any) {
    this.http.post(this.url + '/Accounts/register-trustee', event).subscribe(
      (response: any) => {
        if (!response.flag) {
          this.toastr.error(response.message, 'Помилка');
        } else {
          this.router.navigate(['/admin-panel']);
        }
      },
      (error) => {
        this.toastr.error('Проблема сервера, спробуйте пізніше', 'Помилка');
      }
    );
  }

  registerAdmin(event: any) {
    this.http.post(this.url + '/Accounts/register-admin', event).subscribe(
      (response: any) => {
        if (!response.flag) {
          this.toastr.error(response.message, 'Помилка');
        } else {
          this.router.navigate(['/admin-panel']);
        }
      },
      (error) => {
        this.toastr.error('Проблема сервера, спробуйте пізніше', 'Помилка');
      }
    );
  }

  getToken() {
    return this.isLoggedIn() ? localStorage.getItem('token') : null;
  }

  public getUserInfo(): User | undefined {
    if (this.isLoggedOut()) {
      return undefined;
    }

    var dToken = this.getDecodedAccessToken(this.getToken()!);

    var user = new User();
    user.email = this.findValueByPartialKey('emailaddress', dToken)!;
    user.id = +(this.findValueByPartialKey('nameidentifier', dToken)!);
    user.role = this.findValueByPartialKey('role', dToken)!;
    user.roleUKR = rolesToUKR[user.role];
    user.userName = this.findValueByPartialKey('name', dToken)!;

    return user;
  }

  private findValueByPartialKey(
    partialKey: string,
    dict: any
  ): string | undefined {
    const keys = Object.keys(dict);
    for (const key of keys) {
      const parts = key.split('/');
      const lastPart = parts[parts.length - 1];
      if (lastPart === partialKey) {
        return dict[key];
      }
    }
    return undefined;
  }

  private setSession(authResult: any) {
    const decodedToken = this.getDecodedAccessToken(authResult.token);
    const expiresAt = moment().add(decodedToken.exp, 'second');

    localStorage.setItem('token', authResult.token);
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('expires_at');
    window.location.reload();
  }

  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getExpiration() {
    const expiration = localStorage.getItem('expires_at')!;
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode.jwtDecode(token);
    } catch (Error) {
      return null;
    }
  }

  getCurrentUser(): Observable<any> {
    if (this.isLoggedOut()) {
      return of(undefined);
    }

    let userInfo = this.getUserInfo()!;
    let url = '';
    switch (userInfo.role) {
      case 'Patient':
        url = this.url + '/Patients/' + userInfo.id;
        break;
      case 'Doctor':
        url = this.url + '/Doctors/' + userInfo.id;
        break;
      case 'Trustee':
        url = this.url + '/Trustees/' + userInfo.id;
        break;
    }
    return this.http.get(url);
  }
}
