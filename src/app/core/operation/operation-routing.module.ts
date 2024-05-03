import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShopComponent } from './shop/shop.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { ShippingInfoComponent } from './shipping-info/shipping-info.component';
import { OrderCompletedComponent } from './order-completed/order-completed.component';
import { ProductCategoryComponent } from './product-category/product-category.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'shop', pathMatch: 'full'
  },
  {
    path: 'shop', component: ShopComponent,
  },
  {
    path: 'product-details/:id', component: ProductDetailsComponent
  },
  {
    path: 'category/:id', component: ProductCategoryComponent
  },
  {
    path: 'shopping-cart', component: ShoppingCartComponent
  },
  {
    path: 'checkout', component: ShippingInfoComponent
  },
  {
    path: 'order-completed', component: OrderCompletedComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperationRoutingModule { }
