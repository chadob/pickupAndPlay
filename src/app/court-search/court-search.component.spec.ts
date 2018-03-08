import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourtSearchComponent } from './court-search.component';

describe('CourtSearchComponent', () => {
  let component: CourtSearchComponent;
  let fixture: ComponentFixture<CourtSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourtSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourtSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
