import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from '../../services/storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class TypeGuard implements CanActivate {
  constructor(
    private storage: StorageService,
    private router: Router
  ){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    /* this.storage.getItem('type').then((data) => {
      if (data === null){
        this.router.navigate(['home']);
      }
    }); */
    return this.storage.getItem('type').then( (data) => {
        return data !== null;
    });
  }
}
