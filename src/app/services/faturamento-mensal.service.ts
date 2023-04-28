import { ObserversModule } from '@angular/cdk/observers';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { FaturamentoMensalCliente } from '../models/faturamento/faturamento-mensal-cliente';
import { HttpClient } from '@angular/common/http';
import { FaturamentoMensalBeneficiamento } from '../models/faturamento/faturamento-mensal-beneficiamento';
import { FaturamentoMensalProduto } from '../models/faturamento/faturamento-mensal-produto';
import { FaturamentoMensal } from '../models/faturamento/faturamento-mensal';

@Injectable({
  providedIn: 'root'
})
export class FaturamentoMensalService {

  private urlApi = `${environment.urlApi}/faturamento-mensal`;

  constructor(
    private http: HttpClient,
  ) { }

  public consultaFaturamentoMensalCliente(dataInicial: any, dataFinal: any): Observable<FaturamentoMensalCliente[]>{
      return this.http.get<FaturamentoMensalCliente[]>(`${this.urlApi}/clientes/${dataInicial}/${dataFinal}`);
  }

  public consultaFaturamentoMensalBeneficiamento(dataInicial: any, dataFinal: any): Observable<FaturamentoMensalBeneficiamento[]>{
    return this.http.get<FaturamentoMensalBeneficiamento[]>(`${this.urlApi}/beneficiamentos/${dataInicial}/${dataFinal}`);
  }

  public consultaFaturamentoMensalProduto(dataInicial: any, dataFinal: any): Observable<FaturamentoMensalProduto[]>{
    return this.http.get<FaturamentoMensalProduto[]>(`${this.urlApi}/produtos/${dataInicial}/${dataFinal}`);
  }

  public detalhesDoClientePorBeneficiamento(dataInicial: any, dataFinal: any, cdCliente: any):Observable<FaturamentoMensalProduto[]>{
    return this.http.get<FaturamentoMensalProduto[]>(`${this.urlApi}/detalhes-beneficiamentos/${dataInicial}/${dataFinal}/${cdCliente}`);
  }

  public detalhesDoClientePorProduto(dataInicial: any, dataFinal: any, cdCliente: any):Observable<FaturamentoMensalProduto[]>{
    return this.http.get<FaturamentoMensalProduto[]>(`${this.urlApi}/detalhes-produtos/${dataInicial}/${dataFinal}/${cdCliente}`);
  }

  public detalhesDoBeneficiamentoPorCliente(dataInicial: any, dataFinal: any, cdBeneficiamento: any): Observable<FaturamentoMensalCliente[]>{
      return this.http.get<FaturamentoMensalCliente[]>(`${this.urlApi}/detalhes-clientes/${cdBeneficiamento}/${dataInicial}/${dataFinal}`);
  }

  public detalhesDeProdutosDoBeneficiamento(dataInicial: any, dataFinal: any, cdBeneficiamento: any):Observable<FaturamentoMensalProduto[]>{
    return this.http.get<FaturamentoMensalProduto[]>(`${this.urlApi}/detalhes-produtos-beneficiamento/${dataInicial}/${dataFinal}/${cdBeneficiamento}`);
  }

  public detalhesDoBeneficiamentoPorProduto(dataInicial: any, dataFinal: any, cdCliente: any, cdBeneficiamento:any):Observable<FaturamentoMensalProduto[]>{
    return this.http.get<FaturamentoMensalProduto[]>(`${this.urlApi}/detalhes-beneficiamentos-produtos/${dataInicial}/${dataFinal}/${cdCliente}/${cdBeneficiamento}`);
  }

  public faturamentoDeProdutosDoBeneficiamentoDeCliente(dataInicial: any, dataFinal: any, cdCliente: any, cdBeneficiamento:any):Observable<FaturamentoMensalProduto[]>{
    return this.http.get<FaturamentoMensalProduto[]>(`${this.urlApi}/produtos-benef/${dataInicial}/${dataFinal}/${cdCliente}/${cdBeneficiamento}`);
  }

  public consultaTotalFaturamentoPorMes(dataInicial: any, dataFinal: any): Observable<FaturamentoMensal[]>{
    return this.http.get<FaturamentoMensal[]>(`${this.urlApi}/total-mes/${dataInicial}/${dataFinal}`);
  }

}
