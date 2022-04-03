import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Subject, Subscription } from 'rxjs';
import { AppComponent } from '../app.component';
import { CzasService } from '../czas.service';
import { Osoby } from '../definicje';
import { FunkcjeWspolneService } from '../funkcje-wspolne.service';
import { KomunikacjaService } from '../komunikacja.service';
import { OsobyService } from '../osoby.service';

@Component({
  selector: 'app-zdarzenia',
  templateUrl: './zdarzenia.component.html',
  styleUrls: ['./zdarzenia.component.css']
})
export class ZdarzeniaComponent implements OnDestroy{

  width: any;
  width1: any;
  width2: any;
  tablicaosobyZapis: Osoby[] = [];
  tablicagoscieZapis: Osoby[] = [];
  sygnalteta: boolean = false;
  private tetasubscribe = new Subscription();
  private osobysubscribe = new Subscription();
  private gosciesubscribe = new Subscription();
  private logowaniesubscribe = new Subscription();
  tablicaosoby: Osoby[] = [];
  tablicagoscie: Osoby[] = [];
  
  
  constructor(private all: AppComponent, private osoby: OsobyService, private funkcje: FunkcjeWspolneService, private komunikacja: KomunikacjaService, private czasy : CzasService) 
  {
    this.width = all.szerokoscAll -  all.szerokoscZalogowani - 10 + 'px';
    this.width1 = ((all.szerokoscAll - all.szerokoscZalogowani - 30)  / 7) + 'px';
    this.width2 = ((all.szerokoscAll - all.szerokoscZalogowani - 30) / 2) + 'px';
    this.osobysubscribe = osoby.OdczytujOsoby$.subscribe
     ( data => { this.tablicaosoby = data;  } )

    this.gosciesubscribe = osoby.OdczytujGoscie$.subscribe
     ( data => { this.tablicagoscie = data; } )
 
     this.logowaniesubscribe = komunikacja.logowanieUsera$.subscribe
     ( data => 
      { 
        if (data.stan)
        { this.funkcje.addLiniaKomunikatuInfo(funkcje.getDedal().osoba, data.error) }
        else
        { this.funkcje.addLiniaKomunikatuAlert(funkcje.getDedal().osoba, data.error) }
      } )
 
  }

ngOnDestroy()
  {
    if(this.tetasubscribe) { this.tetasubscribe.unsubscribe()}    
    if(this.osobysubscribe) { this.osobysubscribe.unsubscribe()}   
    if(this.gosciesubscribe) { this.gosciesubscribe.unsubscribe()}  
    if(this.logowaniesubscribe) { this.tetasubscribe.unsubscribe()}      
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
            this.funkcje.setZmianyZakladek(8,true);
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
            this.funkcje.setZmianyZakladek(8,false);
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


setZaloga()
{
 for (let index = 0; index < this.tablicaosoby.length; index++) 
 {
   if (this.tablicaosoby[index].zalogowany)
   {
    this.komunikacja.Zaloguj(this.tablicaosoby[index].id, false, this.czasy.getCzasDedala());    
   }
 } 
}

setGoscie()
{
 for (let index = 0; index < this.tablicagoscie.length; index++) 
 {
   if (this.tablicagoscie[index].zalogowany)
   {
    this.komunikacja.Zaloguj(this.tablicagoscie[index].id, false, this.czasy.getCzasDedala());    
   }
 } 
}


setOne(kto: any, stan: boolean)
{
 this.komunikacja.Zaloguj(kto, stan, this.czasy.getCzasDedala());
}


}
