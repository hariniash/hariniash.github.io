import { ApiCallsService } from './../api-calls.service';
import { NavBarComponent } from './../nav-bar/nav-bar.component';
import { getLocal, updateLocal } from 'src/localStorage';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { distinct, first } from 'rxjs/operators';
import { data } from 'highcharts';



@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css'],
})
export class WatchlistComponent implements OnInit {
  watchlistData: any = [];
  faCaretDown = faCaretDown;
  faCaretUp = faCaretUp;
  watchlistEmpty = true;
  faXmark = faXmark;
  quoteData:any = {}

  //services modification
  searchTicker(ticker: string) {
    this.router.navigateByUrl('search/' + ticker);
  }

  delete(tickerToDelete: string) {
    let curWatchlist = [];
    if (getLocal('watchlistCompanies')) {
      curWatchlist = getLocal('watchlistCompanies');
    }
    curWatchlist = curWatchlist.filter(
      (ticker: string) => ticker != tickerToDelete
    );

    if(curWatchlist.length == 0){
      this.watchlistEmpty = true
    }else{
      this.watchlistEmpty = false
    }


    updateLocal('watchlistCompanies', curWatchlist);
    this.updateWatchlist(curWatchlist);
  }

  updateWatchlist(curWatchlist:any) {
    this.watchlistData = [];
    this.quoteData = {}



    console.log(curWatchlist.length)
    curWatchlist.forEach((ticker: any) => {
      //services modification
      this.apiCalls.quoteAPI(ticker)
      .subscribe((data:any) =>{
        let temp = {'ticker': ticker,
      'quote': data}

      this.watchlistData.push(temp)
      },
      error => console.log('error in watchlist: ',error.error.message))

    });

    // console.log(this.quoteData)



    console.log('quote api subscription')
    console.log(this.watchlistData)
  }

  constructor(private router: Router, private apiCalls: ApiCallsService) {}

  ngOnInit(): void {
    let curWatchlist = [];
    if (getLocal('watchlistCompanies')) {
      curWatchlist = getLocal('watchlistCompanies');
    }

    if(curWatchlist.length == 0){
      this.watchlistEmpty = true
    }else{
      this.watchlistEmpty = false
    }
    this.updateWatchlist(curWatchlist)

  }
}
