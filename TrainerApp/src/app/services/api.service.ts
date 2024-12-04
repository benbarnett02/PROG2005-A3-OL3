import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { PersonalTrainer } from '../models/trainer.interface';
import { Client } from '../models/client.interface';
import { ClientCreate } from '../models/client-create.interface';
import { WorkoutPlan } from '../models/workout-plan.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly API_URL = 'https://nehemia.it.scu.edu.au/personaltrainer';

  constructor(private http: HttpClient) {}

  // Personal Trainer endpoints
  getAllTrainers(): Observable<PersonalTrainer[]> {
    console.log('Fetching all trainers...');
    return this.http.get<PersonalTrainer[]>(`${this.API_URL}/personaltrainer`).pipe(
      tap(response => console.log('Trainers response:', response))
    );
  }

  trainerLogin(email: string, password: string): Observable<PersonalTrainer> {
    console.log('Attempting trainer login with email:', email);
    const loginData = { email, password };
    console.log('Login request data:', loginData);
    console.log('Login URL:', `${this.API_URL}/personaltrainer/login`);

    return this.http.post<{message: string, user: PersonalTrainer}>(`${this.API_URL}/personaltrainer/login`, loginData)
      .pipe(
        tap(response => console.log('Login response:', response)),
        map(response => {
          console.log('Processing login response:', response);
          if (!response || !response.user || !response.user.personaltrainer_id) {
            console.error('Invalid login response:', response);
            throw new Error('Invalid login response');
          }
          return response.user;
        })
      );
  }

  // Client endpoints
  getClientsForTrainer(trainerId: number): Observable<Client[]> {
    console.log('Fetching clients for trainer:', trainerId);
    return this.http.get<Client[]>(`${this.API_URL}/client/${trainerId}`).pipe(
      tap(response => console.log('Clients response:', response)),
      map(clients => {
        return clients.map(client => this.validateAndFormatClient(client));
      })
    );
  }

  getClientByNameOrId(trainerId: number, clientNameOrId: string): Observable<Client[]> {
    console.log('Searching clients - trainerId:', trainerId, 'search:', clientNameOrId);
    return this.http.get<Client[]>(`${this.API_URL}/client/${trainerId}/${clientNameOrId}`).pipe(
      tap(response => console.log('Search response:', response)),
      map(clients => {
        return clients.map(client => this.validateAndFormatClient(client));
      })
    );
  }

  clientLogin(email: string, password: string): Observable<Client> {
    console.log('Attempting client login with email:', email);
    return this.http.post<{message: string, user: Client}>(`${this.API_URL}/client/login`, { email, password }).pipe(
      tap(response => console.log('Client login response:', response)),
      map(response => {
        if (!response || !response.user) {
          throw new Error('Invalid client login response');
        }
        return this.validateAndFormatClient(response.user);
      })
    );
  }

  private validateAndFormatClient(client: any): Client {
    // Ensure all required fields are present with default values if needed
    const formattedClient: Client = {
      client_id: Number(client.client_id) || 0,
      name: client.name || '',
      dob: client.dob || new Date().toISOString(),
      gender: client.gender || '',
      fitness_program: client.fitness_program || '',
      email: client.email || '',
      joined_date: client.joined_date || new Date().toISOString(),
      ending_date: client.ending_date || new Date().toISOString(),
      special_health_notes: client.special_health_notes || '',
      personaltrainer_id: Number(client.personaltrainer_id) || 0
    };

    console.log('Formatted client:', formattedClient);
    return formattedClient;
  }

  createClient(clientData: ClientCreate): Observable<any> {
    console.log('Creating new client:', clientData);
    // Format the data to match the API's expected structure exactly
    const dataToSend = {
      name: clientData.name,
      dob: clientData.dob,
      gender: clientData.gender,
      fitness_program: clientData.fitness_program,
      email: clientData.email,
      password: clientData.password,
      joined_date: clientData.joined_date,
      ending_date: clientData.ending_date,
      special_health_notes: clientData.special_health_notes,
      personaltrainer_id: clientData.personaltrainer_id
    };
    console.log('Sending data to API:', dataToSend);
    
    return this.http.post(`${this.API_URL}/client`, dataToSend).pipe(
      tap(response => console.log('Create client response:', response)),
      catchError(error => {
        console.error('Error creating client:', error);
        console.error('Error details:', error.error);
        return throwError(() => new Error(error.error?.message || 'Failed to create client'));
      })
    );
  }

  updateClient(clientId: string, client: Partial<Client>): Observable<Client> {
    console.log('Updating client:', clientId, 'with data:', client);
    return this.http.put<Client>(`${this.API_URL}/client/${clientId}`, client).pipe(
      tap(response => console.log('Update client response:', response)),
      catchError(error => {
        console.error('Error updating client:', error);
        console.error('Error details:', error.error);
        return throwError(() => new Error(error.error?.message || 'Failed to update client'));
      })
    );
  }

  deleteClient(clientId: string): Observable<void> {
    console.log('Deleting client:', clientId);
    return this.http.delete<void>(`${this.API_URL}/client/${clientId}`).pipe(
      tap(() => console.log('Client deleted successfully'))
    );
  }

  // Workout Plan endpoints
  getWorkoutPlan(clientId: string): Observable<WorkoutPlan> {
    console.log('Fetching workout plan for client:', clientId);
    return this.http.get<WorkoutPlan>(`${this.API_URL}/workoutplan/${clientId}`).pipe(
      tap(response => console.log('Workout plan response:', response))
    );
  }
} 