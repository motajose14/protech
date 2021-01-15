import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from '../services/api/api.service';
import { Plugins } from '@capacitor/core';
import { StorageService } from '../services/storage/storage.service';
import { Router } from '@angular/router';
const { Toast } = Plugins;

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  formLogin = new FormGroup({
    usuario: new FormControl('', [Validators.required, Validators.minLength(3)]),
    pass: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  tipo = '';

  constructor(
    private api: ApiService,
    private storage: StorageService,
    private router: Router
  ) { }

  async ngOnInit() {
    this.tipo = await this.storage.getItem('type');
  }

  async login(){
    if (this.formLogin.valid) {
      await this.api.presentLoading();
      const form = new FormData();
      form.append('usuario', this.formLogin.get('usuario').value);
      form.append('pass', this.formLogin.get('pass').value);
      form.append('tipo', this.tipo);
      await this.api.login(form).subscribe( async (data) => {
        this.api.setContent('Iniciando');
        if (data.result && this.tipo === '1'){
          this.storage.setObject('datos', data.cliente[0]);
          this.storage.setItem('logged', 'true');
          setTimeout(() => {
          this.router.navigate(['cliente']);
          this.api.dismissLoading();
          }, 1000);
        } else if (data.result && this.tipo === '2') {
          this.storage.setObject('datos', data.custodio[0]);
          this.storage.setItem('logged', 'true');
          setTimeout(() => {
          this.router.navigate(['custodio']);
          this.api.dismissLoading();
          }, 1000);
        } else if (!data.result) {
          await Toast.show({
            text: 'El usuario o contraseña es invalido '
          });
          setTimeout(() => {
            this.api.dismissLoading();
          }, 500);
        }
      }, async err => {
        await Toast.show({
          text: 'Error en la conexion a internet'
        });
        setTimeout(() => {
          this.api.dismissLoading();
        }, 500);
      });
    } else {
      await Toast.show({
        text: 'Debe llenar correctamente el formulario'
      });
    }
  }

}
