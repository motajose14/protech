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
      foto: new FormControl('data:image/jpeg;base64,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')
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
