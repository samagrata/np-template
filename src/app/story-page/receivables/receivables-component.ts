import { Component, Input, OnInit } from '@angular/core';
import { DynamicTable, TableItem, TableColumn } from '../../../shared/components/dynamic-table/dynamic-table';
import { Donation } from '../../admin/dashboard/story-management/story';

@Component({
	selector: 'receivables-component',
  imports: [DynamicTable],
	template: `
    <dynamic-table
      [data]="tableData"
      [columns]="tableColumns"
      [itemsPerPage]="5">
    </dynamic-table>
  `
})

export class ReceivablesComponent implements OnInit {
	// Input: Table data
	@Input() tData: Donation[] = [];
  
  tableData: TableItem[] = [];
  tableColumns: TableColumn[] = [
    { type: 'ID', key: 'sn', label: '#', sortable: true, filterable: true },
    { type: 'Date', key: 'date', label: 'Date', sortable: true, filterable: true },
    { type: 'String', key: 'referenceNumber', label: 'Reference Number', sortable: false, filterable: true },
    { type: 'String', key: 'remark', label: 'Remark/Note', sortable: true, filterable: true },
    { type: 'Number', key: 'amount', label: 'Amount', sortable: false, filterable: false }
  ];

  ngOnInit(): void {
    this.tableData = this.tData;
  }
}
