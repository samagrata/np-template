import { TestBed } from '@angular/core/testing';
import { StoryManagement } from './story-management';

describe('StoryManagement', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoryManagement],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(StoryManagement);
    const comp = fixture.componentInstance;
    expect(comp).toBeTruthy();
  });
});
