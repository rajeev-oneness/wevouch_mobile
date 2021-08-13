import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService } from "src/app/service/api.service";
import { ActivatedRoute } from "@angular/router";
@Component({
  selector: 'app-ticket-details',
  templateUrl: './ticket-details.component.html',
  styleUrls: ['./ticket-details.component.css']
})
export class TicketDetailsComponent implements OnInit {

  public ticketId: any = ''; 
  public ticketDetail: any = []; 

  constructor(private _loader:NgxUiLoaderService, private _api:ApiService, private _activated:ActivatedRoute) { }

  ngOnInit(): void {
    this._loader.startLoader('loader');
    this.ticketId = this._activated.snapshot.paramMap.get('ticketId');
    this.getTicketDetail(this.ticketId);
  }

  getTicketDetail(ticketId : any) {
    console.log(ticketId);
    this._api.ticketDetail(ticketId).subscribe(
      res => {
        console.log(res);
        this.ticketDetail = res
        this._loader.stopLoader('loader');
      }, err => {}
    )
  }

}
