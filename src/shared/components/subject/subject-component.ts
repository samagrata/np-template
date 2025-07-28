import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject } from '../../interfaces/Subject';

export interface CaseSubjectEmit {
  existingItem: Subject;
  subject: Subject;
  index: number;
}

@Component({
	selector: 'subject-component',
	imports: [FormsModule],
	templateUrl: './subject-component.html'
})

export class SubjectComponent {
  @Input() editable: Boolean = false;
  @Input() saveChanges: Boolean = false;
  @Input() index: number = 0;
	@Input() sub: Subject = {
    id: 0,
		name: '',
    email: '',
		contactNumber: '',
		address: '',
		city: '',
		state: '',
		zip: ''
	};
	@Output() dataEmitter = new EventEmitter<CaseSubjectEmit>();

  protected dataEmit: CaseSubjectEmit = {} as CaseSubjectEmit;

  protected existingItem!: Subject;

  ngOnInit() {
    this.existingItem = JSON.parse(JSON.stringify(this.sub));
    this.dataEmit.existingItem = this.existingItem;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['saveChanges'] && !changes['saveChanges'].firstChange) {
      this.emitData();
    }
  }

  emitData() {
    this.dataEmit.subject = this.sub;
    this.dataEmit.index = this.index;
    this.dataEmitter.emit(this.dataEmit);
  }
}
