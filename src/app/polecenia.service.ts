import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { Polecenia } from './definicje';
import { FunkcjeWspolneService } from './funkcje-wspolne.service';
import { KomunikacjaService } from './komunikacja.service';

@Injectable({
  providedIn: 'root'
})
export class PoleceniaService {



private polecenia: Polecenia[] = [];  

constructor(private http: HttpClient, private komunikacja: KomunikacjaService, private funkcje: FunkcjeWspolneService)
 { }

getPolecenia()
{
  return this.polecenia;
}



ZnajdzPolecenie(polecenie: string)
{
  let wynik = {"czas":0,"dzialania":"","id":0,"komunikat":"","nazwa":"","nazwaOrg":"","podstawowe":false,"polecenie":0,"wylogowany":false,"zalogowany":false,"osoby":[{"id":0,"imie":"","nazwisko":"","funkcja":"","dos":false}]}
  for (let index = 0; index < this.polecenia.length; index++) 
  { if ( this.polecenia[index].nazwa.toLowerCase() == polecenie.toLowerCase() )
    { wynik = this.polecenia[index]; break; } 
  }       
  if (!wynik.podstawowe)
  {
    for (let index = 0; index < this.polecenia.length; index++) 
    { if ( this.polecenia[index].id == wynik.polecenie )
      { wynik = this.polecenia[index]; break; } 
    }       
  }
  return wynik
}

ZnajdzPolecenieId(id: number)
{
  let wynik = 0;
  for (let index = 0; index < this.polecenia.length; index++) 
  { if ( this.polecenia[index].id == id )
    { wynik = index; break; } 
  }       
  return wynik
}

ZnajdzOsobaId(id: number, idpolecenia: number)
{
  let wynik = 0;
  let osoby = this.polecenia[idpolecenia].osoby;
  for (let index = 0; index < osoby.length; index++) 
  { if ( osoby[index].id == id )
    { wynik = index; break; } 
  }       
  return wynik
}


ZapiszPoleceniaOsoba(idosoba: number, idpolecenia: number, dos: boolean)
{
  this.odczytaj_polecenia(5, 'set', idosoba, idpolecenia, dos, '');
}

ZapiszPoleceniaOsoby(idpolecenia: number, dos: boolean)
{
  this.odczytaj_polecenia(5, 'set', 0, idpolecenia, dos, '');
}

ZmienDostep(rodzaj: string, idpolecenia: number, dos: boolean)
{
 this.odczytaj_polecenia(5, rodzaj, 0, idpolecenia, dos, ''); 
}

WczytajPolecenia(licznik: number)
{
    this.polecenia = [];
    this.odczytaj_polecenia(licznik, 'get', 0, 0, false, '');
}


private OdczytajPolecenia = new Subject<any>();
OdczytajPolecenia$ = this.OdczytajPolecenia.asObservable()
private odczytaj_polecenia(licznik: number, get: string, idosoba : number, idpolecenia: number, dos: boolean, wynik: string)
{
  const httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin':'*',
      'content-type': 'application/json',
      Authorization: 'my-auth-token'
    })
  };
  
  var data = JSON.stringify({"get": get, "idosoba": idosoba, "idpolecenia": idpolecenia, "dos": dos})  

  if (licznik == 0) 
    {
      this.funkcje.addLiniaKomunikatuKrytyczny(this.funkcje.getDedal(),'NIE UDAŁO SIĘ WCZYTAĆ Poleceń: ' + wynik);
    }
    else
    {
    --licznik;  
      
    this.http.post(this.komunikacja.getURL() + 'polecenia/', data, httpOptions).subscribe( 
    data =>  {
            let wynik = JSON.parse(JSON.stringify(data));
            if (wynik.wynik == true) 
            {
              //console.log(wynik)
              switch (wynik.get) {
                case 'get':
                            for (let index = 0; index < wynik.polecenia.length; index++) 
                            {
                                  this.polecenia = [...this.polecenia, {
                                    "id": wynik.polecenia[index].id, 
                                    "podstawowe": wynik.polecenia[index].podstawowe,
                                    "nazwa": wynik.polecenia[index].nazwa, 
                                    "zalogowany": wynik.polecenia[index].zalogowany, 
                                    "wylogowany": wynik.polecenia[index].wylogowany, 
                                    "polecenie": wynik.polecenia[index].polecenie,
                                    "czas": wynik.polecenia[index].czas, 
                                    "dzialania": wynik.polecenia[index].dzialania,
                                    "nazwaOrg": wynik.polecenia[index].nazwaOrg,
                                    "komunikat": wynik.polecenia[index].komunikat,
                                    "osoby": wynik.polecenia[index].osoby
                                    }]
                            }    
                      break;
                case 'set': switch (wynik.idosoba) {
                              case 0:
                                  let id = this.ZnajdzPolecenieId(wynik.idpolecenia)
                                  for (let index = 0; index < wynik.idosoby.length; index++) 
                                  {
                                    let osoba = this.ZnajdzOsobaId(wynik.idosoby[index], id);    
                                    this.polecenia[id].osoby[osoba].dos = wynik.dos;    
                                  }
                                  break;
                              default:
                                let index = this.ZnajdzPolecenieId(wynik.idpolecenia);
                                let osoba = this.ZnajdzOsobaId(wynik.idosoba, index);
                                this.polecenia[index].osoby[osoba].dos = wynik.dos;
                                break;
                            }
                      break;
                case 'zalogowany': this.polecenia[this.ZnajdzPolecenieId(wynik.idpolecenia)].zalogowany = wynik.dos;
                      break      
                case 'wylogowany': this.polecenia[this.ZnajdzPolecenieId(wynik.idpolecenia)].wylogowany = wynik.dos;
                      break      
              }
                
            //console.log(this.polecenia)
            this.OdczytajPolecenia.next(this.polecenia);
            //console.log(wynik.error)
            this.funkcje.addLiniaKomunikatuInfo(this.funkcje.getDedal(),wynik.error)
            }
            else
            {
              this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal(),'Błąd odczytu Polecenia - ponawiam: ' + licznik);
              setTimeout(() => {this.odczytaj_polecenia(licznik, get, idosoba, idpolecenia, dos, wynik.error)}, 1000) 
            }
              },
    error => {
      //console.log(error)
              this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal(),'Błąd odczytu Polecenia - ponawiam: ' + licznik);
              setTimeout(() => {this.odczytaj_polecenia(licznik, get, idosoba, idpolecenia, dos, error.error)}, 1000) 
             }
             )      
  }           
}

}