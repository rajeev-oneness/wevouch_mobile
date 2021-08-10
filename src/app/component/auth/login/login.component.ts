import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import { SocialAuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private _api:ApiService,private _loader : NgxUiLoaderService,private _router:Router,private authService: SocialAuthService) {
    window.scrollTo(0, 0);
    this._loader.startLoader('loader');
  }
  public errorMessage = '';
  ngOnInit(): void {
    if(this._api.isAuthenticated()){
      this._router.navigate(['/home']);
    }
    this._loader.stopLoader('loader');
  }

  loginUser(formData :any){
    this.errorMessage = '';
    for( let i in formData.controls ){
      formData.controls[i].markAsTouched();
    }
    if( formData?.valid ){
      console.log(formData.value);
      const mainForm = formData.value;
      this._loader.startLoader('loader');
      this._api.userLoginApi(mainForm).subscribe(
        res => {
          this.errorMessage = res.message;
          console.log(res);
          this._api.storeUserLocally(res.user);
          this._loader.stopLoader('loader');
        },
        err => {
          this.errorMessage = "something went wrong please check credentials and try after sometimes";
          this._loader.stopLoader('loader');
        }
        
      )
    }else{
      this.errorMessage = 'Please fill out all the details';
    }
    // console.log('Form Data SUbmitted');
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then( (userData) => {
      let user = {'name': userData.name, 'email': userData.email, 'status': 'active', 'mobile': "9999999999", 'password': "123456"};
      // this._api.userSignupApi(user).subscribe( 
      //   res => {
      //     console.log(res);
      //     // this._api.storeUserLocally(res.user);
      //   }, err => {
      //     this.errorMessage = err;
      //     this._loader.stopLoader('loader');
      //   }
      // );
      // this._api.storeUserLocally(userData);
      // this._router.navigate(['/home']);
      console.log('Google login', userData);
      console.log(user);
      
    });
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.authService.signOut();
  }

}
