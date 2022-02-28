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


export interface Osoby
{
   id: number;
   imie: string;
   nazwisko: string;
   funkcja: string;
   zalogowany: boolean;
   blokada: boolean;
   hannah: boolean;
   fiona: boolean;
   rajeh: boolean;
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
