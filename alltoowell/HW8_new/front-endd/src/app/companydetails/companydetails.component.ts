import { Component, SimpleChange, OnInit, Input, ViewChild } from '@angular/core';
import { tick } from '@angular/core/testing';
import { getLocal, updateLocal } from 'src/localStorage';
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import {debounceTime} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-companydetails',
  templateUrl: './companydetails.component.html',
  styleUrls: ['./companydetails.component.css'],
})
export class CompanydetailsComponent implements OnInit {
  private _success = new Subject<string>();
  companyAdded = '';
  alertType = '';
  marketStatus = '';
  timestamp: any = '';
  @ViewChild('selfClosingAlert', {static: false}) selfClosingAlert: NgbAlert | undefined;
  @Input('searchSubmit') searchSubmit = (t: any) => {};
  getLocal = getLocal;
  @Input('companyDetails') result:any = {}
  @Input('quoteDetails') quote:any = {}

  fasStar = fasStar;
  farStar = farStar;
  faCaretDown = faCaretDown;
  faCaretUp = faCaretUp;

  getTodayDate() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    let date = yyyy + '-' + mm + '-' + dd;
    return date;
  }

  starToggle() {


    let Wlist: string[] = getLocal('watchlistCompanies') || [];
    let tickerChanged = this.result.profile.ticker;
    if (Wlist.includes(tickerChanged)) {
      Wlist = Wlist.filter((ticker) => ticker != tickerChanged);
      this.alertType = 'danger';
    } else {
      Wlist.push(tickerChanged);
      console.log(Wlist);
      this.companyAdded = this.result.profile.ticker;
      this.alertType = 'success';
    }
    setTimeout(()=>this.selfClosingAlert?.close(), 5000)



    updateLocal('watchlistCompanies', Wlist);
  }



  constructor() {}

  ngOnInit(): void {
    this.marketStatus =
      this.result.quote.marketStatus === 'closed'
        ? 'Market Closed on ' + this.result.quote.timestamp
        : 'market is Open';
      console.log('in company details comp')
      console.log(this.result.charts)

    // this._success.subscribe(message => this.alertType = message);
    // this._success.pipe(debounceTime(5000)).subscribe(() => {
    //   if (this.selfClosingAlert) {

    //     this.selfClosingAlert.close();
    //   }
    // });
  }
}
