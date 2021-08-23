import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './component/layouts/header/header.component';
import { SidemenuComponent } from './component/layouts/sidemenu/sidemenu.component';
import { NotificationComponent } from './component/layouts/notification/notification.component';
import { NavigationComponent } from './component/layouts/navigation/navigation.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { AppRoutingModule } from './app-routing.module';
import { TicketDetailsComponent } from './component/ticket/ticket-details/ticket-details.component';
import { TicketListComponent } from './component/ticket/ticket-list/ticket-list.component';
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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SettingsComponent } from './component/settings/settings.component';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import { TicketAddComponent } from './component/ticket/ticket-add/ticket-add.component';
import { ProductEditComponent } from './component/product/product-edit/product-edit.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import {MatTabsModule} from '@angular/material/tabs';

@NgModule({
  declarations: [
    AppComponent,HeaderComponent,SidemenuComponent,NotificationComponent,NavigationComponent,DashboardComponent,TicketDetailsComponent, TicketListComponent,SupportComponent,ProductAddComponent,ProductListComponent,ProfileDetailsComponent,ProfileEditComponent,PackageListComponent,LoginComponent,RegisterComponent, SettingsComponent, TicketAddComponent, ProductEditComponent,
  ],
  imports: [
    BrowserModule,MatDatepickerModule,MatTabsModule,MatInputModule,MatNativeDateModule,CarouselModule,AppRoutingModule,NgxUiLoaderModule,CommonModule,FormsModule,ReactiveFormsModule,HttpClientModule,BrowserAnimationsModule,SocialLoginModule,
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '735488008597-ulevdo2cq8pe45bg0b1i8idbvp9u5fs3.apps.googleusercontent.com'
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('clientId')
          }
        ]
      } as SocialAuthServiceConfig,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
