import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { Client } from '../../models/client.interface';

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.page.html',
  styleUrls: ['./edit-client.page.scss'],
})
export class EditClientPage implements OnInit {
  clientForm!: FormGroup;
  clientId: string = '';
  isLoading = false;
  maxDate: string = '';
  minDate: string = '';

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
    private route: ActivatedRoute,
    private router: Router,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController
  ) {
    // Set date limits
    const today = new Date();
    const maxYear = today.getFullYear() - 18;
    const minYear = today.getFullYear() - 100;
    this.maxDate = `${maxYear}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    this.minDate = `${minYear}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    this.initializeForm();
  }

  ngOnInit() {
    this.clientId = this.route.snapshot.paramMap.get('id') || '';
    if (this.clientId) {
      this.loadClientData();
    } else {
      this.router.navigate(['/tabs/tab1']);
    }
  }

  private initializeForm() {
    this.clientForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      dob: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      fitness_program: ['', [Validators.required]],
      joined_date: ['', [Validators.required]],
      ending_date: ['', [Validators.required]],
      special_health_notes: ['']
    });
  }

  private async loadClientData() {
    const loading = await this.loadingController.create({
      message: 'Loading client data...'
    });
    await loading.present();

    try {
      const state = history.state;
      if (state && state.client) {
        const client: Client = state.client;
        this.clientForm.patchValue({
          name: client.name,
          dob: client.dob.split('T')[0],
          gender: client.gender,
          fitness_program: client.fitness_program,
          joined_date: client.joined_date.split('T')[0],
          ending_date: client.ending_date.split('T')[0],
          special_health_notes: client.special_health_notes || ''
        });
      } else {
        throw new Error('Client data not found');
      }
    } catch (error) {
      console.error('Error loading client:', error);
      const toast = await this.toastController.create({
        message: 'Failed to load client data',
        duration: 3000,
        color: 'danger'
      });
      await toast.present();
      this.router.navigate(['/tabs/tab1']);
    } finally {
      await loading.dismiss();
    }
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

    const loading = await this.loadingController.create({
      message: 'Updating client...'
    });
    await loading.present();

    try {
      const formValue = this.clientForm.value;
      
      const clientData = {
        name: formValue.name.trim(),
        dob: formValue.dob.split('T')[0],
        gender: formValue.gender,
        fitness_program: formValue.fitness_program,
        joined_date: formValue.joined_date.split('T')[0],
        ending_date: formValue.ending_date.split('T')[0],
        special_health_notes: formValue.special_health_notes?.trim() || ''
      };

      console.log('Updating client:', this.clientId, 'with data:', clientData);
      await this.apiService.updateClient(this.clientId, clientData).toPromise();
      await loading.dismiss();
      
      const toast = await this.toastController.create({
        message: 'Client updated successfully!',
        duration: 2000,
        color: 'success'
      });
      await toast.present();

      this.router.navigate(['/tabs/tab1'], {
        state: { refresh: true }
      });
    } catch (error) {
      await loading.dismiss();
      console.error('Error updating client:', error);
      
      const toast = await this.toastController.create({
        message: 'Failed to update client. Please try again.',
        duration: 3000,
        color: 'danger'
      });
      await toast.present();
    }
  }

  async deleteClient() {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this client? This action cannot be undone.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: async () => {
            const loading = await this.loadingController.create({
              message: 'Deleting client...'
            });
            await loading.present();

            try {
              await this.apiService.deleteClient(this.clientId).toPromise();
              await loading.dismiss();
              
              const toast = await this.toastController.create({
                message: 'Client deleted successfully!',
                duration: 2000,
                color: 'success'
              });
              await toast.present();

              this.router.navigate(['/tabs/tab1'], {
                state: { refresh: true }
              });
            } catch (error) {
              await loading.dismiss();
              console.error('Error deleting client:', error);
              
              const toast = await this.toastController.create({
                message: 'Failed to delete client. Please try again.',
                duration: 3000,
                color: 'danger'
              });
              await toast.present();
            }
          }
        }
      ]
    });

    await alert.present();
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