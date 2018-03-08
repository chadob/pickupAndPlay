import { Component, OnInit } from '@angular/core';
import { GoToPage } from '../go-to-page/go-to-page.service';
import { GetService } from '../server-service/get.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
@Component({
  selector: 'your-page-courts',
  templateUrl: './your-page-courts.component.html',
  styleUrls: ['./your-page-courts.component.css']
})
export class YourPageCourtsComponent implements OnInit {
  currentUser;
  favoriteCourtsArray;

  constructor(private goToPageClass: GoToPage, private getService: GetService) {
  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.favoriteCourtsArray = [];
    this.getService.getAllData('userData/' + this.currentUser.uid + '/favoriteCourts').subscribe(value => {
      for (var court in value) {
        if (value.hasOwnProperty(court)) {
          this.favoriteCourtsArray.push({name: court, events: []});
          this.getService.getAllData('courts/' + court + '/events').subscribe(events => {
            for (var event in events) {
              if (events.hasOwnProperty(event)) {
                this.favoriteCourtsArray[this.favoriteCourtsArray.length - 1].events.push(event);
              }
            }
          });
        }
      }
    });

  }
  relocate(category, detail) {
    this.goToPageClass.goToPage(category, detail);
  }
  relocateEvent(category, court, event) {
    this.goToPageClass.goToEvent(category, court, event);
  }

}
