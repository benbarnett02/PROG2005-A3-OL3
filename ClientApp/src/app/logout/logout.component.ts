import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';


@Component({
  selector: 'app-logout-component',
  templateUrl: './logout.component.html',
})

export class LogoutComponent {
  // This component is a button that allows the user to sign out. It is used in the header of the app.
  constructor(private authService: AuthService, private router: Router) {
  }


  onClick() {
    this.authService.logout();
  }

  privacy() {
    this.router.navigate(['/privacy']);
  }

}
