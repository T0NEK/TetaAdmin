import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatCheckboxModule} from '@angular/material/checkbox'
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { InformacjeComponent } from './informacje/informacje.component';
import { NawigacjaComponent } from './nawigacja/nawigacja.component';
import { DialogComponent } from './dialog/dialog.component';
import { UstawieniaComponent } from './ustawienia/ustawienia.component';
import { UstawieniaCzasStartuComponent } from './ustawienia-czas-startu/ustawienia-czas-startu.component';
import { UstawieniaCzasNaDedaluComponent } from './ustawienia-czas-na-dedalu/ustawienia-czas-na-dedalu.component';
import { UstawieniaStartLarpaComponent } from './ustawienia-start-larpa/ustawienia-start-larpa.component';
import { UzytkownicyComponent } from './uzytkownicy/uzytkownicy.component';
import { WiadomosciComponent } from './wiadomosci/wiadomosci.component';
import { NotatkiComponent } from './notatki/notatki.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DialogMiniComponent } from './dialog-mini/dialog-mini.component';
import { TestyComponent } from './testy/testy.component';
import { PoleceniaComponent } from './polecenia/polecenia.component';
import { ZalogowaniUzytkownicyComponent } from './zalogowani-uzytkownicy/zalogowani-uzytkownicy.component';
import { LiniaKomendComponent } from './linia-komend/linia-komend.component';
import { MatIconModule } from '@angular/material/icon';
import { ZdarzeniaComponent } from './zdarzenia/zdarzenia.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select'; 
import { MatMenuModule } from '@angular/material/menu';
import { PoleceniadedalComponent } from './poleceniadedal/poleceniadedal.component';
import { LiniaPolecenComponent } from './linia-polecen/linia-polecen.component';
import { ModulyComponent } from './moduly/moduly.component';


@NgModule({
  declarations: [																				
    AppComponent,
      InformacjeComponent,
      NawigacjaComponent,
      UstawieniaComponent,
      UstawieniaCzasStartuComponent,
      UstawieniaCzasNaDedaluComponent,
      UstawieniaStartLarpaComponent,
      UzytkownicyComponent,
      WiadomosciComponent,
      NotatkiComponent,
      DialogComponent,
      DialogMiniComponent,
      TestyComponent,
      PoleceniaComponent,
      ZalogowaniUzytkownicyComponent,
      LiniaKomendComponent,
      ZdarzeniaComponent,
      PoleceniadedalComponent,
      LiniaPolecenComponent,
      ModulyComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ScrollingModule,
    MatCheckboxModule,
    FormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    CdkAccordionModule,
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatMenuModule,
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
