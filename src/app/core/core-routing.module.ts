import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main-layout/main/main.component';
import { AuthGuard } from '../shared/Guard/auth.guard';

const routes: Routes = [
  {
    path: '', component: MainComponent,
    children: [
      {
        path: 'admin',
        loadChildren: () =>
          import('./administration/administration.module').then(
            (m) => m.AdministrationModule
          ),
        canActivate: [AuthGuard],

      },

      {
        path: 'vendor',
        loadChildren: () =>
          import('./vendor/vendor.module').then(
            (m) => m.VendorModule
          ),
        canActivate: [AuthGuard],

      },
      {
        path: 'customer',
        loadChildren: () =>
          import('./customer/customer.module').then(
            (m) => m.CustomerModule
          ),
        canActivate: [AuthGuard],

      },
    ]
  },
  {
    path: 'operation',
    loadChildren: () =>
      import('./operation/operation.module').then(
        (m) => m.OperationModule
      ),


  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
