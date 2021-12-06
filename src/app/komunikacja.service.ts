import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class KomunikacjaService {

  private stringSubject = new Subject<string>();
  stringSubject$ = this.stringSubject.asObservable();
  passValue(data: string) {
    //passing the data as the next observable
    this.stringSubject.next(data); 
  }

  private czasRzeczywisty = new Subject<any>();
  czasRzeczywisty$ = this.czasRzeczywisty.asObservable();
  taktujCzas()
  {
    setInterval(() => { this.czasRzeczywisty.next( Date.now() ) }, 1000);
  }
  /* 
  time = new Observable<string>(observer => {
    setInterval(() => observer.next(new Date().toString()), 1000);
    });
*/

}
