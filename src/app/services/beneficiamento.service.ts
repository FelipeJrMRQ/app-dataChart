import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ModeloConsulta } from '../models/modelo-consulta';

@Injectable({
  providedIn: 'root'
})
export class BeneficiamentoService {


  private urlApi = `${environment.urlApi}/beneficiamentos`
  private urlApi2 = `${environment.urlApi}/atualizacoes`

  constructor(
    private http: HttpClient
  ) { }

  public consultarCarteiraPorBeneficiamento(modeloConsulta:ModeloConsulta): Observable<any>{
    return this.http.post<ModeloConsulta>(`${this.urlApi}/carteira-beneficiamento`,modeloConsulta);
  }

  public isUpdateCarteiraBeneficiamento():Observable<any>{
    return this.http.get<any>(`${this.urlApi2}/carteira`);
  }
  
}
