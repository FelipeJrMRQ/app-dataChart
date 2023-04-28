import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Programacao } from '../models/programacao';
import { ItemNaoRetornado } from '../models/itens-nao-retornados';

@Injectable({
  providedIn: 'root'
})
export class ProgramacaoService {

  urlApi = `${environment.urlApi}/programacao`;

  constructor(
    private http: HttpClient,
  ) { }

  public salvar(programacao: Programacao): Observable<any> {
    return this.http.post<any>(`${this.urlApi}`, programacao);
  }

  public consultar(idLinha: number, idTurno: number, data: String, status: string): Observable<Programacao[]> {
    return this.http.get<Programacao[]>(`${this.urlApi}/${idLinha}/${idTurno}/${data}/${status}`);
  }

  public consultarPorDataStatus(data: String, status: string): Observable<Programacao[]> {
    return this.http.get<Programacao[]>(`${this.urlApi}/${data}/${status}`);
  }

  public consultarPorData(data: String): Observable<ItemNaoRetornado[]> {
    return this.http.get<ItemNaoRetornado[]>(`${this.urlApi}/${data}`);
  }
  public excluirProgramacao(id: number): Observable<any>{
    return this.http.delete<any>(`${this.urlApi}/${id}`);
  }

}
