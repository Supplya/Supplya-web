import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OperationRoutingModule } from './operation-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { OrderCompletedComponent } from './order-completed/order-completed.component';
import { ShippingInfoComponent } from './shipping-info/shipping-info.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ShopComponent } from './shop/shop.component';
import { ProductCategoryComponent } from './product-category/product-category.component';


@NgModule({
  declarations: [
    ShopComponent,
    OrderCompletedComponent,
    ShippingInfoComponent,
    ShoppingCartComponent,
    ProductDetailsComponent,
    ProductCategoryComponent
  ],
  imports: [
    CommonModule,
    OperationRoutingModule,
    SharedModule
  ]
})
export class OperationModule { }
