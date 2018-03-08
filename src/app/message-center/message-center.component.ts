import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'message-center',
  templateUrl: './message-center.component.html',
  styleUrls: ['./message-center.component.css']
})
export class MessageCenterComponent implements OnInit {
  messages = [
    {sender: 'Alfred', content: 'Hi'}, {sender: 'Shaq', content: 'Your song is inaccurate.'}
  ];
  constructor() { }

  ngOnInit() {
  }

}
