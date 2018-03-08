import {Component, forwardRef, Input, OnInit} from '@angular/core';
import { GetService } from '../server-service/get.service';

@Component({
  selector: 'tree-node-event',
  template: `
  <div *ngFor="let message of message.replies">
    {{message.poster}}: {{message.message}}
    <span (click)="revealForm(message)"> Reply </span>
    <form *ngIf="message.replyClicked" name="messageForm" method="post" #formCtrl="ngForm">
      <textarea placeholder="Post a reply?" #comment name ="postComment" required></textarea>
      <button (click)="postComment(comment, message, event.name)"> Submit </button>
    </form>
    <tree-node-event
      [event] = event
      [currentUser]= currentUser
      [message]= message
      [messagesArray]= messagesArray>
    </tree-node-event>
  </div>
`
})
export class TreeNodeEventComponent implements OnInit{
  pushToComment;
  pushToDescendants;
  constructor(private getService: GetService) {}
  ngOnInit() {
    // console.log(this.group);
    // console.log(this.currentUser);
    // console.log(this.message);
    // console.log(this.messagesArray);
  }
  revealForm(message) {
    message.replyClicked = true;
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
  @Input() message;
  @Input() event;
  @Input() currentUser;
  @Input() messagesArray;
}
