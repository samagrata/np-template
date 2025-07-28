import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, tap } from 'rxjs';
import { Subscription } from 'rxjs/internal/Subscription';
import { Volunteer } from '../app/admin/dashboard/volunteer-applications/volunteer';
import { TableItem } from '../shared/components/dynamic-table/dynamic-table';
import { Notifications } from '../shared/interfaces/Notifications';
import { ApiService } from './api-service';

@Injectable({
  providedIn: 'root'
})

export class VolunteerDataService {
  private obs$!: Observable<any>;
  private sub!: Subscription;
  
  private tableData: TableItem[] = [];
  private volunteerData: Volunteer[] = [];

  constructor(
    private apiService: ApiService<any>
  ) {}

  populateData(): Observable<any> {
    this.volunteerData = [];
    this.tableData = []
    const pobs$ = this.apiService.getData('/volunteers');
    
    pobs$.subscribe({
      next: (data: Volunteer[]) => {
        this.volunteerData = data;
        
        for (const [idx, vd] of data.entries()) {
          this.tableData.push({
            sn: (idx + 1),
            name: vd.fullName,
            applicationDate: vd.createdAt
          });
        }
      },
      error: (e: HttpErrorResponse ) => {
        console.error("API error:", e);
      },
      complete: () => null
    });

    return pobs$;
  }

  getTableData(): TableItem[] {
    return this.tableData;
  }

  addTableData(vd: Volunteer): void {
    const nsn = this.tableData.length + 1;
    this.tableData.push({
      sn: nsn,
      name: vd.fullName,
      applicationDate: vd.createdAt
    });
  }

  getVolunteerData(): Volunteer[] {
    return this.volunteerData;
  }

  addVolunteerData(
    item: Partial<Volunteer>, form?: NgForm
  ): Notifications {

    let noti: Notifications = {
      loadingMsg: '',
      successMsg: '',
      errorMsg: ''
    };

    this.obs$ = this.apiService.postData(
      '/volunteers', item
    ).pipe(
      tap(() => noti.loadingMsg = 'Submitting...')
    );

    this.sub = this.obs$.subscribe(
      {
        next: () => {
          noti.loadingMsg = '';
          noti.successMsg = 'Application submitted!';
          if (typeof form != 'undefined') form.reset();
        },
        error: (e: HttpErrorResponse ) => {
          console.error("API error:", e);
          noti.loadingMsg = '';
          noti.errorMsg = e.error;
        },
        complete: () => null
      }
    );

    return noti;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}