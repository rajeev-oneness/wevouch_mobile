import { Component } from '@angular/core';
import { NavigationStart, Router } from "@angular/router";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'WeVouchMobile';
  public showTab: boolean = true;
  public showHeader: boolean = true;

  constructor(private _router:Router) {
    _router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        if (event['url'] == '/login' || event['url'] == '/register' || event['url'] == '/') {
          this.showTab = false;
        } else {
          this.showTab = true;
        }
        if((event['url'] == '/product/add') || (event['url'] == '/product/edit*')) {
          this.showHeader = false;
        } else {
          this.showHeader = true;
        }
      }
    });
  }
}
