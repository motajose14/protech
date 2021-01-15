import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../services/storage/storage.service';
import { IClienteLogin, IServicesCliente } from '../../interfaces/intefaces';
import { FormGroup, FormControl, FormArray, Validators, AbstractControl } from '@angular/forms';
import { ApiService } from '../../services/api/api.service';
import { Location } from '@angular/common';
import { Plugins, CameraSource, CameraResultType } from '@capacitor/core';
const { Toast } = Plugins;
@Component({
  selector: 'app-add-incidencia',
  templateUrl: './add-incidencia.page.html',
  styleUrls: ['./add-incidencia.page.scss'],
})
export class AddIncidenciaPage implements OnInit {

  user: IClienteLogin;
  id_custodio = null;
  id_incidencia = null;
  image = null;
  send = false;
  time = null;

  constructor(
    private aRoute: ActivatedRoute,
    private router: Router,
    private storage: StorageService,
    private api: ApiService,
    private location: Location
  ) { }

  formI = new FormGroup({
    incidencias: new FormArray([
      this.initIncidencia()
    ])
  });

  async ngOnInit() {
    this.user = await this.storage.getObject('datos');
    this.id_custodio = this.aRoute.snapshot.paramMap.get('id_custodio');
    await this.agregarIncidencia();
  }

  async agregarIncidencia(){
    await this.api.presentLoading();
    const form =  new FormData();
    form.append('id_cliente', String(this.user.id));
    form.append('id_custodio', String(this.id_custodio));
    await this.api.addIncidencia(form).subscribe( async (data) => {
      await this.api.setContent('Recibiendo...');
      if (data.result){
        this.id_incidencia = data.id_incidencia;
      }
      setTimeout(() => {
        this.api.dismissLoading();
      }, 500);
    }, err => {
      this.location.back();
      setTimeout(() => {
        this.api.dismissLoading();
      }, 500);
    });
  }

  initIncidencia() {
    return new FormGroup({
      observacion: new FormControl(''),
      foto: new FormControl('')
    }, {
      validators: this.getValidacion.bind(this)
    });
  }

  getIncidencia(form) {
    return form.controls.incidencias.controls;
  }

  addIncidencia() {
    const control = this.formI.get('incidencias') as FormArray;
    control.push(this.initIncidencia());
  }

  removeIncidencia(i) {
    const control = this.formI.get('incidencias') as FormArray;
    control.removeAt(i);
  }

  formResetVariation() {
    const control = this.formI.get('incidencias') as FormArray;
    control.clear();
    this.addIncidencia();
  }

  async guardarIncidencias(){
    await this.api.presentLoading();
    const incidencias = this.formI.get('incidencias') as FormArray;
    let i = 0;
    this.time = setInterval( async () => {
      if (!this.send && i < incidencias.length) {
        this.send = true;
        await this.guardarIncidencia(incidencias.value[i], i, incidencias.length);
        i++;
        if ( i === incidencias.length ) {
          clearInterval(this.time);
        }
      }
    }, 1000);
  }

  async guardarIncidencia(incidencia, i, total){
    await this.api.setContent('Enviando ' + (i + 1) + ' / ' + total);
    const form =  new FormData();
    form.append('id_incidencia', this.id_incidencia);
    form.append('observacion', incidencia.observacion);
    form.append('foto', incidencia.foto);

    await this.api.addDetalleIncidencia(form).subscribe( async (data) => {
      if ((i + 1) === total){
        setTimeout( () => {
          this.api.dismissLoading();
        }, 500);
        await Toast.show({
          text: 'Guardado exitosamente'
        });

        this.location.back();
      }
      this.send = false;
    }, async err => {
      setTimeout( () => {
        this.api.dismissLoading();
      }, 500);
      await Toast.show({
        text: 'Error en la conexion a internet'
      });
    });
  }

  async openGalleryGeneric(i){
     const control = this.formI.get('incidencias') as FormArray;

     const { Camera } = Plugins;
     const image = await Camera.getPhoto({
       quality: 90,
       resultType: CameraResultType.Base64,
       source: CameraSource.Photos
     });

     this.image = image.base64String;
     this.generateFromImage('data:image/jpeg;base64,' + this.image, 1000, 1000, 0.6, data => {
        control.controls[i].get('foto').setValue(data);
        console.log(data);
     });

   }

   generateFromImage(img, MAX_WIDTH: number = 700, MAX_HEIGHT: number = 700, quality: number = 1, callback) {

    const canvas: any = document.createElement('canvas');
    const image = new Image();

    image.onload = () => {
      let width = image.width;
      let height = image.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(image, 0, 0, width, height);

      // IMPORTANT: 'jpeg' NOT 'jpg'
      const dataUrl = canvas.toDataURL('image/jpeg', quality);

      callback(dataUrl);
    };
    image.src = img;
  }

  getValidacion(formGroup: FormGroup){
    let error = null;
    if (formGroup.value.observacion === '' && formGroup.value.foto === ''){
      error = { ...error, req: 'requerido'};
      formGroup.controls['observacion'].setErrors({
        req: 'requerido'
      });
    } else {
      formGroup.controls['observacion'].setErrors(null);
    }
    return error;
  }
}
