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
import { CustomersComponent } from './users/customers/customers.component';
import { VendorsComponent } from './users/vendors/vendors.component';
import { AdminsComponent } from './users/admins/admins.component';
import { ViewVendorsComponent } from './users/view-vendors/view-vendors.component';
import { ViewCustomersComponent } from './users/view-customers/view-customers.component';
import { EditCategoryComponent } from './category/edit-category/edit-category.component';
import { AddBlogPostComponent } from './blog/add-blog-post/add-blog-post.component';
import { BlogPostsComponent } from './blog/blog-posts/blog-posts.component';
import { EditBlogPostComponent } from './blog/edit-blog-post/edit-blog-post.component';
import { NotificationComponent } from './notification/notification.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: AdminDashboardComponent,
    data: { title: 'Dashboard' },
  },
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
    path: 'add-new-blog-post',
    component: AddBlogPostComponent,
    data: { title: 'Add New Blog Post' },
  },
  {
    path: 'blog-posts',
    component: BlogPostsComponent,
    data: { title: 'All Blog Posts' },
  },
  {
    path: 'edit-post/:id',
    component: EditBlogPostComponent,
    data: { title: 'All Blog Posts' },
  },
  {
    path: 'edit-product/:id',
    component: EditProductComponent,
    data: { title: 'Edit Product' },
  },
  {
    path: 'profile-settings',
    component: SettingsComponent,
    data: { title: 'Profile Information' },
  },
  {
    path: 'customers',
    component: CustomersComponent,
    data: { title: 'All Customers' },
  },
  {
    path: 'notifications',
    component: NotificationComponent,
    data: { title: 'Notifications' },
  },
  {
    path: 'vendors',
    component: VendorsComponent,
    data: { title: 'All Vendors' },
  },
  {
    path: 'view-vendor/:id',
    component: ViewVendorsComponent,
    data: { title: 'Vendor Information' },
  },
  {
    path: 'view-customer/:id',
    component: ViewCustomersComponent,
    data: { title: 'Customer Information' },
  },
  {
    path: 'administrators',
    component: AdminsComponent,
    data: { title: 'All Administrators' },
  },
  { path: 'orders', component: OrdersComponent },
  {
    path: 'categories',
    component: CategoryComponent,
    data: { title: 'All Categories' },
  },
  {
    path: 'edit-category/:id',
    component: EditCategoryComponent,
    data: { title: 'Edit Category' },
  },
  {
    path: 'add-new-category',
    component: AddNewCategoryComponent,
    data: { title: 'Add New Category' },
  },
  { path: 'users', component: UsersComponent },
  { path: 'add-new-user', component: AddNewUserComponent },
  { path: 'view-user/:id', component: AddNewUserComponent },
  { path: 'add-new-role', component: AddNewRoleComponent },
  { path: 'role-permissions', component: RolePermissionComponent },
  { path: 'settings', component: SettingsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule { }
