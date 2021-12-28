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
  buttonSTOPdisabled!: boolean;
  private startstop_subscribe_sl = new Subscription();


  constructor(private komunikacja: KomunikacjaService) 
   {
    this.startstop_subscribe_sl = komunikacja.GetStartStop$.subscribe
           ( data => {
                      this.buttonSTARTdisabled = ( data == 'STOP' ? false:true);
                      this.buttonSTOPdisabled = ( data == 'STOP' ? true:false);
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
