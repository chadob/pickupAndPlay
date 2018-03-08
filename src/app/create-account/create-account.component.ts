import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { GoToPage } from '../go-to-page/go-to-page.service';
import {AuthService } from '../auth/auth.service'
import { GetService } from '../server-service/get.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {
  user = {
    uid: '',
    email: '',
    username: '',
    password: '',
    name: '',
    favoriteCourts: {},
    myEvents: {},
    myGroups: {},
    messages: {},
    groupInvites: {},
    eventInvites: {}
  };
  message = "";
  currentUser;
  constructor(private goToPageClass: GoToPage, private authService: AuthService, private router: Router, private getService: GetService) { }

  ngOnInit() {
  }

  createAccount(email, username, password) {
    this.authService.signUp(this.user.email, this.user.username, this.user.password)
    .then((res) => {
      this.getService.getAllData('userData/' + res.uid + '/username').subscribe(value => {
        console.log(res.uid);
        this.user.uid = res.uid;
        localStorage.setItem('currentUser', JSON.stringify({uid: res.uid, username: value, password: this.user.password}));
        this.currentUser = JSON.parse(localStorage.currentUser);
        this.getService.postData('userData/' + this.user.uid, this.user).subscribe(value => {
          console.log(value);
          this.router.navigate(['account', this.currentUser.username]);
        });
      });
    })
    .catch((err) => console.log('error: ' + err));
  }
}
