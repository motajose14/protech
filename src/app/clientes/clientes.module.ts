import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClientesPageRoutingModule } from './clientes-routing.module';

import { IncidenciasPage } from './incidencias/incidencias.page';
import { ServiciosPage } from './servicios/servicios.page';
import { DetalleServicioPage } from './detalle-servicio/detalle-servicio.page';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { AddIncidenciaPage } from './add-incidencia/add-incidencia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ClientesPageRoutingModule,
    FontAwesomeModule
  ],
  declarations: [
    IncidenciasPage,
    ServiciosPage,
    DetalleServicioPage,
    AddIncidenciaPage
  ]
})
export class ClientesPageModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, fab, far);
  }
}
