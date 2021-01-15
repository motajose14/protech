import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage/storage.service';
import { IClienteLogin, IServicesCliente } from '../../interfaces/intefaces';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.page.html',
  styleUrls: ['./servicios.page.scss'],
})
export class ServiciosPage implements OnInit {

  user: IClienteLogin;
  servicios: IServicesCliente[];

  constructor(
    private router: Router,
    private storage: StorageService
  ) { }

  async ngOnInit() {
    this.user = await this.storage.getObject('datos');
    this.servicios = this.user.servicio;
  }

  getDetalle(servicio: IServicesCliente) {
    this.router.navigate(['/cliente/detalle', servicio.id]);
  }

  async salir(){
    await this.storage.removeItem('logged');
    await this.storage.removeItem('datos');
    this.router.navigate(['login']);
  }

}
