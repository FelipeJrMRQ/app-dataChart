import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Produto } from '../models/produto/Produto';
import { IncidenciaNovosNegocioDTO } from '../models/incidencia-novos-negocios-dto';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  private urlApi = `${environment.urlApi}/produtos`;
  static movimentoProdutos = new EventEmitter<any>();

  constructor(
    private http: HttpClient
  ) { }

  public consultarPrecoProduto(cdProduto: any): Observable<Produto> {
    return this.http.get<Produto>(`${this.urlApi}/preco/${cdProduto}`);
  }

  public consultaProdutosPorPeriodoInclusao(dataInicial: any, dataFinal: any): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.urlApi}/periodo-inclusao/${dataInicial}/${dataFinal}`);
  }

  public consultaIncidenciaNovosNegocios(dataInicial: any, dataFinal: any): Observable<IncidenciaNovosNegocioDTO[]> {
    return this.http.get<IncidenciaNovosNegocioDTO[]>(`${this.urlApi}/incidencia-novos-negocios/${dataInicial}/${dataFinal}`);
  }

  public consultarMovimentoProduto(dataInicial: any, dataFinal: any,): Observable<any> {
    return this.http.get(`${this.urlApi}/movimento-cliente/${dataInicial}/${dataFinal}`);
  }

  public consultarMovimentoProdutoMensal(dataInicial: any, dataFinal: any,): Observable<any> {
    return this.http.get(`${this.urlApi}/movimento-mensal/${dataInicial}/${dataFinal}`);
  }

  public consultarMovimentacaoCliente(dataInicial: any, dataFinal: any, cdCliente: any): Observable<any> {
    return this.http.get(`${this.urlApi}/movimento/${dataInicial}/${dataFinal}/${cdCliente}`);
  }

}
