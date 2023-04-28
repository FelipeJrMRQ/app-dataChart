import { BoundElementProperty } from '@angular/compiler';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs';
import { ComponenteTela } from 'src/app/models/tela/componente-tela';
import { TelaSistema } from 'src/app/models/tela/tela-sistema';
import { TelaSistemaService } from 'src/app/services/telas/tela-sistema.service';
import { DlgCadastroTelaComponent } from '../dlg-cadastro-tela/dlg-cadastro-tela.component';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';

@Component({
  selector: 'app-tela-form',
  templateUrl: './tela-form.component.html',
  styleUrls: ['./tela-form.component.css']
})
export class TelaFormComponent implements OnInit {

  telaSistema: TelaSistema;
  telasDoSistema: TelaSistema[];
  panelOpenState = false;
  nomeComponente: any;
  checkBox: any;
  componentesSelecionados: any = [];

  constructor(
    private telaService: TelaSistemaService,
    private dialog: MatDialog,
    private render: Renderer2,
    private controleExibicaoService: ControleExibicaoService,
  ) {
    this.telaSistema = new TelaSistema();
    this.telasDoSistema = [];
    this.componentesSelecionados = [];
  }

  ngOnInit(): void {
    this.controleExibicaoService.registrarLog('ACESSOU A TELA DE CONFIGURACAO DE TELAS');
    this.consultarTelasDoSistama();
  }

  public consultarTelasDoSistama() {
    this.telasDoSistema = [];
    this.telaService.consultarTelas().subscribe({
      next: (res) => {
        this.telasDoSistema = res;
      }
    });
  }

  public selecionarComponentes(event: any, tela: TelaSistema) {
    if (event.target.checked) {
      this.componentesSelecionados.push(event.target.defaultValue);
    } else {
      this.componentesSelecionados.splice(this.componentesSelecionados.findIndex((c: any) => c == event.target.defaultValue));
    }
  }

  public removerComponentes(tela: TelaSistema) {
    this.componentesSelecionados.forEach((elemento: any) => {
      tela.componentes.splice(tela.componentes.findIndex(c => c.nome === elemento), 1);
    });

    //Se não houver componentes vinculados a tela ela será removida
    if (tela.componentes.length == 0) {
      this.removerTela(tela);
    }
    this.componentesSelecionados = [];
    this.alterarComponenteDaTela(tela);
  }

  public removerTela(tela: TelaSistema) {
    this.telaService.removerTela(tela).subscribe({
      next: (res) => {

      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        this.consultarTelasDoSistama();
      }
    });
  }

  public adicionarComponente(tela: TelaSistema) {
    if (this.novoComponente(this.nomeComponente, tela.componentes)) {
      let componente = new ComponenteTela();
      componente.nome = this.nomeComponente;
      tela.componentes.push(componente);
      this.nomeComponente = "";
    }
  }

  public salvarTelaUsuario(tela: TelaSistema) {
    this.telaService.salvar(tela).subscribe({
      next: (res) => {
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        this.consultarTelasDoSistama();
      }
    });
  }

  public novoComponente(nomeComponente: any, componentes: ComponenteTela[]) {
    return (componentes.find(c => c.nome === nomeComponente)?.nome !== nomeComponente);
  }

  public alterarComponenteDaTela(tela: TelaSistema) {
    this.telaService.salvar(tela).subscribe({
      next: (res) => {
        console.log(res);
      }
    });
  }

  public openDlgCadastroTela() {
    let dialogo = this.dialog.open(DlgCadastroTelaComponent, {

    });
    dialogo.afterClosed().subscribe({
      next: () => {
        this.consultarTelasDoSistama();
      }
    });
  }


}
