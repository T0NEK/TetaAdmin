import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, Inject, LOCALE_ID, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { Wiersze } from './wiersze';

@Injectable({ providedIn: 'root'})


export class KomunikacjaService implements OnDestroy
{
  private czas_rzeczywisty: any;
  private czas_rzeczywisty_id: any;
  private httpURL = 'http://localhost/TetaPhp/Admin/';
  private czas_startu_org: any;
  private czas_startu_new: any;
  private linieDialogu: Wiersze[] = [];
  private wysokosc_nawigacja = 0;
    
  constructor(private http: HttpClient, @Inject(LOCALE_ID) private locate : string) 
  {
    this.taktujCzas();
    this.odczytaj_czas_startu(10);
  }
 
  ngOnDestroy() 
  {
    if (this.czas_rzeczywisty_id) { clearInterval(this.czas_rzeczywisty_id); }
  }


  getCzasRzeczywisty() { return formatDate(this.czas_rzeczywisty, 'yyyy.MM.dd  HH:mm:ss', this.locate) }

  getCzasStartuOrg() { return this.czas_startu_org }
  setCzasStartuNew(czas: string) 
          {
           this.czas_startu_new = czas;
           this.odczytaj_czas_startu(-1);
          }
  getLinieDialogu() { return this.linieDialogu }
  addLinieDialogu(linia: any) 
    {
     //this.linieDialogu.push(linia); 
     this.linieDialogu = [...this.linieDialogu, linia];   
    }
  getWysokoscNawigacji() { return this.wysokosc_nawigacja};
  setWysokoscNawigacji(wysokosc: number) { this.wysokosc_nawigacja = wysokosc};
  
  private czasRzeczywisty = new Subject<any>();
  czasRzeczywisty$ = this.czasRzeczywisty.asObservable();
  taktujCzas() { 
      this.czas_rzeczywisty = Date.now();    
      this.czas_rzeczywisty_id = setInterval(() => { 
      this.czas_rzeczywisty = Date.now();
      this.czasRzeczywisty.next( this.czas_rzeczywisty ) }, 1000); 
      }
    
  private LiniaKomunikatu = new Subject<any>();
  LiniaKomunikatu$ = this.LiniaKomunikatu.asObservable();
  addLiniaKomunikatu(linia: string, kolor: string)
  {
    let wiersz = {'data':this.getCzasRzeczywisty(), 'name': 'dedal', 'kolor': kolor, 'tekst': linia}
    this.addLinieDialogu(wiersz)
    this.LiniaKomunikatu.next(wiersz);
  }

  private PrzelaczZakladka = new Subject<any>();
  PrzelaczZakladka$ = this.PrzelaczZakladka.asObservable()
  changePrzelaczZakladka(numer: number)
  {
    this.PrzelaczZakladka.next(numer)
  }
  
  private GetCzasStartuNew = new Subject<any>();
  GetCzasStartuNew$ = this.GetCzasStartuNew.asObservable()
  changeGetCzasStartuNew(czas: any)
  {
    this.czas_startu_new = czas;
    this.GetCzasStartuNew.next(this.czas_startu_new)
  }


  private OdczytajCzasStartu = new Subject<any>();
  OdczytajCzasStartu$ = this.OdczytajCzasStartu.asObservable()
  private odczytaj_czas_startu(licznik : number)
  {
    if (licznik == 0) 
    {
      this.czas_startu_org = 'ERROR';
      this.changeGetCzasStartuNew(this.czas_startu_org);
      this.OdczytajCzasStartu.next(this.czas_startu_org)
      this.addLiniaKomunikatu('NIE UDAŁO SIĘ ODCZYTAĆ "czas startu Dedala" ','red');
    }
    else
    {
    this.http.get(this.httpURL + 'czas_startu_data.php').subscribe( 
      data =>  {
                this.czas_startu_org = data;
                this.changeGetCzasStartuNew(this.czas_startu_org);
                this.OdczytajCzasStartu.next(this.czas_startu_org);
                this.addLiniaKomunikatu('Odczytano "czas startu Dedala" - ' + this.czas_startu_org ,'')
               },
      error => {
                this.czas_startu_org = 'ponawiam';
                this.changeGetCzasStartuNew(this.czas_startu_org);
                this.OdczytajCzasStartu.next(this.czas_startu_org);
                this.addLiniaKomunikatu('Błąd odczytu "czas startu Dedala" - ponawiam: ' + licznik,'rgb(199, 100, 43)');
                setTimeout(() => {this.odczytaj_czas_startu(--licznik)}, 1000)
               }
               )
    }
  }

}
