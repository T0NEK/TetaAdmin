import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Subscription } from 'rxjs';
import { Osoby } from '../definicje';
import { OsobyService } from '../osoby.service';

@Component({
  selector: 'app-uzytkownicy',
  templateUrl: './uzytkownicy.component.html',
  styleUrls: ['./uzytkownicy.component.css']
})
export class UzytkownicyComponent implements OnInit, OnDestroy 
{

  private osobysubscribe = new Subscription();
  private gosciesubscribe = new Subscription();
  tablicaosoby: Osoby[] = [];
  tablicagoscie: Osoby[] = [];
  zalogowany = true;

  constructor(private osoby: OsobyService, )
   {
    console.log('użytkownicy con')
     this.osobysubscribe = osoby.OdczytajOsoby$.subscribe
     ( data => { this.tablicaosoby = data; } )
    this.gosciesubscribe = osoby.OdczytajGoscie$.subscribe
     ( data => { this.tablicagoscie = data; } )
  }
 
   
  ngOnInit() 
  {
  
  }

  ngOnDestroy()
  {
   if(this.osobysubscribe) { this.osobysubscribe.unsubscribe()}   
   if(this.gosciesubscribe) { this.gosciesubscribe.unsubscribe()}   
  }

  setZalogowany(change: any, event: MatSlideToggleChange )
  {
    console.log('zalogowany:',change,'    to co= ',event)
  }
}
