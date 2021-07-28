import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from "ngx-ui-loader";
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private _loader:NgxUiLoaderService) { }
  public user : any = {}

  ngOnInit(): void {
    this._loader.startLoader('loader');
    this.user = JSON.parse(localStorage.getItem('userInfo') || '{}');
    console.log(this.user);
    this._loader.stopLoader('loader');
  }

}
