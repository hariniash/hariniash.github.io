import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { HOST } from './host-name';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiCallsService {
  private searchUrlPre = HOST + 'search/';

  constructor(private http: HttpClient) { }

  autoComplete(searchTerm : string){
    const url =  `${this.searchUrlPre}?q=${searchTerm}`;
    return this.http.get(url).pipe(
      catchError(this.handleError('ApiCallsService', [])) // then handle the error
    );

  }
}

