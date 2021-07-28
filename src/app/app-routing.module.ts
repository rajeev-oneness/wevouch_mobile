import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { TicketComponent } from "./component/ticket/ticket.component";
import { ProductListComponent } from "./component/product/product-list/product-list.component";
import { ProductAddComponent } from "./component/product/product-add/product-add.component";
import { SupportComponent } from "./component/support/support.component";
import { ProfileDetailsComponent } from "./component/profile/profile-details/profile-details.component";
import { ProfileEditComponent } from "./component/profile/profile-edit/profile-edit.component";
import { PackageListComponent } from "./component/package/package-list/package-list.component";
import { LoginComponent } from "./component/auth/login/login.component";
import { RegisterComponent } from "./component/auth/register/register.component";
import { AuthCheckService } from "./service/auth-check.service";

const routes: Routes = [
  { path: '', component: DashboardComponent, pathMatch:'full', canActivate:[AuthCheckService] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: DashboardComponent, canActivate:[AuthCheckService] },
  { path: 'product', canActivate:[AuthCheckService], children: [
    { path: 'list', component: ProductListComponent },
    { path: 'add', component: ProductAddComponent },
  ]},
  { path: 'tickets', canActivate:[AuthCheckService], component: TicketComponent },
  { path: 'support', canActivate:[AuthCheckService], component: SupportComponent },
  { path: 'profile', canActivate:[AuthCheckService], children: [
    { path: 'details', component: ProfileDetailsComponent },
    { path: 'edit', component: ProfileEditComponent },
  ]},
  { path: 'package', canActivate:[AuthCheckService], children: [
    { path: 'list', component: PackageListComponent },
  ]},
  { path: '**', component: DashboardComponent, pathMatch:'full', canActivate:[AuthCheckService] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }