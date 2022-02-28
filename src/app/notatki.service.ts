import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Notatka, Tresc } from './definicje';
import { FunkcjeWspolneService } from './funkcje-wspolne.service';
import { KomunikacjaService } from './komunikacja.service';

@Injectable({
  providedIn: 'root'
})
export class NotatkiService {

notatki: Notatka [] = []
notatka: Tresc [] = []

constructor(private http: HttpClient, private komunikacja: KomunikacjaService, private funkcje: FunkcjeWspolneService) 
{

}

Wczytajnotatki(stan: number)
  {
      //this.notatkiStan = false;
      this.notatki = [];
      this.odczytaj_notatki(5, stan, '', "get",'');
  }
  
  private OdczytajNotatki = new Subject<any>();
  OdczytajNotatki$ = this.OdczytajNotatki.asObservable()
  private odczytaj_notatki(licznik: number, stan: number, id: string, get: string, wynik: string)
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin':'*',
        'content-type': 'application/json',
        Authorization: 'my-auth-token'
      })
    };
    
  var data = JSON.stringify({"kierunek": get, "stan": stan, "id": id })  
  
  if (licznik == 0) 
  {
    this.funkcje.addLiniaKomunikatuKrytyczny(this.funkcje.getDedal(),'NIE UDAŁO SIĘ WCZYTAĆ Notatki: ' + wynik);
  }
  else
  {
      --licznik;
      this.http.post(this.komunikacja.getURL() + 'notatki/', data, httpOptions).subscribe( 
        data =>  {
          //console.log(data)
                let wynik = JSON.parse(JSON.stringify(data));
                if (wynik.wynik == true) 
                {
                  if (wynik.stan == true)
                  {  
                  for (let index = 0; index < wynik.notatki.length; index++) 
                  {
                    
                        this.notatki = [...this.notatki, {
                          "id": wynik.notatki[index].id,
                          "identyfikator": wynik.notatki[index].identyfikator,
                          "czas": wynik.notatki[index].czas,
                          "tytul": wynik.notatki[index].tytul, 
                          "wlasciciel": wynik.notatki[index].wlasciciel,
                          "wlascicielText": wynik.notatki[index].wlascicielText,
                          "stan": wynik.notatki[index].stan,
                          "stanText": wynik.notatki[index].stanText
                          }]
                  }  
                  this.OdczytajNotatki.next({"stan": true, "notatki": this.notatki, "komunikat": wynik.error})
                  }
                  else
                  {//stan false
                    //this.notatkiStan = true;
                    this.OdczytajNotatki.next({"stan": true, "notatki": this.notatki, "komunikat": wynik.error})
                  }
                }
                else
                {//wynik false
                  this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal(),'Błąd odczytu Notatki - ponawiam: ' + licznik);
                  setTimeout(() => {this.odczytaj_notatki(licznik, stan, id, get,'')}, 1000) 
                }
                  },
        error => {
          //console.log(error)
                  this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal(),'Błąd odczytu Notatki - ponawiam: ' + licznik);
                  setTimeout(() => {this.odczytaj_notatki(licznik, stan, id, get,'')}, 1000) 
                }
                )      
              }
  }


  WczytajnotatkiTresc(stan: number, notatka: string)
  {
    //console.log('identyfikator: ', notatka)
    //console.log('id: ', this.getNotatkaId(notatka))
    //console.log('notatki', this.getNotatki())
      this.notatka = [];
      //this.notatkaStan = {"wczytana": false, "edycja": false, "notatka": {"id":0, "identyfikator": "", "czas": "", "stan": false, "stanText": "", "tytul": "", "wlasciciel": 0, "wlascicielText":""}, "wersja": 0, "zmiany": false, "tresc": ""};
      this.odczytaj_notatki_tresc(5, stan, notatka);
  }

  private OdczytajTresc = new Subject<any>();
  OdczytajTresc$ = this.OdczytajTresc.asObservable()
  private OdczytajNotatkiTresc = new Subject<any>();
  OdczytajNotatkiTresc$ = this.OdczytajNotatkiTresc.asObservable()
  private odczytaj_notatki_tresc(licznik: number, stan: number, notatka: string)
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin':'*',
        'content-type': 'application/json',
        Authorization: 'my-auth-token'
      })
    };
    
  var data = JSON.stringify({"kierunek": "get",  "stan": stan, "notatka": notatka})  
console.log('data WNT',data)
  if (licznik > 0 )
    {
      --licznik;
      this.http.post(this.komunikacja.getURL() + 'notatka/', data, httpOptions).subscribe( 
        data =>  {
          //console.log(data)
                let wynik = JSON.parse(JSON.stringify(data));
                if (wynik.wynik == true) 
                {
                  if (wynik.stan == true)
                  {  
                  for (let index = 0; index < wynik.notatki.length; index++) 
                  {
                        this.notatka = [...this.notatka, {
                          "id": wynik.notatki[index].id,
                          "wersja": wynik.notatki[index].wersja, 
                          "stan": wynik.notatki[index].stan,
                          "stanText": wynik.notatki[index].stanText,
                          "czas": wynik.notatki[index].czas,
                          "tresc": wynik.notatki[index].tresc,
                          }]
                  }  
                  //this.notatkiStan = true;
                  //this.notatkaStan = {"wczytana": true, "edycja": false, "notatka": {"id": wynik.id, "identyfikator": wynik.identyfikator, "czas": wynik.czas, "stan": wynik.stan, "stanText": wynik.stanText, "tytul": wynik.tytul, "wlasciciel": wynik.wlasciciel, "wlascicielText": wynik.wlascicielText}, "wersja": wynik.wersja, "zmiany": false, "tresc": ""};
                  this.OdczytajNotatkiTresc.next({"komunikat": wynik.error})
                  this.OdczytajTresc.next({"notatka": this.notatka, "wersja": wynik.wersja })
//console.log('notatka odczyt:',this.notatka)
                  }
                  else
                  {//stan false
                    this.OdczytajNotatkiTresc.next({"komunikat": wynik.error})
                  }
                }
                else
                {
                  setTimeout(() => {this.odczytaj_notatki_tresc(licznik, stan, notatka)}, 1000) 
                }
                  },
        error => {
          //console.log(error)
                  setTimeout(() => {this.odczytaj_notatki_tresc(licznik, stan, notatka)}, 1000) 
                }
                )      
    }
    else
    {
      this.OdczytajNotatkiTresc.next({"komunikat": "problem z odczytem"})
    }
  }

}
