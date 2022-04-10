import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppComponent } from '../app.component';
import { OsobyPol, Polecenia, Modul, Zespol } from '../definicje';
import { FunkcjeWspolneService } from '../funkcje-wspolne.service';
import { ModulyService } from '../moduly.service';
import { ZespolyService } from '../zespoly.service';

@Component({
  selector: 'app-testy',
  templateUrl: './testy.component.html',
  styleUrls: ['./testy.component.css']
})

export class TestyComponent {

    private tablicazawartoscisubscribe = new Subscription();
    private tablicazespolowscisubscribe = new Subscription();
    private zakladkadialogusubscribe = new Subscription();
    @ViewChild('scrollViewportModoly')  VSVDialogModoly!: CdkVirtualScrollViewport;
    @ViewChild('scrollViewportZespoly')  VSVDialogZesply!: CdkVirtualScrollViewport;
    tablicazawartosci: Modul[] = [];  
    tablicazespoly: Zespol[] = [];  
    height: any;
    height1: any;
    width1: any;
    width2: any;
    wybrane: number;
    wybranymodul: Modul;
    wybranyzespol : number;
    wybraneosoby: OsobyPol[] = [];
    
    constructor(private all: AppComponent, private moduly: ModulyService, private funkcje: FunkcjeWspolneService, private changeDetectorRef: ChangeDetectorRef, private zespoly: ZespolyService)
    { 
  
      this.height = (all.wysokoscNawigacja - 42) + 'px';
      this.height1 = '300px';
      this.width1 = all.szerokoscModoly + 'px';
      this.width2 = all.szerokoscNawigacja - all.szerokoscModoly + 'px';
      this.wybrane = 0;
      this.wybranyzespol = 0;
      this.wybraneosoby = [...this.wybraneosoby,{"id":0,"imie":"","nazwisko":"","funkcja":"","dos":false}];
      this.wybranymodul = {"id":0, "nazwa":'', "opis":"", "czasbadania":'',"symbol":'', "stan":0}
      
      this.zakladkadialogusubscribe = funkcje.ZakladkaDialogu$.subscribe
      (
         data =>
         {
          //console.log(this.VSVDialogPolecenia._totalContentHeight)  
             
            if (data == 5)
           {
            //this.tablicazawartosci = polecenia.getPolecenia();
            //this.VSVDialog.setTotalContentSize(1200);
            if ((this.wybranymodul.id == 0)&&(this.tablicazawartosci.length > 0))
            {
            this.VSVDialogModoly.checkViewportSize();
            this.ZmienWybrany(this.tablicazawartosci[0].id,0)            
            }
           }
         }
      )
     
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
              this.VSVDialogZesply.checkViewportSize();
            }
            else
            { this.tablicazespoly = []}
        }
      );   
     
    }
  
    ngOnDestroy()
    {
    if (this.tablicazawartoscisubscribe) {this.tablicazawartoscisubscribe.unsubscribe();}
    if (this.tablicazespolowscisubscribe) {this.tablicazespolowscisubscribe.unsubscribe(); }
    if (this.zakladkadialogusubscribe) {this.zakladkadialogusubscribe.unsubscribe(); }
    }
  
  
    Wybrany(event: any, i: number)
    {
      this.ZmienWybrany(event, i)
    }
  
    ZmienWybrany(modulid: number, i : number)
    {
      this.wybrane = modulid;
      this.wybranymodul = this.tablicazawartosci[i];
      this.zespoly.Wczytajzespol(modulid)
      //this.wybraneosoby = this.wybranymodul.osoby;
    }
  
    WybranyZespol(event: any, i: number)
    {
      this.wybranyzespol = event;
    }
  

    ZmienOsoba(id : number, dos: any)
    {
      //this.polecenia.ZapiszPoleceniaOsoba(id, this.wybranymodul.id, dos)
    }
  
    ZmienOsoby(dos: any)
    {
      //this.polecenia.ZapiszPoleceniaOsoby(this.wybranymodul.id, dos)
    }
  
    ZmienDostep(rodzaj: string, dos: boolean)
    {
      //this.polecenia.ZmienDostep(rodzaj, this.wybranymodul.id, dos)
    }
  
  }
  