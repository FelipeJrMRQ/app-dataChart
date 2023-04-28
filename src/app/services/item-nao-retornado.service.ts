import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ItemNaoRetornado } from '../models/itens-nao-retornados';

@Injectable({
  providedIn: 'root'
})
export class ItemNaoRetornadoService {

  private apiUrl = `${environment.urlApi}/itens-nao-retornados`

  constructor(
    private http: HttpClient,
  ) { }

  public consultarItensNaoRetornados(): Observable<ItemNaoRetornado[]>{
    return this.http.get<ItemNaoRetornado[]>(`${this.apiUrl}/itens-nao-retornados`);
  }
}
