import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Motivo } from '../models/motivo';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MotivoService {

  private urlApi = `${environment.urlApi}/motivo`;
  constructor(
    private http: HttpClient,
  ) {

  }

  public criarMotivo(motivo: Motivo): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/criar`, motivo);
  }

  public consultarMotivos(){
    return this.http.get<any>(`${this.urlApi}/listar`)
  }
}
