import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YourPageMessagesComponent } from './your-page-messages.component';

describe('YourPageMessagesComponent', () => {
  let component: YourPageMessagesComponent;
  let fixture: ComponentFixture<YourPageMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YourPageMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YourPageMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
