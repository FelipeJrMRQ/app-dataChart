import { Injectable } from '@angular/core';
import { TelaUsuario } from 'src/app/models/tela/tela-usuario';
import { Observable, forkJoin, switchMap } from 'rxjs';
import { UsuarioService } from '../usuario.service';
import { TelaUsuarioService } from '../telas/tela-usuario.service';
import { Usuario } from 'src/app/models/usuario';
import { LogSistemaService } from '../log-sistema.service';
import { LogSistema } from 'src/app/models/log-sistema/log-sistema';

@Injectable({
  providedIn: 'root'
})
export class ControleExibicaoService {

  private usuario: Usuario;

  constructor(
    private usuarioService: UsuarioService,
    private telaUsuarioService: TelaUsuarioService,
    private logSistemaService: LogSistemaService,
  ) {
    this.usuario = new Usuario();
  }

  /**
     * Retorna um booleam de acordo com as permissoes do usuário em 
     * relação as suas telas e componentes
     * 
     * @param nomeComponente 
     * @param nomeTela
     * @returns 
     */
  public verificaPermissaoDeAcesso(nomeComponente: string, nomeTela: string): Observable<boolean> {
    return new Observable(obs => {
      forkJoin({
        s1: this.consultaUsuarioAutenticado(),
      }).subscribe(({ s1 }) => {
        if (nomeTela == '' || undefined) {
          obs.error('O nome da tela dever ser preenchido!');
        } else if (nomeComponente == '' || undefined) {
          obs.error('O nome do componente deve ser preenchido!')
        }
        let telaEncontrada = this.verificaExistenciaTelaUsuario(s1, nomeTela);
        obs.next(this.exibicaoComponente(telaEncontrada, nomeComponente));
        obs.complete();
      });
    })
  }

  /**
   * Recebe as telas do usuário como parametro e faz a verificação se dentro da lista há
   * alguma rota compativel se houver retorna o objeto encontrado caso contrario retorna
   * undefined
   * @param telas 
   * @param nomeTela 
   * @returns 
   */
  private verificaExistenciaTelaUsuario(telas: TelaUsuario[], nomeTela: string): TelaUsuario | undefined {
    return telas.find((obj: TelaUsuario) => obj.rota === nomeTela);
  }

  /**
   * Realiza uma consulta no sistema do usuário autenticado na sequência
   * realiza uma consulta das telas nas quais o usuário tem acesso e retorna
   * as telas do usuário no obsevable
   * 
   * @returns 
   */
  private consultaUsuarioAutenticado(): Observable<any> {
    return new Observable(obs => {
      this.usuarioService.consultarUsuarioPorEmail(sessionStorage.getItem('user')).subscribe({
        next: (res) => {
          this.consultaTelasDoUsuario(res[0]).subscribe({
            next: (res) => {
              obs.next(res);
              obs.complete();
            },
            error: (e) => {
              obs.error(e);
            }
          });
        }
      });
    });
  }

  /**
   * Quando a consulta pelo usuário autenticado for concluída esta consulta será
   * executada em seguida para identificar as telas e os componentes no qual ele
   * tenha acesso 
   * 
   * @param usuario 
   * @returns 
   */
  private consultaTelasDoUsuario(usuario: Usuario): Observable<any> {
    return new Observable(obs => {
      this.telaUsuarioService.consultarTelas(usuario).subscribe({
        next: (res) => {
          obs.next(res);
          obs.complete();
        },
        error: (e) => {
          obs.error(e);
        }
      });
    })
  }

  /**
   * Utilizado para registrar eventos no sistema do usuário 
   * recebe a descrição do evento como parametro.
   * @param descricao 
   */
  public registrarLog(descricao: string) {
    this.usuarioService.consultarUsuarioPorEmail(sessionStorage.getItem('user')).subscribe({
      next: (res) => {
        this.logSistemaService.salvarLog(new LogSistema(null, descricao, res[0])).subscribe({
          next: () => {
            
          },
          error:(e)=>{
            console.log('Falha ao registrar log');
          }
        });
      }
    });
   
  }

  /**
   * Verifica se há algum componente com o nome fornecido nas 
   * telas do usuário e retorna um booleam indicando se o 
   * componente deve ser exibido ou não
   * 
   * @param telas 
   * @param nomeComponente 
   * @returns 
   */
  private exibicaoComponente(tela: TelaUsuario | undefined, nomeComponente: string): boolean {
    let permissao = false;
    if (tela != undefined) {
      permissao = tela.componentes.some(c => c.nome === nomeComponente);
    }
    return permissao;
  }
}
