import { TestBed } from '@angular/core/testing';
import { SOSubTwo } from './so-sub-two';

describe('SOSubTwo', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SOSubTwo],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(SOSubTwo);
    const comp = fixture.componentInstance;
    expect(comp).toBeTruthy();
  });
});
