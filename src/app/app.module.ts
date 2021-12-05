import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from "@angular/common/http";
import { InformacjeComponent } from './informacje/informacje.component';
import { NawigacjaComponent } from './nawigacja/nawigacja.component';
import { UstawieniaComponent } from './ustawienia/ustawienia.component';
import { UzytkownicyComponent } from './uzytkownicy/uzytkownicy.component';
import { WiadomosciComponent } from './wiadomosci/wiadomosci.component';
import { NotatkiComponent } from './notatki/notatki.component';
import { DialogComponent } from './dialog/dialog.component';

@NgModule({
  declarations: [								
    AppComponent,
      InformacjeComponent,
      NawigacjaComponent,
      UstawieniaComponent,
      UzytkownicyComponent,
      WiadomosciComponent,
      NotatkiComponent,
      DialogComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
