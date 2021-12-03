import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-informacje',
  templateUrl: './informacje.component.html',
  styleUrls: ['./informacje.component.css']
})
export class InformacjeComponent implements OnInit {

  czas_rzeczywisty = '2021.12.02 23:12';
  czas_rzeczywisty_uplyw = '1:15';
  czas_na_dedalu = '2043.03.11 02:16:00';
  czas_od_startu_uplyw = '1:15';

  constructor() { }

  ngOnInit() 
  {
    
  }

}
