import { Component, OnInit, ɵConsole } from '@angular/core';
import { ICustodioLogin } from '../../interfaces/intefaces';
import { StorageService } from '../../services/storage/storage.service';
import { ApiService } from '../../services/api/api.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { FormGroup, FormArray, FormControl, Validators, AbstractControl } from '@angular/forms';
import { domainToASCII } from 'url';
import { Router } from '@angular/router';
const { Toast } = Plugins;

@Component({
  selector: 'app-ronda',
  templateUrl: './ronda.page.html',
  styleUrls: ['./ronda.page.scss'],
})
export class RondaPage implements OnInit {

  user: ICustodioLogin;
  id_recorrido = '';
  rondin = [];
  rondines = [];
  escaneando = false;
  habilitarFin = false;
  image = null;
  send = false;
  send2 = false;
  time = null;
  time2 = null;

  formRondin =  new FormGroup({
    recorridos: new FormArray([])
  });

  constructor(
    private storage: StorageService,
    private api: ApiService,
    private barcodeScanner: BarcodeScanner,
    private router: Router
  ) { }

  async ngOnInit() {
    this.user = await this.storage.getObject('datos');
    this.rondin = this.user.rondin;
    this.rondines =  this.rondin.map( (item) => {
      item.checked = true;
      item.expanded = false;
      this.addQrRecorrido(item);
      return item;
    });
    await this.initRecorrido();

   /*  setTimeout(() => {
      this.checkedRondin('t642964kdA7gvoB');
    }, 3000);

    setTimeout(() => {
      this.checkedRondin('codigo qr');
    }, 6000);

    setTimeout(() => {
      this.checkedRondin('qoRHt4kALX6L15P');
    }, 8000); */
  }

  inciarRecorrido(rondin) {
    return new FormGroup({
      descripcion: new FormControl(rondin.descripcion),
      id_rondin: new FormControl(rondin.id),
      qr: new FormControl(rondin.qr),
      observacion: new FormControl(''),
      fotos: new FormArray([]),
      expanded: new FormControl(false),
      checked: new FormControl(false, [Validators.requiredTrue])
    });
  }

  iniciarFotoRecorrido(foto = 'assets/icon/favicon.png') {
    return new FormGroup({
      foto: new FormControl(foto)
    });
  }

  addQrRecorrido(rondin) {
    const  control = this.formRondin.controls.recorridos as FormArray;
    control.push(this.inciarRecorrido(rondin));
  }

  getRecorridos(form) {
    return form.controls.recorridos.controls;
  }

  addFotoRecorrido(foto, index) {
    const control = this.formRondin.get(['recorridos', index, 'fotos']) as FormArray;
    control.push(this.iniciarFotoRecorrido(foto));
  }

  getFotoRecorrido(form) {
    return form.controls.fotos.controls;
  }

  rmFotoRecorrido(index, i) {
    const control = this.formRondin.get(['recorridos', index, 'fotos']) as FormArray;
    control.removeAt(i);
  }

  async initRecorrido(){
    await this.api.presentLoading();
    const form = new FormData();
    form.append('id_custodio', String(this.user.id));
    this.api.inicioRecorrido(form).subscribe( async (data) => {
      await this.api.setContent('Recibiendo...');
      setTimeout(() => {
        this.api.dismissLoading();
      }, 500);
      this.id_recorrido = String(data.id_recorrido);
      console.log(data);
    }, async err => {
      setTimeout(() => {
        this.api.dismissLoading();
      }, 500);
      await Toast.show({
        text: 'Error en la conexion a internet'
      });
      console.log(err);
    });
  }

  getQr() {
    this.escaneando = true;
    this.barcodeScanner.scan().then(barcodeData => {
      this.checkedRondin(barcodeData.text);
      this.escaneando = false;
    }).catch(err => {
      this.escaneando = false;
      console.log('Error', err);
    });
  }

  expanded(r){
    this.rondines = this.rondines.map( (item) => {
      if (item === r) {
        item.expanded = !item.expanded;
      } else {
        item.expanded = false;
      }
      return item;
    });
  }

  checkedRondin(qr){
    const control = this.formRondin.controls.recorridos as FormArray;
    let i = 0;
    for (const item of control.value) {
      if (!item.checked){
        if (item.qr === qr) {
          const cont = control.controls[i] as FormGroup;
          cont.controls['checked'].setValue(true);
          this.escaneando = false;
          return;
        }
      }
      i++;
    }
  }

  expandedRondin(index){
    const control = this.formRondin.controls.recorridos as FormArray;
    let i = 0;
    for (const item of control.value) {
      const cont = control.controls[i] as FormGroup;
      if (i === index) {
        if (cont.controls['expanded'].value){
          cont.controls['expanded'].setValue(false);
        } else {
          cont.controls['expanded'].setValue(true);
        }
      } else {
        cont.controls['expanded'].setValue(false);
      }
      i++;
    }
  }

  async openGalleryGeneric(i){

    const { Camera } = Plugins;
    const image = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos

    });

    this.image = image.base64String;
    console.log(this.image);
    if (this.image) {
      console.log(this.image.length);
      this.generateFromImage('data:image/jpeg;base64,' + this.image, 1000, 1000, 0.6, data => {
        console.log(data.length);
        this.addFotoRecorrido(data, i);
      });
    }

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

  async finRecorrido(){
    await this.api.presentLoading();
    const recorridos =  this.formRondin.get('recorridos') as FormArray;
    let i = 0;
    this.time = setInterval( async () => {
      if (!this.send && i < recorridos.length){
        this.send = true;
        /*  console.log(recorridos.value[i]); */
        console.log('Enviando Recorrido');
        const g = await this.guardarRecorrido(recorridos.value[i]);
        i++;
      }
      if (i >= (recorridos.length) && !this.send){
        clearInterval(this.time);
        const form = new FormData();
        form.append('id_recorrido', this.id_recorrido);
        const gg = await this.api.finRecorrido(form).subscribe(async (data) => {
          if (data.result){
            this.api.dismissLoading();
            await Toast.show({
              text: 'Recorrido finalizado exitosamente'
            });
            this.router.navigateByUrl('custodio');

          }
        });
        console.log('Fin');
      }
    }, 1000);
  }

  async guardarRecorrido(recorrido) {
    this.api.setContent('Enviando...');
    const form = new FormData();
    form.append('id_recorrido', this.id_recorrido);
    form.append('id_rondin', recorrido.id_rondin);
    form.append('observacion', recorrido.observacion);
    console.log(recorrido);
    await this.api.detalleRecorrido(form).subscribe( async (data) => {
      if (data.result){
        if (recorrido.fotos.length > 0) {
          let i = 0;
          this.time2 = setInterval( async () => {
            if (!this.send2) {
              this.send2 = true;
             /*  console.log('Enviando Imagen ', recorrido.fotos[i].foto); */
              await this.agregarFotoRecorrido(recorrido.fotos[i].foto, data.id_detalle_recorrido, i);
              i++;
            }
            if (i === (recorrido.fotos.length)) {
              clearInterval(this.time2);
              this.send = false;
            }
          }, 1000);
        } else {
          this.send = false;
        }
      }
    }, async err => {
      await Toast.show({
        text: 'Error en la conexion a internet'
      });
    });
  }

  async agregarFotoRecorrido(foto, id_detalle_recorrido, index) {
    console.log(foto, id_detalle_recorrido);
    const form = new FormData();
    form.append('foto', foto);
    form.append('id_detalle_recorrido', id_detalle_recorrido);
    form.append('numero', String(index + 1));

    await this.api.fotoDetalleRecorrido(form).subscribe( (data) => {
      if (data.result){
        this.send2 = false;
      }
    }, async err => {
      await Toast.show({
        text: 'Error en la conexion a internet'
      });
    });
  }

}
