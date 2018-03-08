import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YourPageCourtsComponent } from './your-page-courts.component';

describe('YourPageCourtsComponent', () => {
  let component: YourPageCourtsComponent;
  let fixture: ComponentFixture<YourPageCourtsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YourPageCourtsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YourPageCourtsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
