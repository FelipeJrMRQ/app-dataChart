import { LoginService } from './../../services/login.service';
import { Component, OnInit,Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import { MatDialog } from '@angular/material/dialog';
import { DlgUpdateSenhaComponent } from 'src/app/shared/dialog/dlg-update-senha/dlg-update-senha.component';
import { DomSanitizer } from '@angular/platform-browser';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';
import * as bootstrap from 'bootstrap';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  public escolha: any = false;
  public escolhaPreto: any = false;
  public informar: boolean = false;
  public tema: any = true;
  public divs: any;
  usuario: Usuario;
  notificacao: any[];
  foto: Blob;
  urlFoto: any;
  teste: any;
  public toolTip = [];


  constructor(
    private loginService: LoginService,
    private router: Router,
    private usuarioService: UsuarioService,
    private openDialog: MatDialog,
    private sanitizer: DomSanitizer,
    private controleExibicaoService: ControleExibicaoService,
    private renderer : Renderer2,
  ) {
    this.usuario = new Usuario();
    this.notificacao = ['1'];
    this.foto = new Blob();
  }

  ngOnInit(): void {
    this.renderer.selectRootElement(this.toolTip = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]')));
    var tootipList = this.toolTip.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    if (sessionStorage.getItem('user')) {
      this.usuarioService.consultarUsuarioPorEmail(sessionStorage.getItem('user')).subscribe({
        next: (res) => {
          this.usuario = res[0];
          UsuarioService.usuarioAutenticado.emit(this.usuario);
        },
      });
    }
    UsuarioService.usuarioAutenticado.subscribe((res) => {
      this.usuario = res;
      this.obterImagemDoPerfil();
    });
    LoginService.informarLogout.subscribe((res) => {
      this.usuario = new Usuario();
    });
  }

  private obterImagemDoPerfil(){
    this.usuarioService.obterFotoDePerfil(sessionStorage.getItem('user')).subscribe({
      next:(res)=>{
        this.foto = res;
        this.urlFoto = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.foto));
      },
      error:(e)=>{
        this.urlFoto = 'assets/avatar.png';
      }
    });
  }

  public alterarImagemPerfil(event: any) {
    let imagemPerfil: File = event.target.files[0];
    let tipoArquivo = [];
    tipoArquivo = imagemPerfil.type.split('/');
    if(tipoArquivo[0]=== 'image'){
      let email: any = sessionStorage.getItem('user')?.toString();
      let novoArquivo = new File([imagemPerfil], `${email}.${tipoArquivo[1]}`,{ type: imagemPerfil.type } )
      let formData = new FormData();
      formData.append('image', novoArquivo);
      this.usuarioService.enviarFotoPerfil(formData, email).subscribe({  
          next:(res)=>{
            this.controleExibicaoService.registrarLog('ALTEROU A IMAGEM DE PERFIL', '');
          },
          complete:()=>{
            this.obterImagemDoPerfil();
          }
        });
    }else{
      console.log('Erro');
    }
  }

  public exibirCabecalhoSeAutenticado(): boolean {
    if (this.usuario.nome != undefined) {
      return true;
    } else {
      return false;
    }
  }

  public abrirAlteracaoSenha(){
    this.openDialog.open(DlgUpdateSenhaComponent, {
      
    });
  }

  public verificar() {
    this.loginService.informarLogin.subscribe((res) => {
      if (res == false) {
        this.informar = res;
      }
    });
  }

  sair() {
    this.router.navigate(['/']);
    sessionStorage.removeItem('dataChart');
    sessionStorage.removeItem('user');
    LoginService.informarLogout.emit(true);
  }
}
