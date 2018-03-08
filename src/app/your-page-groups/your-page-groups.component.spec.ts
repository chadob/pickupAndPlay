import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YourPageGroupsComponent } from './your-page-groups.component';

describe('YourPageGroupsComponent', () => {
  let component: YourPageGroupsComponent;
  let fixture: ComponentFixture<YourPageGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YourPageGroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YourPageGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
