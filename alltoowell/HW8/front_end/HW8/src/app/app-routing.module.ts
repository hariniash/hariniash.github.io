import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchTabComponent} from './search-tab/search-tab.component';

const routes: Routes = [{path:'porfolio', component:SearchTabComponent} ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
