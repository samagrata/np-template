import { TestBed } from '@angular/core/testing';
import { SOSubThree } from './so-sub-three';

describe('SOSubThree', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SOSubThree],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(SOSubThree);
    const comp = fixture.componentInstance;
    expect(comp).toBeTruthy();
  });
});
