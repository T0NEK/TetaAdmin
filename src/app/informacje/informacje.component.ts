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
  private czas_rzeczywisty_subscribe_i = new Subscription();
  private czas_startu_subscribe_i = new Subscription();
  private czas_startu_akcji_subscribe_i = new Subscription();
  private czas_startstop_subscribe_i = new Subscription();
  
  
  czas_rzeczywisty_uplyw = 'upływ-R';
  czas_na_dedalu: any;
  czas_od_startu_uplyw = 'upływ-S';
  czas_startu: any;
  stan: any;

  constructor(private komunikacja: KomunikacjaService) 
  {
    //console.log(' constr informacje')
    
    this.czas_rzeczywisty_subscribe_i = komunikacja.czasRzeczywisty$.subscribe
           ( data => { this.czas_rzeczywisty = data } );  
    this.czas_startu_subscribe_i = komunikacja.GetCzasStartuNew$.subscribe
           ( data => { this.czas_startu = data; } );
           this.czas_startu_akcji_subscribe_i = komunikacja.OdczytajCzasDedala$.subscribe
           ( data => { this.czas_na_dedalu = data; } );
    this.czas_startstop_subscribe_i = komunikacja.OdczytajStartStop$.subscribe
           ( data => { this.stan = data; } );
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
    this.czas_rzeczywisty_subscribe_i.unsubscribe();
    this.czas_startu_subscribe_i.unsubscribe();    
    this.czas_startu_akcji_subscribe_i.unsubscribe();
    this.czas_startstop_subscribe_i.unsubscribe();
  }

  
  

}
