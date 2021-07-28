import { Component } from '@angular/core';
import { NavigationStart, Router } from "@angular/router";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'WeVouchMobile';
  public showTab: boolean = false;

  constructor(private _router:Router) {
    _router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        if (event['url'] == '/login' || event['url'] == '/register' || event['url'] == '/') {
          this.showTab = false;
        } else {
          this.showTab = true;
        }
      }
    });
  }
}
