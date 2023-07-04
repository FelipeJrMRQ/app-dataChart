import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Notificacao } from '../models/notificacao';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificacaoService {

  private urlApi = `${environment.urlApi}/atualizacoes`;

  constructor(
    private http: HttpClient
  ) { }

  public consultarNotificacao(id: any):Observable<Notificacao>{
    return this.http.get<Notificacao>(`${this.urlApi}/notificacoes/${id}`);
  }

  public salvarNotificacao(notificacao: any):Observable<Notificacao>{
    return this.http.post<Notificacao>(`${this.urlApi}/notificacoes`, notificacao);
  }

}
