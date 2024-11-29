import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { PersonalTrainer } from '../models/trainer.interface';
import { Client } from '../models/client.interface';
import { WorkoutPlan } from '../models/workout-plan.interface';
import { mockTrainer, mockClients } from '../mocks/mock-data';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly API_URL = 'https://nehemia.it.scu.edu.au/personaltrainer';
  private useMockData = true; // Toggle this to switch between mock and real API

  constructor(private http: HttpClient) {}

  // Personal Trainer endpoints
  getAllTrainers(): Observable<PersonalTrainer[]> {
    if (this.useMockData) {
      return of([mockTrainer]);
    }
    return this.http.get<PersonalTrainer[]>(`${this.API_URL}/personaltrainer`);
  }

  trainerLogin(email: string, password: string): Observable<PersonalTrainer> {
    if (this.useMockData) {
      if (email === mockTrainer.email && password === mockTrainer.password) {
        return of(mockTrainer);
      }
      throw new Error('Invalid email or password');
    }
    return this.http.post<PersonalTrainer>(`${this.API_URL}/personaltrainer/login`, { email, password });
  }

  // Client endpoints
  getClientsForTrainer(trainerId: string): Observable<Client[]> {
    if (this.useMockData) {
      return of(mockClients.filter(client => client.personalTrainerId === trainerId));
    }
    return this.http.get<Client[]>(`${this.API_URL}/client/${trainerId}`);
  }

  getClientByNameOrId(trainerId: string, clientNameOrId: string): Observable<Client[]> {
    if (this.useMockData) {
      return of(mockClients.filter(client => 
        client.personalTrainerId === trainerId && 
        (client.name.toLowerCase().includes(clientNameOrId.toLowerCase()) || client.id === clientNameOrId)
      ));
    }
    return this.http.get<Client[]>(`${this.API_URL}/client/${trainerId}/${clientNameOrId}`);
  }

  clientLogin(email: string, password: string): Observable<Client> {
    if (this.useMockData) {
      const client = mockClients.find(c => c.email === email && c.password === password);
      if (client) {
        return of(client);
      }
      throw new Error('Invalid email or password');
    }
    return this.http.post<Client>(`${this.API_URL}/client/login`, { email, password });
  }

  createClient(client: Omit<Client, 'id'>): Observable<Client> {
    if (this.useMockData) {
      const newClient = { ...client, id: `c${mockClients.length + 1}` };
      mockClients.push(newClient as Client);
      return of(newClient as Client);
    }
    return this.http.post<Client>(`${this.API_URL}/client`, client);
  }

  updateClient(clientId: string, client: Partial<Client>): Observable<Client> {
    if (this.useMockData) {
      const index = mockClients.findIndex(c => c.id === clientId);
      if (index !== -1) {
        mockClients[index] = { ...mockClients[index], ...client };
        return of(mockClients[index]);
      }
      throw new Error('Client not found');
    }
    return this.http.put<Client>(`${this.API_URL}/client/${clientId}`, client);
  }

  deleteClient(clientId: string): Observable<void> {
    if (this.useMockData) {
      const index = mockClients.findIndex(c => c.id === clientId);
      if (index !== -1) {
        mockClients.splice(index, 1);
      }
      return of(void 0);
    }
    return this.http.delete<void>(`${this.API_URL}/client/${clientId}`);
  }

  // Workout Plan endpoints
  getWorkoutPlan(clientId: string): Observable<WorkoutPlan> {
    return this.http.get<WorkoutPlan>(`${this.API_URL}/workoutplan/${clientId}`);
  }
} 