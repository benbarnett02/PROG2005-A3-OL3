import {Injectable} from '@angular/core';
import {Client, ClientService} from "./data.service";
import {map, Observable} from "rxjs";
import {Router} from "@angular/router";

@Injectable({providedIn: 'root'})

export class AuthService {

  private currentClient: Client | null = null; // when app starts, no client is logged in

  constructor(private clientService: ClientService, private router: Router) {
    // This could have security implications.
    this.currentClient = JSON.parse(localStorage.getItem('currentClient') || 'null');
    if(this.currentClient) {
    this.currentClient.dob = new Date(this.currentClient.dob);
    this.currentClient.joined_date = new Date(this.currentClient.joined_date);
    this.currentClient.ending_date = new Date(this.currentClient.ending_date);
    }

  }

  login(email: string, password: string): Observable<Client> {
    if (email.length < 1 && password.length < 1) {
      console.log("length issue")
      throw new Error('Email and password are required');
    }

    return this.clientService.clientLogin(email, password).pipe(
      map((response: any) => {
        console.log("response returned")
        if (response.user) {
          console.log(response.user)
          this.currentClient = response.user;
          localStorage.setItem('currentClient', JSON.stringify(this.currentClient));
          return response.user;
        } else {
          console.log(response.message)
          throw new Error(response.message);
        }
      })
    );
  }

  logout(): void {
    this.currentClient = null;
    localStorage.removeItem('currentClient');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.currentClient !== null;
  }

  getCurrentClient(): Client {
    if (!this.currentClient) {
      throw new Error('No client is currently logged in');
    }
    return this.currentClient;
  }
}
