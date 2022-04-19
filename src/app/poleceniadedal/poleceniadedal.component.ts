
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { Subject, Subscription } from 'rxjs';
import { AppComponent } from '../app.component';
import { CzasService } from '../czas.service';
import { OsobyWiadomosci, Wiadomosci } from '../definicje';
import { FunkcjeWspolneService } from '../funkcje-wspolne.service';
import { KomunikacjaService } from '../komunikacja.service';
import { OsobyService } from '../osoby.service';
import { PoleceniadedalService } from '../poleceniadedal.service';


@Component({
  selector: 'app-poleceniadedal',
  templateUrl: './poleceniadedal.component.html',
  styleUrls: ['./poleceniadedal.component.css']
})
export class PoleceniadedalComponent implements OnDestroy, AfterViewInit {


  
  private osobysubscribe = new Subscription();
  private zakladkasubscribe = new Subscription();
  private poleceniasubscribe = new Subscription();
  private odpowiedzsubscribe = new Subscription();
  
  private zalogowany = new Subscription();
  private odbiorca = new Subscription();
  private osobyNsubscribe = new Subscription();
  private goscieNsubscribe = new Subscription();
  tablicaosoby: any[] = [];
  tablicaosobywybrane: number[] = [];
  tablicaosobyaktywne: number[] = [];
  tablicapolecenia: any[] = [];
  tablicapoleceniaall: any[] = [];
  wybranyId = 0;
  zaznaczonePolecenie = -1;
  height: any;
  width: any;
  width1: any;
  wysokoscLinia: any;
  listaczasyN: number[] = [1,	2,	3,	4,	5,	6,	7,	8,	9,	10,	15,	20,	25,	30,	35,	40,	45,	50,	55,	60,	120,	180,	240,	300,	360,	420,	480,	540,	600,	900,	1200,	1500,	1800,	2100,	2400,	2700,	3000,	3300,	3600,	5400,	7200,	9000,	10800,	12600,	14400,	16200,	18000,	19800,	21600, 23400];
  listaczasyT: string[] = ['1 s',	'2 s',	'3 s',	'4 s',	'5 s',	'6 s',	'7 s',	'8 s',	'9 s',	'10 s',	'15 s',	'20 s',	'25 s',	'30 s',	'35 s',	'40 s',	'45 s',	'50 s',	'55 s',	'60 s',	'2 m',	'3 m',	'4 m',	'5 m',	'6 m',	'7 m',	'8 m',	'9 m',	'10 m',	'15 m',	'20 m',	'25 m',	'30 m',	'35 m',	'40 m',	'45 m',	'50 m',	'55 m',	'60 m',	'1.5 h',	'2 h',	'2.5 h',	'3 h',	'3.5 h',	'4 h',	'4.5 h',	'5 h',	'5.5 h',	'6 h'];
  czaswykonania = 1;
 


  checked = true;
  @ViewChild('scrollViewportDedal') VSVDedal!: CdkVirtualScrollViewport;


  constructor(private all: AppComponent, private funkcje: FunkcjeWspolneService, private czas: CzasService, private komunikacja: KomunikacjaService, private changeDetectorRef: ChangeDetectorRef, private osoby: OsobyService, private poleceniadedal: PoleceniadedalService) 
  { 
    this.height = (all.wysokoscNawigacja - all.wysokoscNawigacjaNag - all.wysokoscLinia - all.wysokoscPrzewijaj ) + 'px' ;
    this.width = all.szerokoscWiadOsoby + 'px';
    this.width1 = (all.szerokoscAll - all.szerokoscZalogowani - all.szerokoscWiadOsoby - 10) + 'px';
    this.wysokoscLinia = all.wysokoscLinia;

    this.zakladkasubscribe = funkcje.ZakladkaDialogu$.subscribe
    (
      data =>
      {
          if (data == 9) 
          {
            //this.wiadomosci.wczytajOsoby();
            //this.wiadomosci.OdczytajWiadomosci();
            
          { if (this.checked) { this.Przewin()} }
         }
      }  
    )
    
    this.osobysubscribe = poleceniadedal.OdczytajOsoby$.subscribe
    ( data => 
      { 
        //console.log(data)
        //console.log(this.tablicaosoby)
        //if ((this.tablicaosoby.length != 0)&&(data.length != 0))
        //{data.forEach( (element: OsobyWiadomosci, index: number) => { element.wybrany = this.tablicaosoby[index].wybrany;  })};
        this.tablicaosoby = data;   
        this.tablicaosoby.forEach((element, index) => { 
            this.tablicaosobywybrane[index] = -1;
            this.tablicaosobyaktywne[index] = 0;
            element.wybrany = false;
            });
      } 
    )
   
      this.poleceniasubscribe = poleceniadedal.PoleceniaDedal$.subscribe
      ( data =>
        {
          this.tablicapoleceniaall = data;
          this.tablicaosoby.forEach((element, index) => { this.tablicaosobyaktywne[index] = 0; });
          this.FiltrujOsoba(this.wybranyId==0);      
          let aktywny = false;
          //console.log(data)
          for (let index = 0; index < data.length; index++) 
          {
            if (data[index].odpowiedz)
            {
              if (1*data[index].osoba == 0)  
              {
                aktywny = true;
              }
              else
              {
              for (let index2 = 0; index2 < this.tablicaosobyaktywne.length; index2++) 
              {
                //console.log(this.tablicaosoby[index2].id, data[index].osoba)
                if (1*data[index].osoba == 1*this.tablicaosoby[index2].id)  
                {
                 this.tablicaosobyaktywne[index2] = 1*this.tablicaosobyaktywne[index2] + 1;
                 aktywny = true;
                 break;
                }
              }
              }
            }
          }
        if (aktywny) { this.funkcje.setZmianyZakladek(9,true)} else { this.funkcje.setZmianyZakladek(9,false)}  
        if (this.checked) { this.Przewin() }
        })

 }


  ngOnDestroy()
  {
    if(this.osobysubscribe) { this.osobysubscribe.unsubscribe()}   
    if(this.zakladkasubscribe) { this.zakladkasubscribe.unsubscribe()}   
    if(this.poleceniasubscribe) { this.poleceniasubscribe.unsubscribe()}   
    if(this.odpowiedzsubscribe) { this.odpowiedzsubscribe.unsubscribe()}

    if(this.zalogowany) { this.zalogowany.unsubscribe()}   
    if(this.odbiorca) { this.odbiorca.unsubscribe()}   
    if(this.osobyNsubscribe) { this.osobyNsubscribe.unsubscribe()}   
    if(this.goscieNsubscribe) { this.goscieNsubscribe.unsubscribe()}   
  }

  ngAfterViewInit()
  {
  //console.log('AV dialog')
    //this.tablicazawartosci = this.funkcje.getLinieDialogu(); 
    this.changeDetectorRef.detectChanges();
    this.VSVDedal.checkViewportSize()
  } 

Odpowiedz(item: any, i: number, tekst: string, polecenie: string)
{
this.poleceniadedal.ZapiszOdpowiedz(item.poleceniepierwsze, item.czaspierwsze, item.id, polecenie, this.czas.getCzasDedala(), item.osoba, item.osobaText, item.terminal, tekst)
}

OdpowiedzOK(item: any, i: number, tekst: string, polecenie: string)
{
this.Odpowiedz(item, i, tekst + ' , czas ~ ' + this.FormatCzas(this.czaswykonania) , polecenie);
setTimeout(() =>  {
                  this.poleceniadedal.ZapiszOdpowiedz(item.poleceniepierwsze, item.czaspierwsze, item.id, 'info', this.czas.getCzasDedala(), item.osoba, item.osobaText, item.terminal, 'polecenie zakończono prawidłowo')
                  }, this.czaswykonania*1000);
}

OdpowiedzERROR1(item: any, i: number, tekst: string, polecenie: string)
{
this.Odpowiedz(item, i, tekst + ' , czas ~ ' + this.FormatCzas(this.czaswykonania) , polecenie);
setTimeout(() =>  {
  this.poleceniadedal.ZapiszOdpowiedz(item.poleceniepierwsze, item.czaspierwsze, item.id, 'info', this.czas.getCzasDedala(), item.osoba, item.osobaText, item.terminal, 'problem z wykonaniem polecenia')
  }, this.czaswykonania*1000);
}

OdpowiedzERROR2(item: any, i: number, tekst: string, polecenie: string)
{
this.Odpowiedz(item, i, tekst + ' , czas ~ ' + this.FormatCzas(this.czaswykonania) , polecenie);
setTimeout(() =>  {
  this.poleceniadedal.ZapiszOdpowiedz(item.poleceniepierwsze, item.czaspierwsze, item.id, 'info', this.czas.getCzasDedala(), item.osoba, item.osobaText, item.terminal, 'wykonanie polecenia zakończone niepowodzeniem')
  }, this.czaswykonania*1000);
}


Przelacz(wszystkie: number, all: boolean)
  {
    if (all)
    {
      this.FiltrujOsoba(true);  
    }
    else
    {
    this.wybranyId = this.tablicaosoby[wszystkie].id;
    this.tablicaosoby.forEach((element, index) => 
        { 
          element.wybrany = false;
          this.tablicaosobywybrane[index] = -1;
        });
      this.tablicaosoby[wszystkie].wybrany = !all;
      this.tablicaosobywybrane[wszystkie] = (!all ? (1*this.tablicaosoby[wszystkie].id) : -1);
    }
      this.FiltrujOsoba(false);  
      
  }

  FiltrujOsoba(all: boolean)
  { 
    this.tablicapolecenia = [];
    if (all) { this.wybranyId = 0 }
    for (let index = 0; index < this.tablicapoleceniaall.length; index++) 
    {
      if ((this.wybranyId == this.tablicapoleceniaall[index].osoba)||all)
        this.tablicapolecenia = [...this.tablicapolecenia, this.tablicapoleceniaall[index]]
    }
  }

  ZaznaczoneWP(item: any)
  {
    if (item.poleceniepierwsze+item.czaspierwsze == this.zaznaczonePolecenie)  
    { return 'text-warning' }
    else
    { return 'text-primary'}
  }

  ZaznaczoneWS(item: any)
  {
    if (item.poleceniepierwsze+item.czaspierwsze == this.zaznaczonePolecenie)  
    { return 'text-warning' }
    else
    { return 'text-success'}
  }

  Polecenie(item: any)
  {
    if (item.poleceniepierwsze == item.polecenieText)
    { return item.polecenieText}
    else
    { return item.poleceniepierwsze + '->' + item.polecenieodpowiedz + '= ' + item.polecenieText + (item.polecenieodpowiedz == 'modul' ? (' (' + item.modul + ')') : '' ) + (item.polecenieodpowiedz == 'zespol' ? (' (' +item.zespol + ')(' + item.modulzespol + ')' ) : '' )  + (item.polecenieodpowiedz == 'element' ? (' (' + (item.element == item.polecenieText ? 'OK' : item.element) + ')') : '' ) }
  }

  Zaznacz(item: any)
  {
    this.zaznaczonePolecenie = item.poleceniepierwsze+item.czaspierwsze;
    this.funkcje.odbiorcapolecenia(item);
  }

  PolecenieIlosc(id: number, i: number)
  {
    let wynik = 0;
    wynik = this.tablicaosobyaktywne[i]
    return wynik
  }

  /*
  PrzelaczIdOsoba(id: number): number
  {
    let numer: number = 0;
    for (let index = 0; index < this.tablicaosoby.length; index++) 
    { if (this.tablicaosoby[index].id == id) 
      { numer = index; break; } };
    return numer;
  }

 */

  onClick(kto: string)
  {// dla przewijaj
   //   this.funkcje.fokusLiniaDialogu('');
  }

  Przewijaj()
  {   
    if ((!this.checked)) { this.Przewin() }
  }

  Przewin()
  {
    let count = this.VSVDedal.getDataLength();
    this.changeDetectorRef.detectChanges();
    this.VSVDedal.checkViewportSize()
    this.VSVDedal.scrollToIndex((count), 'smooth'); 
  }

  FormatCzas(czassekund: number):string
{
  let godziny = Math.trunc(czassekund / 3600);
  let minuty = Math.trunc((czassekund - godziny * 3600) / 60);
  let sekundy = Math.trunc(czassekund - godziny * 3600 - minuty * 60); 
  return (godziny != 0 ? godziny.toString() + 'h' : '') + (minuty != 0 ? minuty.toString() + 'm' : '') + (sekundy != 0 ? sekundy.toString() + 's' : ''); 
}

Random(min: number, max: number)
  {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }    
  
ZmienDane(stan: number)
{
  let wartosc = this.listaczasyN[stan];
  if (wartosc > 10)
  { wartosc = Math.trunc(this.Random((this.listaczasyN[stan]+this.listaczasyN[stan-1])/2,(this.listaczasyN[stan+1]+this.listaczasyN[stan])/2)); }
  this.czaswykonania = wartosc;
  //console.log(rodzaj, stan, zespol)
}
  
}
