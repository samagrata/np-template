import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { merge, Observable } from 'rxjs';
import { ResourceTypeEnum } from '../../../../enums/resource-type-enum';
import { CaseDataService } from '../../../../services/case-data-service';
import { ResourceDataService, ResourceRequest } from '../../../../services/resource-data-service';
import { DynamicTable, TableColumn, TableConfig, TableItem } from '../../../../shared/components/dynamic-table/dynamic-table';
import { FormModal } from '../../../../shared/components/form-modal/form-modal';
import { SubjectComponent } from "../../../../shared/components/subject/subject-component";
import { Notifications } from '../../../../shared/interfaces/Notifications';
import { Subject } from '../../../../shared/interfaces/Subject';
import { Case } from '../case-registry/case';
import { Resource } from './resource';

enum Children {
  CS = 'subject-component',
  DT = 'dynamic-table'
}

@Component({
	selector: 'resource-management',
	imports: [
    CommonModule,
    FormsModule,
    DynamicTable,
    FormModal,
    SubjectComponent
],
	templateUrl: './resource-management.html'
})

export class ResourceManagement implements OnInit {
  @ViewChild('resourceForm') resourceForm!: NgForm;

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
  protected editableFields: string[] = [
    'resourceCN', 'name', 'engagedUntil', 'hours', 'remark'
  ];
	protected tableData: TableItem[] = [];
	protected tableColumns: TableColumn[] = [
		{ type: 'ID', key: 'sn', label: '#', sortable: true, filterable: false },
		{ type: 'Dropdown', key: 'type', label: 'Type', sortable: true, filterable: true },
		{ type: 'String', key: 'name', label: 'Name', sortable: true, filterable: true },
		{ type: 'Dropdown', key: 'resourceCN', label: 'Case Number', sortable: true, filterable: true },
		{ type: 'Date', key: 'engagedSince', label: 'Engaged Since', sortable: true, filterable: true },
		{ type: 'Date', key: 'engagedUntil', label: 'Engaged Until', sortable: true, filterable: true },
		{ type: 'Number', key: 'hours', label: 'Hrs Clocked', sortable: true, filterable: false },
		{ type: 'Text', key: 'remark', label: 'Remarks', sortable: false, filterable: true }
	];

  protected newItem: Resource = {
    id: 0,
    type: '',
    caseNumber: '',
    engagedSince: '',
    engagedUntil: '',
    hours: '0',
    remark: '',
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

	protected typeOptions: ResourceTypeEnum[] = [
    ResourceTypeEnum.HR, ResourceTypeEnum.MR
  ];
	protected nilEnum = ResourceTypeEnum.Nil;
	protected caseNoOptions: string[] = [];

	protected selectedDDItem: ResourceTypeEnum = ResourceTypeEnum.Nil;
  protected selectedCNDItem: string = '';

  protected resources: Resource[] = [];
	protected cases: Case[] = [];

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

  constructor(
    private route: ActivatedRoute,
    private resourceDS: ResourceDataService,
    private caseDS: CaseDataService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(() => {
      this.obs$ = {} as Observable<any>;
      const cobs$ = this.caseDS.fetchCases();
      const pobs$ = this.resourceDS.populateData();
      this.obs$ = merge(cobs$, pobs$);
      this.obs$.subscribe(() => {
        this.cases = this.caseDS.getCaseData();
        this.caseNoOptions = [];
        for (const cd of this.cases) {
          this.caseNoOptions.push(cd.caseNumber);
        }
      });
    });
	}

  ngDoCheck() {
		this.tableData = this.resourceDS.getTableData();
		this.resources = this.resourceDS.getResourceData();
  }
	
	/**
	 * Register type dropdown change
	 */
	onTDChange(value: ResourceTypeEnum): void {
		this.selectedDDItem = value;
	}

	/**
	 * Get type dropdown selection
	 */
	getTypeSelection(dds: ResourceTypeEnum): ResourceTypeEnum {
		return this.selectedDDItem === ResourceTypeEnum.Nil ? dds : this.selectedDDItem;
	}

  /**
	 * Register case number dropdown change
	 */
	onCNDChange(value: string): void {
		this.selectedCNDItem = value;
	}

	/**
	 * Get case number dropdown selection
	 */
	getCNSelection(dds: string): string {
		return (this.selectedCNDItem === '' || this.selectedCNDItem === null) ? dds : this.selectedCNDItem;
	}

	onSubmit = () => {
    const formValue: ResourceRequest = this.resourceForm.value;
    if (this.resourceForm.valid) {
      this.notifications = this.resourceDS.addResourceData(formValue);
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
          this.opType = processedItem.data.operation;
          this.existingTableItem = processedItem.data.existingItem;
          this.updatedTableItem = processedItem.data.item;
          this.updatedTableItem['type'] = this.selectedDDItem;
          this.updatedTableItem['resourceCN'] = this.selectedCNDItem;
          this.itemIndex = processedItem.data.index;
        }
        
        this.nextExpectedChildIndex++;
      } else {
        break;
      }
    }
  }

  saveEmittedData() {
    if (Object.keys(this.existingTableItem).length === 0) return;

    let resourceRequest: ResourceRequest = {
      caseNumber: this.existingTableItem['resourceCN'],
      type: this.existingTableItem['type'],
      engagedUntil: this.existingTableItem['engagedUntil'],
      hours: this.existingTableItem['hours'],
      remark: this.existingTableItem['remark'],
      subject: {
        id: 0,
        name: this.existingSubjectItem.name,
        contactNumber: this.existingSubjectItem.contactNumber,
        email: this.existingSubjectItem.email,
        address: this.existingSubjectItem.address,
        city: this.existingSubjectItem.city,
        state: this.existingSubjectItem.state,
        zip: this.existingSubjectItem.zip
      }
    };

    if (this.existingTableItem['resourceCN'] != this.updatedTableItem['resourceCN']) {
      resourceRequest.caseNumber = this.updatedTableItem['resourceCN'];
    }
    if (this.existingTableItem['type'] != this.updatedTableItem['type']) {
      resourceRequest.type = this.updatedTableItem['type'];
    }
    if (this.existingTableItem['engagedUntil'] != this.updatedTableItem['engagedUntil']) {
      resourceRequest.engagedUntil = this.updatedTableItem['engagedUntil'];
    }
    if (this.existingTableItem['hours'] != this.updatedTableItem['hours']) {
      resourceRequest.hours = this.updatedTableItem['hours'];
    }
    if (this.existingTableItem['remark'] != this.updatedTableItem['remark']) {
      resourceRequest.remark = this.updatedTableItem['remark'];
    }

    if (this.existingSubjectItem.name != this.updatedSubject.name) {
      resourceRequest.subject.name = this.updatedSubject.name;
    }
    if (this.existingSubjectItem.email != this.updatedSubject.email) {
      resourceRequest.subject.email = this.updatedSubject.email;
    }
    if (this.existingSubjectItem.contactNumber != this.updatedSubject.contactNumber) {
      resourceRequest.subject.contactNumber = this.updatedSubject.contactNumber;
    }
    if (this.existingSubjectItem.address != this.updatedSubject.address) {
      resourceRequest.subject.address = this.updatedSubject.address;
    }
    if (this.existingSubjectItem.city != this.updatedSubject.city) {
      resourceRequest.subject.city = this.updatedSubject.city;
    }
    if (this.existingSubjectItem.state != this.updatedSubject.state) {
      resourceRequest.subject.state = this.updatedSubject.state;
    }
    if (this.existingSubjectItem.zip != this.updatedSubject.zip) {
      resourceRequest.subject.zip = this.updatedSubject.zip;
    }
    
    this.notifications = this.resourceDS.patchItem(
      this.existingTableItem['id'],
      resourceRequest,
      this.itemIndex
    );
  }

  deleteEmittedData() {
    if (Object.keys(this.existingTableItem).length === 0) return;
    
    this.caseDS.deleteItem(this.existingTableItem['id']);
  }
}
