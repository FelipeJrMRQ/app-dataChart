import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Programacao } from '../models/programacao/programacao';
import { ItemNaoRetornado } from '../models/itens-nao-retornados';

@Injectable({
  providedIn: 'root'
})
export class ProgramacaoService {

  urlApi = `${environment.urlApi}/programacao`;

  constructor(
    private http: HttpClient,
  ) { }

  public salvar(programacao: any): Observable<any> {
    return this.http.post<any>(`${this.urlApi}`, programacao);
  }

  public consultar(idLinha: number, idTurno: number, data: String, status: string): Observable<Programacao[]> {
    return this.http.get<Programacao[]>(`${this.urlApi}/${idLinha}/${idTurno}/${data}/${status}`);
  }

  public consultaUltimoNumeroSequencia(data: string, setup: any, idLinha: any, idTurno: any):Observable<Programacao>{
    return this.http.get<Programacao>(`${this.urlApi}/sequencia/${data}/${setup}/${idLinha}/${idTurno}`)
  }

  public consultaSequenciaSetup(data: string, setup: any, idLinha: any, idTurno: any):Observable<Programacao>{
    return this.http.get<Programacao>(`${this.urlApi}/sequencia-setup/${data}/${setup}/${idLinha}/${idTurno}`)
  }

  public consultarPorDataStatus(data: String, status: string): Observable<Programacao[]> {
    return this.http.get<Programacao[]>(`${this.urlApi}/${data}/${status}`);
  }

  public consultarPorSetupData(setup: number, data: String): Observable<Programacao[]> {
    return this.http.get<Programacao[]>(`${this.urlApi}/setup/${setup}/${data}`);
  }

  public consultarPorData(data: String): Observable<ItemNaoRetornado[]> {
    return this.http.get<ItemNaoRetornado[]>(`${this.urlApi}/${data}`);
  }


  public consultarPorIdProgramacao(id:number): Observable<Programacao> {
    return this.http.get<Programacao>(`${this.urlApi}/consultar/programacao/${id}`);
  }


  public excluirProgramacao(id: number): Observable<any>{
    return this.http.delete<any>(`${this.urlApi}/${id}`);
  }

}
