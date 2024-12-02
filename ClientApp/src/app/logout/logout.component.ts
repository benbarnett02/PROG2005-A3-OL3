import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-logout-component',
  templateUrl: './logout.component.html',
})

export class LogoutComponent {

  constructor(private authService: AuthService, private router: Router) {
  }

  onClick() {
    this.authService.logout();
  }

  privacy() {
    this.router.navigate(['/privacy']);
  }

}
