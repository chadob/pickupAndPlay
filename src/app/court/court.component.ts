import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { GetService } from '../server-service/get.service';
import { MessageService } from '../message-service/message.service';
import { GoToPage } from '../go-to-page/go-to-page.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'court',
  templateUrl: './court.component.html',
  styleUrls: ['./court.component.css']
})
export class CourtComponent implements OnInit {
  courtName;
  court;
  eventsArray = [];
  messagesArray = [];
  messagesObject = {};
  repliesObject = {};
  getMessages;
  pushToComment;
  pushToDescendants;
  currentUser;
  //map variables
  latitude;
  longitude;
  courtIsFavorited = false;
  constructor(private goToPageClass: GoToPage, private route:ActivatedRoute, private router:Router, private messageService: MessageService, private getService: GetService) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.courtName = this.route.snapshot.url[this.route.snapshot.url.length - 1].path;
    console.log(this.courtName);
    this.getService.getAllData('courts/' + this.courtName).subscribe(value => {
      console.log(value);
      this.court = value;
      this.checkDateEvents();
      console.log(this.eventsArray);
      this.getLocation(value.location.coords.lat, value.location.coords.lng);
      if (this.currentUser.favoriteCourts.hasOwnProperty(this.court.name)) {
        this.courtIsFavorited = true;
      }
    });
    this.getMessages = this.getService.getAllData('messages/courts/' + this.courtName).subscribe(value => {
      console.log(value);
      this.messageService.fillMessages(this.messagesObject, this.repliesObject, value, this.messagesArray);
      this.getMessages.unsubscribe();
    });
  }
  toggleFavoriteStatus(status) {
    if (this.courtIsFavorited) {
      var removeFromFavoriteCourts = this.getService.removeData('userData/' + this.currentUser.uid + '/favoriteCourts/' + this.court.name).subscribe(value => {
        removeFromFavoriteCourts.unsubscribe();
        this.courtIsFavorited = false;
      });
    } else {
      var pushToFavoriteCourts = this.getService.postData('userData/' + this.currentUser.uid + '/favoriteCourts/' + this.court.name, {name: this.court.name}).subscribe(value => {
        pushToFavoriteCourts.unsubscribe();
        this.courtIsFavorited = true;
      });
    }
  }
  getLocation(latitude, longitude) {
    this.latitude = latitude;
    this.longitude = longitude;
    console.log(this.latitude, this.longitude);
  }
  checkDateEvents() {
    //check date of each event to see if they have passed
    var today = new Date();
    today.setHours(0,0,0,0);
    for (var event in this.court.events) {
      if (this.court.events.hasOwnProperty(event)) {
        var eventDate = this.court.events[event].date.split('/');
        eventDate = new Date([eventDate[2], eventDate[0], eventDate[1]].join('-'));
        if (eventDate < today) {
          var removeCourtEvent = this.getService.removeData('courts/' + this.court.name + '/events/' + event).subscribe(value => {
            removeCourtEvent.unsubscribe();
          });
          var removeEvent = this.getService.removeData('events/courts/' + this.court.name + '/events/' + event).subscribe(value => {
            removeEvent.unsubscribe();
          });
        } else {
          this.eventsArray.push({court: this.court.events[event].court, name: event});
        }
      }
    }
  }
  postComment(formMessage, repliedTo) {
    var commentToPost = {ancestor: null, poster: this.currentUser.username, message: formMessage.value, date: "asdf"};
    if (repliedTo) {
      commentToPost.ancestor = repliedTo.key;
    }
    this.pushToComment = this.getService.pushData('messages/courts/' + this.court.name, commentToPost).subscribe(value => {
      console.log(value);
      this.pushToComment.unsubscribe();
      if (repliedTo && repliedTo.key) {
        this.pushToDescendants = this.getService.postData('messages/courts/' + this.court.name + '/' + repliedTo.key + '/descendants/' + value[value.length - 1].key, {key: value[value.length - 1].key}).subscribe(value => {
          this.pushToDescendants.unsubscribe();
          window.location.reload();
        });
      } else {
        window.location.reload();
      }
    });
  }
  fillArray(array, category) {
    for (var person in category) {
      if (category.hasOwnProperty(person)) {
        array.push(category[person]);
      }
    }
  }
  fillMessages(array, obj) {
    for (var message in obj) {
      if (obj.hasOwnProperty(message)) {
        array.push({sender: obj[message].sender, content: obj[message].content, date: obj[message].date, replies: []});
      }
      if (obj[message].replies) {
        this.fillMessages(array[array.length -1].replies, obj[message].replies)
      }
    }
  }
  revealForm(message) {
    console.log('clickers');
    message.replyClicked = true;
  }
  relocate(category, detail) {
    this.goToPageClass.goToPage(category, detail);
  }
}
