import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiCallsService } from '../api-calls.service'
import { Router } from '@angular/router';
import { SearchUtil } from '../search-util';
@Component({
  selector: 'app-search-tab',
  templateUrl: './search-tab.component.html',
  styleUrls: ['./search-tab.component.css']
})
export class SearchTabComponent implements OnInit {
  ticker: string

  constructor(private apiCalls:ApiCallsService,
    private router: Router) { 
    
    console.log('hiihii')
    // debugger
    // this.apiCalls.autoComplete('aap').subscribe(data => {console.log(data)})
    this.autocompleteResult = []
    this.ticker = ''

  }
  @ViewChild('searchInput') search: string | undefined
  autocompleteResult:any = []
  searchSubmit(query: any){
    this.ticker = query
    console.log('ticker name in form: ', this.ticker);
    this.router.navigateByUrl('/search/' + this.ticker);
    this.search = '';

  }
  searchClear(){
    this.search = '';
  }
  autocompleteSearch(query: any){
    
    this.apiCalls.autoComplete(query).subscribe((data : any) => { 
      
      this.autocompleteResult = data
      // .map((d:any) => ({symbol: d.displaySymbol, name: d.description}) );
      // data.map((d:any) => `${d.displaySymbol} | ${d.description}`)
      console.log(this.autocompleteResult)
    })
      // _this.autocompleteResult = data})
    // this.autocompleteResult = this.autocompleteResult.concat(query)
  }

  displayFunc(result: SearchUtil) {
    // let res = `${result.displaySymbol} | ${result.description}`
    // console.log(res)
    return result.displaySymbol;
    
  }
  ngOnInit(): void {
  }



}
