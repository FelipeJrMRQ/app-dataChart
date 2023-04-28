import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class LoginService {


  urlApi = `${environment.obterToken}`
  usuarioAutenticado: boolean = false;
  tokenUsuario: string | undefined;
  login = new Usuario();
  httpErrorReponse: HttpErrorResponse | undefined;
  informarLogin = new EventEmitter<boolean>();
  public static informarLogout = new EventEmitter<boolean>();

  constructor(
    private http: HttpClient,
  ) {

  }

  realizarLogin(usuario: string, senha: string): Observable<any> {
    this.login.password = senha;
    this.login.username = usuario;
    return this.http.post<any>(this.urlApi, this.login);
  }

  
}
