import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListingComponent } from './listing/listing.component';
import { StoreComponent } from './store/store.component';
import { NotFoundPageComponent } from '../not-found-page/not-found-page.component';

const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: ':store-name',
  //   pathMatch: 'full',
  // },
  {
    path: ':store-name',
    component: StoreComponent,
  },
  { path: '**', redirectTo: '/not-found', pathMatch: 'full' },
  { path: 'not-found', component: NotFoundPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreRoutingModule { }
