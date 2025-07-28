import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  evars = environment;
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isAuthenticated()) {
      return true; // Allow access
    } else {
      this.router.navigate(['/admin/login']); // Redirect to login page
      return false; // Prevent access
    }
  }
}