import { Component } from '@angular/core';
import { NavigationStart, Router } from "@angular/router";
import { ApiService } from "src/app/service/api.service";
import { dateDiffInDays } from "src/app/service/globalFunction";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'WeVouchMobile';
  public showTab: boolean = true;
  public showHeader: boolean = true;

  constructor(private _router:Router, private _api:ApiService) {
    _router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        let url = event['url'];
        let urlArr = url.split("/");
        // console.log(urlArr);
        
        this.showHeader = true;
        this.showTab = true;

        if((urlArr.includes("ticket") && urlArr.includes("add")) || (urlArr.includes("product") && urlArr.includes("edit")) || (urlArr.includes("ticket") && urlArr.includes("details"))) {
          this.showHeader = false;
        }
        if (event['url'] == '/login' || event['url'] == '/register' || event['url'] == '/') {
          this.showTab = false;
        }
        if((event['url'] == '/product/add') || (event['url'] == '/product/edit*')) {
          this.showHeader = false;
        }
      }
    });

    
  }
  

}
