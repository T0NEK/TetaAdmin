import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { AppComponent } from '../app.component';
import { Osoby } from '../definicje';
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
  private osobyNsubscribe = new Subscription();
  private goscieNsubscribe = new Subscription();
  
  constructor(private all: AppComponent, private osoby: OsobyService) 
  {
    this.width = all.szerokoscAll -  all.szerokoscZalogowani - 10 + 'px';
    this.width1 = ((all.szerokoscAll - all.szerokoscZalogowani - 30) / 7) + 'px';

    this.tetasubscribe = this.SygnalTeta$.subscribe
    ( data => 
     {

      if ((data)&&(!this.sygnalteta))
      {
       this.sygnalteta = true; 
       this.tablicaosobyZapis =  this.osoby.getOsoby();
       this.tablicagoscieZapis = this.osoby.getGoscie();
       this.osoby.zapisz_osoby_all( 5,'logowanie', false);    
       this.osoby.zapisz_goscie_all(5, 'logowanie', false);
       this.osobyNsubscribe = this.osoby.OdczytujOsoby$.subscribe
                            ( data => 
                            {
                            for (let index = 0; index < this.tablicaosobyZapis.length; index++) 
                              { if (data[index].zalogowany)
                                { this.tablicaosobyZapis[index].zalogowany = true
                                  this.osoby.zapisz_osoby(5,'logowanie',this.tablicaosobyZapis[index],false)}  
                              }
                            } )
       this.goscieNsubscribe = this.osoby.OdczytujGoscie$.subscribe
                            ( data => 
                            {
                            for (let index = 0; index < this.tablicagoscieZapis.length; index++) 
                              { if ( data[index].zalogowany)
                                { this.tablicagoscieZapis[index].zalogowany = true
                                  this.osoby.zapisz_osoby(5,'logowanie',this.tablicagoscieZapis[index],false)}  
                              }
                              } )
      }
      else
      {  
        this.sygnalteta = false; 
        if(this.osobyNsubscribe) { this.osobyNsubscribe.unsubscribe()}   
        if(this.goscieNsubscribe) { this.goscieNsubscribe.unsubscribe()}   
        for (let index = 0; index < this.tablicaosobyZapis.length; index++) 
        {
          if (this.tablicaosobyZapis[index].zalogowany)
          { this.osoby.zapisz_osoby(5,'logowanie',this.tablicaosobyZapis[index],true) }
        }
        for (let index = 0; index < this.tablicagoscieZapis.length; index++) 
        {
          if (this.tablicagoscieZapis[index].zalogowany)
          { this.osoby.zapisz_goscie(5,'logowanie',this.tablicagoscieZapis[index],true) }
        }
        //if(this.tetasubscribe) { this.tetasubscribe.unsubscribe()}     
      }
      } )

     
  }

ngOnDestroy()
  {
    if(this.tetasubscribe) { this.tetasubscribe.unsubscribe()}     
    if(this.osobyNsubscribe) { this.osobyNsubscribe.unsubscribe()}   
    if(this.goscieNsubscribe) { this.goscieNsubscribe.unsubscribe()}   
  }

private SygnalTeta = new Subject<any>();
SygnalTeta$ = this.SygnalTeta.asObservable()

setTeta(stan: boolean)
  { 
    this.SygnalTeta.next(stan)   
  }


}
