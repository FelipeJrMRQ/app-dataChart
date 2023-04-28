import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LogSistemaDTO } from '../models/log-sistema/log-sistema-dto';
import { LogSistema } from '../models/log-sistema/log-sistema';
import { forkJoin, Observable } from 'rxjs';
import { UsuarioService } from './usuario.service';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class LogSistemaService {

  urlApi = `${environment.urlApi}/logs`
  logsDoUsuario: LogSistemaDTO[];

  constructor(
    private http: HttpClient,
    private usuarioService: UsuarioService,
  ) { 
    this.logsDoUsuario = [];
  }

  public salvarLog(log: LogSistema): Observable<any>{
     return this.http.post<LogSistema>(this.urlApi, log);
  }


  private consultaLogs(usuario: Usuario,dataInicial: any, dataFinal: any ):Observable<LogSistemaDTO[]>{
    return this.http.get<LogSistemaDTO[]>(`${this.urlApi}/${usuario.id}/${dataInicial}/${dataFinal}`);
  }

  public consultarLogsDoUsuario(dataInicial: any, dataFinal: any):Observable<LogSistemaDTO[]>{
    return new Observable(obs=>{
    forkJoin({
      s1: this.usuarioService.consultarUsuarioPorEmail(sessionStorage.getItem('user')),
    }).subscribe(({s1})=>{ 
        this.consultaLogs(s1[0], dataInicial, dataFinal).subscribe({
          next:(res)=>{
            obs.next(res);
            obs.complete();
          },error:(e)=>{
            obs.error(e);
          }
        });
    });
    });
  }


}
