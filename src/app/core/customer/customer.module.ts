import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CustomerOrderComponent } from './customer-order/customer-order.component';
import { CustomerWalletComponent } from './customer-wallet/customer-wallet.component';


@NgModule({
  declarations: [
    CustomerDashboardComponent,
    CustomerOrderComponent,
    CustomerWalletComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    SharedModule
  ]
})
export class CustomerModule { }
