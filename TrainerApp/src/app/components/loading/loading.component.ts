import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  template: `
    <div class="loading-container ion-text-center fade-in">
      <ion-spinner name="crescent"></ion-spinner>
      <p *ngIf="message">{{ message }}</p>
    </div>
  `,
  styles: [`
    .loading-container {
      padding: 20px;
      ion-spinner {
        width: 48px;
        height: 48px;
        margin-bottom: 10px;
        color: var(--ion-color-primary);
      }
      p {
        color: var(--ion-color-medium);
        margin: 0;
        font-size: 14px;
      }
    }
  `]
})
export class LoadingComponent {
  @Input() message?: string;
} 