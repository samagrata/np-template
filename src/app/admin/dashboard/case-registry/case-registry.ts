import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { CaseDataService, CaseRequest } from '../../../../services/case-data-service';
import { DynamicTable, TableColumn, TableConfig, TableItem } from '../../../../shared/components/dynamic-table/dynamic-table';
import { FormModal } from '../../../../shared/components/form-modal/form-modal';
import { SubjectComponent } from "../../../../shared/components/subject/subject-component";
import { Notifications } from '../../../../shared/interfaces/Notifications';
import { Subject } from '../../../../shared/interfaces/Subject';
import { Case } from './case';

enum Children {
  CS = 'subject-component',
  DT = 'dynamic-table'
}

@Component({
  selector: 'case-registry',
  imports: [
    CommonModule,
    FormsModule,
    DynamicTable,
    FormModal,
    SubjectComponent
],
  templateUrl: './case-registry.html'
})

export class CaseRegistry {
  @ViewChild('caseForm') caseForm!: NgForm;

  protected sub!: Subscription;

  protected obs$!: Observable<any>;
  protected notifications: Notifications = {
    loadingMsg: '',
    successMsg: '',
    errorMsg: ''
  }

  protected tableConfig: TableConfig = {
		expandable: true,
		editable: true
	}
	protected tableData: TableItem[] = [];
	protected tableColumns: TableColumn[] = [
		{ type: 'ID', key: 'sn', label: '#', sortable: true, filterable: false },
		{ type: 'String', key: 'caseNumber', label: 'Case Number', sortable: true, filterable: true },
		{ type: 'String', key: 'caseStatus', label: 'Status', sortable: true, filterable: false },
		{ type: 'Date', key: 'openingDate', label: 'Opening Date', sortable: true, filterable: true },
		{ type: 'Date', key: 'closingDate', label: 'Closing Date', sortable: true, filterable: false },
		{ type: 'Number', key: 'noOfRs', label: 'Resources', sortable: false, filterable: false },
		{ type: 'Number', key: 'tHours', label: 'Total Hrs', sortable: false, filterable: false }
	];

  protected newItem: Case = {
    id: 0,
    caseNumber: '',
    openingDate: '',
    closingDate: '',
    noOfRs: 0,
    tHours: 0,
    subject: {
      id: 0,
      name: '',
      contactNumber: '',
      email: '',
      address: '',
      city: '',
      state: '',
      zip: ''
    }
  };

  protected cEnum = Children;
  private emittedDataQueue: any[] = [];
  private expectedOrder: string[] = [this.cEnum.CS, this.cEnum.DT];
  private nextExpectedChildIndex: number = 0;
  protected Oobject = Object;

  protected existingTableItem: TableItem = {} as TableItem;
  protected updatedTableItem: TableItem = {} as TableItem;
  protected existingSubjectItem: Subject = {} as Subject;
  protected updatedSubject: Subject = {} as Subject;
  protected itemIndex: number = 0;
  protected opType: string = '';

	protected cases: Case[] = [];

  constructor(
    private route: ActivatedRoute,
    private caseDS: CaseDataService
  ) {}

	ngOnInit(): void {
    this.sub = this.route.params.subscribe(() => {
      this.obs$ = {} as Observable<any>;
      this.obs$ = this.caseDS.populateData();
    });
	}

  ngDoCheck() {
		this.tableData = this.caseDS.getTableData();
		this.cases = this.caseDS.getCaseData();
  }

	onSubmit = () => {
    const formValue: CaseRequest = this.caseForm.value;
		if (this.caseForm.valid) {
			this.notifications = this.caseDS.addCaseData(formValue);
		} else {
      this.notifications.errorMsg = 'Invalid inputs. Please correct errors.';
		}
	}

  handleDataEmit(data: any, childIdentifier: string) {
    this.emittedDataQueue.push({ data, childIdentifier });

    this.processEmittedDataInSequence();
    switch (this.opType) {
      case 'update':
        this.saveEmittedData();
        break;
      case 'delete':
        this.deleteEmittedData();
        break;
    }
  }

  private processEmittedDataInSequence() {
    while (
      this.emittedDataQueue.length > 0 &&
        this.nextExpectedChildIndex < this.expectedOrder.length
    ) {
      const nextExpectedChild = this.expectedOrder[this.nextExpectedChildIndex];
      const foundIndex = this.emittedDataQueue.findIndex(item => item.childIdentifier === nextExpectedChild);

      if (foundIndex !== -1) {
        const processedItem = this.emittedDataQueue.splice(foundIndex, 1)[0];

        if (processedItem.childIdentifier == this.cEnum.CS) {
          this.existingSubjectItem = processedItem.data.existingItem;
          this.updatedSubject = processedItem.data.subject;
        }
        
        if (processedItem.childIdentifier == this.cEnum.DT) {
          this.existingTableItem = processedItem.data.existingItem;
          this.updatedTableItem = processedItem.data.item;
          this.itemIndex = processedItem.data.index;
          this.opType = processedItem.data.operation;
        }
        
        this.nextExpectedChildIndex++;
      } else {
        break;
      }
    }
  }

  saveEmittedData() {
    if (Object.keys(this.existingTableItem).length === 0) return;

    let caseRequest: CaseRequest = {
      caseNumber: '',
      closingDate: '',
      subject: {
        id: 0,
        name: '',
        contactNumber: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zip: ''
      }
    };

    if (this.existingTableItem['caseNumber'] != this.updatedTableItem['caseNumber']) {
      caseRequest.caseNumber = this.updatedTableItem['caseNumber'];
    }
    if (this.existingTableItem['closingDate'] != this.updatedTableItem['closingDate']) {
      caseRequest.closingDate = this.updatedTableItem['closingDate'];
    }

    if (this.existingSubjectItem.name != this.updatedSubject.name) {
      caseRequest.subject.name = this.updatedSubject.name;
    }
    if (this.existingSubjectItem.email != this.updatedSubject.email) {
      caseRequest.subject.email = this.updatedSubject.email;
    }
    if (this.existingSubjectItem.contactNumber != this.updatedSubject.contactNumber) {
      caseRequest.subject.contactNumber = this.updatedSubject.contactNumber;
    }
    if (this.existingSubjectItem.address != this.updatedSubject.address) {
      caseRequest.subject.address = this.updatedSubject.address;
    }
    if (this.existingSubjectItem.city != this.updatedSubject.city) {
      caseRequest.subject.city = this.updatedSubject.city;
    }
    if (this.existingSubjectItem.state != this.updatedSubject.state) {
      caseRequest.subject.state = this.updatedSubject.state;
    }
    if (this.existingSubjectItem.zip != this.updatedSubject.zip) {
      caseRequest.subject.zip = this.updatedSubject.zip;
    }
    
    this.notifications = this.caseDS.patchItem(
      this.existingTableItem['id'],
      caseRequest,
      this.itemIndex
    );
  }

  deleteEmittedData() {
    if (Object.keys(this.existingTableItem).length === 0) return;
    
    this.caseDS.deleteItem(this.existingTableItem['id']);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
