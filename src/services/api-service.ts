import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ApiService<T> {
  evars = environment;
  constructor(private http: HttpClient) {}

  getDataWithParams(path: string, queryParams: { [key: string]: string | string[] }): Observable<T> {
    let params = new HttpParams();

    for (const key in queryParams) {
      if (queryParams.hasOwnProperty(key)) {
        const value = queryParams[key];
        if (Array.isArray(value)) {
          value.forEach(item => {
            params = params.append(key, item);
          });
        } else {
          params = params.set(key, value);
        }
      }
    }

    return this.http.get<T>(this.evars.apiURL + path, { params: params });
  }

  getData(path: string): Observable<T> {
    return this.http.get<T>(this.evars.apiURL + path);
  }

  postData(path: string, data: Partial<T>): Observable<T> {
    return this.http.post<T>(this.evars.apiURL + path, data);
  }

  updateData(path: string, item: Partial<T>): Observable<T> {
    return this.http.put<T>(this.evars.apiURL + path, item);
  }

  patch(path: string, item: any): Observable<any> {
    return this.http.patch<any>(this.evars.apiURL + path, item);
  }

  deleteData(path: string): Observable<T> {
    return this.http.delete<T>(this.evars.apiURL + path);
  }
}