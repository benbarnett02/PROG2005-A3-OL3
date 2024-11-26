import { Component } from '@angular/core';
import {Client, ClientService} from "../services/data.service";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  client?: any;
  constructor(private clientService: ClientService) {
 this.client = this.clientService.clientLogin('johndoe@example.com', 'password123');
    console.log(this.client);
  }}
