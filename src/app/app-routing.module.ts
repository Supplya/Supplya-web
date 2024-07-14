import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';

const routes: Routes = [
  {path: '', loadChildren: () => import('./pages/pages.module').then((m) => m.PagesModule)},
  {path: 'auth', loadChildren: () => import('./authentication/authentication.module').then((m) => m.AuthenticationModule)},
  {path: 'core', loadChildren: () => import('./core/core.module').then((m) => m.CoreModule)},
  { path: '**', redirectTo: '/not-found', pathMatch: 'full' },
  { path: 'not-found', component: NotFoundPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
