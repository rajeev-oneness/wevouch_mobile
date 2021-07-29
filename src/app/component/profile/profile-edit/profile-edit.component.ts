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
  ngOnInit(): void {
    window.scrollTo(0, 0);
    this._loader.startLoader('loader');
    
    let user = JSON.parse(localStorage.getItem('userInfo') || '{}');
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
    
  }

}
