import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Tab2Page } from './tab2.page';

import { Tab2PageRoutingModule } from './tab2-routing.module';
import {LoginPageModule} from "../logout/logout.module";

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        Tab2PageRoutingModule,
        ReactiveFormsModule,
        IonicModule,
        IonicModule,
        IonicModule,
        LoginPageModule,
        IonicModule,
        IonicModule,
        IonicModule,
        IonicModule,
        IonicModule
    ],
  declarations: [Tab2Page]
})
export class Tab2PageModule {}
