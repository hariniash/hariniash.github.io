import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
  // encapsulation: ViewEncapsulation.None
})
export class NavBarComponent implements OnInit {
  links = ['search', 'watchlist', 'portfolio'];
 
  activeLink = this.links[0];
  constructor() { }

  ngOnInit(): void {
  }

}
