import { Component, Input } from '@angular/core';
import { Volunteer } from '../volunteer';

@Component({
	selector: 'applicant',
	templateUrl: './applicant.html'
})

export class Applicant {
	@Input()
  data!: Volunteer;
}
