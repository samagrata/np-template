import { TestBed } from '@angular/core/testing';
import { Home } from './home';

describe('Home', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(Home);
    const comp = fixture.componentInstance;
    expect(comp).toBeTruthy();
  });
});
