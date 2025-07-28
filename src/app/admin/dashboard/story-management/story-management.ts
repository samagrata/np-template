import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ItemEnum } from '../../../../enums/item-enum';
import { StoryDataService } from '../../../../services/story-data-service';
import { CItem, ConfirmModal } from '../../../../shared/components/confirm-modal/confirm-modal';
import { DynamicTable, EmitDTData, TableColumn, TableConfig, TableItem } from '../../../../shared/components/dynamic-table/dynamic-table';
import { FormModal } from '../../../../shared/components/form-modal/form-modal';
import { Comment, Story } from './story';
import { ActivatedRoute } from '@angular/router';
import { Observable, merge } from 'rxjs';
import { Notifications } from '../../../../shared/interfaces/Notifications';
import { CaseDataService } from '../../../../services/case-data-service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
	selector: 'story-management',
	imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DynamicTable,
    FormModal,
    ConfirmModal
],
	templateUrl: './story-management.html'
})

export class StoryManagement {
  @ViewChild('topElement') topElement!: ElementRef;

  protected obs$!: Observable<any>;
  protected notifications: Notifications = {
    loadingMsg: '',
    successMsg: '',
    errorMsg: ''
  }

	tableConfig: TableConfig = {
		expandable: true,
		editable: true
	}
  protected editableFields: string[] = [
    'storyTitle', 'publish'
  ];
	tableData: TableItem[] = [];
	tableColumns: TableColumn[] = [
		{ type: 'ID', key: 'sn', label: '#', sortable: true, filterable: false },
		{ type: 'String', key: 'storyTitle', label: 'Title', sortable: true, filterable: true },
		{ type: 'Boolean', key: 'publish', label: 'Publish', sortable: true, filterable: false },
		{ type: 'Date', key: 'publishDate', label: 'Last Publish Date', sortable: true, filterable: false }
	];

	protected storyData: Story[] = [];

	protected storyForm!: FormGroup;
	protected storyEditForm!: FormGroup;
  
	protected caseNoOptions: string[] = [];
	protected itemEnum = ItemEnum;
	protected confirmItem: CItem = {} as CItem;

  protected base64Image: string | ArrayBuffer | null = null;
  protected imageUrl!: SafeResourceUrl;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private storyDS: StoryDataService,
    private caseDS: CaseDataService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.base64Image = null;

    this.storyForm = this.fb.group({
      caseNumber: ['', Validators.required],
			title: ['', Validators.required],
			fundGoal: ['', Validators.required],
			ssFile: [''],
			paragraphs: this.fb.array([]),
			carouselImages: this.fb.array([]),
			carousels: this.fb.array([]),
			fundsReceived: this.fb.array([]),
			fundsUsed: this.fb.array([])
		});

		this.storyEditForm = this.fb.group({
			editFundGoal: [''],
			editSSFile: [''],
			editParas: this.fb.array([]),
			editCarouselImages: this.fb.array([]),
			editCarousels: this.fb.array([]),
			editFundReceived: this.fb.array([]),
			editFundUsed: this.fb.array([])
		});

    this.route.params.subscribe(() => {
      this.obs$ = {} as Observable<any>;
      const obs1$ = this.caseDS.fetchCases();
      const obs2$ = this.storyDS.populateData();
      this.obs$ = merge(obs1$, obs2$);
    });
  }

	ngDoCheck() {
    const cases = this.caseDS.getCaseData();
    this.caseNoOptions = [];
    for (const cd of cases) {
      this.caseNoOptions.push(cd.caseNumber);
    }
		this.tableData = this.storyDS.getTableData();
		this.storyData = this.storyDS.getStoryData();
	}

	onSubmit = () => {
		if (this.storyForm.valid) {
      if (this.base64Image) {
        this.storyForm.patchValue({ssFile: this.base64Image});
      }
      
			this.notifications = this.storyDS.addStoryData(
        this.storyForm.value, this.storyForm
      );
		} else {
			this.notifications.errorMsg = 'Invalid inputs. Please correct errors.';
      this.topElement.nativeElement.scroll({ top: 0, left: 0, behavior: 'smooth' });
		}
	}

  handleDataEmit(data: EmitDTData) {
    if (Object.keys(data.existingItem).length === 0) return;

    switch (data.operation) {
      case 'update':
        this.saveEmittedData(data);
        break;
      case 'delete':
        this.deleteEmittedData(data.item['id']);
        break;
    }
  }

  saveEmittedData(data: EmitDTData): void {
    let storyRequest: Story = {
      id: 0,
      caseNumber: '',
      title: '',
      paragraphs: [],
      carouselImages: [],
      carousels: [],
      fundGoal: '',
      fundsReceived: [],
      ssFile: '',
      fundsUsed: [],
      comments: [],
      publish: false,
      publishDate: '' 
    }

    let existingStory: Story = {} as Story;
    this.storyData.forEach((v) => {
      if (data.existingItem['id'] === v.id) {
        existingStory = v;
      }
    });

    const formValue = this.storyEditForm.value;

    if (data.item['storyTitle'] != '' && existingStory.title != data.item['storyTitle']) {
      storyRequest.title = data.item['storyTitle'];
    }

    if (data.item['publish']) {
      const today = new Date();
      storyRequest.publishDate = today.toISOString().slice(0, 10);
      storyRequest.publish = true;
    }

    if (formValue['editFundGoal'] != '' && existingStory.fundGoal != formValue['editFundGoal']) {
      storyRequest.fundGoal = formValue['editFundGoal'];
    }

    if (formValue['editParas'].length > 0 && !this.compareArrays(existingStory.paragraphs, formValue['editParas'])) {
      storyRequest.paragraphs = existingStory.paragraphs.concat(formValue['editParas']);
    }

    if (formValue['editCarouselImages'].length > 0 && !this.compareArrays(existingStory.carouselImages, formValue['editCarouselImages'])) {
      storyRequest.carouselImages = existingStory.carouselImages.concat(formValue['editCarouselImages']);
    }

    if (formValue['editCarousels'].length > 0 && !this.compareArrays(existingStory.carousels, formValue['editCarousels'])) {
      storyRequest.carousels = existingStory.carousels.concat(formValue['editCarousels']);
    }

    if (formValue['editFundReceived'].length > 0 && !this.compareArrays(existingStory.fundsReceived, formValue['editFundReceived'])) {
      storyRequest.fundsReceived = existingStory.fundsReceived.concat(formValue['editFundReceived']);
    }

    if (formValue['editFundUsed'].length > 0 && !this.compareArrays(existingStory.fundsUsed, formValue['editFundUsed'])) {
      storyRequest.fundsUsed = existingStory.fundsUsed.concat(formValue['editFundUsed']);
    }

    if (this.base64Image) {
      storyRequest.ssFile = this.base64Image;
    }

    this.notifications = this.storyDS.patchItem(
      existingStory.id,
      storyRequest,
      data.index
    );

    // reset
    this.storyEditForm = this.fb.group({
      editTitle: [''],
			editFundGoal: [''],
			editSSFile: [''],
			editParas: this.fb.array([]),
			editCarouselImages: this.fb.array([]),
			editCarousels: this.fb.array([]),
			editFundReceived: this.fb.array([]),
			editFundUsed: this.fb.array([])
		});

    this.base64Image = null;

    this.obs$ = this.storyDS.populateData();
  }

  deleteEmittedData(id: number) {
    this.storyDS.deleteItem(id);
  }

  onCommentApprovalChange(storyID: number, comment: Partial<Comment>): void {
    if (comment.id) {
      comment.approved = !comment.approved
      this.notifications = this.storyDS.patchComment(storyID, comment.id, comment);
    }
  }

	setCurrentItem(obj: any): void {
    if ("type" in obj) {
      this.confirmItem.type = obj.type;
    }
    if ("id" in obj) {
      this.confirmItem.idx = obj.id;
    }
    if ("item" in obj) {
      this.confirmItem.item = obj.item;
    }
		
	}

	removeRenderedPara(itemIdx: number, idx: number) {
		this.storyDS.removePara(itemIdx, idx);
    this.storyData[itemIdx].paragraphs.splice(idx, 1);
	}

	removeRenderedCImg(itemIdx: number, idx: number) {
		this.storyDS.removeCImg(itemIdx, idx);
    this.storyData[itemIdx].carouselImages.splice(idx, 1);
	}

	removeRenderedCr(itemIdx: number, idx: number) {
		this.storyDS.removeCr(itemIdx, idx);
    this.storyData[itemIdx].carousels.splice(idx, 1);
	}

	removeRenderedRec(itemIdx: number, idx: number) {
		this.storyDS.removeRec(itemIdx, idx);
    this.storyData[itemIdx].fundsReceived.splice(idx, 1);
	}

	removeRenderedExpn(itemIdx: number, idx: number) {
		this.storyDS.removeExpn(itemIdx, idx);
    this.storyData[itemIdx].fundsUsed.splice(idx, 1);
	}

	get paragraphs() {
    return this.storyForm.get('paragraphs') as FormArray;
  }

	addParagraph() {
		this.paragraphs.push(
      this.fb.control('', Validators.required)
		);
  }

	removeParagraph(idx: number) {
		this.paragraphs.removeAt(idx);
  }

	get carouselImages() {
    return this.storyForm.get('carouselImages') as FormArray;
  }

	addCarouselImg() {
		this.carouselImages.push(
      this.fb.control('', Validators.required)
		);
  }

	removeCarouselImg(idx: number) {
		this.carouselImages.removeAt(idx);
  }

	get carousels() {
    return this.storyForm.get('carousels') as FormArray;
  }

	addCarousel() {
		this.carousels.push(
			this.fb.group({
				title: [''],
				text: [''],
				img: ['']
    	})
		);
  }

	removeCarousel(idx: number) {
		this.carousels.removeAt(idx);
  }

	get fundsReceived() {
    return this.storyForm.get('fundsReceived') as FormArray;
  }

	addFundReceived() {
		this.fundsReceived.push(
			this.fb.group({
        id: [0],
				date: [''],
				referenceNumber: [''],
				remark: [''],
				amount: ['']
    	})
		);
  }

	removeFundReceived(idx: number) {
		this.fundsReceived.removeAt(idx);
  }

	get fundsUsed() {
    return this.storyForm.get('fundsUsed') as FormArray;
  }

	addFundUsed() {
		this.fundsUsed.push(
			this.fb.group({
        id: [0],
				name: [''],
				amount: ['']
    	})
		);
  }

	removeFundUsed(idx: number) {
		this.fundsUsed.removeAt(idx);
  }

	get editParas() {
    return this.storyEditForm.get('editParas') as FormArray;
  }

	get editCarouselImages() {
    return this.storyEditForm.get('editCarouselImages') as FormArray;
  }

	get editCarousels() {
    return this.storyEditForm.get('editCarousels') as FormArray;
  }

	get editFundUsed() {
    return this.storyEditForm.get('editFundUsed') as FormArray;
  }

	get editFundReceived() {
    return this.storyEditForm.get('editFundReceived') as FormArray;
  }

	addEditParaIn() {
		this.editParas.push(
			this.fb.control('')
		);
	}

	removeEditParaIn(idx: number) {
		this.editParas.removeAt(idx);
	}

	addEditCImgIn() {
		this.editCarouselImages.push(
			this.fb.control('')
		);
  }

	removeEditCImgIn(idx: number) {
		this.editCarouselImages.removeAt(idx);
  }

	addEditCrIn() {
		this.editCarousels.push(
			this.fb.group({
				title: [''],
				text: [''],
				img: ['']
    	})
		);
  }

	removeEditCrIn(idx: number) {
		this.editCarousels.removeAt(idx);
  }

	addEditDonIn() {
		this.editFundReceived.push(
			this.fb.group({
        id: [0],
				date: [''],
				referenceNumber: [''],
				remark: [''],
				amount: ['']
    	})
		);
  }

	removeEditDonIn(idx: number) {
		this.editFundReceived.removeAt(idx);
  }

	addEditExpnIn() {
		this.editFundUsed.push(
			this.fb.group({
        id: [0],
				name: [''],
				amount: ['']
    	})
		);
  }

	removeEditExpnIn(idx: number) {
		this.editFundUsed.removeAt(idx);
  }

	removeEntry = (citem: CItem) => {
		switch(this.confirmItem.type) {
			case(this.itemEnum.Para):
				this.removeRenderedPara(this.confirmItem.item.sn, this.confirmItem.idx);
				break;
			case(this.itemEnum.CImg):
				this.removeRenderedCImg(this.confirmItem.item.sn, this.confirmItem.idx);
				break;
			case(this.itemEnum.Cr):
				this.removeRenderedCr(this.confirmItem.item.sn, this.confirmItem.idx);
				break;
      case(this.itemEnum.Rec):
				this.removeRenderedRec(this.confirmItem.item.sn, this.confirmItem.idx);
				break;
			case(this.itemEnum.Expn):
				this.removeRenderedExpn(this.confirmItem.item.sn, this.confirmItem.idx);
				break;
		}
    document.getElementById('smConfirmModal-close-btn')?.click();
	}

  convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        resolve(reader.result as string);
      };

      reader.onerror = (error) => {
        reject(error);
      };
    });
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      try {
        this.base64Image = await this.convertToBase64(file);
      } catch (error) {
        console.error('Error reading file:', error);
      }
    }
  }

  b64ToImage(idx: number): SafeResourceUrl {
    // Construct the full data URI
    // const fullDataUri = `data:image/png;base64,${this.storyData[idx].ssFile}`;
    const fullDataUri = `${this.storyData[idx].ssFile}`;
    // Sanitize the URL to mark it as safe for resource URLs
    this.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fullDataUri);
    return this.imageUrl;
  }

  compareArrays(arr1: any, arr2: any) {
    if (arr1.length !== arr2.length) {
      return false;
    }

    for (let i = 0; i < arr1.length; i++) {
      const val1 = arr1[i];
      const val2 = arr2[i];

      if (Array.isArray(val1) && Array.isArray(val2)) {
        if (!this.compareArrays(val1, val2)) {
          return false;
        }
      } 
      else if (typeof val1 === 'object' && val1 !== null && 
                typeof val2 === 'object' && val2 !== null) {
        if (JSON.stringify(val1) !== JSON.stringify(val2)) {
          return false;
        }
      }
      else if (val1 !== val2) {
        return false;
      }
    }

    return true;
  }

  // buildFormData = (formValue: any): FormData => {
  //   const formData = new FormData();

  //   Object.keys(this.storyForm.controls).forEach(key => {
  //     const control = this.storyForm.controls[key];
  //       // Handle individual controls (e.g., FormControl)
  //       if (control instanceof FormControl) {
  //         if (control.value !== null && control.value !== undefined) {
  //           formData.append(key, control.value);
  //         }
  //       } 
  //       // Handle nested FormGroups (if any)
  //       else if (control instanceof FormGroup) {
  //         // Recursively append values from nested FormGroup
  //         // This example assumes a flat structure for simplicity; adjust for deeper nesting.
  //         for (const nestedKey in control.controls) {
  //           if (control.controls.hasOwnProperty(nestedKey)) {
  //             formData.append(`${key}[${nestedKey}]`, control.controls[nestedKey].value);
  //           }
  //         }
  //       }
  //   });
    
  //   const pFormArray = this.storyForm.get('paragraphs') as FormArray;
  //   pFormArray.controls.forEach((itemControl, index) => {
  //     if (itemControl instanceof FormGroup) {
  //       for (const itemKey in itemControl.controls) {
  //         if (itemControl.controls.hasOwnProperty(itemKey)) {
  //           formData.append(`paragraphs[${index}][${itemKey}]`, itemControl.controls[itemKey].value);
  //         }
  //       }
  //     } else if (itemControl instanceof FormControl) {
  //       // If the FormArray contains simple FormControls
  //       formData.append(`paragraphs[${index}]`, itemControl.value);
  //     }
  //   });

  //   const cIFormArray = this.storyForm.get('carouselImages') as FormArray;
  //   cIFormArray.controls.forEach((itemControl, index) => {
  //     if (itemControl instanceof FormGroup) {
  //       for (const itemKey in itemControl.controls) {
  //         if (itemControl.controls.hasOwnProperty(itemKey)) {
  //           formData.append(`carouselImages[${index}][${itemKey}]`, itemControl.controls[itemKey].value);
  //         }
  //       }
  //     } else if (itemControl instanceof FormControl) {
  //       // If the FormArray contains simple FormControls
  //       formData.append(`carouselImages[${index}]`, itemControl.value);
  //     }
  //   });

  //   const cFormArray = this.storyForm.get('carousels') as FormArray;
  //   cFormArray.controls.forEach((itemControl, index) => {
  //     if (itemControl instanceof FormGroup) {
  //       for (const itemKey in itemControl.controls) {
  //         if (itemControl.controls.hasOwnProperty(itemKey)) {
  //           formData.append(`carousels[${index}][${itemKey}]`, itemControl.controls[itemKey].value);
  //         }
  //       }
  //     } else if (itemControl instanceof FormControl) {
  //       // If the FormArray contains simple FormControls
  //       formData.append(`carousels[${index}]`, itemControl.value);
  //     }
  //   });

  //   const fRFormArray = this.storyForm.get('fundsReceived') as FormArray;
  //   fRFormArray.controls.forEach((itemControl, index) => {
  //     if (itemControl instanceof FormGroup) {
  //       for (const itemKey in itemControl.controls) {
  //         if (itemControl.controls.hasOwnProperty(itemKey)) {
  //           formData.append(`fundsReceived[${index}][${itemKey}]`, itemControl.controls[itemKey].value);
  //         }
  //       }
  //     } else if (itemControl instanceof FormControl) {
  //       // If the FormArray contains simple FormControls
  //       formData.append(`fundsReceived[${index}]`, itemControl.value);
  //     }
  //   });

  //   const fUFormArray = this.storyForm.get('fundsUsed') as FormArray;
  //   fUFormArray.controls.forEach((itemControl, index) => {
  //     if (itemControl instanceof FormGroup) {
  //       for (const itemKey in itemControl.controls) {
  //         if (itemControl.controls.hasOwnProperty(itemKey)) {
  //           formData.append(`fundsUsed[${index}][${itemKey}]`, itemControl.controls[itemKey].value);
  //         }
  //       }
  //     } else if (itemControl instanceof FormControl) {
  //       // If the FormArray contains simple FormControls
  //       formData.append(`fundsUsed[${index}]`, itemControl.value);
  //     }
  //   });

  //   return formData;
  // }
}
