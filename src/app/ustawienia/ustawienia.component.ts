import { Component, OnInit,Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-ustawienia',
  templateUrl: './ustawienia.component.html',
  styleUrls: ['./ustawienia.component.css']
})
export class UstawieniaComponent implements OnInit {

  public isCollapsed = true;

  @Output() bufor = new EventEmitter<string>();

  constructor() { }

  ngOnInit()
  {
  }

  start_larpa()
  {
    this.bufor.emit('start_larpa')
  }
}
