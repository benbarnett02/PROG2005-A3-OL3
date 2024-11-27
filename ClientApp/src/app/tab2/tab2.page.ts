import {Component, OnInit} from '@angular/core';
import {Validators, FormGroup, FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  profileForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['']
    });
  }

  ngOnInit(): void {
    // Load user data here and patch the form
    const userData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '123-456-7890'
    };
    this.profileForm.patchValue(userData);
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      console.log('Profile updated', this.profileForm.value);
    }
  }
}
