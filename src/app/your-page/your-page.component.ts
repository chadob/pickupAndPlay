import { Component, OnInit } from '@angular/core';



@Component({
  selector: 'your-page',
  templateUrl: './your-page.component.html',
  styleUrls: ['./your-page.component.css']
})
export class YourPageComponent  implements OnInit {
  data;
  currentUser
  constructor() { }
  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }
}
