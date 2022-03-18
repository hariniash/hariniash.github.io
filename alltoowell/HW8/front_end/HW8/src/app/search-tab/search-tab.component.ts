import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiCallsService } from '../api-calls.service'
@Component({
  selector: 'app-search-tab',
  templateUrl: './search-tab.component.html',
  styleUrls: ['./search-tab.component.css']
})
export class SearchTabComponent implements OnInit {

  constructor(private apiCalls:ApiCallsService) { 
    console.log('hiihii')
    // debugger
    // this.apiCalls.autoComplete('tsl').subscribe(data => {console.log(data)})

  }
  @ViewChild('searchInput') search: string | undefined
  autocompleteResult = []
  searchSubmit(query: any){
    console.log(query)
  }
  searchClear(){
    this.search = '';
  }
  autocompleteSearch(query: any){
    this.autocompleteResult = this.autocompleteResult.concat(query)
  }
  ngOnInit(): void {
  }



}
