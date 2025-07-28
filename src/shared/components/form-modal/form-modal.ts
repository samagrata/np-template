import { Component, Input } from '@angular/core';

@Component({
	selector: 'form-modal',
	templateUrl: './form-modal.html'
})

export class FormModal {
	// Input: Modal CSS ID
	@Input() cssID: string = 'formModal';
	// Input: Modal title
	@Input() title: string = 'New Entry';
	// Input: Callback function
	@Input() saveFunction!: () => void;

	executeCallback(): void {
		this.saveFunction();
  }
}
