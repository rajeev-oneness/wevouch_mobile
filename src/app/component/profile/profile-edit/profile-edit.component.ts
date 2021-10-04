import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import  Swal  from "sweetalert2";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {

  constructor(private _loader: NgxUiLoaderService, private _api:ApiService, private _router:Router) { }
  public userDetail : any = {};
  public errorMessage : any = '';
  public passwordErrorMessage : any = '';
  public user_id : any = '';
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
  public uploadedFile:any = '';
  public profilePicUrl:any = '';
  public confirmPassword:any = '';

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this._loader.startLoader('loader');
    
    let user = JSON.parse(localStorage.getItem('userInfo') || '{}');
    this.user_id = user._id;
    this.uploadedFile = user.image;
    this.profilePicUrl = user.image;
    this.getUser(user._id);
  }

  getUser(userId : any) {
    this._api.userDetails(userId).subscribe(
      res => {
        this.userDetail = res;
        this._api.updateUserLocally(res);
        this._loader.stopLoader('loader');
      }, err => {}
    )
  }

  public fileFormatError = '';
  public selectedFile : any = '';
  public hasFile : boolean = false;
  onSelectFile(event:any) {
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
            const mainForm = new FormData();
            mainForm.append('file',this.selectedFile);
            console.log(this.selectedFile);
            this._api.storeFile(mainForm).subscribe(
              res => {
                console.log(res);
                this.profilePicUrl = res.file_link;
              }
            )
          }
          return true;
        }
        this.fileFormatError = 'This File Format is not accepted';
    }
    return false;
  }

  updateUser(formData : any) {
    this.errorMessage = '';
    for( let i in formData.controls ){
      formData.controls[i].markAsTouched();
    }
    if( formData?.valid ){
      console.log(formData.value);
      const mainForm = formData.value;
      mainForm.image = this.profilePicUrl;
      this._loader.startLoader('loader');
      this._api.updateUserDetails(this.user_id, mainForm).subscribe(
        res => {
          this.errorMessage = res.message;
          this.getUser(this.user_id);
          this.Toast.fire({
            icon: 'success',
            title: 'Profile updated successfully!'
          })
          // this._router.navigate(['/profile/details']);
          // window.location.href = environment.basePath+'profile/details';
          window.location.hash = environment.basePath+'profile/details';
          // location.reload();

          this._loader.stopLoader('loader');
        },
        err => {
          this.errorMessage = "something went wrong please check credentials and try after sometimes";
          this._loader.stopLoader('loader');
        }
        
      )
    }else{
      this.errorMessage = 'Please fill out all the details';
    }
  }

  changePassword(formData : any) {
    this.passwordErrorMessage = '';
    for( let i in formData.controls ){
      formData.controls[i].markAsTouched();
    }
    if (formData?.valid) {
      if (this.confirmPassword === formData.value.newPassword) {
        if (formData.value.password === formData.value.newPassword) {
          this.passwordErrorMessage = 'Old and new passwords cannot be same.';
        } else {
          this.passwordErrorMessage = '';
          this._loader.startLoader('loader');
          const toSendData = formData.value;
          toSendData.email = this.userDetail.email;
          this._api.changePassword(toSendData).subscribe(
            res => {
              this._loader.stopLoader('loader');
              const notificationForm = {
                "title": "Password Changed", 
                "userId": this.userDetail._id, 
                "description": "Dear "+this.userDetail.name+", your WeVouch account password has been changed successfully."
              }
              this._api.addNotification(notificationForm).subscribe(
                res=> {console.log(res);}
              );
              this.Toast.fire({
                icon: 'success',
                title: 'Password changed successfully!'
              })
              // window.location.href = environment.basePath+'profile/details';
              window.location.hash = environment.basePath+'profile/details';
              // location.reload();
            },
            err => {
              this.passwordErrorMessage = err.error.message;
              this._loader.stopLoader('loader');
            }
          );
        }
      }else {
        this.passwordErrorMessage = 'Password confirmation not matched';
      }
    } else {
      this.passwordErrorMessage = 'New and Current Password are required';
    }
  }
  

}
