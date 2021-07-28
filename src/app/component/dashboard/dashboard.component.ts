import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor() { }
  public user : any = {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('userInfo') || '{}');
    console.log(this.user);
  }

}
