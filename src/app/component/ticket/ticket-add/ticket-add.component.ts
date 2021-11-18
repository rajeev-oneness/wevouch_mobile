import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService } from "src/app/service/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import  Swal  from "sweetalert2";
import { getDateFormat } from "src/app/service/globalFunction";
@Component({
  selector: 'app-ticket-add',
  templateUrl: './ticket-add.component.html',
  styleUrls: ['./ticket-add.component.css']
})
export class TicketAddComponent implements OnInit {

  public addressCount: {data: MULTIPLEADDRESS[];};

  constructor(private _loader:NgxUiLoaderService, private _api:ApiService, private _router:Router, private _active:ActivatedRoute) { 
    this.addressCount = {data : []};
  }
  
  public user : any = {};
  public products : any = '';
  public productId : any = '';
  public productDetail : any = {};
  public errorMessage : any = '';
  public addresErrorMessage : any = '';
  public minDate : any = getDateFormat(Date.now());
  public someDate = new Date();
  public maxDate : any = getDateFormat(this.someDate.setDate(this.someDate.getDate() + 10));
  
  
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
  public supportExecutives : any = new Array();
  public userAddresses : any = [];
  public cityData : any = [];
  public brandId : any = '';
  public selectedCity : any = '';
  public serviceCenters : any = [];

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.productId = this._active.snapshot.paramMap.get('productId');
    this._loader.startLoader('loader');
    this.user = JSON.parse(localStorage.getItem('userInfo') || '{}');
    this.addTicketValue.transportationType = 'On Site';
    this._api.productList(this.user._id).subscribe(
      res => {
        this.products = res.filter( (e:any) => e.status === 'active');
        console.log('Product List', this.products);
      }, err => {}
    )
    console.log(this.minDate);
    this.getAddressList();
    this._loader.stopLoader('loader');
    this.getProductDetail();
    
  }

  getCities() {
    this._api.getCities().subscribe(
      res=> {
        this.cityData = res.cities;
        console.log('city', this.cityData);
        this.selectedCity = res.cities[0].name;
        this.selectCity();
      }
    )
  }

  selectCity() {
    console.log(this.selectedCity);
    
    this._api.getServiceCenter(this.brandId, this.selectedCity).subscribe(
      res => {
        console.log('service center: ', res);
        this.serviceCenters = res.service_centers;
      }, err => {}
    )
  }

  getAddressList() {
    this._api.getAddressListByUser(this.user._id).subscribe(
      res => {
        console.log('addresses :',res);        
        this.userAddresses = res;
      }, err => {}
    )
  }

  getProductDetail() {
    this._api.productDetail(this.productId).subscribe(
      res => {
        this.productDetail = res;
        console.log("product detail of the ticket",this.productDetail);
        if(this.productDetail?.brands == '' || this.productDetail?.category == '' || this.productDetail?.modelNo == '' || this.productDetail?.subCategory == '') {
          Swal.fire({
            title: 'Failed!',
            text: 'You need to add brand, category, sub category, model no to your product.',
            icon: 'error',
            confirmButtonText: 'Edit product',
          }).then((result) => {
            if (result.isConfirmed) {
              this._router.navigate(['/product/edit/'+this.productId])
            }
          })
        }
        
        this._api.getProductBrands().subscribe(
          res => {
            // console.log('brands :', res.brands);
            this.brandId = res.brands.filter((t : any) => t.name === this.productDetail.brands)[0].id;
            console.log(this.brandId);
            this.getCities();
            
          }, err => {}
        )
        this._loader.stopLoader('loader');
        console.log('Product Detail',res);
      }, err => {}
    )
  }
  
  prev() {
    window.scrollTo(0, 0);
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
    window.scrollTo(0, 0);
    for (let i in formData.controls) {
      formData.controls[i].markAsTouched();
    }
    if (formData?.valid) {
      console.log(formData.value);
      Object.keys(formData.value).forEach((key)=>{
        this.addTicketValue[key] = formData.value[key];
      });
      this.stepOne = false;
      this.stepTwo = true;
      this.stepThree = false;
      this.stepFour = false;
      this.errorMessage = "";
    } else {
      this.errorMessage = 'Please fill out all the details';
    }
    
  }
  secondTab(formData:any) {
    window.scrollTo(0, 0);
    
    for (let i in formData.controls) {
      formData.controls[i].markAsTouched();
    }
    if (formData?.valid) {
      console.log(formData.value);
      Object.keys(formData.value).forEach((key)=>{
        this.addTicketValue[key] = formData.value[key];
      });
      // Object.keys(formData.value).forEach((key)=>{
      //   this.addTicketValue[key] = formData.value[key];
      // });

      // let multipleAddressArray: any = []
      // this.addressCount.data.forEach(element => {
      //   multipleAddressArray.push(element.addresses)
      // });
      // console.log(multipleAddressArray);
      // this.addTicketValue.multipleAddress = multipleAddressArray;


      this.stepOne = false;
      this.stepTwo = false;
      this.stepThree = true;
      this.stepFour = false;
      this.errorMessage = "";
    } else {
      this.errorMessage = 'Please fill out all the details';
    }
  }
  thirdTab(formData:any) {
    window.scrollTo(0, 0);
    
    for (let i in formData.controls) {
      formData.controls[i].markAsTouched();
    }
    if (formData?.valid) {
      if (formData.value.selectedTime >= '10:00' && formData.value.selectedTime <= '17:00') {
        Object.keys(formData.value).forEach((key)=>{
          this.addTicketValue[key] = formData.value[key];
        });
        this.addTicketValue.productId = this.productId;
        this.addTicketValue.userId = this.user._id;
        this.addTicketValue.category = this.productDetail.category
        this.addTicketValue.brandId = this.productDetail.brands;
        // let mainForm = this.addTicketValue;
        const mainForm = this.addTicketValue;
        console.log(mainForm);
        this._api.ticketAdd(mainForm).subscribe(
          (res) => {
            this._api.userDetails(this.user._id).subscribe(
              res => {
                this._api.updateUserLocally(res);
              }
            )
            this.addedTicketDetail = res.ticket;
            this.assignTicket(res.ticket._id);
            console.log(this.addedTicketDetail);
            this.Toast.fire({
              icon: 'success',
              title: 'Ticket raised successfully!'
            });
            const notificationForm = {
              "title": "Ticket raised", 
              "userId": this.user._id, 
              "description": "Dear "+this.user.name+", your ticket "+this.addedTicketDetail.uniqueId+" has been raised for the product "+this.productDetail.name+"."
            }
            this._api.addNotification(notificationForm).subscribe();
            this._loader.stopLoader('loader');
          },
          (err) => {
            this.errorMessage = err;
            this.Toast.fire({
              icon: 'error',
              title: 'Something went wrong!'
            })
            this._loader.stopLoader('loader');
          }
        );
        // console.log(this.addTicketValue);
  
        this.stepOne = false;
        this.stepTwo = false;
        this.stepThree = false;
        this.stepFour = true;
        this.errorMessage = "";
      } else {
        this.errorMessage="Time should be from 10 am to 5 pm";
      }
    } else {
      this.errorMessage = 'Please fill out all the details';
    }
  }

  assignTicket(ticketId : any) {
    this._api.getSupportExcutives().subscribe(
      res => {
        this.supportExecutives = [];
        for (let index = 0; index < res.length; index++) {
          if (res[index].assigned === false) {
            this.supportExecutives.push(res[index]._id);
          }
        }
        if (this.supportExecutives.length) {
          const random = Math.floor(Math.random() * this.supportExecutives.length);
          console.log(random, this.supportExecutives[random]);
          const executiveForm = {
            "ticketId": ticketId, 
            "executiveId": this.supportExecutives[random]
          };
          this._api.assignTicketToExecutive(executiveForm).subscribe();
          this._api.changeExecutiveAssignStatus(this.supportExecutives[random], {assigned: true}).subscribe();
        } else {
          this._api.changeAllAssignStatus().subscribe(
            res => {
              this.assignTicket(ticketId);
            }, err => {}
          );
        }
        
      }, err => {}
    )
  }

  addMoreAddress(formData: any) {
    for (let i in formData.controls) {
      formData.controls[i].markAsTouched();
    }
    if (formData?.valid) {
      const mainForm = formData.value;
      mainForm.userId = this.user._id;
      mainForm.latitude = '';
      mainForm.longitude = '';
      this._api.addAddress(mainForm).subscribe(
        res => {
          this._loader.startLoader('loader');
          this.Toast.fire({
            icon: 'success',
            title: 'Address added successfully!'
          })
          this.getAddressList();
          this._loader.stopLoader('loader');
        }, err => {
          this.errorMessage = 'Something went wrong!';
        }
      )
    } else {
      this.addresErrorMessage = 'Please fill out all the details';
    }
  }
  

}
interface MULTIPLEADDRESS{
  addresses: string
}
