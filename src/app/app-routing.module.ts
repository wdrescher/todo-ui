import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { LoginGuard } from './services/login.guard'; 
import { SignoutGuard } from './services/signout.guard';
import { SustainingLoginGuard } from './services/sustaining-login.guard';
import { MustBeLoggedInGuard } from './services/must-be-logged-in.guard'; 

const routes: Routes = [
  { path: '', canActivate: [SustainingLoginGuard], children:[
    { path: "", component: LandingPageComponent },
    { path: "login", component: LoginPageComponent },
    { path: 'login/:route', component: LoginPageComponent }, 
    { path: "forgot-password", component: LoginPageComponent, data: {forgotPassword: true}},
    { path: "reset-password/:token", component: LoginPageComponent, data: {resetPassword: true}},
    { path: "verify-email/:token", component: LoginPageComponent },
    { path: 'signup', component: LoginPageComponent, data: { isSignUp: true }}, 
    { path: "", canActivate: [MustBeLoggedInGuard], children: [
      { path: "", canActivate: [LoginGuard], children: [
        { path: 'home', component: LoginPageComponent },
      ]}
    ]}
  ]},
  { path: 'signout', component: LandingPageComponent, canActivate: [SignoutGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [LoginGuard],
  exports: [RouterModule]
})
export class AppRoutingModule { }
