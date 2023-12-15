import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoaderComponent } from './loader/loader.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { NoInternetComponent } from './no-internet/no-internet.component';
import { ToastyModule } from 'ng-toasty';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoDataAvailableComponent } from './no-data-available/no-data-available.component';
import { HttpClientModule } from '@angular/common/http';
import { ReusableTableComponent } from './reusable-table/reusable-table.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterModule, Routes } from '@angular/router';
import { SpinnerComponent } from './spinner/spinner.component';


const sharedRoutes: Routes = [
  // {
  //   path: 'my-profile',
  //   component: UserProfileComponent,
  // },
];


@NgModule({
  declarations: [
    FooterComponent,
    NavbarComponent,
    BreadcrumbComponent,
    NoInternetComponent,
    NoDataAvailableComponent,
    ReusableTableComponent,
    SpinnerComponent,
    
  ],
  imports: [
    RouterModule.forChild(sharedRoutes),
    CommonModule,
    ToastyModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPaginationModule
  
  
  
  ],

  providers: [
    
  ],
  exports: [
    // components
    FooterComponent,
    NavbarComponent,
    BreadcrumbComponent,
    NoInternetComponent,
    NoDataAvailableComponent,
    ReusableTableComponent,
    SpinnerComponent,


    // Modules
    ToastyModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPaginationModule
 
  ]
})
export class SharedModule { }
