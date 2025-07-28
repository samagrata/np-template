import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription, tap } from 'rxjs';
import { Resource } from '../app/admin/dashboard/resource-management/resource';
import { TableItem } from '../shared/components/dynamic-table/dynamic-table';
import { Notifications } from '../shared/interfaces/Notifications';
import { Subject } from '../shared/interfaces/Subject';
import { ApiService } from './api-service';

export interface ResourceRequest {
  type: string;
  caseNumber: string;
  engagedUntil: string;
  hours: number;
  remark: string;
  subject: Subject;
}

@Injectable({
	providedIn: 'root'
})

export class ResourceDataService {
  private obs$!: Observable<any>;
  private sub!: Subscription;
  
	private tableData: TableItem[] = [
		// {
		// 	sn: 1,
		// 	type: ResourceTypeEnum.HR,
		// 	name: `Duane Singh`,
		// 	caseNumber: `AA115`,
		// 	engagedSince: `2024-01-11`,
		// 	engagedUntil: ``,
		// 	hours: 122,
		// 	remark: `This is a example remark about the resource`,
		// 	paths: { caseNumber: 'story/1' },
		// 	editable: false
		// },
		// {
		// 	sn: 2,
		// 	type: ResourceTypeEnum.MR,
		// 	name: `Medvision OC`,
		// 	caseNumber: `CD342`,
		// 	engagedSince: `2024-01-15`,
		// 	engagedUntil: `2024-01-20`,
		// 	hours: 48,
		// 	remark: `This is a example remark about the resource`,
		// 	paths: { caseNumber: 'story/1' },
		// 	editable: false
		// },
		// {
		// 	sn: 3,
		// 	type: ResourceTypeEnum.HR,
		// 	name: `Ahmad Kash`,
		// 	caseNumber: `BE214`,
		// 	engagedSince: `2024-01-09`,
		// 	engagedUntil: `2024-02-01`,
		// 	hours: 125,
		// 	remark: `This is a example remark about the resource`,
		// 	paths: { caseNumber: 'story/1' },
		// 	editable: false
		// }
	];

	private resourceData: Resource[] = [
		// {
		// 	id: 1,
		// 	type: ResourceTypeEnum.HR,
		// 	name: `Maki Dun`,
		// 	caseNumber: `AA115`,
		// 	contactNumber: '8847477444',
		// 	address: '58 Pharetra. St.',
		// 	city: 'Chimbote',
		// 	state: 'CH',
		// 	zip: '3837',
		// 	remark: 'remark 1'
		// },
		// {
		// 	id: 2,
		// 	type: ResourceTypeEnum.MR,
		// 	name: `Medvision OC`,
		// 	caseNumber: `AA115`,
		// 	contactNumber: '8847477444',
		// 	address: '91 Curabitur St.',
		// 	city: 'Kurram',
		// 	state: 'TN',
		// 	zip: '4729',
		// 	remark: 'remark 2'
		// },
		// {
		// 	id: 3,
		// 	type: ResourceTypeEnum.HR,
		// 	name: `San Dutt`,
		// 	caseNumber: `AA115`,
		// 	contactNumber: '8847477444',
		// 	address: '96 Posuere Rd.',
		// 	city: 'Bauchi',
		// 	state: 'MH',
		// 	zip: '2234',
		// 	remark: 'remark 3'
		// },
		// {
		// 	id: 4,
		// 	type: ResourceTypeEnum.HR,
		// 	name: `Neel Hari`,
		// 	caseNumber: `AA115`,
		// 	contactNumber: '8847477444',
		// 	address: '91 Curabitur St.',
		// 	city: 'Kurram',
		// 	state: 'TN',
		// 	zip: '4729',
		// 	remark: 'remark 4'
		// }
	];

	constructor(
    private apiService: ApiService<any>
  ) {}

  populateData(): Observable<any> {
    this.tableData = [];
		this.resourceData = [];
    const pobs$ = this.apiService.getData('/resources');
    
    pobs$.subscribe({
      next: (data: Resource[]) => {
        this.resourceData = data;
        for (const [idx, rd] of data.entries()) {
          this.tableData.push({
            sn: (idx + 1),
            id: rd.id,
            type: rd.type,
            name: rd.subject.name,
            resourceCN: rd.caseNumber || '',
            engagedSince: rd.engagedSince,
            engagedUntil: rd.engagedUntil,
            hours: rd.hours,
            remark: rd.remark,
            paths: this.getPaths(rd),
            editable: false
          });
        }
      },
      error: (e: HttpErrorResponse ) => {
        console.error("API error:", e.error);
      },
      complete: () => null
    });

    return pobs$;
  }

	getTableData(): TableItem[] {
		return this.tableData;
	}

	addTableData(item: TableItem): void {
		this.tableData.push(item);
	}

	getResourceData(): Resource[] {
		return this.resourceData;
	}

  addResourceData(item: any, form?: NgForm): Notifications {
    let noti: Notifications = {
      loadingMsg: '',
      successMsg: '',
      errorMsg: ''
    };

    let resourceRequest: ResourceRequest = {
      caseNumber: item.caseNumber || '',
      type: item.type || '',
      engagedUntil: item.engagedUntil || '',
      hours: item.hours || '0',
      remark: item.remark || '',
      subject: {
        id: 0,
        name: item.name,
        email: item.email,
        contactNumber: item.contactNumber,
        address: item.address,
        city: item.city,
        state: item.state,
        zip: item.zip
      }
    };

    this.obs$ = this.apiService.postData(
      '/resources', resourceRequest
    ).pipe(
      tap(() => noti.loadingMsg = 'Submitting...')
    )
    
    this.sub = this.obs$.subscribe(
      {
        next: (returnedResource: any) => {
          noti.loadingMsg = '';
          noti.successMsg = 'Form submitted!';
          if (typeof form != 'undefined') form.reset();
          document.getElementById("close-form-modal")?.click();

          this.resourceData.push(returnedResource);
          
          const nsn = this.tableData.length + 1;
          this.tableData.push({
            sn: nsn,
            id: returnedResource.id,
            type: returnedResource.type,
            name: returnedResource.subject.name,
            resourceCN: returnedResource.caseNumber || '',
            engagedSince: returnedResource.engagedSince,
            engagedUntil: returnedResource.engagedUntil,
            hours: returnedResource.hours,
            remark: returnedResource.remark,
            paths: this.getPaths(returnedResource),
            editable: false
          });
        },
        error: (e: HttpErrorResponse ) => {
          console.error("API error:", e.error);
          noti.loadingMsg = '';
          noti.errorMsg = e.error;
        },
        complete: () => null
      }
    );

    return noti;
  }

  patchItem(id: number, resourceRequest: ResourceRequest, index: number): Notifications {
    let noti: Notifications = {
      loadingMsg: '',
      successMsg: '',
      errorMsg: ''
    };

    this.obs$ = this.apiService.patch(`/resources/${id}`, resourceRequest);
    
    this.sub = this.obs$.subscribe({
      next: (updatedResource: Resource) => {
        console.info('Success!');
        console.info('updatedResource:', updatedResource);
        noti.loadingMsg = '';
        noti.successMsg = 'Changes saved!';

        this.resourceData[index].caseNumber = updatedResource.caseNumber;
        this.resourceData[index].type = updatedResource.type;
        this.resourceData[index].engagedSince = updatedResource.engagedSince;
        this.resourceData[index].engagedUntil = updatedResource.engagedUntil;
        this.resourceData[index].hours = updatedResource.hours;
        this.resourceData[index].remark = updatedResource.remark;

        this.resourceData[index].subject = updatedResource.subject;
        
        this.tableData[index]['name'] = updatedResource.subject.name;
        this.tableData[index]['type'] = updatedResource.type;
        this.tableData[index]['resourceCN'] = updatedResource.caseNumber || '';
        this.tableData[index]['engagedSince'] = updatedResource.engagedSince;
        this.tableData[index]['engagedUntil'] = updatedResource.engagedUntil;
        this.tableData[index]['hours'] = updatedResource.hours;
        this.tableData[index]['remark'] = updatedResource.remark;
        this.tableData[index]['editable'] = false;
      },
      error: (e: HttpErrorResponse ) => {
        console.error('API error:', e.error);
        noti.loadingMsg = '';
        noti.errorMsg = e.error;
      },
      complete: () => null
    });

    return noti;
  }

  deleteItem(id: number): Notifications {
    let noti: Notifications = {
      loadingMsg: '',
      successMsg: '',
      errorMsg: ''
    };

    this.apiService.deleteData(`/resources/${id}`).subscribe({
      next: () => {
        console.info(`Resource (${id}) deleted!`);
        noti.loadingMsg = '';
        noti.successMsg = 'Item deleted!';
      },
      error: (e: HttpErrorResponse ) => {
        console.error('API error:', e.error);
        noti.loadingMsg = '';
        noti.errorMsg = e.error;
      },
      complete: () => null
    }).unsubscribe();

    return noti;
  }

  associatedStory(rd: Resource): number {
    return 1;
  }

  getPaths(rd: Resource): any {
    const storyID = this.associatedStory(rd);
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
}