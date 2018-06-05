import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthService {
  private user: Observable<firebase.User>;
  private userDetails: firebase.User = null;
  constructor(private _firebaseAuth: AngularFireAuth, private router: Router) {
    this.user = _firebaseAuth.authState;
    console.log(this.user);
    this.user.subscribe(
      (user) => {
        if (user) {
          this.userDetails = user;
          console.log(this.userDetails);
        } else {
          this.userDetails = null;
          console.log(this.userDetails);
        }
      }
    );
  }
  signInRegular(email, password) {
    console.log(email);
    console.log(password);
   const credential = firebase.auth.EmailAuthProvider.credential( email, password );
   console.log(this._firebaseAuth.auth.signInWithEmailAndPassword(email, password));
   return this._firebaseAuth.auth.signInWithEmailAndPassword(email, password)
  }
  isLoggedIn() {
    console.log(this.userDetails);
    if (this.userDetails == null ) {
        return false;
      } else {
        return true;
      }
    }
  logout() {
      this._firebaseAuth.auth.signOut()
      .then((res) => this.router.navigate(['/']));
  }
  signUp(email, username, password) {
   const credential = firebase.auth.EmailAuthProvider.credential( email, password );
   // console.log(this._firebaseAuth.auth.createUserWithEmailAndPassword(email, password));
   return this._firebaseAuth.auth.createUserWithEmailAndPassword(email, password)
  }
}

// logout() {
//   this._firebaseAuth.auth.signOut()
//   .then((res) => this.router.navigate(['/']));
// }
