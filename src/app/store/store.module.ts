import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreRoutingModule } from './store-routing.module';
import { ListingComponent } from './listing/listing.component';
import { StoreComponent } from './store/store.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    ListingComponent,
    StoreComponent
  ],
  imports: [
    CommonModule,
    StoreRoutingModule,
    SharedModule
  ]
})
export class StoreModule { }
