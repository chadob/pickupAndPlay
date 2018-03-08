import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class GoToPage {
  constructor(public router: Router) {}

  // ...
  public goToSingle(category): void {
    let link = ['/' + category];
    this.router.navigate(link);
  }
  public goToPage(category, detail): void {
    let link = ['/' + category + '/', detail];
    this.router.navigate(link);
  }
  public goToEvent(category, court, event): void {
    let link = '/' + category + '/' + court + '/' + event;
    console.log(link);
    this.router.navigateByUrl(link);
  }
}
