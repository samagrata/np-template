import { TestBed } from '@angular/core/testing';
import { Affiliations } from './affiliations';

describe('Affiliations', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Affiliations],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(Affiliations);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
