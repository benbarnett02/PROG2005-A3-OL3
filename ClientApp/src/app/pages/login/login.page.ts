import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {ClientService} from "../../services/data.service";
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  login: FormGroup;
  isSubmitting = false;
  loginError: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.login = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['tabs', 'tab1']);
    }
  }

  async loginSubmit() {
    if (this.login.valid) {
      this.isSubmitting = true;
      this.loginError = '';

      try {
        const { email, password } = this.login.value;
        await firstValueFrom(this.authService.login(email, password));
        console.log("yee1")
        await this.router.navigate(['tabs', 'tab1']);
      } catch (error: any) {
        this.loginError = error.error?.message || 'Login failed. Please try again.';
      } finally {
        this.isSubmitting = false;
      }
    }
  }
}




