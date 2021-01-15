import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../guard/auth/auth.guard';
import { MenuPage } from './menu/menu.page';
import { RondaPage } from './ronda/ronda.page';
import { RevistaPage } from './revista/revista.page';
import { AddRevistaPage } from './add-revista/add-revista.page';
import { FinRevistaPage } from './fin-revista/fin-revista.page';

const routes: Routes = [
  {
    path: '',
    component: MenuPage,
    canActivate: [AuthGuard]
  },
  {
    path: 'ronda',
    component: RondaPage,
    canActivate: [AuthGuard]
  },
  {
    path: 'revista',
    component: RevistaPage,
    canActivate: [AuthGuard]
  },
  {
    path: 'add-revista/:id',
    component: AddRevistaPage,
    canActivate: [AuthGuard]
  },
  {
    path: 'fin-revista/:id',
    component: FinRevistaPage,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustodioPageRoutingModule {}
