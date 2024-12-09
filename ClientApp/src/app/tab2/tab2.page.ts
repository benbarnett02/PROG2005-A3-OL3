import {Component, OnInit, Input, Output, ViewChild} from '@angular/core';
import {Validators, FormGroup, FormBuilder} from "@angular/forms";
import {Client, ClientService} from "../services/data.service";
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";
import {IonModal} from "@ionic/angular";

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})

// Tab 2 Displays the client's personal profile and provides a space for them to edit their details.
// The client can change a few basic details about themselves: Name, DOB, gender, and special health notes.
// The client can't change their email or password here, as these are used for authentication.
// They also can't change their workouts because that's the trainer's job.
export class Tab2Page implements OnInit {
  clientForm!: FormGroup;
  client: Client;
  isEditing: boolean = false;
  @ViewChild(IonModal) modal!: IonModal;
  formFeedback?: string;

  constructor(private fb: FormBuilder, private authService: AuthService, private dataService: ClientService) {
    this.client = authService.getCurrentClient();
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  // Set up the form with the client's details on initialisation.
  ngOnInit(): void {
    this.isEditing = !!this.client;
    this.clientForm = this.fb.group({
      name: [this.client.name || '', [Validators.required, Validators.minLength(3)]],
      // This method (below) is probably the dodgiest way of formatting a string as YYYY-MM-dd, but it works.
      dob: [this.client.dob.toISOString().split('T')[0] || '', [Validators.required]],
      gender: [this.client.gender || 'Unspecified', [Validators.required]],
      special_health_notes: [this.client.special_health_notes || '']
    });
  }

  // This method is called when the form is submitted.
  onSubmit(): void {
    if (this.clientForm.valid) {
      // Assuming the form is valid, update the client with the new details.
      this.client = {
        ...this.client,
        name: this.clientForm.value.name,
        dob: new Date(this.clientForm.value.dob),
        gender: this.clientForm.value.gender,
        special_health_notes: this.clientForm.value.special_health_notes
      };

      // Update the client on the server and log them in again to ensure the local client is in sync with the remote client.
      this.dataService.updateClient(this.client).subscribe((res) => {
        // @ts-ignore
        this.formFeedback = res.message;
      });
      this.authService.login(this.client.email, this.client.password).subscribe((res) => {
        this.client = res;
      });
      this.modal.dismiss(this.client, 'submit');

    } else {
      console.error('Invalid form!');
      document.getElementById('form-feedback')!.innerText = 'Form invalid. Please check your inputs. ';
    }
  }
}
