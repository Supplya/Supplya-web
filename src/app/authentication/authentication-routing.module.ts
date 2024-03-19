import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { OtpResetPasswordComponent } from './otp-reset-password/otp-reset-password.component';
import { CreateNewPasswordComponent } from './create-new-password/create-new-password.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'sign-in', pathMatch: 'full'
  },
  {
    path: 'sign-in', component: LoginComponent
  },
  {
    path: 'sign-up', component: RegisterComponent
  },
  {
    path: 'forget-password', component: ForgotPasswordComponent
  },
  {
    path: 'reset-password', component: OtpResetPasswordComponent
  },
  {
    path: 'create-new-password', component: CreateNewPasswordComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
