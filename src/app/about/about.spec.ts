import { TestBed } from '@angular/core/testing';
import { About } from './about';

describe('About', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [About],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(About);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(About);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, np-template');
  });
});
