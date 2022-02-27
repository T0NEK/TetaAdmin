import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppComponent } from '../app.component';
import { OsobyPol, Polecenia, Wiersze } from '../definicje';
import { FunkcjeWspolneService } from '../funkcje-wspolne.service';
import { PoleceniaService } from '../polecenia.service';

@Component({
  selector: 'app-polecenia',
  templateUrl: './polecenia.component.html',
  styleUrls: ['./polecenia.component.css']
})
export class PoleceniaComponent implements OnDestroy {

  private tablicazawartoscisubscribe = new Subscription();
  private zakladkadialogusubscribe = new Subscription();
  @ViewChild('scrollViewportPolecenia')  VSVDialogPolecenia!: CdkVirtualScrollViewport;
  tablicazawartosci: Polecenia[] = [];  
  height: any;
  width1: any;
  width2: any;
  wybrane: string;
  wybranepolecenie: Polecenia;
  wybraneosoby: OsobyPol[] = [];
  
  constructor(private all: AppComponent, private polecenia: PoleceniaService, private funkcje: FunkcjeWspolneService, private changeDetectorRef: ChangeDetectorRef)
  { 

    this.height = (all.wysokoscNawigacja - 42) + 'px';
    this.width1 = all.szerokoscPolecenia + 'px';
    this.width2 = all.szerokoscNawigacja - all.szerokoscPolecenia + 'px';
    this.wybrane = '';
    this.wybraneosoby = [...this.wybraneosoby,{"id":0,"imie":"","nazwisko":"","funkcja":"","dos":false}];
    this.wybranepolecenie = {"czas":0,"dzialania":"","id":0,"komunikat":"","nazwa":"","nazwaOrg":"","podstawowe":false,"polecenie":0,"wylogowany":false,"zalogowany":false,"osoby": this.wybraneosoby}
    this.zakladkadialogusubscribe = funkcje.ZakladkaDialogu$.subscribe
    (
       data =>
       {
        //console.log(this.VSVDialogPolecenia._totalContentHeight)  
           
          if (data == 7)
         {
          //this.tablicazawartosci = polecenia.getPolecenia();
          //this.VSVDialog.setTotalContentSize(1200);
          if (this.wybranepolecenie.id == 0)
          {
          this.VSVDialogPolecenia.checkViewportSize();
          this.ZmienWybrany('pomoc')            
          }
         }
       }
    )
   
    this.tablicazawartoscisubscribe = polecenia.OdczytajPolecenia$.subscribe
    ( data => 
      { 
          this.tablicazawartosci = data; 
      }
    );   
   
  }

  ngOnDestroy()
  {
  this.tablicazawartoscisubscribe.unsubscribe();
  this.zakladkadialogusubscribe.unsubscribe();   
  }


  Wybrany(event: any)
  {
    this.ZmienWybrany(event.target.innerText)
  }

  ZmienWybrany(polecenie: string)
  {
    this.wybrane = polecenie;
    this.wybranepolecenie = this.polecenia.ZnajdzPolecenie(this.wybrane)
    this.wybraneosoby = this.wybranepolecenie.osoby;
  }


  ZmienOsoba(id : number, dos: any)
  {
    this.polecenia.ZapiszPoleceniaOsoba(id, this.wybranepolecenie.id, dos)
  }

  ZmienOsoby(dos: any)
  {
    this.polecenia.ZapiszPoleceniaOsoby(this.wybranepolecenie.id, dos)
  }

  ZmienDostep(rodzaj: string, dos: boolean)
  {
    this.polecenia.ZmienDostep(rodzaj, this.wybranepolecenie.id, dos)
  }

}
