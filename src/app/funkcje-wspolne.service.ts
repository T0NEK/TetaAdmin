import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { Kolory, Linia, Nazwa, Wiersze, Zalogowany } from './definicje';

@Injectable({
  providedIn: 'root'
})
export class FunkcjeWspolneService {

  private kolory: Kolory;
  private dedal = {"osoba": 'dedal'};
  private osoba: Zalogowany;
  public iloscZnakowwKomend = 60;

constructor()
 {
  this.kolory = {"info": "", "alert": "rgb(199, 100, 43)", "krytyczny": "red", "liniakomend": "rgb(00, 123, 255)", "zalogowany": "rgb(230, 255, 0)", "wylogowany": "white"}
 
  this.osoba =  { 'zalogowany': 0, 'imie': 'dedal', 'nazwisko': '', 'funkcja': '', 'rodzaj': '','kolor': "white"} 

  this.znaki = this.znaki.concat('',' ',this.klw11,this.klw11alt,this.klw12,this.klw12alt,this.klw12caps,this.klw21,this.klw21caps,this.klw22,this.klw22caps)
  this.dluznaki = this.dluznaki.concat(0,2.45,this.dlu11,this.dlu11alt,this.dlu12,this.dlu12alt,this.dlu12caps,this.dlu21,this.dlu21caps,this.dlu22,this.dlu22caps)

}



private ZmianyZakladek = new Subject<any>();
ZmianyZakladek$ = this.ZmianyZakladek.asObservable()
setZmianyZakladek(zakladka: number, stan: boolean)
{
this.ZmianyZakladek.next({"zakladka": zakladka, "stan": stan})
}


getKolor() : Kolory { return this.kolory }; 

getDedal() { return this.dedal };

getZalogowany() { return this.osoba };

private Zalogowany = new Subject<any>();
Zalogowany$ = this.Zalogowany.asObservable();
setZalogowany(zalogowany: any, nadawcy: any) 
 {
  this.osoba.zalogowany = zalogowany.id;
  this.osoba.imie = zalogowany.imie;
  this.osoba.nazwisko = zalogowany.nazwisko;
  this.osoba.funkcja = zalogowany.funkcja;
  this.osoba.rodzaj = zalogowany.rodzaj;
  this.osoba.kolor = 'white';
  if (this.osoba.zalogowany == 0)
  {
    this.addLiniaKomunikatuKolor(this.getDedal().osoba,'pracujesz bez kontekstu osoby', 'yellow')
    this.Zalogowany.next({"zalogowany": this.osoba, "nadawcy": nadawcy})
  }
  else
  {
    this.addLiniaKomunikatuKolor(this.getDedal().osoba,'pracujesz w kontekście: ' + this.osoba.imie + ' ' + this.osoba.nazwisko + ( (this.osoba.funkcja.length !=  0) ? ' (' + this.osoba.funkcja + ') ' : ''), 'yellow')
    this.Zalogowany.next({"zalogowany": this.osoba, "nadawcy": nadawcy})
  }
 }

 private Odbiorca = new Subject<any>();
 Odbiorca$ = this.Odbiorca.asObservable();
 odbiorca(tabelaosoby: any)
 {
  this.Odbiorca.next(tabelaosoby)
 }

 private OdbiorcaPolecenia = new Subject<any>();
 OdbiorcaPolecenia$ = this.OdbiorcaPolecenia.asObservable();
 odbiorcapolecenia(item: any)
 {
  this.OdbiorcaPolecenia.next(item)
 }



 private ZakladkaDialogu = new Subject<any>();
 ZakladkaDialogu$ = this.ZakladkaDialogu.asObservable();
 setzakladkadialogu(event: any)
 {
   this.ZakladkaDialogu.next(event);
 }



  setTextNazwa(prefix: string, text: string, sufix: string, kolor: string, rodzaj: string):Nazwa
  {
    //console.log('tx', (typeof prefix === "string" ? prefix : '' ) + (typeof text === "string" ? text : '' ) + (typeof sufix === "string" ? sufix : '' ))
    //console.log('dl', this.DlugoscTekstu(typeof prefix === "string" ? prefix : '' ) + this.DlugoscTekstu(typeof text === "string" ? text : '' ) + this.DlugoscTekstu(typeof sufix === "string" ? sufix : '' ))
    return {
      "prefix": (typeof prefix === "string" ? prefix : "" ),
      "text": (typeof text === "string" ? text : "" ),
      "sufix": (typeof sufix === "string" ? sufix : "" ),
      "kolor": (typeof kolor === "string" ? kolor : "" ),
      "rodzaj": (typeof rodzaj === "string" ? rodzaj : "tekst" ),
      "dlugosc": this.DlugoscTekstu(typeof prefix === "string" ? prefix : '' ) + this.DlugoscTekstu(typeof text === "string" ? text : '' ) + this.DlugoscTekstu(typeof sufix === "string" ? sufix : '' ) + 4
    }
  }
  
  setNazwaLinia(prefix: string, nazwa: Nazwa[], sufix: string):Linia
  {
    let dlugosc = 0;
    //console.log('1',(typeof prefix === "string" ? prefix : '' ) + (typeof sufix === "string" ? sufix : '' ))
    //console.log(this.DlugoscTekstu(typeof prefix === "string" ? prefix : '' ) + dlugosc + this.DlugoscTekstu(typeof sufix === "string" ? sufix : '' ))
    for (let index = 0; index < nazwa.length; index++) 
    { 
      //console.log('2-',index,'- ', nazwa[index])
      //console.log('3-',index,'- ',nazwa[index].dlugosc)
      dlugosc = dlugosc + nazwa[index].dlugosc 
    }
    //console.log('4',dlugosc)
    return {
      "prefix":  (typeof prefix === "string" ? prefix:"" ),
      "text": nazwa, 
      "sufix": (typeof sufix === "string" ? sufix:"" ),
      "dlugosc": this.DlugoscTekstu(typeof prefix === "string" ? prefix : '' ) + dlugosc + this.DlugoscTekstu(typeof sufix === "string" ? sufix : '' ) + 4
    }
  }
  
  setLiniaWiersz(data: string, przed: string, name: string, po: string, prefix: string, linia: Linia[], sufix: string):Wiersze
  {
    return {'data':data, 
            'name': przed + name + po,
            'prefix': prefix,
            'linia': linia,
            'sufix': sufix
            }
  }
  
  addLiniaKomunikatuPolecenia(name: string, blad: string)
  {
    this.addLiniaKomunikatu("", name, "", "", [this.setNazwaLinia("", [this.setTextNazwa("", blad, "", this.getKolor().zalogowany, "liniakomend")], "")], "");
  }
  

addLiniaKomunikatuKolor(name: string, blad: string, kolor: string)
  {
    this.addLiniaKomunikatu("", name, "", "", [this.setNazwaLinia("", [this.setTextNazwa("", blad, "", kolor, "")], "")], "");
  }
  

addLiniaKomunikatuInfo(name: string, blad: string)
{
  this.addLiniaKomunikatu("", name, "", "", [this.setNazwaLinia("", [this.setTextNazwa("", blad, "", "", "")], "")], "");
}

addLiniaKomunikatuAlert(name: string, blad: string)
{
  this.addLiniaKomunikatu("", name, "", "", [this.setNazwaLinia("", [this.setTextNazwa("", blad, "", this.getKolor().alert, "")], "")], "");
}


addLiniaKomunikatuKrytyczny(name: string, blad: string)
{
  this.addLiniaKomunikatuKolor(name,blad,this.getKolor().krytyczny)
  //this.addLiniaKomunikatuAlert(name, blad)
  //this.addLiniaKomunikatuKolor(name, "Błąd krytyczny - terminal stop", this.getKolor().krytyczny)
  //this.addLiniaKomunikatuKolor(name, "Wezwij MG", this.getKolor().krytyczny)
}

setLiniaDialoguClear()
{
  this.LiniaKomunikatu.next({'przed': '', 'name': '', 'po': '', 'prefix': '', 'linia': '', 'sufix': '', 'clear': true});
}
  

private LiniaKomunikatu = new Subject<any>();
LiniaKomunikatu$ = this.LiniaKomunikatu.asObservable();
addLiniaKomunikatu(przed: string, name: string, po: string, prefix: string, linia: Linia[], sufix: string)
{
 this.LiniaKomunikatu.next({'przed': przed, 'name': name, 'po': po, 'prefix': prefix, 'linia': linia, 'sufix': sufix, 'clear': false})
}

addLiniaKomunikatuFormat(przed: string, name: string, po: string, prefix: string, linia: Linia[], sufix: string, szerokosc: number): Wiersze[]
{
  let wynik: Wiersze[] = []
  przed = (przed === "" ? ', ' : przed);
  po = ( po === "" ? ' > ' : po);
  let dlugosc = 0;
  let spacje = 0;
  let wiersz: Wiersze;
  for (let index = 0; index < linia.length; index++) { dlugosc = dlugosc + linia[index].dlugosc }
  let data = (moment()).format('YYYY-MM-DD HH:mm:ss');
  if ( ( this.DlugoscTekstu(data + przed + name + po + prefix + sufix) + dlugosc) < szerokosc)
  {
  wiersz = this.setLiniaWiersz (data, przed, name, po, prefix, linia, sufix);  
  wynik = [...wynik, wiersz];
  }
  else
  {
    let dlugosc = 0;
    if ( this.DlugoscTekstu(data + przed + name + po + prefix ) > szerokosc)
  {
    wiersz = this.setLiniaWiersz (data, przed, name, po, "", [], "")
    wynik = [...wynik, wiersz];
    data = "";
    name = "";
    przed = "";
    po = "";
    spacje = 10 * 2.45; // 10 spacje w html przed kolejną linią
  }
  {
    let liniaNew: Linia[] = []; 
    for (let index = 0; index < linia.length; index++) 
    {
      if ( (this.DlugoscTekstu(data + przed + name + po + prefix) + spacje + dlugosc + linia[index].dlugosc ) < szerokosc)
      {
        liniaNew = [...liniaNew,linia[index]];
        dlugosc = dlugosc + linia[index].dlugosc
      }
      else
      {
        wiersz = this.setLiniaWiersz (data, przed, name, po, prefix, liniaNew, "");
        wynik = [...wynik, wiersz];
        data = "";
        name = "";
        przed = "";
        po = "";
        prefix = "";
        liniaNew = [linia[index]];
        dlugosc =  linia[index].dlugosc;
        spacje = 10 * 2.45; // 10 spacje w html przed kolejną linią
      }
    }
  if ( ( this.DlugoscTekstu(data + przed + name + po + prefix +  sufix) + spacje + dlugosc ) < szerokosc)
  {
    wiersz = this.setLiniaWiersz (data, przed, name, po, prefix, liniaNew, sufix)
    wynik = [...wynik, wiersz];
  }
  else
  {
    wiersz = this.setLiniaWiersz (data, przed, name, po, prefix, liniaNew, "")
    wynik = [...wynik, wiersz];
    wiersz = this.setLiniaWiersz ("", "", "", "", "", [], sufix);
    wynik = [...wynik, wiersz];
    
  }      
  } 
  }
  return wynik
}


  klw11 = Array ('1','2','3','4','5','6','7','8','9','0',',','.','-',':',';','?','!','"','(',')');
  dlu11 = Array (10.1,10.1,10.1,10.1,10.1,10.1,10.1,10.1,10.1,10.1,3.54,4.74,4.97,4.37,3.8,8.5,4.64,5.75,6.15,6.25);
  klw11alt = Array ('`','~','@','#','$','%',String.fromCharCode(8240),'^','&','*','[',']','{','}','<','>');
  dlu11alt = Array (5.57,12.25,16.17,11.09,10.1,13.19,18.0,7.52,11.19,7.75,4.77,4.77,6.09,6.09,9.15,9.40);
  klw12 = Array ('ą','ć','ę','ł','ń','ó','ś','ż','ź',String.fromCharCode(8593),String.fromCharCode(8592),String.fromCharCode(8594));
  dlu12 = Array (9.79,9.41,9.54,4.87,9.94,10.27,9.29,8.92,8.92,9.0,18.0,18.0);
  klw12caps = Array ('Ą','Ć','Ę','Ł','Ń','Ó','Ś','Ż','Ź',String.fromCharCode(8593),String.fromCharCode(8592),String.fromCharCode(8594));
  dlu12caps = Array (11.75,11.72,10.24,9.7,12.84,12.39,10.69,10.79,10.79,9.0,18.0,18.0);
  klw12alt = Array ('+','-',String.fromCharCode(215),String.fromCharCode(247),'=',String.fromCharCode(8800),String.fromCharCode(177),String.fromCharCode(176),'_','/','|',String.fromCharCode(10003),String.fromCharCode(8593),String.fromCharCode(8592),String.fromCharCode(8594))
  dlu12alt = Array (10.2,4.97,9.6,10.27,9.89,9.89,9.62,6.72,8.12,7.42,4.39,13.49,9.0,18.0,18.0)
  klw21 = Array ('a','b','c','d','e','f','g','h','i','j','k','l','m');
  dlu21 = Array (9.79,10.1,9.42,10.15,9.54,6.25,10.1,9.92,4.37,4.3,9.12,4.37,15.78);
  klw21caps = Array ('A','B','C','D','E','F','G','H','I','J','K','L','M');
  dlu21caps = Array (11.75,11.2,11.72,11.8,10.24,9.95,12.27,12.84,4.9,9.94,11.29,9.69,15.72);
  klw22 = Array ('n','o','p','q','r','s','t','u','v','w','x','y','z',String.fromCharCode(8595));
  dlu22 = Array (9.94,10.27,10.1,10.24,6.09,9.29,5.89,9.92,8.72,13.54,8.92,8.52,8.92,9);
  klw22caps = Array ('N','O','P','Q','R','S','T','U','V','W','X','Y','Z',String.fromCharCode(8595));
  dlu22caps = Array (12.84,12.39,11.35,12.39,11.09,10.69,10.73,11.67,11.45,15.97,11.29,10.82,10.79,9.0);
  poprawne = Array ('&space','&back','&del','&enter');
  dlupoprawne = Array (2.45,0,0,0);


private  znaki = Array <string>();
private  dluznaki = Array <number>();

DlugoscTekstu(tekst: string): number
{
  let dlugosc = 0;
  for (let index = 0; index < tekst.length; index++) 
  {
    dlugosc = dlugosc + this.dluznaki[this.znaki.indexOf(tekst[index])];
  }
  return dlugosc
}


/* (end) dodanie lini komunikatu */ 
}
