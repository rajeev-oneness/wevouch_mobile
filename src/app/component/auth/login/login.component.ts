import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import { SocialAuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import Swal from 'sweetalert2';
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  public errorMessage = '';
  public mainLogin: boolean = true;
  public otpStep1: boolean = false;
  public otpStep2: boolean = false;
  public forgrtPassStep1: boolean = false;
  public forgrtPassStep2: boolean = false;
  public otpMobile: any = '';
  public forgetPassEmail: any = '';
  public forgetPassEmailOtp: any = '';
  public newForgetPassword: any = '';

  public otp1: any = '';
  public otp2: any = '';
  public otp3: any = '';
  public otp4: any = '';
  public Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: false,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });

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
          // this.errorMessage = res.message;
          this.Toast.fire({
            icon: 'success',
            title: 'Logged in successfully!'
          })
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
    this.errorMessage = '';

    if(this.otpStep1 === true || this.otpStep2 === true) {
      this.mainLogin = true;
      this.otpStep1 = false;
      this.otpStep2 = false;
      this.forgrtPassStep1 = false;
      this.forgrtPassStep2 = false;
    } else {
      this.mainLogin = false;
      this.otpStep1 = true;
      this.otpStep2 = false;
      this.forgrtPassStep1 = false;
      this.forgrtPassStep2 = false;
    }
  }
  
  enterOtp() {
    this.errorMessage= '';
    console.log(this.otpMobile);
    if(this.otpMobile != ''){
      this.mainLogin = false;
      this.otpStep1 = false;
      this.otpStep2 = true;
      this.forgrtPassStep1 = false;
      this.forgrtPassStep2 = false;
    } else {
      this.errorMessage = 'Phone number can not be null!'
    }
    
  }

  submitOtp() {
    this.errorMessage = ''
    if(this.otp1 && this.otp2 && this.otp3 && this.otp4) {
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
        }, err => {
          this.errorMessage = 'Something went wrong!'
        }
      )
    } else {
      this.errorMessage = 'OTP is required'
    }
  }

  forgetPassword() {
    this.errorMessage = '';

    this.mainLogin = false;
    this.otpStep1 = false;
    this.otpStep2 = false;
    this.forgrtPassStep1 = true;
    this.forgrtPassStep2 = false;
  }
  enterForgetPassEmail() {
    this.errorMessage = '';
    console.log(this.forgetPassEmail);
    
    if (this.forgetPassEmail) {
      const formData = {
        "email": this.forgetPassEmail
      }
      this._api.forgotPasswordReqSend(formData).subscribe(
        res => {
          this._loader.startLoader('loader');
          console.log(res);
          this.Toast.fire({
            icon: 'success',
            title: 'Check your email for OTP!'
          })
          this.mainLogin = false;
          this.otpStep1 = false;
          this.otpStep2 = false;
          this.forgrtPassStep1 = false;
          this.forgrtPassStep2 = true;
          this._loader.stopLoader('loader');
        }, err => {
          this.errorMessage = 'Something went wrong!'
        }
      )
    } else {
      this.errorMessage = 'Email can not empty!'
    }
  }
  resetPassword() {
    this.errorMessage = '';
    if (this.forgetPassEmail && this.forgetPassEmailOtp && this.newForgetPassword) {
      const formData = {
        "email":this.forgetPassEmail, 
        "otp":this.forgetPassEmailOtp, 
        "password":this.newForgetPassword
      }
      this._api.setNewPassword(formData).subscribe(
        res => {
          this._loader.startLoader('loader');
          console.log(res);
          this.Toast.fire({
            icon: 'success',
            title: 'Password reset successfull!'
          })
          this._loader.stopLoader('loader');
          window.location.href = environment.projectPath;
        }, err => {
          this.errorMessage = 'Something went wrong!'
        }
      )
    } else {
      this.errorMessage = 'OTP and New Password required!'
    }
  }

}
