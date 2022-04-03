import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppComponent } from '../app.component';
import { Osoby, Osoby2, OsobyWybrane } from '../definicje';
import { FunkcjeWspolneService } from '../funkcje-wspolne.service';
import { OsobyService } from '../osoby.service';

@Component({
  selector: 'app-zalogowani-uzytkownicy',
  templateUrl: './zalogowani-uzytkownicy.component.html',
  styleUrls: ['./zalogowani-uzytkownicy.component.css']
})
export class ZalogowaniUzytkownicyComponent implements OnDestroy {

  private osoby0subscribe = new Subscription();
  private goscie0subscribe = new Subscription();
  private inni0subscribe = new Subscription();
  private osobysubscribe = new Subscription();
  private gosciesubscribe = new Subscription();
  private innisubscribe = new Subscription();
  private kontekstsubscribe = new Subscription();
  tablicaosobyOn: Osoby[] = [];
  tablicaosobyOff: Osoby[] = [];
  tablicaosobyInni: Osoby[] = [];
  height: any;
  width: any;
  wybrany: number = 0;
  tablicaWybrany: OsobyWybrane[] = [];
  nadawcy: number[] =[]
  
  
  
  
  
constructor(private all: AppComponent, private osoby: OsobyService, private funkcje: FunkcjeWspolneService) 
  {
    this.height = all.wysokoscNawigacja;
    this.width = all.szerokoscZalogowani;
    //console.log(this.height)

    this.osoby0subscribe = osoby.OdczytajOsoby$.subscribe
    ( data => 
      { 
        this.tablicaosobyOn = data;
        let tab: Osoby2[] = []; 
        this.tablicaosobyOn.forEach( element => { tab = [...tab, element] } ); 
        this.tablicaWybrany = [...this.tablicaWybrany, {tab}]
        }
    )

    this.osobysubscribe = osoby.OdczytujOsoby$.subscribe
    ( data => 
      { 
        this.tablicaosobyOn = data;
      }
   )

   this.goscie0subscribe = osoby.OdczytajGoscie$.subscribe
   ( data => 
     { 
       this.tablicaosobyOff = data;
       let tab: Osoby2[] = []; 
       this.tablicaosobyOff.forEach( element =>  {  tab = [...tab, element] }); 
       this.tablicaWybrany = [...this.tablicaWybrany, {tab}]
       }
   )

   this.gosciesubscribe = osoby.OdczytujGoscie$.subscribe
   ( data => 
     { 
       this.tablicaosobyOff = data;
     }
  )

    
      this.inni0subscribe = osoby.OdczytajInni$.subscribe
      ( data => 
        { 
          this.tablicaosobyInni = data;
          let tab: Osoby2[] = []; 
          this.tablicaosobyInni.forEach( element =>  { tab = [...tab, element] } ); 
          this.tablicaWybrany = [...this.tablicaWybrany, {tab}]
          }
      )  

    this.innisubscribe = osoby.OdczytujInni$.subscribe
    ( data => 
      { 
        this.tablicaosobyInni = data; 
      } )

    this.innisubscribe = osoby.ZmienKontekst$.subscribe
      ( data => 
        { 
          let wynik: any = this.Zmieniany(data.id) 
          this.WybranyW(-1, false, wynik.tabela, wynik.indeks)
        } )

  }

  ngOnDestroy()
  {
    if(this.osoby0subscribe) { this.osoby0subscribe.unsubscribe()}   
    if(this.goscie0subscribe) { this.goscie0subscribe.unsubscribe()}   
    if(this.inni0subscribe) { this.inni0subscribe.unsubscribe()}   
    if(this.osobysubscribe) { this.osobysubscribe.unsubscribe()}   
    if(this.gosciesubscribe) { this.gosciesubscribe.unsubscribe()}   
    if(this.innisubscribe) { this.innisubscribe.unsubscribe()}   
    if(this.kontekstsubscribe) { this.kontekstsubscribe.unsubscribe()}   
  }

  Wybrany(id: number, i: number)
  {
  if (this.tablicaWybrany[id].tab[i].wybrany)
    { this.wybrany--; this.tablicaWybrany[id].tab[i].wybrany = false; }
    else
    { this.wybrany++; this.tablicaWybrany[id].tab[i].wybrany = true; }
    let zalogowany = this.SzukajOsoby(this.tablicaWybrany) 
    this.funkcje.setZalogowany(zalogowany, this.nadawcy) 
  }

  SzukajOsoby(tabela: any): any
  {
      let wynik: any;    
      let ilosc = 0
      this.nadawcy = [];
      for (let index = 0; index < tabela.length; index++) 
      {
        for (let index2 = 0; index2 < tabela[index].tab.length; index2++) 
        { if (tabela[index].tab[index2].wybrany) 
          { ilosc++;
            wynik = tabela[index].tab[index2];
            this.nadawcy = [...this.nadawcy, wynik.id]} 
          }  
      }
    if (ilosc != 1) { wynik = {'id': 0, 'imie': '', 'nazwisko': '', 'funkcja': '', 'rodzaj': ''};} 
    return wynik
  }
  
  Zmieniany(id: number):any
  {
    //console.log(id)
    let indeks: number = -1;
    let tabela: number = -1;
    for (let index = 0; index < this.tablicaWybrany.length; index++) 
      {
        for (let index2 = 0; index2 < this.tablicaWybrany[index].tab.length; index2++) 
        { if (this.tablicaWybrany[index].tab[index2].id == id) 
          { 
            indeks = index2;
            tabela = index;
            break;
          }  
        }
        if (tabela != -1) {break;}
      }
      //console.log("tabela", tabela, "indeks", indeks)  
    return {"tabela": tabela, "indeks": indeks}
  }

  WybranyW(id: number, all: boolean, tabela: number = -1, indeks: number = -1)
  {
    if (id == -1)
    {
      if (all)
      { 
        for (let index = 0; index < this.tablicaWybrany.length; index++) 
        this.tablicaWybrany[index].tab.forEach(element => { if (!element.wybrany) { this.wybrany++ } element.wybrany = true; });
      }
      else
      { 
        for (let index = 0; index < this.tablicaWybrany.length; index++) 
        this.tablicaWybrany[index].tab.forEach(element => { if (element.wybrany) { this.wybrany-- } element.wybrany = false; });
      } 
    let zalogowany = this.SzukajOsoby(this.tablicaWybrany) 
    this.funkcje.setZalogowany(zalogowany, this.nadawcy) 
    }
    else
    {
    if (all)
      { this.tablicaWybrany[id].tab.forEach(element => { if (!element.wybrany) { this.wybrany++ } element.wybrany = true; }) }
      else
      { this.tablicaWybrany[id].tab.forEach(element => { if (element.wybrany) { this.wybrany-- } element.wybrany = false; }) }
    let zalogowany = this.SzukajOsoby(this.tablicaWybrany) 
    this.funkcje.setZalogowany(zalogowany, this.nadawcy) 
    }
    if (tabela != -1)
    {
      this.wybrany++; 
      this.tablicaWybrany[tabela].tab[indeks].wybrany = true;
      let zalogowany = this.SzukajOsoby(this.tablicaWybrany) 
      this.funkcje.setZalogowany(zalogowany, this.nadawcy)        
    }
  }



}
