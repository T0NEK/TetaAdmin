import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { AppComponent } from '../app.component';
import { Osoby } from '../definicje';
import { FunkcjeWspolneService } from '../funkcje-wspolne.service';
import { OsobyService } from '../osoby.service';

@Component({
  selector: 'app-zdarzenia',
  templateUrl: './zdarzenia.component.html',
  styleUrls: ['./zdarzenia.component.css']
})
export class ZdarzeniaComponent implements OnDestroy{

  width: any;
  width1: any;
  tablicaosobyZapis: Osoby[] = [];
  tablicagoscieZapis: Osoby[] = [];
  sygnalteta: boolean = false;
  private tetasubscribe = new Subscription();
  
  
  constructor(private all: AppComponent, private osoby: OsobyService, private funkcje: FunkcjeWspolneService) 
  {
    this.width = all.szerokoscAll -  all.szerokoscZalogowani - 10 + 'px';
    this.width1 = ((all.szerokoscAll - all.szerokoscZalogowani - 30) / 7) + 'px';
 
  }

ngOnDestroy()
  {
    if(this.tetasubscribe) { this.tetasubscribe.unsubscribe()}     
  }



setTeta(stan: boolean)
{ 
//    this.SygnalTeta.next(stan)   
  
  if (stan)
  {
    this.tablicaosobyZapis =  this.osoby.getOsoby();
    this.tablicagoscieZapis = this.osoby.getGoscie();
    let licznik = 0;
    let licznikOK = 0
    this.tetasubscribe = this.osoby.SygnalTeta$.subscribe
    ( data => 
     {
        //console.log(stan, licznik, licznikOK)
        licznik++;
        if ((data.wynik)) { licznikOK++ }
        if (licznik == 2)
        {
          if (licznikOK == 2)
          { 
            this.sygnalteta = stan; 
            this.tetasubscribe.unsubscribe();
            this.funkcje.addLiniaKomunikatuKrytyczny(this.funkcje.getDedal().osoba,'Załączony: SYGNAŁ TETA');
          }
         else
          { 
           this.tetasubscribe.unsubscribe();
           this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba,'Problem z załączeniem: SYGNAŁ TETA');
          }
        }  
     })
    this.osoby.zapisz_osoby_all( 5,'polecenia', false); 
    this.osoby.zapisz_goscie_all(5, 'polecenia', false);
  }
  else
  {
    let licznik1 = 0;
    let licznik2 = 0;
    let licznikOK = 0
    this.tetasubscribe = this.osoby.SygnalTeta$.subscribe
    ( data => 
     {
      //console.log(stan, licznik1, licznik2, licznikOK)
        licznik2++;
        if ((data.wynik)) { licznikOK++ }
        if (licznik1 == licznik2)
        {
        if (licznikOK == licznik1)
          { 
            this.sygnalteta = stan; 
            this.tetasubscribe.unsubscribe();
            this.funkcje.addLiniaKomunikatuKrytyczny(this.funkcje.getDedal().osoba,'Wyłączony: SYGNAŁ TETA');
          }
         else
          { 
           this.tetasubscribe.unsubscribe();
           this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba,'Problem z wyłączeniem: SYGNAŁ TETA');
          }
        }
     })

    for (let index = 0; index < this.tablicaosobyZapis.length; index++) 
    {
      if (this.tablicaosobyZapis[index].polecenia)
      { 
        licznik1++;
        this.osoby.zapisz_osoby(5,'polecenia',this.tablicaosobyZapis[index],true) 
      }
    }
    for (let index = 0; index < this.tablicagoscieZapis.length; index++) 
    {
      if (this.tablicagoscieZapis[index].polecenia)
      { 
        licznik1++;
        this.osoby.zapisz_goscie(5,'polecenia',this.tablicagoscieZapis[index],true) 
      }
    }
    
  }
}


}
