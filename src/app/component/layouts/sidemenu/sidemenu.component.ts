import { Component, OnInit } from '@angular/core';
import { ApiService } from "src/app/service/api.service";
@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.css']
})
export class SidemenuComponent implements OnInit {

  constructor(private _api:ApiService) { }
  public user : any = {}
  public products : any = []
  
  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('userInfo') || '{}');
    console.log(this.user);
    if(this.user?._id) {
      this.getProducts();
    }
  }

  logoutUser() {
    this._api.logoutUser();
  }
  getProducts() {
    this._api.productList(this.user._id).subscribe(
      res => {
        console.log(res);
        this.products = res.length;
      }
    )
  }
}
