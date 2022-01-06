import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { KomunikacjaService } from './komunikacja.service';
import { HttpClient} from '@angular/common/http';
import { FunkcjeWspolneService } from './funkcje-wspolne.service';
import { Osoby } from './definicje';

@Injectable({ providedIn: 'root'})

export class OsobyService 
{
    
constructor(private funkcje: FunkcjeWspolneService, private komunikacja: KomunikacjaService, private http: HttpClient)
{
    console.log('osoby con');
    //this.odczytaj_osoby(5);
}

wczytajOsoby(licznik: number)
{
    this.odczytaj_osoby(licznik);
}

private OdczytajOsoby = new Subject<any>();
OdczytajOsoby$ = this.OdczytajOsoby.asObservable()
private odczytaj_osoby(licznik : number)
  {
    if (licznik == 0) 
    {
      
      this.OdczytajOsoby.next('osoby');
      this.funkcje.addLiniaKomunikatu('NIE UDAŁO SIĘ ODCZYTAĆ "czas startu akcji na Dedalu" ', 'red');
    }
    else
    {
    this.http.get(this.komunikacja.getURL() + 'osoby/').subscribe( 
      data =>  {
        let wynik = JSON.parse(JSON.stringify(data));    
        if (wynik.wynik == true) 
        {
          if (wynik.stan == 'START')
          {
            let osoby = Array();  
            this.funkcje.addLiniaKomunikatu('Wczytano Osoby po Restarcie Aplikacji', 'red')
            for (let index = 0; index < wynik.osoby.length; index++) {
                osoby = [...osoby, (wynik.osoby[index])];
            } 
            this.OdczytajOsoby.next(osoby);
         } 
          else
          {         
          this.OdczytajOsoby.next('');
          this.funkcje.addLiniaKomunikatu('Wczytano Osoby', '')
          }
        }
        else
        {
          this.OdczytajOsoby.next('');
          this.funkcje.addLiniaKomunikatu('Błąd odczytu Osoby - ponawiam: ' + licznik,'rgb(199, 100, 43)');
          setTimeout(() => {this.odczytaj_osoby(--licznik)}, 1000)
        }
                        
               },
      error => {
                
                this.OdczytajOsoby.next("");
                this.funkcje.addLiniaKomunikatu('Błąd połączenia Osoby  - ponawiam:' + licznik,'rgb(199, 100, 43)');
                setTimeout(() => {this.odczytaj_osoby(--licznik)}, 1000)
               }
               )      
    }
  }



}
