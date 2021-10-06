import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private _api:ApiService,private _loader : NgxUiLoaderService,private _router:Router) {
    this._loader.startLoader('loader');
  }
  public errorMessage = '';
  public confirmPassword : any = '';
  ngOnInit(): void {
    window.scrollTo(0,0);
    if(this._api.isAuthenticated()){
      this._router.navigate(['/home']);
    }
    this._loader.stopLoader('loader');
  }

  signUpUser(formData :any){
    this.errorMessage = '';
    for( let i in formData.controls ){
      formData.controls[i].markAsTouched();
    }
    if( formData?.valid ){
      if (this.confirmPassword == formData.value.password) {
        console.log(formData.value);
        const mainForm = formData.value;
        mainForm.image = 'http://cp-33.hostgator.tempwebhost.net/~a1627unp/wevouch/images/1629464354_businessman.png';
        this._loader.startLoader('loader');
        this._api.userSignupApi(mainForm).subscribe(
          res => {
            // this.errorMessage = res.message;
            console.log(res);
            const notificationForm = {
              "title": "Free Ticket Earn", 
              "userId": res.user._id, 
              "description": "You earn "+res.user.subscription.ticketCount+" tickets."
            }
            this._api.addNotification(notificationForm).subscribe(
              res=> {console.log(res);}
            );
            this._api.storeUserLocally(res.user);
            this._router.navigate(['/login']);
            this._loader.stopLoader('loader');
          },
          err => {
            this.errorMessage = "something went wrong please try after sometimes";
            this._loader.stopLoader('loader');
          }
        )
      } else {
        this.errorMessage = "Password not matched";
      }
    }else{
      this.errorMessage = 'Please fill out all the details';
    }
    // console.log('Form Data SUbmitted');
  }

  confirmPasswordCheck(e :any) {
    this.confirmPassword = e.target.value;
  }

}
