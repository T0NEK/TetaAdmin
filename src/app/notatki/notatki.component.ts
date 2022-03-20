import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppComponent } from '../app.component';
import { CzasService } from '../czas.service';
import { Notatka, OsobyNot, Tresc} from '../definicje';
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
  private nowasubscribe = new Subscription();
  private trescsubscribe = new Subscription();
  private trescnewsubscribe = new Subscription();
  private udostsubscribe = new Subscription();
  private standelsubscribe = new Subscription();
  private stanwersubscribe = new Subscription();
  private textareasubscribe = new Subscription();
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
  notatkaEdytowana = false;
  notatkaEdycja = false;
  notatkaLenght = {"obecna": 0, "max": 1024, "orgmax": 1024, "orgtemat": 30}
  //stan ="";
  przycisk: string[] = ['', 'nowa NOTATKA','nowa WERSJA',"EDYTUJ","ZAPISZ","ZAPISZ","ZAPISZ"];
  przyciskStan = 1;  
  blokadazmian = true;
  height1: any;  width1: any;
  height2: any;  width2: any;
  height3: any;
  height4: any;
  height5: any;
  
  
  

  constructor(private osoby: OsobyService, private funkcje: FunkcjeWspolneService, private all: AppComponent, private notatki: NotatkiService, private czasy: CzasService) 
  { 
    this.height1 = (all.wysokoscNawigacja - 42) + 'px';
    this.height2 = all.wysokoscTematy + 'px';
    this.height3 = all.wysokoscWersje + 'px';
    this.height4 = this.height1;
    this.height5 = (all.wysokoscNawigacja - 42 - all.wysokoscTematy - all.wysokoscWersje - (3 *8) - 100) + 'px';
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
          this.funkcje.addLiniaKomunikatuInfo(this.funkcje.getDedal().osoba,data.komunikat);
          this.wersja = -1;
          //this.notatkaEdycja = false;
        }
        else
        {
          this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba,data.komunikat);
        }
        this.blokadazmian = true;  
      }
    )
    this.nowasubscribe = notatki.NowaNotatka$.subscribe
    ( data => 
      { 
        console.log(data)
        if (data.wynik)
        {
          this.funkcje.addLiniaKomunikatuInfo(this.funkcje.getDedal().osoba,data.komunikat);
          this.WybranaOsoba(data.stan);
        }
        else
        {
          this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba,data.komunikat);
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
          this.funkcje.addLiniaKomunikatuInfo(this.funkcje.getDedal().osoba,data.komunikat);
          this.blokadazmian = true;  
          //this.wersja = 0;
          //this.WybranaWersja(this.wersja);
          //this.notatkaEdycja = true;
        }
        else
        {
          this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba,data.komunikat);
          //this.notatkaEdycja = false;
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
          this.funkcje.addLiniaKomunikatuInfo(this.funkcje.getDedal().osoba,data.komunikat);
        }
        else
        {
          this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba,data.komunikat);
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
          this.funkcje.addLiniaKomunikatuInfo(this.funkcje.getDedal().osoba,data.komunikat);
        }
        else
        {
          this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba,data.komunikat);
        }
        this.blokadazmian = true;  
      }
    )
    this.standelsubscribe = notatki.ZmienStanWersja$.subscribe
    ( data => 
      { 
        if (data.wynik)
        {
          this.tablicawersje[data.idtablica].stan = data.stan;
          this.tablicawersje[data.idtablica].stanText = data.stanText
          this.VSVDialogWersje.checkViewportSize();
          this.funkcje.addLiniaKomunikatuInfo(this.funkcje.getDedal().osoba,data.komunikat);
        }
        else
        {
          this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba,data.komunikat);
        }
        this.blokadazmian = true;  
      }
    )
    this.trescnewsubscribe = notatki.ZmienTrescWersja$.subscribe
    ( data => 
      { 
        if (data.wynik)
        {
          this.tablicawersje[data.idtablica].tresc = data.tresc;
          this.VSVDialogWersje.checkViewportSize();
          this.funkcje.addLiniaKomunikatuInfo(this.funkcje.getDedal().osoba,data.komunikat);
          this.blokadazmian = true;
          this.PoleNotatki.nativeElement.value = this.tablicawersje[data.idtablica].tresc;
          this.Zmiana(false)
        }
        else
        {
          this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba,data.komunikat);
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
   if(this.nowasubscribe) { this.nowasubscribe.unsubscribe()};  
   if(this.trescsubscribe) { this.trescsubscribe.unsubscribe()};  
   if(this.trescnewsubscribe) { this.trescsubscribe.unsubscribe()};  
   if(this.udostsubscribe) { this.udostsubscribe.unsubscribe()};  
   if(this.standelsubscribe) { this.standelsubscribe.unsubscribe()};  
   if(this.stanwersubscribe) { this.stanwersubscribe.unsubscribe()};  
   if(this.textareasubscribe) { this.textareasubscribe.unsubscribe()};  
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
                        this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba,'Czekam na pełne dane osób');
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
      this.tablicawersje = [];
      this.Zmiana(true)
      this.PrzepiszUdo([])
      this.idnotatki = 0;
      this.wlasciciel = event;
      this.notatki.Wczytajnotatki(event);
      this.przyciskStan = 1;

    }
  }

  
  Udostepnienie(event: any )
{
  if (this.blokadazmian)
  {
    this.blokadazmian = false;  
    this.notatki.ZmienUdoNotatki(this.idnotatki, event.id, event.udost.autor, this.wlasciciel)
  }
}


  WybranyTemat(event: any)
  {
    if (this.blokadazmian)
    {
    this.blokadazmian = false;
    this.notatkaEdycja = false;
    this.tablicawersje = [];
    this.Zmiana(true)
    this.idnotatki = event;
    this.notatki.WczytajnotatkiTresc(this.wlasciciel, event);
    this.notatki.WczytajUdoNotatki(event);
    this.przyciskStan = 2
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

  WybranyStanWersja(event: number, i: number)
  {
    if (this.blokadazmian)
    {
    //console.log("event", event)
    //console.log("i ", i)
    this.blokadazmian = false;
    this.notatki.SetStanWersja("setstan", event, i)
    }
  }
  
  WybranaWersja(i: number)
  {
    //console.log('       ', i)
    if (this.wersja != (this.tablicawersje.length - 1 - i))
    {
    if (this.blokadazmian)
    {
      this.wersja = this.tablicawersje.length - 1 - i;
      this.PoleNotatki.nativeElement.value = this.tablicawersje[i].tresc;
      this.notatkaEdycja = false;
      this.Zmiana(false)
      this.przyciskStan = 3;
    }
  }
  }


Zmiana(clear: boolean)
{
  if (clear)
  { 
    this.PoleNotatki.nativeElement.value = '';
    this.wersja = -1;
    this.notatkaLenght.max = this.notatkaLenght.orgmax;
    this.notatkaEdycja = false;
  }
  this.notatkaLenght.obecna = this.PoleNotatki.nativeElement.value.length;
  if (this.wersja > -1)
  {
  this.notatkaEdytowana = (this.PoleNotatki.nativeElement.value != this.tablicawersje[this.tablicawersje.length - 1 - this.wersja].tresc ? true : false);
  }
  else
  {
  this.notatkaEdytowana = (this.PoleNotatki.nativeElement.value != '' ? true : false);
  }
}

Zapisz(polecenie: number)
{
  //console.log("polecenie:", polecenie)
  //console.log("set", this.tablicawersje[this.tablicawersje.length - 1 - this.wersja].id, this.tablicawersje.length - 1 - this.wersja, this.PoleNotatki.nativeElement.value)

  switch (polecenie) {
    case 1: //nowa notatka - TYTUL
            this.przyciskStan = 5;
            this.notatkaLenght.max = this.notatkaLenght.orgtemat;
            this.notatkaEdycja = true;
            this.PoleNotatki.nativeElement.focus();
      break;
    case 2: //NOWA WERSJa
            this.notatkaEdycja = false;
            this.notatki.ZapiszNowa('setwer', this.wlasciciel, "", this.czasy.getCzasDedala(), this.idnotatki, this.tablicawersje.length)
      break;
    case 3: this.notatkaEdycja = true;
            this.przyciskStan = 4;
            this.PoleNotatki.nativeElement.focus();
      break;
    case 4: this.notatki.ZapiszWersja("set", this.tablicawersje[this.tablicawersje.length - 1 - this.wersja].id, this.tablicawersje.length - 1 - this.wersja, this.PoleNotatki.nativeElement.value)
            this.notatkaEdycja = false;
            this.przyciskStan = 3;
      break;
    case 5: //ZAPIS NOWA NOTATKA
            this.notatki.ZapiszNowa('setnowa', this.wlasciciel, this.PoleNotatki.nativeElement.value, this.czasy.getCzasDedala(), 0, 0)
      break
  }  
}

}
