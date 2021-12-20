import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { KomunikacjaService } from '../komunikacja.service';

//import * as $ from 'jquery';


@Component({
  selector: 'app-informacje',
  templateUrl: './informacje.component.html',
  styleUrls: ['./informacje.component.css']
})
export class InformacjeComponent implements OnInit, OnDestroy {

  czas_rzeczywisty: any;
  private czas_rzeczywisty_subscribe = new Subscription();
  private czas_startu_subscribe = new Subscription();
  private czas_startu_akcji_subscribe = new Subscription();
  //czas_rzeczywisty_id: any;
  
  
  czas_rzeczywisty_uplyw = 'upływ-R';
  czas_na_dedalu: any;
  czas_od_startu_uplyw = 'upływ-S';
  czas_startu: any;
  

  name = 'stop';
  
  constructor(private komunikacja: KomunikacjaService) 
  {
    //console.log(' constr informacje')
    
    this.czas_rzeczywisty_subscribe = komunikacja.czasRzeczywisty$.subscribe
           ( data => { this.czas_rzeczywisty = data; } );  
    this.czas_startu_subscribe = komunikacja.GetCzasStartuNew$.subscribe
           ( data => { this.czas_startu = data; } );
    this.czas_startu_akcji_subscribe = komunikacja.OdczytajCzasPoczatkuAkcji$.subscribe
           ( data => { this.czas_na_dedalu = data; } );
    this.komunikacja.addLiniaKomunikatu('uruchomiono moduł Administratora','');
    this.komunikacja.addLiniaKomunikatu('uruchomiono czas rzeczywisty','');
  }

    ngOnInit() 
  {
  //console.log(this.stale.getCzasStartu());   
  //console.log(' OnInit informacje')
  }

  ngOnDestroy() 
  {
    this.czas_rzeczywisty_subscribe.unsubscribe();
    this.czas_startu_subscribe.unsubscribe();    
    this.czas_startu_akcji_subscribe.unsubscribe();
  }

  
  

}
