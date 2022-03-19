import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchTabComponent} from './search-tab/search-tab.component';
import { WatchlistComponent } from './watchlist/watchlist.component'
import {CompanydetailsComponent } from './companydetails/companydetails.component'
import { PortfolioComponent} from './portfolio/portfolio.component'

const routes: Routes = [
  { path:  '', redirectTo:  'search/home', pathMatch:  'full' },
    
  {path:'search/home', component:SearchTabComponent},
  {path:'search/:ticker', component:CompanydetailsComponent},
  {path:'watchlist', component:WatchlistComponent},
  {path:'portfolio', component:PortfolioComponent} ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
