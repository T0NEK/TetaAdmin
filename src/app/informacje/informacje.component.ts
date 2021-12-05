import { Component, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { StaleService } from '../stale.service';



//import * as $ from 'jquery';


@Component({
  selector: 'app-informacje',
  templateUrl: './informacje.component.html',
  styleUrls: ['./informacje.component.css']
})
export class InformacjeComponent implements OnInit, OnDestroy {

  czas_rzeczywisty: any;
  czas_rzeczywisty_uplyw = '1:15';
  czas_na_dedalu = '2043.03.11 02:16:00';
  czas_od_startu_uplyw = '1:15';

  czas_rzeczywisty_id: any;
  

  @Output() bufor = new EventEmitter<string>();

  constructor(private stale: StaleService) {
    
  }

  ngOnInit() 
  {
  console.log(this.stale.getCzasStartu());    
  this.czas_rzeczywisty_id = setInterval(() => { this.czas_rzeczywisty_zmien()  }, 1000);
  }

  ngOnDestroy() 
  {
    if (this.czas_rzeczywisty_id) { clearInterval(this.czas_rzeczywisty_id); }
  }

  czas_rzeczywisty_zmien()
  { 
    this.czas_rzeczywisty = Date.now();  
    this.czas_na_dedalu = this.stale.getCzasStartu()
  }


  

  
}
