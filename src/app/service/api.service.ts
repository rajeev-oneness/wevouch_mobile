import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

var originalURL = environment.apiUrl;
var fileUploadURL = environment.file_upload_url;
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
    localStorage.setItem('userInfo',JSON.stringify(data));
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

  //store file api
  storeFile(file:any) {
    return this._http.post<any>(fileUploadURL, file, {headers: this.header})
  }

  //auth
  userLoginApi(formData : any) {
    return this._http.post<any>(_apiUrl+'user/login',formData);
  }
  loginWithOtp(formData : any) {
    return this._http.post<any>(_apiUrl+'user/phone-otp',formData);
  }
  userSignupApi(formData : any){
    return this._http.post<any>(_apiUrl+'user/add',formData);
  }
  userDetails(userId : any) {
    return this._http.get<any>(_apiUrl+'user/get/'+userId);
  }
  updateUserDetails(userId : any, formData : any) {
    return this._http.patch<any>(_apiUrl+'user/update/'+userId, formData);
  }

  //product
  productList(userId : any) {
    return this._http.get<any>(_apiUrl+'product/get-by-user/'+userId);
  }
  productListByCategory(categoryId : any) {
    return this._http.get<any>(_apiUrl+'product/get-by-category/'+categoryId);
  }
  allProductList() {
    return this._http.get<any>(_apiUrl+'product/list');
  }
  productDetail(productId : any) {
    return this._http.get<any>(_apiUrl+'product/get/'+productId);
  }
  addProduct(formData : any) {
    return this._http.post<any>(_apiUrl+'product/add', formData);
  }
  updateProduct(productId : any, formData : any) {
    return this._http.patch<any>(_apiUrl+'product/update/'+productId, formData);
  }
  deleteProduct(productId : any) {
    return this._http.delete<any>(_apiUrl+'product/delete/'+productId);
  }
  categoryList() {
    return this._http.get<any>(_apiUrl+'category/list');
  }
  subCategoryListByCategoryId(id : any) {
    return this._http.get<any>(_apiUrl+'sub-category/get-by-category/'+id);
  }
  brandList() {
    return this._http.get<any>(_apiUrl+'brand/list');
  }

  //ticket
  ticketList(userId : any) {
    return this._http.get<any>(_apiUrl+'ticket/get-by-user/'+userId);
  }
  ticketListByProduct(productId : any) {
    return this._http.get<any>(_apiUrl+'ticket/get-by-product/'+productId);
  }
  ticketListByUserAndCategory(formData : any) {
    return this._http.post<any>(_apiUrl+'ticket/get-by-category-user', formData);
  }
  ticketDetail(ticketId : any) {
    return this._http.get<any>(_apiUrl+'ticket/get/'+ticketId);
  }
  ticketAdd(formData : any) {
    return this._http.post<any>(_apiUrl+'ticket/add', formData);
  }
  ticketDelete(ticketId : any) {
    return this._http.delete<any>(_apiUrl+'ticket/delete/'+ticketId);
  }
  
  //package
  packageList() {
    return this._http.get<any>(_apiUrl+'sub/list');
  }
  packageDetail(subscriptionId :any) {
    return this._http.get<any>( _apiUrl + 'sub/get/' + subscriptionId );
  }
  addTransaction(formData:any) {
    return this._http.post<any>( _apiUrl + 'transaction/add' , formData );
  }

  //notification list
  notificationList(userId : any) {
    return this._http.get<any>(_apiUrl+'notification/get-by-user/'+userId);
    // return this._http.get<any>(_apiUrl+'notification/list');
  }

  //address management section
  getAddressList() {
    return this._http.get<any>(_apiUrl+'address/list');
  }
  getAddressListByUser(userId : any) {
    return this._http.get<any>(_apiUrl+'address/get-by-user/'+userId);
  }
  getAddressById(addressId : any) {
    return this._http.get<any>(_apiUrl+'address/get/'+addressId);
  }
  addAddress(formData : any) {
    return this._http.post<any>(_apiUrl+'address/add', formData);
  }
  editAddress(addressId : any, formData : any) {
    return this._http.patch<any>(_apiUrl+'address/update/'+addressId, formData);
  }
  deleteAddressByID(addressId : any) {
    return this._http.delete<any>(_apiUrl+'address/delete/'+addressId);
  }

}
