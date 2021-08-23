import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService } from "src/app/service/api.service";
declare var Razorpay: any;
import { environment } from "src/environments/environment";
import { Router } from "@angular/router";
import  Swal  from "sweetalert2";

@Component({
  selector: 'app-package-list',
  templateUrl: './package-list.component.html',
  styleUrls: ['./package-list.component.css']
})
export class PackageListComponent implements OnInit {

  title = 'angularowlslider';
  productList: any = {
    loop: true,
    margin: 10,
    nav: false,
    dots: true,
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

  constructor(private _loader:NgxUiLoaderService, private _api:ApiService, private _router:Router) { }
  
  public packages : any = ''
  public userInfo: any = JSON.parse(localStorage.getItem('userInfo') || '{}');
  public purchaseOptions: any = {};

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this._loader.startLoader('loader');
    this.getPackageList();
  }

  getPackageList() {
    this._api.packageList().subscribe(
      res => {
        this._loader.startLoader('loader');
        console.log(res);
        this.packages = res;
        this._loader.stopLoader('loader');
      }, err => {}
    )
  }
  
  initPay(packageId : any) {
    this._api.packageDetail(packageId).subscribe(
      res => {
        console.log(res);
        let prefilledData = {
          'name': this.userInfo.name,
          'email': this.userInfo.email,
          'contact': this.userInfo.mobile
        }
        let userId = this.userInfo._id;
        let subscriptionId = res._id;
        this.purchaseOptions = {
          "key": environment.rzp_key_id,
          "amount": res.amount*100,
          "currency": "INR",
          "name": "WeVouch",
          "description": res.name + " Subscription",
          "image": "../assets/images/logo-icon.png",
          "handler": (response : any) => {
            console.log(response._id);
            this._api.updateUserDetails(userId, {'subscriptionId': subscriptionId}).subscribe(
              res => {
                console.log(res);
                // this._router.navigate(['/profile/details']);
                const formData = {
                  "userId" : userId, 
                  "subscriptionId" : subscriptionId, 
                  "transactionId" : response.razorpay_payment_id, 
                  "transactionAmount" : res.subscription.amount
                }
                this._api.addTransaction(formData).subscribe(res => {});
                Swal.fire({
                  title: 'Purchased!',
                  text: 'Your payment is successfull. Payment Id: '+response.razorpay_payment_id+' .Please note the payment Id',
                  icon: 'success',
                  confirmButtonText: 'Done!',
                }).then((result) => {
                  if (result.isConfirmed) {
                    Swal.fire(
                      'Redirecting...',
                      'success'
                    )
                    window.location.href = environment.basePath+'profile/details';
                  }
                })
              }, err => {}
            )
            
          },
          "prefill": prefilledData,
          "notes": {
            // "subscription": "Buying subscription"
          },
          "theme": {
            "color": "#00c0c9"
          }
        }
        var rzp1 = new Razorpay(this.purchaseOptions);
        rzp1.open();
      }, err => {}
    );
    
    
  }

}
