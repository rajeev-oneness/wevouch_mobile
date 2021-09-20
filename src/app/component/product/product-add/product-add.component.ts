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
  public extdWarrantyStatus : boolean = true;
  public amcStatus : boolean = true;
  public productImage : boolean = false;
  public categoriesList: any = [];
  public brandList: any = [];
  public subCategoriesList: any = [];
  public modelList: any = [];
  public category: string = '';
  public subCategory: string = '';
  public brandId: string = '';
  public brandName: string = '';
  public modelId: string = '';
  public errorMessage: string = '';
  public addProductValue: any = {};
  public userPhn : number = 0;
  public userEmail : any = '';
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
    let user = JSON.parse(localStorage.getItem('userInfo') || '{}');
    this.userPhn = parseInt(user.mobile); 
    this.userEmail = parseInt(user.email); 
    this.fetchBrands();
  }

  fetchBrands() {
    this._loader.startLoader('loader');
    this._api.getProductBrands().subscribe(
      res => {
        // console.log('brands :', res.brands);
        this.brandList = res.brands;
        this.brandId = res.brands[0].id;
        // console.log(this.brandId);
        this.fetchCategory();
      }, err => {}
    )
  }

  fetchCategory() {
    console.log(this.brandId);
    this.brandName = this.brandList.filter( (t:any) => t.id === this.brandId )[0].name;
    console.log(this.brandName);
    
    this._api.getProductCategories(this.brandId).subscribe(
      res => {
        this.categoriesList = res.categories;
        // console.log(this.categoriesList);
        this.category = this.categoriesList[0].category;
        this.fetchSubCategory();
        this._loader.stopLoader('loader');
      }, err => {}
    )
  }
  
  fetchSubCategory() {
    console.log(this.category);
    
    this._api.getProductSubCategories(this.category).subscribe(
      res => {
        this.subCategoriesList = res.sub_categories;
        // console.log(this.subCategoriesList);
        this.subCategory = this.subCategoriesList[0].sub_category
        this.fetchModel();
      }, err => {}
    )
  }

  fetchModel() {
    this._api.getProductModels(this.subCategory).subscribe(
      res => {
        this.modelList = res.models;
        this.modelId = res.models[0].model_no;
        // console.log(this.modelList);
        this._loader.stopLoader('loader');
      }
    )
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

  public uploadedFile: any ='';
  public fileFormatError = '';
  public selectedFile : any = '';
  public hasFile : boolean = false;
  public invoiceImgUrl : any = '';
  public productImgUrl : any = '';
  onSelectFile(event: any) {
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
          this.uploadedFile = event.target?.result;
          this.hasFile = true;
          this.storeFile(this.selectedFile);
        }
        return true;
      }
      this.fileFormatError = 'This File Format is not accepted';
      this._loader.stopLoader('loader');
    }
    return false;
  }
  storeFile(file:any) {
    const mainForm = new FormData();
    mainForm.append('file',file);
    console.log(file);
    this._api.storeFile(mainForm).subscribe(
      res => {
        console.log(res);
        if(this.warantyTab === true) {
          this.invoiceImgUrl = res.file_link;
        }
        if(this.finishTab === true) {
          this.productImgUrl = res.file_link;
        }
        this._loader.stopLoader('loader');
      }
    )
  }

  addProduct(formData : any) {
    this.errorMessage = "";
    window.scrollTo(0, 0);
    for (let i in formData.controls) {
      formData.controls[i].markAsTouched();
    }
    if (formData?.valid) {
      if (this.category && this.brandId && this.subCategory) {
        formData.value.brandId = this.brandName;
        console.log(formData.value);
        this.addProductValue = formData.value;
        this.productTab = false;
        this.warantyTab = true;
        this.finishTab = false;
        this.errorMessage = "";
      } else {
        this.errorMessage = 'Please fill out all the details';
      }
    } else {
      this.errorMessage = 'Please fill out all the details';
    }
    
  }
  addWaranty(formData : any) {
    this.errorMessage = "";
    window.scrollTo(0, 0);
    if (formData?.valid) {
      if (this.invoiceImgUrl) {
        this.addProductValue.purchaseDate = formData.value.purchaseDate;
        this.addProductValue.serialNo = formData.value.serialNo;
        this.addProductValue.modelNo = formData.value.modelNo;
        if (formData.value.warrantyType === 'year') {
          this.addProductValue.warrantyPeriod =
            Number(formData.value.warrantyPeriod) * 12;
        } else {
          this.addProductValue.warrantyPeriod =
            formData.value.warrantyPeriod || 0;
        }
        if(this.extdWarrantyStatus === true && this.amcStatus === true) {
          this.productTab = false;
          this.warantyTab = false;
          this.finishTab = true;
          this.uploadedFile = '';
          this.errorMessage = "";
          this.fileFormatError = "";
        } else {
          this.errorMessage = "Please fill Extended warranty and amc details"
        }
      } else {
        this.fileFormatError = 'Please add invoice image'
      }
      
    } else {
      this.errorMessage = 'Please fill out all the details';
    }
    
  }

  addWarranty(formData : any) {
    this.errorMessage = "";
    for (let i in formData.controls) {
      formData.controls[i].markAsTouched();
    }
    if (formData?.valid) {
      console.log(formData.value);
      this.addProductValue.extendedWarranty = formData.value;
      this.extdWarrantyStatus = true
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
      // this.addProductValue.amcDetails.enddate = formData.value;
      this.amcStatus = true;
      this.errorMessage = "";
    } else {
      this.errorMessage = 'Please fill out all the details';
    }
  }
  
  addFinish() {
    this.errorMessage = "";
    if (this.productImgUrl) {
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
      this._api.addProduct(this.addProductValue).subscribe(
        (res) => {
          // this._loader.stopLoader('loader');
          const mailForm = {
            "toEmail" : this.userEmail, 
            "subject" : "Wevouch - Product added", 
            "text" : "You have successfully added a product. PLease check the product list to check the details."
          }
          this._api.sendMailApi(mailForm).subscribe();
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
    } else {
      this.errorMessage = "Please add product image";
    }
  }
}
