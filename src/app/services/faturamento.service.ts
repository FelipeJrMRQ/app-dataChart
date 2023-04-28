import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ModeloConsulta } from '../models/modelo-consulta';
import { environment } from 'src/environments/environment';
import { ValorFaturamento } from '../models/faturamento/valor-faturamento';

@Injectable({
  providedIn: 'root'
})
export class FaturamentoService {


  static emitirValorCarteira = new EventEmitter<any>();
  static emitirValorFaturamentoMes = new EventEmitter<any>();
  static emitirValorFaturamentoDia = new EventEmitter<any>();
  static emitirValorMediaFaturamento = new EventEmitter<any>();
  static emitirvalorFaturamentoDiasUteis = new EventEmitter<any>();
  static emitirData = new EventEmitter<any>();

  
  private urlApi: string = `${environment.urlApi}/faturamento`;
  private urlApi2: string = `${environment.urlApi}/atualizacoes`;

  constructor(
    private http: HttpClient
  ) { }

  public consultaFaturamentoDiario(modeloConsulta: ModeloConsulta):Observable<any>{
    return this.http.post<ModeloConsulta>(`${this.urlApi}/faturamento-diario`, modeloConsulta);
  }

  public consultaFaturamentoAnualProduto(modeloConsulta: ModeloConsulta): Observable<any>{
    return this.http.post(`${this.urlApi}/faturamento-anual-produto`, modeloConsulta);
  }

  public consultaFaturamentoPorCliente(modeloConsulta:ModeloConsulta):Observable<any>{
    return this.http.post<ModeloConsulta>(`${this.urlApi}/faturamento-cliente`,modeloConsulta);
  }

  public consultaFaturamentoPorProduto(modeloConsulta:ModeloConsulta):Observable<any>{
    return this.http.post<ModeloConsulta>(`${this.urlApi}/faturamento-cliente-produto`,modeloConsulta);
  }

  public consultaFaturamentoPorBeneficiamentoCliente(modeloConsulta: ModeloConsulta): Observable<any>{
    return this.http.post<any>(`${this.urlApi}/faturamento-beneficiamento`, modeloConsulta);
  }

  public consultaFaturamentoPorBeneficiamento(modeloConsulta: ModeloConsulta): Observable<any>{
    return this.http.post<any>(`${this.urlApi}/beneficiamentos`, modeloConsulta);
  }

  public consultaFaturamentoDeClientePorBeneficiamento(modeloConsulta: ModeloConsulta){
    return this.http.post<any>(`${this.urlApi}/faturamento-beneficiamento-cliente`, modeloConsulta);
  }

  public isUpdateFaturamento():Observable<any>{
    return this.http.get<any>(`${this.urlApi2}/faturamento`);
  }

  public consultaValorFaturamento(mc: ModeloConsulta):Observable<ValorFaturamento>{
    return this.http.post<ValorFaturamento>(`${this.urlApi}/valor-faturamento`, mc);
  }

}

