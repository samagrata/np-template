import { Component } from '@angular/core';
import { SectionOne } from './section-one/section-one';
import { SectionTwo } from './section-two/section-two';
import { SectionThree } from './section-three/section-three';

@Component({
	selector: 'home-page',
	imports: [
		SectionOne, 
		SectionTwo, 
		SectionThree
	],
	templateUrl: './home.html'
})

export class Home {
	
}
