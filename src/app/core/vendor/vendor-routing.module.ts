import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VendorDashboardComponent } from './vendor-dashboard/vendor-dashboard.component';
import { VendorOrdersComponent } from './vendor-orders/vendor-orders.component';
import { VendorWalletComponent } from './vendor-wallet/vendor-wallet.component';
import { VendorSettingsComponent } from './vendor-settings/vendor-settings.component';
import { VendorReportComponent } from './vendor-report/vendor-report.component';
import { VendorProductsComponent } from './vendor-products/vendor-products.component';
import { VendorAddNewProductComponent } from './vendor-add-new-product/vendor-add-new-product.component';
import { VendorEditProductComponent } from './vendor-edit-product/vendor-edit-product.component';
import { VendorWithdrawalComponent } from './vendor-withdrawal/vendor-withdrawal.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: VendorDashboardComponent,
    data: { title: 'Dashboard' },
  },
  {
    path: 'orders',
    component: VendorOrdersComponent,
    data: { title: 'Orders' },
  },
  {
    path: 'wallet',
    component: VendorWalletComponent,
    data: { title: 'Wallet' },
  },
  {
    path: 'shop-settings',
    component: VendorSettingsComponent,
    data: { title: 'Profile' },
  },
  {
    path: 'report',
    component: VendorReportComponent,
    data: { title: 'Report' },
  },
  {
    path: 'products',
    component: VendorProductsComponent,
    data: { title: 'Products' },
  },
  {
    path: 'edit-product/:id',
    component: VendorEditProductComponent,
    data: { title: 'Edit Product' },
  },
  {
    path: 'add-new-product',
    component: VendorAddNewProductComponent,
    data: { title: 'Add New Product' },
  },
  {
    path: 'withdrawal',
    component: VendorWithdrawalComponent,
    data: { title: 'Withdrawal' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorRoutingModule { }
