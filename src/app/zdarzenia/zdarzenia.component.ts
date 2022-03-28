import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { Osoby } from '../definicje';
import { OsobyService } from '../osoby.service';

@Component({
  selector: 'app-zdarzenia',
  templateUrl: './zdarzenia.component.html',
  styleUrls: ['./zdarzenia.component.css']
})
export class ZdarzeniaComponent {

  width: any;
  width1: any;
  tablicaosoby: Osoby[] = [];
  tablicagoscie: Osoby[] = [];

  constructor(private all: AppComponent, private osoby: OsobyService) 
  {
    this.width = all.szerokoscAll -  all.szerokoscZalogowani - 10 + 'px';
    this.width1 = ((all.szerokoscAll - all.szerokoscZalogowani - 30) / 7) + 'px';
  }

  setTeta(stan: boolean)
  {
    if (stan)
    {
     this.tablicaosoby =  this.osoby.getOsoby();
     this.tablicagoscie = this.osoby.getGoscie();
     this.osoby.zapisz_osoby_all( 5,'logowanie', false);    
     this.osoby.zapisz_goscie_all(5, 'logowanie', false);
    }
    else
    {
      for (let index = 0; index < this.tablicaosoby.length; index++) 
      {
        if (this.tablicaosoby[index].zalogowany)
        { this.osoby.zapisz_osoby(5,'logowanie',this.tablicaosoby[index],true) }
      }
      for (let index = 0; index < this.tablicagoscie.length; index++) 
      {
        if (this.tablicagoscie[index].zalogowany)
        { this.osoby.zapisz_goscie(5,'logowanie',this.tablicagoscie[index],true) }
      }

    }

  }
}
