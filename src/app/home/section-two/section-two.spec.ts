import { TestBed } from '@angular/core/testing';
import { SectionTwo } from './section-two';

describe('SectionTwo', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionTwo],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(SectionTwo);
    const comp = fixture.componentInstance;
    expect(comp).toBeTruthy();
  });
});
