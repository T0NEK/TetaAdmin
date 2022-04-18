import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { FunkcjeWspolneService } from './funkcje-wspolne.service';
import { KomunikacjaService } from './komunikacja.service';

@Injectable({
  providedIn: 'root'
})
export class PoleceniadedalService {

  constructor(private komunikacja: KomunikacjaService, private funkcje: FunkcjeWspolneService, private http: HttpClient)
  { }


  wczytajOsoby(licznik: number)
  {
    this.odczytaj_osoby(licznik,'osoby','');
  }
  
  private OdczytajOsoby = new Subject<any>();
  OdczytajOsoby$ = this.OdczytajOsoby.asObservable()
  private odczytaj_osoby(licznik: number, stan: string, powod: string)
    {
      const httpOptions = {
        headers: new HttpHeaders({
          'Access-Control-Allow-Origin':'*',
          'content-type': 'application/json',
          Authorization: 'my-auth-token'
        })
      };
      
    var data = JSON.stringify({ "get": stan})  
    
    if (licznik == 0) 
    {
      this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba,'Błąd osoby polecenia dedal' + powod );
    }
    else
    {
      --licznik;
      this.http.post(this.komunikacja.getURL() + 'poleceniadedala/', data, httpOptions).subscribe( 
        data =>  {
          let wynik = JSON.parse(JSON.stringify(data));    
          if (wynik.wynik == true) 
          {
            this.funkcje.addLiniaKomunikatuInfo(this.funkcje.getDedal().osoba,'Wczytano osoby polecenia dedal - ponawiam: ' + licznik);
            this.OdczytajOsoby.next(wynik.osoby);
          }
          else
          { 
            this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba,'Błąd osoby polecenia dedal - ponawiam: ' + licznik);
            setTimeout(() =>  { this.odczytaj_osoby(licznik, stan, wynik.error) }, 1000) }
          },
        error => { 
          console.log(error)
                    this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba,'Błąd osoby polecenia dedal - ponawiam: ' + licznik);
                    setTimeout(() =>  { this.odczytaj_osoby(licznik, stan, error.error) }, 1000) }
                    )      
                  }
  }

  wczytujPolecenia()
  {
    this.wczytuj_polecenia('polecenia', 0);
  }
  
  private PoleceniaDedal = new Subject<any>();
  PoleceniaDedal$ = this.PoleceniaDedal.asObservable()
  private wczytuj_polecenia(stan: string, idmax: number)
    {
      const httpOptions = {
        headers: new HttpHeaders({
          'Access-Control-Allow-Origin':'*',
          'content-type': 'application/json',
          Authorization: 'my-auth-token'
        })
      };
      
    var data = JSON.stringify({ "get": stan, "idmax": idmax})  
    
      this.http.post(this.komunikacja.getURL() + 'poleceniadedala/', data, httpOptions).subscribe( 
        data =>  {
          let wynik = JSON.parse(JSON.stringify(data));    
          if (wynik.wynik == true) 
          {
            this.PoleceniaDedal.next(wynik.polecenia);

            setTimeout(() =>  { this.wczytuj_polecenia(stan, wynik.idmax) }, 1000) 
          }
          else
          { 
            setTimeout(() =>  { this.wczytuj_polecenia(stan, idmax) }, 1000) }
          },
        error => { 
          console.log(error)
                    setTimeout(() =>  { this.wczytuj_polecenia(stan, idmax) }, 1000) }
                    )      

  }
  

  ZapiszOdpowiedz(poleceniepierwsze: string, czaspierwsze: string, polecenieid: number, polecenieText: string, czaswykonania: string, osoba: number, osobaText: string, terminal: string, odpowiedzText: string)
  {
    this.zapisz_odpowiedz( 5,'odp', poleceniepierwsze, czaspierwsze, polecenieid, polecenieText, czaswykonania, osoba, osobaText, terminal, odpowiedzText, '');
  }
  
  private OdpowiedzZapisana = new Subject<any>();
  OdpowiedzZapisana$ = this.OdpowiedzZapisana.asObservable()
  private zapisz_odpowiedz(licznik: number, stan: string, poleceniepierwsze: string, czaspierwsze: string, polecenieid: number, polecenieText: string, czaswykonania: string, osoba: number, osobaText: string, terminal: string, odpowiedzText: string, powod: string)
    {
      const httpOptions = {
        headers: new HttpHeaders({
          'Access-Control-Allow-Origin':'*',
          'content-type': 'application/json',
          Authorization: 'my-auth-token'
        })
      };
      
    var data = JSON.stringify({ "get": stan, "poleceniepierwsze": poleceniepierwsze, "czaspierwsze": czaspierwsze,  "polecenieid": polecenieid, "polecenieText": polecenieText, "czaswykonania": czaswykonania, "osoba": osoba, "osobaText": osobaText, "terminal": terminal, "odpowiedzText": odpowiedzText})  
    
    if (licznik == 0) 
    {
      this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba,'Błąd Zapisz odpowiedż: ' + powod );
    }
    else
    {
      --licznik;
      this.http.post(this.komunikacja.getURL() + 'poleceniadedala/', data, httpOptions).subscribe( 
        data =>  {
          let wynik = JSON.parse(JSON.stringify(data));    
          if (wynik.wynik == true) 
          {
            this.funkcje.addLiniaKomunikatuInfo(this.funkcje.getDedal().osoba,'Zapisano odpowiedż');
            this.OdpowiedzZapisana.next(wynik.osoby);
          }
          else
          { 
            this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba,'Zapisz odpowiedż - ponawiam: ' + licznik);
            setTimeout(() =>  { this.zapisz_odpowiedz(licznik, stan, poleceniepierwsze, czaspierwsze, polecenieid, polecenieText, czaswykonania, osoba, osobaText, terminal, odpowiedzText, wynik.error) }, 1000) }
          },
        error => { 
          console.log(error)
                    this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba,'Zapisz odpowiedż - ponawiam: ' + licznik);
                    setTimeout(() =>  { this.zapisz_odpowiedz(licznik, stan, poleceniepierwsze, czaspierwsze, polecenieid, polecenieText, czaswykonania, osoba, osobaText, terminal, odpowiedzText, error.error) }, 1000) }
                    )      
                  }
  }
}
