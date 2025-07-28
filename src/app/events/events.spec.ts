import { TestBed } from '@angular/core/testing';
import { Events } from './events';

describe('Events', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Events],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(Events);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
