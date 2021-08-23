import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService } from "src/app/service/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import  Swal  from "sweetalert2";

@Component({
  selector: 'app-ticket-add',
  templateUrl: './ticket-add.component.html',
  styleUrls: ['./ticket-add.component.css']
})
export class TicketAddComponent implements OnInit {

  constructor(private _loader:NgxUiLoaderService, private _api:ApiService, private _router:Router, private _active:ActivatedRoute) { }
  
  public user : any = {};
  public products : any = '';
  public productId : any = '';
  public productDetail : any = {};
  public errorMessage : any = '';
  public Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: false,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });
  public stepOne : boolean = true;
  public stepTwo : boolean = false;
  public stepThree : boolean = false;
  public stepFour : boolean = false;
  public addTicketValue : any = new Object();
  public addedTicketDetail : any = new Object();


  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.productId = this._active.snapshot.paramMap.get('productId');
    this._loader.startLoader('loader');
    this.user = JSON.parse(localStorage.getItem('userInfo') || '{}');
    this.addTicketValue.address = this.user.address;
    this.addTicketValue.transportationType = 'On Site';
    this._api.productList(this.user._id).subscribe(
      res => {
        this.products = res.filter( (e:any) => e.status === 'active');
        console.log('Product List', this.products);
      }, err => {}
    )
    this._loader.stopLoader('loader');
    this.getProductDetail();
  }

  getProductDetail() {
    this._api.productDetail(this.productId).subscribe(
      res => {
        this.productDetail = res;
        console.log('Product Detail',res);
      }, err => {}
    )
  }
  
  prev() {
    if(this.stepOne === true) {
      this._router.navigate(['/product/list']);
    }
    if(this.stepTwo === true) {
      this.stepOne = true;
      this.stepTwo = false;
      this.stepThree = false;
      this.stepFour = false;
    }
    if(this.stepThree === true) {
      this.stepOne = false;
      this.stepTwo = true;
      this.stepThree = false;
      this.stepFour = false;
    }
  }
  firstTab(formData:any) {
    for (let i in formData.controls) {
      formData.controls[i].markAsTouched();
    }
    if (formData?.valid) {
      // if (this.category && this.brandId && this.subCategory) {
        console.log(formData.value);
        Object.keys(formData.value).forEach((key)=>{
          this.addTicketValue[key] = formData.value[key];
        });
        this.stepOne = false;
        this.stepTwo = true;
        this.stepThree = false;
        this.stepFour = false;
        this.errorMessage = "";
      // } else {
      //   this.errorMessage = 'Please fill out all the details';
      // }
    } else {
      this.errorMessage = 'Please fill out all the details';
    }
    
  }
  secondTab(formData:any) {
    
    for (let i in formData.controls) {
      formData.controls[i].markAsTouched();
    }
    if (formData?.valid) {
      // if (this.category && this.brandId && this.subCategory) {
        console.log(formData.value);
        Object.keys(formData.value).forEach((key)=>{
          this.addTicketValue[key] = formData.value[key];
        });
        this.stepOne = false;
        this.stepTwo = false;
        this.stepThree = true;
        this.stepFour = false;
        this.errorMessage = "";
      // } else {
      //   this.errorMessage = 'Please fill out all the details';
      // }
    } else {
      this.errorMessage = 'Please fill out all the details';
    }
  }
  thirdTab(formData:any) {
    
    for (let i in formData.controls) {
      formData.controls[i].markAsTouched();
    }
    if (formData?.valid) {
      // if (this.category && this.brandId && this.subCategory) {
        Object.keys(formData.value).forEach((key)=>{
          this.addTicketValue[key] = formData.value[key];
        });
        this.addTicketValue.productId = this.productId;
        this.addTicketValue.userId = this.user._id;
        this.addTicketValue.category = this.productDetail.category._id;
        this.addTicketValue.brandId = this.productDetail.brands._id;
        // let mainForm = this.addTicketValue;
        const mainForm = this.addTicketValue;
        console.log(mainForm);
        this._api.ticketAdd(mainForm).subscribe(
          (res) => {
            this.addedTicketDetail = res.ticket;
            console.log(this.addedTicketDetail);
            this.Toast.fire({
              icon: 'success',
              title: 'Ticket raised successfully!'
            })
            this._loader.stopLoader('loader');
          },
          (err) => {
            this.errorMessage = err;
            this._loader.stopLoader('loader');
          }
        );
        // console.log(this.addTicketValue);

        this.stepOne = false;
        this.stepTwo = false;
        this.stepThree = false;
        this.stepFour = true;
        this.errorMessage = "";
      // } else {
      //   this.errorMessage = 'Please fill out all the details';
      // }
    } else {
      this.errorMessage = 'Please fill out all the details';
    }
  }


}
