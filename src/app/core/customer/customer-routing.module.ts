import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';
import { CustomerOrderComponent } from './customer-order/customer-order.component';
import { WalletComponent } from '../wallet/wallet.component';
import { CustomerSettingsComponent } from './customer-settings/customer-settings.component';
import { TrackOrderComponent } from './track-order/track-order.component';
import { CustomerNotificationsComponent } from './customer-notifications/customer-notifications.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: CustomerDashboardComponent,
    data: { title: 'Account Overview' },
  },
  {
    path: 'profile-settings',
    component: CustomerSettingsComponent,
    data: { title: 'Account Preference' },
  },
  {
    path: 'notifications',
    component: CustomerNotificationsComponent,
    data: { title: 'All Notifications' },
  },
  {
    path: 'orders',
    component: CustomerOrderComponent,
    data: { title: 'Orders' },
  },
  {
    path: 'track-order',
    component: TrackOrderComponent,
    data: { title: 'Orders' },
  },
  { path: 'wallet', component: WalletComponent, data: { title: 'Wallet' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
