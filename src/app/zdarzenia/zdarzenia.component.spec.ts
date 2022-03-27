/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ZdarzeniaComponent } from './zdarzenia.component';

describe('ZdarzeniaComponent', () => {
  let component: ZdarzeniaComponent;
  let fixture: ComponentFixture<ZdarzeniaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZdarzeniaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZdarzeniaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
