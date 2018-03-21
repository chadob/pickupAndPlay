import { Component, OnInit } from '@angular/core';

import { GoToPage } from '../go-to-page/go-to-page.service';
import { GetService } from '../server-service/get.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Router, ActivatedRoute } from '@angular/router'
import { Observable } from 'rxjs/Observable';
@Component({
  selector: 'your-page-events',
  templateUrl: './your-page-events.component.html',
  styleUrls: ['./your-page-events.component.css']
})
export class YourPageEventsComponent implements OnInit {
  currentUser;
  events;
  eventsArray;
  invitesArray;
  data;
  statusArray;

  constructor(private goToPageClass: GoToPage, private getService: GetService, private router: Router) {
  }

  ngOnInit() {
    this.statusArray = ["Going", "Maybe", "Not Going"];
    this.populateData();
  }

  populateData() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.invitesArray = [];
    this.getService.getAllData('userData/' + this.currentUser.uid + '/eventInvites').subscribe(invites => {
      for (var invite in invites) {
        if (invites.hasOwnProperty(invite)) {
          this.invitesArray.push({name: invites[invite].event, court: invites[invite].court, sender: invites[invite].sender, date: invites[invite].date});
        }
      }
    });
    this.getService.getAllData('userData/' + this.currentUser.uid + '/myEvents').subscribe(value => {
      this.events = value;
      console.log (this.events);
      this.eventsArray = [];
      this.checkDateEvents();
    });
  }
  checkDateEvents() {
    //check date of each event to see if they have passed
    var today = new Date();
    today.setHours(0,0,0,0);
    for (var event in this.events) {
      if (this.events.hasOwnProperty(event)) {
        var eventDate = this.events[event].date.split('/');
        eventDate = new Date([eventDate[2], eventDate[0], eventDate[1]].join('-'));
        if (eventDate < today) {
          var removeMyEvent = this.getService.removeData('userData/' + this.currentUser.uid + '/myEvents/' + event).subscribe(value => {
            removeMyEvent.unsubscribe();
          });
          // var removeEvent = this.getService.removeData('events/courts/' + this.events[event].court + '/events/' + event).subscribe(value => {
          //   removeEvent.unsubscribe();
          // });
        } else {
          this.eventsArray.push({date: this.events[event].date, creator: this.events[event].sender, court: this.events[event].court, name: event});
        }
      }
    }
    this.sortEvents(this.eventsArray);
  }
  sortEvents(eventArray) {
    eventArray.sort(function(a,b) {
      a = new Date([a.date.split('/')[2], a.date.split('/')[0], a.date.split('/')[1]].join('-'));
      b = new Date([b.date.split('/')[2], b.date.split('/')[0], b.date.split('/')[1]].join('-'));
      if (a < b) {
        return -1;
      }
      if (a > b) {
        return 1;
      }
      return 0;
    });
  }
  relocateEvent(category, court, event) {
    this.goToPageClass.goToEvent(category, court, event);
  }
  respondToEvent(court, event, status, date) {
    status = status.toLowerCase().replace(" ", "");
    if (status === "notgoing") {
      status = "notGoing";
    }
    this.invitesArray = this.invitesArray.filter(idx => {return idx.name != event});
    this.getService.postData('events/courts/' + court + '/events/' + event + '/' + status + '/' + this.currentUser.username, {username: this.currentUser.username, uid: this.currentUser.uid}).subscribe();
    this.getService.postData('userData/' + this.currentUser.uid + '/myEvents/' + event, {court: court, event: event, date: date, status: status}).subscribe();
    this.getService.removeData('userData/' + this.currentUser.uid + '/eventInvites/' + event).subscribe(value => {
      if (status === "going" || "maybe") {
        this.router.navigate(['event', court, event]);
      }
    });
  }
}
