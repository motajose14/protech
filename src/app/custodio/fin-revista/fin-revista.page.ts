import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api/api.service';
import { Plugins, CameraResultType, CameraSource, } from '@capacitor/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
const { Toast } = Plugins;

@Component({
  selector: 'app-fin-revista',
  templateUrl: './fin-revista.page.html',
  styleUrls: ['./fin-revista.page.scss'],
})
export class FinRevistaPage implements OnInit {

  id_revista: any;

  finRevista = new FormGroup({
    observaciones: new FormArray([
      this.initObservacion()
    ])
  });

  image = null;
  time = null;
  send = null;

  constructor(
    private router: Router,
    private aRoute: ActivatedRoute,
    private dataApi: ApiService

  ) { }

  async ngOnInit() {
    this.id_revista = this.aRoute.snapshot.paramMap.get('id');
  }

  initObservacion() {
    return new FormGroup({
      observacion: new FormControl(),
      foto: new FormControl()
    });
  }

  getObservaciones(form){
    return form.controls.observaciones.controls;
  }

  addObservcion() {
    const control = this.finRevista.get('observaciones') as FormArray;
    control.push(this.initObservacion());
  }

  removeObservacion(i) {
    const control = this.finRevista.get('observaciones') as FormArray;
    control.removeAt(i);
  }

  formResetVariation() {
    const control = this.finRevista.get('observaciones') as FormArray;
    control.clear();
    this.addObservcion();
  }

  async openGalleryGeneric(i){
    const control = this.finRevista.get('observaciones') as FormArray;

    const { Camera } = Plugins;
    const image = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos

    });

    this.image = image.base64String;
    this.generateFromImage('data:image/jpeg;base64,' + this.image, 1000, 1000, 0.6, data => {
       control.controls[i].get('foto').setValue(data);
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

 async guardarObservaciones() {
  await this.dataApi.presentLoading();
  const observaciones = this.finRevista.get('observaciones') as FormArray;
  let i = 0;
  if ((observaciones.value[0].observacion !== null && observaciones.value[0].observacion !== '') || (observaciones.value[0].foto !== null && observaciones.value[0].foto !== '')){
    this.time = setInterval( async () => {
      if (!this.send && i < observaciones.length) {
        this.send = true;
        await this.guardarObservacion(observaciones.value[i], i, observaciones.length);
        i++;
        if ( i === observaciones.length ) {
          clearInterval(this.time);
        }
      }
    }, 1000);
  } else {
    await this.finalizarRevista();
  }
 }

 async guardarObservacion(observacion, i, total){
  await this.dataApi.setContent('Enviando obsevacion ' + (i + 1) + ' / ' + total);
  const form =  new FormData();
  form.append('id_revista', this.id_revista);
  form.append('observacion', observacion.observacion);
  form.append('foto', observacion.foto);
  await this.dataApi.addObservacionRevista(form).subscribe( async (data) => {
    this.send = false;
    if ((i + 1) === total){
      await this.finalizarRevista();
    }
  }, async err => {
    await Toast.show({
      text: 'Error en la conexion a internet'
    });
  });
 }

 async finalizarRevista(){
  await this.dataApi.setContent('Finalizando');
  const form =  new FormData();
  form.append('id_revista', this.id_revista);
  await this.dataApi.finRevista(form).subscribe( async (data) => {
    setTimeout( () => {
      this.dataApi.dismissLoading();
    }, 500);
    this.router.navigateByUrl('custodio');
    await Toast.show({
      text: 'Guardado exitosamente'
    });
    this.send = false;
  }, async err => {
    await Toast.show({
      text: 'Error en la conexion a internet'
    });
  });

 }

}
