import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService } from "src/app/service/api.service";
import { Router } from "@angular/router";
import  Swal  from "sweetalert2";

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.css']
})
export class ProductAddComponent implements OnInit {

  constructor(private _loader:NgxUiLoaderService, private _api:ApiService, private _router:Router) { }
  public productTab : boolean = true;
  public warantyTab : boolean = false;
  public finishTab : boolean = false;
  public categoriesList: any = [];
  public brandList: any = [];
  public subCategoriesList: any = [];
  public category: string = '';
  public subCategory: string = '';
  public brandId: string = '';
  public errorMessage: string = '';
  public addProductValue: any = {};
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
    this._api.categoryList().subscribe((res) => {
      this.categoriesList = res.filter((t : any) => t.status === 'active');
      this._loader.stopLoader('loader');
    });
    this._api.brandList().subscribe((res) => {
      this.brandList = res.filter((t : any) => t.status === 'active');
    });
  }
  
  fetchSubCategory() {
    this._api.subCategoryListByCategoryId(this.category).subscribe((res) => {
      this.subCategoriesList = res.filter((t : any) => t.status === 'active');
    });
  }

  previous() {
    if(this.productTab == true) {
      this._router.navigate(['/product/list']);
    }
    if(this.warantyTab == true) {
      window.scrollTo(0, 0);
      this.productTab = true;
      this.warantyTab = false;
      this.finishTab = false;
    }
    if(this.finishTab == true) {
      window.scrollTo(0, 0);
      this.productTab = false;
      this.warantyTab = true;
      this.finishTab = false;
    }
  }

  addProduct(formData : any) {
    window.scrollTo(0, 0);
    for (let i in formData.controls) {
      formData.controls[i].markAsTouched();
    }
    if (formData?.valid) {
      // if (this.category && this.brandId && this.subCategory) {
        console.log(formData.value);
        this.addProductValue = formData.value;
        this.productTab = false;
        this.warantyTab = true;
        this.finishTab = false;
        this.errorMessage = "";
      // } else {
      //   this.errorMessage = 'Please fill out all the details';
      // }
    } else {
      this.errorMessage = 'Please fill out all the details';
    }
    
  }
  addWaranty(formData : any) {
    window.scrollTo(0, 0);
    if (formData.value && formData.value.purchaseDate && formData.value.serialNo && formData.value.registeredMobileNo && formData.value.warrantyPeriod && formData.value.warrantyType) {
      this.addProductValue.purchaseDate = formData.value.purchaseDate;
      this.addProductValue.serialNo = formData.value.serialNo;
      this.addProductValue.registeredMobileNo =
        formData.value.registeredMobileNo;
      if (formData.value.warrantyType === 'year') {
        this.addProductValue.warrantyPeriod =
          Number(formData.value.warrantyPeriod) * 12;
      } else {
        this.addProductValue.warrantyPeriod =
          formData.value.warrantyPeriod || 0;
      }
      this.productTab = false;
      this.warantyTab = false;
      this.finishTab = true;
      this.errorMessage = "";
    }
    else
    {
      this.errorMessage = "All fields are required.";
    }
    
  }

  addWarranty(formData : any) {
    for (let i in formData.controls) {
      formData.controls[i].markAsTouched();
    }
    if (formData?.valid) {
      console.log(formData.value);
      this.addProductValue.extendedWarranty = formData.value;
      this.errorMessage = "";
    } else {
      this.errorMessage = 'Please fill out all the details';
    }
  }
  
  addAmc(formData : any) {
    for (let i in formData.controls) {
      formData.controls[i].markAsTouched();
    }
    if (formData?.valid) {
      console.log(formData.value);
      this.addProductValue.amcDetails = formData.value;
      this.errorMessage = "";
    } else {
      this.errorMessage = 'Please fill out all the details';
    }
  }
  
  addFinish() {
    this._loader.startLoader('loader');
    this.addProductValue.productImagesUrl = [
      'https://justify.websites.co.in/obaju-green/img/product-placeholder.png'
    ];
    this.addProductValue.userId = JSON.parse(
      localStorage.getItem('userInfo') || '{}'
    )._id;
    this.addProductValue.invoicePhotoUrl = './assets/images/invoice.png';
    console.log(this.addProductValue);
    this._loader.stopLoader('loader');
    this._api.addProduct(this.addProductValue).subscribe(
      (res) => {
        // this._loader.stopLoader('loader');
        this.Toast.fire({
          icon: 'success',
          title: 'Product added successfully!'
        })
        this._router.navigate(['/product/list']);
      },
      (err) => {
        this.errorMessage = err.error.message;
        this._loader.stopLoader('loader');
      }
    );
  }
}
