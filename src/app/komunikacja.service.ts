import { formatDate } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, Inject, LOCALE_ID, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { Wiersze } from './wiersze';
import * as _moment from 'moment';

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
  private czas_startu_akcji: any;
    
  constructor(private http: HttpClient, @Inject(LOCALE_ID) private locate : string) 
  {
    this.taktujCzas();
    this.odczytaj_czas_startu(10);
    this.odczytaj_czas_poczatku_akcji(10);
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
    this.http.get(this.httpURL + 'get_data_startu.php').subscribe( 
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

  //private ZapiszDataStartu = new Subject<any>();
  //ZapiszDataStartu$ = this.ZapiszDataStartu.asObservable()
  zapisz_data_startu(licznik : number, yy: string, mm: string, dd: string, hh: string, mi: string, ss: string )
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin':'*',
        'content-type': 'application/json',
        Authorization: 'my-auth-token'
      })
    };
    
    var data = JSON.stringify({ "yy": yy, "mm": mm, "dd": dd, "hh": hh, "mi": mi, "ss": ss })  

   if (licznik == 0) 
    { this.addLiniaKomunikatu('NIE UDAŁO SIĘ ZAPISAĆ "Nowa data startu Dedala" ','red'); }
    else
    {
    this.http.post(this.httpURL + 'set_data_startu.php', data, httpOptions).subscribe( 
      data =>  {
                 let czasD = _moment(yy + ':' + mm + ':' + dd, 'YYYY.MM.DD');
                 let czasT = _moment(hh + ':' + mi + ':' + ss, 'HH:mm:ss');
                 let czas = czasD.format('YYYY.MM.DD ') + ' ' + czasT.format('HH:mm:ss')
                 this.changeGetCzasStartuNew( czas);
                 this.addLiniaKomunikatu('Zapisano "nowa data startu Dedala" - ' + this.czas_startu_new ,'') 
               },
      error => { 
                this.addLiniaKomunikatu('Błąd zapisu "Nowa data startu Dedala" - ponawiam: ' + licznik,'rgb(199, 100, 43)'); 
                setTimeout(() => {this.zapisz_data_startu(--licznik,yy,mm,dd,hh,mi,ss)}, 1000) 
               }
               )      
    }
  }

  private OdczytajCzasPoczatkuAkcji = new Subject<any>();
  OdczytajCzasPoczatkuAkcji$ = this.OdczytajCzasPoczatkuAkcji.asObservable()
  private odczytaj_czas_poczatku_akcji(licznik : number)
  {
    if (licznik == 0) 
    {
      this.czas_startu_akcji = 'ERROR';
      //this.changeGetCzasStartuNew(this.czas_startu_org);
      this.OdczytajCzasPoczatkuAkcji.next(this.czas_startu_akcji)
      this.addLiniaKomunikatu('NIE UDAŁO SIĘ ODCZYTAĆ "czas startu akcji na Dedalu" ','red');
    }
    else
    {
    this.http.get(this.httpURL + 'get_data_dedala.php').subscribe( 
      data =>  {
                this.czas_startu_akcji = data;
                console.log(data)
                //this.changeGetCzasStartuNew(this.czas_startu_org);
                this.OdczytajCzasPoczatkuAkcji.next(this.czas_startu_akcji);
                this.addLiniaKomunikatu('Odczytano "czas startu akcji na Dedalu" - ' + this.czas_startu_akcji ,'')
               },
      error => {
                this.czas_startu_akcji = 'ponawiam';
                //this.changeGetCzasStartuNew(this.czas_startu_org);
                this.OdczytajCzasPoczatkuAkcji.next(this.czas_startu_akcji);
                this.addLiniaKomunikatu('Błąd odczytu "czas startu akcji na Dedalu" - ponawiam: ' + licznik,'rgb(199, 100, 43)');
                setTimeout(() => {this.odczytaj_czas_poczatku_akcji(--licznik)}, 1000)
               }
               )      
    }
  }

}
