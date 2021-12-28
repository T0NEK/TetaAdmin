import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
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
  selector: 'app-ustawienia-czas-startu',
  templateUrl: './ustawienia-czas-startu.component.html',
  styleUrls: ['./ustawienia-czas-startu.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],changeDetection : ChangeDetectionStrategy.OnPush
  })

export class UstawieniaCzasStartuComponent implements OnInit, AfterViewInit, OnDestroy {
  
  events: any;
  buttonDSNdisabled: boolean;
  buttonDSOdisabled: boolean;
  inputDSvalue : any;
  czas_startu_org!: string;
  czas_startu_new!: string;
  private czas_startu_new_subscribe = new Subscription();
  timeDataStartuNew: NgbTimeStruct  = { hour: 12, minute: 0, second: 0};
  seconds = true;
  
  constructor(private komunikacja: KomunikacjaService) 
  {
   this.czas_startu_new_subscribe = komunikacja.OdczytajCzasStartu$.subscribe
     ( data => { this.czas_startu_org = data; } )
   this.buttonDSNdisabled = true;
   this.buttonDSOdisabled = true;       
  }

ngOnInit() 
  { }

ngAfterViewInit()
  { } 

ngOnDestroy()
  {
    this.czas_startu_new_subscribe.unsubscribe();
  }

addEvent(type: string, event: MatDatepickerInputEvent<Date>) 
  {
   this.buttonDSNdisabled = false;   
  }

data_startu_new()
  {
    this.komunikacja.zapisz_data_startu(10, this.inputDSvalue._i.year.toString(), (this.inputDSvalue._i.month + 1).toString(), this.inputDSvalue._i.date.toString(), this.timeDataStartuNew.hour.toString(), (this.timeDataStartuNew.minute).toString(), this.timeDataStartuNew.second.toString());
    this.buttonDSOdisabled = false;
  }

data_startu_org()
{
  this.komunikacja.oryginalna_data_startu(10);
  this.buttonDSOdisabled = true;
}


}
