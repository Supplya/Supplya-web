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
import { AddNewProductComponent } from './product/add-new-product/add-new-product.component';
import { AddNewCategoryComponent } from './category/add-new-category/add-new-category.component';
import { AddNewRoleComponent } from './role/add-new-role/add-new-role.component';
import { ViewRoleComponent } from './role/view-role/view-role.component';
import { AddNewUserComponent } from './users/add-new-user/add-new-user.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { RolePermissionComponent } from './role/role-permission/role-permission.component';
import { SettingsComponent } from './settings/settings.component';
import { EditProductComponent } from './product/edit-product/edit-product.component';


@NgModule({
  declarations: [
    AdminDashboardComponent,
    ProductsComponent,
    ViewProductDetailsComponent,
    ViewCategoryDetailsComponent,
    OrdersComponent,
    CategoryComponent,
    UsersComponent,
    ViewUserDetailsComponent,
    AddNewProductComponent,
    AddNewCategoryComponent,
    AddNewRoleComponent,
    ViewRoleComponent,
    AddNewUserComponent,
    AnalyticsComponent,
    RolePermissionComponent,
    SettingsComponent,
    EditProductComponent
  ],
  imports: [
    CommonModule,
    AdministrationRoutingModule,
    SharedModule
  ]
})
export class AdministrationModule { }
