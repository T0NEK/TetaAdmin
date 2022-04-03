import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Subject } from 'rxjs';


@Injectable({ providedIn: 'root'})


export class KomunikacjaService 
{
  private httpHostName = window.location.hostname;
  private httpURL_80 = 'http://'+ this.httpHostName + ':80/TetaPhp/Admin/';
  private httpURL_8080 = 'http://'+ this.httpHostName + ':8080/TetaPhp/Admin/';
  private httpURL: any;
  
  constructor(private http: HttpClient) 
  {
    //console.log('komunikacja con');
    this.httpURL = 'error';
    this.sprawdz_port(this.httpURL_80);
    this.sprawdz_port(this.httpURL_8080);
    this.rejestruj();
  }


/* (start) port serwera sql */
getURL(){ return this.httpURL;}

private sprawdz_port(port: string)
{
  this.http.get(port + 'conect/').subscribe( 
    data =>  {
    //  console.log(data)
              this.httpURL = port;
             },
    error => {
    //  console.log(error)
             }         
             )      
}
/* (end) port serwera sql */

/* (start) rejestracja stanowiska */
private idhost = 0;
private host = '';
private nrip = '';
private hostid = '';

getIdHost() {return this.idhost};
getHost(){ return this.host };
getIP(){ return this.nrip };
getHostId(){ return this.hostid };

rejestruj()
{
  const httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin':'*',
      'content-type': 'application/json',
      Authorization: 'my-auth-token'
    })
  };
  
var data = JSON.stringify({ "czas": moment().format('YYYY-MM-DD HH:mm:ss')})  
  
  this.http.post(this.getURL() + 'rejestracja/', data, httpOptions).subscribe( 
    data =>  {
      //console.log(data)
            let wynik = JSON.parse(JSON.stringify(data));
      //console.log(wynik)            
            if (wynik.wynik == true) 
            {
              this.idhost = wynik.id;
              this.host = wynik.nazwa;
              this.nrip = wynik.nrip;
              this.hostid = wynik.hostid;  
            }
            else
            {
              setTimeout(() => {this.rejestruj()}, 1000) 
            }
              },
    error => { 
      //console.log(error)
             setTimeout(() => {this.rejestruj()}, 1000) 
             }
             )      
}

/* (end) rejestracja stanowiska */

/* (start) logowanie */
Zaloguj(id: number, stan: boolean, czas: string)
{
  this.loguj(5, id, stan, czas, '')
}

private logowanieUsera = new Subject<any>();
logowanieUsera$ = this.logowanieUsera.asObservable()
private loguj(licznik: number, id: number, stan: boolean, czas: string, powod: string)
{
  const httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin':'*',
      'content-type': 'application/json',
      Authorization: 'my-auth-token'
    })
  };

//console.log('host ',this.getHost() )  
var data = JSON.stringify({ "zalogowany": id, "stan": stan, "nazwa": this.getHost(), "hostid": this.getHostId(), "idhost": this.idhost, "czas": czas})  

//console.log('loguje ',data )
if (licznik == 0) 
{ this.logowanieUsera.next( { "wynik":false, "stan":false, "error": powod } ) }
else
{
  this.http.post(this.getURL() + 'logowanie/', data, httpOptions).subscribe( 
    data =>  {
      //console.log('logowanie ',data)
            let wynik = JSON.parse(JSON.stringify(data));
            if (wynik.wynik == true) 
            {
              this.logowanieUsera.next(wynik)
            }
            else
            {
              setTimeout(() => {this.loguj(--licznik, id, stan, czas, wynik.error)}, 1000) 
            }
              },
    error => {
      //console.log('logowanie error ',error) 
              setTimeout(() => {this.loguj(--licznik, id, stan, czas, powod)}, 1000) 
             }
             )      
}             
}
/* (end) logowanie */

}
