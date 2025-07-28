import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Volunteer } from '../admin/dashboard/volunteer-applications/volunteer';
import { VolunteerDataService } from '../../services/volunteer-data-service';
import { Notifications } from '../../shared/interfaces/Notifications';

@Component({
	selector: 'volunteers-page',
	imports: [CommonModule, FormsModule],
	templateUrl: './volunteers.html'
})

export class Volunteers {
  @ViewChild('volunteerForm') volunteerForm!: NgForm

	newItem: Volunteer = {
		id: 1,
		fullName: '',
		email: '',
		phone: '',
		ageRange: '',
		interests: [],
		availability: '',
		createdAt: '',
    updatedAt: ''
	}

	protected isDisabled: boolean = true;
  protected bhp: string = '';

	protected ageRangeOptions: string[] = ['18-25', '25-35', 
    '35-45', '45-55', '55-65', '65 >'];

	protected interestOptions: string[] = [
		'Education Programs',
		'Healthcare Support',
    'Environmental Conservation',
    'Disaster Relief',
    'Administrative Support',
    'Event Planning',
    'Other'
	];

  protected notifications: Notifications = {
    loadingMsg: '',
    successMsg: '',
    errorMsg: ''
  };

  constructor(
    private volunteerDS: VolunteerDataService
  ) {}

  onSubmit(formValue: any): void {
    if (formValue.bhp) {
      return;
    }

    delete formValue.bhp;

    this.notifications = this.volunteerDS.addVolunteerData(
      formValue, this.volunteerForm
    );
  }

	toggleEnable(): void {
		this.isDisabled = !this.isDisabled;
	}
}
