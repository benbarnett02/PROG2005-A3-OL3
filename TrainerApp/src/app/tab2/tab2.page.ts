import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { Client } from '../models/client.interface';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  searchTerm: string = '';
  searchResults: Client[] = [];
  isLoading = false;
  error: string | null = null;
  selectedClient: Client | null = null;
  showDetails = false;

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  onSearch() {
    if (!this.searchTerm.trim()) {
      this.searchResults = [];
      return;
    }

    this.isLoading = true;
    this.error = null;
    const trainerId = this.authService.currentUserValue?.id;

    if (!trainerId) {
      this.error = 'No trainer ID found';
      this.isLoading = false;
      return;
    }

    this.apiService.getClientByNameOrId(trainerId, this.searchTerm).subscribe({
      next: (clients) => {
        this.searchResults = clients;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to search clients';
        this.isLoading = false;
        console.error('Error searching clients:', err);
      }
    });
  }

  viewClientDetails(client: Client) {
    this.selectedClient = client;
    this.showDetails = true;
  }

  backToResults() {
    this.selectedClient = null;
    this.showDetails = false;
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  getAvatarStyle(name: string): { [key: string]: string } {
    const colors = [
      '#FF5733', '#33FF57', '#3357FF', '#FF33F5',
      '#33FFF5', '#F5FF33', '#FF3333', '#33FF33'
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = colors[Math.abs(hash) % colors.length];

    return {
      'background-color': color,
      'color': '#ffffff',
      'display': 'flex',
      'align-items': 'center',
      'justify-content': 'center',
      'font-weight': 'bold',
      'font-size': '1.2em',
      'width': '100%',
      'height': '100%',
      'border-radius': '50%'
    };
  }
}
