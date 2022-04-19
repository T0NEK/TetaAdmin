/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ModulyComponent } from './moduly.component';

describe('ModulyComponent', () => {
  let component: ModulyComponent;
  let fixture: ComponentFixture<ModulyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModulyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModulyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
