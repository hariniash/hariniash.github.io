import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';
import { updateLocal, getLocal } from '../../localStorage';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-buysellbutton',
  templateUrl: './buysellbutton.component.html',
  styleUrls: ['./buysellbutton.component.css']
})
export class BuysellbuttonComponent {
  faXmark = faXmark;
  @Input("buyStockAlert") buyStockAlert: Function = ()=>{};
  @Input("sellStockAlert") sellStockAlert: Function = ()=>{};
  @Input('source') source:string='search'
  @Input('ticker') ticker:string=''
  @Input('value') value:number=0
  @Input("transactionUpdate") transactionUpdate:Function = ()=>{};

  moneyInWallet = 0
  currentQuantity:number = 0
  quantityValue = new FormControl(0);
  tval = 0;
  errorMessage = ""
  transactionType = "Buy"
  constructor(private modalService: NgbModal) { }

  open(content: any, transactionType: string) {
    this.transactionType = transactionType;
    this.modalService.open(content);
  }

  changeInQuantity() {
    this.tval = parseFloat((this.value * parseFloat(this.quantityValue.value)).toFixed(2));
    if (this.transactionType === "Sell") {

      if(parseFloat(this.quantityValue.value) > this.currentQuantity){
        this.errorMessage = "You don't have enough stocks to sell!";
      }
      else if(this.quantityValue.value<1){
        this.errorMessage = "You should sell atleast 1 stock";
      }
      else{
        this.errorMessage = "";
      }

    }
    else {

      if(this.tval > this.moneyInWallet){
        this.errorMessage = "Not enough money in wallet!";
      }
      else if(this.quantityValue.value<1){
        this.errorMessage = "You should buy atleast 1 stock";
      }
      else {
        this.errorMessage = "";
      }
    }

  }

  updateQuantity(){
    this.moneyInWallet = getLocal("money") || 25000;
    let stockQty = getLocal("stockQty") || {};
    if (!stockQty[this.ticker]) {
      this.currentQuantity = 0;
    }
    else {

      if (stockQty[this.ticker].quantity){
        this.currentQuantity = stockQty[this.ticker].quantity
      }
      else{
        this.currentQuantity = 0
      }
      // this.currentQuantity = stockQty[this.ticker].quantity || 0;
    }
  }

  ngOnChanges(changes: any) {
    this.updateQuantity();
  }



  transaction() {

    if (this.transactionType === "Sell") {
      console.log(this.ticker)
      let stockQty =  getLocal("stockQty") || {};

      stockQty[this.ticker].tval -= this.tval;

      let curBalance = this.moneyInWallet + this.tval;
      curBalance = parseFloat(curBalance.toFixed(2))

      stockQty[this.ticker].quantity -= parseFloat(this.quantityValue.value);


      stockQty[this.ticker].tval=parseFloat(stockQty[this.ticker].tval.toFixed(2))
      stockQty[this.ticker].quantity=parseFloat(stockQty[this.ticker].quantity.toFixed(2))


      if(stockQty[this.ticker].quantity===0){
        delete stockQty[this.ticker]
      }

      updateLocal("stockQty", stockQty)
      updateLocal("money",curBalance)

      this.quantityValue.setValue(0);

      this.tval=0;
      this.updateQuantity();
      this.transactionUpdate();
      this.sellStockAlert(this.ticker)
    }

    else {

      let stockQty = getLocal("stockQty") || {};

      if (!stockQty[this.ticker]) {

        stockQty[this.ticker] = {
          quantity: parseFloat(this.quantityValue.value),
          tval: this.tval
        }


      }
      else {
        stockQty[this.ticker].quantity= (stockQty[this.ticker].quantity||0) + parseFloat(this.quantityValue.value);
        stockQty[this.ticker].tval += this.tval;
      }

      let curBalance:number = this.moneyInWallet-this.tval;

      stockQty[this.ticker].quantity=parseFloat(stockQty[this.ticker].quantity.toFixed(2))
      stockQty[this.ticker].tval=parseFloat(stockQty[this.ticker].tval.toFixed(2))
      console.log('buy quantity on local')
      console.log(stockQty[this.ticker].tval)


      updateLocal("stockQty", stockQty)
      curBalance = parseFloat(curBalance.toFixed(2))
      updateLocal("money",curBalance)
      this.buyStockAlert(this.ticker)
    }

  }
}
