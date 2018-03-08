import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { GetService } from '../server-service/get.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.css']
})
export class CreateGroupComponent implements OnInit {
  group = {
    name: '',
    invitedMembers: {},
    members: {},
    description: '',
    creator: {}
  }
  usersObject = {};
  currentUser;
  memberSearchValue;
  userList: string[] = [];
  constructor(private route:ActivatedRoute, private router:Router, private getService: GetService) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log(this.currentUser);
    this.getService.getAllData('userData').subscribe(users => {
      for (var user in users) {
        if (users.hasOwnProperty(user)) {
          this.usersObject[users[user].username] = {name: users[user].username, uid: users[user].uid};
        }
      }
    });
  }

  addMembers(user) {
    this.group.invitedMembers[user] = {username: user, uid: this.usersObject[user].uid};
    this.userList.splice(this.userList.indexOf(user) - 1, 1);
    this.memberSearchValue = "";
  }

  onSubmit () {
    this.group.creator = {
      name: this.currentUser.username,
      uid: this.currentUser.uid
    }
    this.group.members[this.currentUser.username] = {uid: this.currentUser.uid, username: this.currentUser.username};
    for (var member in this.group.invitedMembers) {
      if (this.group.invitedMembers.hasOwnProperty(member)) {
        this.getService.postData('userData/' + this.usersObject[member].uid + '/groupInvites/' + this.group.name, {sender: this.currentUser.username, group: this.group.name}).subscribe(value => {
        });
      }
    }
    this.getService.postData('userData/' + this.usersObject[member].uid + '/myGroups/' + this.group.name, {name: this.group.name}).subscribe(value => {
    });
    this.getService.postData('groups/' + this.group.name, this.group).subscribe(value => {
      this.getService.postData('userData/' + this.currentUser.uid +'/myGroups/' + this.group.name, {name: this.group.name}).subscribe(value => {
        this.router.navigate(['group', this.group.name]);
      });
    });
  }

  search(query) {
    console.log(this.userList);
    if (query.length > 3) {
      for (var user in this.usersObject) {
        console.log((this.group.invitedMembers.hasOwnProperty(user)));
        if (this.usersObject.hasOwnProperty(user) && user.toLowerCase().includes(query.toLowerCase()) && (user !== this.currentUser.username) && (this.userList.indexOf(user) < 0) && !(this.group.invitedMembers.hasOwnProperty(user))) {
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
