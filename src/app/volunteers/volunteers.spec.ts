import { TestBed } from '@angular/core/testing';
import { Volunteers } from './volunteers';

describe('Volunteers', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Volunteers],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(Volunteers);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
