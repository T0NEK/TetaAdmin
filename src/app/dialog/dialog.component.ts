import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component,  OnInit, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { KomunikacjaService } from '../komunikacja.service';
import { Wiersze } from '../wiersze';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
  changeDetection : ChangeDetectionStrategy.OnPush
})
export class DialogComponent implements OnInit, AfterViewInit, OnDestroy {

  private tablicazawartoscisubscribe = new Subscription();
  tablicazawartosci: Array<Wiersze> = [];  
  @ViewChild('scrollViewportDialog')
  VSVDialog!: CdkVirtualScrollViewport;
  private zakladkasubscribe = new Subscription();
    
  //@Input() : any;
  //@Output() raport = new EventEmitter<string>();
  
  constructor(private komunikacja: KomunikacjaService,private changeDetectorRef: ChangeDetectorRef) 
  {

    console.log('konstruktor dialog')
    this.tablicazawartoscisubscribe = komunikacja.LiniaKomunikatu$.subscribe
    ( data => 
      { 
        this.tablicazawartosci = data;
        let count = this.VSVDialog.getDataLength()
        changeDetectorRef.detectChanges();
        this.VSVDialog.scrollToIndex((count), 'smooth')
        //console.log('LiniaKomunikatu$')
      }
    );    
    this.zakladkasubscribe = komunikacja.PrzelaczZakladka$.subscribe
    ( data =>
      {
        if (data == 1) {
               console.log('to ja ' + data);
               let count = this.VSVDialog.getDataLength();
               changeDetectorRef.detectChanges();
               this.VSVDialog.scrollToIndex((count), 'smooth')
              }
      }
    );
  }
  

  ngOnInit() 
  {
    console.log('onInit dialog') 
  }

  
  ngAfterViewInit()
  {
    console.log('AV dialog')
    this.tablicazawartosci = this.komunikacja.getLinieDialogu(); 
    //let count = this.VSVDialog.getDataLength()
    this.changeDetectorRef.detectChanges();
    //this.VSVDialog.scrollToIndex((count), 'smooth');
    //console.log(count)
  } 
  

  ngOnDestroy()
  {
    console.log('dest dialog')
    this.tablicazawartoscisubscribe.unsubscribe();
    this.zakladkasubscribe.unsubscribe();
  }
}
