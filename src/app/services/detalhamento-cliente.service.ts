import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FaturamentoDiarioDTO } from '../models/detalhamento-cliente/faturamento-diario-dto';
import { FaturamentoMensalDTO } from '../models/detalhamento-cliente/faturamento-mensal-dto';
import { EntradaDoMesDTO } from '../models/detalhamento-cliente/entrada-mes-dto';
import { EntradaDoDiaDTO } from '../models/detalhamento-cliente/entrada-dia-dto';
import { CarteiraDoClienteDTO } from '../models/detalhamento-cliente/carteira-cliente-dto';

@Injectable({
  providedIn: 'root'
})
export class DetalhamentoClienteService {

  private urlApi: any = `${environment.urlApi}/detalhamento-cliente`

  constructor(
    private http: HttpClient,
  ) { }

  public consultarFaturamentoDiarioDoCliente(dataInicial: any, dataFinal: any, cdCliente: any): Observable<FaturamentoDiarioDTO[]>{
    return this.http.get<FaturamentoDiarioDTO[]>(`${this.urlApi}/faturamento-diario/${dataInicial}/${dataFinal}/${cdCliente}`);
  }

  public consultarFaturamentoMensalDoCliente(dataInicial: any, dataFinal: any, cdCliente: any): Observable<FaturamentoMensalDTO[]>{
    return this.http.get<FaturamentoMensalDTO[]>(`${this.urlApi}/faturamento-mensal/${dataInicial}/${dataFinal}/${cdCliente}`);
  }

  public consultarEvolucaoCarteiraCliente(dataInicial: any, dataFinal: any, cdCliente: any): Observable<FaturamentoDiarioDTO[]>{
    return this.http.get<FaturamentoDiarioDTO[]>(`${this.urlApi}/evolucao-carteira-cliente/${dataInicial}/${dataFinal}/${cdCliente}`);
  }

  public consultaEntradaDoDiaDoCliente(dataInicial: any, dataFinal: any, cdCliente: any): Observable<EntradaDoDiaDTO[]>{
    return this.http.get<EntradaDoDiaDTO[]>(`${this.urlApi}/entrada-diaria/${dataInicial}/${dataFinal}/${cdCliente}`);
  }

  public consultaEntradaDoMesDoCliente(dataInicial: any, dataFinal: any, cdCliente: any): Observable<EntradaDoMesDTO[]>{
    return this.http.get<EntradaDoMesDTO[]>(`${this.urlApi}/entrada-mensal/${dataInicial}/${dataFinal}/${cdCliente}`);
  }

  public consultaCarteiraDoCliente(dataInicial: any, cdCliente: any): Observable<CarteiraDoClienteDTO[]>{
    return this.http.get<CarteiraDoClienteDTO[]>(`${this.urlApi}/carteira-cliente/${dataInicial}/${cdCliente}`);
  }

}
