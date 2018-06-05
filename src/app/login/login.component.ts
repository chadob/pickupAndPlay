import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { GoToPage } from '../go-to-page/go-to-page.service';
import {AuthService } from '../auth/auth.service'
import { GetService } from '../server-service/get.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  user = {
   email: '',
   password: ''
  };
  courtsArray = [];
  message = "";
  currentUser;
  loginError = false;
  constructor(private goToPageClass: GoToPage, private authService: AuthService, private router: Router, private getService: GetService) {}
  ngOnInit() {
  }
  signInWithEmail() {
    this.authService.signInRegular(this.user.email, this.user.password)
    .then((res) => {
      console.log(res);
      this.getService.getAllData('userData/' + res.uid).subscribe(value => {
        console.log(value);
        localStorage.setItem('currentUser', JSON.stringify({uid: res.uid, username: value.username, password: this.user.password, favoriteCourts: value.favoriteCourts}));
        this.currentUser = JSON.parse(localStorage.currentUser);
        this.router.navigate(['account', this.currentUser.username]);
      });
    })
    .catch((err) => {
      this.loginError = true;
      console.log('error: ' + err);
    });
  }
  signInAsTester() {
    this.user.email = "test@gmail.com";
    this.user.password = "testing";
    this.authService.signInRegular(this.user.email, this.user.password)
    .then((res) => {
      console.log(res);
      this.getService.getAllData('userData/' + res.uid).subscribe(value => {
        console.log(value);
        localStorage.setItem('currentUser', JSON.stringify({uid: res.uid, username: value.username, password: this.user.password, favoriteCourts: value.favoriteCourts}));
        this.currentUser = JSON.parse(localStorage.currentUser);
        this.router.navigate(['account', this.currentUser.username]);
      });
    })
    .catch((err) => {
      this.loginError = true;
      console.log('error: ' + err);
    });
  }
  fillArray(array, category) {
    for (var person in category) {
      if (category.hasOwnProperty(person)) {
        array.push(category[person]);
      }
    }
  }
  relocate(category, detail) {
    this.goToPageClass.goToPage(category, detail);
  }
}
