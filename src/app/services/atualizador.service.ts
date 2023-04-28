import { ModeloRetorno } from './../models/modelo-retorno';
import { Observable } from 'rxjs';
import { ModeloConsulta } from 'src/app/models/modelo-consulta';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AtualizadorService {

  private urlApi: string = `${environment.urlApi}/atualizar`;

  constructor(
    private http: HttpClient,
  ) { }

  public atualizarMetaDiaria(modeloConsulta: ModeloConsulta): Observable<ModeloRetorno> {
    return this.http.post<ModeloRetorno>(`${this.urlApi}/meta-diaria`, modeloConsulta);
  }

  public atualizarEntradaDoDia(modeloCosulta: ModeloConsulta): Observable<ModeloRetorno> {
    return this.http.post<ModeloRetorno>(`${this.urlApi}/entrada-diaria`, modeloCosulta);
  }

  public atualizarEntradaPorCliente(modeloCosulta: ModeloConsulta): Observable<ModeloRetorno> {
    return this.http.post<ModeloRetorno>(`${this.urlApi}/entrada-cliente`, modeloCosulta);
  }

  public atualizarEntradaPorProduto(modeloCosulta: ModeloConsulta): Observable<ModeloRetorno> {
    return this.http.post<ModeloRetorno>(`${this.urlApi}/entrada-produto`, modeloCosulta);
  }

  public atualizarCarteiraCliente(modeloConsulta: ModeloConsulta): Observable<ModeloRetorno> {
    return this.http.post<ModeloRetorno>(`${this.urlApi}/carteira-cliente`, modeloConsulta);
  }

  public atualizarCarteiraBeneficiamento(modeloConsulta: ModeloConsulta): Observable<ModeloRetorno> {
    return this.http.post<ModeloRetorno>(`${this.urlApi}/carteira-beneficiamento`, modeloConsulta);
  }
  public atualizarFaturamentoDiario(modelocoConsulta: ModeloConsulta): Observable<ModeloRetorno> {
    return this.http.post<ModeloRetorno>(`${this.urlApi}/faturamento-diario`, modelocoConsulta);
  }

  public atualizarMetaProjetada(modeloConsulta: ModeloConsulta): Observable<ModeloRetorno> {
    return this.http.post<ModeloRetorno>(`${this.urlApi}/meta-projetada`, modeloConsulta);
  }

  public atualizarFaturamentoCliente(modeloConsulta: ModeloConsulta): Observable<ModeloRetorno> {
    return this.http.post<ModeloRetorno>(`${this.urlApi}/faturamento-cliente`, modeloConsulta);
  }

  public atualizarFaturamentoClienteProduto(modeloConsulta: ModeloConsulta): Observable<ModeloRetorno> {
    return this.http.post<ModeloRetorno>(`${this.urlApi}/faturamento-cliente-produto`, modeloConsulta);
  }


}
