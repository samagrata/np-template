import { TestBed } from '@angular/core/testing';
import { SectionOne } from './section-one';

describe('SectionOne', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionOne],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(SectionOne);
    const comp = fixture.componentInstance;
    expect(comp).toBeTruthy();
  });
});
