/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LiniaPolecenComponent } from './linia-polecen.component';

describe('LiniaPolecenComponent', () => {
  let component: LiniaPolecenComponent;
  let fixture: ComponentFixture<LiniaPolecenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiniaPolecenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiniaPolecenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
