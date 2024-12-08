import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-error',
  template: `
    <div class="error-container ion-text-center fade-in">
      <ion-icon name="alert-circle-outline" color="danger"></ion-icon>
      <h2>{{ title || 'Error' }}</h2>
      <p>{{ message || 'Something went wrong. Please try again.' }}</p>
      <ion-button *ngIf="retryButton" (click)="retry.emit()" fill="clear">
        <ion-icon name="refresh-outline" slot="start"></ion-icon>
        Try Again
      </ion-button>
    </div>
  `,
  styles: [`
    .error-container {
      padding: 20px;
      ion-icon {
        font-size: 48px;
        margin-bottom: 16px;
      }
      h2 {
        color: var(--ion-color-danger);
        margin: 0 0 8px;
        font-size: 20px;
      }
      p {
        color: var(--ion-color-medium);
        margin: 0 0 16px;
        font-size: 14px;
      }
    }
  `]
})
export class ErrorComponent {
  @Input() title?: string;
  @Input() message?: string;
  @Input() retryButton = true;
  @Output() retry = new EventEmitter<void>();
} 