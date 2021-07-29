import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  title = 'angularowlslider';
    elecTronics: any = {
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
				items:2,
			},
			600:{
				items:2,
			},
			760:{
				items:3,
			}
    },
  }

  planUpgrade: any = {
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
				items:1,
			}
    },
  }
  
  constructor() { }

  ngOnInit(): void {
  }

}
