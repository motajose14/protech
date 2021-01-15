import { Component, OnInit } from '@angular/core';
import { ICustodioLogin, IListaCustodio } from '../../interfaces/intefaces';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage/storage.service';

@Component({
  selector: 'app-revista',
  templateUrl: './revista.page.html',
  styleUrls: ['./revista.page.scss'],
})
export class RevistaPage implements OnInit {

  user: ICustodioLogin;
  custodios: IListaCustodio[];

  constructor(
    private router: Router,
    private storage: StorageService
  ) { }

  async ngOnInit() {
    this.user = await this.storage.getObject('datos');
    this.custodios = this.user.listaCustodio;
  }

  getCustodio(custodio: IListaCustodio){
    this.router.navigate(['custodio/add-revista', custodio.id]);
  }

}
