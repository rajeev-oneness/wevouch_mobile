import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService } from "src/app/service/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import  Swal  from "sweetalert2";
import { Location } from "@angular/common";
import { Route } from '@angular/compiler/src/core';
@Component({
  selector: 'app-address-list',
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.css']
})
export class AddressListComponent implements OnInit {

  public user : any = JSON.parse(localStorage.getItem('userInfo') || '{}');
  public userAddresses : any = []
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

  constructor(private _loader: NgxUiLoaderService, private _api: ApiService, private _location: Location, private _router: Router) { }

  ngOnInit(): void {
    window.scrollTo(0,0);
    this._loader.startLoader('loader');
    this._api.getAddressListByUser(this.user._id).subscribe(
      res => {
        console.log('address :',res);        
        this.userAddresses = res;
        this._loader.stopLoader('loader');
      }, err => {}
    )
  }

  back() {
    // this._location.back();
    this._router.navigate(['/profile/details'])
  }

  delteAddress(addressId : any) {
    this._api.deleteAddressByID(addressId).subscribe(
      res => {
        this.Toast.fire({
            icon: 'success',
            title: 'Address deleted successfully!'
          })
        this._loader.stopLoader('loader');
      }, err => {}
    )
  }
}
