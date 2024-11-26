import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Observable } from 'rxjs';

export interface Client {
  client_id: string;
  name: string;
  dob: Date;
  gender: 'Female' | 'Male' | 'Unspecified';
  fitness_program: string;
  email: string;
  password:string;
  joined_date: Date;
  ending_date: Date;
  notes?: string;
  vip: boolean;
}

export interface PersonalTrainer{
  personaltrainer_id: string;
  name: string;
  dob: Date;
  gender: 'Female' | 'Male' | 'Unspecified';
  email: string;
  password: string;
  is_active: boolean;
}

interface LoginResponse {
  user: Client;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  public currentClient: Client | null = null;
  private baseUrl: string = 'https://nehemia.it.scu.edu.au/personaltrainer';
  private headers: Headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) {
  }

  getClients(): Observable<PersonalTrainer[]> {
    // get PTs from the server
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

}
