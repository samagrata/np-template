import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, TemplateRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CItem, ConfirmModal } from '../confirm-modal/confirm-modal';
import { ItemEnum } from '../../../enums/item-enum';

// Interface for table config
export interface TableConfig {
	expandable?: boolean; // Whether table has expandable content
	editable?: boolean; // Whether table can be edited
}

// Interface for a generic table item
export interface TableItem {
	[key: string]: any; // Allows any string key with any value type
}

// Interface for column definition
export interface TableColumn {
	type: string; // The type of column
	key: string; // The property key in TableItem
	label: string; // Display label for the column header
	sortable?: boolean; // Whether the column is sortable (default: false)
	filterable?: boolean; // Whether the column is filterable (default: false)
	editable?: boolean; // Whether the item is editable (default: false)
}

// Interface for data emit
export interface EmitDTData {
  existingItem: TableItem;
	item: TableItem;
	index: number;
  operation: string;
	showEdit: boolean;
	editable: boolean;
}

@Component({
	selector: 'dynamic-table',
	imports: [CommonModule, FormsModule, ConfirmModal],
	templateUrl: './dynamic-table.html'
})

export class DynamicTable implements OnInit, OnChanges {
	// Input: Table configurations
	@Input() config: TableConfig = {expandable: false, editable: false};
	// Input: The original data array to display
	@Input() data: TableItem[] = [];
	// Input: Column definitions
	@Input() columns: TableColumn[] = [];
	// Input: Number of items per page
	@Input() itemsPerPage: number = 10;
	// Input: Provided fields are editable
	@Input() editableFields: string[] = [];
	// Input: Ref to card template fragment
	@Input() cardFragRef!: TemplateRef<any>;
	// Input: Ref to dropdown template fragment
	@Input() dropdownFragRef!: TemplateRef<any>;
	// Output: Emit data to parent
	@Output() dataEmitter = new EventEmitter<EmitDTData>();

	math = Math; // for referencing in template

  protected currentItem!: TableItem;
  protected currentIndex!: number;
	protected itemEnum = ItemEnum;

	// --- Pagination State ---
	currentPage: number = 1; // Current active page
	totalPages: number = 1; // Total number of pages
	pagedData: TableItem[] = []; // Data for the current page

	// --- Sorting State ---
	sortColumn: string = ''; // Key of the column currently sorted
	sortDirection: 'asc' | 'desc' = 'asc'; // Sorting direction

	// --- Filtering State ---
	filterText: string = ''; // Text entered in the filter input

	// --- Internal Data ---
	protected sortedFilteredData: TableItem[] = []; // Data after sorting and filtering

	protected confirmItem: CItem = {} as CItem;

	// Toggle editable
	protected editable: boolean = false;
	// Show edit button
	protected showEdit: boolean = false;
	// Indicate changes to save
	protected saveChanges: boolean = false;
  
  protected emtitData: EmitDTData = {
    existingItem: {},
    item: this.currentItem,
    index: this.currentIndex,
    operation: '',
    showEdit: this.showEdit,
    editable: this.editable
  };

	constructor(
		private router: Router,
		protected location: Location
	) { }

	ngOnInit(): void {
		this.confirmItem = {} as CItem;
		this.showEdit = this.config.editable || false;
		this.processData();
	}

	// Lifecycle hook to detect changes in input properties
	ngOnChanges(changes: SimpleChanges): void {
		if (changes['data'] || changes['columns'] || changes['itemsPerPage']) {
			this.processData();
		}
	}

	/**
	 * Processes the input data by applying filtering, sorting, and pagination.
	 * This method is called whenever input data or table settings change.
	 */
	private processData(): void {
		let tempFilteredData = this.data;

		// 1. Apply Filtering
		if (this.filterText) {
			const lowerCaseFilterText = this.filterText.toLowerCase();
			tempFilteredData = this.data.filter(item => {
				// Check all filterable columns for a match
				return this.columns.some(col => {
					if (col.filterable && item[col.key] != null) {
						return String(item[col.key]).toLowerCase().includes(lowerCaseFilterText);
					}
					return false;
				});
			});
		}

		// 2. Apply Sorting
		if (this.sortColumn) {
			tempFilteredData.sort((a, b) => {
				const aValue = a[this.sortColumn];
				const bValue = b[this.sortColumn];

				// Handle null/undefined values by placing them at the end
				if (aValue == null && bValue == null) return 0;
				if (aValue == null) return 1;
				if (bValue == null) return -1;

				if (typeof aValue === 'string' && typeof bValue === 'string') {
					return this.sortDirection === 'asc' ?
						aValue.localeCompare(bValue) :
						bValue.localeCompare(aValue);
				} else if (typeof aValue === 'number' && typeof bValue === 'number') {
					return this.sortDirection === 'asc' ?
						aValue - bValue :
						bValue - aValue;
				}
				// Fallback for other types, treat as strings
				return this.sortDirection === 'asc' ?
					String(aValue).localeCompare(String(bValue)) :
					String(bValue).localeCompare(String(aValue));
			});
		}

		this.sortedFilteredData = tempFilteredData;
		this.updatePagination();
	}

	/**
	 * Updates pagination details (totalPages, pagedData) based on the
	 * currently sorted and filtered data.
	 */
	private updatePagination(): void {
		this.totalPages = Math.ceil(this.sortedFilteredData.length / this.itemsPerPage);

		// Ensure current page is valid after data changes
		if (this.currentPage > this.totalPages) {
			this.currentPage = this.totalPages || 1; // Default to 1 if no pages
		}
		if (this.currentPage < 1) {
			this.currentPage = 1;
		}

		const startIndex = (this.currentPage - 1) * this.itemsPerPage;
		const endIndex = startIndex + this.itemsPerPage;
		this.pagedData = this.sortedFilteredData.slice(startIndex, endIndex);
	}

	/**
	 * Handles page change event from pagination controls.
	 * @param page The new page number.
	 */
	onPageChange(page: number): void {
		if (page >= 1 && page <= this.totalPages) {
			this.currentPage = page;
			this.updatePagination();
		}
	}

	/**
	 * Handles column header click for sorting.
	 * @param columnKey The key of the column to sort by.
	 */
	onSort(columnKey: string): void {
		// Find the column definition to check if it's sortable
		const columnDef = this.columns.find(col => col.key === columnKey);
		if (!columnDef || !columnDef.sortable) {
			return; // Not a sortable column
		}

		if (this.sortColumn === columnKey) {
			// If same column, toggle direction
			this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			// If new column, set it and default to ascending
			this.sortColumn = columnKey;
			this.sortDirection = 'asc';
		}
		this.currentPage = 1; // Reset to first page on sort
		this.processData();
	}

	/**
	 * Handles filter input change event.
	 * @param event The input event.
	 */
	onFilter(value: string): void {
		this.filterText = value;
		this.currentPage = 1; // Reset to first page on filter
		this.processData();
	}

	/**
	 * Generates an array of page numbers for pagination controls.
	 */
	get pageNumbers(): number[] {
		return Array.from({ length: this.totalPages }, (_, i) => i + 1);
	}

	/**
	 * Determines the class for the sort icon (Bootstrap icons, e.g., caret-up, caret-down).
	 */
	getSortIcon(columnKey: string): string {
		if (this.sortColumn === columnKey) {
			return this.sortDirection === 'asc' ? 'bi bi-caret-up-fill' : 'bi bi-caret-down-fill';
		}
		return ''; // No icon if not sorted by this column
	}

	/**
	 * Switches to edit mode
	 */
	editModeOn(item: TableItem): void {
		this.showEdit = false;
		this.editable = true;
		item['editable'] = true;
    this.emtitData.existingItem = JSON.parse(JSON.stringify(item));
	}

	/**
	 * Delete an entry
	 */
	deleteEntry = (citem: CItem) => {
    this.emtitData.item = citem.item;
    this.emtitData.index = citem.idx;
    this.emtitData.operation = 'delete';
    // this.emiDataEvent();
    this.data = this.data.filter((item) => 
      item['sn'] !== this.emtitData.index
    );
		this.processData();
    document.getElementById('confirm-modal-close-btn')?.click();
    document.body.focus();
	}

	/**
	 * Saves the updated data
	 */
	saveUpdates(item: TableItem, idx: number): void {
    this.currentItem = item;
    this.currentIndex = idx;
		this.showEdit = true;
		this.editable = false;
    this.saveChanges = true;
		item['editable'] = false;
    this.emtitData.operation = 'update';
    this.emiDataEvent();
	}

	/**
	 * Switches edit mode off
	 */
	editModeOff(item: TableItem): void {
		this.showEdit = true;
		this.editable = false;
		item['editable'] = false;
	}

	/**
	 * Checks if current item is editable
	 */
	itemEditable(item: TableItem): boolean {
		return item['editable'];
	}

	/**
	 * Checks if current data item is editable
	 */
	itemDataEditable(item: TableItem, col: TableColumn): boolean {
		return item['editable'] && this.editableFields.includes(col.key);
	}

  checkForResourceCN(item: TableItem, col: TableColumn): boolean {
    // If column matches, allow edit only if data is not present
		return (col.key == 'resourceCN' ? item[col.key].length === 0 : true);
	}

	/**
	 * Set confirm item
	 */
	setConfirmItem(item: TableItem): void {
		this.confirmItem.type = this.itemEnum.TI;
		this.confirmItem.item = item;
    this.confirmItem.idx = item['sn'];
	}

	/**
	 * Get object keys
	 */
	getObjKeys(obj: Object): string[] {
		return Object.keys(obj);
	}

	navigateTo(path: string): void {
		// This ugly fix is needed since 
		// routerLink does not allow using 
		// dynamically constructed path.
		// Hence use:
		//   this.router.navigateByUrl(path);
		// or instead to open in a new tab use:
		const url = this.router.serializeUrl(this.router.createUrlTree([path]));
    window.open(url, '_blank');
	}

	newDate(dStr: string): Date {
		return new Date(dStr);
	}

	/**
	 * Emit table data
	 */
	emiDataEvent() {
    this.emtitData.item = this.currentItem;
    this.emtitData.index = this.currentIndex;
    this.emtitData.editable = this.editable;
    this.emtitData.showEdit = this.showEdit;
    this.dataEmitter.emit(this.emtitData);
  }
}