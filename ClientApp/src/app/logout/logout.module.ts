import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { LogoutComponent } from './logout.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: LogoutComponent
      }
    ]),
    IonicModule,
    IonicModule,
    IonicModule
  ],
  exports: [
    LogoutComponent
  ],
  declarations: [LogoutComponent]
})
export class LoginPageModule {}
