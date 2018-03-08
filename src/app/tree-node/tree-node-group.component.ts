import {Component, forwardRef, Input, OnInit} from '@angular/core';
import { GetService } from '../server-service/get.service';

@Component({
  selector: 'tree-node-group',
  template: `
  <div *ngFor="let message of message.replies">
    {{message.poster}}: {{message.message}}
    <span (click)="revealForm(message)"> Reply </span>
    <form *ngIf="message.replyClicked" name="messageForm" method="post" #formCtrl="ngForm">
      <textarea placeholder="Post a reply?" #comment name ="postComment" required></textarea>
      <button (click)="postComment(comment, message, group.name)"> Submit </button>
    </form>
    <tree-node-group
      [group] = group
      [currentUser]= currentUser
      [message]= message
      [messagesArray]= messagesArray>
    </tree-node-group>
  </div>
`
})
export class TreeNodeGroupComponent implements OnInit{
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
  @Input() message;
  @Input() group;
  @Input() currentUser;
  @Input() messagesArray;
}
