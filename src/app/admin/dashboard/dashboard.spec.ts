import { TestBed } from '@angular/core/testing';
import { AdminDashboard } from './dashboard';

describe('AdminDashboard', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboard],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AdminDashboard);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
