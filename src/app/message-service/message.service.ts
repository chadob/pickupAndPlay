import { Injectable } from '@angular/core';

@Injectable()
export class MessageService {
  constructor(){}
  fillMessages(newObject, sepObject, obj, messageArray) {
      for (var message in obj) {
        if (obj.hasOwnProperty(message)) {
          if (obj[message].ancestor){
            sepObject[message] = obj[message];
          }
          else {
            newObject[message] = {poster: obj[message].poster, date: obj[message].date, message: obj[message].message, key: message, replies: []};
            if (obj[message].descendants) {
              newObject[message].descendants = obj[message].descendants;
            }
          }
        }
      }
      this.fillMessagesFromObject(newObject, sepObject);
      for (var message in newObject) {
        messageArray.push(newObject[message]);
      }
      console.log(messageArray);
  }
  fillMessagesFromObject(object, tempObject) {
    for (var prop in tempObject) {
      if (tempObject[prop]) {
        this.looped(prop, tempObject, object);
      }
    }
  }
  looped(messageName, tempObject, object) {
    if (tempObject[messageName].descendants) {
      for (var desc in tempObject[messageName].descendants) {
        this.looped(desc, tempObject, object);
      }
      if (object[tempObject[messageName].ancestor]) {
        object[tempObject[messageName].ancestor].replies.push({poster: tempObject[messageName].poster, date: tempObject[messageName].date, message: tempObject[messageName].message, key: messageName, replies: tempObject[messageName].replies});
        delete tempObject[messageName];
      }
      //check if temp object has this current message's ancestor
      else if (tempObject[tempObject[messageName].ancestor] ) {
        tempObject[tempObject[messageName].ancestor].replies = tempObject[tempObject[messageName].ancestor].replies || [];
        tempObject[tempObject[messageName].ancestor].replies.push({poster: tempObject[messageName].poster, date: tempObject[messageName].date, message: tempObject[messageName].message, key: messageName, replies: tempObject[messageName].replies});
        delete tempObject[messageName];
      }
    } else {
      // addressString = addressString.replace(/\[/g, '.').replace(/\]/g, '');
      //check if the main object has this current message's ancestor
      if (object[tempObject[messageName].ancestor]) {
        object[tempObject[messageName].ancestor].replies.push({poster: tempObject[messageName].poster, date: tempObject[messageName].date, message: tempObject[messageName].message, key: messageName, replies: []});
        delete tempObject[messageName];
      }
      //check if temp object has this current message's ancestor
      else if (tempObject[tempObject[messageName].ancestor] ) {
        tempObject[tempObject[messageName].ancestor].replies = tempObject[tempObject[messageName].ancestor].replies || [];
        tempObject[tempObject[messageName].ancestor].replies.push({poster: tempObject[messageName].poster, date: tempObject[messageName].date, message: tempObject[messageName].message, key: messageName, replies: []});
        delete tempObject[messageName];
      }
    }
  }
}
