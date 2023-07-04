import { ExcelService } from 'src/app/services/excel.service';
import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { ItemNaoRetornado } from 'src/app/models/itens-nao-retornados';
import { ItemNaoRetornadoService } from 'src/app/services/item-nao-retornado.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { DlgProgramacaoComponent } from '../dlg-programacao/dlg-programacao.component';
import { LinhaDeProducaoService } from 'src/app/services/linha-de-producao.service';
import { TurnoService } from 'src/app/services/turno.service';
import { LinhaDeProducao } from 'src/app/models/linha-de-producao';
import { Turno } from 'src/app/models/turno';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { DlgCadLinhaComponent } from '../dlg-cad-linha/dlg-cad-linha.component';
import { DlgCadTurnoComponent } from '../dlg-cad-turno/dlg-cad-turno.component';
import { ProgramacaoService } from 'src/app/services/programacao.service';
import { Programacao } from 'src/app/models/programacao';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ItensNaoRetornadosExport } from 'src/app/models/exports/itens-nao-retornados';
import { forkJoin } from 'rxjs';
import { SequenciaSetup } from './sequencia-setup';
import { DlgConfirmaSetupMistoComponent } from '../dlg-confirma-setup-misto/dlg-confirma-setup-misto.component';

@Component({
  selector: 'app-progamacao-form',
  templateUrl: './programacao-form.component.html',
  styleUrls: ['./programacao-form.component.css'],
})
export class ProgramacaoFormComponent implements OnInit {

  programacao: Programacao;
  clsCor: any = '';
  itens: ItemNaoRetornado[];
  itensProgramados: ItemNaoRetornado[];
  itensFiltro: ItemNaoRetornado[];
  nomeCliente = "";
  nomeBeneficiamento = "";
  nomeProduto = "";
  pagina = 1;
  itensPagina = 30;
  paginaFiltro = 1;
  itensPaginaFiltro = 30;
  listaProgramacao: any = [];
  dataProgramacao: any;
  imagem: any;
  idLinha: any = 1;
  idTurno: any = 1;
  linhas: LinhaDeProducao[];
  turnos: Turno[];
  turno: Turno;
  snackBarErro = 'my-snack-bar-erro';
  snackBarSucesso = 'my-snack-bar-sucesso';
  programarItens: boolean = false;
  sequencia: any = 1;
  sequenciaSetup: any = 999;
  setups: SequenciaSetup[] = [];
  setupMisto: any = false;
  private dataExport: ItensNaoRetornadosExport[];
  processo1: any;
  processo2: any;
  cdBeneficiamento: number | undefined;
  btnSetup: any = 'Habilitar';
  setupClass: any = 'col-lg-4';

  constructor(
    private itemNaoRetornadoService: ItemNaoRetornadoService,
    private excelService: ExcelService,
    private dialog: MatDialog,
    private linhaService: LinhaDeProducaoService,
    private turnoService: TurnoService,
    private snackBar: MatSnackBar,
    private programacaoService: ProgramacaoService,
    private controleExibicaoService: ControleExibicaoService,
    private usuarioService: UsuarioService,
  ) {
    this.itens = [];
    this.itensFiltro = [];
    this.listaProgramacao = [];
    this.linhas = [];
    this.turnos = [];
    this.turno = new Turno();
    this.itensProgramados = [];
    this.programacao = new Programacao();
    this.dataExport = [];
  }

  ngOnInit(): void {
    this.dataProgramacao = moment().format("yyyy-MM-DD");
    this.consultarItensNaoRetornados();
    this.consultarLinhasDeProducao();
    this.consultarTurnoDeTrabalho();
    this.resgistrarLog();
  }

  private resgistrarLog() {
    this.controleExibicaoService.registrarLog('ACESSOU A TELA DE PROGRAMAÇÃO');
  }

  public habilitarSetupMisto() {
    //Desabilita o setup misto
    if (this.setupMisto) {
      this.setupMisto = false;
      this.btnSetup = 'Habilitar';
      this.setupClass = 'col-lg-4';
    } else {
      //Habilita o setup misto
      this.controleExibicaoService.registrarLog('HABILITOU SETUP MISTO');
      let dialogo = this.dialog.open(DlgConfirmaSetupMistoComponent, {});
      dialogo.afterClosed().subscribe(res => {
        if (res.data) {
          this.setupMisto = true;
          this.setupClass = 'col-lg-2'
          this.btnSetup = 'Desabilitar';
        }
      });
    }
  }

  public consultaProgramacaoPorData() {
    this.programacaoService.consultarPorData(moment().format('yyyy-MM-DD')).subscribe({
      next: (res) => {
        this.itensProgramados = res;
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        this.marcarItensProgramados();
      }
    });
  }

  private consultarItensNaoRetornados() {
    this.itemNaoRetornadoService.consultarItensNaoRetornados().subscribe({
      next: (res) => {
        this.itens = res;
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        this.alterarExibicaoNfe();
        this.consultaProgramacaoPorData();
      }
    });
  }

  private alterarExibicaoNfe() {
    let nfTemp: any;
    this.itens.forEach((e) => {
      nfTemp = e.nf?.replace('  000', '-');
      e.nf = (nfTemp);
      this.separarNomeProcesso(e.nomeBeneficiamento!);
    });
  }

  private separarNomeProcesso(nomeBeneficiamento: string) {
    this.processo1 = nomeBeneficiamento?.split('+')[0];
    if (nomeBeneficiamento?.split('+')[1] != undefined) {
      this.processo2 = nomeBeneficiamento.split('+')[1]?.replace('PINTURA', '');
    }
  }

  public marcarItensProgramados() {
    this.itens.forEach(item => {
      this.itensProgramados.forEach(res => {
        if (res.cdEntrada == item.cdEntrada && item.item == res.item) {
          item.programado = true;
        } else if (item.programado === undefined) {
          item.programado = false;
        }
      });
    });
    this.filtrar();
  }

  public programarItensSelecionados() {
    this.sequencia = 0;
    this.itensFiltro.forEach(item => {
      if (item.programacaoColetiva && !item.programado) {
        forkJoin({
          s0: this.usuarioService.consultarUsuarioPorEmail(sessionStorage.getItem('user')),
          s1: this.programacaoService.consultaSequenciaSetup(moment(this.dataProgramacao).format('yyyy-MM-DD'), item.cdBeneficiamento, this.idLinha, this.idTurno),
        }).subscribe({
          next: (res) => {
            this.sequenciaSetup = res.s1 ? res.s1.sequenciaSetup! : 0;
            let programacao = new Programacao();
            programacao.sequencia = 0;
            programacao.sequenciaSetup = this.sequenciaSetup;
            programacao.setup = (this.setupMisto ? 0 : item.cdBeneficiamento);
            programacao.responsavel = res.s0[0].nome;
            programacao.espessura = item.espessura;
            programacao.cdCliente = item.cdCliente;
            programacao.nomeCliente = item.nomeCliente;
            programacao.cdProduto = item.cdProduto;
            programacao.cdEntrada = item.cdEntrada;
            programacao.item = item.item;
            programacao.nomeProduto = item.nomeProduto;
            programacao.cdBeneficiamento = item.cdBeneficiamento;
            programacao.nomeBeneficiamento = item.nomeBeneficiamento;
            programacao.status = "AGUARDANDO";
            programacao.linhaDeProducao.id = this.idLinha;
            programacao.turno.id = this.idTurno;
            programacao.qtdeProgramada = item.saldoRetorno;
            programacao.data = moment(this.dataProgramacao).format('yyyy-MM-DD');
            programacao.prioridade = 2;
            programacao.valorPrevisto = item.valorPrevisto;
            this.programacaoService.salvar(programacao).subscribe({
              next: (res) => {
                this.controleExibicaoService.registrarLog(`COLOCOU NA PROGRAMAÇÃO O ITEM: [${programacao.cdProduto} - ${programacao.nomeProduto}]`);
              },
              error: (e) => {
                this.openSnackBar("Falha ao programar item!", this.snackBarErro);
                return;
              },
            });
          },
        });
      }
    });
    this.consultarItensNaoRetornados();
    this.openSnackBar("Itens programados com sucesso!", this.snackBarSucesso);
  }

  public atribuirSequeciamentoParaSetups(item: any) {
  }

  public selecionarTodas() {
    this.itensFiltro.forEach(item => {
      if (item.programacaoColetiva) {
        item.programacaoColetiva = false;
      } else {
        item.programacaoColetiva = true;
      }
    });
  }

  public gerarArquivo() {
    this.itens.forEach(item => {
      let i = new ItensNaoRetornadosExport();
      let processos: any = [];
      processos = item.nomeBeneficiamento?.split('+');
      console.log(processos[1]);
      i.ENTRADA = `${moment(item.dataEntrada).format('DD/MM/yyyy').toString()} ${item.hora}`;
      i.NF = item.nf;
      i.CONTROLE = item.cdEntrada;
      i.ITEM = item.item;
      i.TIPO_OS = item.nomeTipoOS;
      i.CLIENTE = item.nomeCliente;
      i.PRODUTO = item.nomeProduto;
      i.PROCESSO1 = processos[0];
      if (processos.length >= 1) {
        i.PROCESSO2 = processos[1];
        i.PROCESSO2 = i.PROCESSO2?.replace('PINTURA ', '')
      }
      i.ESPESSURA = item.espessura;
      i.PESO = item.peso;
      i.SALDO = item.saldoRetorno;
      i.VALOR = item.valorBeneficiamento;
      i.VALOR_PREVISTO = item.valorPrevisto;
      i.EMBALAGEM = item.nomeEmbalagem;
      this.dataExport.push(i);
    });
    this.excelService.geradorExcell(this.dataExport, "Carteira_Produto");
  }

  public consultarLinhasDeProducao() {
    this.linhaService.consultarPorStatus().subscribe({
      next: (res) => {
        this.linhas = res;
      }, error: (e) => {
        console.log(e);
      }
    });
  }

  public consultarTurnoDeTrabalho() {
    this.turnoService.consultar().subscribe({
      next: (res) => {
        this.turnos = res;
      }, error: (e) => {
        this.openSnackBar("Falha ao consultar turno de trabalho!", this.snackBarErro);
      }
    });
  }

  public limpar() {
    this.nomeProduto = '';
    this.nomeCliente = '';
    this.nomeBeneficiamento = '';
  }

  public filtrar() {
    this.itensFiltro = []
    this.itens.forEach(e => {
      let nfTemp: any;
      nfTemp = e.nf?.replace('  000', '-');
      e.nf = (nfTemp);
      if (this.nomeCliente != '') {
        if (e.nomeCliente?.includes(this.nomeCliente.toUpperCase())) {
          this.itensFiltro.push(e);
          return
        }
      } else if (this.nomeProduto != '') {
        if (e.nomeProduto?.includes(this.nomeProduto.toUpperCase())) {
          this.itensFiltro.push(e);
        }
      } else if (this.nomeBeneficiamento != '') {
        if (e.nomeBeneficiamento?.includes(this.nomeBeneficiamento.toUpperCase())) {
          this.itensFiltro.push(e);
        }
      } else if (this.cdBeneficiamento != undefined) {
        if (e.cdBeneficiamento == this.cdBeneficiamento) {
          this.itensFiltro.push(e);
        }
      } else {
        this.itensFiltro = []
      }
    });

  }

  public iniciarProgramacao(item: ItemNaoRetornado) {
    item.qtdeProgramada = item.saldoRetorno;
    item.linhaDeProducao = this.idLinha;
    item.turno = this.idTurno;
    item.dataProgramacao = this.dataProgramacao;
    console.log(this.setupMisto);
    item.setup = (this.setupMisto ? 0 : item.cdBeneficiamento);
    console.log(item.setup);

    let dlg = this.dialog.open(DlgProgramacaoComponent, {
      data: item,
      maxHeight: '80vh',
    });

    dlg.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          this.consultarItensNaoRetornados();
        }
      }
    });
  }

  public sort(sort: Sort) {
    const data = this.itens.slice();
    if (!sort.active || sort.direction === '') {
      this.itens = data;
      return;
    }
    this.itens = data.sort((a, b) => {
      const isAsc = sort.direction === 'desc';
      switch (sort.active) {
        case 'qtd':
          return this.compare(a.qtdeEntrada, b.qtdeEntrada, isAsc);
        case 'saldo':
          return this.compare(a.saldoRetorno, b.saldoRetorno, isAsc);
        case 'espessura':
          return this.compare(a.espessura, b.espessura, isAsc);
        case 'beneficiamento':
          return this.compare(a.nomeBeneficiamento, b.nomeBeneficiamento, isAsc);
        case 'cliente':
          return this.compare(a.nomeCliente, b.nomeCliente, isAsc);
        case 'produto':
          return this.compare(a.nomeProduto, b.nomeProduto, isAsc);
        case 'data':
          return this.compare(a.dataEntrada, b.dataEntrada, isAsc);
        case 'nf':
          return this.compare(a.nf, b.nf, isAsc);
        case 'item':
          return this.compare(a.item, b.item, isAsc);
        case 'programados':
          return this.compare(a.programado, b.programado, isAsc);
        case 'entrada':
          return this.compare(a.cdEntrada, b.cdEntrada, isAsc);
        case 'valor':
          return this.compare(a.valorPrevisto, b.valorPrevisto, isAsc);
        default:
          return 0;
      }
    });
  }

  public sortFiltro(sort: Sort) {
    const data = this.itensFiltro.slice();
    if (!sort.active || sort.direction === '') {
      this.itensFiltro = data;
      return;
    }
    this.itensFiltro = data.sort((a, b) => {
      const isAsc = sort.direction === 'desc';
      switch (sort.active) {
        case 'qtd':
          return this.compare(a.qtdeEntrada, b.qtdeEntrada, isAsc);
        case 'saldo':
          return this.compare(a.saldoRetorno, b.saldoRetorno, isAsc);
        case 'espessura':
          return this.compare(a.espessura, b.espessura, isAsc);
        case 'beneficiamento':
          return this.compare(a.nomeBeneficiamento, b.nomeBeneficiamento, isAsc);
        case 'cliente':
          return this.compare(a.nomeCliente, b.nomeCliente, isAsc);
        case 'produto':
          return this.compare(a.nomeProduto, b.nomeProduto, isAsc);
        case 'data':
          return this.compare(a.dataEntrada, b.dataEntrada, isAsc);
        case 'nf':
          return this.compare(a.nf, b.nf, isAsc);
        case 'item':
          return this.compare(a.item, b.item, isAsc);
        case 'programados':
          return this.compare(a.programado, b.programado, isAsc);
        default:
          return 0;
      }
    });
  }

  public cadastrarLinha() {
    const dlg = this.dialog.open(DlgCadLinhaComponent, {
      height: '100%',
      width: '100%',
      maxWidth: '100%',
    });
    dlg.afterClosed().subscribe(res => {
      this.consultarLinhasDeProducao();
    });
  }

  public cadastrarTurno() {
    const dlg = this.dialog.open(DlgCadTurnoComponent, {
    });
    dlg.afterClosed().subscribe(res => {
      this.consultarTurnoDeTrabalho();
    });
  }

  public drop(event: CdkDragDrop<any>) {
    moveItemInArray(this.listaProgramacao, event.previousIndex, event.currentIndex);
  }

  public openSnackBar(mensagem: string, tipo: string) {
    this.snackBar.open(mensagem, "X", {
      duration: 6000,
      panelClass: [tipo],
      horizontalPosition: "right",
      verticalPosition: "top",
    });
  }

  public compare(a: any, b: any, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

}
