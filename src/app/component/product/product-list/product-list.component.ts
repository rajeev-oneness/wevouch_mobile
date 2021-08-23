import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService } from "src/app/service/api.service";
import { Router } from "@angular/router";
import  Swal  from "sweetalert2";
import { dateDiffInDays } from "src/app/service/globalFunction";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  title = 'angularowlslider';
  productList: any = {
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
  // public dateNow : any = new Date('2024, 08, 08'); 

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this._loader.startLoader('loader');
    this.user = JSON.parse(localStorage.getItem('userInfo') || '{}');
    this.getProducts();
  }
  
  getProducts() {
    this._loader.startLoader('loader');
    this._api.productList(this.user._id).subscribe(
      res => {
        console.log(res);
        this.products = res;
        for (let index = 0; index < res.length; index++) {
          let purchaseDate = new Date(res[index].purchaseDate);
          res[index].expiresOn = purchaseDate.setMonth(purchaseDate.getMonth()+res[index].warrantyPeriod)
        }
        this._loader.stopLoader('loader');
      }, err => {}
    )
  }

  showHideProductDetail(productId = '') {
    this.amcValidTill = ''
    this.amcLeftDays = ''
    this.showDetail = !this.showDetail;
    if(productId != '') {
      this._api.productDetail(productId).subscribe(
        res => {
          console.log(res);
          this.productDeatil = res;
          let purchaseDate = new Date(res.purchaseDate);
          this.warrantyValidTill = purchaseDate.setMonth(purchaseDate.getMonth()+res.warrantyPeriod);
          if(res.amcDetails?.noOfYears) {
            let amcSrtartDate = new Date(res.amcDetails.startDate);
            this.amcValidTill = amcSrtartDate.setMonth(amcSrtartDate.getMonth()+(res.amcDetails.noOfYears*12));
            this.amcLeftDays = dateDiffInDays(this.dateNow, this.amcValidTill);
          }
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
            this.showHideProductDetail();
            this.getProducts();
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
