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
  favoriteCourtsObject = {};
  getFavoriteCourts;
  getCourtsEvents;
  constructor(private goToPageClass: GoToPage, private getService: GetService) {
  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.favoriteCourtsArray = [];
    this.getFavoriteCourts = this.getService.getAllData('userData/' + this.currentUser.uid + '/favoriteCourts').subscribe(value => {
      this.getFavoriteCourts.unsubscribe();
      for (var court in value) {
        if (value.hasOwnProperty(court)) {
          this.favoriteCourtsObject[court] = {name: court, events: []};
          this.getService.getAllData('courts/' + court + '/events').subscribe(events => {
            var currentCourt;
            for (var event in events) {
              if (events.hasOwnProperty(event)) {
                currentCourt = events[event].court;
                this.favoriteCourtsObject[currentCourt].events.push(event);
              }
            }
            this.favoriteCourtsArray.push(this.favoriteCourtsObject[currentCourt]);
          });
        }
      }
    });

  }
  fillArray(array, category) {
    for (var person in category) {
      if (category.hasOwnProperty(person)) {
        array.push(category[person]);
        delete category[person];
      }
    }
  }
  relocate(category, detail) {
    this.goToPageClass.goToPage(category, detail);
  }
  relocateEvent(category, court, event) {
    this.goToPageClass.goToEvent(category, court, event);
  }

}
