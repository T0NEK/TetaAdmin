import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { KomunikacjaService } from './komunikacja.service';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { FunkcjeWspolneService } from './funkcje-wspolne.service';
import { Osoby } from './definicje';
import * as moment from 'moment';

@Injectable({ providedIn: 'root'})

export class OsobyService 
{
    
private osoby: Osoby[]=[];
private goscie: Osoby[]=[];

constructor(private funkcje: FunkcjeWspolneService, private komunikacja: KomunikacjaService, private http: HttpClient)
{
    console.log('osoby con');
    //this.odczytaj_osoby(5);
}

/* (start) osoby*/


getOsoby() { return this.osoby}
getGoscie() { return this.goscie}

wczytajOsoby(licznik: number)
{
    this.odczytaj_osoby(licznik);
    //this.odczytaj_goscie(licznik);
    //this.odczytaj_inni(licznik)
}

resetOsoby()
{
  this.reset_osoby_all(5)
}

private OdczytajOsoby = new Subject<any>();
OdczytajOsoby$ = this.OdczytajOsoby.asObservable()
private odczytaj_osoby(licznik : number)
  {
    if (licznik == 0) 
    {
      this.funkcje.addLiniaKomunikatuKrytyczny(this.funkcje.getDedal().osoba,'NIE UDAŁO SIĘ WCZYTAĆ Osoby');
    }
    else
    {
    this.http.get(this.komunikacja.getURL() + 'osoby/').subscribe( 
      data =>  {
        let wynik = JSON.parse(JSON.stringify(data));    
        if (wynik.wynik == true) 
        {
          let osoby: Osoby[] = [];  
            for (let index = 0; index < wynik.osoby.length; index++) {
                osoby = [...osoby, (wynik.osoby[index])];
            } 
          if (wynik.stan == 'START')
          {
            this.OdczytajOsoby.next(osoby);
            this.odczytaj_goscie(5);
            setTimeout(() => {this.odczytuj_osoby()}, 1000)
            this.funkcje.addLiniaKomunikatuInfo(this.funkcje.getDedal().osoba,'Wczytano Załoga')
            } 
          else
          {         
          this.OdczytajOsoby.next(osoby);
          this.odczytaj_goscie(5);
          setTimeout(() => {this.odczytuj_osoby()}, 1000)
          this.funkcje.addLiniaKomunikatuInfo(this.funkcje.getDedal().osoba,'Wczytano Załoga - stan oryginalny')
          }
        }
        else
        {
          this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba,'Błąd odczytu Załoga - ponawiam: ' + licznik);
          setTimeout(() => {this.odczytaj_osoby(--licznik)}, 1000)
        }
                        
               },
      error => {
                this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba,'Błąd połączenia Załoga  - ponawiam:' + licznik);
                setTimeout(() => {this.odczytaj_osoby(--licznik)}, 1000)
               }
               )      
    }
  }

  private OdczytujOsoby = new Subject<any>();
  OdczytujOsoby$ = this.OdczytujOsoby.asObservable()
  private odczytuj_osoby()
  {
    this.http.get(this.komunikacja.getURL() + 'osoby/').subscribe( 
      data =>  {
        let wynik = JSON.parse(JSON.stringify(data));    
        if (wynik.wynik == true) 
        {
          /*let osoby: Osoby[] = [];  
            for (let index = 0; index < wynik.osoby.length; index++) {
                osoby = [...osoby, (wynik.osoby[index])];
            } 
          */  
            this.osoby = wynik.osoby;
            this.OdczytujOsoby.next(wynik.osoby);
            setTimeout(() => {this.odczytuj_osoby()}, 1000)
        }
        else
        {
          this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba,'Błąd odczytu Załoga - ponawiam: ');
          setTimeout(() => {this.odczytuj_osoby()}, 1000)
        }
                        
               },
      error => {
                this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba,'Błąd połączenia Załoga  - ponawiam:');
                setTimeout(() => {this.odczytuj_osoby()}, 1000)
               }
               )      
  }


reset_osoby_all(licznik: number)
{
  const httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin':'*',
      'content-type': 'application/json',
      Authorization: 'my-auth-token'
    })
  };
  
  var data = JSON.stringify({"czas": moment().format('YYYY-MM-DD HH:mm:ss')})  


  if (licznik == 0) 
  { this.funkcje.addLiniaKomunikatuKrytyczny(this.funkcje.getDedal().osoba,'NIE UDAŁO SIĘ WYKONAĆ RESET'); }
  else
  {
  this.http.post(this.komunikacja.getURL() + 'reset/', data, httpOptions).subscribe( 
    data =>  {

//console.log(data)        
              let wynik = JSON.parse(JSON.stringify(data));
              if (wynik.wynik == true) 
              {
                //this.changeCzasDedala( wynik.czas );
                this.funkcje.addLiniaKomunikatuInfo(this.funkcje.getDedal().osoba,'Wykonano reset dla All"') 
                //this.odczytaj_osoby(5);
              }
              else
              {
                this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba,'Błąd Reset - ponawiam: ' + licznik); 
                setTimeout(() => {this.reset_osoby_all(--licznik)}, 1000) 
              }
                },
      error => {
//console.log(error)         
                this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba,'Błąd połączenia dla Reset - ponawiam: ' + licznik); 
                setTimeout(() => {this.reset_osoby_all(--licznik)}, 1000) 
               }
               )      
    }
  }

  zapisz_osoby_all(licznik: number, zmiana: string, stan: boolean)
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin':'*',
        'content-type': 'application/json',
        Authorization: 'my-auth-token'
      })
    };
    
    
    var data = JSON.stringify({ "id": 0, "zmiana": zmiana, "stan": stan, "czas": moment().format('YYYY-MM-DD HH:mm:ss')})  
//console.log(data)        

   if (licznik == 0) 
    { this.funkcje.addLiniaKomunikatuKrytyczny(this.funkcje.getDedal().osoba,'NIE UDAŁO SIĘ ZAPISAĆ "zmiana: [' + zmiana + '] dla Załoga'); }
    else
    {
    this.http.post(this.komunikacja.getURL() + 'osoby/', data, httpOptions).subscribe( 
      data =>  {

//console.log(data)        
              let wynik = JSON.parse(JSON.stringify(data));
              if (wynik.wynik == true) 
              {
                //this.changeCzasDedala( wynik.czas );
                this.funkcje.addLiniaKomunikatuInfo(this.funkcje.getDedal().osoba,'Zapisano "zmiana: [' + zmiana + (stan ? ' = on':' = off') + '] dla Załoga"') 
                //this.odczytaj_osoby(5);
              }
              else
              {
                this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba,'Błąd zapisu "zmiana: [' + zmiana + '] dla Załoga" - ponawiam: ' + licznik); 
                setTimeout(() => {this.zapisz_osoby_all(--licznik, zmiana, stan)}, 1000) 
              }
                },
      error => {
//console.log(error)         
                this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba,'Błąd połączenia "zmiana: [' + zmiana + '] dla Załoga" - ponawiam: ' + licznik); 
                setTimeout(() => {this.zapisz_osoby_all(--licznik, zmiana, stan)}, 1000) 
               }
               )      
    }
  }

  zapisz_osoby(licznik: number, zmiana: string, dane: any, stan: boolean)
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin':'*',
        'content-type': 'application/json',
        Authorization: 'my-auth-token'
      })
    };
    
    
    var data = JSON.stringify({ "id": dane.id, "zmiana": zmiana, "stan": stan, "czas": moment().format('YYYY-MM-DD HH:mm:ss')})  
//console.log(data)        

   if (licznik == 0) 
    { 
      this.funkcje.addLiniaKomunikatuKrytyczny(this.funkcje.getDedal().osoba,'NIE UDAŁO SIĘ ZAPISAĆ "zmiana: [' + zmiana + '] dla: ' + dane.imie + ' ' + dane.nazwisko + '"'); 
      this.odczytaj_osoby(5);    
    }
    else
    {
    this.http.post(this.komunikacja.getURL() + 'osoby/', data, httpOptions).subscribe( 
      data =>  {

//console.log(data)        
              let wynik = JSON.parse(JSON.stringify(data));
              if (wynik.wynik == true) 
              {
                //this.changeCzasDedala( wynik.czas );
                this.funkcje.addLiniaKomunikatuInfo(this.funkcje.getDedal().osoba,'Zapisano "zmiana: [' + zmiana + (stan ? ' = on':' = off') + ']  dla: ' + dane.imie + ' ' + dane.nazwisko + '"') 
              }
              else
              {
                this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba,'Błąd zapisu "zmiana: [' + zmiana + ']  dla: ' + dane.imie + ' ' + dane.nazwisko + '" - ponawiam: ' + licznik); 
                setTimeout(() => {this.zapisz_osoby(--licznik, zmiana, dane, stan)}, 1000) 
              }
                },
      error => {
//console.log(error)         
                this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba,'Błąd połączenia "zmiana: [' + zmiana + ']  dla: ' + dane.imie + ' ' + dane.nazwisko + '" - ponawiam: ' + licznik); 
                setTimeout(() => {this.zapisz_osoby(--licznik, zmiana, dane, stan)}, 1000) 
               }
               )      
    }
  }
/* (end) osoby*/

/* (start) osoby dodatkowe*/

  private OdczytajGoscie = new Subject<any>();
  OdczytajGoscie$ = this.OdczytajGoscie.asObservable()
  private odczytaj_goscie(licznik : number)
    {
      if (licznik == 0) 
      {
        
        //this.OdczytajGoscie.next('osoby');
        this.funkcje.addLiniaKomunikatuKrytyczny(this.funkcje.getDedal().osoba,'NIE UDAŁO SIĘ WCZYTAĆ Goście');
      }
      else
      {
      this.http.get(this.komunikacja.getURL() + 'goscie/').subscribe( 
        data =>  {
          let wynik = JSON.parse(JSON.stringify(data));    
          if (wynik.wynik == true) 
          {
            let osoby = Array();  
            for (let index = 0; index < wynik.osoby.length; index++) {
                osoby = [...osoby, (wynik.osoby[index])];
            } 
            if (wynik.stan == 'START')
            {
              this.OdczytajGoscie.next(osoby);
              this.odczytaj_inni(5)
              setTimeout(() => {this.odczytuj_goscie()}, 1000)
              this.funkcje.addLiniaKomunikatuInfo(this.funkcje.getDedal().osoba,'Wczytano Goście')
            } 
            else
            {         
            this.OdczytajGoscie.next(osoby);
            this.odczytaj_inni(5)
            setTimeout(() => {this.odczytuj_goscie()}, 1000)
            this.funkcje.addLiniaKomunikatuInfo(this.funkcje.getDedal().osoba,'Wczytano Goście - stan oryginalny')
            }
          }
          else
          {
            //this.OdczytajGoscie.next('');
            this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba,'Błąd odczytu Goście - ponawiam: ' + licznik);
            setTimeout(() => {this.odczytaj_goscie(--licznik)}, 1000)
          }
                          
                 },
        error => {
                  
                  //this.OdczytajGoscie.next('');
                  this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba,'Błąd połączenia Goście  - ponawiam:' + licznik);
                  setTimeout(() => {this.odczytaj_goscie(--licznik)}, 1000)
                 }
                 )      
      }
    }


    private OdczytujGoscie = new Subject<any>();
    OdczytujGoscie$ = this.OdczytujGoscie.asObservable()
    private odczytuj_goscie()
    {
      this.http.get(this.komunikacja.getURL() + 'goscie/').subscribe( 
        data =>  {
          let wynik = JSON.parse(JSON.stringify(data));    
          if (wynik.wynik == true) 
          {
            /*
            let osoby: Osoby[] = [];  
              for (let index = 0; index < wynik.osoby.length; index++) {
                  osoby = [...osoby, (wynik.osoby[index])];
              } 
             */
              this.goscie = wynik.osoby
              this.OdczytujGoscie.next(wynik.osoby);
              //this.funkcje.addLiniaKomunikatuInfo(this.funkcje.getDedal().osoba,'Wczytano Załoga 2')
              setTimeout(() => {this.odczytuj_goscie()}, 1000)
          }
          else
          {
            this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba,'Błąd odczytu Goscie - ponawiam: ');
            setTimeout(() => {this.odczytuj_goscie()}, 1000)
          }
                          
                 },
        error => {
                  this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba,'Błąd połączenia Goscie  - ponawiam:');
                  setTimeout(() => {this.odczytuj_goscie()}, 1000)
                 }
                 )      
    }


    zapisz_goscie_all(licznik: number, zmiana: string, stan: boolean)
    {
      const httpOptions = {
        headers: new HttpHeaders({
          'Access-Control-Allow-Origin':'*',
          'content-type': 'application/json',
          Authorization: 'my-auth-token'
        })
      };
      
      
      var data = JSON.stringify({ "id": 0, "zmiana": zmiana, "stan": stan, "czas": moment().format('YYYY-MM-DD HH:mm:ss')})  
  //console.log(data)        
  
     if (licznik == 0) 
      { this.funkcje.addLiniaKomunikatuKrytyczny(this.funkcje.getDedal().osoba,'NIE UDAŁO SIĘ ZAPISAĆ "zmiana: [' + zmiana + '] dla Osoby Dodatkowe'); }
      else
      {
      this.http.post(this.komunikacja.getURL() + 'goscie/', data, httpOptions).subscribe( 
        data =>  {
  
  //console.log(data)        
                let wynik = JSON.parse(JSON.stringify(data));
                if (wynik.wynik == true) 
                {
                  //this.changeCzasDedala( wynik.czas );
                  this.funkcje.addLiniaKomunikatuInfo(this.funkcje.getDedal().osoba,'Zapisano "zmiana: [' + zmiana + (stan ? ' = on':' = off') +'] dla Osoby Dodatkowe"') 
                  //this.odczytaj_goscie(licznik);
                }
                else
                {
                  this.funkcje.addLiniaKomunikatuInfo(this.funkcje.getDedal().osoba,'Błąd zapisu "zmiana: [' + zmiana + '] dla Osoby Dodatkowe" - ponawiam: ' + licznik); 
                  setTimeout(() => {this.zapisz_goscie_all(--licznik, zmiana, stan)}, 1000) 
                }
                  },
        error => {
  //console.log(error)         
                  this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba,'Błąd połączenia "zmiana: [' + zmiana + '] dla Osoby Dodatkowe" - ponawiam: ' + licznik); 
                  setTimeout(() => {this.zapisz_goscie_all(--licznik, zmiana, stan)}, 1000) 
                 }
                 )      
      }
    }

  zapisz_goscie(licznik: number, zmiana: string, dane: any, stan: boolean)
    {
      const httpOptions = {
        headers: new HttpHeaders({
          'Access-Control-Allow-Origin':'*',
          'content-type': 'application/json',
          Authorization: 'my-auth-token'
        })
      };
      
      
      var data = JSON.stringify({ "id": dane.id, "zmiana": zmiana, "stan": stan, "czas": moment().format('YYYY-MM-DD HH:mm:ss')})  
  //console.log(data)        
  
     if (licznik == 0) 
      { 
        this.funkcje.addLiniaKomunikatuKrytyczny(this.funkcje.getDedal().osoba,'NIE UDAŁO SIĘ ZAPISAĆ "zmiana: [' + zmiana + '] dla: ' + dane.imie + ' ' + dane.nazwisko + '"'); 
        //this.odczytaj_goscie(5);    
      }
      else
      {
      this.http.post(this.komunikacja.getURL() + 'goscie/', data, httpOptions).subscribe( 
        data =>  {
  
  //console.log(data)        
                let wynik = JSON.parse(JSON.stringify(data));
                if (wynik.wynik == true) 
                {
                  //this.changeCzasDedala( wynik.czas );
                  this.funkcje.addLiniaKomunikatuInfo(this.funkcje.getDedal().osoba,'Zapisano "zmiana: [' + zmiana + (stan ? ' = on':' = off') + ']  dla: ' + dane.imie + ' ' + dane.nazwisko + '"') 
                }
                else
                {
                  this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba,'Błąd zapisu "zmiana: [' + zmiana + ']  dla: ' + dane.imie + ' ' + dane.nazwisko + '" - ponawiam: ' + licznik); 
                  setTimeout(() => {this.zapisz_goscie(--licznik, zmiana, dane, stan)}, 1000) 
                }
                  },
        error => {
  //console.log(error)         
                  this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba,'Błąd połączenia "zmiana: [' + zmiana + ']  dla: ' + dane.imie + ' ' + dane.nazwisko + '" - ponawiam: ' + licznik); 
                  setTimeout(() => {this.zapisz_goscie(--licznik, zmiana, dane, stan)}, 1000) 
                 }
                 )      
      }
    }      
/* (end) osoby dodatkowe*/  


private OdczytajInni = new Subject<any>();
OdczytajInni$ = this.OdczytajInni.asObservable()
private odczytaj_inni(licznik : number)
  {
    if (licznik == 0) 
    {
      
      //this.OdczytajInni.next('osoby');
      this.funkcje.addLiniaKomunikatuKrytyczny(this.funkcje.getDedal().osoba,'NIE UDAŁO SIĘ WCZYTAĆ Inni');
    }
    else
    {
    this.http.get(this.komunikacja.getURL() + 'inni/').subscribe( 
      data =>  {
        let wynik = JSON.parse(JSON.stringify(data));    
        if (wynik.wynik == true) 
        {
          let osoby = Array();  
          for (let index = 0; index < wynik.osoby.length; index++) {
              osoby = [...osoby, (wynik.osoby[index])];
          } 
          if (wynik.stan == 'START')
          {
            this.OdczytajInni.next(osoby);
            setTimeout(() => {this.odczytuj_inni()}, 1000)
            this.funkcje.addLiniaKomunikatuInfo(this.funkcje.getDedal().osoba,'Wczytano Inni')
          } 
          else
          {         
          this.OdczytajInni.next(osoby);
          setTimeout(() => {this.odczytuj_inni()}, 1000)
          this.funkcje.addLiniaKomunikatuInfo(this.funkcje.getDedal().osoba,'Wczytano Inni - stan oryginalny')
          }
        }
        else
        {
          this.OdczytajInni.next('');
          this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba,'Błąd odczytu Inni - ponawiam: ' + licznik);
          setTimeout(() => {this.odczytaj_inni(--licznik)}, 1000)
        }
                        
               },
      error => {
                
                this.OdczytajInni.next('');
                this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba,'Błąd połączenia Inni - ponawiam:' + licznik);
                setTimeout(() => {this.odczytaj_inni(--licznik)}, 1000)
               }
               )      
    }
  }


    private OdczytujInni = new Subject<any>();
    OdczytujInni$ = this.OdczytujInni.asObservable()
    private odczytuj_inni()
    {
      this.http.get(this.komunikacja.getURL() + 'inni/').subscribe( 
        data =>  {
          let wynik = JSON.parse(JSON.stringify(data));    
          if (wynik.wynik == true) 
          {
            let osoby: Osoby[] = [];  
              for (let index = 0; index < wynik.osoby.length; index++) {
                  osoby = [...osoby, (wynik.osoby[index])];
              } 
              this.OdczytujInni.next(osoby);
              setTimeout(() => {this.odczytuj_inni()}, 1000)
          }
          else
          {
            this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba,'Błąd odczytu Inni - ponawiam: ');
            setTimeout(() => {this.odczytuj_inni()}, 1000)
          }
                          
                 },
        error => {
                  this.funkcje.addLiniaKomunikatuAlert(this.funkcje.getDedal().osoba,'Błąd połączenia Inni  - ponawiam:');
                  setTimeout(() => {this.odczytuj_inni()}, 1000)
                 }
                 )      
    }
}
