import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from 'rxjs';

export interface Client {
  client_id: string;
  name: string;
  dob: Date;
  gender: 'Female' | 'Male' | 'Unspecified';
  fitness_program: string;
  email: string;
  password: string;
  joined_date: Date;
  ending_date: Date;
  special_health_notes?: string;
}

export interface PersonalTrainer {
  personaltrainer_id: string;
  name: string;
  dob: Date;
  gender: 'Female' | 'Male' | 'Unspecified';
  email: string;
  password: string;
  is_active: boolean;
}

export interface Workout {
  workout_id: string;
  fitness_program: string;
  day: string;
  exercise_name: string;
  description: string;
  sets: number[];
}

interface LoginResponse {
  user: Client;
  message: string;
}

@Injectable({
  providedIn: 'root',
})

// This injectable service is used to manage the data of the client.
// The service has methods to get the clients and personal trainers from the server, as well as to update the current client on the server.
export class ClientService {
  public currentClient: Client | undefined = undefined;
  private baseUrl: string = 'https://nehemia.it.scu.edu.au/personaltrainer';
  private headers: Headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) {
  }

  getClients(): Observable<PersonalTrainer[]> {
    // get PTs from the server - not actually used in this app, but was used for testing.
    return this.http.get<PersonalTrainer[]>(this.baseUrl + '/personaltrainer');

  }

  getClientsForTrainer(trainerId: string): Observable<Client[]> {
    // get a client from the server
    return this.http.get<Client[]>(this.baseUrl + '/client/' + trainerId);
  }

  clientLogin(email: string, password: string): Observable<LoginResponse> {
    // Post the email and password to the server
    return this.http.post<LoginResponse>(this.baseUrl + '/client/login', {email, password});
  }


  // The updateClient method takes a client as an argument and returns an observable of the client.
  // This allows a client to update some details about themselves.
  updateClient(client: Client): Observable<Client> {
    // update the client on the server
    // put as x-www-form-urlencoded
    // Turn these into proper date objects so instanceof works correctly.
    client.joined_date = new Date(client.joined_date);
    client.ending_date = new Date(client.ending_date);
    client.dob = new Date(client.dob);

    const body = this.toUrlEncoded(client, ['client_id', 'email', 'password']);
    // Set the content type to x-www-form-urlencoded
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.put<Client>(`${this.baseUrl}/client/${client.client_id}`, body, {headers});
  }

  private toUrlEncoded(obj: any, excludeKeys: string[] = []): string {
    // Convert an object to a URL encoded string.
    return Object.entries(obj)
      .filter(([key]) => !excludeKeys.includes(key)) // Exclude specified keys
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(this.formatValue(value))}`)
      .join('&');
  }

  private formatValue(value: any): string {
    // Convert Date objects to ISO strings (yyyy-mm-dd) as the server expects
    if (value instanceof Date) {
      return value.toISOString().split('T')[0];
    }
    console.log(value);
    return value.toString();
  }


  getWorkoutPlan(clientId: string): Observable<Workout[]> {
    // get a workout plan from the server
    return this.http.get<Workout[]>(this.baseUrl + '/workoutplan/' + clientId);
  }

}

export class WorkoutPlan {
}
