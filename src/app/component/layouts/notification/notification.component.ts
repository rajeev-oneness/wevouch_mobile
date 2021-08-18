import { Component, OnInit } from '@angular/core';
import { ApiService } from "src/app/service/api.service";
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  public userInfo : any  = '';
  public notificationList : any = [];

  constructor(private _api:ApiService) { }

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    this.getNotifications();
  }

  getNotifications() {
    if(this.userInfo?._id) {
      this._api.notificationList(this.userInfo._id).subscribe(
        res => {
          this.notificationList = res;
        }, err => {}
      )
    }
  }

}
