import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MetaProjetada } from '../models/meta-projetada';

@Injectable({
  providedIn: 'root'
})
export class MetaProjetadaService {


  private urlApi = `${environment.urlApi}/meta-projetada`

  constructor(
    private http: HttpClient
  ) { }
  

  public consultarMetaProjetada(data: any): Observable<MetaProjetada>{
      return this.http.get<MetaProjetada>(`${this.urlApi}/${data}`);
  }

  public salvarMetaProjetada(metaProjetada: MetaProjetada):Observable<MetaProjetada>{
    return this.http.post<MetaProjetada>(`${this.urlApi}`, metaProjetada);
  }
}
