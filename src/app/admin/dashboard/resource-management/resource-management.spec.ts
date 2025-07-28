import { TestBed } from '@angular/core/testing';
import { ResourceManagement } from './resource-management';

describe('ResourceManagement', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceManagement],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(ResourceManagement);
    const comp = fixture.componentInstance;
    expect(comp).toBeTruthy();
  });
});
