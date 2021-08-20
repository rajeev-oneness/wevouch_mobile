import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  // public currentSelection : any = '';

  constructor(private _router:Router) {
    // _router.events.forEach((event) => {
    //   if (event instanceof NavigationStart) {
    //     if (event['url'] == '/ticket/list') {
    //       this.currentSelection = 'ticket'; // for ticket
    //     } else if(event['url'] == '/product/list') {
    //       this.currentSelection = 'product'; // for product
    //     }
    //   }
    // });
  }

  ngOnInit(): void {
  }

}
