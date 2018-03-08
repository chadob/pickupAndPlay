import { Component, OnInit } from '@angular/core';
import { GoToPage } from '../go-to-page/go-to-page.service';
import { GetService } from '../server-service/get.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router'
@Component({
  selector: 'your-page-groups',
  templateUrl: './your-page-groups.component.html',
  styleUrls: ['./your-page-groups.component.css']
})
export class YourPageGroupsComponent implements OnInit {
  currentUser;
  groupsArray;
  invitesArray;
  constructor(private goToPageClass: GoToPage, private getService: GetService, private router: Router) {
  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.groupsArray = [];
    this.invitesArray = [];
    this.getService.getAllData('userData/' + this.currentUser.uid + '/groupInvites').subscribe(invites => {
      for (var invite in invites) {
        if (invites.hasOwnProperty(invite)) {
          this.invitesArray.push({name: invites[invite].group, sender: invites[invite].sender});
        }
      }
    });
    this.getService.getAllData('userData/' + this.currentUser.uid + '/myGroups').subscribe(groups => {
      for (var group in groups) {
        if (groups.hasOwnProperty(group)) {
          this.groupsArray.push({name: group});
        }
      }
    });
  }

  relocate(category, detail) {
    this.goToPageClass.goToPage(category, detail);
  }
  joinGroup(group) {
    this.getService.postData('groups/' + group + '/members/' + this.currentUser.username, {username: this.currentUser.username, uid: this.currentUser.uid}).subscribe();
    this.getService.removeData('groups/' + group + '/invitedMembers/' + this.currentUser.username).subscribe();
    this.getService.removeData('userData/' + this.currentUser.uid + '/groupInvites/' + group).subscribe(value => {
      console.log(value);
      this.router.navigate(['group', group]);
    });
  }
}
