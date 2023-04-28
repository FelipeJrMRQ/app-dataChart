import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ModeloRetorno } from '../models/modelo-retorno';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  private urlApi = `${environment.urlApi}/produtos`;

  constructor(
    private http: HttpClient
  ) { }


  public consultarPrecoProduto(cdProduto: any):Observable<ModeloRetorno>{
    return this.http.get<ModeloRetorno>(`${this.urlApi}/preco/${cdProduto}`);
  }
}
