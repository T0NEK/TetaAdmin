import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, OnInit, ViewChild } from '@angular/core';
import { concat, Subscription } from 'rxjs';
import { AppComponent } from '../app.component';
import { Osoby, OsobyPol } from '../definicje';
import { FunkcjeWspolneService } from '../funkcje-wspolne.service';
import { OsobyService } from '../osoby.service';

@Component({
  selector: 'app-notatki',
  templateUrl: './notatki.component.html',
  styleUrls: ['./notatki.component.css']
})
export class NotatkiComponent implements OnInit {

  private osobysubscribe = new Subscription();
  private gosciesubscribe = new Subscription();
  private zakladkadialogusubscribe = new Subscription();
  @ViewChild('scrollViewportOsoby')  VSVDialogOsoby!: CdkVirtualScrollViewport;
  private tablicaosoby: Osoby[] = [];
  private tablicagoscie: Osoby[] = [];
  tablicall: Osoby[] = [];
  height: any;
  width1: any;


  constructor(private osoby: OsobyService, private funkcje: FunkcjeWspolneService, private all: AppComponent) 
  { 
    this.height = (all.wysokoscNawigacja - 42) + 'px';
    this.width1 = all.szerokoscOsoby + 'px';
    this.zakladkadialogusubscribe = funkcje.ZakladkaDialogu$.subscribe
    (
       data =>
       {
        //console.log(this.VSVDialogPolecenia._totalContentHeight)  
          if (data == 6)
         {
          //this.tablicazawartosci = polecenia.getPolecenia();
          //this.VSVDialog.setTotalContentSize(1200);
          this.Polacz(true);
         }
       }
    )
    this.osobysubscribe = osoby.OdczytajOsoby$.subscribe
    ( data => 
      { 
        this.tablicall = data;
        
      }
    )
   this.gosciesubscribe = osoby.OdczytajGoscie$.subscribe
    ( data => 
      { 
        this.tablicagoscie = data; 
      }
    )
  }

  ngOnInit() {
  }

  ngOnDestroy()
  {
   if(this.osobysubscribe) { this.osobysubscribe.unsubscribe()};   
   if(this.gosciesubscribe) { this.gosciesubscribe.unsubscribe()};  
   if(this.zakladkadialogusubscribe) {this.zakladkadialogusubscribe.unsubscribe()};   
  }

  Polacz(warunek: boolean)
  {
    if (warunek)
    { if (this.tablicagoscie.length > 0) {
                       this.tablicall = this.tablicall.concat(this.tablicagoscie);
                       warunek = false;
                       this.VSVDialogOsoby.checkViewportSize(); }
    else
    { setTimeout(() => {
                        this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal(),'Czekam na pełne dane osób');
                        this.Polacz(warunek)
                        }, 1000) }
  }
  }

  Wybrany(event: any)
  {
console.log(event)
  }
}
