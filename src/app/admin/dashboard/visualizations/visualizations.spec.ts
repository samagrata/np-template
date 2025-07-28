import { TestBed } from '@angular/core/testing';
import { Visualizations } from './visualizations';

describe('Visualizations', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Visualizations],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(Visualizations);
    const comp = fixture.componentInstance;
    expect(comp).toBeTruthy();
  });
});
