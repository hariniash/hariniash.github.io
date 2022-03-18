import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatTabsModule } from '@angular/material/tabs';
import { HttpClientModule } from '@angular/common/http';
import {MatAutocompleteModule} from '@angular/material/autocomplete'
import {MatSelectModule} from '@angular/material/select'
import {PortFolioModule} from './port-folio/port-folio.module'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SearchTabComponent } from './search-tab/search-tab.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    SearchTabComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTabsModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatSelectModule,
    PortFolioModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
