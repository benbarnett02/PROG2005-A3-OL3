import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {PrivacyPageRoutingModule} from './privacy-routing.module';

import {PrivacyPage} from './privacy.page';
import {IonSegmentContent} from "@ionic/angular/standalone";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrivacyPageRoutingModule,
    IonSegmentContent
  ],
  declarations: [PrivacyPage]
})
export class PrivacyPageModule {
}
