import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, OnInit, ViewChild } from '@angular/core';
import { concat, Subscription } from 'rxjs';
import { AppComponent } from '../app.component';
import { Notatka, Osoby, OsobyPol, Tresc } from '../definicje';
import { FunkcjeWspolneService } from '../funkcje-wspolne.service';
import { NotatkiService } from '../notatki.service';
import { OsobyService } from '../osoby.service';

@Component({
  selector: 'app-notatki',
  templateUrl: './notatki.component.html',
  styleUrls: ['./notatki.component.css']
})
export class NotatkiComponent implements OnInit {

  private osobysubscribe = new Subscription();
  private gosciesubscribe = new Subscription();
  private notatkisubscribe = new Subscription();
  private zakladkadialogusubscribe = new Subscription();
  @ViewChild('scrollViewportOsoby')  VSVDialogOsoby!: CdkVirtualScrollViewport;
  @ViewChild('scrollViewportTytuly')  VSVDialogTytuly!: CdkVirtualScrollViewport;
  private tablicaosoby: Osoby[] = [];
  private tablicagoscie: Osoby[] = [];
  tablicaall: Osoby[] = [];
  tablicanotatki: Notatka[] = [];
  tablicawersje: Notatka[] = [];
  wlasciciel = 0;
  identyfikator = "";
  height1: any;
  width1: any;
  height2: any;
  width2: any;
  height3: any;
  height4: any;

  
  

  constructor(private osoby: OsobyService, private funkcje: FunkcjeWspolneService, private all: AppComponent, private notatki: NotatkiService) 
  { 
    this.height1 = (all.wysokoscNawigacja - 42) + 'px';
    this.width1 = all.szerokoscOsoby + 'px';
    this.height2 = all.wysokoscTematy + 'px';
    this.width2 = (all.szerokoscNawigacja - all.szerokoscOsoby) + 'px';
    this.height3 = all.wysokoscWersje + 'px';
    this.height4 = this.height1;
    this.zakladkadialogusubscribe = funkcje.ZakladkaDialogu$.subscribe
    (
       data =>
       {
          if (data == 6)
         {
          this.Polacz(true);
         }
       }
    )
    this.osobysubscribe = osoby.OdczytajOsoby$.subscribe
    ( data => 
      { 
        this.tablicaall = data;
        
      }
    )
   this.gosciesubscribe = osoby.OdczytajGoscie$.subscribe
    ( data => 
      { 
        this.tablicagoscie = data; 
      }
    )
    this.notatkisubscribe = notatki.OdczytajNotatki$.subscribe
    ( data => 
      { 
        if (data.stan)
        {
          this.tablicanotatki = data.notatki; 
          this.VSVDialogTytuly.checkViewportSize();
          this.funkcje.addLiniaKomunikatuInfo(this.funkcje.getDedal(),data.komunikat);
        }
        else
        {
          this.funkcje.addLiniaKomunikatuInfo(this.funkcje.getDedal(),data.komunikat);
        }
      }
    )


  }

  ngOnInit() {
  }

  ngOnDestroy()
  {
   if(this.osobysubscribe) { this.osobysubscribe.unsubscribe()};   
   if(this.gosciesubscribe) { this.gosciesubscribe.unsubscribe()};  
   if(this.notatkisubscribe) { this.notatkisubscribe.unsubscribe()};  
   if(this.zakladkadialogusubscribe) {this.zakladkadialogusubscribe.unsubscribe()};   
  }

  Polacz(warunek: boolean)
  {
    if (warunek)
    { if (this.tablicagoscie.length > 0) {
                       this.tablicaall = this.tablicaall.concat(this.tablicagoscie);
                       warunek = false;
                       this.VSVDialogOsoby.checkViewportSize(); 
                       this.WybranaOsoba(2);
                      }
    else
    { setTimeout(() => {
                        this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal(),'Czekam na pełne dane osób');
                        this.Polacz(warunek)
                        }, 1000) }
  }
  }

  
  WybranaOsoba(event: any)
  {
    this.tablicanotatki = [];
    this.wlasciciel = event;
    this.notatki.Wczytajnotatki(event);
  }

  WybranyTemat(event: any)
  {
    this.tablicawersje = [];
    this.identyfikator = event;
    this.notatki.WczytajnotatkiTresc(this.wlasciciel, event)
    console.log(event)
  }

  WybranaWersja(event: any)
  {
    console.log(event)
  }

}
