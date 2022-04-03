import { BuysellbuttonComponent } from './../buysellbutton/buysellbutton.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { getLocal } from 'src/localStorage';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';
import { StateService } from '../state.service';
import { ApiCallsService } from '../api-calls.service';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css'],
})
export class PortfolioComponent implements OnInit {
  faCaretDown = faCaretDown;
  faCaretUp = faCaretUp;

  @ViewChild('buyClosingAlert', { static: false }) buySelfClosing:
    | NgbAlert
    | undefined;
  @ViewChild('sellClosingAlert', { static: false }) sellSelfClosing:
    | NgbAlert
    | undefined;


  moneyInWallet = 0;
  currentQuantity: number = 0;
  quantityValue = new FormControl(0);
  portfolioCompanies: any = [];
  tickers: any = [];
  noPortfolioCompanies = false;

  isStockSold = false;
  isStockBought = false;
  stock = '';

  transactionUpdate() {
    this.portfolioCompanies = []
    if (getLocal('money')) {
      this.moneyInWallet = getLocal('money');
    } else {
      this.moneyInWallet = 25000;
    }

    let stockQty = getLocal('stockQty') || {};

    if (stockQty == {}) {
      this.noPortfolioCompanies = true;
    }

    this.tickers = Object.keys(stockQty);
    console.log('stock quantity');
    console.log(stockQty);
    this.tickers.forEach((ticker: any) => {
      let avgCost = parseFloat(
        (stockQty[ticker].tval / stockQty[ticker].quantity).toFixed(2)
      );

      console.log(' NaN');
      console.log(stockQty[ticker].quantity);
      this.apiCalls.quoteAPI(ticker)
      .subscribe((data: any) => {
        // console.log(data)
        let perCompanyDetails = {
          ticker: ticker,
          quote: data[0],
          qty: stockQty[ticker].quantity,
          avgCost: avgCost,
          marketVal: parseFloat(
            (stockQty[ticker].quantity * data[0].l).toFixed(2)
          ),
          tcost: stockQty[ticker].tval,
          change: data[0].l - avgCost,
        };
        this.portfolioCompanies.push(perCompanyDetails);
      },
      error => console.log('error in watchlist: ',error.error.message));
    });

    console.log('length: '+JSON.stringify(this.portfolioCompanies))
  }

  buyStockAlert(ticker: string) {
    this.stock = ticker;
    this.isStockBought = true;
    setTimeout(() => {
      this.stock = '';
      this.isStockBought = false;
      this.buySelfClosing?.close();
    }, 5000);
  }

  sellStockAlert(ticker: string) {
    this.stock = ticker;
    this.isStockSold = true;
    setTimeout(() => {
      this.stock = '';
      this.isStockSold = true;
      this.sellSelfClosing?.close();
    }, 5000);
  }

  constructor(private apiCalls: ApiCallsService) {
    this.transactionUpdate = this.transactionUpdate.bind(this);
    this.buyStockAlert = this.buyStockAlert.bind(this);
    this.sellStockAlert = this.sellStockAlert.bind(this);
  }

  ngOnInit(): void {
    this.transactionUpdate();
  }
}
