import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { GetService } from '../server-service/get.service';
import { MessageService } from '../message-service/message.service';
import { GoToPage } from '../go-to-page/go-to-page.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
@Component({
  selector: 'group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {
  groupName;
  courtName;
  group;
  eventsArray = [];
  addMemberError;
  membersArray = [];
  invitedArray = [];
  messagesArray = [];
  messagesObject = {};
  repliesObject = {};
  userList: string[] = [];
  usersObject = {};
  currentUser;
  userIsMember;
  currentUserStatus;
  initGroupSub;
  getMessages;
  pushToComment;
  pushToDescendants;
  constructor(private route:ActivatedRoute, private router:Router, private messageService: MessageService, private goToPageClass: GoToPage, private getService: GetService) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.fillUsersObject();
    this.groupName = this.route.snapshot.url[this.route.snapshot.url.length - 1].path;
    this.courtName = this.route.snapshot.url[this.route.snapshot.url.length - 2].path;
    this.initGroupSub = this.getService.getAllData('groups/' + this.groupName).subscribe(value => {
      this.group = value;
      this.fillArray(this.membersArray, this.group.members);
      this.fillArray(this.invitedArray, this.group.invitedMembers)
      console.log(this.group);
      this.checkDateEvents();
      console.log(this.eventsArray)
      this.checkUserIsMember(this.currentUser.username);
      this.initGroupSub.unsubscribe();
    });
    this.getMessages = this.getService.getAllData('messages/groups/' + this.groupName).subscribe(value => {
      console.log(value);
      this.messageService.fillMessages(this.messagesObject, this.repliesObject, value, this.messagesArray);
      this.getMessages.unsubscribe();
    });
  }
  checkDateEvents() {
    //check date of each event to see if they have passed
    var today = new Date();
    today.setHours(0,0,0,0);
    for (var event in this.group.events) {
      if (this.group.events.hasOwnProperty(event)) {
        var eventDate = this.group.events[event].date.split('/');
        eventDate = new Date([eventDate[2], eventDate[0], eventDate[1]].join('-'));
        if (eventDate < today) {
          var removeEvent = this.getService.removeData('groups/' + this.group.name + '/events/' + event).subscribe(value => {
            removeEvent.unsubscribe();
          });
        } else {
          this.eventsArray.push({creator: this.group.events[event].sender, court: this.group.events[event].court, date: this.group.events[event].date, name: event});
        }
      }
    }
  }
  checkUserIsMember(name) {
    if (this.group.members.hasOwnProperty(name)) {
      this.userIsMember = true;
      this.currentUserStatus = "member";
      return true;
    }
    if (this.group.invitedMembers.hasOwnProperty(name)) {
      this.userIsMember = false;
      this.currentUserStatus = "invited";
      return true;
    }
  }
  fillUsersObject() {
    this.getService.getAllData('userData').subscribe(users => {
      for (var user in users) {
        if (users.hasOwnProperty(user)) {
          this.usersObject[users[user].username] = {name: users[user].username, uid: users[user].uid};
        }
      }
    });
  }
  addMember (user) {
    if (this.group.members[this.currentUser.username]) {
      this.group.invitedMembers[user] = {username: user, uid: this.usersObject[user].uid};
      this.userList.splice(this.userList.indexOf(user) - 1, 1);
      this.getService.postData('userData/' + this.usersObject[user].uid + '/groupInvites/' + this.group.name, {sender: this.currentUser.username, group: this.group.name}).subscribe(value => {
        this.getService.postData('groups/' + this.group.name + '/invitedMembers/' + user, {username: user, uid: this.usersObject[user].uid}).subscribe(value => {
          this.addMemberError = "Invite Sent."
        });
      this.invitedArray.push(user);
      });
    } else {
      this.addMemberError = "You are not currently a member of this group."
    }
  }

  search(query) {
    console.log(this.userList);
    if (query.length > 3) {
      for (var user in this.usersObject) {
        console.log((this.userList.indexOf(user) < 0));
        if (this.usersObject.hasOwnProperty(user) && user.toLowerCase().includes(query.toLowerCase()) && (this.userList.indexOf(user) < 0) && !(this.group.invitedMembers.hasOwnProperty(user)) && !(this.group.members.hasOwnProperty(user))) {
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
    console.log(this.userList);
  }
  postReply(formMessage, repliedTo) {
    var commentToPost = {ancestor: null, poster: this.currentUser.username, message: formMessage.value, date: "asdf"};
    if (repliedTo) {
      commentToPost.ancestor = repliedTo.key;
    }
    this.pushToComment = this.getService.pushData('messages/groups/' + this.group.name, commentToPost).subscribe(value => {
      console.log(value);
      this.pushToComment.unsubscribe();
      if (repliedTo && repliedTo.key) {
        this.pushToDescendants = this.getService.postData('messages/groups/' + this.group.name + '/' + repliedTo.key + '/descendants/' + value[value.length - 1].key, {key: value[value.length - 1].key}).subscribe(value => {
          this.pushToDescendants.unsubscribe();
          window.location.reload();
        });
      } else {
        window.location.reload();
      }
    });
  }
  postComment(formMessage) {
    var commentToPost = {ancestor: null, poster: this.currentUser.username, message: formMessage.value, date: "asdf"};
    this.pushToComment = this.getService.pushData('messages/groups/' + this.group.name, commentToPost).subscribe(value => {
      console.log(value);
      this.pushToComment.unsubscribe();
      window.location.reload();
    });
  }
  fillArray(array, category) {
    for (var person in category) {
      if (category.hasOwnProperty(person)) {
        array.push(category[person]);
      }
    }
  }

  revealForm(message) {
    console.log('clickers');
    message.replyClicked = true;
  }
  relocateEvent(category, court, detail) {
    this.goToPageClass.goToEvent(category, court, detail);
  }
  relocate(category, detail) {
    this.goToPageClass.goToPage(category,detail);
  }
}
