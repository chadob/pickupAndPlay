import { Component, OnInit } from '@angular/core';
import { GoToPage } from '../go-to-page/go-to-page.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  currentUser;
  constructor(private goToPageClass: GoToPage) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.currentUser);
  }
  relocate(category, detail) {
    this.goToPageClass.goToPage(category, detail);
  }
  relocateSingle(category) {
    this.goToPageClass.goToSingle(category);
  }
}
