import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { HeaderComponent } from './main-layout/header/header.component';
import { SidebarComponent } from './main-layout/sidebar/sidebar.component';
import { MainComponent } from './main-layout/main/main.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    MainComponent
  ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    SharedModule
  ]
})
export class CoreModule { }
