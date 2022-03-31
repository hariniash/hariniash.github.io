import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReplaySubject } from 'rxjs';
import {tap } from 'rxjs/operators'

import {companyDetailsData} from './companyDetailsData'
import { HOST } from './host-name';


@Injectable({
  providedIn: 'root'
})

export class ApiCallsService {

  private searchUrlPre = HOST + 'search/';

  private _companyDetailsSubject = new ReplaySubject<companyDetailsData>(1);

  private companyUrlPre = HOST + 'company_details';


  constructor(private http: HttpClient) { }

  autoComplete(searchTerm : string){
    const url =  `${this.searchUrlPre}?q=${searchTerm}`;
    return this.http.get(url);

  }

  getCompanyDetailsSubject(ticker: string){
    return this._companyDetailsSubject.asObservable();
  }

  getCompanyDetailsAPI(ticker: string){
    const url = `${this.companyUrlPre}?symbol=${ticker}`;
    return this.http.get(url)

  }
}
