import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ApiService } from "src/app/service/api.service";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import  Swal  from "sweetalert2";

@Component({
  selector: 'app-ticket-details',
  templateUrl: './ticket-details.component.html',
  styleUrls: ['./ticket-details.component.css']
})
export class TicketDetailsComponent implements OnInit {

  public ticketId: any = ''; 
  public ticketDetail: any = [];

  constructor(private _loader:NgxUiLoaderService, private _api:ApiService, private _activated:ActivatedRoute, private _router:Router) { }

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

  deleteTicket(ticketId :any) {
    
    Swal.fire({
      title: 'Are you sure?',
      text: 'This ticket will not recover!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete!',
      cancelButtonText: 'keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this._loader.startLoader('loader');
        this._api.ticketDelete(ticketId).subscribe(
          res => {
            console.log(res);
            this._loader.stopLoader('loader');
            this._router.navigate(['/ticket/list']);
          }, err => {}
        )
        Swal.fire(
          'Deleted!',
          'Ticket has been deleted.',
          'success'
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Ticket is safe :)',
          'error'
        )
      }
    })
  }

}
