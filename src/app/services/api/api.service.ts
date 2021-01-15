import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IRespLogin, IRespApi } from '../../interfaces/intefaces';
import { LoadingController } from '@ionic/angular';
import { retry } from 'rxjs/operators';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  dominio = environment.dominio;
  loading: any;

  constructor(
    private http: HttpClient,
    public loadingController: LoadingController
  ) { }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Conectando...',
    });
    await this.loading.present();

  }

  setContent(msg) {
    this.loading.message = msg;
  }

  dismissLoading(){
    this.loading.dismiss();
  }

  login(fields): Observable<IRespLogin>{
    return this.http.post<IRespLogin>(this.dominio + '/login.php', fields).pipe(
      retry(2)
    );
  }

  addIncidencia(fields): Observable<IRespApi>{
    return this.http.post<IRespApi>(this.dominio + '/incidencia.php', fields).pipe(
      retry(2)
    );
  }

  addDetalleIncidencia(fields): Observable<IRespApi>{
    return this.http.post<IRespApi>(this.dominio + '/detalle_incidencia.php', fields).pipe(
      retry(2)
    );
  }

  addRevista(fields): Observable<IRespApi>{
    return this.http.post<IRespApi>(this.dominio + '/inicio_revista.php', fields).pipe(
      retry(2)
    );
  }

  addObservacionRevista(fields): Observable<IRespApi>{
    return this.http.post<IRespApi>(this.dominio + '/revista_foto.php', fields).pipe(
      retry(2)
    );
  }

  finRevista(fields): Observable<IRespApi>{
    return this.http.post<IRespApi>(this.dominio + '/fin_revista.php', fields).pipe(
      retry(2)
    );
  }

  inicioRecorrido(fields): Observable<IRespApi>{
    return this.http.post<IRespApi>(this.dominio + '/inicio_recorrido.php', fields).pipe(
      retry(2)
    );
  }

  detalleRecorrido(fields): Observable<IRespApi>{
    return this.http.post<IRespApi>(this.dominio + '/detalle_recorrido.php', fields).pipe(
      retry(2)
    );
  }

  fotoDetalleRecorrido(fields): Observable<IRespApi>{
    return this.http.post<IRespApi>(this.dominio + '/foto_detalle_recorrido.php', fields).pipe(
      retry(2)
    );
  }

  finRecorrido(fields): Observable<IRespApi>{
    return this.http.post<IRespApi>(this.dominio + '/fin_recorrido.php', fields).pipe(
      retry(2)
    );
  }

}
