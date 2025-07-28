import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface FileData {
  name: string;
  file: File | null;
}

@Component({
  selector: 'file-upload',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './file-upload.html'
})

export class FileUploadComponent {
  @Input() nameField = false;
  @Output() dataEmitted = new EventEmitter<FileData>();

  protected fileData!: FileData;

  ngOnInit(): void {
    this.fileData = {
      name: '',
      file: null
    };
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fileData.file = input.files[0];
    }

    this.dataEmitted.emit(this.fileData);
  }
}