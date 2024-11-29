import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { Client } from '../models/client.interface';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  searchTerm: string = '';
  isLoading: boolean = false;
  allClients: Client[] = [];
  searchResults: Client[] = [];
  error: string | null = null;
  selectedClient: Client | null = null;
  showDetails: boolean = false;

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadAllClients();
  }

  loadAllClients() {
    this.isLoading = true;
    this.error = null;
    const trainerId = this.authService.currentUserValue?.id;
    
    if (!trainerId) {
      this.error = 'Trainer ID not found';
      this.isLoading = false;
      return;
    }

    this.apiService.getClientsForTrainer(trainerId).subscribe({
      next: (clients) => {
        this.allClients = clients;
        this.searchResults = clients; // Initially show all clients
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Loading error:', err);
        this.error = 'Error loading clients. Please try again.';
        this.isLoading = false;
      }
    });
  }

  onSearch() {
    if (!this.searchTerm.trim()) {
      this.searchResults = this.allClients; // Show all clients when search is empty
      this.error = null;
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase();
    this.searchResults = this.allClients.filter(client => 
      client.name.toLowerCase().includes(searchTermLower)
    );

    if (this.searchResults.length === 0) {
      this.error = 'No clients found matching your search.';
    } else {
      this.error = null;
    }
  }

  clearSearch() {
    this.searchTerm = '';
    this.searchResults = this.allClients; // Reset to show all clients
    this.error = null;
    this.selectedClient = null;
    this.showDetails = false;
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
