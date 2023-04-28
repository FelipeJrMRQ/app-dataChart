import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { TelaUsuario } from 'src/app/models/tela/tela-usuario';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { TelaSistema } from 'src/app/models/tela/tela-sistema';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioService } from '../usuario.service';

@Injectable({
  providedIn: 'root'
})
export class TelaUsuarioService {

  urlApi = `${environment.urlApi}/telas-usuario`

  static Telas = new EventEmitter<TelaUsuario[]>();

  constructor(
    private http: HttpClient,
  ) {

  }



  public consultarTelas(usuario: Usuario): Observable<TelaUsuario[]> {
    return this.http.post<TelaUsuario[]>(`${this.urlApi}/user`, usuario);
  }

  public salvarTela(tela: TelaUsuario): Observable<any> {
    return this.http.post<any>(`${this.urlApi}`, tela);
  }

  public excluirTela(tela: TelaUsuario) {
    return this.http.delete<any>(`${this.urlApi}/${tela.id}`);
  }

  public consultarTelaPorNome(nome: string): Observable<TelaUsuario[]> {
    return this.http.get<TelaUsuario[]>(`${this.urlApi}/${nome}`);
  }


}
