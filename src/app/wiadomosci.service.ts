import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { Nazwa } from './definicje';
import { FunkcjeWspolneService } from './funkcje-wspolne.service';
import { KomunikacjaService } from './komunikacja.service';

@Injectable({
  providedIn: 'root'
})
export class WiadomosciService implements OnDestroy{

private logowaniesubscribe = new Subscription();
private osobysubscribe = new Subscription();
private nowewiadomosci: number[] =[];


constructor(private komunikacja: KomunikacjaService, private funkcje: FunkcjeWspolneService, private http: HttpClient)
{
  this.nowewiadomosci = [];  
  this.wczytajOsoby();



this.osobysubscribe = this.OdczytajOsoby$.subscribe
  ( data => 
    { 
      //this.tablicaosoby = data;   
      //if (this.funkcje.getZalogowany().zalogowany != 0)
      { this.OdczytajWiadomosci( ); }
    } 
  )
}

ngOnDestroy()
{
  if(this.logowaniesubscribe) { this.logowaniesubscribe.unsubscribe()}       
  if(this.osobysubscribe) { this.osobysubscribe.unsubscribe()}       
}


wczytajOsoby()
{
    this.odczytaj_osoby('osoby');
}

private OdczytajOsoby = new Subject<any>();
OdczytajOsoby$ = this.OdczytajOsoby.asObservable()
private odczytaj_osoby(stan: string)
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin':'*',
        'content-type': 'application/json',
        Authorization: 'my-auth-token'
      })
    };
    
  var data = JSON.stringify({ "get": stan, "odbiorca": this.funkcje.getZalogowany().zalogowany})  
  
    this.http.post(this.komunikacja.getURL() + 'wiadomosci/', data, httpOptions).subscribe( 
      data =>  {
        let wynik = JSON.parse(JSON.stringify(data));    
        if (wynik.wynik == true) 
        {
          //this.tablicaosoby = wynik.osoby;
          this.OdczytajOsoby.next(wynik.osoby);
        }
        else
        { setTimeout(() =>  { this.odczytaj_osoby(stan) }, 1000) }
               },
      error => { setTimeout(() =>  { this.odczytaj_osoby(stan) }, 1000) }
        )      
  }

  

  OdczytajWiadomosci()
  {
    this.odczytaj_wiadomosci('wiad');
  }
  
  private Wiadomosci = new Subject<any>();
  Wiadomosci$ = this.Wiadomosci.asObservable()
  private odczytaj_wiadomosci(stan: string)
    {
      const httpOptions = {
        headers: new HttpHeaders({
          'Access-Control-Allow-Origin':'*',
          'content-type': 'application/json',
          Authorization: 'my-auth-token'
        })
      };
      
    var data = JSON.stringify({ "get": stan, "odbiorca": this.funkcje.getZalogowany().zalogowany})  
     //console.log(data) 
        this.http.post(this.komunikacja.getURL() + 'wiadomosci/', data, httpOptions).subscribe( 
        data =>  {
      //console.log(data)
          let wynik = JSON.parse(JSON.stringify(data));    
          if (wynik.wynik == true) 
          {
            let noweilosc = 0;
            let noweNadawcyTxt: string[]=[];
            let noweOdbiorcy: number[]=[];
            let noweOdbiorcyTxt: string[]=[];
            for (let index = 0; index < wynik.nowe.length; index++) 
            {
              if (  this.nowewiadomosci.includes(1*wynik.nowe[index]) == false)
              {
                noweilosc++;
                if (noweNadawcyTxt.includes(wynik.nadawcyTxt[index]) == false) { noweNadawcyTxt = [...noweNadawcyTxt, wynik.nadawcyTxt[index]];}
                if (noweOdbiorcy.includes(wynik.odbiorcy[index]) == false) { noweOdbiorcy = [...noweOdbiorcy, wynik.odbiorcy[index]];}
                if (noweOdbiorcyTxt.includes(wynik.odbiorcyTxt[index]) == false) { noweOdbiorcyTxt = [...noweOdbiorcyTxt, wynik.odbiorcyTxt[index]];}
              }  
            }
            this.nowewiadomosci = wynik.nowe;
            if(noweilosc > 0)
            { 
            let info: Nazwa[] = [this.funkcje.setTextNazwa('otrzymałeś:','','','',''),this.funkcje.setTextNazwa(' ', noweilosc.toString() ,' ','yellow',''), this.funkcje.setTextNazwa('wiadomości od: ','','','','')];
            let kolor: string;
            for (let index = 0; index < noweNadawcyTxt.length; index++) 
            {
               info = [...info, this.funkcje.setTextNazwa((index == 0 ? ' ':', '),noweNadawcyTxt[index].toString(),'','rgb(20,120,140)','')]
            }
              info = [...info, this.funkcje.setTextNazwa((' dla: '),'','','','')]
            for (let index = 0; index < noweOdbiorcy.length; index++) 
            {
              switch (noweOdbiorcy[index].toString())
              {
                case '1': kolor = 'red'; break;
                case '15': kolor = 'red'; break;
                case '12': kolor = 'red'; break;
                default: kolor = 'rgb(20,120,140)'; break;
              }
               info = [...info, this.funkcje.setTextNazwa((index == 0 ? ' ':', '),noweOdbiorcyTxt[index].toString(),'',kolor,'')]
            }
              this.funkcje.addLiniaKomunikatu('',this.funkcje.getDedal().osoba,'','',[this.funkcje.setNazwaLinia('', info,'')],'')
            }
            this.Wiadomosci.next({"wiadomosci": wynik.wiadomosci, "nadawcy": wynik.nadawcy, "nowe": noweilosc});
            setTimeout(() =>  { this.odczytaj_wiadomosci(stan) }, 1000)
          }
          else
          { setTimeout(() =>  { this.odczytaj_wiadomosci(stan) }, 1000)}
                          
                 },
        error => {
      //console.log(error)
                setTimeout(() =>  { this.odczytaj_wiadomosci(stan) }, 1000)
                 }
                 )      
    }


  AktualizujPrzeczytane(przeczytane: string, odbiorca: number, odczytane: number)
  { 
    //console.log(przeczytane)
   this.set_wiadomosci(2, 'prze', przeczytane, odbiorca, odczytane, '', '', '')
   }
  
  AktualizujPrzeczytaneOsoba(przeczytane: string, odbiorca: number, odczytane: number)
   {
    //console.log(przeczytane)
    this.set_wiadomosci(2, 'przeoso', przeczytane, odbiorca, odczytane, '', '', '')
    }
   

  WyslijWiadomosci(odbiorcy: string, odbiorca: number, tresc: string, czas: string)
  {
    //console.log(5, 'set', odbiorcy , odbiorca, tresc, czas, '');
    this.set_wiadomosci(5, 'set', odbiorcy , odbiorca, 0, tresc, czas, '');
  }
   
  public WyslijWiadomosc = new Subject<any>();
  WyslijWiadomosc$ = this.WyslijWiadomosc.asObservable()

  

  private ZmianyWiadomosci = new Subject<any>();
  ZmianyWiadomosci$ = this.ZmianyWiadomosci.asObservable()
  private set_wiadomosci(licznik: number, get: string, przeczytane: string, odbiorca: number, odczytane: number, tresc: string, czas: string, powod: string)
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin':'*',
        'content-type': 'application/json',
        Authorization: 'my-auth-token'
      })
    };
    
  var data = JSON.stringify({"get": get, "przeczytane": przeczytane, "odbiorca": odbiorca, "tresc": tresc, "czas": czas, "odczytane": odczytane })  
  
  if (licznik == 0) 
  {
    this.ZmianyWiadomosci.next({"wynik": false, "komunikat": ' error: ' + powod})
  }
  else
  {
      --licznik;
      this.http.post(this.komunikacja.getURL() + 'wiadomosci/', data, httpOptions).subscribe( 
        data =>  {
          //console.log(data, licznik)
                let wynik = JSON.parse(JSON.stringify(data));
                if (wynik.wynik == true) 
                {
                  this.ZmianyWiadomosci.next({"wynik": true, "komunikat": wynik.error, "odczytane": wynik.odczytane})
                }
                else
                {//wynik false
                  setTimeout(() => {this.set_wiadomosci(licznik, get, przeczytane, odbiorca, odczytane, tresc, czas, wynik.error)}, 1000) 
                }
                  },
        error => {
          //console.log(error)
                  setTimeout(() => {this.set_wiadomosci(licznik, get, przeczytane, odbiorca, odczytane, tresc, czas, 'error')}, 1000) 
                }
                )      
  }
  }


}
