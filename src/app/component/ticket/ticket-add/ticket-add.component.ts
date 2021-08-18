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

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.productId = this._active.snapshot.paramMap.get('productId');
    this._loader.startLoader('loader');
    this.user = JSON.parse(localStorage.getItem('userInfo') || '{}');
    this._api.productList(this.user._id).subscribe(
      res => {
        this.products = res.filter( (e:any) => e.status === 'active');
        console.log('Product List', this.products);
      }, err => {}
    )
    this._loader.stopLoader('loader');
  }

  getProductDetail() {
    this._api.productDetail(this.productId).subscribe(
      res => {
        this.productDetail = res;
        console.log('Product Detail',res);
      }, err => {}
    )
  }

  addTicket(formData : any) {

    this._loader.startLoader('loader');
    let d = new Date();
    let selTime = d.toLocaleTimeString();
    let selDate = d.toLocaleDateString();
    for (let i in formData.controls) {
      formData.controls[i].markAsTouched();
    }
    if (formData?.valid) {
      let mainForm = formData.value;
      mainForm.userId = this.user._id;
      mainForm.category = this.productDetail.category._id;
      mainForm.brandId = this.productDetail.brands._id;
      mainForm.selectedTime = selTime;
      mainForm.selectedDate = selDate;
      this._api.ticketAdd(mainForm).subscribe(
        (res) => {
          this.Toast.fire({
            icon: 'success',
            title: 'Ticket raised successfully!'
          })
          this._loader.stopLoader('loader');
          this._router.navigate(['/ticket/list']);
        },
        (err) => {
          this.errorMessage = err;
          this._loader.stopLoader('loader');
        }
      );
    }
  }

}
