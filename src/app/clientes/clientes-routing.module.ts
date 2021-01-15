import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IncidenciasPage } from './incidencias/incidencias.page';
import { ServiciosPage } from './servicios/servicios.page';
import { AuthGuard } from '../guard/auth/auth.guard';
import { DetalleServicioPage } from './detalle-servicio/detalle-servicio.page';
import { AddIncidenciaPage } from './add-incidencia/add-incidencia.page';

const routes: Routes = [
  {
    path: 'incidencias',
    component: IncidenciasPage,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    component: ServiciosPage,
    canActivate: [AuthGuard]
  },
  {
    path: 'detalle/:id',
    component: DetalleServicioPage,
    canActivate: [AuthGuard]
  },
  {
    path: 'add-incidencia/:id/:id_custodio',
    component: AddIncidenciaPage,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientesPageRoutingModule {}
