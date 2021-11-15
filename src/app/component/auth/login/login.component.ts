import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import { SocialAuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import Swal from 'sweetalert2';
import { environment } from "src/environments/environment";
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  spalshSlid: OwlOptions = {
    loop: true,
    autoplay:true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: false
  }

  public errorMessage = '';
  public showSlider : boolean = true;
  public mainLogin: boolean = true;
  public otpStep1: boolean = false;
  public otpStep2: boolean = false;
  public forgrtPassStep1: boolean = false;
  public forgrtPassStep2: boolean = false;
  public otpMobile: any = '';
  public forgetPassEmail: any = '';
  public forgetPassEmailOtp: any = '';
  public newForgetPassword: any = '';
  public accountConfirmation: boolean = false;
  public userEmail: any = '';

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
    // window.scrollTo(0, 0);
    this._loader.startLoader('loader');
  }
  

  ngOnInit(): void {
    if(this._api.isAuthenticated()){
      this._router.navigate(['/home']);
    }
    this._loader.stopLoader('loader');
    const sliderHide = JSON.parse(localStorage.getItem('sliderStatus') || '{}');
    if (sliderHide.hidden === true) {
      this.showSlider = false;
    }
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
          console.log(res);
          this.userEmail = res.user.email;
          if (res.user.is_email_verified === true && res.user.is_mobile_verified === true) {
            this._api.storeUserLocally(res.user);
          } else {
            this.accountConfirmation = true;
            this.mainLogin = false;
            this.otpStep1 = false;
            this.otpStep2 = false;
            this.forgrtPassStep1 = false;
            this.forgrtPassStep2 = false;
          }
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

  verifyAccount(formData : any) {
    this.errorMessage = '';
    for( let i in formData.controls ){
      formData.controls[i].markAsTouched();
    }
    if( formData?.valid ){
      this._loader.startLoader('loader');
      const mainForm = formData.value;
      mainForm.email = this.userEmail;
      this._api.userAccountVerify(mainForm).subscribe(
        res => {
          console.log(res);
          this._api.storeUserLocally(res.data);
          this.accountConfirmation = false;
          this.mainLogin = true;
        }, err => {
          this.errorMessage = "Something went wrong! / Incorrect OTP!";
        }
      )
      this._loader.stopLoader("loader");
    }
    
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then( (userData) => {
      let user = {'email': userData.email, 'socialId': userData.id};
      this._api.socialLogin(user).subscribe( 
        res => {
          // let timerInterval: any;
          // Swal.fire({
          //   title: 'success!',
          //   width: 200,
          //   html: 'Login successfully',
          //   timer: 20000,
          //   timerProgressBar: true,
          //   didOpen: () => {
          //     Swal.showLoading()
          //   },
          //   willClose: () => {
          //     clearInterval(timerInterval)
          //   }
          // }).then((result) => {
          //   if (result.dismiss === Swal.DismissReason.timer) {
          //     console.log('I was closed by the timer')
          //   }
          // })
          this._api.storeUserLocally(res.user);
          console.log(res);
          this._loader.stopLoader('loader');
        }, err => {
          this.errorMessage = err;
          this._loader.stopLoader('loader');
        }
      );
      // this._api.storeUserLocally(userData);
      // this._router.navigate(['/home']);
      console.log('Google login', userData);
      // console.log(user);
    });
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(
      (userData) => {
        console.log(userData);
        
      }
    );
  }

  signOut(): void {
    this.authService.signOut();
  }

  loginWithOtp() {
    this.errorMessage = '';

    if(this.otpStep1 === true || this.otpStep2 === true) {
      this.accountConfirmation = false;
      this.mainLogin = true;
      this.otpStep1 = false;
      this.otpStep2 = false;
      this.forgrtPassStep1 = false;
      this.forgrtPassStep2 = false;
    } else {
      this.accountConfirmation = false;
      this.mainLogin = false;
      this.otpStep1 = true;
      this.otpStep2 = false;
      this.forgrtPassStep1 = false;
      this.forgrtPassStep2 = false;
    }
  }

  getOtp() {
    this.errorMessage = ''
    if(this.otpMobile) {
      const mainForm = {
        "mobile" : this.otpMobile
      }
      this._api.getLoginOtp(mainForm).subscribe(
        res => {
          this._loader.startLoader('loader');
          console.log(res);
          this._loader.stopLoader('loader');
        }, err => {
          this.errorMessage = 'Something went wrong!'
        }
      )
    } else {
      this.errorMessage = 'Mobile is required'
    }
  }
  
  enterOtp() {
    this.getOtp();
    this.errorMessage= '';
    console.log(this.otpMobile);
    if(this.otpMobile != ''){
      this.accountConfirmation = false;
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
        "otp" : parseInt(mainOtp)
      }
      this._api.loginWithOtp(mainForm).subscribe(
        res => {
          this._loader.startLoader('loader');
          console.log(res);
          this._api.storeUserLocally(res);
          this._loader.stopLoader('loader');
          // this._router.navigate(["/user/dashboard"]);
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
    this.accountConfirmation = false;
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

  hideSlider() {
    localStorage.setItem('sliderStatus',JSON.stringify({"hidden": true}));
    this.showSlider = false;
  }

}
