import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YourPageEventsComponent } from './your-page-events.component';

describe('YourPageEventsComponent', () => {
  let component: YourPageEventsComponent;
  let fixture: ComponentFixture<YourPageEventsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YourPageEventsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YourPageEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
