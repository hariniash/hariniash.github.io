import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiCallsService } from '../api-calls.service'
import { Router } from '@angular/router';
import {getLocal, updateLocal } from 'src/localStorage'
import { FormControl } from '@angular/forms';
import { distinctUntilChanged, debounceTime } from "rxjs/operators";
import { setLines } from '@angular/material/core';


@Component({
  selector: 'app-search-tab',
  templateUrl: './search-tab.component.html',
  styleUrls: ['./search-tab.component.css']
})
export class SearchTabComponent implements OnInit {
  searchIp = new FormControl('')
  ticker: any

  localTicker="home"
  autocompleteResult:any = []

  loader:string = 'inactive'
  isLoadingAutoComplete = false
  companyDetails:any={}


  constructor(private apiCalls:ApiCallsService,
    private router: Router) {
    this.searchSubmit = this.searchSubmit.bind(this)
    console.log('hiihii');
    this.ticker = []
    this.autocompleteResult = []



  }
  @ViewChild('searchInput') search: string | undefined

  searchSubmit(query: any){
    this.ticker = query;
    // debugger;
    this.ticker = typeof(this.ticker)==="string" ? this.ticker : this.ticker.displaySymbol;
    console.log('ticker name in form: ',this.ticker);

    this.router.navigateByUrl('/search/' + this.ticker);
    console.log('in search submit')
    this.search = '';

    this.localTicker = this.ticker

    this.loader = 'loading'

    this.apiCalls.getCompanyDetails(this.ticker).subscribe((details: any) => {
      this.companyDetails = details
      console.log("details")
      this.loader = 'loaded'
      updateLocal('currentTicker', this.ticker)
      updateLocal(this.ticker, this.companyDetails)
      this.initLoad()
    })
    // let cur = getLocal('currentTicker')
    // console.log(cur)
    return false;

  }
  searchClear(){
    updateLocal("currentTicker", "home")
    this.search = '';
    this.companyDetails = {}
    this.localTicker = "home"

    this.loader = 'inactive'

    this.router.navigateByUrl('search/home')

  }
  autocompleteSearch(){
    if(this.searchIp.value===""){
      return;
    }
    // console.log(this.searchIp)
    this.isLoadingAutoComplete = true
    this.apiCalls.autoComplete(this.searchIp.value).subscribe((data : any) => {

      this.autocompleteResult = data
      console.log(this.autocompleteResult)
      this.isLoadingAutoComplete = false

    })
  }

  autoUpdateCompanyDetails(){
    setTimeout(() => {
      if(this.localTicker != "home"){
        this.companyDetails=getLocal(this.localTicker);
      }
      this.autoUpdateCompanyDetails();
    }

    , 15000)
  }

  displayFunc(result: any) {
    // let res = `${result.displaySymbol} | ${result.description}`
    // console.log(res)
    return result.displaySymbol;

  }

  initLoad(){
    let curLocal = getLocal('currentTicker')
    console.log('current ticker')
    console.log(curLocal)

    if(curLocal!='home' && curLocal){
      this.companyDetails = getLocal(curLocal)
      this.loader = 'loaded'
      console.log('here')
      this.localTicker = curLocal
      // this.searchSubmit(this.localTicker)

    }
    else{
      console.log('here first')
      this.loader = 'inactive';
      this.localTicker = "home"
      this.router.navigateByUrl('search/home')
    }

    this.autoUpdateCompanyDetails()

    this.searchIp.valueChanges
    .pipe(
      debounceTime(400),
      distinctUntilChanged()
    )
    .subscribe(res =>{
      this.autocompleteSearch()
    })
  }
  ngOnInit(): void {
    this.initLoad()
  }



}
