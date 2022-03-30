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
  public wysokoscNawigacjaNag = 45;
  public wysokoscPrzewijaj = 30;
  public wysokoscDialogMin = 140;
  public wysokoscLinia = 42;
  public szerokoscAll: any;
  public szerokoscInput: any;
  public szerokoscNawigacja: any;
  public szerokoscPolecenia = 240;
  public szerokoscOsoby = 340;
  public wysokoscTematy = 180;
  public wysokoscWersje = 140;
  public szerokoscZalogowani = 280;
  public szerokoscWiadOsoby = 190;
  


constructor(private window: Window)
  {
    //console.log(window.location.hostname)
    this.wysokoscAll = window.innerHeight - 10;
    this.szerokoscAll = window.innerWidth - 2
    this.wysokoscNawigacja = (this.wysokoscAll - this.wysokoscInfo - this.wysokoscDialogMin);
    this.szerokoscNawigacja = this.szerokoscAll - this.szerokoscZalogowani ;

  }

} 