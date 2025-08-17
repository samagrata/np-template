import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RelativeTimePipe } from '../../pipes/relative-time-pipe';
import { StoryDataService } from '../../services/story-data-service';
import { Notifications } from '../../shared/interfaces/Notifications';
import { Comment, Story, Donation } from '../admin/dashboard/story-management/story';
import { ReceivablesComponent } from './receivables/receivables-component';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
	selector: 'story-page',
	imports: [
		CommonModule, 
		FormsModule, 
		RelativeTimePipe, 
		ReceivablesComponent
	],
	templateUrl: './story-page.html'
})

export class StoryPage {
  @ViewChild('commentForm') commentForm!: NgForm

  protected obs$!: Observable<any>;
	protected story: Story = {} as Story;

	protected comment: Comment = {
    id: 0,
		email: '',
		name: '',
		text: '',
		createdAt: '',
		approved: false
	};

	protected storyID: string | null = null;

	protected prcnt: number = 0.0;
	protected totalReceived: number = 0.0;
  protected bhp: string = '';
  protected donations: Donation[] = [];
  stringToNum = Number;
  
  protected notifications: Notifications = {
    loadingMsg: '',
    successMsg: '',
    errorMsg: ''
  };

	constructor(
    private route: ActivatedRoute,
    private storyDS: StoryDataService,
    private sanitizer: DomSanitizer
  ) { }

	ngOnInit(): void {
    this.route.params.subscribe(() => {
      this.storyID = this.route.snapshot.paramMap.get('id');
      if (this.storyID != null) {
        this.obs$ = this.storyDS.fetchStory(parseInt(this.storyID));

        this.obs$.subscribe({
          next: (data: Story) => {
            this.story = data;
          },
          error: (e: HttpErrorResponse ) => {
            console.error("API error:", e);
          },
          complete: () => null
        });
      }
    });
	}

  ngDoCheck() {
    if (this.story.id > 0) {
      this.donations = this.story.fundsReceived;
      this.totalReceived = 0;
      for (const el of this.story.fundsReceived) {
        this.totalReceived = this.totalReceived + parseFloat(el.amount);
      }

      this.prcnt = (this.totalReceived / this.parseCurrency(this.story.fundGoal)) * 100
    }
  }

  onSubmit(formValue: any): void {
    if (formValue.bhp || this.storyID === '' || this.storyID === null) {
      return;
    }

    delete formValue.bhp;

    const returningData = this.storyDS.addStoryComment(
      parseInt(this.storyID), formValue, this.commentForm
    );

    this.story.comments = returningData['comments'];
    this.notifications = returningData['notifications'];
  }

	parseCurrency(currencyString: string): number {
		const cleanedString = currencyString.replace(/[^\d.-]/g, '');
		return parseFloat(cleanedString);
	}

	enInFormat(num: number): string {
		return new Intl.NumberFormat("en-IN").format(num);
	}

	getTotal = () => {
		let total = 0.0;
		for (const fu of this.story.fundsUsed) {
			total = total + this.parseCurrency(fu.amount.toString());
		}
		return this.enInFormat(total);
	}

  b64ToImage(): SafeResourceUrl {
    // Construct the full data URI
    // const fullDataUri = `data:image/png;base64,${this.storyData[idx].ssFile}`;
    const fullDataUri = `${this.story.ssFile}`;
    // Sanitize the URL to mark it as safe for resource URLs
    const imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fullDataUri);
    return imageUrl;
  }
}
