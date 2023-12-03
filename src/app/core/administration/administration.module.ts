import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministrationRoutingModule } from './administration-routing.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ProductsComponent } from './product/products/products.component';
import { ViewProductDetailsComponent } from './product/view-product-details/view-product-details.component';
import { ViewCategoryDetailsComponent } from './category/view-category-details/view-category-details.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { OrdersComponent } from './orders/orders.component';
import { CategoryComponent } from './category/category/category.component';
import { UsersComponent } from './users/users/users.component';
import { ViewUserDetailsComponent } from './users/view-user-details/view-user-details.component';


@NgModule({
  declarations: [
    AdminDashboardComponent,
    ProductsComponent,
    ViewProductDetailsComponent,
    ViewCategoryDetailsComponent,
    OrdersComponent,
    CategoryComponent,
    UsersComponent,
    ViewUserDetailsComponent
  ],
  imports: [
    CommonModule,
    AdministrationRoutingModule,
    SharedModule
  ]
})
export class AdministrationModule { }
