import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  clientCount = 0;  // Initialize with 0 or fetch from a service
  
  constructor() {}
}
