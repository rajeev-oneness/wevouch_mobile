import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService } from "src/app/service/api.service";
import { Router } from "@angular/router";
import  Swal  from "sweetalert2";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  title = 'angularowlslider';
    elecTronics: any = {
    loop: true,
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
    loop: true,
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

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this._loader.startLoader('loader');
    this.user = JSON.parse(localStorage.getItem('userInfo') || '{}');
    // console.log(this.user);
    this._api.productList(this.user._id).subscribe(
      res => {
        console.log(res);
        this.products = res;
        this._loader.stopLoader('loader');
      }, err => {}
    )
  }

  showHideProductDetail(productId = '') {
    this.showDetail = !this.showDetail;
    if(productId != '') {
      this._api.productDetail(productId).subscribe(
        res => {
          console.log(res);
          this.productDeatil = res;
        }, err => {}
      )
    }
  }

  deleteProduct(productId : any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This product will not recover!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete!',
      cancelButtonText: 'keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this._loader.startLoader('loader');
        this._api.deleteProduct(productId).subscribe(
          res => {
            console.log(res);
            this._loader.stopLoader('loader');
            this._router.navigate(['/product/list']);
          }, err => {}
        )
        Swal.fire(
          'Deleted!',
          'product has been deleted.',
          'success'
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'product is safe :)',
          'error'
        )
      }
    })
  }

}
