import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { KomunikacjaService } from '../komunikacja.service';

@Component({
  selector: 'app-ustawienia-start-larpa',
  templateUrl: './ustawienia-start-larpa.component.html',
  styleUrls: ['./ustawienia-start-larpa.component.css']
})
export class UstawieniaStartLarpaComponent implements OnInit, OnDestroy {

  buttonSTARTdisabled!: boolean;
  buttonPAUSEdisabled!: boolean;
  buttonSTOPdisabled!: boolean;
  private startstop_subscribe_sl = new Subscription();
  czas_rzeczywisty_start: any;
  czas_rzeczywisty_end: any;


  constructor(private komunikacja: KomunikacjaService) 
   {
    this.startstop_subscribe_sl = komunikacja.GetStartStop$.subscribe
           ( data => {
                      this.buttonSTARTdisabled = ( data == 'START' ? true:false);
                      this.buttonSTOPdisabled = ( data == 'STOP' ? true:false);
                      this.czas_rzeczywisty_start = komunikacja.getCzasRzeczywistyStart();
                      this.czas_rzeczywisty_end = komunikacja.getCzasRzeczywistyEnd();
                      } );
   }

ngOnInit() 
  {
  }

ngOnDestroy()
{
  this.startstop_subscribe_sl.unsubscribe();
}

start()
  {
    this.komunikacja.setStart();
  }

stop()
  {
    this.komunikacja.setStop()
  }

}
