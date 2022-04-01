export interface Nazwa
  {
    prefix: string;
    text: string;
    sufix: string;
    rodzaj: string;
    kolor: string;  
    dlugosc: number;
  }
  
export interface Linia
{
  prefix: string;
  text: Nazwa[];
  sufix: string;
  dlugosc: number;
}
  
export interface Wiersze 
   {
      data: string;
      name: string;
      prefix: string;
      linia: Linia[];
      sufix: string;
   }


export interface OsobyBaza
{
   id: number;
   imie: string;
   nazwisko: string;
   funkcja: string;
   zalogowany: boolean;
   czaslogowania: string;
   idhosta: number
   nazwahosta: string;
   iphosta: string;   
} 

  export interface Osoby extends OsobyBaza
  {
     polecenia: boolean;
     blokada: boolean;
     hannah: boolean;
     fiona: boolean;
     rajeh: boolean;
     narosl : boolean;
  }
  
  export interface Osoby2 extends OsobyBaza
  {
    wybrany?: boolean;
  }

  export interface OsobyWybrane
  {
    tab: Osoby2[];
  }

  export interface Kolory
  {
    info: string;
    alert: string;
    krytyczny: string;
    liniakomend: string;
    zalogowany: string;
    wylogowany: string;  
  }

  export interface OsobyPol
{
   id: number;
   imie: string;
   nazwisko: string;
   funkcja: string;
   dos: boolean;
  }


  export interface Polecenia
  {
      id: number; 
      podstawowe: boolean  
      nazwa: string;
      zalogowany: boolean;
      wylogowany: boolean;
      polecenie: number;
      czas: number;
      dzialania: string;
      nazwaOrg: string;
      komunikat: string;
      osoby: OsobyPol[];
  }

  export interface Notatka
  {
    id: number;  
    identyfikator: string;
    tytul :string;
    wlasciciel: number;
    wlascicielText: string;
    stan: boolean;
    stanText: string;
    czas: string;
    blokadastan: boolean;
    blokadaudo: boolean;
  }

export interface Tresc
  {
    id: number;  
    wersja: number;
    stan: boolean;
    stanText: string;
    czas: string;
    tresc: string;
  }

  export interface Udostepnienie
  {
    idosoby: number;
    idudo: number;
    czas: string;
    stanudo: string;
    autor: number;
  }

  export interface OsobyNot
{
   id: number;
   imie: string;
   nazwisko: string;
   funkcja: string;
   udost: Udostepnienie[];
  }

  export interface Zalogowany
  {
      zalogowany: number;
      imie: string;
      nazwisko: string;
      funkcja: string;
      rodzaj: string;
      kolor: string;
  }

  export interface OsobyWiadomosci
   {
      id: number;
      imie: string;
      nazwisko: string;
      funkcja: string;
      widoczny: boolean;
      wybrany: boolean;
      nowe: boolean;
  }

  export interface Wiadomosci
  {
     id: number;
     autor: number;
     autorText: string;
     odbiorca: number;
     odbiorcaText: string;
     tresc: string[];
     czas: string;
     przeczytana: boolean;
     przeczytanaadmin: boolean;
     wyslana: boolean;
     admin: boolean;
 }