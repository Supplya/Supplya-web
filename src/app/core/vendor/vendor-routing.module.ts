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
  {path: 'dashboard', component: VendorDashboardComponent},
  {path: 'orders', component: VendorOrdersComponent},
  {path: 'wallet', component: VendorWalletComponent},
  {path: 'shop-settings', component: VendorSettingsComponent},
  {path: 'report', component: VendorReportComponent},
  {path: 'products', component: VendorProductsComponent},
  {path: 'add-new-product', component: VendorAddNewProductComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorRoutingModule { }
