import {Component, OnInit} from '@angular/core';
import {Validators, FormGroup, FormBuilder} from "@angular/forms";
import {Client} from "../services/data.service";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  profileForm: FormGroup;
  client: Client | null = null;

  constructor(private fb: FormBuilder, private AuthService: AuthService) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
    this.client = this.AuthService.getCurrentClient();
  }

  ngOnInit(): void {
    // Load user data here and patch the form
    if (this.client) {
      this.profileForm.patchValue({
        name: this.client.name,
        email: this.client.email
      });
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      console.log('Profile updated', this.profileForm.value);
    }
  }
}
