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

  constructor(private osoby: OsobyService )
   {
    //console.log('użytkownicy con')
     this.osobysubscribe = osoby.OdczytajOsoby$.subscribe
     ( data => 
      {
        //console.log('data',data)
        for (let index = 0; index < data.length; index++) 
        {
          if (this.tablicaosoby.length == 0)
          {
            this.tablicaosoby = data;
          }
          else
          if (data[index].id != this.tablicaosoby[index].id)
          {
            this.tablicaosoby[index] = data[index];
          }
          else
          {
            if (data[index].zalogowany != this.tablicaosoby[index].zalogowany) {this.tablicaosoby[index].zalogowany = data[index].zalogowany; }
            if (data[index].blokada != this.tablicaosoby[index].blokada) {this.tablicaosoby[index].blokada = data[index].blokada; }
            if (data[index].hannah != this.tablicaosoby[index].hannah) {this.tablicaosoby[index].hannah = data[index].hannah; }
            if (data[index].fiona != this.tablicaosoby[index].fiona) {this.tablicaosoby[index].fiona = data[index].fiona; }
            if (data[index].rajeh != this.tablicaosoby[index].rajeh) {this.tablicaosoby[index].rajeh = data[index].rajeh; }
          }
          
        }
        
      } )
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

setZaloga(czynnosc: string, stan: boolean)
{
  this.osoby.zapisz_osoby_all( 5, czynnosc, stan);
//for (let index = 0; index < this.tablicaosoby.length; index++) { kto[index].zalogowany = stan; }
}

setGoscie(czynnosc: string, stan: boolean)
{
  this.osoby.zapisz_goscie_all( 5, czynnosc, stan);
}

setZalogaOne(czynnosc: string, kto: any, event: MatSlideToggleChange )
{
 this.osoby.zapisz_osoby( 5, czynnosc, kto, event.checked);
 //console.log('czynnosc: ',czynnosc, 'kto:', kto.id, '    to co= ',event.checked)
}

setGoscieOne(czynnosc: string, kto: any, event: MatSlideToggleChange )
{
 this.osoby.zapisz_goscie( 5, czynnosc, kto, event.checked);
}

}
