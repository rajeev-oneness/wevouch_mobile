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
  
  public errorMessage = '';
  public mainLogin: any = true;
  public otpStep1: any = false;
  public otpStep2: any = false;
  public otpMobile: any = '';
  public otp1: any = '';
  public otp2: any = '';
  public otp3: any = '';
  public otp4: any = '';

  constructor(private _api:ApiService,private _loader : NgxUiLoaderService,private _router:Router,private authService: SocialAuthService) {
    window.scrollTo(0, 0);
    this._loader.startLoader('loader');
  }
  

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

  loginWithOtp() {
    if(this.otpStep1 === true || this.otpStep2 === true) {
      this.mainLogin = true;
      this.otpStep1 = false;
      this.otpStep2 = false;
    } else {
      this.mainLogin = false;
      this.otpStep1 = true;
      this.otpStep2 = false;
    }
  }
  
  enterOtp() {
    console.log(this.otpMobile);
     
    this.mainLogin = false;
    this.otpStep1 = false;
    this.otpStep2 = true;
  }

  submitOtp() {
    const mainOtp = this.otp1+this.otp2+this.otp3+this.otp4
    const mainForm = {
      "mobile" : this.otpMobile,
      "otp" : mainOtp.toString()
    }
    this._api.loginWithOtp(mainForm).subscribe(
      res => {
        this._loader.startLoader('loader');
        console.log(res);
        this._api.storeUserLocally(res);
        this._loader.stopLoader('loader');
        this._router.navigate(["/user/dashboard"]);
      }, err => {}
    )
  }

}
