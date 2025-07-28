import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api-service';
import { Router } from '@angular/router';
import { SessionService } from './session-service';
import { PathEnum } from '../enums/path-enum';
import { Credentials } from '../shared/interfaces/Credentials';
import { Token } from '../shared/interfaces/Token';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(
    private router: Router,
    private apiService: ApiService<Credentials>,
    private sessionService: SessionService
  ) {}

  login(credentials: Credentials): Observable<any> {
    this.sessionService.setItem('token', credentials.username);
    
    return this.apiService.postData(PathEnum.Login, credentials);
  }

  logout(): void {
    const val = this.sessionService.getItem('token');
    this.sessionService.removeItem(val);
    this.sessionService.removeItem('token');
    this.router.navigate([PathEnum.LoginPage]);
  }

  getToken(): Token {
    const val = this.sessionService.getItem('token');
    return this.sessionService.getItem(val);
  }

  isAuthenticated(): boolean {
    return !!this.getToken(); // Check if token exists
  }
}