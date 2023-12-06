import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';
import { CustomerOrderComponent } from './customer-order/customer-order.component';
import { CustomerWalletComponent } from './customer-wallet/customer-wallet.component';

const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: 'dashboard', component: CustomerDashboardComponent},
  {path: 'orders', component: CustomerOrderComponent},
  {path: 'wallet', component: CustomerWalletComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
