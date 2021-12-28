import { formatDate } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, Inject, LOCALE_ID, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { Wiersze } from './wiersze';
import * as _moment from 'moment';
import * as moment from 'moment';
import { ThrowStmt } from '@angular/compiler';

@Injectable({ providedIn: 'root'})


export class KomunikacjaService implements OnDestroy
{
  private httpURL = 'http://localhost/TetaPhp/Admin/';
    
  constructor(private http: HttpClient, @Inject(LOCALE_ID) private locate : string) 
  {
    this.odczytaj_startstop(10);
    this.taktujCzas();
    this.taktujUplyw(); 
    this.odczytaj_czas_startu(10);
    this.odczytaj_czas_dedala(10);
  }
 
  ngOnDestroy() 
  {
    if (this.czas_rzeczywisty_id) { clearInterval(this.czas_rzeczywisty_id); }
  }

  
/* (start) czas rzeczywisty */
  
  private czas_rzeczywisty: any;
  private czas_rzeczywisty_id: any;

  getCzasRzeczywisty() { return this.czas_rzeczywisty; }

  private czasRzeczywisty = new Subject<any>();
  czasRzeczywisty$ = this.czasRzeczywisty.asObservable();
  taktujCzas() { 
      //this.czas_rzeczywisty = formatDate(Date.now(), 'yyyy.MM.dd  HH:mm:ss', this.locate)
      this.czas_rzeczywisty = (moment()).format('YYYY.MM.DD  HH:mm:ss');
      this.czas_rzeczywisty_id = setInterval(() => { 
            //this.czas_rzeczywisty = formatDate(Date.now(), 'yyyy.MM.dd  HH:mm:ss', this.locate);
            this.czas_rzeczywisty = (moment()).format('YYYY.MM.DD  HH:mm:ss');
            this.czasRzeczywisty.next( this.czas_rzeczywisty ) }
            , 1000); 
      }
/* (end) czas rzeczywisty */

/* (start) upływ czasu rzeczywistego */ 
  private czas_rzeczywisty_start: any;
  
  private czasRzeczywistyUplyw = new Subject<any>();
      czasRzeczywistyUplyw$ = this.czasRzeczywistyUplyw.asObservable();
      taktujUplyw() { 
          let uplyw = this.czas_rzeczywisty_start - this.czas_rzeczywisty;
          this.czasRzeczywistyUplyw.next(uplyw)
          }
/* (end) upływ czasu rzeczywistego */ 
          
/* (start) dodanie lini komunikatu */
  private linieDialogu: Wiersze[] = [];
  
  getLinieDialogu() { return this.linieDialogu }
  addLinieDialogu(linia: any) 
    {
     this.linieDialogu = [...this.linieDialogu, linia];   
    }

  private LiniaKomunikatu = new Subject<any>();
  LiniaKomunikatu$ = this.LiniaKomunikatu.asObservable();
  addLiniaKomunikatu(linia: string, kolor: string)
  {
    let wiersz = {'data':this.getCzasRzeczywisty(), 'name': 'dedal', 'kolor': kolor, 'tekst': linia}
    this.addLinieDialogu(wiersz)
    this.LiniaKomunikatu.next(wiersz);
  }
/* (end) dodanie lini komunikatu */

/* (start)  */
  private PrzelaczZakladka = new Subject<any>();
  PrzelaczZakladka$ = this.PrzelaczZakladka.asObservable()
  changePrzelaczZakladka(numer: number)
  {
    this.PrzelaczZakladka.next(numer)
  }
/* (end) */  

/* (start) czas startu Dedala */
  private czas_startu_org: any;
  private czas_startu_new: any;

  //getCzasStartuOrg() { return this.czas_startu_org }

  private GetCzasStartuNew = new Subject<any>();
  GetCzasStartuNew$ = this.GetCzasStartuNew.asObservable()
  changeCzasStartuNew(czas: any)
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
      this.changeCzasStartuNew(this.czas_startu_org);
      this.OdczytajCzasStartu.next(this.czas_startu_org)
      this.addLiniaKomunikatu('NIE UDAŁO SIĘ ODCZYTAĆ "czas startu Dedala" ','red');
    }
    else
    {
    this.http.get(this.httpURL + 'get_data_startu.php').subscribe( 
      data =>  {
                this.czas_startu_org = data;
                this.changeCzasStartuNew(this.czas_startu_org);
                this.OdczytajCzasStartu.next(this.czas_startu_org);
                this.addLiniaKomunikatu('Odczytano "czas startu Dedala" - ' + this.czas_startu_org ,'')
               },
      error => {
                this.czas_startu_org = 'ponawiam';
                this.changeCzasStartuNew(this.czas_startu_org);
                this.OdczytajCzasStartu.next(this.czas_startu_org);
                this.addLiniaKomunikatu('Błąd odczytu "czas startu Dedala" - ponawiam: ' + licznik,'rgb(199, 100, 43)');
                setTimeout(() => {this.odczytaj_czas_startu(--licznik)}, 1000)
               }
               )      
    }
  }

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
                 let czasD = _moment(yy + '.' + mm + '.' + dd, 'YYYY.MM.DD');
                 let czasT = _moment(hh + ':' + mi + ':' + ss, 'HH:mm:ss');
                 let czas = czasD.format('YYYY.MM.DD ') + ' ' + czasT.format('HH:mm:ss')
                 this.changeCzasStartuNew( czas );
                 this.addLiniaKomunikatu('Zapisano "nowa data startu Dedala" - ' + this.czas_startu_new ,'') 
               },
      error => { 
                this.addLiniaKomunikatu('Błąd zapisu "Nowa data startu Dedala" - ponawiam: ' + licznik,'rgb(199, 100, 43)'); 
                setTimeout(() => {this.zapisz_data_startu(--licznik,yy,mm,dd,hh,mi,ss)}, 1000) 
               }
               )      
    }
  }

  oryginalna_data_startu(licznik : number)
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin':'*',
        'content-type': 'application/json',
        Authorization: 'my-auth-token'
      })
    };
    
    var data = JSON.stringify("")  

   if (licznik == 0) 
    { this.addLiniaKomunikatu('NIE UDAŁO SIĘ ZAPISAĆ "Oryginalna data startu Dedala" ','red'); }
    else
    {
    this.http.post(this.httpURL + 'set_data_startu_org.php', data, httpOptions).subscribe( 
      data =>  {
                 this.changeCzasStartuNew( this.czas_startu_org );
                 this.addLiniaKomunikatu('Zapisano "Oryginalna data startu Dedala" - ' + this.czas_startu_org ,'') 
               },
      error => { 
                this.addLiniaKomunikatu('Błąd zapisu "Oryginalna data startu Dedala" - ponawiam: ' + licznik,'rgb(199, 100, 43)'); 
                setTimeout(() => {this.oryginalna_data_startu(--licznik)}, 1000) 
               }
               )      
    }
  }  
/* (end) czas startu Dedala */

/* (start) start/stop akcji na Dedalu */
private startstop: any;

//getStartStop(){ return this.startstop;}
setStart()
      { 
      this.czas_rzeczywisty_start =  Date.now()
      this.addLiniaKomunikatu('Start czas','green');
      this.zapisz_startstop(5,'START'); 
      }

setStop()
      { 
      this.startstop = false; 
      this.addLiniaKomunikatu('Stop czas','red'); 
      this.zapisz_startstop(5,'STOP');
      }

private GetStartStop = new Subject();
GetStartStop$ = this.GetStartStop.asObservable()
changeStartStop(stan: any)
{
  this.startstop = stan;
  this.GetStartStop.next(this.startstop)
}

private OdczytajStartStop = new Subject<any>();
OdczytajStartStop$ = this.OdczytajStartStop.asObservable()
private odczytaj_startstop(licznik : number)
  {
    if (licznik == 0) 
    {
      this.changeStartStop('STOP');
      this.OdczytajStartStop.next('STOP')
      this.addLiniaKomunikatu('NIE UDAŁO SIĘ ODCZYTAĆ "stanu akcji = stop" ','red');
    }
    else
    {
    this.http.get(this.httpURL + 'get_stan.php').subscribe( 
      data =>  {
                this.changeStartStop(data);
                this.OdczytajStartStop.next(data);
                this.addLiniaKomunikatu('Odczytano "stan akcji" - ' + data ,'')
               },
      error => {
                this.changeStartStop('STOP');
                this.OdczytajStartStop.next('STOP');
                this.addLiniaKomunikatu('Błąd odczytu "stan akcji = stop" - ponawiam: ' + licznik,'rgb(199, 100, 43)');
                setTimeout(() => {this.odczytaj_startstop(--licznik)}, 1000)
               }
               )      
    }
  }

  zapisz_startstop(licznik : number, stan: string)
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin':'*',
        'content-type': 'application/json',
        Authorization: 'my-auth-token'
      })
    };
    
    var data = JSON.stringify({ "stan": stan })  

   if (licznik == 0) 
    { this.addLiniaKomunikatu('NIE UDAŁO SIĘ ZAPISAĆ "stan akcji" ','red'); }
    else
    {
    this.http.post(this.httpURL + 'set_stan.php', data, httpOptions).subscribe( 
      data =>  {
                 if (data) {
                          this.changeStartStop(stan);
                          this.addLiniaKomunikatu('Zapisano "stan akcji"','') 
                          } 
                 else
                 {
                  this.addLiniaKomunikatu('Błąd zapisu "stan akcji" - ponawiam: ' + licznik,'rgb(199, 100, 43)'); 
                  setTimeout(() => {this.zapisz_startstop(--licznik,stan)}, 500)   
                 }         
               },
      error => { 
                this.addLiniaKomunikatu('Błąd połączenia "stan akcji" - ponawiam: ' + licznik,'rgb(199, 100, 43)'); 
                setTimeout(() => {this.zapisz_startstop(--licznik,stan)}, 500) 
               }
               )      
    }
  }  
/* (end) start/stop akcji na Dedalu */


/* (start) czas rzeczywisty Dedala */
private czas_dedala: any;


//getCzasStartuAkcji() { return this.czas_dedala; }


private GetCzasDedala = new Subject<any>();
GetCzasDedala$ = this.GetCzasDedala.asObservable()
changeCzasDedala(czas: any)
  {
    this.czas_dedala = czas;
    this.GetCzasDedala.next(this.czas_dedala)
  }

private OdczytajCzasDedala = new Subject<any>();
OdczytajCzasDedala$ = this.OdczytajCzasDedala.asObservable()
private odczytaj_czas_dedala(licznik : number)
  {
    if (licznik == 0) 
    {
      this.czas_dedala = 'ERROR';
      this.changeCzasDedala(this.czas_dedala);
      this.OdczytajCzasDedala.next(this.czas_dedala)
      this.addLiniaKomunikatu('NIE UDAŁO SIĘ ODCZYTAĆ "czas startu akcji na Dedalu" ','red');
    }
    else
    {
    this.http.get(this.httpURL + 'get_data_dedala.php').subscribe( 
      data =>  {
                this.czas_dedala = data;
                this.changeCzasDedala(this.czas_dedala);
                this.OdczytajCzasDedala.next(this.czas_dedala);
                this.addLiniaKomunikatu('Odczytano "czas startu akcji na Dedalu" - ' + this.czas_dedala ,'')
               },
      error => {
                this.czas_dedala = 'ponawiam';
                this.changeCzasDedala(this.czas_dedala);
                this.OdczytajCzasDedala.next(this.czas_dedala);
                this.addLiniaKomunikatu('Błąd odczytu "czas startu akcji na Dedalu" - ponawiam: ' + licznik,'rgb(199, 100, 43)');
                setTimeout(() => {this.odczytaj_czas_dedala(--licznik)}, 1000)
               }
               )      
    }
  }

  zapisz_data_akcji(licznik : number, yy: string, mm: string, dd: string, hh: string, mi: string, ss: string )
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
    { this.addLiniaKomunikatu('NIE UDAŁO SIĘ ZAPISAĆ "Nowa data na Dedalu" ','red'); }
    else
    {
    this.http.post(this.httpURL + 'set_data_akcji.php', data, httpOptions).subscribe( 
      data =>  {
                 let czasD = _moment(yy + '.' + mm + '.' + dd, 'YYYY.MM.DD');
                 let czasT = _moment(hh + ':' + mi + ':' + ss, 'HH:mm:ss');
                 let czas = czasD.format('YYYY.MM.DD ') + ' ' + czasT.format('HH:mm:ss')
                 this.changeCzasStartuNew( czas);
                 this.addLiniaKomunikatu('Zapisano "nowa data na Dedalu" - ' + this.czas_startu_new ,'') 
               },
      error => { 
                this.addLiniaKomunikatu('Błąd zapisu "Nowa data na Dedalu" - ponawiam: ' + licznik,'rgb(199, 100, 43)'); 
                setTimeout(() => {this.zapisz_data_akcji(--licznik,yy,mm,dd,hh,mi,ss)}, 1000) 
               }
               )      
    }
  }


}
