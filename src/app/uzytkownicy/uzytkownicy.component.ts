import { Component, OnInit } from '@angular/core';
import { KomunikacjaService } from "../komunikacja.service";

@Component({
  selector: 'app-uzytkownicy',
  templateUrl: './uzytkownicy.component.html',
  styleUrls: ['./uzytkownicy.component.css']
})
export class UzytkownicyComponent implements OnInit {

  myTextVal = '';

  constructor(private komunikacja: KomunikacjaService)
   {
    
   }

   sendTextValue(){
    this.komunikacja.passValue('cześć');
  }

  sendTaktujCzas(){
    this.komunikacja.taktujCzas();
  }

  ngOnInit() {
  }

}
