import { AfterViewInit, ChangeDetectionStrategy, Component, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { KomunikacjaService } from '../komunikacja.service';
import { MatDatepickerInputEvent} from '@angular/material/datepicker';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as _moment from 'moment';
import {defaultFormat as _rollupMoment} from 'moment';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: 'YYYY.MM.DD',
    monthYearLabel: 'MM YYYY',
    dateA11yLabel: 'YYYY.MM.DD',
    monthYearA11yLabel: 'MM YYYY',
  },
};

@Component({
  selector: 'app-ustawienia-czas-na-dedalu',
  templateUrl: './ustawienia-czas-na-dedalu.component.html',
  styleUrls: ['./ustawienia-czas-na-dedalu.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],changeDetection : ChangeDetectionStrategy.OnPush
  })

export class UstawieniaCzasNaDedaluComponent implements OnInit, AfterViewInit, OnDestroy, DoCheck {

  events: any;
  buttonDSANdisabled: boolean;
  buttonDSAOdisabled: boolean;
  inputDSvalue : any;
  czas_startu_org!: string;
  czas_startu_new!: string;
  private czas_startu_akcji_subscribe = new Subscription();
  timeDataStartuNew: NgbTimeStruct  = { hour: 12, minute: 0, second: 0};
  seconds = true;
  
  constructor(private komunikacja: KomunikacjaService) 
  {
   this.czas_startu_akcji_subscribe = komunikacja.OdczytajCzasDedala$.subscribe
     ( data => {
        this.czas_startu_org = data; 
        } )
   this.buttonDSANdisabled = true;
   this.buttonDSAOdisabled = true;     
  }

ngOnInit() 
  {
  }

ngAfterViewInit()
  { 
  } 

ngDoCheck() 
  {
  
  }

ngOnDestroy()
  {
    this.czas_startu_akcji_subscribe.unsubscribe();
  }

addEvent(type: string, event: MatDatepickerInputEvent<Date>) 
  {
   this.buttonDSANdisabled = false;   
  }

data_startu_new()
  {
    this.komunikacja.zapisz_data_akcji(10, this.inputDSvalue._i.year.toString(), (this.inputDSvalue._i.month + 1).toString(), this.inputDSvalue._i.date.toString(), this.timeDataStartuNew.hour.toString(), (this.timeDataStartuNew.minute).toString(), this.timeDataStartuNew.second.toString());
    this.buttonDSAOdisabled = false;
  }

data_startu_org()
{
  this.komunikacja.changeCzasStartuNew( this.czas_startu_org );
  this.buttonDSAOdisabled = true;
}


}
