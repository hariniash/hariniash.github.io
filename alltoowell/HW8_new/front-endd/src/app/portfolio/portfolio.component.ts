import { Component, OnInit, ViewChild } from '@angular/core';
import { getLocal } from 'src/localStorage';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})

export class PortfolioComponent implements OnInit {

  @ViewChild('selfClosingAlert', {static:false}) selfClosingAlert: NgbAlert | undefined;

  moneyInWallet = 0
  currentQuantity:number = 0
  quantityValue = new FormControl(0);
  portfolioCompanies:any = {}

  transaction(){
    if(getLocal('money')){
      this.moneyInWallet = getLocal('money')
    }
    else{
      this.moneyInWallet = 25000
    }

    let stockQty = {} || getLocal('stockQty');
    


  }

  constructor() { }

  ngOnInit(): void {
    this.transaction()
  }

}
