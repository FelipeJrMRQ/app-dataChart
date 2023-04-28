import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TelaSistema } from 'src/app/models/tela/tela-sistema';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TelaSistemaService {

  telaSistema: TelaSistema;
  urlApi = `${environment.urlApi}/telas-sistema`

  constructor(
    private http: HttpClient,
  ) {
    this.telaSistema = new TelaSistema();
  }

  public salvar(telaSistema: TelaSistema): Observable<any> {
    return this.http.post<any>(`${this.urlApi}`, telaSistema);
  }

  public consultarTelas(): Observable<TelaSistema[]>{
    return this.http.get<TelaSistema[]>(`${this.urlApi}`);
  }

  public removerTela(tela: TelaSistema): Observable<any> {
    return this.http.delete<any>(`${this.urlApi}/${tela.id}`);
  }
}
