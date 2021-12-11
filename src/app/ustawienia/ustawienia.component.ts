import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, OnInit, ChangeDetectorRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Subscription } from 'rxjs';
import { KomunikacjaService } from '../komunikacja.service';
import { Wiersze } from '../wiersze';

@Component({
  selector: 'app-ustawienia',
  templateUrl: './ustawienia.component.html',
  styleUrls: ['./ustawienia.component.css'],
  changeDetection : ChangeDetectionStrategy.OnPush
})
export class UstawieniaComponent implements OnInit {

  public isCollapsed = true;

  
  private tablicazawartoscisubscribe = new Subscription();
  tablicazawartosci: Array<Wiersze> = [];  
  @ViewChild('scrollViewportustawienia')
  VSVustawienia!: CdkVirtualScrollViewport;
  
  constructor(private komunikacja: KomunikacjaService,changeDetectorRef: ChangeDetectorRef) 
  {
    this.tablicazawartoscisubscribe = komunikacja.LiniaKomunikatu$.subscribe
    ( data => 
      { 
        this.tablicazawartosci = data;
        let count = this.VSVustawienia.getDataLength()
        changeDetectorRef.detectChanges();
        this.VSVustawienia.scrollToIndex((count), 'smooth')
        //console.log('LiniaKomunikatu$')
      }
    );    
  }
  
  ngOnInit() 
  {
    console.log('ustawienia')
    this.tablicazawartosci = this.komunikacja.getLinieDialogu(); 
    
  }

  ngOnDestroy()
  {
    this.tablicazawartoscisubscribe.unsubscribe();
    //this.VSVustawienia.detach
  }

  start_larpa()
  {
    this.komunikacja.addLiniaKomunikatu('start_larpa','')
  }
}
