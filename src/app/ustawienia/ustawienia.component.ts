import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { FunkcjeWspolneService } from '../funkcje-wspolne.service';
import { Wiersze } from '../wiersze';


@Component({
  selector: 'app-ustawienia',
  templateUrl: './ustawienia.component.html',
  styleUrls: ['./ustawienia.component.css'],
  providers: [],
  //changeDetection : ChangeDetectionStrategy.OnPush
  })


export class UstawieniaComponent implements OnInit, AfterViewInit, OnDestroy {

  private tablicazawartoscisubscribe = new Subscription();
  tablicazawartosci: Wiersze [] = [];  
  @ViewChild('scrollViewportUstawienia') VSVUstawienia!: CdkVirtualScrollViewport;
  private zakladkasubscribe = new Subscription();
  
  
   
  constructor(private funkcje: FunkcjeWspolneService,private changeDetectorRef: ChangeDetectorRef) 
  {
  
    this.tablicazawartoscisubscribe = funkcje.LiniaKomunikatu$.subscribe
    ( data => 
      { 
        this.tablicazawartosci = [...this.tablicazawartosci, data]; 
        let count = this.VSVUstawienia.getDataLength()
        changeDetectorRef.detectChanges();
        this.VSVUstawienia.scrollToIndex((count), 'smooth')
      }
    );  
    /*
    this.zakladkasubscribe = czasy.PrzelaczZakladka$.subscribe
    ( data =>
      {
        if (data == 2) {
               let count = this.VSVUstawienia.getDataLength();
               changeDetectorRef.detectChanges();
               this.VSVUstawienia.scrollToIndex((count), 'smooth')
              }
      }
    );
    */
  }

  
  ngOnInit() 
  {
  }

  ngAfterViewInit()
  {
    this.tablicazawartosci = this.funkcje.getLinieDialogu(); 
    this.changeDetectorRef.detectChanges();
  } 

  ngOnDestroy()
  {
    this.tablicazawartoscisubscribe.unsubscribe();
    this.zakladkasubscribe.unsubscribe();
  }
  
}
