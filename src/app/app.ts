import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Footer } from './footer/footer';
import { environment } from '../environments/environment';
import { AuthService } from '../services/auth.service';

@Component({
	selector: 'app-root',
	imports: [
		CommonModule,
		RouterLink,
		RouterOutlet,
		Footer
	],
	templateUrl: './app.html'
})

export class App {
	protected title = 'np-template';
	evars = environment;

  constructor(
    private location: Location,
    private authService: AuthService
  ) {}

	ngDoCheck(): void {
    this.evars.adminLoggedIn = this.authService.isAuthenticated();
		this.evars.dashboardPath = this.location.path().includes('admin/dashboard');
  }

  logout(): void {
    this.authService.logout();
  }
}
