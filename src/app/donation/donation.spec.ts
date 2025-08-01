import { TestBed } from '@angular/core/testing';
import { Donation } from './donation';

describe('Donation', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Donation],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(Donation);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(Donation);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, np-template');
  });
});
