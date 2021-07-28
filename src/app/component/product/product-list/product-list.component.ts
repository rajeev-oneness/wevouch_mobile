import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  constructor() { }
  public user : any = {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('userInfo') || '{}');
  }

}
