import { TestBed } from '@angular/core/testing';
import { SOSubOne } from './so-sub-one';

describe('SOSubOne', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SOSubOne],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(SOSubOne);
    const comp = fixture.componentInstance;
    expect(comp).toBeTruthy();
  });
});
