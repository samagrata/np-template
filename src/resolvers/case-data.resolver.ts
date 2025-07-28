import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from '../services/api-service';

@Injectable({
  providedIn: 'root'
})
export class CaseDataResolver implements Resolve<any> {
  constructor(private apiService: ApiService<any>) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.apiService.getData('/cases'); // The service's caching handles "only once"
  }
}