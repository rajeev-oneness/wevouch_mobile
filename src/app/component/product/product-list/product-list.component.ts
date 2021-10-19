import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService } from "src/app/service/api.service";
import { Router } from "@angular/router";
import  Swal  from "sweetalert2";
import { dateDiffInDays } from "src/app/service/globalFunction";
import { dateDiffInHours } from "src/app/service/globalFunction";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  title = 'angularowlslider';
  public productList: any = {
    margin: 15,
    nav: false,
    dots: false,
    autoplay:false,
		autoplayTimeout: 5000,
		autoplayHoverPause: true,
    responsiveClass: true,
    responsive: {
      0:{
				items:1.8,
			},
			600:{
				items:1.8,
			},
			760:{
				items:1.8,
			}
    },
  }
  productDetailList: any = {
    loop: false,
    margin: 300,
    nav: false,
    dots: false,
    autoplay:false,
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
  // public dateNow : any = new Date('2024, 08, 08'); 

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this._loader.startLoader('loader');
    const userData = JSON.parse(localStorage.getItem('userInfo') || '{}');
    this.getUser(userData._id);
  }
  
  getUser(userId : any) {
    this._api.userDetails(userId).subscribe(
      res => {
        this.user = res;
        this.getProducts();
      }
    )
  }

  getProducts() {
    this._loader.startLoader('loader');
    this._api.productList(this.user._id).subscribe(
      res => {
        console.log(res);
        this.products = res;
        if (this.products.length > 1) {
          this.productList.loop = true;
        } else {
          this.productList.loop = false;
        }
        for (let index = 0; index < res.length; index++) {
          if (res[index]?.purchaseDate) {
            let purchaseDate = new Date(res[index].purchaseDate);
            res[index].expiresOn = purchaseDate.setMonth(purchaseDate.getMonth()+res[index].warrantyPeriod);
            let warrantyDaysLeft = dateDiffInDays(this.dateNow, res[index].expiresOn);
            console.log(warrantyDaysLeft+" days left");
            if(warrantyDaysLeft == 30 || warrantyDaysLeft == 3 || warrantyDaysLeft == 0) {
              let title = '';
              let text = '';
              if(warrantyDaysLeft <= 0 ) {
                title = "Warranty Lapse";
                text = "Dear "+this.user.name+", your warranty for "+res[index].name+" has lapsed.";
              } else {
                title = "Warranty Expiry in "+warrantyDaysLeft+" days";
                text = "Dear "+this.user.name+", your warranty for "+res[index].name+" will expire in "+warrantyDaysLeft+" days on <date>. Kindly extend your warranty before it expires.";
              }
              this.sendNotification(title, text);
            } else {}
          }
          if(res[index]?.amcDetails?.noOfYears) {
            let amcSrtartDate = new Date(res[index].amcDetails.startDate);
            let amcValidTill = amcSrtartDate.setMonth(amcSrtartDate.getMonth()+(res[index].amcDetails.noOfYears*12));
            let amcLeftDays = dateDiffInDays(this.dateNow, amcValidTill);
            console.log(amcLeftDays+" days left of amc");
            if(amcLeftDays == 7 || amcLeftDays == 0) {
              let title = '';
              let text = '';
              if(amcLeftDays == 0 ) {
                title = "AMC service expired";
                text = "AMC service of Product "+res[index].name+" has expired.";
              } else {
                title = "AMC expiry in "+amcLeftDays+" days";
                text = "Dear "+this.user.name+", your Annual Maintenance Contract for "+res[index].name+" will be expiring in "+amcLeftDays+" days.";
              }
              this.sendNotification(title, text);
            } else {}
          }
          if(res[index]?.extendedWarranty?.noOfYears) {
            let extdWarrantyStart = new Date(res[index].extendedWarranty.startDate);
            let extdWarrantyValidTill = extdWarrantyStart.setMonth(extdWarrantyStart.getMonth()+(res[index].extendedWarranty.noOfYears*12));
            let extdwarrantyLeftDays = dateDiffInDays(this.dateNow, extdWarrantyValidTill);
            console.log(extdwarrantyLeftDays+" days left of Extended warranty");
            if(extdwarrantyLeftDays == 7 || extdwarrantyLeftDays == 0) {
              let title = '';
              let text = '';
              if(extdwarrantyLeftDays == 0 ) {
                title = "Extended warranty expired";
                text = "Dear "+this.user.name+", your extended warranty for "+res[index].name+" has lapsed on "+extdWarrantyValidTill;
              } else {
                title = "Extended warranty Expiry in "+extdwarrantyLeftDays+" days";
                text = "Dear "+this.user.name+", your extended warranty for "+res[index].name+" is coming up for renewal on "+extdWarrantyValidTill+".";
              }
              this.sendNotification(title, text);
            } else {}
          }
        }
        this._loader.stopLoader('loader');
      }, err => {}
    )
  }

  showHideProductDetail(productId = '') {
    this.amcValidTill = '';
    this.amcLeftDays = '';
    this.showDetail = !this.showDetail;
    this.warrantyValidTill = '';
    if(productId != '') {
      this._api.productDetail(productId).subscribe(
        res => {
          console.log(res);
          this.productDeatil = res;
          if(res.purchaseDate) {
            let purchaseDate = new Date(res.purchaseDate);
            this.warrantyValidTill = purchaseDate.setMonth(purchaseDate.getMonth()+res.warrantyPeriod);
            console.log('warranty valid till' , this.warrantyValidTill);
          }
          if(res.amcDetails?.noOfYears) {
            let amcSrtartDate = new Date(res.amcDetails.startDate);
            this.amcValidTill = amcSrtartDate.setMonth(amcSrtartDate.getMonth()+(res.amcDetails.noOfYears*12));
            this.amcLeftDays = dateDiffInDays(this.dateNow, this.amcValidTill);
          }
        }, err => {}
      )
      this._api.ticketListByProduct(productId).subscribe(
        res => {
          console.log(res);
          this.tickets = res;
          this.newTickets = res.filter((t: any) => t.status === 'new');
          this.ongoingTickets = res.filter((t: any) => t.status === 'ongoing');
        }, err => {}
      )
    }
  }

  sendNotification(title : any, description : any){
      const notificationForm = {
        "title": title, 
        "userId": this.user._id, 
        "description": description
      }
      this._api.addNotification(notificationForm).subscribe(
        res=> {console.log(res);}
      );
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
            const notificationForm = {
              "title": "Product deleted", 
              "userId": this.user._id, 
              "description": "Dear "+this.user.name+", you have successfully deleted the product "+this.productDeatil.name+"."
            }
            this._api.addNotification(notificationForm).subscribe(
              res=> {console.log(res);}
            );
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
