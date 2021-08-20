import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService } from "src/app/service/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import  Swal  from "sweetalert2";
import { getDateFormat } from "src/app/service/globalFunction";

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {

  constructor(private _loader:NgxUiLoaderService, private _api:ApiService, private _router:Router, public _activated:ActivatedRoute) { }

  public getDateFormat = getDateFormat;

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
  public productId: any = '';
  public productDetail: any = [];
  public purchaseDateTime: any = '';
  public amcStartDate: any = '';
  public extendedWarrantyStartDate: any = '';
  public extendedWarrantyEndDate: any = '';
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
  public uploadedFile1: any ='';
  public uploadedFile2: any ='';

  ngOnInit(): void {
    this.productId = this._activated.snapshot.paramMap.get('productId');
    this._api.productDetail(this.productId).subscribe(
      res => {
        console.log(res);
        this.productDetail = res;
        this.category = res.category._id;
        this.fetchSubCategory();
        this.purchaseDateTime = getDateFormat(res.purchaseDate);
        this.amcStartDate = getDateFormat(res.amcDetails.startDate);
        this.extendedWarrantyStartDate = getDateFormat(res.extendedWarranty.startDate);
        this.extendedWarrantyEndDate = getDateFormat(res.extendedWarranty.endDate);
        this.invoiceImgUrl = res.invoicePhotoUrl;
        this.uploadedFile1 = res.invoicePhotoUrl;
        this.productImgUrl = res.productImagesUrl[0];
        this.uploadedFile2 = res.productImagesUrl[0];
      }, err => {}
    )
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

  
  public fileFormatError = '';
  public selectedFile : any = '';
  public hasFile : boolean = false;
  public invoiceImgUrl : any = '';
  public productImgUrl : any = '';
  onSelectFile1(event: any) {
    this.fileFormatError = '';this.hasFile = false;
    this.selectedFile = event.target.files[0];
    if(this.selectedFile != undefined && this.selectedFile != null){
      let validFormat = ['png','jpeg','jpg'];
      let fileName = this.selectedFile.name.split('.').pop();
      let data = validFormat.find(ob => ob === fileName);
      if(data != null || data != undefined){
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]); // read file as data url
        reader.onload = (event) => { // called once readAsDataURL is completed
          this.uploadedFile1 = event.target?.result;
          this.hasFile = true;
          const mainForm = new FormData();
          mainForm.append('file',this.selectedFile);
          console.log(this.selectedFile);
          this._api.storeFile(mainForm).subscribe(
            res => {
              console.log(res);
              this.invoiceImgUrl = res.file_link;
            }
          )
        }
        return true;
      }
      this.fileFormatError = 'This File Format is not accepted';
    }
    return false;
  }
  
  onSelectFile2(event: any) {
    console.log('hello');
    
    this.fileFormatError = '';this.hasFile = false;
    this.selectedFile = event.target.files[0];
    if(this.selectedFile != undefined && this.selectedFile != null){
      let validFormat = ['png','jpeg','jpg'];
      let fileName = this.selectedFile.name.split('.').pop();
      let data = validFormat.find(ob => ob === fileName);
      if(data != null || data != undefined){
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]); // read file as data url
        reader.onload = (event) => { // called once readAsDataURL is completed
          this.uploadedFile2 = event.target?.result;
          this.hasFile = true;
          const mainForm = new FormData();
          mainForm.append('file',this.selectedFile);
          console.log(this.selectedFile);
          this._api.storeFile(mainForm).subscribe(
            res => {
              console.log(res);
              this.productImgUrl = res.file_link;
            }
          )
        }
        return true;
      }
      this.fileFormatError = 'This File Format is not accepted';
    }
    return false;
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
        console.log(formData.value);
        this.addProductValue = formData.value;
        this.productTab = false;
        this.warantyTab = true;
        this.finishTab = false;
        this.errorMessage = "";
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

  addWarrantyPopuup(formData : any) {
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
      this.productImgUrl
    ];
    this.addProductValue.userId = JSON.parse(
      localStorage.getItem('userInfo') || '{}'
    )._id;
    this.addProductValue.invoicePhotoUrl = this.invoiceImgUrl;
    console.log(this.addProductValue);
    this._loader.stopLoader('loader');
    this._api.updateProduct(this.productId, this.addProductValue).subscribe(
      (res) => {
        this._loader.stopLoader('loader');
        this.Toast.fire({
          icon: 'success',
          title: 'Product edited successfully!'
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
