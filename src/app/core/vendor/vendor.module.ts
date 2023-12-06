import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendorRoutingModule } from './vendor-routing.module';
import { VendorOrdersComponent } from './vendor-orders/vendor-orders.component';
import { VendorWalletComponent } from './vendor-wallet/vendor-wallet.component';
import { VendorDashboardComponent } from './vendor-dashboard/vendor-dashboard.component';
import { VendorProductsComponent } from './vendor-products/vendor-products.component';
import { VendorAddNewProductComponent } from './vendor-add-new-product/vendor-add-new-product.component';
import { VendorReportComponent } from './vendor-report/vendor-report.component';
import { VendorSettingsComponent } from './vendor-settings/vendor-settings.component';


@NgModule({
  declarations: [
    VendorOrdersComponent,
    VendorWalletComponent,
    VendorDashboardComponent,
    VendorProductsComponent,
    VendorAddNewProductComponent,
    VendorReportComponent,
    VendorSettingsComponent
  ],
  imports: [
    CommonModule,
    VendorRoutingModule
  ]
})
export class VendorModule { }
