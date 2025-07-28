import { TestBed } from '@angular/core/testing';
import { CaseRegistry } from './case-registry';

describe('CaseRegistry', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseRegistry],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(CaseRegistry);
    const comp = fixture.componentInstance;
    expect(comp).toBeTruthy();
  });
});
