import { TestBed } from '@angular/core/testing';
import { Faq } from './faq';

describe('Faq', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Faq],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(Faq);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
