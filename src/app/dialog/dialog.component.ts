import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, Input, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { KomunikacjaService } from '../komunikacja.service';
import { Wiersze } from '../wiersze';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
  changeDetection : ChangeDetectionStrategy.OnPush
})
export class DialogComponent implements OnInit, AfterViewInit {

  private tablicazawartoscisubscribe = new Subscription();
  tablicazawartosci: Array<Wiersze> = [];  
  @ViewChild('scrollViewportdialog')
  VSVdialog!: CdkVirtualScrollViewport;
    
  //@Input() wysokosc: any;
  //@Output() raport = new EventEmitter<string>();
  
  constructor(private komunikacja: KomunikacjaService,changeDetectorRef: ChangeDetectorRef) 
  {
    this.tablicazawartoscisubscribe = komunikacja.LiniaKomunikatu$.subscribe
    ( data => 
      { 
        this.tablicazawartosci = data;
        let count = this.VSVdialog.getDataLength()
        changeDetectorRef.detectChanges();
        this.VSVdialog.scrollToIndex((count), 'smooth')
        //console.log('LiniaKomunikatu$')
      }
    );    
  }
  
  ngOnInit() 
  {
    //console.log('dialog');
    this.tablicazawartosci = this.komunikacja.getLinieDialogu(); 
    
  }
  
  ngAfterViewInit()
  {
    
  } 
  
  ngOnDestroy()
  {
    this.tablicazawartoscisubscribe.unsubscribe();
    //this.VSVdialog.detach();
  }
}
