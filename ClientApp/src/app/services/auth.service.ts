import {Injectable} from '@angular/core';
import {Client, ClientService} from "./data.service";
import {map, Observable} from "rxjs";
import {Router} from "@angular/router";

@Injectable({providedIn: 'root'})

// This injectable service is used to manage the authentication of the client.
// The service has a method to login and logout the client, as well as to check the status of the client (i.e. whether they're authenticated or not) and to get the current client.


export class AuthService {

  private currentClient: Client | null = null; // when app starts, no client is logged in

  // When the service is created, it gets the current client from the local storage (if available).
  constructor(private clientService: ClientService, private router: Router) {
    this.currentClient = JSON.parse(localStorage.getItem('currentClient') || 'null');
    if (this.currentClient) {
      this.currentClient.dob = new Date(this.currentClient.dob);
      this.currentClient.joined_date = new Date(this.currentClient.joined_date);
      this.currentClient.ending_date = new Date(this.currentClient.ending_date);
    }

  }

  // The login method takes an email and password as arguments and returns an observable of the client.
// The client is then stored in the local storage and the currentClient property of the service is updated.
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
          response.user.dob = new Date(response.user.dob);
          response.user.joined_date = new Date(response.user.joined_date);
          response.user.ending_date = new Date(response.user.ending_date);
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

  // Ideally this might validate the saved credentials.
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
