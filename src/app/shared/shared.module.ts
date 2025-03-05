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
import { BackButtonComponent } from './back-button/back-button.component';
import { LoadingIndicatorComponent } from './loading-indicator/loading-indicator.component';
import { InternetOfflineComponent } from './internet-offline/internet-offline.component';
import { CurrencyFormatDirective } from './helpers/currency-format.directive';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { MiniBreadcrumbComponent } from './mini-breadcrumb/mini-breadcrumb.component';
import { ShortenProductNamePipe } from './helpers/shorten-length.pipe';
import { SharedLoginComponent } from './shared-login/shared-login.component';
import { ProfileUpdateComponent } from './profile-update/profile-update.component';
import { GooglePlacesDirective } from './helpers/google-places.directive';
import { ProductListComponent } from './product-list/product-list.component';
import { GridProductListComponent } from './grid-product-list/grid-product-list.component';
import { AngularEditorConfigDirective } from './helpers/angular-editor-config.directive';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { StateHandlerComponent } from './state-handler/state-handler.component';
import { ShopProductComponent } from './shop-product/shop-product.component';
// import { QrCodeModule } from 'ng-qrcode';




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
    BackButtonComponent,
    LoadingIndicatorComponent,
    InternetOfflineComponent,
    CurrencyFormatDirective,
    MiniBreadcrumbComponent,
    ShortenProductNamePipe,
    SharedLoginComponent,
    ProfileUpdateComponent,
    GooglePlacesDirective,
    ProductListComponent,
    GridProductListComponent,
    AngularEditorConfigDirective,
    StateHandlerComponent,
    ShopProductComponent,
  ],
  imports: [
    RouterModule.forChild(sharedRoutes),
    CommonModule,
    ToastyModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPaginationModule,
    SelectDropDownModule,
    AngularEditorModule,
    // QrCodeModule,
  ],

  providers: [],
  exports: [
    // components
    FooterComponent,
    InternetOfflineComponent,
    NavbarComponent,
    BreadcrumbComponent,
    NoInternetComponent,
    NoDataAvailableComponent,
    ReusableTableComponent,
    SpinnerComponent,
    BackButtonComponent,
    LoadingIndicatorComponent,
    CurrencyFormatDirective,
    MiniBreadcrumbComponent,
    SharedLoginComponent,
    ProfileUpdateComponent,
    ProductListComponent,
    GridProductListComponent,
    GooglePlacesDirective,
    AngularEditorConfigDirective,
    StateHandlerComponent,
    ShopProductComponent,
    // Modules
    ToastyModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPaginationModule,
    SelectDropDownModule,
    AngularEditorModule,
    // QrCodeModule,
    ShortenProductNamePipe,
  ],
})
export class SharedModule {}
