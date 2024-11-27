import {Injectable} from '@angular/core';
import {Client, ClientService} from "./data.service";
import {map, Observable} from "rxjs";
import {Router} from "@angular/router";

@Injectable({providedIn: 'root'})

export class AuthService {

  private currentClient: Client | null = null; // when app starts, no client is logged in

  constructor(private clientService: ClientService, private router: Router) {
    this.currentClient = JSON.parse(localStorage.getItem('currentClient') || 'null');

  }

  login(email: string, password: string): Observable<Client> {
    console.log("yeee2")
    console.log(email);
    console.log(password);

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

  getCurrentClient(): Client | null {
    return this.currentClient;
  }

}
