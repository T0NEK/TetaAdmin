import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nawigacja',
  templateUrl: './nawigacja.component.html',
  styleUrls: ['./nawigacja.component.css']
})
export class NawigacjaComponent implements OnInit {

  active: any;
  liniadodialog = 'pierwsza linia';
  raport = 'raport';
  constructor() { }

  ngOnInit() {
  }


  setAktywne(akt: string)
  {
  this.raport = akt;  
  }
}
