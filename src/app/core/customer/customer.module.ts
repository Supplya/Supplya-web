import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CustomerOrderComponent } from './customer-order/customer-order.component';
import { CustomerWalletComponent } from './customer-wallet/customer-wallet.component';
import { TrackOrderComponent } from './track-order/track-order.component';
import { CustomerSettingsComponent } from './customer-settings/customer-settings.component';
import { CustomerNotificationsComponent } from './customer-notifications/customer-notifications.component';


@NgModule({
  declarations: [
    CustomerDashboardComponent,
    CustomerOrderComponent,
    CustomerWalletComponent,
    TrackOrderComponent,
    CustomerSettingsComponent,
    CustomerNotificationsComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    SharedModule
  ]
})
export class CustomerModule { }
