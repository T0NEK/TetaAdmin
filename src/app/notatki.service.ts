import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Notatka, Tresc, Udostepnienie } from './definicje';
import { FunkcjeWspolneService } from './funkcje-wspolne.service';
import { KomunikacjaService } from './komunikacja.service';

@Injectable({
  providedIn: 'root'
})
export class NotatkiService {

notatki: Notatka [] = [];
notatka: Tresc [] = [];
udost: Udostepnienie [] = [];

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
  private odczytaj_notatki(licznik: number, stan: number, id: string, get: string, powod: string)
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
    this.funkcje.addLiniaKomunikatuKrytyczny(this.funkcje.getDedal(),'NIE UDAŁO SIĘ WCZYTAĆ Notatki: ' + powod);
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
                          "stanText": wynik.notatki[index].stanText,
                          "blokadastan": wynik.notatki[index].blokadastan,
                          "blokadaudo": wynik.notatki[index].blokadaudo
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
                  setTimeout(() => {this.odczytaj_notatki(licznik, stan, id, get,wynik.error)}, 1000) 
                }
                  },
        error => {
          //console.log(error)
                  this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal(),'Błąd odczytu Notatki - ponawiam: ' + licznik);
                  setTimeout(() => {this.odczytaj_notatki(licznik, stan, id, get,powod)}, 1000) 
                }
                )      
              }
  }

  WczytajUdoNotatki(idnotatki: number)
  {
      this.odczytaj_udo_notatki(5, idnotatki, "getudo",'');
  }
  
  private OdczytajUdoNotatki = new Subject<any>();
  OdczytajUdoNotatki$ = this.OdczytajUdoNotatki.asObservable()
  private odczytaj_udo_notatki(licznik: number, idnotatki: number, get: string, powod: string)
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin':'*',
        'content-type': 'application/json',
        Authorization: 'my-auth-token'
      })
    };
    
  var data = JSON.stringify({"kierunek": get, "idnotatki": idnotatki })  
  
  if (licznik == 0) 
  {
    this.funkcje.addLiniaKomunikatuKrytyczny(this.funkcje.getDedal(),'NIE UDAŁO SIĘ WCZYTAĆ Udostępnień: ' + powod);
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
                    
                        this.udost = [...this.udost, {
                          "idosoby": wynik.notatki[index].idosoby,
                          "idudo": wynik.notatki[index].idudo,
                          "czas": wynik.notatki[index].czas,
                          "stanudo": wynik.notatki[index].stanudo, 
                          "autor": wynik.notatki[index].autor
                          }]
                  }  
                  this.OdczytajUdoNotatki.next({"stan": true, "udost": this.udost, "komunikat": wynik.error})
                  }
                  else
                  {//stan false
                    //this.notatkiStan = true;
                    this.OdczytajUdoNotatki.next({"stan": false, "udost": this.udost, "komunikat": wynik.error})
                  }
                }
                else
                {//wynik false
                  this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal(),'Błąd odczytu udostępnień - ponawiam: ' + licznik);
                  setTimeout(() => {this.odczytaj_udo_notatki(licznik, idnotatki, get,wynik.error)}, 1000) 
                }
                  },
        error => {
          //console.log(error)
                  this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal(),'Błąd odczytu udostępnień - ponawiam: ' + licznik);
                  setTimeout(() => {this.odczytaj_udo_notatki(licznik, idnotatki, get,powod)}, 1000) 
                }
                )      
              }
  }

  SetStanNotatki(get: string, idnotatki: number, idtablica: number)
  {
      this.set_stan_notatki(5, idnotatki, idtablica, get, '');
  }
  
  private ZmienStanNotatki = new Subject<any>();
  ZmienStanNotatki$ = this.ZmienStanNotatki.asObservable()
  private set_stan_notatki(licznik: number, idnotatki: number, idtablica: number, get: string, powod: string)
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin':'*',
        'content-type': 'application/json',
        Authorization: 'my-auth-token'
      })
    };
    
  var data = JSON.stringify({"kierunek": get, "idnotatki": idnotatki, "idtablica": idtablica })  
  
  if (licznik == 0) 
  {
    this.ZmienStanNotatki.next({"wynik": false, "komunikat": 'NIE UDAŁO SIĘ ZMIENIĆ Stanu notatki ' + powod})
    //this.funkcje.addLiniaKomunikatuKrytyczny(this.funkcje.getDedal(),'NIE UDAŁO SIĘ ZMIENIĆ Stanu notatki: ' + wynik);
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
                  this.ZmienStanNotatki.next({"wynik": true, "idnotatki": wynik.idnotatki, "idtablica": wynik.idtablica, "stan": wynik.stan , "stanText": wynik.stanText, "kierunek": wynik.kierunek, "komunikat": wynik.error})
                }
                else
                {//wynik false
                  this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal(),'Błąd zmiany stanu notatki - ponawiam: ' + licznik);
                  setTimeout(() => {this.set_stan_notatki(licznik, idnotatki, idtablica, get,wynik.error)}, 1000) 
                }
                  },
        error => {
          //console.log(error)
                  this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal(),'Błąd zmiany stanu notatki- ponawiam: ' + licznik);
                  setTimeout(() => {this.set_stan_notatki(licznik, idnotatki, idtablica, get,powod)}, 1000) 
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
  private odczytaj_notatki_tresc(licznik: number, stan: number, idnotatki: number, powod: string)
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
    this.funkcje.addLiniaKomunikatuKrytyczny(this.funkcje.getDedal(),'NIE UDAŁO SIĘ WCZYTAĆ Treści: ' + powod);
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
                  setTimeout(() => {this.odczytaj_notatki_tresc(licznik, stan, idnotatki,wynik.error)}, 1000) 
                }
                  },
        error => {
          //console.log(error)
                  this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal(),'Błąd odczytu Treści Notatki - ponawiam: ' + licznik);
                  setTimeout(() => {this.odczytaj_notatki_tresc(licznik, stan, idnotatki,powod)}, 1000) 
                }
                )      
    }
  }



  
}
