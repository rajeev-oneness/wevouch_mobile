import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

var originalURL = environment.apiUrl;
var _apiUrl = originalURL;

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private header;

  constructor(private _http : HttpClient,private _router : Router) { 
    this.header = new HttpHeaders()
        // .set("Authorization", 'Bearer ')
        .set("Accept","application/json");
  }
  // How to send the data + Header Example is below
  // return this.http.post<any>(_apiUrl + 'update/user/profile',data,{headers: this.header});

  routeIntended(path : any = ''){
    localStorage.setItem('routeIntended',path);
  }

  // Storing the User Info Locally
  storeUserLocally(data : any){
    let routeIntended = localStorage.getItem('routeIntended');
    localStorage.clear();
    // localStorage.setItem('accessToken', 'accessToken1234567890adminWeVouch');
    localStorage.setItem('userInfo',JSON.stringify(data));
    window.location.href = environment.dasboardPath;
    // this._router.navigate([(routeIntended) ? routeIntended : '/admin/dashboard']);
  }

  updateUserLocally(data : any){
    localStorage.removeItem('userInfo');
    localStorage.setItem('userInfo',JSON.stringify(data.data));
  }

  // Logging Out the Current User
  logoutUser():void{
    localStorage.clear();
    window.location.href = environment.projectPath;
  }

  // Checking the Authentication for User
  isAuthenticated(){
    return !!localStorage.getItem('userInfo');
  }

  getUserDetailsFromStorage(){
    let user = localStorage.getItem('userInfo');
    return JSON.parse(user || '{}');
  }

  //auth
  userLoginApi(formData : any) {
    return this._http.post<any>(_apiUrl+'user/login',formData);
  }
}
