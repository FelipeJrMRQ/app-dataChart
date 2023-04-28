import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ParametrosMeta } from '../models/parametros-meta';

@Injectable({
  providedIn: 'root'
})
export class ParametrosMetaService {

  static emitirValorMetaDoDia = new EventEmitter<any>();

  private urlApi: string = `${environment.urlApi}/metas`;

  constructor(
    private http: HttpClient,
  ) { }

  public salvarMetasDoMes(metas: ParametrosMeta): Observable<ParametrosMeta> {
    return this.http.post<ParametrosMeta>(`${this.urlApi}/${metas.data}`, metas);
  }

  /**
   * Retorna todas as metas de faturamentos cadastradas ao longo do tempo
   * @returns 
   */
  public consultarMetasDeFaturamento(): Observable<ParametrosMeta[]> {
    return this.http.get<ParametrosMeta[]>(`${this.urlApi}`);
  }

  /**
   * Retorna a meta de faturamento do mês
   * @param data 
   * @returns 
   */
  public consultarParamentrosMeta(data: any): Observable<ParametrosMeta> {
    return this.http.get<ParametrosMeta>(`${this.urlApi}/find-date/${data}`);
  }

   /**
   * Retorna a meta de faturamento do mês
   * @param data 
   * @returns 
   */
   public consultarParamentrosMetaPorPeriodo(dataInicial: any, dataFinal: any): Observable<ParametrosMeta[]> {
    return this.http.get<ParametrosMeta[]>(`${this.urlApi}/find-date/${dataInicial}/${dataFinal}`);
  }

}
