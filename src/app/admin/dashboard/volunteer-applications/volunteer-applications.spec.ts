import { TestBed } from '@angular/core/testing';
import { VolunteerApplications } from './volunteer-applications';

describe('VolunteerApplications', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VolunteerApplications],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(VolunteerApplications);
    const comp = fixture.componentInstance;
    expect(comp).toBeTruthy();
  });
});
