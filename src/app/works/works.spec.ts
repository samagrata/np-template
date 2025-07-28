import { TestBed } from '@angular/core/testing';
import { Work } from './works';

describe('Work', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Work],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(Work);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
