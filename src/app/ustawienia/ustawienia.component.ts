import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { KomunikacjaService } from '../komunikacja.service';
import { Wiersze } from '../wiersze';

@Component({
  selector: 'app-ustawienia',
  templateUrl: './ustawienia.component.html',
  styleUrls: ['./ustawienia.component.css'],
  changeDetection : ChangeDetectionStrategy.OnPush
  })
export class UstawieniaComponent implements OnInit, AfterViewInit, OnDestroy {

  public isCollapsed = true;
  private tablicazawartoscisubscribe = new Subscription();
  tablicazawartosci: Wiersze [] = [];  
  @ViewChild('scrollViewportUstawienia')
  VSVUstawienia!: CdkVirtualScrollViewport;
  private zakladkasubscribe = new Subscription();

   
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

  start_larpa()
  {
    this.komunikacja.addLiniaKomunikatu('start_larpa','')
  }
  
}
