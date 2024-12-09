import {Injectable} from '@angular/core';
import {CanActivate, Router, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }

  // This guard checks if the user is authenticated before allowing them to access a route.
  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isAuthenticated = this.authService.isAuthenticated();
    if (!isAuthenticated) {
      // If the user is not authenticated, redirect them to the login page.
      return this.router.navigate(['/login']);
    }
    // If the user is authenticated, allow them to access the route.
    return true;
  }
}
