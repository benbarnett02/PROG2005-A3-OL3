import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { Client } from '../models/client.interface';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  clients: Client[] = [];
  isLoading = false;
  error: string | null = null;
  sortField: 'name' = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';
  selectedClient: Client | null = null;
  showDetails: boolean = false;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadClients();
  }

  ionViewWillEnter() {
    console.log('Tab1 will enter - refreshing data');
    this.loadClients().then(() => {
      // If we're viewing client details, refresh the selected client
      if (this.showDetails && this.selectedClient) {
        const updatedClient = this.clients.find(c => c.client_id === this.selectedClient?.client_id);
        if (updatedClient) {
          console.log('Updating selected client details with:', updatedClient);
          this.selectedClient = { ...updatedClient };
        }
      }
    });
  }

  loadClients() {
    this.isLoading = true;
    this.error = null;
    const trainerId = this.authService.currentUserValue?.id;
    
    if (!trainerId) {
      this.error = 'No trainer ID found';
      this.isLoading = false;
      return Promise.resolve();
    }

    return new Promise<void>((resolve) => {
      this.apiService.getClientsForTrainer(trainerId).subscribe({
        next: (clients) => {
          this.clients = clients;
          this.sortClients();
          this.isLoading = false;
          resolve();
        },
        error: (err) => {
          this.error = 'Failed to load clients';
          this.isLoading = false;
          console.error('Error loading clients:', err);
          resolve();
        }
      });
    });
  }

  sortClients(): void {
    if (!this.sortField || !this.clients) return;

    this.clients.sort((a, b) => {
      let aValue = a[this.sortField].toLowerCase();
      let bValue = b[this.sortField].toLowerCase();

      if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  onSortChange(field: 'name') {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.sortClients();
  }

  viewClientDetails(client: Client) {
    this.selectedClient = { ...client };
    this.showDetails = true;
  }

  backToList() {
    this.selectedClient = null;
    this.showDetails = false;
    this.loadClients();
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

  editClient(client: Client) {
    this.router.navigate(['/edit-client', client.client_id], {
      state: { client }
    });
  }
}
