import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from '../../services/storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class NoauthGuard implements CanActivate {
  constructor(
    private storage: StorageService,
    private router: Router
  ){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.storage.getItem('logged').then( (data) => {
      this.storage.getItem('type').then( (data2) => {
        if (data === 'true' && data2 === '1'){
          this.router.navigate(['cliente']);
        }else if (data === 'true' && data2 === '2'){
          this.router.navigate(['custodio']);
        }
      });
      return data !== 'true';
    });
  }  
}
