import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    { provide: Window, useValue: window }],
    host: {
      "(window:resize)":"onWindowResize($event)",
    //  "(click)":"onClick($event)",
    //  "(window:keypress)":"onKeyDown($event)"
    }  
})
export class AppComponent 
{
  title = 'TetaAdmin';
  public wysokoscAll: any;
  public wysokoscInfo = 32;
  public wysokoscNawigacja: any;
  public wysokoscPrzewijaj = 24;
  public wysokoscDialogMin = 140;
  public szerokoscAll: any;
  public szerokoscInput: any;
  public szerokoscNawigacja: any;
  public szerokoscPolecenia = 240;
  public szerokoscOsoby = 240;
  public wysokoscTematy = 180;
  public wysokoscWersje = 140;

constructor(private window: Window)
  {
    this.wysokoscAll = window.innerHeight;
    this.szerokoscAll = window.innerWidth
    this.wysokoscNawigacja = (this.wysokoscAll - this.wysokoscInfo - this.wysokoscDialogMin - this.wysokoscPrzewijaj);
    this.szerokoscNawigacja = this.szerokoscAll;

  }

} 