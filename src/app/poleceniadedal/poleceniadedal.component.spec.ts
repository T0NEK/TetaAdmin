/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PoleceniadedalComponent } from './poleceniadedal.component';

describe('PoleceniadedalComponent', () => {
  let component: PoleceniadedalComponent;
  let fixture: ComponentFixture<PoleceniadedalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoleceniadedalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoleceniadedalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
