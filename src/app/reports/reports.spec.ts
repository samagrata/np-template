import { TestBed } from '@angular/core/testing';
import { Reports } from './reports';

describe('Reports', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Reports],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(Reports);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
