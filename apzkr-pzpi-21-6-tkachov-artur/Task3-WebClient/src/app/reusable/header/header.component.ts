import { Component } from '@angular/core';
import { AuthService, User } from '../../services/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  isLoggedIn: boolean = this.authService.isLoggedIn();
  userInfo: User = new User();

  constructor(public authService: AuthService) {
    if (this.isLoggedIn) {
      this.userInfo = this.authService.getUserInfo()!;
    }
  }

  logout() {
    this.authService.logout();
  }

}
