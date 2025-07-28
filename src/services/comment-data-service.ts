import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comment } from '../app/admin/dashboard/story-management/story';
import { ApiService } from './api-service';

@Injectable({
	providedIn: 'root'
})

export class CommentDataService {
  protected comments: Comment[] = [];

  constructor(private apiService: ApiService<any>) {}

  fetchComments(sID: number): Observable<any> {
    const cobs$ = this.apiService.getDataWithParams(
      '/comments', { storyID: sID.toString() });
    return cobs$;
  }
}