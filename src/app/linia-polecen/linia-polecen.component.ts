
import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppComponent } from '../app.component';
import { CzasService } from '../czas.service';
import { Zalogowany } from '../definicje';
import { FunkcjeWspolneService } from '../funkcje-wspolne.service';
import { PoleceniadedalService } from '../poleceniadedal.service';
import { WiadomosciService } from '../wiadomosci.service';

@Component({
  selector: 'app-linia-polecen',
  templateUrl: './linia-polecen.component.html',
  styleUrls: ['./linia-polecen.component.css']
})
export class LiniaPolecenComponent implements OnDestroy {

  szerokoscInput: any;
  wysokoscInput: any;
  szerokoscWyslij: any;
  width: any;
  maxLenght: number;
  linia = '';
  private odbiorcapolecenie = new Subscription();
  odbiorca: any;
  odbiorcaidpolecenia = 0;
  odbiorcaText = 'wybierz'
  wybrani: number [] = [];
  ilosc = 0;
  


constructor(private funkcje: FunkcjeWspolneService, private all: AppComponent, private wiadomosci: WiadomosciService, private poleceniadedal: PoleceniadedalService, private czas: CzasService)
 {
  this.wysokoscInput = all.wysokoscLinia;
  this.width = all.szerokoscAll;      
  this.szerokoscInput = this.width - 2 * all.szerokoscZalogowani; 
  this.szerokoscWyslij =  all.szerokoscZalogowani;
  this.maxLenght = funkcje.iloscZnakowwKomend;  

 
  this.odbiorcapolecenie = funkcje.OdbiorcaPolecenia$.subscribe 
  ( data => 
    {  
      if (this.odbiorcaidpolecenia != data.id )
      {
        this.odbiorca = data;
        this.odbiorcaidpolecenia = data.id;
        this.odbiorcaText = this.Odbiorca();
      }
    }
    );  
  }

ngOnDestroy() 
  {
    if(this.odbiorcapolecenie) { this.odbiorcapolecenie.unsubscribe()}   
  }  
  
WyslijI()
{
 if ((this.odbiorcaidpolecenia != 0)&&(this.linia.length != 0))
 { 
    this.poleceniadedal.ZapiszOdpowiedz(this.odbiorca.poleceniepierwsze, this.odbiorca.czaspierwsze, this.odbiorca.id, 'info', this.czas.getCzasDedala(), this.odbiorca.osoba, this.odbiorca.osobaText, this.odbiorca.terminal, this.linia )
 }
}

WyslijP()
{
 if ((this.odbiorcaidpolecenia != 0)&&(this.linia.length != 0))
 { 
    this.poleceniadedal.ZapiszOdpowiedz(this.odbiorca.poleceniepierwsze, this.odbiorca.czaspierwsze, this.odbiorca.id, 'pytanie', this.czas.getCzasDedala(), this.odbiorca.osoba, this.odbiorca.osobaText, this.odbiorca.terminal, 'potrzebuję dodatkowe dane: ' + this.linia )
 }
}

Odbiorca(): string
{
  console.log(this.odbiorca)
  if (this.odbiorcaidpolecenia == 0)
  { return 'wybierz'; }
  else
  { 
    if (this.odbiorca.osoba == 0)
  { return this.odbiorca.terminal}
  else
  { return this.odbiorca.osobaText}
  }  
}

}
