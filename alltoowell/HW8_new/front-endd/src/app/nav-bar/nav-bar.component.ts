import { getLocal } from 'src/localStorage';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {Router} from '@angular/router'


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
  // encapsulation: ViewEncapsulation.None
})
export class NavBarComponent implements OnInit {
  links = ['search', 'watchlist', 'portfolio'];

  etHome(){
    this.router.navigateByUrl('/search/home');
  }

  navigate(){
    const ticker = getLocal('currentTicker');
    if(ticker){
      this.router.navigateByUrl('/search/'+ticker);
    }
    else{
      this.router.navigateByUrl('/search/home');
    }
  }

  activeLink = this.links[0];
  constructor(private router:Router) { }

  ngOnInit(): void {
  }

}
