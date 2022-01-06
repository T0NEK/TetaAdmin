import { Component, OnInit } from '@angular/core';
import { OsobyService } from '../osoby.service';

@Component({
  selector: 'app-uzytkownicy',
  templateUrl: './uzytkownicy.component.html',
  styleUrls: ['./uzytkownicy.component.css']
})
export class UzytkownicyComponent implements OnInit {

  myTextVal = '';

  constructor(private osoby: OsobyService)
   {
    // console.log(osoby.getURL())
   }

   
  ngOnInit() 
  {
  
  }

}
