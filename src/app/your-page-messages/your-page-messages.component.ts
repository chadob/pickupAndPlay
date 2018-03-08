import { Component, OnInit } from '@angular/core';
import { GoToPage } from '../go-to-page/go-to-page.service';
import { GetService } from '../server-service/get.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
@Component({
  selector: 'your-page-messages',
  templateUrl: './your-page-messages.component.html',
  styleUrls: ['./your-page-messages.component.css']
})
export class YourPageMessagesComponent implements OnInit {
  currentUser;
  messages;
  messagesArray;

  constructor(private goToPageClass: GoToPage, private getService: GetService) {
  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.getService.getAllData('userData/' + this.currentUser.uid + '/messages').subscribe(messages => {
      this.messagesArray = [];
      console.log(messages);
      for (var author in messages) {
        console.log(author);
        if (messages.hasOwnProperty(author)) {
          this.messagesArray.push({sender: author, content: messages[author].content});
        }
      }
    });
  }

  relocate(category, detail) {
    this.goToPageClass.goToPage(category, detail);
  }
}
