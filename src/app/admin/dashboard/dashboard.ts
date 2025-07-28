import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterLink, RouterOutlet, } from '@angular/router';

@Component({
	selector: 'admin-dashboard-page',
	imports: [CommonModule, RouterLink, RouterOutlet],
	templateUrl: './dashboard.html'
})

export class AdminDashboard {
	protected vClassActive = 'active';
	protected cClassActive = '';
	protected rClassActive = '';
	protected sClassActive = ''
	protected aClassActive = '';

	constructor(private location: Location) {}

	ngDoCheck(): void {
		switch (this.location.path()) {
			case ('/admin/dashboard'): {
				this.vClassActive = 'active';
				this.cClassActive = '';
				this.rClassActive = '';
				this.sClassActive = '';
				this.aClassActive = ''
				break;
			}
			case ('/admin/dashboard/visualizations'): {
				this.vClassActive = 'active';
				this.cClassActive = '';
				this.rClassActive = '';
				this.sClassActive = '';
				this.aClassActive = ''
				break;
			}
			case ('/admin/dashboard/case-registry'): {
				this.vClassActive = '';
				this.cClassActive = 'active';
				this.rClassActive = '';
				this.sClassActive = '';
				this.aClassActive = ''
				break;
			}
			case ('/admin/dashboard/resource-management'): {
				this.vClassActive = '';
				this.cClassActive = '';
				this.rClassActive = 'active';
				this.sClassActive = '';
				this.aClassActive = ''
				break;
			}
			case ('/admin/dashboard/story-management'): {
				this.vClassActive = '';
				this.cClassActive = '';
				this.rClassActive = '';
				this.sClassActive = 'active';
				this.aClassActive = ''
				break;
			}
			case ('/admin/dashboard/volunteer-applications'): {
				this.vClassActive = '';
				this.cClassActive = '';
				this.rClassActive = '';
				this.sClassActive = '';
				this.aClassActive = 'active'
				break;
			}
		}
  }
}
