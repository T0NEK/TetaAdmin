import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { KomunikacjaService } from '../komunikacja.service';
import { Wiersze } from '../wiersze';
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
  selector: 'app-ustawienia',
  templateUrl: './ustawienia.component.html',
  styleUrls: ['./ustawienia.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],changeDetection : ChangeDetectionStrategy.OnPush
  })
export class UstawieniaComponent implements OnInit, AfterViewInit, OnDestroy {

  private tablicazawartoscisubscribe = new Subscription();
  tablicazawartosci: Wiersze [] = [];  
  @ViewChild('scrollViewportUstawienia') VSVUstawienia!: CdkVirtualScrollViewport;
  private zakladkasubscribe = new Subscription();
  events: any;
  buttonDSNdisabled = true;
  buttonDSOdisabled = true;
  inputDSvalue : any;
  czas_startu_org: string;
  czas_startu_new: string;
  private czas_startu_new_subscribe = new Subscription();
  timeDataStartuNew: NgbTimeStruct  = { hour: 13, minute: 30, second: 0};
  timeDataObecna: NgbTimeStruct  = { hour: 23, minute: 0, second: 0};
  seconds = true;
  
  
   
  constructor(private komunikacja: KomunikacjaService,private changeDetectorRef: ChangeDetectorRef) 
  {
   // console.log('konstruktor ustawienia')
    this.czas_startu_org = komunikacja.getCzasStartuOrg();
    console.log(this.czas_startu_org)
    this.czas_startu_new = this.czas_startu_org;

    this.czas_startu_new_subscribe = komunikacja.OdczytajCzasStartu$.subscribe
    ( data => { this.czas_startu_org = data} )

    this.tablicazawartoscisubscribe = komunikacja.LiniaKomunikatu$.subscribe
    ( data => 
      { 
        this.tablicazawartosci = [...this.tablicazawartosci, data]; 
        let count = this.VSVUstawienia.getDataLength()
        changeDetectorRef.detectChanges();
        this.VSVUstawienia.scrollToIndex((count), 'smooth')
      }
    );  
    
    this.zakladkasubscribe = komunikacja.PrzelaczZakladka$.subscribe
    ( data =>
      {
        if (data == 2) {
               let count = this.VSVUstawienia.getDataLength();
               changeDetectorRef.detectChanges();
               this.VSVUstawienia.scrollToIndex((count), 'smooth')
              }
      }
    );
  }

  
  ngOnInit() 
  {
    //console.log('onInit ustawienia');
  }

  ngAfterViewInit()
  {
    //console.log('AV dialog')
    this.tablicazawartosci = this.komunikacja.getLinieDialogu(); 
    this.changeDetectorRef.detectChanges();
  } 

  ngOnDestroy()
  {
    //console.log('dest ustawienia')
    this.tablicazawartoscisubscribe.unsubscribe();
    this.zakladkasubscribe.unsubscribe();
    this.czas_startu_new_subscribe.unsubscribe();
  }

addEvent(type: string, event: MatDatepickerInputEvent<Date>) 
  {
   this.buttonDSNdisabled = false;   
  }

data_startu_new()
  {
    let data = _moment(this.inputDSvalue._i.year + '.' + (this.inputDSvalue._i.month + 1) + '.' + this.inputDSvalue._i.date, 'YYYY.MM.DD');
    let czas = _moment(this.timeDataStartuNew.hour + ':' + this.timeDataStartuNew.minute + ':' + this.timeDataStartuNew.second, 'HH:mm:ss');
    this.komunikacja.changeGetCzasStartuNew( data.format('YYYY.MM.DD ') + ' ' + czas.format('HH:mm:ss'));
    this.buttonDSOdisabled = false;
  }

data_startu_org()
{
  this.komunikacja.changeGetCzasStartuNew( this.czas_startu_org );
  this.buttonDSOdisabled = true;
}

start_larpa()
  {
    this.komunikacja.addLiniaKomunikatu('start_larpa','')
  }
  
}
