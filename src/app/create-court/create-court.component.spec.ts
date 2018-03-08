import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCourtComponent } from './create-court.component';

describe('CreateCourtComponent', () => {
  let component: CreateCourtComponent;
  let fixture: ComponentFixture<CreateCourtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCourtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCourtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
