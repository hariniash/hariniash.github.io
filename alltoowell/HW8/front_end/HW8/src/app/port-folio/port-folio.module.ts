import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyComponent } from './company/company.component';



@NgModule({
  declarations: [
    CompanyComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    CompanyComponent
  ]
})
export class PortFolioModule { }
