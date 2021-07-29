import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './component/layouts/header/header.component';
import { SidemenuComponent } from './component/layouts/sidemenu/sidemenu.component';
import { NotificationComponent } from './component/layouts/notification/notification.component';
import { NavigationComponent } from './component/layouts/navigation/navigation.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { AppRoutingModule } from './app-routing.module';
import { TicketComponent } from './component/ticket/ticket.component';
import { SupportComponent } from './component/support/support.component';
import { ProductListComponent } from './component/product/product-list/product-list.component';
import { ProductAddComponent } from './component/product/product-add/product-add.component';
import { ProfileDetailsComponent } from './component/profile/profile-details/profile-details.component';
import { ProfileEditComponent } from './component/profile/profile-edit/profile-edit.component';
import { PackageListComponent } from './component/package/package-list/package-list.component';
import { LoginComponent } from './component/auth/login/login.component';
import { RegisterComponent } from './component/auth/register/register.component';
import { NgxUiLoaderModule } from "ngx-ui-loader";
import { CommonModule } from "@angular/common";
import { FormsModule , ReactiveFormsModule, FormControl} from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";
import { CarouselModule } from 'ngx-owl-carousel-o';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

@NgModule({
  declarations: [
    AppComponent,HeaderComponent,SidemenuComponent,NotificationComponent,NavigationComponent,DashboardComponent,TicketComponent,SupportComponent,ProductAddComponent,ProductListComponent,ProfileDetailsComponent,ProfileEditComponent,PackageListComponent,LoginComponent,RegisterComponent
  ],
  imports: [
    BrowserModule,CarouselModule,AppRoutingModule,NgxUiLoaderModule,CommonModule,FormsModule,ReactiveFormsModule,HttpClientModule,BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
