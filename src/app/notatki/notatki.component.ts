import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  private trescsubscribe = new Subscription();
  private zakladkadialogusubscribe = new Subscription();
  @ViewChild('scrollViewportOsoby')  VSVDialogOsoby!: CdkVirtualScrollViewport;
  @ViewChild('scrollViewportTytuly')  VSVDialogTytuly!: CdkVirtualScrollViewport;
  @ViewChild('scrollViewportWersje')  VSVDialogWersje!: CdkVirtualScrollViewport;
  @ViewChild('PoleNotatki') PoleNotatki!: ElementRef;
  //private tablicaosoby: Osoby[] = [];
  private tablicagoscie: Osoby[] = [];
  tablicaall: Osoby[] = [];
  tablicanotatki: Notatka[] = [];
  tablicawersje: Tresc[] = [];
  wlasciciel = 0;
  idnotatki = 0;
  wersja = 0;
  tresc = '';
  notatkaEdytowana = "";
  notatkaLenght = {"obecna": 0,"max": 1024}
  stan ="";
  height1: any;  width1: any;
  height2: any;  width2: any;
  height3: any;
  height4: any;
  height5: any;
  
  
  

  constructor(private osoby: OsobyService, private funkcje: FunkcjeWspolneService, private all: AppComponent, private notatki: NotatkiService) 
  { 
    this.height1 = (all.wysokoscNawigacja - 42) + 'px';
    this.height2 = all.wysokoscTematy + 'px';
    this.height3 = all.wysokoscWersje + 'px';
    this.height4 = this.height1;
    this.height5 = (all.wysokoscNawigacja - 42 - all.wysokoscTematy - all.wysokoscWersje - (3 *8) - 80) + 'px';
    this.width1 = all.szerokoscOsoby + 'px';
    this.width2 = (all.szerokoscNawigacja - all.szerokoscOsoby) + 'px';
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
    this.trescsubscribe = notatki.OdczytajNotatkiTresc$.subscribe
    ( data => 
      { 
        if (data.stan)
        {
          this.tablicawersje = data.wersje; 
          this.VSVDialogWersje.checkViewportSize();
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
   if(this.trescsubscribe) { this.trescsubscribe.unsubscribe()};  
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
    this.tablicawersje = [];
    this.PoleNotatki.nativeElement.value = '';
    this.wlasciciel = event;
    this.notatki.Wczytajnotatki(event);
  }

  WybranyTemat(event: any)
  {
    this.tablicawersje = [];
    this.PoleNotatki.nativeElement.value = '';
    this.idnotatki = event;
    this.notatki.WczytajnotatkiTresc(this.wlasciciel, event)
    //console.log(event)
  }

  WybranyStan(event: number)
  {
    console.log(event)
  }

  WybranaWersja(event: number, i: number)
  {
    //console.log(event, '    ', i)
    this.wersja = i;
    this.PoleNotatki.nativeElement.value = this.tablicawersje[i].tresc;
  }

Zmiana()
{

}

}
