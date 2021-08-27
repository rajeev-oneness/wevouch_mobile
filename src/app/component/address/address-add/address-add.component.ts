import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService } from "src/app/service/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import  Swal  from "sweetalert2";
import { Location } from "@angular/common";

@Component({
  selector: 'app-address-add',
  templateUrl: './address-add.component.html',
  styleUrls: ['./address-add.component.css']
})
export class AddressAddComponent implements OnInit {

  public user : any = JSON.parse(localStorage.getItem('userInfo') || '{}');
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

  constructor(private _loader: NgxUiLoaderService, private _api: ApiService, private _location: Location, private _router: Router) { }

  ngOnInit(): void {

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
      this._api.addAddress(mainForm).subscribe(
        res => {
          this._loader.startLoader('loader');
          this.Toast.fire({
            icon: 'success',
            title: 'Address added successfully!'
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
