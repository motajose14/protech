import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { async } from '@angular/core/testing';
import { StorageService } from '../../services/storage/storage.service';
import { IClienteLogin, IServicesCliente, ICustodioServices } from '../../interfaces/intefaces';

@Component({
  selector: 'app-detalle-servicio',
  templateUrl: './detalle-servicio.page.html',
  styleUrls: ['./detalle-servicio.page.scss'],
})
export class DetalleServicioPage implements OnInit {

  user: IClienteLogin;
  servicio: IServicesCliente;

  constructor(
    private storage: StorageService,
    private aRoute: ActivatedRoute,
    private router: Router
  ) { }

  async ngOnInit() {
    await this.getDetalle(this.aRoute.snapshot.paramMap.get('id'));
  }

  async getDetalle(id){
    this.user = await this.storage.getObject('datos');
    this.user.servicio.map(servicio => {
      if (servicio.id === id){
        this.servicio = servicio;
      }
    });
  }

  addIncidencia(custodio: ICustodioServices){
    this.router.navigate(['/cliente/add-incidencia', this.servicio.id, custodio.id]);
  }


}
