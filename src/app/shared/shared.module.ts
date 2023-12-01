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



@NgModule({
  declarations: [
    FooterComponent,
    NavbarComponent,
    LoaderComponent,
    BreadcrumbComponent,
    NoInternetComponent,
    NoDataAvailableComponent
  ],
  imports: [
    CommonModule,
    ToastyModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  
  ],
  exports: [
    // components
    FooterComponent,
    NavbarComponent,
    LoaderComponent,
    BreadcrumbComponent,
    NoInternetComponent,
    NoDataAvailableComponent,


    // Modules
    ToastyModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ]
})
export class SharedModule { }
