import { Directive, ElementRef, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[inputAutoFocus]'
})

export class InputAutoFocus implements AfterViewInit {

  constructor(private el: ElementRef) { }

  ngAfterViewInit() {
    setTimeout(() => {
      this.el.nativeElement.focus();
    }, 0);
  }
}