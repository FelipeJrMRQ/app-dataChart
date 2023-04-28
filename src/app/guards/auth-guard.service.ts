import { forkJoin, Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, GuardsCheckEnd, Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { Usuario } from '../models/usuario';
import { TelaUsuarioService } from '../services/telas/tela-usuario.service';
import { TelaUsuario } from '../models/tela/tela-usuario';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, switchMap } from 'rxjs/operators'; // Importe a propriedade map diretamente do RxJS

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  private usuario: Usuario;
  private telasUsuario: TelaUsuario[];
  private destino: string = '';
  jwtHelper: JwtHelperService = new JwtHelperService();

  //Estilos
  snackBarErro = 'my-snack-bar-erro';
  snackBarSucesso = 'my-snack-bar-sucesso';
  servico1: any;

  constructor(
    private usuarioService: UsuarioService,
    private telaUsuaservice: TelaUsuarioService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.usuario = new Usuario();
    this.telasUsuario = [];
  }

  canActivate(route: ActivatedRouteSnapshot) {
    if (sessionStorage.getItem('user')) {
      let rota: any =  [];
      rota = (route.routeConfig?.path?.split('/'));
      this.destino = rota[0];
      return forkJoin({
        s1: this.usuarioService.consultarUsuarioPorEmail(sessionStorage.getItem('user')).pipe(
          switchMap((usuario) => {
            this.usuario = usuario;
            return this.telaUsuaservice.consultarTelas(usuario[0]);
          })
        ),
      }).pipe(
        map(results => {
          this.telasUsuario = results.s1;
          if (this.verificarPermissoesDeAcesso()) {
            return true;
          } else {
            this.openSnackBar('Você não possui permissão de acesso a este recurso!', this.snackBarErro);
            return false;
          }
        })
      );
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }

  private verificarPermissoesDeAcesso(): boolean {
    if (this.telasUsuario.find(t => t.rota == this.destino)) {
      return true;
    } else {
      return false;
    }
  }

  openSnackBar(mensagem: string, tipo: string) {
    this.snackBar.open(mensagem, 'X', {
      panelClass: [tipo],
      duration: 12000,
      horizontalPosition: "right",
      verticalPosition: "top",
    });
  }

  obterToken() {
    const tokenString = sessionStorage.getItem('dataChart');
    if (tokenString != undefined) {
      const token = tokenString;
      return token;
    }
    return null;
  }

}
