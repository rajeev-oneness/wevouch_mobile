import { Component, OnInit } from '@angular/core';
import { ApiService } from "src/app/service/api.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public userInfo : any  = '';
  public showNotification : boolean = false;

  constructor(private _api:ApiService) { }

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    // setInterval(()=>{
    //   this.getNotifications();
    // },5000);
    
  }

  // getNotifications() {
  //   if(this.userInfo?._id) {
  //       this._api.notificationList(this.userInfo._id).subscribe(
  //         res => {
  //           let oldLength : any = (localStorage.getItem('notificationCount')??0);
  //           let currentLength : any = res.length;
  //           if(parseInt(oldLength) != parseInt(currentLength)){
  //             this.showNotification = true;
  //             localStorage.setItem('notificationCount',currentLength);
  //           }
  //           console.log(this.showNotification);
  //           console.log(oldLength+'=>'+currentLength);
  //         }, err => {}
  //       )
  //   }
  // }

  // removeNotificationDot() {
  //   this.showNotification = false;
  //   console.log(this.showNotification);

  // }
}
