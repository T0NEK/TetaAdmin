import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CzasService } from './czas.service';
import { FunkcjeWspolneService } from './funkcje-wspolne.service';
import { KomunikacjaService } from './komunikacja.service';

@Injectable({
  providedIn: 'root'
})
export class ZespolyService {

constructor(private http: HttpClient, private komunikacja: KomunikacjaService, private funkcje: FunkcjeWspolneService, private czasy: CzasService)
{ 
}

Wczytajzespol(modul: number)
{
    this.odczytaj_zespoly(5, modul, '');
}

private OdczytajZespoly = new Subject<any>();
OdczytajZespoly$ = this.OdczytajZespoly.asObservable()
private odczytaj_zespoly(licznik: number, modul: number, powod: string)
{
  const httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin':'*',
      'content-type': 'application/json',
      Authorization: 'my-auth-token'
    })
  };
  
var data = JSON.stringify({ "stan": 0, "modul": modul, "czas": this.czasy.getCzasDedala()})  

if (licznik > 0 )
  {
    --licznik;
    this.http.post(this.komunikacja.getURL() + 'zespoly/', data, httpOptions).subscribe( 
      data =>  {
        console.log(data)
              let wynik = JSON.parse(JSON.stringify(data));
              if (wynik.wynik == true) 
              {
                if (wynik.stan == true)
                {  
                this.funkcje.addLiniaKomunikatuInfo(this.funkcje.getDedal().osoba,wynik.error) 
                this.OdczytajZespoly.next({"stan": true, "zespoly": wynik.zespoly})
                }
                else
                {
                this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba, 'Błąd ' + wynik.error);
                this.OdczytajZespoly.next({"stan": false})
                }
              }
              else
              {
                this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba,'Błąd ' + wynik.error +'- ponawiam: ' + licznik);  
                setTimeout(() => {this.odczytaj_zespoly(licznik, modul, wynik.error)}, 1000) 
              }
                },
      error => {
        console.log(error)
                this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba,'Błąd ' + error.error +'- ponawiam: ' + licznik);
                setTimeout(() => {this.odczytaj_zespoly(licznik, modul, error.error)}, 1000) 
              }
              )      
  }
  else
  {
    this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba,'Błąd ' + powod );
  }
}



ZapiszDane(rodzaj: string, zespol: number, stan: number)
  {
      this.zapisz_stan(5, rodzaj, zespol, stan, '');
  }
  
  private OdczytajDane = new Subject<any>();
  OdczytajDane$ = this.OdczytajDane.asObservable()
  private zapisz_stan(licznik: number,rodzaj: string, zespol: number, stan: number, powod: string)
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin':'*',
        'content-type': 'application/json',
        Authorization: 'my-auth-token'
      })
    };
    
  var data = JSON.stringify({ "stan": rodzaj, "zespol": zespol, "nowy": stan, "czas": this.czasy.getCzasDedala()})  
  
  if (licznik > 0 )
    {
      --licznik;
      this.http.post(this.komunikacja.getURL() + 'zespoly/', data, httpOptions).subscribe( 
        data =>  {
          console.log(data)
                let wynik = JSON.parse(JSON.stringify(data));
                if (wynik.wynik == true) 
                {
                  if (wynik.stan == true)
                  {  
                  this.funkcje.addLiniaKomunikatuInfo(this.funkcje.getDedal().osoba,wynik.error) 
                  this.OdczytajDane.next({"stan": true})
                  }
                  else
                  {
                  this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba, 'Błąd ' + wynik.error);
                  this.OdczytajDane.next({"stan": false})
                  }
                }
                else
                {
                  this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba,'Błąd ' + wynik.error +'- ponawiam: ' + licznik);  
                  setTimeout(() => {this.zapisz_stan(licznik, rodzaj, zespol, stan,  wynik.error)}, 1000) 
                }
                  },
        error => {
          console.log(error)
                  this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba,'Błąd ' + error.error +'- ponawiam: ' + licznik);
                  setTimeout(() => {this.zapisz_stan(licznik, rodzaj, zespol, stan, error.error)}, 1000) 
                }
                )      
    }
    else
    {
      this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba,'Błąd ' + powod );
    }
  }

}

