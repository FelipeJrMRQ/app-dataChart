import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { ModeloConsulta } from '../models/modelo-consulta';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EntradaMensal } from '../models/entrada/entrada-mensal';

@Injectable({
  providedIn: 'root'
})
export class EntradaService {

  private urlApi = environment.urlApi + "/entradas";
  private urlApi2 = environment.urlApi + "/atualizacoes";
  static dataEntrada = new EventEmitter<any>();

  constructor(
    private http: HttpClient,
  ) { }


  public consultaEntradasPorCliente(modeloConsulta: ModeloConsulta): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/clientes`, modeloConsulta);
  }

  public consultaEntradasPorClienteData(modeloConsulta: ModeloConsulta): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/cliente-periodo`, modeloConsulta);
  }

  public consultaEntradasPorBeneficiamento(modeloConsulta: ModeloConsulta): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/beneficiamentos`, modeloConsulta);
  }

  public consultaEntradaDeClientePorBeneficiamento(modeloConsulta: ModeloConsulta): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/cliente-beneficiamento`, modeloConsulta);
  }

  public consultaEntradasPorBeneficiamentoCliente(modeloConsulta: ModeloConsulta): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/beneficiamentos-cliente`, modeloConsulta);
  }

  public consultaEntradasPorProduto(modeloConsulta: ModeloConsulta): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/produtos`, modeloConsulta);
  }

  public consultarEntradasPorPeriodo(modeloConsulta: ModeloConsulta): Observable<any> {
    return this.http.post<ModeloConsulta>(`${this.urlApi}/entradas`, modeloConsulta);
  }

  public consultaEntradasPorBeneficiamentoECliente(cdBeneficiamento: any, cdCliente: any, data: any) {
    return this.http.post<any>(`${this.urlApi}/entradas-beneficiamento-cliente/${cdBeneficiamento}/${cdCliente}/${data}`, null);
  }

  public isUpdateEntradas(): Observable<any> {
    return this.http.get<any>(`${this.urlApi2}/entrada`);
  }

  public consultaExtratoAnualDeEntradasPorProdutoDoCliente(dataInicial: any, dataFinal: any, cdCliente: any): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/extrato-anual-entrada-produto/${dataInicial}/${dataFinal}/${cdCliente}`);
  }

  public consultaExtratoAnualDeEntradasPorBeneficiamentoDoCliente(dataInicial: any, dataFinal: any, cdCliente: any): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/extrato-anual-entrada-beneficiamento/${dataInicial}/${dataFinal}/${cdCliente}`);
  }

  public consultaExtratoAnualDeEntradasPorProdutoDoBeneficiamento(dataInicial: any, dataFinal: any, cdCliente: any, cdBeneficiamento: any): Observable<any> {
    return this.http.get<any>(`${this.urlApi}/extrato-anual-entrada-beneficiamento-produto/${dataInicial}/${dataFinal}/${cdCliente}/${cdBeneficiamento}`);
  }

  public consultarEntradaMensal(dataIncial: any, dataFinal: any): Observable<EntradaMensal[]>{
    return this.http.get<EntradaMensal[]>(`${this.urlApi}/entrada-mensal/${dataIncial}/${dataFinal}`);
  }
}
