import { ModeloConsulta } from 'src/app/models/modelo-consulta';
import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EvolucaoCarteira } from '../models/carteira/evolucao-carteira';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlApi: string = `${environment.urlApi}/clientes`;
  private urlApi2: string = `${environment.urlApi}/carteira`;
  private urlApi3: string = `${environment.urlApi}/atualizacoes`;
  static emitirValorEntradas =  new EventEmitter<any>();
  static emitirMediaEntrada = new EventEmitter<any>();

  constructor(
    private http: HttpClient,
  ) { 

  }

  public consultarCarteiraPorCliente(modeloConsulta:ModeloConsulta): Observable<any>{
    return this.http.post<any>(`${this.urlApi}/carteira-cliente`, modeloConsulta);
  }

  public consultarCarteiraPorBeneficiamento(modeloConsulta:ModeloConsulta):Observable<any>{
    return this.http.post<any>(`${this.urlApi}/carteira-beneficiamento`, modeloConsulta);
  }

  public consultaCarteiraPorBeneficiamentoProduto(modeloConsulta:ModeloConsulta):Observable<any>{
    return this.http.post<any>(`${this.urlApi2}/beneficiamento-produto`, modeloConsulta);
  }

  public consultaCarteiraPorBeneficiamentoDataProdutoCliente(cdBeneficiamento: any, cdCliente:any, data:any):Observable<any>{
    return this.http.post<any>(`${this.urlApi2}/beneficiamento-produto-cliente/${cdBeneficiamento}/${cdCliente}/${data}`, null);
  }

  public consultaCarteiraPorBeneficiamentoDoCliente(modeloConsulta:ModeloConsulta):Observable<any>{
    return this.http.post<any>(`${this.urlApi}/carteira-cliente-beneficiamento`, modeloConsulta);
  }

  public consultaCarteiraPorProdutoDoCliente(modeloConsulta:ModeloConsulta):Observable<any>{
    return this.http.post<any>(`${this.urlApi2}/clientes`, modeloConsulta);
  }

  public isUpdateCarteiraCliente(): Observable<any>{
    return this.http.get<any>(`${this.urlApi3}/carteira`);
  }

  public consultarEvolucaoCarteira(dataIncial: any, dataFinal: any):Observable<any>{
    return this.http.get<any>(`${this.urlApi}/evolucao-carteira/${dataIncial}/${dataFinal}`);
  }

}
