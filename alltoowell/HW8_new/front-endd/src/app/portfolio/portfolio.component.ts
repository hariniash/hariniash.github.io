import { StateService } from './../state.service';
import { BuysellbuttonComponent } from './../buysellbutton/buysellbutton.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { getLocal } from 'src/localStorage';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';

import { first } from 'rxjs/operators';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css'],
})
export class PortfolioComponent implements OnInit {

  portfolioDetails = ''
  noPortfolioCompanies = false
  moneyInWallet = getLocal('money') || 25000
  isStockSold = false
  isStockBought = false
  stock = ''


  @ViewChild('buyClosingAlert', { static: false }) buySelfClosing:
    | NgbAlert
    | undefined;
  @ViewChild('sellClosingAlert', { static: false }) sellSelfClosing:
    | NgbAlert
    | undefined;


  buyStockAlert(ticker: string) {
    this.stock = ticker;
    this.isStockBought = true;
    console.log('buy alert ')
    setTimeout(() => {
      this.stock = '';
      this.isStockBought = false;
      this.buySelfClosing?.close();
      this.stateService.portfolioReset()
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
      this.stateService.portfolioReset()
    }, 5000);
  }

  constructor(private stateService:StateService) {

    this.buyStockAlert = this.buyStockAlert.bind(this);
    this.sellStockAlert = this.sellStockAlert.bind(this);
  }

  ngOnInit(): void {

    if(getLocal('stockQty')){
      this.portfolioDetails = getLocal('stockQty')
    }
    else{
      this.noPortfolioCompanies = true
    }
    this.stateService.portfolioAlertSubject.subscribe((data) =>{
      if(data.money > 0){
        this.moneyInWallet = data.money
        this.isStockBought = data.isStockBought
        this.isStockSold = data.isStockSold
        this.stock = data.stock

      }
    })


  }
}
