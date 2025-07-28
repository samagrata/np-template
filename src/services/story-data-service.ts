import { Injectable } from '@angular/core';
import { Comment, Story } from '../app/admin/dashboard/story-management/story';
import { TableItem } from '../shared/components/dynamic-table/dynamic-table';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, Subscription, tap } from 'rxjs';
import { ApiService } from './api-service';
import { FormGroup, NgForm } from '@angular/forms';
import { Notifications } from '../shared/interfaces/Notifications';

@Injectable({
	providedIn: 'root'
})

export class StoryDataService {
  protected obs$!: Observable<any>;
  private sub!: Subscription;

	private tableData: TableItem[] = [];

	private storyData: Story[] = [];
  
  constructor(
    private apiService: ApiService<any>
  ) {}

  populateData(): Observable<any> {
    this.tableData = [];
    const pobs$ = this.apiService.getData('/stories');
    
    pobs$.subscribe({
      next: (data: Story[]) => {
        this.storyData = data;
        for (const [idx, story] of data.entries()) {
          this.tableData.push({
            sn: (idx + 1),
            id: story.id,
            storyTitle: story.title,
            publish: story.publish,
            publishDate: story.publishDate,
            paths: { storyTitle: `story/${story.id}` },
            editable: false
          });
        }
      },
      error: (e: HttpErrorResponse ) => {
        console.error("API error:", e.error);
      },
      complete: () => null
    });

    return pobs$;
  }

  fetchStory(id: number): Observable<any> {
    const obs$ = this.apiService.getData(
      `/stories/${id}`
    )

    return obs$;
  }

  addStoryData(storyRequest: Partial<Story>, form?: FormGroup): Notifications {
    let noti: Notifications = {
      loadingMsg: '',
      successMsg: '',
      errorMsg: ''
    };

    this.obs$ = this.apiService.postData(
      '/stories', storyRequest
    ).pipe(
      tap(() => noti.loadingMsg = 'Submitting...')
    )
    
    this.sub = this.obs$.subscribe({
      next: (returnedStory: Story) => {
        noti.loadingMsg = '';
        noti.successMsg = 'Form submitted!';
        if (typeof form != 'undefined') form.reset();
        document.getElementById("close-form-modal")?.click();

        this.storyData.push(returnedStory);
        
        const nsn = this.tableData.length + 1;
        this.tableData.push({
          sn: nsn,
          id: returnedStory.id,
          storyTitle: returnedStory.title,
          publish: returnedStory.publish,
          publishDate: returnedStory.publishDate,
          paths: { storyTitle: `story/${returnedStory.id}` },
          editable: false
        });
      },
      error: (e: HttpErrorResponse ) => {
        console.error("API error:", e.error);
        noti.loadingMsg = '';
        noti.errorMsg = e.error;
      },
      complete: () => null
    });

    return noti;
  }
  
  patchItem(id: number, storyRequest: Story, index: number): Notifications {
    let noti: Notifications = {
      loadingMsg: '',
      successMsg: '',
      errorMsg: ''
    };

    this.obs$ = this.apiService.patch(`/stories/${id}`, storyRequest);
    
    this.sub = this.obs$.subscribe({
      next: (updatedStory: Story) => {
        console.info('Success!');
        console.info('updatedStory:', updatedStory);
        noti.loadingMsg = '';
        noti.successMsg = 'Changes saved!';

        this.storyData[index] = updatedStory;

        // this.storyData[index].title = updatedStory.title || '';
        // this.storyData[index].paras = updatedStory.paras || [];
        // this.storyData[index].carouselImages = updatedStory.carouselImages || [];
        // this.storyData[index].carousels = updatedStory.carousels || [];
        // this.storyData[index].fundGoal = updatedStory.fundGoal || '';
        // this.storyData[index].fundsReceived = updatedStory.fundsReceived || [];
        // this.storyData[index].fundsUsed = updatedStory.fundsUsed || [];
        // this.storyData[index].ssFile = updatedStory.ssFile || '';
        // this.storyData[index].publish = updatedStory.publish || false;
        // this.storyData[index].publishDate = updatedStory.publishDate || '';
        // this.storyData[index].comments = updatedStory.comments || [];

        // this.tableData[index]['storyTitle'] = updatedStory.title || '';
        // this.tableData[index]['publish'] = updatedStory.publish || false;
        // this.tableData[index]['publishDate'] = updatedStory.publishDate || '';
        // this.tableData[index]['editable'] = false;
      },
      error: (e: HttpErrorResponse ) => {
        console.error('API error:', e.error);
        noti.loadingMsg = '';
        noti.errorMsg = e.error;
      },
      complete: () => null
    });

    return noti;
  }

  deleteItem(id: number): Notifications {
    let noti: Notifications = {
      loadingMsg: '',
      successMsg: '',
      errorMsg: ''
    };

    this.apiService.deleteData(`/stories/${id}`).subscribe({
      next: () => {
        console.info(`Story (${id}) deleted!`);
        noti.loadingMsg = '';
        noti.successMsg = 'Item deleted!';
      },
      error: (e: HttpErrorResponse ) => {
        console.error('API error:', e.error);
        noti.loadingMsg = '';
        noti.errorMsg = e.error;
      },
      complete: () => null
    }).unsubscribe();

    return noti;
  }

  addStoryComment(storyID: number, comment: Partial<Comment>, form?: NgForm): any {
    let noti: Notifications = {
      loadingMsg: '',
      successMsg: '',
      errorMsg: ''
    };

    let rData: Comment[] = [];
    
    this.sub = this.apiService.postData(
      `/stories/${storyID}/comments`, comment
    ).subscribe({
      next: (returnedComments: Comment[]) => {
        noti.loadingMsg = '';
        noti.successMsg = 'Form submitted!';
        if (typeof form != 'undefined') form.reset();

        rData = returnedComments;
      },
      error: (e: HttpErrorResponse ) => {
        console.error("API error:", e.error);
        noti.loadingMsg = '';
        noti.errorMsg = e.error;
      },
      complete: () => null
    });

    return { comments: rData, notifications: noti };
  }

  patchComment(storyID: number, id: number, comment: Partial<Comment>): Notifications {
    let noti: Notifications = {
      loadingMsg: '',
      successMsg: '',
      errorMsg: ''
    };

    this.sub = this.apiService.patch(
      `/stories/${storyID}/comments/${id}`, comment
    ).subscribe({
      next: (returnedComment: Comment) => {
        noti.loadingMsg = '';
        noti.successMsg = 'Updated!';
      },
      error: (e: HttpErrorResponse ) => {
        console.error("API error:", e.error);
        noti.loadingMsg = '';
        noti.errorMsg = e.error;
      },
      complete: () => null
    });

    return noti;
  }

	getTableData(): TableItem[] {
		return this.tableData;
	}

	addTableData(item: TableItem): void {
		this.tableData.push(item);
	}

	getStory(idx: number): Story {
		return this.storyData[idx-1];
	}

	getStoryData(): Story[] {
		return this.storyData;
	}

	removePara(itemIdx: number, idx: number) {
		this.storyData[itemIdx].paragraphs.splice(idx, 1);
	}

	removeCImg(itemIdx: number, idx: number) {
		this.storyData[itemIdx].carouselImages.splice(idx, 1);
	}

	removeCr(itemIdx: number, idx: number) {
		this.storyData[itemIdx].carousels.splice(idx, 1);
	}

	removeRec(itemIdx: number, idx: number) {
		this.storyData[itemIdx].fundsReceived.splice(idx, 1);
	}

	removeExpn(itemIdx: number, idx: number) {
		this.storyData[itemIdx].fundsUsed.splice(idx, 1);
	}

	getYesterday(): Date {
		const today = new Date();
		const yesterday = new Date(today);
		yesterday.setDate(today.getDate() - 1);
		return yesterday;
	}

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}