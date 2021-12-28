import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { KomunikacjaService } from '../komunikacja.service';

@Component({
  selector: 'app-ustawienia-start-larpa',
  templateUrl: './ustawienia-start-larpa.component.html',
  styleUrls: ['./ustawienia-start-larpa.component.css']
})
export class UstawieniaStartLarpaComponent implements OnInit, OnDestroy {

  buttonSTARTdisabled: boolean;
  buttonSTOPdisabled: boolean;
  private czas_startstop_subscribe_sl = new Subscription();


  constructor(private komunikacja: KomunikacjaService) 
   {
    this.buttonSTARTdisabled = komunikacja.getStartStop();
    this.buttonSTOPdisabled = !komunikacja.getStartStop();
    this.czas_startstop_subscribe_sl = komunikacja.OdczytajStartStop$.subscribe
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
  this.czas_startstop_subscribe_sl.unsubscribe();
}

start()
  {
    //this.komunikacja.zapisz_data_startu(10, this.inputDSvalue._i.year.toString(), (this.inputDSvalue._i.month + 1).toString(), this.inputDSvalue._i.date.toString(), this.timeDataStartuNew.hour.toString(), (this.timeDataStartuNew.minute).toString(), this.timeDataStartuNew.second.toString());
    this.komunikacja.setStart();
  }

stop()
{
  //this.komunikacja.changeGetCzasStartuNew( this.czas_startu_org );
  this.komunikacja.setStop()
}

}
