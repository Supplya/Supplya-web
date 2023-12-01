import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SellerRoutingModule } from './seller-routing.module';
import { SellerDashboardComponent } from './seller-dashboard/seller-dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    SellerDashboardComponent
  ],
  imports: [
    CommonModule,
    SellerRoutingModule,
    SharedModule
  ]
})
export class SellerModule { }
