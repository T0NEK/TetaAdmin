import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppComponent } from '../app.component';
import { Osoby } from '../definicje';
import { FunkcjeWspolneService } from '../funkcje-wspolne.service';
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

constructor(private all: AppComponent, private osoby: OsobyService, private funkcje: FunkcjeWspolneService) 
  {
    this.height = all.wysokoscNawigacja;
    this.width = all.szerokoscZalogowani;
    //console.log(this.height)
    this.osobysubscribe = osoby.OdczytujOsoby$.subscribe
    ( data => { this.tablicaosobyOn = data; } )
    this.gosciesubscribe = osoby.OdczytujGoscie$.subscribe
    ( data => { this.tablicaosobyOff = data; } )
    this.innisubscribe = osoby.OdczytujInni$.subscribe
    ( data => { this.tablicaosobyInni = data; } )
  }

  ngOnDestroy()
  {
    if(this.osobysubscribe) { this.osobysubscribe.unsubscribe()}   
    if(this.gosciesubscribe) { this.gosciesubscribe.unsubscribe()}   
    if(this.innisubscribe) { this.innisubscribe.unsubscribe()}   
  }

  Wybrany(tabela: any, numer: number)
  {
    if (numer == -1)
    {
      this.wybrany = -1;
      this.funkcje.setZalogowany(0, "", "", "", "")  
    }
    else
    {
    this.wybrany = tabela[numer].id;
    this.funkcje.setZalogowany(tabela[numer].id, tabela[numer].imie, tabela[numer].nazwisko, tabela[numer].funkcja, tabela[numer].rodzaj)
    }
  }

}
