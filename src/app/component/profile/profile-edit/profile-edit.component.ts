import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {

  constructor(private _loader: NgxUiLoaderService, private _api:ApiService, private _router:Router) { }
  public userDetail : any = {};
  public errorMessage : any = '';
  public user_id : any = '';
  ngOnInit(): void {
    window.scrollTo(0, 0);
    this._loader.startLoader('loader');
    
    let user = JSON.parse(localStorage.getItem('userInfo') || '{}');
    this.user_id = user._id;
    this.getUser(user._id);
    
  }

  getUser(userId : any) {
    console.log(userId);
    
    this._api.userDetails(userId).subscribe(
      res => {
        this.userDetail = res;
        this._loader.stopLoader('loader');
      }, err => {}
    )
  }

  updateUser(formData : any) {
    this.errorMessage = '';
    for( let i in formData.controls ){
      formData.controls[i].markAsTouched();
    }
    if( formData?.valid ){
      console.log(formData.value);
      const mainForm = formData.value;
      this._loader.startLoader('loader');
      this._api.updateUserDetails(this.user_id, mainForm).subscribe(
        res => {
          this.errorMessage = res.message;
          this._api.updateUserLocally(res);
          this._router.navigate(['/profile/details']);
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
  }

}
