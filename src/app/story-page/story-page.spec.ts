import { TestBed } from '@angular/core/testing';
import { StoryPage } from './story-page';

describe('StoryPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoryPage],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(StoryPage);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
