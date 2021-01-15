import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from '../../services/storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private storage: StorageService,
    private router: Router
  ){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.storage.getItem('logged').then((data) => {
        this.storage.getItem('type').then( (data2) => {
          if ((data2 === '2' && state.url.includes('cliente'))) {
            this.router.navigate(['custodio']);
          } else if ((data2 === '1' && state.url.includes('custodio'))) {
            this.router.navigate(['cliente']);
          }
        });
        return data === 'true';
      });
  }
}
