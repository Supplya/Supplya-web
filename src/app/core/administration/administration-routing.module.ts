import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ProductsComponent } from './product/products/products.component';
import { OrdersComponent } from './orders/orders.component';
import { CategoryComponent } from './category/category/category.component';
import { UsersComponent } from './users/users/users.component';
import { AddNewCategoryComponent } from './category/add-new-category/add-new-category.component';
import { ViewCategoryDetailsComponent } from './category/view-category-details/view-category-details.component';
import { AddNewProductComponent } from './product/add-new-product/add-new-product.component';
import { ViewProductDetailsComponent } from './product/view-product-details/view-product-details.component';
import { AddNewUserComponent } from './users/add-new-user/add-new-user.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { RolePermissionComponent } from './role/role-permission/role-permission.component';
import { AddNewRoleComponent } from './role/add-new-role/add-new-role.component';
import { SettingsComponent } from './settings/settings.component';
import { EditProductComponent } from './product/edit-product/edit-product.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: AdminDashboardComponent },
  { path: 'analytics', component: AnalyticsComponent },
  {
    path: 'products',
    component: ProductsComponent,
    data: { title: 'All Products' },
  },
  {
    path: 'add-new-product',
    component: AddNewProductComponent,
    data: { title: 'Add New Product' },
  },
  {
    path: 'edit-product/:id',
    component: EditProductComponent,
    data: { title: 'Edit Product' },
  },
  { path: 'view-product/:_id', component: ViewProductDetailsComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'categories', component: CategoryComponent },
  { path: 'add-new-category', component: AddNewCategoryComponent },
  { path: 'view-category/:_id', component: ViewCategoryDetailsComponent },
  { path: 'users', component: UsersComponent },
  { path: 'add-new-user', component: AddNewUserComponent },
  { path: 'view-user/:_id', component: AddNewUserComponent },
  { path: 'add-new-role', component: AddNewRoleComponent },
  { path: 'role-permissions', component: RolePermissionComponent },
  { path: 'settings', component: SettingsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule { }
