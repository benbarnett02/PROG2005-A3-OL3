import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ClientCreate } from '../../models/client-create.interface';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.page.html',
  styleUrls: ['./add-client.page.scss'],
})
export class AddClientPage {
  clientForm: FormGroup;
  isSubmitting = false;
  maxDate: string;
  minDate: string;

  genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' }
  ];

  fitnessPrograms = [
    { value: 'muscle gain', label: 'Muscle Gain' },
    { value: 'fat loss', label: 'Fat Loss' },
    { value: 'general fitness', label: 'General Fitness' },
    { value: 'strength training', label: 'Strength Training' },
    { value: 'endurance training', label: 'Endurance Training' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {
    // Set date limits (18 years old minimum, 100 years old maximum)
    const today = new Date();
    const maxYear = today.getFullYear() - 18;
    const minYear = today.getFullYear() - 100;
    this.maxDate = `${maxYear}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    this.minDate = `${minYear}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    this.clientForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      dob: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      fitness_program: ['muscle gain', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      joined_date: [new Date().toISOString().split('T')[0], [Validators.required]],
      ending_date: [new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0], [Validators.required]],
      special_health_notes: ['']
    });
  }

  async onSubmit() {
    if (this.clientForm.invalid) {
      Object.keys(this.clientForm.controls).forEach(key => {
        const control = this.clientForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      return;
    }

    const trainerId = this.authService.currentUserValue?.id;
    if (!trainerId) {
      const toast = await this.toastController.create({
        message: 'No trainer ID found. Please log in again.',
        duration: 3000,
        color: 'danger',
        position: 'top'
      });
      await toast.present();
      this.router.navigate(['/login']);
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Creating client...'
    });
    await loading.present();

    try {
      const formValue = this.clientForm.value;
      const clientData: ClientCreate = {
        ...formValue,
        personaltrainer_id: trainerId,
        dob: new Date(formValue.dob).toISOString().split('T')[0]
      };

      console.log('Creating client with trainer ID:', trainerId);
      await this.apiService.createClient(clientData).toPromise();
      await loading.dismiss();
      
      const toast = await this.toastController.create({
        message: 'Client created successfully!',
        duration: 2000,
        color: 'success',
        position: 'top'
      });
      await toast.present();

      this.router.navigate(['/tabs/tab1']);
    } catch (error: any) {
      await loading.dismiss();
      console.error('Error creating client:', error);
      
      if (error.message.includes('email already exists')) {
        this.clientForm.get('email')?.setErrors({ 'emailExists': true });
        const toast = await this.toastController.create({
          message: 'A client with this email already exists.',
          duration: 3000,
          color: 'danger',
          position: 'top'
        });
        await toast.present();
      } else {
        const toast = await this.toastController.create({
          message: 'Failed to create client. Please try again.',
          duration: 3000,
          color: 'danger',
          position: 'top'
        });
        await toast.present();
      }
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.clientForm.get(controlName);
    if (!control?.errors || !control.touched) return '';

    switch (controlName) {
      case 'name':
        if (control.errors['required']) return 'Name is required';
        if (control.errors['minlength']) return 'Name must be at least 2 characters';
        if (control.errors['maxlength']) return 'Name cannot exceed 50 characters';
        break;
      case 'email':
        if (control.errors['required']) return 'Email is required';
        if (control.errors['email']) return 'Please enter a valid email';
        break;
      case 'password':
        if (control.errors['required']) return 'Password is required';
        if (control.errors['minlength']) return 'Password must be at least 8 characters';
        break;
      case 'dob':
        if (control.errors['required']) return 'Date of birth is required';
        break;
      case 'gender':
        if (control.errors['required']) return 'Gender is required';
        break;
      case 'fitness_program':
        if (control.errors['required']) return 'Fitness program is required';
        break;
    }
    return '';
  }
} 