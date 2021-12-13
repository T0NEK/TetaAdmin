import { Component, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { KomunikacjaService } from '../komunikacja.service';

//import * as $ from 'jquery';


@Component({
  selector: 'app-informacje',
  templateUrl: './informacje.component.html',
  styleUrls: ['./informacje.component.css']
})
export class InformacjeComponent implements OnInit, OnDestroy {

  //private ngUnsubscribe = new Subject();
  czas_rzeczywisty: any;
  private czas_rzeczywisty_subscribe = new Subscription();

  czas_rzeczywisty_uplyw = '1:15';
  czas_na_dedalu = '2043.03.11 02:16:00';
  czas_od_startu_uplyw = '1:15';

  czas_rzeczywisty_id: any;
  private czas_startu_org: string;
  

  name = 'jeszcze nie';
  
  constructor(private komunikacja: KomunikacjaService) 
  {
    console.log(' constr informacje')

    this.czas_startu_org = komunikacja.getCzasStartu();
    
    this.czas_rzeczywisty_subscribe = komunikacja.czasRzeczywisty$.subscribe
    ( data => 
      { this.czas_rzeczywisty = data; 
      }
    );  
    this.komunikacja.addLiniaKomunikatu('uruchomiono moduł Administratora','');
    this.komunikacja.addLiniaKomunikatu('uruchomiono czas rzeczywisty','');
  }

    ngOnInit() 
  {
  //console.log(this.stale.getCzasStartu());   
  console.log(' OnInit informacje')
  }

  ngOnDestroy() 
  {
    this.czas_rzeczywisty_subscribe.unsubscribe();
  }

    czas_rzeczywisty_zmien()
  { 
//    this.czas_rzeczywisty = Date.now();  
//    this.czas_na_dedalu = this.stale.getCzasStartu()
  }
  
  

}
