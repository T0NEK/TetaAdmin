import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { KomunikacjaService } from './komunikacja.service';
import { HttpClient} from '@angular/common/http';
import { FunkcjeWspolneService } from './funkcje-wspolne.service';

@Injectable({ providedIn: 'root'})

export class OsobyService 
{
private httpURL: any

constructor(private funkcje: FunkcjeWspolneService, private komunikacja: KomunikacjaService, private http: HttpClient)
{
    console.log('osoby con');
    //this.odczytaj_osoby(5);
}


private OdczytajOsoby = new Subject<any>();
OdczytajOsoby$ = this.OdczytajOsoby.asObservable()
private odczytaj_osoby(licznik : number)
  {
    if (licznik == 0) 
    {
      
      this.OdczytajOsoby.next('osoby');
      this.funkcje.addLiniaKomunikatu('NIE UDAŁO SIĘ ODCZYTAĆ "czas startu akcji na Dedalu" ','red');
    }
    else
    {
    this.http.get(this.komunikacja.getURL() + 'osoby/').subscribe( 
      data =>  {
        let wynik = JSON.parse(JSON.stringify(data));
        console.log(wynik)
        if (wynik.wynik == true) 
        {
          if (wynik.stan == 'START')
          {
            this.funkcje.addLiniaKomunikatu('Parametry po Restarcie Aplikacji: "czas startu akcji na Dedalu": ' + wynik.czasnew ,'red')
            
            this.OdczytajOsoby.next('');
         } 
          else
          {         
          this.OdczytajOsoby.next('');
          this.funkcje.addLiniaKomunikatu('Odczytano "czas startu akcji na Dedalu": ' + wynik.czasorg ,'')
          }
        }
        else
        {
          this.OdczytajOsoby.next('');
          this.funkcje.addLiniaKomunikatu('Błąd odczytu "czas startu akcji na Dedalu" - ponawiam: ' + licznik,'rgb(199, 100, 43)');
          setTimeout(() => {this.odczytaj_osoby(--licznik)}, 1000)
        }
                        
               },
      error => {
                
                this.OdczytajOsoby.next("");
                this.funkcje.addLiniaKomunikatu('Błąd połączenia "czas startu akcji na Dedalu" - ponawiam: ' + licznik,'rgb(199, 100, 43)');
                setTimeout(() => {this.odczytaj_osoby(--licznik)}, 1000)
               }
               )      
    }
  }



}
