import { Component, OnInit } from '@angular/core';
import { StorageService } from '../services/storage/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(
    private storage: StorageService,
    private router: Router
  ) {}

async ngOnInit(){
  const tipo = await this.storage.getItem('type');
  if (tipo !== null){
    this.router.navigate(['login']);
  }
  
}

  userType(type) {
    this.storage.setItem('type', type);
    this.router.navigate(['login']);
  }

}
