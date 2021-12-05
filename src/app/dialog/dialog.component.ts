import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  tablicazawartosci: Array <string> = [];
  
  @Input() linia: any;
  @Output() raport = new EventEmitter<string>();
  
  constructor() { }

  ngOnInit() 
  {
  this.setDialog('uruchomiopno');
  this.raport.emit('2');
  }

  setDialog(text: string)
  {
    this.tablicazawartosci.push(text);
  } 
}
