import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, Inject, LOCALE_ID, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { Wiersze } from './wiersze';
import * as moment from 'moment';


@Injectable({ providedIn: 'root'})


export class KomunikacjaService implements OnDestroy
{
  private httpURL_80 = 'http://localhost:80/TetaPhp/Admin/';
  private httpURL_8080 = 'http://localhost:8080/TetaPhp/Admin/';
  private httpURL: any;
  
  constructor(private http: HttpClient, @Inject(LOCALE_ID) private locate : string) 
  {
    this.httpURL = this.httpURL_80;
    this.sprawdz_port();
    setTimeout(()=>
      {
      this.odczytaj_startstop(10);
      this.taktujCzas();
      this.odczytaj_czas_startu(10);
      this.odczytaj_czas_dedala(10);
      },0)
  }
 
  ngOnDestroy() 
  {
    if (this.czas_rzeczywisty_id) { clearInterval(this.czas_rzeczywisty_id); }
    if (this.czas_rzeczywisty_Dedala_id) { clearInterval(this.czas_rzeczywisty_Dedala_id); }
    if (this.czas_rzeczywisty_Dedala_org_id) { clearInterval(this.czas_rzeczywisty_Dedala_org_id); }
    if (this.czas_rzeczywisty_start_id) { clearInterval(this.czas_rzeczywisty_start_id); }
    if (this.czas_uplyw_dedala_id) { clearInterval(this.czas_uplyw_dedala_id); }
    
  }

/* (start) port serwera sql */
private sprawdz_port()
{
  this.http.get(this.httpURL_80 + 'conect/').subscribe( 
    data =>  {
              this.httpURL = this.httpURL_80;
              //let ww = JSON.parse(JSON.stringify(data));
              //console.log(ww)
              this.addLiniaKomunikatu('Sprawdzono, port :80', '')
              
             },
    error => {
              this.httpURL = this.httpURL_8080
              this.addLiniaKomunikatu('Sprawdzono, port :8080', '')
              //let ww = JSON.parse(JSON.stringify(error));
              //console.log(ww)
             }
             )      
}

/* (end) port serwera sql */


/* (start) czas rzeczywisty */
  private czas_rzeczywisty: any;
  private czas_rzeczywisty_id: any;

  getCzasRzeczywisty() { return this.czas_rzeczywisty; }

  private czasRzeczywisty = new Subject<any>();
  czasRzeczywisty$ = this.czasRzeczywisty.asObservable();
  taktujCzas() { 
      this.czas_rzeczywisty = (moment()).format('YYYY-MM-DD HH:mm:ss');
      this.czas_rzeczywisty_id = setInterval(() => { 
            this.czas_rzeczywisty = (moment()).format('YYYY-MM-DD HH:mm:ss');
            this.czasRzeczywisty.next( this.czas_rzeczywisty ) }
            , 1000); 
      }
/* (end) czas rzeczywisty */


/* (start) czas rzeczywisty Dedala */
private czas_dedala_ofset: any;
private czas_rzeczywisty_Dedala_id: any;

getCzasDedala() { return this.czas_dedala_new};

private czasRzeczywistyDedala = new Subject<any>();
czasRzeczywistyDedala$ = this.czasRzeczywistyDedala.asObservable();
taktujCzasDedala() { 
      this.czas_dedala_ofset = moment(this.czas_dedala_new,"YYYY-MM-DD HH:mm:ss").diff(moment(this.czas_rzeczywisty_start,"YYYY-MM-DD HH:mm:ss"),'milliseconds',true)
     
      this.czas_rzeczywisty_Dedala_id = setInterval(() => 
      {    
       let czas = moment().add(this.czas_dedala_ofset,'milliseconds')
       this.czas_dedala_new = moment(czas).format('YYYY-MM-DD HH:mm:ss');
        this.czasRzeczywistyDedala.next( this.czas_dedala_new )
      }, 1000); 
      
    }
/* (end) czas rzeczywisty Dedala*/

/* (start) czas oryginalny Dedala */
private czas_dedala_ofset_org: any;
private czas_rzeczywisty_Dedala_org_id: any;

getCzasDedalaOryg() { return this.czas_dedala_org_new};

private czasOryginalnyDedala = new Subject<any>();
czasOryginalnyDedala$ = this.czasOryginalnyDedala.asObservable();
taktujCzasOryginalnyDedala() { 
      this.czas_dedala_ofset_org = moment(this.czas_dedala_org,"YYYY-MM-DD HH:mm:ss").diff(moment(this.czas_rzeczywisty_start,"YYYY-MM-DD HH:mm:ss"),'milliseconds',true)
     
      this.czas_rzeczywisty_Dedala_org_id = setInterval(() => 
      {    
       let czas = moment().add(this.czas_dedala_ofset_org,'milliseconds')
       this.czas_dedala_org_new = moment(czas).format('YYYY-MM-DD HH:mm:ss');
        this.czasOryginalnyDedala.next( this.czas_dedala_org_new );
      }, 1000); 
      
    }
/* (end) czas oryginalny Dedala*/


/* (start) formatowanie upływu */ 
formatUplyw(poczatek: any, obecny: any)
{
  let czas_obecny = moment(obecny);
  let czas = moment(poczatek)
  let ms = moment(czas_obecny,"YYYY-MM-DD HH:mm:ss").diff(moment(czas,"YYYY-MM-DD HH:mm:ss"));
  let d = moment.duration(ms);
  if (d.days() > 0) 
    { return ( d.days().toString() + ' dni, ' + d.hours().toString() + ' godzin ' + d.minutes().toString() + ' minut ' + d.seconds().toString() + ' sekund'); }
  else  if (d.hours() > 0) 
    { return ( d.hours().toString() + ' godzin ' + d.minutes().toString() + ' minut ' + d.seconds().toString() + ' sekund'); }
    else  if (d.minutes() > 0) 
    { return ( d.minutes().toString() + ' minut ' + d.seconds().toString() + ' sekund'); }
    else   
    { return ( d.seconds().toString() + ' sekund'); }
}
/* (end) formatowanie upływu */ 

/* (start) upływ czasu rzeczywistego */ 
  private czas_rzeczywisty_start = '';
  private czas_rzeczywisty_end = '';
  private czas_rzeczywisty_start_id: any;

  getCzasRzeczywistyStart() { return this.czas_rzeczywisty_start;}
  getCzasRzeczywistyEnd() { return this.czas_rzeczywisty_end;}
  
  private czasRzeczywistyUplyw = new Subject<any>();
  czasRzeczywistyUplyw$ = this.czasRzeczywistyUplyw.asObservable();
  taktujUplyw() 
    { 
    this.czasRzeczywistyUplyw.next(this.formatUplyw(this.czas_rzeczywisty_start,(moment()).format('YYYY-MM-DD HH:mm:ss')))
    this.czas_rzeczywisty_start_id = setInterval(() => 
      {

        this.czasRzeczywistyUplyw.next(this.formatUplyw(this.czas_rzeczywisty_start,(moment()).format('YYYY-MM-DD HH:mm:ss')))
      },1000);
    }

  zatrzymajUplyw()
    {
      if (this.czas_rzeczywisty_start_id) { clearInterval(this.czas_rzeczywisty_start_id); }
    }

/* (end) upływ czasu rzeczywistego */ 

/* (start) upływ czasu Dedala */ 

private czas_uplyw_dedala_id: any;


private czasDedalaUplyw = new Subject<any>();
czasDedalaUplyw$ = this.czasDedalaUplyw.asObservable();
taktujDedalaUplyw() 
  { 
  this.czasDedalaUplyw.next(this.formatUplyw(this.czas_rzeczywisty_start,(moment()).format('YYYY-MM-DD HH:mm:ss')))
  this.czas_uplyw_dedala_id = setInterval(() => 
    {

      this.czasRzeczywistyUplyw.next(this.formatUplyw(this.czas_rzeczywisty_start,(moment()).format('YYYY-MM-DD HH:mm:ss')))
    },1000);
  }

zatrzymajDedalaUplyw()
  {
    if (this.czas_uplyw_dedala_id) { clearInterval(this.czas_rzeczywisty_start_id); }
  }

/* (end) upływ czasu Dedala */ 



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
/*
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

  getCzasStartu(){ return this.czas_startu_new}
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
    this.http.get(this.httpURL + 'datastartu/').subscribe( 
      data =>  {
                let wynik = JSON.parse(JSON.stringify(data));
                if (wynik.wynik == true)
                {
                  this.czas_startu_org = wynik.stan;
                  this.changeCzasStartuNew(wynik.stan);
                  this.OdczytajCzasStartu.next(wynik.stan);
                  this.addLiniaKomunikatu('Odczytano "czas startu Dedala":  ' + wynik.stan ,'')
                }
                else
                {
                  this.czas_startu_org = 'ponawiam';
                  this.changeCzasStartuNew(this.czas_startu_org);
                  this.OdczytajCzasStartu.next(this.czas_startu_org);
                  this.addLiniaKomunikatu('Błąd odczytu "czas startu Dedala" - ponawiam: ' + licznik,'rgb(199, 100, 43)');
                  setTimeout(() => {this.odczytaj_czas_startu(--licznik)}, 1000)
                }
                },
      error => {
                this.czas_startu_org = 'ponawiam';
                this.changeCzasStartuNew(this.czas_startu_org);
                this.OdczytajCzasStartu.next(this.czas_startu_org);
                this.addLiniaKomunikatu('Błąd połączenia "czas startu Dedala" - ponawiam: ' + licznik,'rgb(199, 100, 43)');
                setTimeout(() => {this.odczytaj_czas_startu(--licznik)}, 1000)
               }
               )      
    }
  }

  zapisz_data_startu(licznik : number, czas: string )
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin':'*',
        'content-type': 'application/json',
        Authorization: 'my-auth-token'
      })
    };
    
    var data = JSON.stringify({"czas": czas })  
   if (licznik == 0) 
    { this.addLiniaKomunikatu('NIE UDAŁO SIĘ ZAPISAĆ "nowa data startu Dedala" ','red'); }
    else
    {
    this.http.post(this.httpURL + 'datastartu/', data, httpOptions).subscribe( 
      data =>  {
                let wynik = JSON.parse(JSON.stringify(data));
                if (wynik.wynik == true)
                {
                  this.changeCzasStartuNew( wynik.stan );
                  this.addLiniaKomunikatu('Zapisano "nowa data startu Dedala": ' + wynik.stan ,'') 
                }
                else
                {
                  this.addLiniaKomunikatu('Błąd zapisu "nowa data startu Dedala" - ponawiam: ' + licznik,'rgb(199, 100, 43)'); 
                  setTimeout(() => {this.zapisz_data_startu(--licznik, czas)}, 1500) 
                }
                
               },
      error => { 
                this.addLiniaKomunikatu('Błąd połączenia "nowa data startu Dedala" - ponawiam: ' + licznik,'rgb(199, 100, 43)'); 
                setTimeout(() => {this.zapisz_data_startu(--licznik, czas)}, 1500) 
               }
               )      
    }
  }  
/* (end) czas startu Dedala */

/* (start) start/stop akcji na Dedalu */
private startstop: any;

getStartStop() {return this.startstop}

setStart()
      { 
      this.czas_rzeczywisty_start =  (moment()).format('YYYY-MM-DD HH:mm:ss');
      this.czas_rzeczywisty_end = '';
      this.addLiniaKomunikatu('Użyto [START] czas','green');
      this.zapisz_startstop(5, 'START', this.czas_rzeczywisty_start); 
      }

setStop()
      { 
      this.czas_rzeczywisty_end =  (moment()).format('YYYY-MM-DD HH:mm:ss');
      this.addLiniaKomunikatu('Użyto [STOP] czas','red'); 
      this.zapisz_startstop(5, 'STOP', this.czas_rzeczywisty_end);
      }

private GetStartStop = new Subject();
GetStartStop$ = this.GetStartStop.asObservable()
changeStartStop(stan: any)
{
  this.startstop = stan;
  this.GetStartStop.next(this.startstop);
  switch (stan) {
    case 'START':
                  this.taktujUplyw();
                  this.taktujCzasDedala();  
                  this.taktujCzasOryginalnyDedala();
                  break;
    case 'STOP': this.zatrzymajUplyw(); break;
  } 
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
    this.http.get(this.httpURL + 'stan/').subscribe( 
      data =>  {
                let wynik = JSON.parse(JSON.stringify(data));
                if (wynik.wynik == true)
                {
                  if (wynik.stan == 'START')
                  {
                    this.addLiniaKomunikatu('Uruchomienie po Restarcie Aplikacji','red')
                    this.addLiniaKomunikatu('Ustawiam parametry: ','rgb(199, 100, 43)')
                    this.addLiniaKomunikatu('"stan akcji": START','rgb(199, 100, 43)')
                    this.czas_rzeczywisty_start = wynik.czas;
                    this.addLiniaKomunikatu('"czas startu akcji": ' + wynik.czas ,'rgb(199, 100, 43)')
                    this.changeStartStop(wynik.stan);
                    this.OdczytajStartStop.next(wynik.stan);
                  }
                  else
                  {
                    this.changeStartStop(wynik.stan);
                    this.OdczytajStartStop.next(wynik.stan);
                    this.addLiniaKomunikatu('Odczytano "stan akcji": STOP','')  
                  }
                  
                }
                else
                {
                  this.changeStartStop('STOP');
                  this.OdczytajStartStop.next('STOP');
                  this.addLiniaKomunikatu('Błąd odczytu "stan akcji = stop" - ponawiam: ' + licznik,'rgb(199, 100, 43)');
                  setTimeout(() => {this.odczytaj_startstop(--licznik)}, 1000)  
                }
               },
      error => {
                this.changeStartStop('STOP');
                this.OdczytajStartStop.next('STOP');
                this.addLiniaKomunikatu('Błąd połączenia "stan akcji = stop" - ponawiam: ' + licznik,'rgb(199, 100, 43)');
                setTimeout(() => {this.odczytaj_startstop(--licznik)}, 1000)
               }
               )      
    }
  }

  zapisz_startstop(licznik : number, stan: string, czas: string)
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin':'*',
        'content-type': 'application/json',
        Authorization: 'my-auth-token'
      })
    };
    
    var dane = JSON.stringify({ "stan": stan, "czas": czas })  
   if (licznik == 0) 
    { this.addLiniaKomunikatu('NIE UDAŁO SIĘ ZAPISAĆ "stan akcji" ','red'); }
    else
    {
    this.http.post(this.httpURL + 'stan/', dane, httpOptions).subscribe( 
      data =>  {
                let wynik = JSON.parse(JSON.stringify(data));
                if (wynik.wynik == true) 
                 {
                  this.changeStartStop(wynik.stan);
                  this.addLiniaKomunikatu('Zapisano "stan akcji"','') 
                 } 
                 else
                 {
                  this.addLiniaKomunikatu('Błąd zapisu "stan akcji" - ponawiam: ' + licznik,'rgb(199, 100, 43)'); 
                   setTimeout(() => {this.zapisz_startstop(--licznik, stan, czas)}, 1500)             
                 }        
               },
      error => { 
        console.log(error)
                this.addLiniaKomunikatu('Błąd połączenia "stan akcji" - ponawiam: ' + licznik,'rgb(199, 100, 43)'); 
                setTimeout(() => {this.zapisz_startstop(--licznik, stan, czas)}, 1500);
               }
               )      
    }
  }  
/* (end) start/stop akcji na Dedalu */


/* (start) czas rzeczywisty Dedala */
private czas_dedala_org: any;
private czas_dedala_org_new: any;
private czas_dedala_new: any;

changeCzasDedala(czas: any)
  {
    this.czas_dedala_new = czas;
    this.czas_dedala_ofset = moment(this.czas_dedala_new,"YYYY-MM-DD HH:mm:ss").diff(moment(moment(),"YYYY-MM-DD HH:mm:ss"),'milliseconds',true)
    this.czasRzeczywistyDedala.next( czas )
  }

private OdczytajCzasDedala = new Subject<any>();
OdczytajCzasDedala$ = this.OdczytajCzasDedala.asObservable()
private odczytaj_czas_dedala(licznik : number)
  {
    if (licznik == 0) 
    {
      this.czas_dedala_org = 'ERROR';
      this.changeCzasDedala(this.czas_dedala_org);
      this.OdczytajCzasDedala.next(this.czas_dedala_org);
      this.addLiniaKomunikatu('NIE UDAŁO SIĘ ODCZYTAĆ "czas startu akcji na Dedalu" ','red');
    }
    else
    {
    this.http.get(this.httpURL + 'dataakcji/').subscribe( 
      data =>  {
        let wynik = JSON.parse(JSON.stringify(data));
        console.log(wynik)
        if (wynik.wynik == true) 
        {
          if (wynik.stan == 'START')
          {
            this.addLiniaKomunikatu('Odczytano "czas startu akcji na Dedalu": ' + wynik.czasnew ,'')
            this.czas_dedala_org = wynik.czasorg;
            this.OdczytajCzasDedala.next(wynik.czasorg);
            
            this.czas_dedala_ofset_org = moment(this.czas_dedala_org,"YYYY-MM-DD HH:mm:ss").diff(moment(this.czas_rzeczywisty_start,"YYYY-MM-DD HH:mm:ss"),'milliseconds',true)
            
            this.czas_dedala_new = wynik.czasnew;

            this.czas_dedala_ofset = moment(this.czas_dedala_new,"YYYY-MM-DD HH:mm:ss").diff(moment(this.czas_rzeczywisty_start,"YYYY-MM-DD HH:mm:ss"),'milliseconds',true)
            //this.czasRzeczywistyDedala.next( czas )
            //this.czasRzeczywistyDedala.next( wynik.czas );
            

/*
            this.czas_dedala_ofset = moment(this.czas_dedala_new,"YYYY-MM-DD HH:mm:ss").diff(moment(this.czas_rzeczywisty_start,"YYYY-MM-DD HH:mm:ss"),'milliseconds',true)
     
      this.czas_rzeczywisty_Dedala_id = setInterval(() => 
      {    
       let czas = moment().add(this.czas_dedala_ofset,'milliseconds')
       this.czas_dedala_new = moment(czas).format('YYYY-MM-DD HH:mm:ss');
  */          
          } 
          else
          {
          this.czas_dedala_org = wynik.czasorg;
          this.changeCzasDedala(wynik.czasorg);
          //this.czasRzeczywistyDedala.next( wynik.czas );
          this.czasOryginalnyDedala.next( wynik.czasorg)
          this.OdczytajCzasDedala.next(wynik.czasorg);
          this.addLiniaKomunikatu('Odczytano "czas startu akcji na Dedalu": ' + wynik.czasorg ,'')
          }
        }
        else
        {
          this.czas_dedala_org = 'ponawiam';
          this.changeCzasDedala(this.czas_dedala_org);
          this.OdczytajCzasDedala.next(this.czas_dedala_org);
          this.addLiniaKomunikatu('Błąd odczytu "czas startu akcji na Dedalu" - ponawiam: ' + licznik,'rgb(199, 100, 43)');
          setTimeout(() => {this.odczytaj_czas_dedala(--licznik)}, 1000)
        }
                        
               },
      error => {
                this.czas_dedala_org = 'ponawiam';
                this.changeCzasDedala(this.czas_dedala_org);
                this.OdczytajCzasDedala.next(this.czas_dedala_org);
                this.addLiniaKomunikatu('Błąd połączenia "czas startu akcji na Dedalu" - ponawiam: ' + licznik,'rgb(199, 100, 43)');
                setTimeout(() => {this.odczytaj_czas_dedala(--licznik)}, 1000)
               }
               )      
    }
  }

  zapisz_data_akcji(licznik: number, czas: string )
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin':'*',
        'content-type': 'application/json',
        Authorization: 'my-auth-token'
      })
    };
    
    var data = JSON.stringify({ "czas": czas})  

   if (licznik == 0) 
    { this.addLiniaKomunikatu('NIE UDAŁO SIĘ ZAPISAĆ "nowa data na Dedalu" ','red'); }
    else
    {
    this.http.post(this.httpURL + 'dataakcji/', data, httpOptions).subscribe( 
      data =>  {
              let wynik = JSON.parse(JSON.stringify(data));
              if (wynik.wynik == true) 
              {
                this.changeCzasDedala( wynik.czas );
                this.addLiniaKomunikatu('Zapisano "nowa data na Dedalu" - ' + wynik.czas ,'') 
              }
              else
              {
                this.addLiniaKomunikatu('Błąd zapisu "nowa data na Dedalu" - ponawiam: ' + licznik,'rgb(199, 100, 43)'); 
                setTimeout(() => {this.zapisz_data_akcji(--licznik, czas)}, 1000) 
              }
                },
      error => { 
                this.addLiniaKomunikatu('Błąd połączenia "nowa data na Dedalu" - ponawiam: ' + licznik,'rgb(199, 100, 43)'); 
                setTimeout(() => {this.zapisz_data_akcji(--licznik,czas)}, 1000) 
               }
               )      
    }
  }

/* (end) czas rzeczywisty Dedala */
}
