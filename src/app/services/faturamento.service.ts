import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ModeloConsulta } from '../models/modelo-consulta';
import { environment } from 'src/environments/environment';
import { ValorFaturamento } from '../models/faturamento/valor-faturamento';
import { ProducaoPorBeneficiamentoDTO } from '../models/produto/producao-beneficiamento-dto';
import { HistoricoFaturamentoClienteDTO } from '../models/faturamento/historico-faturamento-cliente-dto';

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

  public consultaExtratoAnualDeFaturamentoPorProdutoDoCliente(modeloConsulta: ModeloConsulta): Observable<any>{
    return this.http.post(`${this.urlApi}/extrato-anual-produto`, modeloConsulta);
  }

  public consultaExtratoAnualDeFaturamentoPorBeneficiamentoDoCliente(modeloConsulta: ModeloConsulta): Observable<any>{
    return this.http.post(`${this.urlApi}/extrato-anual-beneficiamento`, modeloConsulta);
  }

  public consultaExtratoAnualDeFaturamentoPorProdutoDoBeneficiamento(dataInicial: any, dataFinal:any, cdCliente:any, cdBeneficiamento:any): Observable<any>{
    return this.http.get(`${this.urlApi}/extrato-anual-beneficiamento-produto/${dataInicial}/${dataFinal}/${cdCliente}/${cdBeneficiamento}`);
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

  public consultarProducaoPorBeneficiamentoValorQuantidade(dataInicial: any, dataFinal: any): Observable<ProducaoPorBeneficiamentoDTO[]>{
      return this.http.get<ProducaoPorBeneficiamentoDTO[]>(`${this.urlApi}/producao-beneficiamento-valor-quantidade/${dataInicial}/${dataFinal}`);
  }

  public consultaHistoricoDeFaturamentoPorCliente(dataInicial: any, dataFinal: any): Observable<HistoricoFaturamentoClienteDTO[]>{
    return this.http.get<HistoricoFaturamentoClienteDTO[]>(`${this.urlApi}/historico-faturamento-cliente/${dataInicial}/${dataFinal}`);
  }

}

