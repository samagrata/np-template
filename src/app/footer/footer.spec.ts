import { TestBed } from '@angular/core/testing';
import { Footer } from './footer';

describe('Footer', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Footer],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(Footer);
    const comp = fixture.componentInstance;
    expect(comp).toBeTruthy();
  });
});
