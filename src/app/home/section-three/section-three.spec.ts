import { TestBed } from '@angular/core/testing';
import { SectionThree } from './section-three';

describe('SectionThree', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionThree],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(SectionThree);
    const comp = fixture.componentInstance;
    expect(comp).toBeTruthy();
  });
});
