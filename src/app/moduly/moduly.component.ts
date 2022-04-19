import { CdkFixedSizeVirtualScroll, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppComponent } from '../app.component';
import { OsobyPol, Polecenia, Modul, Zespol } from '../definicje';
import { FunkcjeWspolneService } from '../funkcje-wspolne.service';
import { ModulyService } from '../moduly.service';
import { UszkodzeniaService } from '../uszkodzenia.service';
import { ZespolyService } from '../zespoly.service';

@Component({
  selector: 'app-moduly',
  templateUrl: './moduly.component.html',
  styleUrls: ['./moduly.component.css']
})
export class ModulyComponent 
 {

    private osobysubscribe = new Subscription();

    private tablicazawartoscisubscribe = new Subscription();
    private tablicazespolowscisubscribe = new Subscription();
    private tablicauszkodzeniascisubscribe = new Subscription();
    private zakladkadialogusubscribe = new Subscription();
    private listasubscribe = new Subscription();
    private stanysubscribe = new Subscription();
    private danesubscribe = new Subscription();
    @ViewChild('scrollViewportModoly')  VSVDialogModoly!: CdkVirtualScrollViewport;
    @ViewChild('scrollViewportZespoly')  VSVDialogZesply!: CdkVirtualScrollViewport;
    @ViewChild('scrollViewportUszkodzenia')  VSVDialogUszkodzenia!: CdkVirtualScrollViewport;
    tablicazawartosci: Modul[] = [];  
    tablicazespoly: Zespol[] = [];  
    tablicauszkodzenia: any[] = [];  
    listauszkodzenia: any[] = [];
    listastan: any[] = [];
    listaczasy: number[] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,70,80,90,100,120,140,160,180,200,240,280,320]
    listaczasyN: number[] = [1,	2,	3,	4,	5,	6,	7,	8,	9,	10,	15,	20,	25,	30,	35,	40,	45,	50,	55,	60,	120,	180,	240,	300,	360,	420,	480,	540,	600,	900,	1200,	1500,	1800,	2100,	2400,	2700,	3000,	3300,	3600,	5400,	7200,	9000,	10800,	12600,	14400,	16200,	18000,	19800,	21600, 23400];
    listaczasyT: string[] = ['1 s',	'2 s',	'3 s',	'4 s',	'5 s',	'6 s',	'7 s',	'8 s',	'9 s',	'10 s',	'15 s',	'20 s',	'25 s',	'30 s',	'35 s',	'40 s',	'45 s',	'50 s',	'55 s',	'60 s',	'2 m',	'3 m',	'4 m',	'5 m',	'6 m',	'7 m',	'8 m',	'9 m',	'10 m',	'15 m',	'20 m',	'25 m',	'30 m',	'35 m',	'40 m',	'45 m',	'50 m',	'55 m',	'60 m',	'1.5 h',	'2 h',	'2.5 h',	'3 h',	'3.5 h',	'4 h',	'4.5 h',	'5 h',	'5.5 h',	'6 h'];

    height: any;
    height1: any;
    height2: any;
    width1: any;
    width2: any;
    //wybrane: number;
    //wybranymodul: Modul;
    wybranymodul: number;
    wybranyzespol : number;
    tablicaosoby: any[] = [];
    
    constructor(private all: AppComponent, private moduly: ModulyService, private funkcje: FunkcjeWspolneService, private changeDetectorRef: ChangeDetectorRef, private zespoly: ZespolyService, private uszkodzenia: UszkodzeniaService)
    { 
  
      this.height = (all.wysokoscNawigacja - 42) + 'px';
      this.height1 = '300px';
      this.height2 = (all.wysokoscNawigacja - 42 - 400-50 - 70 - 50) + 'px';
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
             
           if (data == 10)
           {
            if (this.tablicazawartosci.length > 0)
            {
                this.VSVDialogModoly.checkViewportSize();
                this.ZmienWybrany(this.tablicazawartosci[this.wybranymodul].id, this.wybranymodul) 
                if (this.tablicazespoly.length > 0)
                {
                //this.WybranyZespol(this.wybranyzespol)           
                }
            }
            uszkodzenia.WczytajListy('uszkodzenia')
            uszkodzenia.WczytajListy('stan')
           }
         }
      )

      this.osobysubscribe = moduly.OdczytajModulyUprawnienia$.subscribe
      ( data => 
        { 
          //console.log(data)
          this.tablicaosoby = data;   
        } 
      )

     
      this.tablicazawartoscisubscribe = moduly.OdczytajModuly$.subscribe
      ( data => 
        { 
            this.tablicazawartosci = data; 
            this.ZmienWybrany(this.tablicazawartosci[this.wybranymodul].id, this.wybranymodul) 
        }
      );   

     
     
     
     
     

    }
  
    ngOnDestroy()
    {
    if(this.osobysubscribe) { this.osobysubscribe.unsubscribe()}   

    if (this.tablicazawartoscisubscribe) {this.tablicazawartoscisubscribe.unsubscribe();}
    if (this.tablicazespolowscisubscribe) {this.tablicazespolowscisubscribe.unsubscribe(); }
    if (this.tablicauszkodzeniascisubscribe) {this.tablicauszkodzeniascisubscribe.unsubscribe(); }
    if (this.zakladkadialogusubscribe) {this.zakladkadialogusubscribe.unsubscribe(); }
    if (this.listasubscribe) {this.listasubscribe.unsubscribe(); }
    if (this.stanysubscribe) {this.stanysubscribe.unsubscribe(); }
    if (this.danesubscribe) {this.danesubscribe.unsubscribe(); }
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

  
ZmienWybrany(modulid: number, i : number)
    {
      //this.wybrane = modulid;
      this.wybranymodul = i;
      this.moduly.WczytajmodulyUprawnienia(modulid)
      //this.zespoly.Wczytajzespol(modulid)
      //this.wybraneosoby = this.wybranymodul.osoby;
    }
  
WybranyZespol(i: number)
    {
      this.wybranyzespol = i;
      this.uszkodzenia.WczytajUszkodzenia(this.tablicazawartosci[this.wybranymodul].id, this.tablicazespoly[i].id)
      //console.log(this.wybrane, zespol)
    }
 


ZmienStan(rodzaj: string, stan: number, uszkodzenie: number)
{
  this.uszkodzenia.ZapiszStan(rodzaj,this.tablicazawartosci[this.wybranymodul].id, this.tablicazespoly[this.wybranyzespol].id, stan, uszkodzenie)
  //console.log(rodzaj,this.tablicazawartosci[this.wybranymodul].id, this.tablicazespoly[this.wybranyzespol].id, stan, uszkodzenie)
}

Random(min: number, max: number)
  {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }    


  
ZmienDane(rodzaj: string, stan: number, zespol: number)
{
  let wartosc = this.listaczasyN[stan];
  if (wartosc > 10)
  { wartosc = Math.trunc(this.Random((this.listaczasyN[stan]+this.listaczasyN[stan-1])/2,(this.listaczasyN[stan+1]+this.listaczasyN[stan])/2)); }
  this.zespoly.ZapiszDane(rodzaj, zespol, wartosc)
  //console.log(rodzaj, stan, zespol)
}

FormatCzas(czassekund: number):string
{
  let godziny = Math.trunc(czassekund / 3600);
  let minuty = Math.trunc((czassekund - godziny * 3600) / 60);
  let sekundy = Math.trunc(czassekund - godziny * 3600 - minuty * 60); 
  return (godziny != 0 ? godziny.toString() + 'h' : '') + (minuty != 0 ? minuty.toString() + 'm' : '') + (sekundy != 0 ? sekundy.toString() + 's' : ''); 
}



ZmienOsoba(id : number, dos: any)
  {
    this.moduly.ZmienmodulyUprawnienia(this.tablicazawartosci[this.wybranymodul].id, id, dos)
  }

ZmienOsoby(dos: any)
  {
    //console.log(this.tablicazawartosci[this.wybranymodul].id, 0, dos)
    this.moduly.ZmienmodulyUprawnienia(this.tablicazawartosci[this.wybranymodul].id, 0, dos)
  }

  
  }
  