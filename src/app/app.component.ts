import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    { provide: Window, useValue: window }]
})
export class AppComponent 
{
  title = 'TetaAdmin';


constructor(private window: Window)
  {
    console.log(window.innerWidth)
    console.log(window.outerWidth)
    console.log(window.innerHeight)
    console.log(window.outerHeight)
  }

} 