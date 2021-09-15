import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService } from "src/app/service/api.service";
import { Router } from "@angular/router";
import  Swal  from "sweetalert2";
import { dateDiffInDays } from "src/app/service/globalFunction";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  title = 'angularowlslider';
    elecTronics: any = {
    loop: true,
    margin: 15,
    nav: false,
    dots: false,
    autoplay:true,
		autoplayTimeout: 5000,
		autoplayHoverPause: true,
    responsiveClass: true,
    responsive: {
      0:{
				items:2,
			},
			600:{
				items:2,
			},
			760:{
				items:2,
			}
    },
  }

  planUpgrade: any = {
    loop: true,
    margin: 15,
    nav: false,
    dots: false,
    autoplay:false,
		autoplayTimeout: 5000,
		autoplayHoverPause: true,
    responsiveClass: true,
    responsive: {
      0:{
				items:1.2,
			},
			600:{
				items:1.2,
			},
			760:{
				items:1.2,
			}
    },
  }

  productDetailList: any = {
    loop: false,
    margin: 200,
    nav: false,
    dots: false,
    autoplay:true,
		autoplayTimeout: 5000,
		autoplayHoverPause: true,
    responsiveClass: true,
    responsive: {
      0:{
				items:1,
			},
			600:{
				items:1,
			},
			760:{
				items:1,
			}
    },
  }
  
  constructor(private _loader:NgxUiLoaderService, private _api:ApiService, private _router:Router) { }
  public user : any = {}
  public products : any = ''
  public showDetail: boolean = false 
  public productDeatil : any = []
  public warrantyValidTill : any = ''
  public amcValidTill : any = ''
  public amcLeftDays : any = ''
  public dateNow : any = Date.now(); 
  public tickets : any = []
  public newTickets : any = []
  public ongoingTickets : any = []

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this._loader.startLoader('loader');
    const userData = JSON.parse(localStorage.getItem('userInfo') || '{}');
    this.getUser(userData._id);
    // console.log(this.user);
  }

  getUser(userId : any) {
    this._api.userDetails(userId).subscribe(
      res => {
        this.user = res;
      }
    )
  }


  


}
