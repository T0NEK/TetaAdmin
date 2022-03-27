import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppComponent } from '../app.component';
import { Zalogowany } from '../definicje';
import { FunkcjeWspolneService } from '../funkcje-wspolne.service';
import { WiadomosciService } from '../wiadomosci.service';

@Component({
  selector: 'app-linia-komend',
  templateUrl: './linia-komend.component.html',
  styleUrls: ['./linia-komend.component.css']
})


export class LiniaKomendComponent implements OnDestroy {

  szerokoscInput: any;
  wysokoscInput: any;
  szerokoscWyslij: any;
  width: any;
  maxLenght: number;
  linia = '';
  private zalogowany = new Subscription();
  private odbiorca = new Subscription();
  nadawca: Zalogowany;
  odbiorcy: string = '';
  kolorN: boolean = false;
  kolorO: boolean = false;
  wybrani: number [] = [];
  ilosc = 0;
  


constructor(private funkcje: FunkcjeWspolneService, private all: AppComponent, private wiadomosci: WiadomosciService)
 {
  this.wysokoscInput = all.wysokoscLinia;
  this.width = all.szerokoscAll;      
  this.szerokoscInput = this.width - all.szerokoscZalogowani; 
  this.szerokoscWyslij =  all.szerokoscZalogowani;
  this.maxLenght = funkcje.iloscZnakowwKomend;  
  this.nadawca = this.funkcje.getZalogowany()


  this.zalogowany = funkcje.Zalogowany$.subscribe 
  ( data => 
    { 
      //console.log(data)
      if (data.zalogowany.zalogowany == 0)
      { if (data.nadawcy.length == 0)
        { this.nadawca.imie = 'wybierz'; this.nadawca.nazwisko = ''; this.kolorN = false; }
        else
        { this.nadawca.imie = 'wielu'; this.nadawca.nazwisko = '' ; this.kolorN = true; }
      }
      else
      { this.nadawca = data.zalogowany; this.kolorN = true }
    } 
  );  

  this.odbiorca = funkcje.Odbiorca$.subscribe 
  ( data => 
    { 
      this.odbiorcy = '';
      this.ilosc = 0;
      for (let element of data)
      {
        if ((element.wybrany)&&(element.id != this.funkcje.getZalogowany().zalogowany)) 
        {
          this.wybrani = [...this.wybrani, element.id] 
          this.ilosc++;
          this.odbiorcy = element.imie + ' ' + element.nazwisko
        }; 
      }
      if (this.ilosc == 1) 
        { this.kolorO = true }
        else if (this.ilosc == 0) 
             { this.odbiorcy = 'wybierz'; this.kolorO = false }
             else 
             { this.odbiorcy = 'wielu'; this.kolorO = true}
    }  
    );  
  }

ngOnDestroy() 
  {
    if(this.zalogowany) { this.zalogowany.unsubscribe()}   
    if(this.odbiorca) { this.odbiorca.unsubscribe()}   
  }  
  
Wyslij()
{
 if ((this.kolorN)&&(this.kolorO)&&(this.linia.length != 0))
 { 
    this.wiadomosci.WyslijWiadomosc.next(this.linia);
 }
}
}
