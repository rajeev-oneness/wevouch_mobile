import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService } from "src/app/service/api.service";
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  title = 'angularowlslider';
  productList: any = {
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

  constructor(private _loader:NgxUiLoaderService, private _api:ApiService) { }
  public user : any = {}
  public products : any = ''

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this._loader.startLoader('loader');
    this.user = JSON.parse(localStorage.getItem('userInfo') || '{}');
    this._api.productList(this.user._id).subscribe(
      res => {
        console.log(res);
        this.products = res;
      }, err => {}
    )
    this._loader.stopLoader('loader');
  }

}
