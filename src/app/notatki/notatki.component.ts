import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { concat, Subscription } from 'rxjs';
import { AppComponent } from '../app.component';
import { Notatka, Osoby, OsobyNot, OsobyPol, Tresc, Udostepnienie } from '../definicje';
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
  private udostsubscribe = new Subscription();
  private standelsubscribe = new Subscription();
  private zakladkadialogusubscribe = new Subscription();
  @ViewChild('scrollViewportOsoby')  VSVDialogOsoby!: CdkVirtualScrollViewport;
  @ViewChild('scrollViewportTytuly')  VSVDialogTytuly!: CdkVirtualScrollViewport;
  @ViewChild('scrollViewportWersje')  VSVDialogWersje!: CdkVirtualScrollViewport;
  @ViewChild('PoleNotatki') PoleNotatki!: ElementRef;
  //private tablicaosoby: Osoby[] = [];
  private tablicagoscie: OsobyNot[] = [];
  tablicaall: OsobyNot[] = [];
  polaczenie: boolean;
  tablicanotatki: Notatka[] = [];
  tablicawersje: Tresc[] = [];
  wlasciciel = 0;
  idnotatki = 0;
  wersja = 0;
  tresc = '';
  notatkaEdytowana = "";
  notatkaLenght = {"obecna": 0,"max": 1024}
  stan ="";
  blokadazmian = true;
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
    this.polaczenie = true
    this.zakladkadialogusubscribe = funkcje.ZakladkaDialogu$.subscribe
    (
       data =>
       {
          if ((data == 6) && (this.polaczenie))
         {
          this.Polacz();
         }
       }
    )
    this.osobysubscribe = osoby.OdczytajOsoby$.subscribe
    ( data => 
      { 
        for (let index = 0; index < data.length; index++) 
        {
          this.tablicaall = [...this.tablicaall,{
                          "id": data[index].id ,
                          "imie": data[index].imie, 
                          "nazwisko": data[index].nazwisko, 
                          "funkcja": data[index].funkcja, 
                          "udost": [{"idosoby": 0, "idudo": 0, "czas": "", "stanudo": "","autor": 0}]
                        }]          
        }        
      }
    )
   this.gosciesubscribe = osoby.OdczytajGoscie$.subscribe
    ( data => 
      { 
        for (let index = 0; index < data.length; index++) 
        {
          this.tablicagoscie = [...this.tablicagoscie,{
                          "id": data[index].id ,
                          "imie": data[index].imie, 
                          "nazwisko": data[index].nazwisko, 
                          "funkcja": data[index].funkcja, 
                          "udost": [{"idosoby": 0, "idudo": 0, "czas": "", "stanudo": "", "autor": 0}]
                        }]          
        }
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
          this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal(),data.komunikat);
        }
        this.blokadazmian = true;  
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
          this.wersja = 0;
          this.PoleNotatki.nativeElement.value = this.tablicawersje[0].tresc;  
        }
        else
        {
          this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal(),data.komunikat);
        }
        this.blokadazmian = true;  
      }
    )
    this.udostsubscribe = notatki.OdczytajUdoNotatki$.subscribe
    ( data => 
      { 
        if (data.stan)
        {
          this.PrzepiszUdo(data.udost)
          this.VSVDialogWersje.checkViewportSize();
          this.funkcje.addLiniaKomunikatuInfo(this.funkcje.getDedal(),data.komunikat);
        }
        else
        {
          this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal(),data.komunikat);
        }
        this.blokadazmian = true;  
      }
    )
    this.standelsubscribe = notatki.ZmienStanNotatki$.subscribe
    ( data => 
      { 
        if (data.wynik)
        {
          switch (data.kierunek) {
            case 'setdel':  this.tablicanotatki[data.idtablica].stan = data.stan;
                            this.tablicanotatki[data.idtablica].stanText = data.stanText;
              break;
            case 'setstan': this.tablicanotatki[data.idtablica].blokadastan = data.stan;
              break;  
            case 'setudo': this.tablicanotatki[data.idtablica].blokadaudo = data.stan;
              break;  
        }
          this.VSVDialogWersje.checkViewportSize();
          this.funkcje.addLiniaKomunikatuInfo(this.funkcje.getDedal(),data.komunikat);
        }
        else
        {
          this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal(),data.komunikat);
        }
        this.blokadazmian = true;  
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
   if(this.udostsubscribe) { this.udostsubscribe.unsubscribe()};  
   if(this.standelsubscribe) { this.standelsubscribe.unsubscribe()};  
   if(this.zakladkadialogusubscribe) {this.zakladkadialogusubscribe.unsubscribe()};   
  }

PrzepiszUdo(data: any):boolean
{
  if (data.length == 0)
  {
    for (let index = 0; index < this.tablicaall.length; index++) {
         this.tablicaall[index].udost = [];
    }
  }
  else
  {
  for (let index = 0; index < data.length; index++) {
    for (let index1 = 0; index1 < this.tablicaall.length; index1++) {
      if (this.tablicaall[index1].id == data[index].idosoby)
      { this.tablicaall[index1].udost = data[index];
        break;
      }
    }
  }
  }
  return true;  
}

  Polacz()
  {
    if (this.polaczenie)
    { if (this.tablicagoscie.length > 0) {
                       this.tablicaall = this.tablicaall.concat(this.tablicagoscie);
                       this.polaczenie = false;
                       this.VSVDialogOsoby.checkViewportSize(); 
                       this.WybranaOsoba(2);
                      }
    else
    { setTimeout(() => {
                        this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal(),'Czekam na pełne dane osób');
                        this.Polacz()
                        }, 1000) }
  }
  }

  
  WybranaOsoba(event: any)
  {
    if (this.blokadazmian)
    {
      this.blokadazmian = false;  
      this.tablicanotatki = [];
      this.PrzepiszUdo([])
      this.idnotatki = 0;
      this.tablicawersje = [];
      this.PoleNotatki.nativeElement.value = '';
      this.wlasciciel = event;
      this.notatki.Wczytajnotatki(event);
    }
  }

  WybranyTemat(event: any)
  {
    if (this.blokadazmian)
    {
    this.blokadazmian = false;
    //console.log(event)
    this.tablicawersje = [];
    this.wersja = 0;
    this.PoleNotatki.nativeElement.value = '';
    this.idnotatki = event;
    this.notatki.WczytajnotatkiTresc(this.wlasciciel, event)
    this.notatki.WczytajUdoNotatki(event)
    //console.log(event)
    }
  }

  WybranyStan(stan: string, event: number, i: number)
  {
    if (this.blokadazmian)
    {
      this.blokadazmian = false;
      this.notatki.SetStanNotatki("set" + stan, event, i)
    }
  }

  
  WybranaWersja(i: number)
  {
    //console.log('       ', i)
    if (this.blokadazmian)
    {
      this.wersja = i;
      this.PoleNotatki.nativeElement.value = this.tablicawersje[i].tresc;
    }
  }

Zmiana()
{
  if (this.blokadazmian)
  {
    this.blokadazmian = false;  
    
  }
}

}
