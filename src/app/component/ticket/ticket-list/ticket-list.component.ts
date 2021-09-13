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
    loop: true,
    margin: 15,
    nav: false,
    dots: false,
    autoplay:true,
		autoplayTimeout: 5000,
		autoplayHoverPause: true,
    responsiveClass: true,
    responsive: {
      0:{
				items:1.2,
			},
			600:{
				items:1.2,
			},
			760:{
				items:1.2,
			}
    },
  }

  constructor(private _loader:NgxUiLoaderService, private _api:ApiService) { }
  public user : any = {}
  public tickets : any = ''
  public categories : any = {}
  public defaultCategoryId : any = ''

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this._loader.startLoader('loader');
    const userData = JSON.parse(localStorage.getItem('userInfo') || '{}');
    this.getUser(userData._id);
    // this._api.categoryList().subscribe(
    //   res => {
    //     this.categories = res.filter((t : any) => t.status === 'active');
    //     console.log('categories', res);
    //     this.defaultCategoryId = res[0]._id;
    //     this.fetchTicketByCategory(this.defaultCategoryId);
    //   }, err => {}
    // )
  }
  
  getUser(userId : any) {
    this._api.userDetails(userId).subscribe(
      res => {
        this.user = res;
        this.getTickets();
      }
    )
  }

  getTickets() {
    this._api.ticketList(this.user._id).subscribe(
      res => {
        this.tickets = res
        this._loader.stopLoader('loader');
      }, err => {}
    )
  }

  // tabClick(event: any) {
  //   this._loader.startLoader('loader');
  //   let categoryId = this.categories[event.index]._id;
  //   this.fetchTicketByCategory(categoryId)
  // }

  // fetchTicketByCategory(categoryId:any) {
  //   this.tickets = [];
  //   let formData = {
  //     "categoryId": categoryId, 
  //     "userId": this.user._id
  //   }
  //   this._api.ticketListByUserAndCategory(formData).subscribe(
  //     res => {
  //       this.tickets = res;
  //       // console.log(res);
  //       this._loader.stopLoader('loader');
  //     }, err => {}
  //   )

  // }
  
}
