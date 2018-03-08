import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { GetService } from '../server-service/get.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit {
  event = {
    name: '',
    court: '',
    location: {
      address: '',
      coords: ''
    },
    date: '',
    private: '',
    group:'',
    description: '',
    invited: {},
    going: {},
    maybe: {},
    notGoing: {},
    creator: {}
  }
  courtsObject = {};
  usersObject = {};
  courtList: string[] = [];
  userList: string[] = [];
  courtName;
  currentUser;
  memberSearchValue;
  routeParamValue1;
  routeParamValue2;
  groupEvent;
  courtEvent;
  dateError;
  constructor(private route:ActivatedRoute, private router:Router, private getService: GetService) { }

  ngOnInit() {
    this.redirectFrom();
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.getService.getAllData('courts').subscribe(courts => {
      for (var court in courts) {
        if (courts.hasOwnProperty(court)) {
          this.courtsObject[courts[court].name] = {name: courts[court].name, address: courts[court].location.address, coords: courts[court].location.coords};
        }
      }
      console.log(this.courtsObject);
      if (this.courtEvent) {
        this.chooseCourt(this.event.court);
      }

    });
    this.getService.getAllData('userData').subscribe(users => {
      for (var user in users) {
        if (users.hasOwnProperty(user)) {
          this.usersObject[users[user].username] = {name: users[user].username, uid: users[user].uid};
        }
      }
    });
  }
  redirectFrom() {
    this.groupEvent = false;
    this.courtEvent = false;
    if (this.route.snapshot.url.length - 2 > -1 && this.route.snapshot.url[this.route.snapshot.url.length - 2].path) {
      this.routeParamValue1 = this.route.snapshot.url[this.route.snapshot.url.length - 2].path;
      if(this.routeParamValue1 === "createeventgroup") {
        this.groupEvent = true;
        this.routeParamValue2 = this.route.snapshot.url[this.route.snapshot.url.length - 1].path;
        this.event.group = this.routeParamValue2;
      }
      if(this.routeParamValue1 === "createeventcourt") {
        this.courtEvent = true;
        this.routeParamValue2 = this.route.snapshot.url[this.route.snapshot.url.length - 1].path;
        this.event.court = this.routeParamValue2;
      }
    }
  }
  chooseCourt(court) {
    this.event.court = this.courtsObject[court].name;
    this.event.location.address = this.courtsObject[court].address;
    this.event.location.coords = this.courtsObject[court].coords;
    this.courtList = [];
  }
  addMembers(user) {
    this.event.invited[user] = {username: user, uid: this.usersObject[user].uid};
    this.userList.splice(this.userList.indexOf(user) - 1, 1);
    this.memberSearchValue = "";
  }
  checkDateEvent() {
    var today = new Date();
    today.setHours(0,0,0,0);
    console.log(this.event.date);
    var eventDate = new Date(this.event.date);
    if (eventDate < today) {
      this.dateError = "That date is in the past.";
      this.event.date = null;
    }
    else {
      this.dateError = "";
    }
  }
  convertDate(date) {
    var parts = date.split('-');
    var myDate = new Date(parts[0], parts[1] - 1, parts[2]);
    return (myDate.getMonth() + 1) + "/" + myDate.getDate() + "/" + myDate.getFullYear();
  }
  onSubmit () {
    this.event.creator = {
      name: this.currentUser.username,
      uid: this.currentUser.uid
    }
    this.event.going[this.currentUser.username] = {uid: this.currentUser.uid, username: this.currentUser.uid};
    this.event.date = this.convertDate(this.event.date);
    this.getService.postData('events/courts/' + this.event.court + '/events/' + this.event.name, this.event).subscribe(value => {
      for (var member in this.event.invited) {
        if (this.event.invited.hasOwnProperty(member)) {
          this.getService.postData('userData/' + this.usersObject[member].uid + '/eventInvites/' + this.event.name, {sender: this.currentUser.username, court: this.event.court, event: this.event.name, date: this.event.date}).subscribe(value => {
          });
        }
      }
      if (this.event.group) {
        this.getService.postData('groups/' + this.event.group + '/events/' + this.event.name, {sender: this.currentUser.username, court: this.event.court, event: this.event.name, date: this.event.date}).subscribe(value => {
        });
      }
      this.getService.postData('userData/' + this.currentUser.uid + '/myEvents/' + this.event.name, {court: this.event.court, event: this.event.name, date: this.event.date, status: "going"}).subscribe(value => {
      });
      this.getService.postData('courts/' + this.event.court + '/events/' + this.event.name, {date: this.event.date, name: this.event.name}).subscribe(value => {
        this.router.navigate(['event', this.event.court, this.event.name]);
      });
    });
  }
  search(query) {
    if (query.length > 3) {
      for (var court in this.courtsObject) {
        if (this.courtsObject.hasOwnProperty(court) && court.toLowerCase().includes(query.toLowerCase()) && (this.courtList.indexOf(court) < 0)) {
          this.courtList.push(court);
          this.courtList.forEach(ele => {
            if(!(ele.toLowerCase().includes(query.toLowerCase()))) {
              this.courtList.splice(this.courtList.indexOf(ele), 1);
            }
          });
        }
      }
    }
    else {
      this.courtList = [];
    }
  }
  searchUsers(query) {
    if (query.length > 3) {
      for (var user in this.usersObject) {
        if (this.usersObject.hasOwnProperty(user) && user.toLowerCase().includes(query.toLowerCase()) && (user !== this.currentUser.username) && (this.userList.indexOf(user) < 0) && !(this.event.invited.hasOwnProperty(user))) {
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
}
