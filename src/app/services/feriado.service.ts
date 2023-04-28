import { FaturamentoDiario } from '../models/faturamento/faturamento-diario';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeriadoService {

  faturamento:FaturamentoDiario [] = [];

  constructor(
    private http:HttpClient
  ) { }

private urlApi:string = `${environment.urlApi}`


    public consultarFeriadosExistentes(data:any):Observable<[]>{
      return this.http.get<[]>(`${this.urlApi}/dias/feriado/${data}`);
    }
}
