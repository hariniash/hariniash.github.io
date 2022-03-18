import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {

  constructor() { }
  clickEvent(evt: any){
    alert(evt)
  }
  currentVal = ''
  name='lisa'
  disabledBox = true
  show=true
  getValue(name: any){
    // console.warn(name)
    this.currentVal = name
  }
  enableTextbox(){
    this.disabledBox = false
  }

  ngOnInit(): void {
  }

}
