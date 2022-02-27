import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component,  OnInit, ChangeDetectorRef, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CzasService } from '../czas.service';
import { FunkcjeWspolneService } from '../funkcje-wspolne.service'; 
import { Wiersze } from '../definicje';
import { AppComponent } from '../app.component';


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
  //changeDetection : ChangeDetectionStrategy.OnPush
})
export class DialogComponent implements OnInit, AfterViewInit, OnDestroy {

  private tablicazawartoscisubscribe = new Subscription();
  tablicazawartosci: Wiersze[] = [];  
  @ViewChild('scrollViewportDialog')  VSVDialog!: CdkVirtualScrollViewport;
  //private zakladkasubscribe = new Subscription();
  checked = true;
  height: any;

    
  //@Input() : any;
  //@Output() raport = new EventEmitter<string>();
  
  constructor(private all: AppComponent, private czasy: CzasService, private funkcje: FunkcjeWspolneService, private changeDetectorRef: ChangeDetectorRef) 
  {

    this.height = (all.wysokoscAll - all.wysokoscInfo -  all.wysokoscDialogMin - all.wysokoscPrzewijaj - 100) + 'px';
    this.tablicazawartoscisubscribe = funkcje.LiniaKomunikatu$.subscribe
    ( data => 
      { 
        if (data.clear)
        {
          this.tablicazawartosci = [];
          changeDetectorRef.detectChanges();
        }
        else
        {
        let wiersze = this.funkcje.addLiniaKomunikatuFormat(data.przed, data.name, data.po ,data.prefix, data.linia, data.sufix, all.szerokoscNawigacja - 20)
        for (let index = 0; index < wiersze.length; index++) 
        {
          //console.log('wiersz ',index,' = ',wiersze[index])
          this.tablicazawartosci = [...this.tablicazawartosci, wiersze[index]]; 
        }
        let count = this.VSVDialog.getDataLength()
        changeDetectorRef.detectChanges();
        if (this.checked) { this.VSVDialog.scrollToIndex((count), 'smooth'); }
        }
      }
    );   
    /* 
    this.zakladkasubscribe = czasy.PrzelaczZakladka$.subscribe
    ( data =>
      {
        if (data == 10) {
               let count = this.VSVDialog.getDataLength();
               changeDetectorRef.detectChanges();
               console.log(this.checked)
               if (this.checked) { this.VSVDialog.scrollToIndex((count), 'smooth'); }
              }
      }
    );
    */
  }
  
  Przewijaj()
  {
    let count = this.VSVDialog.getDataLength();
    if (!this.checked) { this.VSVDialog.scrollToIndex((count), 'smooth'); }
  }

  ngOnInit() 
  {
   // console.log('onInit dialog') 
  }
  
  ngAfterViewInit()
  {
  //  console.log('AV dialog')
    //this.tablicazawartosci = this.funkcje.getLinieDialogu(); 
    this.changeDetectorRef.detectChanges();
  } 

  ngOnDestroy()
  {
  //  console.log('dest dialog')
    this.tablicazawartoscisubscribe.unsubscribe();
    //this.zakladkasubscribe.unsubscribe();
  }
}
