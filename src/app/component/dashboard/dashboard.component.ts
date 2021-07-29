import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from "ngx-ui-loader";
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  title = 'angularowlslider';
    elecTronics: any = {
    loop: false,
    margin: 10,
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
				items:3,
			}
    },
  }

  planUpgrade: any = {
    loop: false,
    margin: 10,
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
  
  constructor(private _loader:NgxUiLoaderService) { }
  public user : any = {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this._loader.startLoader('loader');
    this.user = JSON.parse(localStorage.getItem('userInfo') || '{}');
    console.log(this.user);
    this._loader.stopLoader('loader');
  }

}
