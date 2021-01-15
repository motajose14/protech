import { Component, OnInit } from '@angular/core';
import { ICustodioLogin, IListaCustodio } from '../../interfaces/intefaces';
import { Router, ActivatedRoute } from '@angular/router';
import { StorageService } from '../../services/storage/storage.service';
import { FormGroup, FormControl } from '@angular/forms';
import { ApiService } from '../../services/api/api.service';
import { Plugins} from '@capacitor/core';
import { async } from '@angular/core/testing';
const { Toast } = Plugins;
@Component({
  selector: 'app-add-revista',
  templateUrl: './add-revista.page.html',
  styleUrls: ['./add-revista.page.scss'],
})
export class AddRevistaPage implements OnInit {

  user: ICustodioLogin;
  custodio: IListaCustodio;

  revista = new FormGroup({
    tocado: new FormControl(false),
    cabello: new FormControl(false),
    barba: new FormControl(false),
    uniforme: new FormControl(false),
    zapatos: new FormControl(false)
  });

  constructor(
    private router: Router,
    private storage: StorageService,
    private aroute: ActivatedRoute,
    private dataApi: ApiService
  ) { }

  async ngOnInit() {
    this.user = await this.storage.getObject('datos');
    this.user.listaCustodio.map( (custodio) => {
      if (custodio.id === this.aroute.snapshot.paramMap.get('id')) {
        this.custodio = custodio;
      }
    });
  }

  async saveRevista(){
    this.dataApi.presentLoading();
    const form = new FormData();
    form.append('id_reviso', String(this.user.id));
    form.append('id_custodio', this.custodio.id);
    for (const control in this.revista.value) {
      if (this.revista.value.hasOwnProperty(control)) {
        form.append(control, (this.revista.get(control).value ? '1' : '0'));
      }
    }

    await this.dataApi.addRevista(form).subscribe(async (data) => {
      this.dataApi.setContent('Recibiendo...');
      if (data.result){
       this.router.navigate(['custodio/fin-revista', data.id_revista]);
      } else {
        await Toast.show({
          text: 'Error guardando la revista'
        });
      }

      setTimeout(() => {
        this.dataApi.dismissLoading();
      }, 1000);
    }, async err => {
      await Toast.show({
        text: 'Error en la conexion a nternet'
      });
      setTimeout(() => {
        this.dataApi.dismissLoading();
      }, 1000);
    });

  }

}
