import { Component, OnInit } from '@angular/core';
import { KomunikacjaService } from "../komunikacja.service";

@Component({
  selector: 'app-wiadomosci',
  templateUrl: './wiadomosci.component.html',
  styleUrls: ['./wiadomosci.component.css']
})
export class WiadomosciComponent implements OnInit {

  czas_rzeczywisty: any;

  constructor(private komunikacja: KomunikacjaService) 
  { 
    komunikacja.czasRzeczywisty$.subscribe(
      data => 
      {
        this.czas_rzeczywisty = data;
      }
    );  
    this.komunikacja.taktujCzas();  
  }

  ngOnInit() 
  {
    
  }

}
