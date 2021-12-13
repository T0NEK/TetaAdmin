import { Component, OnInit } from '@angular/core';
import { KomunikacjaService } from '../komunikacja.service';



@Component({
  selector: 'app-nawigacja',
  templateUrl: './nawigacja.component.html',
  styleUrls: ['./nawigacja.component.css']
})
export class NawigacjaComponent implements OnInit {

  active: any = 2;
  
  constructor(private komunikacja: KomunikacjaService) 
  {
    
  }

  ngOnInit() 
  {
    console.log('nawigacja')
  }
 
  Changed(event: any)
  {
    this.komunikacja.changePrzelaczZakladka(event)
  }
}
