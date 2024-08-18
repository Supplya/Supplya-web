import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { SharedModule } from './shared/shared.module';
import { Server } from 'src/assets/apConfig';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandlingInterceptor } from './shared/Interceptors/error-handling.interceptor';
import { MenuService } from './shared/services/menu.service';
import { DatePipe, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { LoaderService } from './shared/services/loader.service';
import { LoaderInterceptor } from './shared/Interceptors/loader-interceptor.service';
import { LoaderComponent } from './shared/loader/loader.component';
import { AuthInterceptor } from './shared/Interceptors/auth.interceptor';
import { TitleService } from './shared/services/title.service';
import { OnlineStatusModule } from 'ngx-online-status';
import { CloudinaryModule } from '@cloudinary/ng';

@NgModule({
  declarations: [AppComponent, NotFoundPageComponent, LoaderComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    BrowserAnimationsModule,
    OnlineStatusModule,
    CloudinaryModule,
    
  ],
  providers: [
    Server,
    MenuService,
    DatePipe,
    TitleService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlingInterceptor,
      multi: true,
    },
    LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private titleService: TitleService) {
    this.titleService.init();
  }
}
