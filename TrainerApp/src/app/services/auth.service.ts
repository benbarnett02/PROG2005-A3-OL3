import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiService } from './api.service';

export interface User {
  email: string;
  id: number;
  name: string;
  gender: string;
  dob: string;
  is_active: number;
  personaltrainer_id: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(
    private http: HttpClient,
    private router: Router,
    private apiService: ApiService
  ) {
    console.log('Initializing AuthService');
    const savedUser = localStorage.getItem('currentUser');
    console.log('Saved user from localStorage:', savedUser);
    this.currentUserSubject = new BehaviorSubject<User | null>(
      JSON.parse(savedUser || 'null')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Auth error occurred:', error);
    let errorMessage = 'An error occurred during authentication';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      console.error('Client error:', error.error.message);
      errorMessage = error.error.message;
    } else {
      // Server-side error
      console.error('Server error:', error);
      console.error('Status:', error.status);
      console.error('Error body:', error.error);
      errorMessage = error.error?.message || `Server error: ${error.status}`;
    }
    
    return throwError(() => new Error(errorMessage));
  }

  login(email: string, password: string): Observable<User> {
    console.log('Login attempt for email:', email);
    return this.apiService.trainerLogin(email, password).pipe(
      tap(trainer => console.log('Trainer login successful:', trainer)),
      map(trainer => {
        console.log('Converting trainer to user:', trainer);
        const user: User = {
          email: trainer.email,
          id: trainer.personaltrainer_id,
          name: trainer.name,
          gender: trainer.gender,
          dob: trainer.dob,
          is_active: trainer.is_active,
          personaltrainer_id: trainer.personaltrainer_id
        };
        console.log('Created user object:', user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }),
      catchError(error => {
        console.error('Login error:', error);
        return this.handleError(error);
      })
    );
  }

  logout() {
    console.log('Logging out user');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const isAuth = this.currentUserValue !== null && this.currentUserValue.is_active === 1;
    console.log('Authentication check:', isAuth, 'Current user:', this.currentUserValue);
    return isAuth;
  }
}
