import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Usuario } from '../models/usuario';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { UsuarioDTO } from '../models/usuario-dto';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private urlApi = `${environment.urlApi}/usuarios`;
  private urlApiComponente = `${environment.urlApi}/componentes`
  static usuarioAutenticado = new EventEmitter<Usuario>();
  usuario: Usuario;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.usuario = new Usuario();
  }


  public cadastrarUsuario(usuario: Usuario): Observable<any> {
    return this.http.post(`${this.urlApi}/${sessionStorage.getItem('user')}`, usuario);
  }
  public enviarFotoPerfil(imagem:any, email: any):Observable<any>{
    return this.http.post(`${this.urlApi}/upload-imagem-pefil/${email}`,imagem);
  }

  public obterFotoDePerfil(email: any):Observable<Blob>{
    return this.http.get(`${this.urlApi}/imagem-perfil/${email}`, {responseType: 'blob'});
  }

  public alterarUsuario(usuario: Usuario): Observable<any> {
    return this.http.put(`${this.urlApi}`, usuario);
  }

  public consultarUsuarioPorEmail(email: any): Observable<any> {
    return this.http.get(`${this.urlApi}/${email}`);
  }

  public consultarUsuarioPorEmailRecuperarSenha(email: any): Observable<any> {
    return this.http.get(`${this.urlApi}/recuperarSenha/${email}`);
  }

  public bloquearUsuario(id: number) {
    return this.http.get(`${this.urlApi}/bloquear/${id}`);
  }

  public validarConviteUsuario(codigoConvite: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.urlApi}/codigo-convite/${codigoConvite}`);
  }

  public removerComponenteTelaUsuario(id: number): Observable<any>{
    return this.http.delete<any>(`${this.urlApiComponente}/${id}`);
  }

  public acessoNegado() {
    this.router.navigate(['/']);
  }

  public consultarTodos(): Observable<UsuarioDTO[]>{
    return this.http.get<UsuarioDTO[]>(this.urlApi);
  }

  public alterarSenha(email: any , senha: any, nSenha: any):Observable<any>{
    return this.http.get<Usuario>(`${this.urlApi}/alterar-senha/${email}/${senha}/${nSenha}`);
  }
}
