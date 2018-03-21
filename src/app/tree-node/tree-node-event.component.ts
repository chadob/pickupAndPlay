import {Component, forwardRef, Input, OnInit} from '@angular/core';
import { GetService } from '../server-service/get.service';

@Component({
  selector: 'tree-node-event',
  template: `
  <div class="ml-2" *ngFor="let message of message.replies">
    -
    <span class="font-weight-bold">{{message.poster}}: </span>
    <span> {{message.message}} </span>
    <a class="text-primary" (click)="revealForm(message)"> Reply </a>
    <div class="ml-2 input-group" *ngIf="message.replyClicked" name="messageForm">
      <input placeholder="Post a reply?" class="d-inline-block mx-auto form-control" style="width: 400px"  #comment name ="postComment" required/>
      <div class="input-group-append">
        <button class="btn btn-primary" (click)="postComment(comment, message)"> Submit </button>
      </div>
    </div>
    <tree-node-event
      [event] = event
      [currentUser]= currentUser
      [message]= message
      [messagesArray]= messagesArray>
    </tree-node-event>
  </div>
`,
styles: ['a:hover { cursor:pointer; }']
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
    if (message.replyClicked === true) {
      message.replyClicked = false;
    } else {
      message.replyClicked = true;
    }
  }
  postComm
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
