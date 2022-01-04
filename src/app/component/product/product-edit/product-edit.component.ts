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

  constructor(private _loader:NgxUiLoaderService, private _api:ApiService, private _router:Router, public _activated:ActivatedRoute) { 
    this._loader.startLoader('loader');
  }

  public getDateFormat = getDateFormat;

  public productTab : boolean = true;
  public warantyTab : boolean = false;
  public finishTab : boolean = false;
  public categoriesList: any = [];
  public brandList: any = [];
  public subCategoriesList: any = new Array();
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
  public extdWarrantyBlock : boolean = false;
  public amcBlock : boolean = false;
  public brandName: any = '';

  public categoryName: string = '';
  public subCategoryName: string = '';
  public modelName: string = '';

  public modelList: any = new Array();
  public modelId: any = '';
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
  public userDetail: any = JSON.parse(localStorage.getItem('userInfo') || '{}');
  public secondTimeCall: boolean = false;
  public warrantyTime : any = '';
  public warrantyMode : any = 'year';
  public warrantyShowHide : boolean = false;

  ngOnInit(): void {
    this.productId = this._activated.snapshot.paramMap.get('productId');
    this._api.productDetail(this.productId).subscribe(
      res => {
        this._loader.startLoader('loader');
        console.log(res);
        this.productDetail = res;
        this.category = res.category;
        this.subCategory = res.subCategory;
        this.modelId = res.modelNo;
        // this.fetchSubCategory();
        this.invoiceImgUrl = res.invoicePhotoUrl;
        this.uploadedFile1 = res.invoicePhotoUrl[0];
        this.extdImgUrl = res.extendedWarranty?.extendedWarrantyImages;
        this.amcImgUrl = res.amcDetails?.amcImages;
        
        this.productImgUrl = res.productImagesUrl;
        this.uploadedFile2 = res.productImagesUrl[0];
        if(res.warrantyPeriod === 0) {
          this.warrantyShowHide = true;
        }
        this.fetchBrands();

        if(res.warrantyPeriod%12 === 0){
          this.warrantyTime = res.warrantyPeriod/12
        } 
        else {
          this.warrantyTime = res.warrantyPeriod;
          this.warrantyMode = 'month';
        }
        if(res.purchaseDate) {
          this.purchaseDateTime = getDateFormat(res.purchaseDate);
        }
        if (res.amcDetails || res.extendedWarranty) {
          this.amcStartDate = getDateFormat(res.amcDetails.startDate);
          this.extendedWarrantyStartDate = getDateFormat(res.extendedWarranty.startDate);
          this.extendedWarrantyEndDate = getDateFormat(res.extendedWarranty.endDate);
        }
        // this._loader.stopLoader('loader');
      }, err => {}
    )
    // this.fetchBrands()
    
  }

  fetchBrands() {
    this._api.getProductBrands().subscribe(
      res => {
        // console.log('brands :', res.brands);
        this.brandList = res.brands;
        this.brandList.push({id: 'Others', name: 'Others'});
        let findBrand = this.brandList.find((e : any) => e.name === this.productDetail.brands);
        if (findBrand === undefined) {
          this.brandId = "Others";
          this.brandName = this.productDetail.brands;
        } else {
          this.brandId = res.brands.filter((t : any) => t.name === this.productDetail.brands)[0].id;
        }
        console.log(this.brandId);
        this.fetchCategory();
      }, err => {}
    )
  }
  
  fetchCategory(callTime : any = '') {
    this.categoriesList = [];
    if (callTime != '') {
      this.category = '';
    }
    console.log(this.brandId);
    console.log(this.brandName);
    if (this.brandId != 'Others') {
      this.brandName = this.brandList.filter( (t:any) => t.id === this.brandId )[0].name;
      this._api.getProductCategories(this.brandId).subscribe(
        res => {
          let isCatogoryList = false;
          this.categoriesList = res.categories;
          console.log('abc', this.categoriesList);
          
          if (this.categoriesList === undefined) {
            this.categoriesList = [];
            this.category = 'Others'
            this.categoryName = this.productDetail.category
          } else {
            this.categoriesList.forEach((e : any) => {
              if (e.category === this.productDetail.category) {
                isCatogoryList = true;
              } 
            });
            if (isCatogoryList === false) {
              // this.categoriesList = [];
              this.category = 'Others';
              this.categoryName = this.productDetail.category
            }
          }
          this.categoriesList.push({category: 'Others'});
          if (callTime != '') {
            console.log('brand 2nd');
            this.secondTimeCall = true;
            this.category = this.categoriesList[0].category;
            console.log('new category', this.category);
            this.categoryName = this.productDetail.category
          }
          console.log(this.categoriesList);
          this._loader.stopLoader('loader');
          this.fetchSubCategory();
        }, err => {}
      )
    } else {
      this.categoriesList.push({category: 'Others'});
      this.category = 'Others';
      this.categoryName = this.productDetail.category
      this.fetchSubCategory();
    }
  }
  
  fetchSubCategory(callTime : any = '') {
    this.subCategoriesList = [];
    if (callTime != '') {
      this.subCategory = '';
    }
    console.log(this.category);
    
    if (this.category != 'Others') {
      this._api.getProductSubCategories(this.category, this.brandId).subscribe(
        res => {
          let isSubCategoryListed = false;
          this.subCategoriesList = res.sub_categories;
          if (this.subCategoriesList === undefined) {
            this.subCategoriesList = [];
            this.subCategory = 'Others';
            this.subCategoryName = this.productDetail.subCategory
          } else {
            this.subCategoriesList.forEach((e : any) => {
              if (e.sub_category === this.productDetail.subCategory) {
                isSubCategoryListed = true;
              } 
            });
            if (isSubCategoryListed === false) {
              this.subCategory = 'Others';
              this.subCategoryName = this.productDetail.subCategory
            }
          }
          this.subCategoriesList.push({sub_category: 'Others'});
          if (callTime != '' || this.secondTimeCall) {
            console.log('category 2nd');
            this.secondTimeCall = true;
            this.subCategory = this.subCategoriesList[0].sub_category
          }
          // console.log(this.subCategoriesList);
          this.fetchModel();
          
        }, err => {}
      )
    } else {
      this.subCategoriesList[0] = {sub_category: 'Others'};
      this.subCategory = 'Others';
      this.subCategoryName = this.productDetail.subCategory
      this.fetchModel();
    }
  }

  fetchModel(callTime : any = '') {
    this.modelList = [];
    if (callTime != '') {
      this.modelId = '';
    }
    if (this.subCategory != 'Others') {
      this._api.getProductModels(this.subCategory, this.category, this.brandId).subscribe(
        res => {
          let isModelListed = false;

          this.modelList = res.models;
          if (this.modelList === undefined) {
            this.modelList = [];
            this.modelId = 'Others';
            this.modelName = this.productDetail.modelNo
          } else {
            this.modelList.forEach((e : any) => {
              if (e.model_no === this.productDetail.modelNo) {
                isModelListed = true;
              } 
            });
            if (isModelListed === false) {
              // this.modelList = [];
              this.modelId = 'Others';
              this.modelName = this.productDetail.modelNo
            }
          }
          this.modelList.push({model_no: 'Others'});
          if (callTime != '' || this.secondTimeCall) {
            this.modelId = res.models[0].model_no;
          }
          console.log("models:",this.modelList);
        }
      )
    } else {
      this.modelList.push({model_no: 'Others'});
      this.modelId = 'Others';
      this.modelName = this.productDetail.modelNo
    }
  }

  
  public fileFormatError = '';
  public selectedFile : any = '';
  public hasFile : boolean = false;
  public invoiceImgUrl : any = new Array();
  public extdImgUrl : any = new Array();
  public amcImgUrl : any = new Array();
  public productImgUrl : any = new Array();
  onSelectFile1(event: any) {
    this._loader.startLoader('loader');
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
              this.invoiceImgUrl.push(res.file_link);
              this._loader.stopLoader('loader');
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
    this._loader.startLoader('loader');
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
              this.productImgUrl.push(res.file_link);
              this._loader.stopLoader('loader');
            }
          )
        }
        return true;
      }
      this.fileFormatError = 'This File Format is not accepted';
    }
    return false;
  }

  onSelectFile3(event: any) {
    this._loader.startLoader('loader');
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
              this.extdImgUrl.push(res.file_link);
              this._loader.stopLoader('loader');
            }
          )
        }
        return true;
      }
      this.fileFormatError = 'This File Format is not accepted';
    }
    return false;
  }

  onSelectFile4(event: any) {
    this._loader.startLoader('loader');
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
              this.amcImgUrl.push(res.file_link);
              this._loader.stopLoader('loader');
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
        formData.value.brandId = this.brandName;
        if (this.categoryName && this.category == 'Others') {
          formData.value.category = this.categoryName;
        }
        if (this.subCategoryName && this.subCategory == 'Others') {
          formData.value.subCategory = this.subCategoryName;
        }
        console.log(formData.value);
        this.addProductValue = formData.value;
        this.addProductValue.registeredMobileNo = parseInt(formData.value.registeredMobileNo);
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
      this.addProductValue.purchaseDate = formData.value?.purchaseDate || '';
      this.addProductValue.serialNo = formData.value.serialNo;
      this.addProductValue.modelNo = (this.modelId != 'others')? this.modelName : formData.value.modelNo;;

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

  addWarrantyPopuup(formData : any) {
    this.extdWarrantyBlock = false;
    for (let i in formData.controls) {
      formData.controls[i].markAsTouched();
    }
    if (formData?.valid) {
      console.log(formData.value);
      this.addProductValue.extendedWarranty = formData.value;
      this.addProductValue.extendedWarranty.extendedWarrantyImages = this.extdImgUrl;
      this.errorMessage = "";
    } else {
      this.errorMessage = 'Please fill out all the details';
    }
  }
  
  addAmc(formData : any) {
    this.amcBlock = false;
    for (let i in formData.controls) {
      formData.controls[i].markAsTouched();
    }
    if (formData?.valid) {
      console.log(formData.value);
      this.addProductValue.amcDetails = formData.value;
      this.addProductValue.amcDetails.amcImages = this.amcImgUrl;
      this.errorMessage = "";
    } else {
      this.errorMessage = 'Please fill out all the details';
    }
  }
  
  addFinish() {
    this._loader.startLoader('loader');
    this.addProductValue.productImagesUrl = this.productImgUrl;
    this.addProductValue.userId = JSON.parse(
      localStorage.getItem('userInfo') || '{}'
    )._id;
    this.addProductValue.invoicePhotoUrl = this.invoiceImgUrl;
    console.log(this.addProductValue);
    this._api.updateProduct(this.productId, this.addProductValue).subscribe(
      (res) => {
        
        this._loader.stopLoader('loader');
        this.Toast.fire({
          icon: 'success',
          title: 'Product edited successfully!'
        });
        const userDetail = JSON.parse(localStorage.getItem('userInfo') || '{}');
        const notificationForm = {
          "title": "Product update", 
          "userId": userDetail._id, 
          "description": "Dear "+userDetail.name+", you have successfully updated your product details for "+this.addProductValue.name+"."
        };
        this._api.addNotification(notificationForm).subscribe();
        this._router.navigate(['/product/list']);
      },
      (err) => {
        this.errorMessage = err.error.message;
        this._loader.stopLoader('loader');
      }
    );
  }

  removeImage(imageIndex : any) {
    this.productImgUrl.splice(imageIndex, 1);
    console.log(this.productImgUrl);
  }
  removeInvoiceImage(imageIndex : any) {
    this.invoiceImgUrl.splice(imageIndex, 1);
    console.log(this.invoiceImgUrl);
  }

  extdWarrantyShowHide() {
    this.extdWarrantyBlock = !this.extdWarrantyBlock
    console.log('extdBlock:',this.extdWarrantyBlock);
    
  }
  amcShowHide() {
    this.amcBlock = !this.amcBlock
    console.log('amcBlock:',this.amcBlock);

  }

  removeExtdImage(index : any) {
    this.extdImgUrl.splice(index, 1);
    console.log(this.extdImgUrl);
  }
  removeAmcImage(index : any) {
    this.amcImgUrl.splice(index, 1);
    console.log(this.amcImgUrl);
  }
}
