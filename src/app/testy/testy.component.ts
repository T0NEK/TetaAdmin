import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppComponent } from '../app.component';
import { OsobyPol, Polecenia, Modul, Zespol } from '../definicje';
import { FunkcjeWspolneService } from '../funkcje-wspolne.service';
import { ModulyService } from '../moduly.service';
import { UszkodzeniaService } from '../uszkodzenia.service';
import { ZespolyService } from '../zespoly.service';

@Component({
  selector: 'app-testy',
  templateUrl: './testy.component.html',
  styleUrls: ['./testy.component.css']
})

export class TestyComponent {

    private tablicazawartoscisubscribe = new Subscription();
    private tablicazespolowscisubscribe = new Subscription();
    private tablicauszkodzeniascisubscribe = new Subscription();
    private zakladkadialogusubscribe = new Subscription();
    private listasubscribe = new Subscription();
    private stanysubscribe = new Subscription();
    @ViewChild('scrollViewportModoly')  VSVDialogModoly!: CdkVirtualScrollViewport;
    @ViewChild('scrollViewportZespoly')  VSVDialogZesply!: CdkVirtualScrollViewport;
    @ViewChild('scrollViewportUszkodzenia')  VSVDialogUszkodzenia!: CdkVirtualScrollViewport;
    tablicazawartosci: Modul[] = [];  
    tablicazespoly: Zespol[] = [];  
    tablicauszkodzenia: any[] = [];  
    listauszkodzenia: any[] = [];
    listastan: any[] = [];
    height: any;
    height1: any;
    height2: any;
    width1: any;
    width2: any;
    //wybrane: number;
    //wybranymodul: Modul;
    wybranymodul: number;
    wybranyzespol : number;
    
    constructor(private all: AppComponent, private moduly: ModulyService, private funkcje: FunkcjeWspolneService, private changeDetectorRef: ChangeDetectorRef, private zespoly: ZespolyService, private uszkodzenia: UszkodzeniaService)
    { 
  
      this.height = (all.wysokoscNawigacja - 42) + 'px';
      this.height1 = '300px';
      this.height2 = '200px';
      this.width1 = all.szerokoscModoly + 'px';
      this.width2 = all.szerokoscNawigacja - all.szerokoscModoly + 'px';
      //this.wybrane = 0;
      this.wybranymodul = 0;
      this.wybranyzespol = 0;
      //this.wybranymodul = {"id":0, "nazwa":'', "opis":"", "czasbadania":'',"symbol":'', "stan":0}
      
      this.zakladkadialogusubscribe = funkcje.ZakladkaDialogu$.subscribe
      (
         data =>
         {
          //console.log(this.VSVDialogPolecenia._totalContentHeight)  
             
           if (data == 5)
           {
            if (this.tablicazawartosci.length > 0)
            {
                this.VSVDialogModoly.checkViewportSize();
                this.ZmienWybrany(this.tablicazawartosci[this.wybranymodul].id, this.wybranymodul) 
                this.WybranyZespol(this.tablicazespoly[this.wybranyzespol].id, this.wybranyzespol)           
            }
            uszkodzenia.WczytajListy('uszkodzenia')
            uszkodzenia.WczytajListy('stan')
           }
         }
      )

      this.stanysubscribe = uszkodzenia.OdczytajStan$.subscribe
      ( data => 
        { 
          if (data.stan)
          { 
            //console.log( this.wybrane)
            //console.log( this.tablicazawartosci[this.wybrane].id)
            this.ZmienWybrany(this.tablicazawartosci[this.wybranymodul].id, this.wybranymodul) 
            this.WybranyZespol(this.tablicazespoly[this.wybranyzespol].id, this.wybranyzespol)           
          }  
        }
      );   
     
      this.tablicazawartoscisubscribe = moduly.OdczytajModuly$.subscribe
      ( data => 
        { 
            this.tablicazawartosci = data; 
        }
      );   

      this.tablicazespolowscisubscribe = zespoly.OdczytajZespoly$.subscribe
      ( data => 
        { 
            if (data.stan)
            { 
              this.tablicazespoly = data.zespoly; 
              this.tablicauszkodzenia = [];
              this.VSVDialogZesply.checkViewportSize();
            }
            else
            { this.tablicazespoly = []}
        }
      );   
     
      this.tablicazespolowscisubscribe = uszkodzenia.OdczytajUszkodzenia$.subscribe
      ( data => 
        { 
            if (data.stan)
            { 
              this.tablicauszkodzenia = data.uszkodzenia; 
              this.VSVDialogUszkodzenia.checkViewportSize();
            }
            else
            { this.tablicauszkodzenia = []}
        }
      );   

      this.listasubscribe = uszkodzenia.OdczytajListy$.subscribe
      ( data => 
        { 
            if (data.stan)
            { 
              switch (data.rodzaj) {
                case 'uszkodzenia': this.listauszkodzenia = data.lista; break;
                case 'stan': this.listastan = data.lista; break;
              }
            }
            else
            {
            switch (data.rodzaj) {
              case 'uszkodzenia': this.listauszkodzenia = []; break;
              case 'stan': this.listastan = []; break;
              }
            }  

        }
      );   

    }
  
    ngOnDestroy()
    {
    if (this.tablicazawartoscisubscribe) {this.tablicazawartoscisubscribe.unsubscribe();}
    if (this.tablicazespolowscisubscribe) {this.tablicazespolowscisubscribe.unsubscribe(); }
    if (this.tablicauszkodzeniascisubscribe) {this.tablicauszkodzeniascisubscribe.unsubscribe(); }
    if (this.zakladkadialogusubscribe) {this.zakladkadialogusubscribe.unsubscribe(); }
    if (this.listasubscribe) {this.listasubscribe.unsubscribe(); }
    if (this.stanysubscribe) {this.stanysubscribe.unsubscribe(); }
    }
  
ModulWybrany(id: number)
{
  return ( this.tablicazawartosci.length > 0 ? id == this.tablicazawartosci[this.wybranymodul].id : 0)
}
Nazwa()
{
  return ( this.tablicazawartosci.length > 0 ? this.tablicazawartosci[this.wybranymodul].nazwa : '')
}

Symbol()
{
  return (this.tablicazawartosci.length > 0 ? this.tablicazawartosci[this.wybranymodul].symbol : '')
}


Wybrany(event: any, i: number)
    {
      this.ZmienWybrany(event, i)
    }
  
ZmienWybrany(modulid: number, i : number)
    {
      //this.wybrane = modulid;
      this.wybranymodul = i;
      this.zespoly.Wczytajzespol(modulid)
      //this.wybraneosoby = this.wybranymodul.osoby;
    }
  
WybranyZespol(zespol: any, i: number)
    {
      this.wybranyzespol = i;
      this.uszkodzenia.WczytajUszkodzenia(this.tablicazespoly[this.wybranyzespol].id, zespol)
      //console.log(this.wybrane, zespol)
    }
  
ZmienStan(rodzaj: string, stan: number, uszkodzenie: number)
{
  this.uszkodzenia.ZapiszStan(rodzaj,this.tablicazawartosci[this.wybranymodul].id, this.tablicazespoly[this.wybranyzespol].id, stan, uszkodzenie)
  console.log(stan, uszkodzenie)
}
     
  }
  