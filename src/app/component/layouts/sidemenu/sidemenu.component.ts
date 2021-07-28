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
  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('userInfo') || '{}');
  }

  logoutUser() {
    this._api.logoutUser();
  }

}
