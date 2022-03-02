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
                    this.OdczytajNotatki.next({"stan": false, "notatki": this.notatki, "komunikat": wynik.error})
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


  WczytajnotatkiTresc(stan: number, idnotatki: number)
  {
      this.notatka = [];
      this.odczytaj_notatki_tresc(5, stan, idnotatki,'');
  }

  private OdczytajNotatkiTresc = new Subject<any>();
  OdczytajNotatkiTresc$ = this.OdczytajNotatkiTresc.asObservable()
  private odczytaj_notatki_tresc(licznik: number, stan: number, idnotatki: number, wynik: string)
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin':'*',
        'content-type': 'application/json',
        Authorization: 'my-auth-token'
      })
    };
    
  var data = JSON.stringify({"kierunek": "get",  "stan": stan, "notatka": idnotatki})  
  if (licznik == 0) 
  {
    this.funkcje.addLiniaKomunikatuKrytyczny(this.funkcje.getDedal(),'NIE UDAŁO SIĘ WCZYTAĆ Treści: ' + wynik);
  }
  else
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
                  this.OdczytajNotatkiTresc.next({"stan": true, "wersje": this.notatka, "komunikat": wynik.error})

                  }
                  else
                  {//stan false
                    this.OdczytajNotatkiTresc.next({"stan": false, "wersje": this.notatka, "komunikat": wynik.error})
                  }
                }
                else
                {
                  this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal(),'Błąd odczytu Treści Notatki - ponawiam: ' + licznik);
                  setTimeout(() => {this.odczytaj_notatki_tresc(licznik, stan, idnotatki,'')}, 1000) 
                }
                  },
        error => {
          //console.log(error)
                  this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal(),'Błąd odczytu Treści Notatki - ponawiam: ' + licznik);
                  setTimeout(() => {this.odczytaj_notatki_tresc(licznik, stan, idnotatki,'')}, 1000) 
                }
                )      
    }
  }

}
