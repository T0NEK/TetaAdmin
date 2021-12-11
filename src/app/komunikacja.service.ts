import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, Inject, LOCALE_ID, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { Wiersze } from './wiersze';

@Injectable({ providedIn: 'root'})


export class KomunikacjaService implements OnDestroy
{
  private czas_rzeczywisty: any;
  private czas_rzeczywisty_id: any;
  private httpURL = 'http://localhost/TetaPhp/Admin/';
  private czas_startu: any;
  private linieDialogu: Wiersze[] = [];
  private wysokosc_nawigacja = 0;
    
  constructor(private http: HttpClient, @Inject(LOCALE_ID) private locate : string) 
  {
    this.taktujCzas();
    this.odczytaj_czas_startu();
    
  }
 
  ngOnDestroy() 
  {
    if (this.czas_rzeczywisty_id) { clearInterval(this.czas_rzeczywisty_id); }
  }


  getCzasRzeczywisty() { return formatDate(this.czas_rzeczywisty, 'yyyy.MM.dd  HH:mm:ss', this.locate) }

  getCzasStartu() { return this.czas_startu }
  getLinieDialogu() { return this.linieDialogu }
  addLinieDialogu(linia: any) 
    {
     this.linieDialogu.push(linia); 
     this.linieDialogu = [...this.linieDialogu];   
    }
  getWysokoscNawigacji() { return this.wysokosc_nawigacja};
  setWysokoscNawigacji(wysokosc: number) { this.wysokosc_nawigacja = wysokosc};
  
  private odczytaj_czas_startu()
  {
    this.czas_startu = '2045.03.03';    
    this.http.get(this.httpURL + 'czas_startu_data.php').subscribe( data => {
        this.czas_startu = data;
        }, error => console.error(error));
  
  }



  private czasRzeczywisty = new Subject<any>();
  czasRzeczywisty$ = this.czasRzeczywisty.asObservable();
  taktujCzas() { 
      this.czas_rzeczywisty = Date.now();    
      this.czas_rzeczywisty_id = setInterval(() => { 
      this.czas_rzeczywisty = Date.now();
      this.czasRzeczywisty.next( this.czas_rzeczywisty ) }, 1000); 
      }
    
  private LiniaKomunikatu = new Subject<any>();
  LiniaKomunikatu$ = this.LiniaKomunikatu.asObservable();
  addLiniaKomunikatu(linia: string, kolor: string)
  {
    this.addLinieDialogu({'data':this.getCzasRzeczywisty(), 'name': 'dedal', 'kolor': kolor, 'tekst': linia})
    this.LiniaKomunikatu.next(this.getLinieDialogu());
  }

   
}
