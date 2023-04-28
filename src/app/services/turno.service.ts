import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Turno } from '../models/turno';


@Injectable({
  providedIn: 'root'
})
export class TurnoService {

  urlApi =  `${environment.urlApi}/turnos`;
  static turnoCadastrado = new EventEmitter<any>;

  constructor(
    private http: HttpClient,
  ) { }

  public salvar(turno: Turno): Observable<any>{
      return this.http.post<any>(`${this.urlApi}`, turno);
  }

  public consultar(): Observable<Turno[]>{
    return this.http.get<Turno[]>(`${this.urlApi}`);
  }

  public excluir():Observable<any>{
    return this.http.delete<any>(`${this.urlApi}`);
  }
}
