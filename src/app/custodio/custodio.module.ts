import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustodioPageRoutingModule } from './custodio-routing.module';
import { MenuPage } from './menu/menu.page';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { RevistaPage } from './revista/revista.page';
import { RondaPage } from './ronda/ronda.page';
import { AddRevistaPage } from './add-revista/add-revista.page';
import { FinRevistaPage } from './fin-revista/fin-revista.page';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CustodioPageRoutingModule,
    FontAwesomeModule,
  ],
  declarations: [MenuPage, RevistaPage, RondaPage, AddRevistaPage, FinRevistaPage],
  providers: [
    BarcodeScanner
  ]
})
export class CustodioPageModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, fab, far);
  }
}
