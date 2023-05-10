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
import { Usuario } from 'src/app/models/usuario';
import { DlgCadLinhaComponent } from '../dlg-cad-linha/dlg-cad-linha.component';
import { DlgCadTurnoComponent } from '../dlg-cad-turno/dlg-cad-turno.component';
import { ProgramacaoService } from 'src/app/services/programacao.service';
import { Programacao } from 'src/app/models/programacao';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ItensNaoRetornadosExport } from 'src/app/models/exports/itens-nao-retornados';

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
  data: any;
  imagem: any;
  idLinha: any = 1;
  idTurno: any = 1;
  linhas: LinhaDeProducao[];
  turnos: Turno[];
  turno: Turno;
  usuario: Usuario;
  snackBarErro = 'my-snack-bar-erro';
  snackBarSucesso = 'my-snack-bar-sucesso';
  programarItens: boolean = false;
  sequencia: any;
  setup: any;
  private dataExport: ItensNaoRetornadosExport[];
  processo1: any;
  processo2: any;

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
    this.usuario = new Usuario();
    this.turno = new Turno();
    this.itensProgramados = [];
    this.programacao = new Programacao();
    this.dataExport = [];
  }

  ngOnInit(): void {
    this.data = moment().format("yyyy-MM-DD");
    this.consultarItensNaoRetornados();
    this.consultarLinhasDeProducao();
    this.consultarTurnoDeTrabalho();
    this.resgistrarLog();
  }

  private resgistrarLog() {
    this.controleExibicaoService.registrarLog('ACESSOU A TELA DE PROGRAMAÇÃO');
  }

  consultaProgramacaoPorData() {
    this.programacaoService.consultarPorData(moment().format('yyyy-MM-DD')).subscribe({
      next: (res) => {
        this.itensProgramados = res;
      },
      error: (e) => {
        console.log(e);
      },
      complete:()=>{
        this.marcarItemProgramados();
      }
    });
  }

  private consultarItensNaoRetornados() {
    this.itemNaoRetornadoService.consultarItensNaoRetornados().subscribe({
      next: (res) => {
        this.itens = res;
        let nfTemp: any;
        res.forEach((e) => {
          nfTemp = e.nf?.replace('  000', '-');
          this.processo1 = e.nomeBeneficiamento?.split('+')[0];
          if(e.nomeBeneficiamento?.split('+')[1] != undefined){
            this.processo2 = e.nomeBeneficiamento.split('+')[1]?.replace('PINTURA', '');
          }
          e.nf = (nfTemp);
        });
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
       this.consultaProgramacaoPorData();
      }
    });
  }

  public marcarItemProgramados() {
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

  public consutarReponsavelProgramacao(){
       this.usuarioService.consultarUsuarioPorEmail(sessionStorage.getItem('user')).subscribe({
      next:(res)=>{
        this.usuario = res[0];
      },
      complete:()=>{
        this.programarItensSelecionados();
      }
    });
  }

  private programarItensSelecionados() {
    this.itensFiltro.forEach(item => {
      if (item.programacaoColetiva && !item.programado) {
        this.programacao = new Programacao();
        this.programacao.setup = this.setup;
        this.programacao.sequencia = this.sequencia;
        this.programacao.responsavel = this.usuario.nome?.toUpperCase();
        this.programacao.espessura = item.espessura;
        this.programacao.cdCliente = item.cdCliente;
        this.programacao.nomeCliente = item.nomeCliente;
        this.programacao.cdProduto = item.cdProduto;
        this.programacao.cdEntrada = item.cdEntrada;
        this.programacao.item = item.item;
        this.programacao.nomeProduto = item.nomeProduto;
        this.programacao.cdBeneficiamento = item.cdBeneficiamento;
        this.programacao.nomeBeneficiamento = item.nomeBeneficiamento;
        this.programacao.status = "AGUARDANDO";
        this.programacao.linhaDeProducao.id = this.idLinha;
        this.programacao.turno.id = this.idTurno;
        this.programacao.qtdeProgramada = item.saldoRetorno;
        this.programacao.data = moment(this.data).format('yyyy-MM-DD');
        this.programacao.prioridade = 2;
        this.programacao.valorPrevisto = item.valorPrevisto;
        this.programacaoService.salvar(this.programacao).subscribe({
          next: (res) => {
            this.controleExibicaoService.registrarLog(`COLOCOU NA PROGRAMAÇÃO O ITEM: [${item.cdProduto} - ${item.nomeProduto}]`);
          },
          error: (e) => {
            this.openSnackBar("Falha ao programar item!", this.snackBarErro);
          }
        });
      }
    });
    this.consultarItensNaoRetornados();
    this.openSnackBar("Itens programados com sucesso!", this.snackBarSucesso);

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
    this.itens.forEach(item=>{
      let i = new ItensNaoRetornadosExport();
      let processos: any = [];
      processos = item.nomeBeneficiamento?.split('+');
      console.log(processos[1]);
      i.ENTRADA = `${moment(item.dataEntrada).format('DD/MM/yyyy').toString()} ${item.hora}` ;
      i.NF = item.nf;
      i.CONTROLE = item.cdEntrada;
      i.ITEM = item.item;
      i.TIPO_OS = item.nomeTipoOS;
      i.CLIENTE = item.nomeCliente;
      i.PRODUTO = item.nomeProduto;
      i.PROCESSO1 = processos[0];
      if(processos.length >= 1){
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
    this.itensFiltro = [];
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
        }
      } else if (this.nomeProduto != '') {
        if (e.nomeProduto?.includes(this.nomeProduto.toUpperCase())) {
          this.itensFiltro.push(e);
        }
      } else if (this.nomeBeneficiamento != '') {
        if (e.nomeBeneficiamento?.includes(this.nomeBeneficiamento.toUpperCase())) {
          this.itensFiltro.push(e);
        }
      }
      else {
        this.itensFiltro = [];
        this.itens;
      }
    });
    
  }

  public iniciarProgramacao(item: ItemNaoRetornado) {
    item.qtdeProgramada = item.saldoRetorno;
    item.linhaDeProducao = this.idLinha;
    item.turno = this.idTurno;
    item.dataProgramacao = this.data;

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

  // public adicionarProgramacao(nome: any) {
  //   if (nome) {
  //     this.listaProgramacao.push(nome);
  //   }
  //   return this.listaProgramacao;
  // }


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
    })
  }

  drop(event: CdkDragDrop<any>) {
    moveItemInArray(this.listaProgramacao, event.previousIndex, event.currentIndex);
  }

  openSnackBar(mensagem: string, tipo: string) {
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
