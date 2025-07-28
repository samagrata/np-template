import { Component } from '@angular/core';
import { SOSubOne } from './so-sub-one/so-sub-one';
import { SOSubTwo } from './so-sub-two/so-sub-two';
import { SOSubThree } from './so-sub-three/so-sub-three';

@Component({
  selector: 'section-one',
  imports: [SOSubOne, SOSubTwo, SOSubThree],
  templateUrl: './section-one.html'
})

export class SectionOne {
  
}
