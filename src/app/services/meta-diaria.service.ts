import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MetaDiaria } from '../models/meta-diaria';

@Injectable({
  providedIn: 'root'
})
export class MetaDiariaService {


  private urlApi = `${environment.urlApi}/meta-diaria`;

  constructor(
    private http: HttpClient,
  ) { }

  public consultarMetaDoDia(data : string): Observable<MetaDiaria> {
      return this.http.get<MetaDiaria>(`${this.urlApi}/${data}`);
  }

  public salvarMetaDiaria(metaDiaria: MetaDiaria): Observable<MetaDiaria>{
    return this.http.post<MetaDiaria>(`${this.urlApi}`, metaDiaria);
  }

  public consultaMetaDoMes(dataInicial: string, dataFinal: string): Observable<MetaDiaria[]>{
      return this.http.get<MetaDiaria[]>(`${this.urlApi}/${dataInicial}/${dataFinal}`);
  }
}
