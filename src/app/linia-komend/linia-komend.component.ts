import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AppComponent } from '../app.component';
import { FunkcjeWspolneService } from '../funkcje-wspolne.service';

@Component({
  selector: 'app-linia-komend',
  templateUrl: './linia-komend.component.html',
  styleUrls: ['./linia-komend.component.css']
})


export class LiniaKomendComponent implements OnInit {

  szerokoscInput: any;
  maxLenght: number;
  @ViewChild('liniaInput') liniaInput!: ElementRef;
  linia = '';
  private pozycja = 0;
  haslo = false;

constructor(private funkcje: FunkcjeWspolneService, private all: AppComponent)
 {
  this.szerokoscInput = all.szerokoscAll - 16;     
  this.maxLenght = funkcje.iloscZnakowwKomend;  
}

  ngOnInit() {
  }

  Zmiana(event: any)
  {
    
  }

  ClearLinia()
  {
    this.linia = '';
    this.liniaInput.nativeElement.value = '';
    this.pozycja = 0;
    this.szerokoscInput = this.all.szerokoscAll;
    this.liniaInput.nativeElement.focus();
  } 


WybranoEnter(linia: string)
{

}
}
