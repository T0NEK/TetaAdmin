import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FunkcjeWspolneService } from '../funkcje-wspolne.service';


@Component({
  selector: 'app-nawigacja',
  templateUrl: './nawigacja.component.html',
  styleUrls: ['./nawigacja.component.css']
})
export class NawigacjaComponent implements OnDestroy {

  active: any = 1;
  zakladka: boolean [] = [false, false, false, false, false, false, false, false];
  private zdarzenia = new Subscription();
  
  constructor(private funkcje: FunkcjeWspolneService) 
  {
    
    this.funkcje.ZmianyZakladek$.subscribe
    (data=>
      {
        this.zakladka[data.zakladka] = data.stan;
      })

  }



  ngOnDestroy()
  {
    if(this.zdarzenia) { this.zdarzenia.unsubscribe()}   
  }
 
  Changed(event: any)
  {
    this.funkcje.setzakladkadialogu(event)
  }
}
