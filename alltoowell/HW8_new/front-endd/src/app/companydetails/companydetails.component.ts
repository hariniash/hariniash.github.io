import { StateService } from './../state.service';
import { Component, SimpleChange, OnInit, Input, ViewChild } from '@angular/core';
import { tick } from '@angular/core/testing';
import { getLocal, updateLocal, remove } from 'src/localStorage';
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
  money:any = 0
  @ViewChild('selfClosingAlert', {static: false}) selfClosingAlert: NgbAlert | undefined;
  @Input('searchSubmit') searchSubmit = (t: any) => {};
  getLocal = getLocal;
  @Input('companyDetails') result:any = {}
  @Input('quoteDetails') quote:any = {}

  @ViewChild('buyClosingAlert', { static: false }) buySelfClosing:
  | NgbAlert
  | undefined;
  @ViewChild('sellClosingAlert', { static: false }) sellSelfClosing:
  | NgbAlert
  | undefined;

  fasStar = fasStar;
  farStar = farStar;
  faCaretDown = faCaretDown;
  faCaretUp = faCaretUp;

  isStockSold = false
  isStockBought = false
  stock = ''

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
      // updateLocal(tickerChanged, this.quote)
      remove(tickerChanged)

    } else {
      Wlist.push(tickerChanged);

      updateLocal(tickerChanged, this.quote)
      console.log(Wlist);
      this.companyAdded = this.result.profile.ticker;
      this.alertType = 'success';
    }
    setTimeout(()=>this.selfClosingAlert?.close(), 5000);
    updateLocal('watchlistCompanies', Wlist);

  }
  buyStockAlert(ticker: string) {
    this.stock = ticker;
    this.isStockBought = true;
    console.log('buy alert ')
    setTimeout(() => {
      this.stock = '';
      this.isStockBought = false;
      this.buySelfClosing?.close();
      this.stateService.portfolioReset();
    }, 5000);
  }

  sellStockAlert(ticker: string) {
    this.stock = ticker;
    this.isStockSold = true;
    console.log('sell alert ')
    setTimeout(() => {
      this.stock = '';
      this.isStockSold = false;
      this.sellSelfClosing?.close();
      this.stateService.portfolioReset();
    }, 5000);
  }




  constructor(private stateService:StateService) {
    this.buyStockAlert = this.buyStockAlert.bind(this);
    this.sellStockAlert = this.sellStockAlert.bind(this);
  }

  ngOnInit(): void {
    this.marketStatus =
      this.result.quote.marketStatus === 'closed'
        ? 'Market Closed on ' + this.result.quote.timestamp
        : 'market is Open';
      console.log('in company details comp')
      console.log(this.result.charts)

      this.stateService.portfolioAlertSubject.subscribe((data) =>{
        if(data.money > 0){
          this.money = data.money
          this.isStockBought = data.isStockBought
          this.isStockSold = data.isStockSold
          this.stock = data.stock

        }
      })

  }
}
