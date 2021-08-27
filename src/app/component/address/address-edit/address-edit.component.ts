import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService } from "src/app/service/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import  Swal  from "sweetalert2";
import { Location } from "@angular/common";

@Component({
  selector: 'app-address-edit',
  templateUrl: './address-edit.component.html',
  styleUrls: ['./address-edit.component.css']
})
export class AddressEditComponent implements OnInit {

  public user : any = JSON.parse(localStorage.getItem('userInfo') || '{}');
  public addressId : any = ''
  public userAddress : any = []
  public errorMessage : any = ''
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
  })

  constructor(private _loader: NgxUiLoaderService, private _api: ApiService, private _location: Location, private _router: Router, private _activated: ActivatedRoute) { 
    this.addressId = this._activated.snapshot.paramMap.get('addressId');
  }

  ngOnInit(): void {
    this._api.getAddressById(this.addressId).subscribe(
      res => {
        this._loader.startLoader('loader');
        this.userAddress = res;
        this._loader.stopLoader('loader');
      }, err => {}
    )
  }

  saveAddress(formData: any) {
    for (let i in formData.controls) {
      formData.controls[i].markAsTouched();
    }
    if (formData?.valid) {
      const mainForm = formData.value;
      mainForm.userId = this.user._id;
      mainForm.latitude = '';
      mainForm.longitude = '';
      this._api.editAddress(this.addressId, mainForm).subscribe(
        res => {
          this._loader.startLoader('loader');
          this.Toast.fire({
            icon: 'success',
            title: 'Address updated successfully!'
          })
          this._router.navigate(['/address/list']);
        }, err => {
          this.errorMessage = 'Something went wrong!';
        }
      )
    } else {
      this.errorMessage = 'Please fill out all the details';
    }
  }

}
