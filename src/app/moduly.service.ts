
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { FunkcjeWspolneService } from './funkcje-wspolne.service';
import { KomunikacjaService } from './komunikacja.service';

@Injectable({
  providedIn: 'root'
})
export class ModulyService {


constructor(private http: HttpClient, private komunikacja: KomunikacjaService, private funkcje: FunkcjeWspolneService)
{ 
}

Wczytajmoduly(licznik: number)
{
    this.odczytaj_moduly(licznik, '');
}

private OdczytajModuly = new Subject<any>();
OdczytajModuly$ = this.OdczytajModuly.asObservable()
private odczytaj_moduly(licznik: number, powod: string)
{
  const httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin':'*',
      'content-type': 'application/json',
      Authorization: 'my-auth-token'
    })
  };
  
var data = JSON.stringify({ "stan": 0})  

if (licznik > 0 )
  {
    --licznik;
    this.http.post(this.komunikacja.getURL() + 'moduly/', data, httpOptions).subscribe( 
      data =>  {
        //console.log(data)
              let wynik = JSON.parse(JSON.stringify(data));
              if (wynik.wynik == true) 
              {
                if (wynik.stan == true)
                {  
                this.funkcje.addLiniaKomunikatuInfo(this.funkcje.getDedal().osoba,wynik.error) 
                this.OdczytajModuly.next(wynik.moduly)
                }
                else
                {
                    this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba, 'Błąd ' + wynik.error +'- ponawiam: ' + licznik);      //stan false
                    setTimeout(() => {this.odczytaj_moduly(licznik, wynik.error)}, 1000) 
                }
              }
              else
              {
                this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba,'Błąd ' + wynik.error +'- ponawiam: ' + licznik);  
                setTimeout(() => {this.odczytaj_moduly(licznik, wynik.error)}, 1000) 
              }
                },
      error => {
        //console.log(error)
                this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba,'Błąd ' + error.error +'- ponawiam: ' + licznik);
                setTimeout(() => {this.odczytaj_moduly(licznik, error.error)}, 1000) 
              }
              )      
  }
  else
  {
    this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba,'Błąd ' + powod );
  }
}

}
