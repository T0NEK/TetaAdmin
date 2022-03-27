import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-zdarzenia',
  templateUrl: './zdarzenia.component.html',
  styleUrls: ['./zdarzenia.component.css']
})
export class ZdarzeniaComponent {

  width: any;
  width1: any;

  constructor(private all: AppComponent) 
  {
    this.width = all.szerokoscAll -  all.szerokoscZalogowani - 10 + 'px';
    this.width1 = ((all.szerokoscAll - all.szerokoscZalogowani - 30) / 7) + 'px';
  }

  setTeta(stan: boolean)
  {
    if (stan)
    {
      
    }

  }
}
