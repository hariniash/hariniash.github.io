import { updateLocal } from 'src/localStorage';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { tap, catchError } from 'rxjs/operators';
import { ApiCallsService } from './api-calls.service';
import { getLocal } from '../localStorage';

import { companyDetailsData } from './companyDetailsData';
import { dataInterface } from './dataInterface';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  companyObject = {
    profile: {
      ticker: '',
      name: '',
      exchange: '',
      ipo: '',
      finnhubIndustry: '',
      logo: '',
      weburl: '',
    },
    charts: {
      title: '',
      data: {
        olhc: [],
        volume: [],
      },
    },
    news: [],
    quote: {
      name: '',
      c: 0,
      d: 0,
      dp: 0,
      h: 0,
      l: 0,
      o: 0,
      pc: 0,
      t: 0,
      marketStatus: '',
      timestamp: '',
      charts: [
        {
          title: '',
          data: 0,
        },
      ],
    },
    insights: {
      reddit: {
        mention: 0,
        positiveMention: 0,
        negativeMention: 0,
      },
      twitter: {
        mention: 0,
        positiveMention: 0,
        negativeMention: 0,
      },
      recommendation: {
        categories: [],
        series: [],
      },
      earnings: {
        categories: [],
        actual: [],
        estimate: [],
      },
      name: '',
    },
    peers: [],
  };

  quoteObj = {
    name: '',
    c: 0,
    d: 0,
    dp: 0,
    h: 0,
    l: 0,
    o: 0,
    pc: 0,
    t: 0,
    marketStatus: '',
    timestamp: '',
    charts: [
      {
        title: '',
        data: 0,
      },
    ],
  };

  errorObj = {
    error: false,
    message: '',
    ticker: '',
  };

  portfolioAlertObj = {
    money: 0,
    isStockBought: false,
    isStockSold: false,
    stock: '',
  };

  public portfolioAlertSubject = new BehaviorSubject(this.portfolioAlertObj);
  _portfolioAlert = this.portfolioAlertSubject.asObservable();

  public errorSubject = new BehaviorSubject(this.errorObj);
  _error = this.errorSubject.asObservable();

  private _companyDetailsSubject = new BehaviorSubject(this.companyObject);
  companyDetails = this._companyDetailsSubject.asObservable();
  newCompany: companyDetailsData = {};

  private quoteSubject = new BehaviorSubject(this.quoteObj);
  quoteDetails = this.quoteSubject.asObservable();
  // newCompany:companyDetailsData={}

  getCompanyDetailsSubject() {
    return this._companyDetailsSubject.asObservable();
  }

  addCompany(ticker: '') {
    let newCompany: any = {};
    console.log('************ add company ' + JSON.stringify(ticker));
    let currentTicker = getLocal('currentTicker');
    console.log('currentTicker', currentTicker)
    console.log('newTicker', ticker)
    if (!currentTicker || currentTicker != ticker) {
      console.log('init')
      this.apiCalls.getCompanyDetailsAPI(ticker).subscribe(
        (data: any) => {
          if (data.name == 'Error') {
            console.log('error handling case 3');
            let e = {
              error: true,
              message: 'No data found. Please enter a valid ticker',
              ticker: ticker,
            };
            this.errorSubject.next(e);
          }

          // console.log('add company service call');
          // console.log(data.profile);
          if (!data.profile.ticker) {
            console.log('set error right 1');
            let e = {
              error: true,
              message: 'No data found. Please enter a valid ticker',
              ticker: ticker,
            };
            this.errorSubject.next(e);
          }

            this._companyDetailsSubject.next(data);
            console.log('init ticker api call')
            updateLocal('currentTicker', ticker)

        },
        (error: any) => {
          let e = {
            error: true,
            message: 'API Limit Reached. Please reload',
            ticker: '',
          };
          this.errorSubject.next(e);
        }
      );
    }
    // if (!this._companyDetailsSubject.getValue().profile.ticker) {

    // } else if (
    //   this._companyDetailsSubject.getValue().profile.ticker != ticker
    // ) {

    //   this.apiCalls.getCompanyDetailsAPI(ticker)
    //   .subscribe((data: any) => {

    //     if(data.name == 'Error'){

    //       console.log('error handling case 3 in 1')
    //       let e = {
    //         error: true,
    //         message: data.message,
    //         ticker: ticker,
    //       };
    //       this.errorSubject.next(e);
    //     }

    //     this._companyDetailsSubject.next(data);
    //     console.log(' data in case 2'+JSON.stringify(data.profile.ticker))
    //     // debugger
    //     if (!data.profile.ticker) {
    //       console.log('set error right 2')
    //       let e = {
    //         error: true,
    //         message: 'No data found. Please enter a valid ticker',
    //         ticker: ticker,
    //       };
    //       this.errorSubject.next(e);
    //     }
    //   },
    //   (error: any) => {
    //     let e = {
    //       error: true,
    //       message: "data not found",
    //       ticker: '',
    //     };
    //     this.errorSubject.next(e);
    //   });

    // }
  }

  addQuote(ticker: '') {
    this.apiCalls.quoteAPI(ticker).subscribe((data: any) => {
      this.quoteSubject.next(data);
      console.log('quote addded');
    });
    // return this.quoteSubject.asObservable();
  }

  refreshQuoteState(ticker: ''): Observable<Object> {
    return this.apiCalls.quoteAPI(ticker).pipe(
      tap((data: any) => {
        this.quoteSubject.next(data);
        console.log('done refresh');
      })
    );
  }

  portfolioReset() {
    let curBalance = this.portfolioAlertSubject.getValue().money;
    let temp = {
      money: curBalance,
      isStockBought: false,
      isStockSold: false,
      stock: '',
    };
    console.log('is it resetting: ', temp);
    this.portfolioAlertSubject.next(temp);
  }
  resetData() {
    this._companyDetailsSubject.next(this.companyObject);
    console.log('resetting', this.errorObj);
    this.errorSubject.next(this.errorObj);
  }

  constructor(private apiCalls: ApiCallsService) {}
}
