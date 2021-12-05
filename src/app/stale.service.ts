import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class StaleService {

private httpURL = 'http://localhost/TetaPhp/Admin/';
private czas_startu: any;

constructor(private http: HttpClient) 
{
  this.odczytaj_czas_startu()
}


getCzasStartu() { return this.czas_startu}



private odczytaj_czas_startu()
{
  this.czas_startu = '2045.03.03';    
  this.http.get(this.httpURL + 'czas_startu_data.php').subscribe( data => {
      this.czas_startu = data;
      }, error => console.error(error));

}


}
