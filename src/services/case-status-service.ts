import { Injectable } from '@angular/core';
import { CaseStatusEnum } from '../enums/case-status-enum';

@Injectable({
	providedIn: 'root'
})

export class CaseStatusService {
	private currentState = CaseStatusEnum.Nil;

	constructor() {}

	public getNextState(cs: CaseStatusEnum): CaseStatusEnum {
		switch (cs) {
			case CaseStatusEnum.Nil:
				this.currentState = CaseStatusEnum.Open;
				break;
			case CaseStatusEnum.Open:
				this.currentState = CaseStatusEnum.Active;
				break;
			case CaseStatusEnum.Active:
				this.currentState = CaseStatusEnum.Closed;
				break;
			case CaseStatusEnum.Closed:
				this.currentState = CaseStatusEnum.Closed;
				break;
		}

		return this.currentState;
	}
}