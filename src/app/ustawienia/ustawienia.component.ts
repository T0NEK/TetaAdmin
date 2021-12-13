import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { KomunikacjaService } from '../komunikacja.service';
import { Wiersze } from '../wiersze';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';

@Component({
  selector: 'app-ustawienia',
  templateUrl: './ustawienia.component.html',
  styleUrls: ['./ustawienia.component.css'],
  changeDetection : ChangeDetectionStrategy.OnPush
  })
export class UstawieniaComponent implements OnInit, AfterViewInit, OnDestroy {

  public isCollapsedData = true;
  public isCollapsedStart = true;
  private tablicazawartoscisubscribe = new Subscription();
  tablicazawartosci: Wiersze [] = [];  
  @ViewChild('scrollViewportUstawienia')
  VSVUstawienia!: CdkVirtualScrollViewport;
  private zakladkasubscribe = new Subscription();
  events: string = 'null';
  

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.events = (`${event.value}`);
  }
   
  constructor(private komunikacja: KomunikacjaService,private changeDetectorRef: ChangeDetectorRef) 
  {
    console.log('konstruktor ustawienia')
    
    
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
    console.log('onInit ustawienia');
  }

  ngAfterViewInit()
  {
    console.log('AV dialog')
    this.tablicazawartosci = this.komunikacja.getLinieDialogu(); 
    //let count = this.VSVUstawienia.getDataLength()
    this.changeDetectorRef.detectChanges();
    //this.VSVUstawienia.scrollToIndex((count), 'smooth');
    //console.log(count)
  } 

  ngOnDestroy()
  {
    console.log('dest ustawienia')
    this.tablicazawartoscisubscribe.unsubscribe();
    this.zakladkasubscribe.unsubscribe();
  }

  data_startu()
  {
    console.log(this.events)
    if (this.events == 'null') {console.log(this.events)}
  }
  start_larpa()
  {
    this.komunikacja.addLiniaKomunikatu('start_larpa','')
  }
  
}
