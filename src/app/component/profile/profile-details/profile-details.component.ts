import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.css']
})
export class ProfileDetailsComponent implements OnInit {

  constructor(private _loader: NgxUiLoaderService, private _api:ApiService, private _router:Router) { }
  
  public userDetail : any = {};
  public copyState : boolean = false;

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
        this._api.updateUserLocally(res);
        this._loader.stopLoader('loader');
      }, err => {}
    )
  }

  copyReferralCode(copyText : any) {
    navigator.clipboard.writeText(copyText);
    this.copyState = true;
  }

}
