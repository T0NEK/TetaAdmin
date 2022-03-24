import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppComponent } from '../app.component';
import { Zalogowany } from '../definicje';
import { FunkcjeWspolneService } from '../funkcje-wspolne.service';

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
  @ViewChild('liniaInput') liniaInput!: ElementRef;
  linia = '';
  private zalogowany = new Subscription();
  private odbiorca = new Subscription();
  nadawca: Zalogowany;
  odbiorcy: string = '';
  wyslijkolor: string = 'btn-danger'
  wybrani: number [] = [];
  ilosc = 0;
  


constructor(private funkcje: FunkcjeWspolneService, private all: AppComponent)
 {
  this.wysokoscInput = all.wysokoscLinia;
  this.width = all.szerokoscAll;      
  this.szerokoscInput = this.width - all.szerokoscZalogowani; 
  this.szerokoscWyslij =  all.szerokoscZalogowani;
  this.maxLenght = funkcje.iloscZnakowwKomend;  
  this.nadawca = this.funkcje.getZalogowany()


  this.zalogowany = funkcje.Zalogowany$.subscribe ( data => { this.nadawca = data } );  
  this.odbiorca = funkcje.Odbiorca$.subscribe ( data => 
    { 
      this.odbiorcy = '';
      this.ilosc = 0;
      for (let element of data)
      {
        if (element.wybrany) 
        {
          this.wybrani = [...this.wybrani, element.id] 
          this.ilosc++;
          this.odbiorcy = element.imie + ' ' + element.nazwisko
        }; 
      }
      if (this.ilosc == 1) { this.wyslijkolor = 'btn-success' }
      else if (this.ilosc == 0) { this.odbiorcy = 'wybierz'; this.wyslijkolor = 'btn-danger' }
          else { this.odbiorcy = 'wielu'; this.wyslijkolor = 'btn-success'}
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
 if (this.ilosc > 0)
 { this.funkcje.addLiniaKomunikatuKolor(this.funkcje.getDedal().osoba,'Wysłano ', 'yellow') }
}
}
