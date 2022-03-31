import { NavBarComponent } from './../nav-bar/nav-bar.component';
import { getLocal, updateLocal } from 'src/localStorage';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css'],
})
export class WatchlistComponent implements OnInit {
  watchlistData: any = [];
  faCaretDown = faCaretDown;
  faCaretUp = faCaretUp;
  watchlistEmpty = true

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

    curWatchlist.forEach((ticker: string) => {

      //services modification
      let companyDetails = getLocal(ticker);
      let reducedDetails = {
        name: companyDetails.profile.name,
        ticker:companyDetails.profile.ticker,
        quote: companyDetails.quote,
      };
      this.watchlistData.push(reducedDetails);

    });
  }

  constructor(private router: Router) {}

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
