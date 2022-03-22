import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppComponent } from '../app.component';
import { Osoby } from '../definicje';
import { OsobyService } from '../osoby.service';

@Component({
  selector: 'app-zalogowani-uzytkownicy',
  templateUrl: './zalogowani-uzytkownicy.component.html',
  styleUrls: ['./zalogowani-uzytkownicy.component.css']
})
export class ZalogowaniUzytkownicyComponent implements OnDestroy {

  private osobysubscribe = new Subscription();
  private gosciesubscribe = new Subscription();
  private innisubscribe = new Subscription();
  tablicaosobyOn: Osoby[] = [];
  tablicaosobyOff: Osoby[] = [];
  tablicaosobyInni: Osoby[] = [];
  height: any;
  width: any;
  wybrany: number = 1;

constructor(private all: AppComponent, private osoby: OsobyService) 
  {
    this.height = all.wysokoscNawigacja;
    this.width = all.szerokoscZalogowani;
    //console.log(this.height)
    this.osobysubscribe = osoby.OdczytajOsoby$.subscribe
    ( data => { 
     //console.log(data)
      this.tablicaosobyOn = data; } )
    this.gosciesubscribe = osoby.OdczytajGoscie$.subscribe
    ( data => { this.tablicaosobyOff = data; } )
    this.innisubscribe = osoby.OdczytajInni$.subscribe
    ( data => { this.tablicaosobyInni = data; } )
  }

  ngOnDestroy()
  {
    if(this.osobysubscribe) { this.osobysubscribe.unsubscribe()}   
    if(this.gosciesubscribe) { this.gosciesubscribe.unsubscribe()}   
    if(this.innisubscribe) { this.innisubscribe.unsubscribe()}   
  }

  Wybrany(numer: number)
  {
    this.wybrany = numer;
  }

}
