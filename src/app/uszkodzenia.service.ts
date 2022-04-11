
  import { HttpClient, HttpHeaders } from '@angular/common/http';
  import { Injectable } from '@angular/core';
  import { Subject } from 'rxjs';
  import { CzasService } from './czas.service';
  import { FunkcjeWspolneService } from './funkcje-wspolne.service';
  import { KomunikacjaService } from './komunikacja.service';
  
  @Injectable({
    providedIn: 'root'
  })
  export class UszkodzeniaService {
  
  constructor(private http: HttpClient, private komunikacja: KomunikacjaService, private funkcje: FunkcjeWspolneService, private czasy: CzasService)
  { 
  }
  
  WczytajUszkodzenia(modul: number, zespol: number)
  {
      this.odczytaj_uszkodzenia(5, modul, zespol, '');
  }
  
  private OdczytajUszkodzenia = new Subject<any>();
  OdczytajUszkodzenia$ = this.OdczytajUszkodzenia.asObservable()
  private odczytaj_uszkodzenia(licznik: number, modul: number, zespol: number, powod: string)
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin':'*',
        'content-type': 'application/json',
        Authorization: 'my-auth-token'
      })
    };
    
  var data = JSON.stringify({ "stan": 'get', "modul": modul, "zespol": zespol, "czas": this.czasy.getCzasDedala()})  
  
  if (licznik > 0 )
    {
      --licznik;
      this.http.post(this.komunikacja.getURL() + 'uszkodzenia/', data, httpOptions).subscribe( 
        data =>  {
          console.log(data)
                let wynik = JSON.parse(JSON.stringify(data));
                if (wynik.wynik == true) 
                {
                  if (wynik.stan == true)
                  {  
                  this.funkcje.addLiniaKomunikatuInfo(this.funkcje.getDedal().osoba,wynik.error) 
                  this.OdczytajUszkodzenia.next({"stan": true, "uszkodzenia": wynik.uszkodzenia})
                  }
                  else
                  {
                  this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba, 'Błąd ' + wynik.error);
                  this.OdczytajUszkodzenia.next({"stan": false})
                  }
                }
                else
                {
                  this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba,'Błąd ' + wynik.error +'- ponawiam: ' + licznik);  
                  setTimeout(() => {this.odczytaj_uszkodzenia(licznik, modul, zespol, wynik.error)}, 1000) 
                }
                  },
        error => {
          console.log(error)
                  this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba,'Błąd ' + error.error +'- ponawiam: ' + licznik);
                  setTimeout(() => {this.odczytaj_uszkodzenia(licznik, modul, zespol, error.error)}, 1000) 
                }
                )      
    }
    else
    {
      this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba,'Błąd ' + powod );
    }
  }
  

  WczytajListy(stan: string)
  {
      this.odczytaj_listy(5, stan, '');
  }
  
  private OdczytajListy = new Subject<any>();
  OdczytajListy$ = this.OdczytajListy.asObservable()
  private odczytaj_listy(licznik: number, stan: string, powod: string)
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin':'*',
        'content-type': 'application/json',
        Authorization: 'my-auth-token'
      })
    };
    
  var data = JSON.stringify({ "stan": stan})  
  
  if (licznik > 0 )
    {
      --licznik;
      this.http.post(this.komunikacja.getURL() + 'uszkodzenialisty/', data, httpOptions).subscribe( 
        data =>  {
          console.log(data)
                let wynik = JSON.parse(JSON.stringify(data));
                if (wynik.wynik == true) 
                {
                  if (wynik.stan == true)
                  {  
                  this.funkcje.addLiniaKomunikatuInfo(this.funkcje.getDedal().osoba,wynik.error) 
                  this.OdczytajListy.next({"stan": true, "rodzaj": stan, "lista": wynik.lista})
                  }
                  else
                  {
                  this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba, 'Błąd ' + wynik.error);
                  this.OdczytajListy.next({"stan": false, "rodzaj": stan})
                  }
                }
                else
                {
                  this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba,'Błąd ' + wynik.error +'- ponawiam: ' + licznik);  
                  setTimeout(() => {this.odczytaj_listy(licznik, stan, wynik.error)}, 1000) 
                }
                  },
        error => {
          console.log(error)
                  this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba,'Błąd ' + error.error +'- ponawiam: ' + licznik);
                  setTimeout(() => {this.odczytaj_listy(licznik, stan, error.error)}, 1000) 
                }
                )      
    }
    else
    {
      this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba,'Błąd ' + powod );
    }
  }


  ZapiszStan(rodzaj: string,  modul: number, zespol: number, stan: number, uszkodzenie: number)
  {
      this.zapisz_stan(5, rodzaj,  modul, zespol, stan, uszkodzenie, '');
  }
  
  private OdczytajStan = new Subject<any>();
  OdczytajStan$ = this.OdczytajStan.asObservable()
  private zapisz_stan(licznik: number,rodzaj: string, modul: number, zespol: number, stan: number, uszkodzenie: number, powod: string)
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin':'*',
        'content-type': 'application/json',
        Authorization: 'my-auth-token'
      })
    };
    
  var data = JSON.stringify({ "stan": rodzaj, "modul": modul, "zespol": zespol, "nowy": stan, "uszkodzenie": uszkodzenie, "czas": this.czasy.getCzasDedala()})  
  
  if (licznik > 0 )
    {
      --licznik;
      this.http.post(this.komunikacja.getURL() + 'uszkodzenia/', data, httpOptions).subscribe( 
        data =>  {
          console.log(data)
                let wynik = JSON.parse(JSON.stringify(data));
                if (wynik.wynik == true) 
                {
                  if (wynik.stan == true)
                  {  
                  this.funkcje.addLiniaKomunikatuInfo(this.funkcje.getDedal().osoba,wynik.error) 
                  this.OdczytajStan.next({"stan": true})
                  }
                  else
                  {
                  this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba, 'Błąd ' + wynik.error);
                  this.OdczytajStan.next({"stan": false})
                  }
                }
                else
                {
                  this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba,'Błąd ' + wynik.error +'- ponawiam: ' + licznik);  
                  setTimeout(() => {this.zapisz_stan(licznik, rodzaj, modul, zespol, stan, uszkodzenie, wynik.error)}, 1000) 
                }
                  },
        error => {
          console.log(error)
                  this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba,'Błąd ' + error.error +'- ponawiam: ' + licznik);
                  setTimeout(() => {this.zapisz_stan(licznik, rodzaj, modul, zespol, stan, uszkodzenie, error.error)}, 1000) 
                }
                )      
    }
    else
    {
      this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba,'Błąd ' + powod );
    }
  }



  }
  
  