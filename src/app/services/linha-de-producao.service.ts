import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LinhaDeProducao } from '../models/linha-de-producao';

@Injectable({
  providedIn: 'root'
})
export class LinhaDeProducaoService {

  urlApi=`${environment.urlApi}/linha-producao`;
  static linhaCadastrada = new EventEmitter<any>();

  constructor(
    private http: HttpClient,
  ) { }

  public salvar(linha: LinhaDeProducao):Observable<any> {
    return this.http.post<LinhaDeProducao>(`${this.urlApi}`, linha);
  }

  public consultar():Observable<LinhaDeProducao[]>{
    return this.http.get<LinhaDeProducao[]>(`${this.urlApi}`);
  }

  public consultarPorStatus():Observable<LinhaDeProducao[]>{
    return this.http.get<LinhaDeProducao[]>(`${this.urlApi}/status`);
  }

  public excluir():Observable<any>{
    return this.http.delete(`${this.urlApi}`);
  }

  

}
