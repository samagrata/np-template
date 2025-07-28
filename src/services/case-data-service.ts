import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription, tap } from 'rxjs';
import { Case } from '../app/admin/dashboard/case-registry/case';
import { CaseStatusEnum } from '../enums/case-status-enum';
import { TableItem } from '../shared/components/dynamic-table/dynamic-table';
import { Notifications } from '../shared/interfaces/Notifications';
import { Subject } from '../shared/interfaces/Subject';
import { ApiService } from './api-service';

export interface CaseRequest {
  caseNumber: string;
  closingDate: string;
  subject: Subject;
}

@Injectable({
	providedIn: 'root'
})

export class CaseDataService {
  private obs$!: Observable<any>;
  private sub!: Subscription;
  private isComplete: boolean = false;
  
	private tableData: TableItem[] = [
		// {
		// 	sn: 1,
		// 	caseNumber: `AA115`,
		// 	caseStatus: CaseStatusEnum.Open,
		// 	openingDate: `2024-01-11`,
		// 	closingDate: ``,
		// 	noOfRs: 0,
		// 	tHours: 0,
		// 	reports: ``,
		// 	paths: { caseNumber: 'story/1' },
		// 	editable: false
		// },
		// {
		// 	sn: 2,
		// 	caseNumber: `BE214`,
		// 	caseStatus: CaseStatusEnum.Active,
		// 	openingDate: `2024-01-02`,
		// 	closingDate: ``,
		// 	noOfRs: 8,
		// 	tHours: 96,
		// 	reports: ``,
		// 	paths: { caseNumber: 'story/1' },
		// 	editable: false
		// },
		// {
		// 	sn: 3,
		// 	caseNumber: `CD342`,
		// 	caseStatus: CaseStatusEnum.Closed,
		// 	openingDate: `2024-01-05`,
		// 	closingDate: `2024-02-12`,
		// 	noOfRs: 7,
		// 	tHours: 82,
		// 	reports: ``,
		// 	paths: { caseNumber: 'story/1' },
		// 	editable: false
		// }
	];

	private caseData: Case[] = [
		// {
		// 	id: 1,
		// 	caseNumber: `AA111`,
		// 	storyID: '',
		// 	openingDate: `2024-02-14`,
    //  closingDate: ``,
		// 	name: 'Aji Kar',
		// 	contactNumber: '9434433433',
		// 	address: 'Euismod Road',
		// 	city: 'Bikal',
		// 	state: 'MP',
		// 	zip: '232245'
		// },
		// {
		// 	id: 2,
		// 	caseNumber: `AA112`,
		// 	storyID: '1',
		// 	openingDate: `2024-02-14`,
    //  closingDate: ``,
		// 	name: 'Myra Haq',
		// 	contactNumber: '9834785427',
		// 	address: '209 Proin St.',
		// 	city: 'Quesada',
		// 	state: 'KA',
		// 	zip: '5164'
		// },
		// {
		// 	id: 3,
		// 	caseNumber: `CD342`,
		// 	storyID: '1',
		// 	openingDate: `2024-02-14`,
    //  closingDate: `2024-02-12`,
		// 	name: 'Des Juarez',
		// 	contactNumber: '834628271',
		// 	address: '40 Blandit Avenue',
		// 	city: 'Piracicaba',
		// 	state: 'DL',
		// 	zip: '3837'
		// }
	];

	constructor(
    private apiService: ApiService<any>
  ) {}

  populateData(): Observable<any> {
    this.tableData = [];
		this.caseData = [];
    this.isComplete = false;
    const pobs$ = this.apiService.getData('/cases');
    
    pobs$.subscribe({
      next: (data: any[]) => {
        this.caseData = data;
        for (const [idx, cd] of data.entries()) {
          this.tableData.push({
            sn: (idx + 1),
            id: cd.id,
            caseNumber: cd.caseNumber,
            caseStatus: this.getCaseStatus(cd),
            openingDate: cd.openingDate,
            closingDate: cd.closingDate || '',
            noOfRs: cd.noOfRs,
            tHours: cd.tHours,
            reports: ``,
            paths: this.getPaths(cd),
            editable: false
          });
        }
      },
      error: (e: HttpErrorResponse ) => {
        console.error("API error:", e.error);
      },
      complete: () => this.isComplete = true
    });

    return pobs$;
  }

	getTableData(): TableItem[] {
		return this.tableData;
	}
	
	addTableData(item: TableItem): void {
		this.tableData.push(item);
	}

	getCaseData(): Case[] {
		return this.caseData;
	}

  fetchCases(): Observable<any> {
    this.isComplete = false;
    const cobs$ = this.apiService.getData('/cases');
    
    cobs$.subscribe({
      next: (data: any[]) => {
        this.caseData = data;
      },
      error: (e: HttpErrorResponse ) => {
        console.error("API error:", e.error);
      },
      complete: () => this.isComplete = true
    });
    
		return cobs$;
	}

  addCaseData(caseItem: any, form?: NgForm): Notifications {
    this.isComplete = false;
    let noti: Notifications = {
      loadingMsg: '',
      successMsg: '',
      errorMsg: ''
    };

    let caseRequest: CaseRequest = {
      caseNumber: caseItem.caseNumber || '',
      closingDate: caseItem.closingDate || '',
      subject: {
        id: 0,
        name: caseItem.name,
        email: caseItem.email,
        contactNumber: caseItem.contactNumber,
        address: caseItem.address,
        city: caseItem.city,
        state: caseItem.state,
        zip: caseItem.zip
      }
    };

    this.obs$ = this.apiService.postData(
      '/cases', caseRequest
    ).pipe(
      tap(() => noti.loadingMsg = 'Submitting...')
    )
    
    this.sub = this.obs$.subscribe(
      {
        next: (returnedCase: any) => {
          noti.loadingMsg = '';
          noti.successMsg = 'Form submitted!';
          if (typeof form != 'undefined') form.reset();
          document.getElementById("close-form-modal")?.click();

          this.caseData.push(returnedCase);
          
          const nsn = this.tableData.length + 1; 
          this.tableData.push({
            sn: nsn,
            id: returnedCase.id,
            caseNumber: returnedCase.caseNumber,
            caseStatus: this.getCaseStatus(returnedCase),
            openingDate: returnedCase.openingDate,
            closingDate: returnedCase.closingDate,
            noOfRs: returnedCase.noOfRs,
            tHours: returnedCase.tHours,
            reports: ``,
            paths: this.getPaths(returnedCase),
            editable: false
          });
        },
        error: (e: HttpErrorResponse ) => {
          console.error("API error:", e.error);
          noti.loadingMsg = '';
          noti.errorMsg = e.error;
        },
        complete: () => this.isComplete = true
      }
    );

    return noti;
  }

  patchItem(id: number, caseRequest: CaseRequest, index: number): Notifications {
    this.isComplete = false;
    let noti: Notifications = {
      loadingMsg: '',
      successMsg: '',
      errorMsg: ''
    };

    this.obs$ = this.apiService.patch(`/cases/${id}`, caseRequest);
    
    this.sub = this.obs$.subscribe({
      next: (updatedCase: Case) => {
        console.info('Success!');
        console.info('updatedCase:', updatedCase);
        noti.loadingMsg = '';
        noti.successMsg = 'Changes saved!';

        this.caseData[index].caseNumber = updatedCase.caseNumber;
        this.caseData[index].closingDate = updatedCase.closingDate;
        this.caseData[index].subject = updatedCase.subject;

        this.tableData[index]['caseNumber'] = updatedCase.caseNumber;
        this.tableData[index]['caseStatus'] = this.getCaseStatus(updatedCase);
        this.tableData[index]['openingDate'] = updatedCase.openingDate;
        this.tableData[index]['closingDate'] = updatedCase.closingDate;
        this.tableData[index]['noOfRs'] = updatedCase.noOfRs;
        this.tableData[index]['tHours'] = updatedCase.tHours;
        this.tableData[index]['reports'] = '';
        this.tableData[index]['editable'] = false;
      },
      error: (e: HttpErrorResponse ) => {
        console.error('API error:', e.error);
        noti.loadingMsg = '';
        noti.errorMsg = e.error;
      },
      complete: () => this.isComplete = true
    });

    return noti;
  }

  deleteItem(id: number): Notifications {
    this.isComplete = false;
    let noti: Notifications = {
      loadingMsg: '',
      successMsg: '',
      errorMsg: ''
    };

    this.apiService.deleteData(`/cases/${id}`).subscribe({
      next: () => {
        console.info(`Case (${id}) deleted!`);
        noti.loadingMsg = '';
        noti.successMsg = 'Item deleted!';
      },
      error: (e: HttpErrorResponse ) => {
        console.error('API error:', e.error);
        noti.loadingMsg = '';
        noti.errorMsg = e.error;
      },
      complete: () => this.isComplete = true
    }).unsubscribe();

    return noti;
  }

  getCaseStatus(cd: Case): CaseStatusEnum {
    if (cd.closingDate) {
      return CaseStatusEnum.Closed;
    }
    if (cd.openingDate) {
      if (cd.noOfRs > 0) {
        return CaseStatusEnum.Active;
      }
      return CaseStatusEnum.Open;
    }
    return CaseStatusEnum.Nil
  }

  associatedStory(cd: Case): number {
    return 1;
  }

  getPaths(cd: Case): any {
    const storyID = this.associatedStory(cd);
    if (storyID) {
      return {
        caseNumber: `story/${storyID}`
      }
    }

    return {}
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  getIsComplete(): boolean {
    return this.isComplete;
  }
}