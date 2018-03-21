import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { GetService } from '../server-service/get.service';
import { MessageService } from '../message-service/message.service';
import { GoToPage } from '../go-to-page/go-to-page.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
@Component({
  selector: 'event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  eventName;
  courtName;
  event;
  going = [];
  invited = [];
  maybe = [];
  notGoing = [];
  messagesArray = [];
  messagesObject = {};
  repliesObject = {};
  userIsInvited = false;
  statusArray;
  currentUserStatus;
  currentUser;
  username;
  initEventSub;
  memberSearchValue
  getMessages;
  pushToComment;
  pushToDescendants;
  dataLoaded = false;
  userList: string[] = [];
  usersObject = {};
  fillUsersCount = 0;
  constructor(private route:ActivatedRoute, private router:Router, private messageService: MessageService, private getService: GetService, private goToPageClass: GoToPage) { }

  ngOnInit() {
    this.username = JSON.parse(localStorage.getItem('currentUser')).username;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.statusArray = ["Going", "Maybe", "Not Going"];
    this.eventName = this.route.snapshot.url[this.route.snapshot.url.length - 1].path;
    this.courtName = this.route.snapshot.url[this.route.snapshot.url.length - 2].path;
    this.initEventSub = this.getService.getAllData('events/courts/' + this.courtName + '/events/' + this.eventName).subscribe(value => {
      console.log(value);
      this.event = value;
      this.dataLoaded = true;
      if (this.event.private === false) {
        this.event.private = null;
      }
      this.fillArray(this.going, this.event.going);
      this.fillArray(this.maybe, this.event.maybe);
      this.fillArray(this.notGoing, this.event.notGoing);
      this.fillArray(this.invited, this.event.invited);
      this.getMessages = this.getService.getAllData('messages/events/' + this.eventName).subscribe(value => {
        console.log(value);
        this.messageService.fillMessages(this.messagesObject, this.repliesObject, value, this.messagesArray);
        this.getMessages.unsubscribe();
      });
      this.checkUserIsInvited(this.username);
      this.initEventSub.unsubscribe();
      console.log(this.event.location.coords.lng);
    });
  }
  //check date of the event to see if it has passed
  checkDateEvent() {
    var today = new Date();
    today.setHours(0,0,0,0);
    var eventDate = this.event.date.split('/');
    eventDate = new Date([eventDate[2], eventDate[0], eventDate[1]].join('-'));
    if (eventDate < today) {
      var removeEvent = this.getService.removeData('events/courts/' + this.event.court + '/events/' + this.event.name).subscribe(value => {
        removeEvent.unsubscribe();
        this.relocate('account', this.currentUser.username);
      });
    }
  }
  postComment(formMessage, repliedTo) {
    var commentToPost = {ancestor: null, poster: this.currentUser.username, message: formMessage.value, date: "asdf"};
    if (repliedTo) {
      commentToPost.ancestor = repliedTo.key;
    }
    this.pushToComment = this.getService.pushData('messages/events/' + this.event.name, commentToPost).subscribe(value => {
      console.log(value);
      this.pushToComment.unsubscribe();
      if (repliedTo && repliedTo.key) {
        this.pushToDescendants = this.getService.postData('messages/events/' + this.event.name + '/' + repliedTo.key + '/descendants/' + value[value.length - 1].key, {key: value[value.length - 1].key}).subscribe(value => {
          this.pushToDescendants.unsubscribe();
          window.location.reload();
        });
      } else {
        window.location.reload();
      }
    });
  }
  updateUserStatus(attending) {
    var correctedStatus;
    attending = this.reformatStatus(attending);
    correctedStatus = this.reformatStatus(this.currentUserStatus);
    this[correctedStatus].splice(this[correctedStatus].indexOf(this.username), 1);
    this[attending].push(this.username);
    this.checkUserIsInvited(this.username);
    var rEventSub = this.getService.removeData('events/courts/' + this.courtName + '/events/' + this.eventName + '/' + correctedStatus + '/' + this.currentUser.username).subscribe(value => {
      rEventSub.unsubscribe();
      var pEventSub = this.getService.postData('events/courts/' + this.courtName + '/events/' + this.eventName + '/' + attending + '/' + this.currentUser.username, {username: this.currentUser.username, uid: this.currentUser.uid}).subscribe(value => {
        pEventSub.unsubscribe();
      });
    });
    var pUserSub = this.getService.postData('userData/' + this.currentUser.uid + '/myEvents/' + this.eventName, {court: this.courtName, event: this.eventName, date: this.event.date, status: attending}).subscribe(value => {
      pUserSub.unsubscribe();
    });
    var rUserSub = this.getService.removeData('userData/' + this.currentUser.uid + '/eventInvites/' + this.eventName).subscribe(value => {
      rUserSub.unsubscribe();
    });
  }
  reformatStatus(status) {
    var updatedStatus = status.toLowerCase().replace(" ", "");
    if (updatedStatus === "notgoing") {
      updatedStatus = "notGoing";
    }
    return updatedStatus;
  }
  checkUserIsInvited(name) {
    if (this.going.indexOf(name) > -1) {
      this.userIsInvited = true;
      this.currentUserStatus = "Going";
      return true;
    }
    if (this.invited.indexOf(name) > -1) {
      this.userIsInvited = true;
      this.currentUserStatus = "Invited";
      return true;
    }
    if (this.maybe.indexOf(name) > -1) {
      this.userIsInvited = true;
      this.currentUserStatus = "Maybe";
      return true;
    }
    if (this.notGoing.indexOf(name) > -1) {
      this.userIsInvited = true;
      this.currentUserStatus = "Not Going";
      return true;
    }
  }
  fillUsersObject() {
    this.fillUsersCount++;
    if (this.fillUsersCount === 1) {
      this.getService.getAllData('userData').subscribe(users => {
        for (var user in users) {
          if (users.hasOwnProperty(user)) {
            this.usersObject[users[user].username] = {name: users[user].username, uid: users[user].uid};
          }
        }
      });
    }
  }
  addMembers(user) {
    this.getService.postData('events/courts/' + this.event.court + '/events/' + this.event.name + '/invited/' + user, {username: user, uid: this.usersObject[user].uid}).subscribe(value => {
      this.getService.postData('userData/' + this.usersObject[user].uid + '/eventInvites/' + this.event.name, {sender: this.currentUser.username, court: this.event.court, event: this.event.name, date: this.event.date}).subscribe(value => {
        this.userList.splice(this.userList.indexOf(user) - 1, 1);
        this.invited.push(user);
      });
    });
    this.memberSearchValue = "";
  }
  searchUsers(query) {
    console.log(this.userList);
    if (query.length > 3) {
      console.log(this.event);
      for (var user in this.usersObject) {
        console.log((this.checkUserIsInvited(user)));
        if (this.usersObject.hasOwnProperty(user) && user.toLowerCase().includes(query.toLowerCase()) && (this.userList.indexOf(user) < 0) && !(this.checkUserIsInvited(user))) {
          this.userList.push(user);
          this.userList.forEach(ele => {
            if(!(ele.toLowerCase().includes(query.toLowerCase()))) {
              this.userList.splice(this.userList.indexOf(ele), 1);
            }
          });
        }
      }
    }
    else {
      this.userList = [];
    }
  }
  fillArray(array, category) {
    for (var person in category) {
      if (category.hasOwnProperty(person)) {
        array.push(person);
      }
    }
  }
  revealForm(message) {
    if (message.replyClicked === true) {
      message.replyClicked = false;
    } else {
      message.replyClicked = true;
    }
  }
  relocate(category, detail) {
    this.goToPageClass.goToPage(category, detail);
  }
}
