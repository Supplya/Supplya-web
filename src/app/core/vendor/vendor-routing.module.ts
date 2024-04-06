import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VendorDashboardComponent } from './vendor-dashboard/vendor-dashboard.component';
import { VendorOrdersComponent } from './vendor-orders/vendor-orders.component';
import { VendorWalletComponent } from './vendor-wallet/vendor-wallet.component';
import { VendorSettingsComponent } from './vendor-settings/vendor-settings.component';
import { VendorReportComponent } from './vendor-report/vendor-report.component';
import { VendorProductsComponent } from './vendor-products/vendor-products.component';
import { VendorAddNewProductComponent } from './vendor-add-new-product/vendor-add-new-product.component';

const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: 'dashboard', component: VendorDashboardComponent, data: { title: 'Vendor Dashboard' }},
  {path: 'orders', component: VendorOrdersComponent, data: { title: 'Vendor Orders' }},
  { path: 'wallet', component: VendorWalletComponent, data: { title: 'Vendor Wallet' }},
  {path: 'shop-settings', component: VendorSettingsComponent, data: { title: 'Vendor Profile' }},
  {path: 'report', component: VendorReportComponent, data: { title: 'Vendor Report' }},
  {path: 'products', component: VendorProductsComponent, data: { title: 'Vendor Products' }},
  {path: 'add-new-product', component: VendorAddNewProductComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorRoutingModule { }
