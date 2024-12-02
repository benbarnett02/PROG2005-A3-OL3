import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { Client } from '../models/client.interface';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  clients: Client[] = [];
  isLoading = false;
  error: string | null = null;
  sortField: 'name' | 'age' | 'fitnessLevel' = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';
  selectedClient: Client | null = null;
  showDetails: boolean = false;

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    this.isLoading = true;
    this.error = null;
    const trainerId = this.authService.currentUserValue?.id;
    
    if (!trainerId) {
      this.error = 'No trainer ID found';
      this.isLoading = false;
      return;
    }

    this.apiService.getClientsForTrainer(trainerId).subscribe({
      next: (clients) => {
        this.clients = this.sortClients(clients);
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load clients';
        this.isLoading = false;
        console.error('Error loading clients:', err);
      }
    });
  }

  sortClients(clients: Client[]): Client[] {
    return [...clients].sort((a, b) => {
      const aValue = a[this.sortField];
      const bValue = b[this.sortField];
      
      if (aValue === undefined || bValue === undefined) return 0;
      
      const comparison = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  onSortChange(field: 'name' | 'age' | 'fitnessLevel') {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.clients = this.sortClients(this.clients);
  }

  viewClientDetails(client: Client) {
    this.selectedClient = client;
    this.showDetails = true;
  }

  backToList() {
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

  logout() {
    this.authService.logout();
  }
}
