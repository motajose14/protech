import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomePage } from './home/home.page';
import { LoginPage } from './login/login.page';
import { TypeGuard } from './guard/type/type.guard';
import { NoauthGuard } from './guard/noauth/noauth.guard';
import { NotypeGuard } from './guard/notype/notype.guard';
import { AuthGuard } from './guard/auth/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    component: HomePage,
    canActivate: [NotypeGuard, NoauthGuard]
  },
  {
    path: 'login',
    component: LoginPage,
    canActivate: [TypeGuard, NoauthGuard]
  },
  {
    path: 'custodio',
    loadChildren: () => import('./custodio/custodio.module').then( m => m.CustodioPageModule)

  },
  {
    path: 'cliente',
    loadChildren: () => import('./clientes/clientes.module').then( m => m.ClientesPageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
