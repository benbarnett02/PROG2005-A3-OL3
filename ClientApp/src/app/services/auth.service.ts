import {Injectable} from '@angular/core';
import {Client, ClientService} from "./data.service";
import {Observable} from "rxjs";
import {Router} from "@angular/router";

@Injectable({providedIn: 'root'})

export class AuthService {

  private currentClient: Client | null = null; // when app starts, no client is logged in

  constructor(private clientService: ClientService, private router: Router) {
    this.currentClient = JSON.parse(localStorage.getItem('currentClient') || 'null');

  }

  login (email: string, password: string) : Observable<Client> {
    if (email.length ! > 0 && password.length ! > 0) {
      return new Observable(subscriber => {subscriber.error(new Error('Email and password are required'))});
    }

    this.clientService.clientLogin(email, password).subscribe((response :any) => {
      if (response.user) {
        this.currentClient = response.user;
        localStorage.setItem('currentClient', JSON.stringify(this.currentClient));
        return response.user;
      } else {
        return new Error('response.message');
      }
    });

    return new Observable(subscriber => {subscriber.error(new Error('Login failed.'))});

  }

  logout() : void{
    this.currentClient = null;
    localStorage.removeItem('currentClient');
    this.router.navigate(['/login']);
  }

  isAuthenticated() : boolean {
    return this.currentClient !== null;
  }

  getCurrentClient() : Client | null {
    return this.currentClient;
  }

}
