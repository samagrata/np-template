import { Component, Input } from '@angular/core';

export interface CItem {
	type: string;
  idx: number;
	item: any;
}

@Component({
	selector: 'confirm-modal',
	templateUrl: './confirm-modal.html'
})

export class ConfirmModal {
	// Input: modal ID
	@Input() id: string = 'confirmModal';
	// Input: CItem
	@Input() citem: CItem = {} as CItem
	// Input: Callback function
	@Input() deleteEntryFunction!: (citem: CItem) => void;

	executeCallback(): void {
		this.deleteEntryFunction(this.citem);
  }
}
