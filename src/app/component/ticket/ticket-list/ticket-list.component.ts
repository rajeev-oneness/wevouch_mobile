import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService } from "src/app/service/api.service";

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css']
})
export class TicketListComponent implements OnInit {

  title = 'angularowlslider';
  ticketList: any = {
    loop: false,
    margin: 10,
    nav: false,
    dots: false,
    autoplay:true,
		autoplayTimeout: 5000,
		autoplayHoverPause: true,
    responsiveClass: true,
    responsive: {
      0:{
				items:1,
			},
			600:{
				items:1,
			},
			760:{
				items:2,
			}
    },
  }

  constructor(private _loader:NgxUiLoaderService, private _api:ApiService) { }
  public user : any = {}
  public tickets : any = ''

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this._loader.startLoader('loader');
    this.user = JSON.parse(localStorage.getItem('userInfo') || '{}');
    this._api.ticketList(this.user._id).subscribe(
      res => {
        this.tickets = res;
        console.log(res);
      }, err => {}
    )
    this._loader.stopLoader('loader');
  }

}
