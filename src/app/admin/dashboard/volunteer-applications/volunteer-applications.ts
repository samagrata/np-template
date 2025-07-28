import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { VolunteerDataService } from '../../../../services/volunteer-data-service';
import { DynamicTable, TableColumn, TableConfig, TableItem } from '../../../../shared/components/dynamic-table/dynamic-table';
import { Applicant } from "./applicant/applicant";
import { Volunteer } from './volunteer';

@Component({
	selector: 'volunteer-applications',
	imports: [
    CommonModule,
    FormsModule,
    DynamicTable,
    Applicant
  ],
	templateUrl: './volunteer-applications.html'
})

export class VolunteerApplications {
  protected obs$!: Observable<Volunteer>;
  
	protected tableConfig: TableConfig = {
		expandable: true,
		editable: false
	}
	protected tableData: TableItem[] = [];
	protected tableColumns: TableColumn[] = [
		{ type: 'ID', key: 'sn', label: '#', sortable: true, filterable: false },
		{ type: 'String', key: 'name', label: 'Name', sortable: true, filterable: true },
		{ type: 'Date', key: 'applicationDate', label: 'Application Date', sortable: true, filterable: false }
	];

	protected vApplicants: Volunteer[] = [];
  protected Oobject = Object;

  constructor(
    private route: ActivatedRoute,
    private voluteerDS: VolunteerDataService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(() => {
      this.obs$ = {} as Observable<any>;
      this.obs$ = this.voluteerDS.populateData();
    });
  }

	ngDoCheck(): void {
		this.tableData = this.voluteerDS.getTableData();
		this.vApplicants = this.voluteerDS.getVolunteerData();
	}
}
