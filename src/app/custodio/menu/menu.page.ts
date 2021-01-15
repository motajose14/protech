import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage/storage.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {


  constructor(
    private router: Router,
    private storage: StorageService,
    private platform: Platform
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter(){
    document.addEventListener('backbutton', (e) => {
      console.log('disable back button');
    }, false);
  }

  async salir(){
    await this.storage.removeItem('logged');
    await this.storage.removeItem('datos');
    this.router.navigate(['login']);
  }

  getPage(url) {
    this.router.navigate([url]);
  }

}
