import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  isSubmitting = false;
  loginError: string = '';
  showPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    // Check if already authenticated
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/tabs/tab1']);
    }
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      this.isSubmitting = true;
      this.loginError = '';

      const loading = await this.loadingController.create({
        message: 'Signing in...',
        spinner: 'crescent',
        cssClass: 'custom-loading'
      });
      await loading.present();

      try {
        const { email, password } = this.loginForm.value;
        await firstValueFrom(this.authService.login(email, password));
        
        const toast = await this.toastController.create({
          message: 'Welcome back!',
          duration: 2000,
          position: 'top',
          color: 'success',
          cssClass: 'custom-toast'
        });
        
        await loading.dismiss();
        await toast.present();
        
        // Navigate to tabs after successful login
        await this.router.navigate(['/tabs/tab1'], { replaceUrl: true });
      } catch (error: any) {
        this.loginError = error.error?.message || 'Login failed. Please try again.';
        await loading.dismiss();
      }

      this.isSubmitting = false;
    }
  }

  async loginWithSocial(provider: string) {
    const toast = await this.toastController.create({
      message: `${provider} login coming soon!`,
      duration: 2000,
      position: 'top',
      color: 'primary'
    });
    await toast.present();
  }
}
