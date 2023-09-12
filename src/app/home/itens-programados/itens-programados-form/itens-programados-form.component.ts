import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { LinhaDeProducao } from 'src/app/models/linha-de-producao';
import { Programacao } from 'src/app/models/programacao/programacao';
import { Turno } from 'src/app/models/turno';
import { LinhaDeProducaoService } from 'src/app/services/linha-de-producao.service';
import { ProgramacaoService } from 'src/app/services/programacao.service';
import { TurnoService } from 'src/app/services/turno.service';
import { DlgDetalheItemComponent } from '../dlg-detalhe-item/dlg-detalhe-item.component';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'
import { ItensLinha } from './itens-linha';
import { DglConfirmacaoComponent } from 'src/app/shared/dialog/dgl-confirmacao/dgl-confirmacao.component';
import { Setup } from './setup';
import { DlgAlterarSetupComponent } from '../dlg-alterar-setup/dlg-alterar-setup.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ManipuladorArrayService } from 'src/app/utils/manipulador-array.service';
import { DlgExclusaoComponent } from 'src/app/shared/dialog/dlg-exclusao/dlg-exclusao.component';
import { Sort } from '@angular/material/sort';
import { DlgDetalheObservacaoComponent } from '../dlg-detalhe-observacao/dlg-detalhe-observacao.component';

import * as bootstrap from 'bootstrap';
import { Motivo } from 'src/app/models/motivo';
import { ObservacaoProgramacaoDto } from 'src/app/models/observacoes/observacao-programacao-dto';
import { ObservacaoProgramacao } from 'src/app/models/observacoes/observacao-programacao';

import { ExcelService } from 'src/app/services/excel.service';



@Component({
  selector: 'app-itens-programados-form',
  templateUrl: './itens-programados-form.component.html',
  styleUrls: ['./itens-programados-form.component.css']
})
export class ItensProgramadosFormComponent implements OnInit, OnDestroy {

  itensLinha: ItensLinha[];
  itensLinhaTurno1: ItensLinha[];
  itensLinhaTurno2: ItensLinha[];
  itensLinhaTurno3: ItensLinha[];
  totalTurno1: any = 0;
  totalTurno2: any = 0;
  totalTurno3: any = 0;
  totalGeral: any = 0;
  totalTbQtde: any = 0;

  linhaSelecionada: any;
  motivo: any;
  bloqueio: boolean = false;
  obsApontamento: any;
  processo: any = [];
  linhas: LinhaDeProducao[];
  turnos: Turno[];
  itensProgramados: Programacao[];
  itensIniciados: Programacao[];
  docPdf: jsPDF;
  dataProgramacao: string = moment().format("yyyy-MM-DD");
  itensLinhaVisualizacao: ItensLinha;
  nomeLinhaVisualizacao: any;
  turnoVisualizacao: any;
  linhaSelecionadaVisualizacao: any;
  atualizarExibica: boolean = false;
  intervalo: any;
  panelOpenState = false;
  sequenciaSetup: Setup[] = [];
  snackBarErro = 'my-snack-bar-erro';
  snackBarSucesso = 'my-snack-bar-sucesso';
  listaSetup: Programacao[];
  step: any;
  ativo: boolean = false;
  obsApont: any;
  open: any;
  close: any;
  classAnimation: string = "pisca2";
  obs: ObservacaoProgramacao;
  obsItem: ObservacaoProgramacao;
  public toolTip = [];

  constructor(
    private programacaoService: ProgramacaoService,
    private renderer: Renderer2,
    private dialog: MatDialog,
    private linhaService: LinhaDeProducaoService,
    private turnoService: TurnoService,
    private controleExibicaoService: ControleExibicaoService,
    private snackBar: MatSnackBar,
    private arrayService: ManipuladorArrayService,
    private excelService: ExcelService,
  ) {
    this.itensProgramados = [];
    this.obs = new ObservacaoProgramacao();
    this.obsItem = new ObservacaoProgramacao();
    this.itensIniciados = [];
    this.itensLinha = [];
    this.itensLinhaTurno1 = [];
    this.itensLinhaTurno2 = [];
    this.itensLinhaTurno3 = [];
    this.linhas = [];
    this.turnos = [];
    this.listaSetup = [];
    this.itensLinhaVisualizacao = new ItensLinha();
    this.docPdf = new jsPDF(
      {
        orientation: "landscape",
      }
    );
  }



  ngOnInit(): void {
    this.renderer.selectRootElement(this.toolTip = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]')));
    var tootipList = this.toolTip.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    this.consultarItensProgramadosAguardando();
    this.controleExibicaoService.registrarLog('ACESSOU A TELA ITENS PROGRAMADOS', 'ITENS PROGRAMADOS');
   
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalo);
  }


  public verificarSeTemObservcao() {
    const elemento = document.querySelectorAll("#fa-comment-alt");
    elemento.forEach(e=>{
      this.renderer.removeClass(e, "pisca");
      this.renderer.addClass(e, this.classAnimation);
    });
    
 
  }

  /** Abre um dialog para alterar todos os itens do setup x podendo fazer a alteração de turno e prioridade */

  public alterarTodos(itens: any) {
    let dialogo = this.dialog.open(DlgDetalheItemComponent, {
      data: itens,
      height: '95%',
      maxHeight: '95%',
      disableClose: true,
    });
    dialogo.afterClosed().subscribe({
      next: (res) => {
        res.data.item.forEach((i: any) => {
          switch (res.data.retorno) {
            case 'alterar_linha_turno':
              this.alterarLinhaOuTurnoTodos(i, res.data);
              break;
            case 'alterar_prioridade':
              this.alterarPrioridade(i);
              break;
            default:
              break;
          }
        });
      }
    });
  }

  /** abre o dialog que mostra observacoes e cria logo em seguida no close ele faz o switch
   * para buscar a função correta */
  public openObservacoes(item: any) {
    let dialog = this.dialog.open(DlgDetalheObservacaoComponent, {
      data: item,
      maxHeight: '95vh',
    });
    dialog.afterClosed().subscribe({
      next: (res) => {
        switch (res.data.tipo) {
          case "BLOQUEIO":
            this.bloqueioDeApontamento(res);
            return;
          case "DESBLOQUEIO":
            this.desbloqueioDeApontamento(res);
            return;
          case "FINALIZADO":
            this.finalizarDeApontamento(res)
            return;
          default:
            break;
        }
      },
    })
  }

  public bloqueioDeApontamento(resultado: any) {
    this.listaSetup.forEach(i => {
      if (resultado.data.id == i.id) {
        i.observacoes.push(this.criarObservacaoApontamento(i, resultado));
        this.programacaoService.salvar(i).subscribe(({
          next: (res) => { },
          complete: () => {
            this.consultarItensProgramadosAguardando();
          }
        }));
      }
    })
  }

  public desbloqueioDeApontamento(resultado: any) {
    this.listaSetup.forEach(i => {
      if (resultado.data.id == i.id) {
        i.observacoes.push(this.criarObservacaoApontamento(i, resultado));
        this.programacaoService.salvar(i).subscribe(({
          next: (res) => { },
          complete: () => {
            this.consultarItensProgramadosAguardando();
          }
        }));
      }
    });
  }

  public finalizarDeApontamento(resultado: any) {
    this.listaSetup.forEach(i => {
      if (resultado.data.id == i.id) {
        i.observacoes.push(this.criarObservacaoApontamento(i, resultado));
        this.programacaoService.salvar(i).subscribe(({
          next: (res) => { },
          complete: () => {
            this.consultarItensProgramadosAguardando();
          }
        }));
      }
    })
  }

  /** Cria um objeto ObservacaoProgramacao  e retorna ele para o item ser salvo*/
  public criarObservacaoApontamento(item: Programacao, observacoes: any) {
    if (item.observacoes == undefined) {
      item.observacoes = [];
    }
    let obs = new ObservacaoProgramacao();
    obs.bloqueio = observacoes.data.retorno;
    obs.motivo.id = observacoes.data.motivo
    obs.data = this.dataProgramacao;
    obs.observacaoApontamento = observacoes.data.obsApont;
    return obs;
  }

  // private toDTO(programacao: Programacao){
  //       let dto: ProgramacaoDTO = new ProgramacaoDTO();
  //       dto.cdBeneficiamento = programacao.cdBeneficiamento;
  //       dto.cdCliente = programacao.cdCliente;
  //       dto.cdEntrada = programacao.cdEntrada;
  //       dto.cdProduto = programacao.cdProduto;
  //       dto.data = programacao.data;
  //       dto.status = "FINALIZADO"
  //       dto.dataInclusao = programacao.dataInclusao;
  //       dto.espessura = programacao.espessura;
  //       dto.fimProducao = programacao.fimProducao;
  //       dto.id = programacao.id;
  //       dto.inicioProducao = programacao.inicioProducao;
  //       dto.item = programacao.item;
  //       dto.linhaDeProducao = programacao.linhaDeProducao;
  //       dto.observacoes = programacao.observacoes;
  //       programacao.observacoes.forEach(o=>{
  //         let dtoObs = new ObservacaoProgramacaoDto();
  //         dtoObs.bloqueio = false;
  //         dtoObs.data = o.data;
  //         dtoObs.id = o.id;
  //         dtoObs.observacaoApontamento = o.observacaoApontamento
  //         dto.observacoes.push(dtoObs);
  //       });
  //       return dto;

  // }

  /** Realiza a atualização de todos os itens de um setup X */

  public alterarLinhaOuTurnoTodos(dados: any, dados2: any) {
    this.programacaoService.consultaUltimoNumeroSequencia(
      moment(this.dataProgramacao).format('yyyy-MM-DD'),
      dados.cdBeneficiamento,
      dados2.linhaDeProducao,
      dados2.turno
    ).subscribe({
      next: (res) => {
        if (res == null) {
          this.cadastrarNovoSetupTodos(dados, dados2);
        } else {
          this.atribuirSequenciaAoSetupExistenteTodos(res, dados, dados2);
        }
      }
      , complete: () => {
        this.limpar();
        setTimeout(() => {
          this.consultarItensProgramadosAguardando();
          this.ativo = false;
        }, 2000);
      }
    });
  }

  /** Realiza o cadastro de todos os itens de um setup para outro setup */
  public cadastrarNovoSetupTodos(dados: any, dados2: any) {
    dados.sequencia = 0;
    dados.sequenciaSetup = 0;
    dados.turno.id = dados2.turno;
    dados.linhaDeProducao.id = dados2.linhaDeProducao;
    this.programacaoService.salvar(dados).subscribe({
      next: (res) => { },
      error: (e) => { console.log(e); }
    });
  }


  /**
   * Método utilizado para conseguir atualizar todos usuários sobre
   * alterações realizadas na programação.
   * 
   */
  public veriricarAtualizacoesPorIntervalo() {
    clearInterval(this.intervalo);
    this.intervalo = setInterval(() => {
      this.listaSetup = [];
      this.consultarItensProgramadosAguardando();
      this.ativo = false;
    }, 20000);
  }

  public visualizarDetalhesDoItem(item: Programacao) {
    let dialogo = this.dialog.open(DlgDetalheItemComponent, {
      data: item,
      height: '95%',
      maxHeight: '95%',
      disableClose: true,
    });

    /**
     * Quanto houver alguma alteração na programação o sistema realiza uma nova consulta
     * e limpa a lista de exibição atual
     */
    dialogo.afterClosed().subscribe({
      next: (res) => {
        switch (res.data.retorno) {
          case 'alterar_sequencia':
            this.alterarSequenciaDeExibicaoDosItensDoSetUp(res.data.item, res.data.nova_sequencia);
            break;
          case 'alterar_linha_turno':
            this.alterarLinhaOuTurno(res);
            break;
          case 'alterar_prioridade':
            this.alterarPrioridade(res.data.item);
            break;
          default:
            break;
        }
      }
    });
  }

  public alterarPrioridade(item: Programacao) {
    this.programacaoService.salvar(item).subscribe({
      next: (res) => {
      }
    });
  }

  public alterarLinhaOuTurno(dados: any) {
    this.programacaoService.consultaUltimoNumeroSequencia(
      moment(this.dataProgramacao).format('yyyy-MM-DD'),
      dados.data.item.cdBeneficiamento,
      dados.data.linhaDeProducao,
      dados.data.turno
    ).subscribe({
      next: (res) => {
        if (res == null) {
          this.cadastrarNovoSetup(dados);
        } else {
          this.atribuirSequenciaAoSetupExistente(res, dados);
        }
      }
      , complete: () => {
        this.limpar();
        setTimeout(() => {
          this.listaSetup = []
          this.consultarItensProgramadosAguardando();
          this.ativo = false;
        }, 20000);
      }
    });
  }

  public cadastrarNovoSetup(dados: any) {
    dados.data.item.sequencia = 0;
    dados.data.item.sequenciaSetup = 0;
    dados.data.item.turno.id = dados.data.turno;
    dados.data.item.linhaDeProducao.id = dados.data.linhaDeProducao;
    this.programacaoService.salvar(dados.data.item).subscribe({
      next: (res) => { },
      error: (e) => { console.log(e); }
    });
  }

  public atribuirSequenciaAoSetupExistenteTodos(resultado: any, dados: any, dados2: any) {
    dados.sequencia = 0;
    dados.setup = resultado.setup;
    dados.turno.id = dados2.turno;
    dados.linhaDeProducao.id = dados2.linhaDeProducao;
    this.programacaoService.salvar(dados).subscribe({
      next: (res) => { },
      error: (e) => { console.log(e); }
    });
  }

  public atribuirSequenciaAoSetupExistente(resultado: any, dados: any) {
    dados.data.item.sequencia = 0;
    dados.data.item.setup = resultado.setup;
    dados.data.item.turno.id = dados.data.turno;
    dados.data.item.linhaDeProducao.id = dados.data.linhaDeProducao;
    this.programacaoService.salvar(dados.data.item).subscribe({
      next: (res) => { },
      error: (e) => { console.log(e); }
    });
  }

  private alterarSequenciaDeExibicaoDosItensDoSetUp(item: Programacao, novaSequencia: any) {
    
    this.ativo = !this.ativo;
    let setupIndex = this.sequenciaSetup.findIndex(s => s.setup == item.setup);
    let itens = this.sequenciaSetup[setupIndex].itensProgramados;

    // Localiza o indece de destino do array
    let destino = itens.findIndex(t => t.sequencia == novaSequencia);
    let origem = itens.findIndex(t => t.sequencia == item.sequencia);

    if (destino == -1) {
      this.openSnackBar("Sequência não permitida!", this.snackBarErro);
      return;
    }

    itens = this.arrayService.alterarPosicaoDoElementoNoArray(origem, destino, itens);
    let sequencia = 0;
    itens.forEach(i => {
      i.sequencia = ++sequencia;
      this.programacaoService.salvar(i).subscribe({
        next:()=>{

        },complete:()=>{
          this.consultarItensProgramadosAguardando();
        }
      });
    });
    this.openSnackBar('Sequencia alterada com sucesso!', this.snackBarSucesso);
  }

  public alterarSetup(setupAltual: Setup) {
    this.ativo = !this.ativo;
    let dialogo = this.dialog.open(DlgAlterarSetupComponent, { disableClose: true, });
    dialogo.afterClosed().subscribe({
      next: (res) => {
        if (res) {
          clearInterval(this.intervalo);
          this.alterarSequenciaDoSetUp(res.data, setupAltual);
        }
      },
      complete: () => {
        this.veriricarAtualizacoesPorIntervalo();
      }
    });
  }

  /**
   * Realiza a troca de ordem do setup de acordo com sequência escolhida pelo usuário
   * para isso é necessário saber qual a sequencia escolhida pelo usuário e em qual
   * o setup que será modificado
   * 
   * @param sequenciaEscolhida 
   * @param setupAltual 
   */
  private alterarSequenciaDoSetUp(sequenciaEscolhida: any, setupAltual: Setup) {
    let origem = this.sequenciaSetup.findIndex(s => s.setup == setupAltual.setup);
    let destino = this.sequenciaSetup.findIndex(s => s.sequenciaSetup == sequenciaEscolhida);
    //Verifica de há um destino existente para troca de posição
    if (destino = -1) {
      this.criarSequenciaInicialParaSetup();
      destino = this.sequenciaSetup.findIndex(s => s.sequenciaSetup == sequenciaEscolhida);
    }
    this.sequenciaSetup = this.arrayService.alterarPosicaoDoElementoNoArray(origem, destino, this.sequenciaSetup);
    let sequecia = 0;
    this.sequenciaSetup.forEach(s => {
      s.sequenciaSetup = ++sequecia;
      this.salvarNovoSetup(s.itensProgramados, s.sequenciaSetup);
    });
  }

  /**
   * Quando o setup for criado com o padrão do sistema será necessario criar
   * uma sequência inicial para este setup antes de alteralo se isto no não feito
   * será imposível encontrar o posição de destino e o sequenciamento apresentará
   * comportamento estranho
   *   
   */
  private criarSequenciaInicialParaSetup() {
    let sequencia = 0;
    this.sequenciaSetup.forEach(s => {
      s.sequenciaSetup = ++sequencia;
      this.salvarNovoSetup(s.itensProgramados, s.sequenciaSetup);
    });
  }

  public salvarNovoSetup(itensProgramados: Programacao[], sequenciaSetup: any) {
    itensProgramados.forEach(item => {
      item.sequenciaSetup = sequenciaSetup;
      this.programacaoService.salvar(item).subscribe({
        next: (res) => { },
      });
    });
    this.consultarItensProgramadosAguardando();
  }

  /**
   * Realiza uma consulta dos itens programados no banco de dados com status de Aguardando
   */
  public consultarItensProgramadosAguardando() {
    this.sequenciaSetup = [];
    this.programacaoService.consultarPorDataStatus(this.dataProgramacao, 'AGUARDANDO').subscribe({
      next: (res) => {
        this.itensProgramados = res;
      },
      complete: () => {
        this.colocarItensNaLista();
        this.listaSetup = [];
      }
    });
  }

  /**
   * Realiza uma tratativa nos dados vindos do banco para adequar a visualização
   * a disposição dos elementos na tela montando um objeto com as informações
   * adequadas
   */
  private colocarItensNaLista() {
    this.itensLinha = [];
    this.itensProgramados.forEach(item => {
      //Se o item já existir na lista será feito apenas uma atualização
      if (this.itensLinha.some(il => il.linhaDeProducao.id == item.linhaDeProducao.id && il.turno.id == item.turno.id)) {
        let index = this.itensLinha.findIndex(itl => itl.linhaDeProducao.id == item.linhaDeProducao.id && itl.turno.id == item.turno.id);
        this.itensLinha[index].valorPrevisto += item.valorPrevisto;
        this.itensLinha[index].itensProgramados.push(item);
        this.itensLinha[index].turno = item.turno;
      } else {
        //Se não existir o item na lista será criado um novo item
        let il = new ItensLinha();
        il.itensProgramados.push(item);
        il.linhaDeProducao = item.linhaDeProducao;
        il.valorPrevisto += item.valorPrevisto;
        il.turno = item.turno;
        this.itensLinha.push(il);
      }
    });
    this.separItensPorTurno();
  }

  /**
   * Para uma exibição mais agradável na tela é realizada uma separação por turno
   * dos itens programados e os cálculos de valor previsto por turno e o total geral
   * de todos os turnos.
   */

  private separItensPorTurno() {
    this.itensLinhaTurno1 = [];
    this.itensLinhaTurno2 = [];
    this.itensLinhaTurno3 = [];
    this.totalTurno1 = 0;
    this.totalTurno2 = 0;
    this.totalTurno3 = 0;
    this.totalGeral = 0;
    this.itensLinha.forEach(item => {
      this.totalGeral += item.valorPrevisto;
      switch (item.turno.id) {
        case 1:
          this.itensLinhaTurno1.push(item);
          this.totalTurno1 += item.valorPrevisto;
          break;
        case 2:
          this.itensLinhaTurno2.push(item);
          this.totalTurno2 += item.valorPrevisto;
          break;
        case 3:
          this.itensLinhaTurno3.push(item);
          this.totalTurno3 += item.valorPrevisto;
          break;
        default:
          break
      }
    });
    this.atualizarVisualizacaoAposAlteracao();
  }

  /**
   * Matem a aba do painel expansível aberta de acordo com o setup selecionado 
   * 
   * @param nomeSetup
   */
  nomeSetupTeste: any;
  public setStep(nomeSetup: any) {
    this.ativo = !this.ativo;
    if (this.ativo) {
      let card = document.querySelectorAll(".cards")
      let card2 = document.querySelector(".mat-expansion-panel")
      card.forEach(e => {
        if (e.id != nomeSetup) {
          e.classList.add("ativo")
          card2?.classList.remove("ativo");
          // this.render.addClass(e, "ativo");
          // this.render.removeClass(card2, "ativo");
        }
      });
    } else if (!this.ativo) {
      let card = document.querySelectorAll(".cards")
      let card2 = document.querySelector(".mat-expansion-panel")
      card.forEach(e => {
        if (e.id != nomeSetup) {
          e.classList.remove("ativo")
          card2?.classList.add("ativo");
        }
      });
    }

  }

  public reExibirLinhaSelecionada() {
    let itens: any = this.sequenciaSetup.find(e => e.nomeBeneficiamento == this.nomeSetupTeste)?.itensProgramados;
    this.exibirItensProgramados(itens);
  }

  public exibirItensProgramados(itens: ItensLinha) {
    this.linhaSelecionada = itens.linhaDeProducao.nome;
    this.listaSetup = [];
    this.linhaSelecionadaVisualizacao = itens;
    this.sequenciaSetup = [];
    /**
     * Verifica se o setup existe se não existir ele cria um novo 
     * e atribui os itens para este setup caso exista o item será
     * incluso no setup existente
     */
    itens.itensProgramados.forEach(item => {
      if (!this.sequenciaSetup.find(s => s.setup == item.setup)) {
        let st = new Setup();
        st.nomeBeneficiamento = item.nomeBeneficiamento;
        st.setup = item.setup;
        st.sequenciaSetup = item.sequenciaSetup;
        st.itensProgramados.push(item);
        this.sequenciaSetup.push(st);
      } else {
        let index = this.sequenciaSetup.findIndex(s => s.setup == item.setup);
        this.sequenciaSetup[index].itensProgramados.push(item);
      }
    });
    this.totalTbQtde = 0;
    this.nomeLinhaVisualizacao = itens.linhaDeProducao.nome;
    switch (itens.turno.id) {
      case 1:
        this.turnoVisualizacao = 'PRIMEIRO TURNO';
        break;
      case 2:
        this.turnoVisualizacao = 'SEGUNDO TURNO';
        break;
      case 3:
        this.turnoVisualizacao = 'TERCEIRO TURNO';
        break;
      default:
        break;
    }
    itens.itensProgramados.forEach(e => {
      this.totalTbQtde += e.qtdeProgramada;
    });
  }

  public atualizarVisualizacaoAposAlteracao() {
    if (this.linhaSelecionadaVisualizacao) {
      let itens: any;
      switch (this.linhaSelecionadaVisualizacao.turno.nome) {
        case 'MANHÃ':

          itens = this.itensLinhaTurno1.filter(i => i.linhaDeProducao.id == this.linhaSelecionadaVisualizacao.linhaDeProducao.id);
          this.exibirItensProgramados(itens[0]);
          //this.atualizarExibicao = false;
          break;
        case 'TARDE':

          itens = this.itensLinhaTurno2.filter(i => i.linhaDeProducao.id == this.linhaSelecionadaVisualizacao.linhaDeProducao.id);
          this.exibirItensProgramados(itens[0]);
          //this.atualizarExibicao = false;
          break;
        case 'NOITE':

          itens = this.itensLinhaTurno3.filter(i => i.linhaDeProducao.id == this.linhaSelecionadaVisualizacao.linhaDeProducao.id);
          this.exibirItensProgramados(itens[0]);
          //this.atualizarExibicao = false;
          break;
        default:
          break;
      }
    }
  }

  public consultarLinhasDeProducao() {
    this.linhaService.consultar().subscribe({
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
        console.log(e);
      }
    });
  }

  public visualizarDetalhes(item: Programacao) {
    this.dialog.open(DlgDetalheItemComponent, {
      data: item,
      maxHeight: '95vh',
      disableClose: true,
    });
  }

  public gerarPdfProgramacao(itensLinha: ItensLinha) {
    let titulo: any = "";
    this.docPdf = new jsPDF(
      {
        orientation: "landscape",
      }
    )
    this.docPdf.setFontSize(10);
    var bodyTabela: any = [];
    itensLinha.itensProgramados.forEach(item => {
      this.processo = [];
      this.processo = item.nomeBeneficiamento?.split('+');
      titulo = `${moment(this.dataProgramacao).format('DD/MM/yyyy')} - PROGAMAÇÃO CROMA ${item.linhaDeProducao.nome} TURNO | ${item.turno.nome}`
      let linha = [
        moment(item.data).format('DD/MM/yyyy'),
        item.nomeCliente,
        item.nomeProduto,
        this.processo[0],
        this.processo[1],
        item.espessura,
        item.qtdeProgramada,
        item.cdEntrada,
        item.item,
        item.observacao,
      ];
      bodyTabela.push(linha);
    });

    this.docPdf.text(titulo, 14, 10);
    autoTable(this.docPdf, {
      headStyles: { fillColor: 'black', fontSize: 6 },
      footStyles: { fillColor: 'black' },
      theme: 'grid',
      styles: { fontSize: 6, fontStyle: 'bold', lineColor: 'black' },
      head: [
        ['ENTRADA', 'CLIENTE', 'PRODUTO', 'PROCESSO 1', 'PROCESSO 2', 'ESP.', 'QTDE', 'CONTR.', 'ITEM', 'OBS', 'SIM', 'NÃO', 'POR QUE?']
      ],
      body: bodyTabela
      ,
      foot: [['TOTAIS', '', '', '', '', '', this.totalTbQtde, '', '', '', '', '']]
    });

    this.docPdf.output("dataurlnewwindow");
    // this.docPdf.save("A");
  }


  public gerarExcel(linha: ItensLinha) {
    this.excelService.gerarExportProgramacaoItens(linha, `PROGRAMACAO-${this.dataProgramacao}`);
  }



  public iniciarProgramacao(item: Programacao) {
    if (item.status == "BLOQUEADO") {
      this.openSnackBar("O item esta bloqueado", this.snackBarErro);
    } else {
      this.ativo = !this.ativo;
      let dialogo = this.dialog.open(DglConfirmacaoComponent, { data: { mensagem: 'DESEJA INICIAR A PRODUÇÃO DESTE ITEM?', observacao: 'Se não for possivel iniciar o item digita observação', status: "nao_iniciado" } });
      dialogo.afterClosed().subscribe(res => {
        if (res.data) {
          item.status = "PRODUZINDO";
          item.inicioProducao = new Date();
          this.programacaoService.salvar(item).subscribe({
            next: (res) => { },
            complete: () => {
              this.atualizarVisualizacaoAposAlteracao();
            }
          });
        } if (res.data == false) {
          this.programacaoService.salvar(item).subscribe({
            next: (res) => { },
            complete: () => {
              this.atualizarVisualizacaoAposAlteracao();
            }
          })
        }
      });
    }
  }

  public finalizaProgramacao(item: Programacao) {
    this.ativo = !this.ativo;
    let dialogo = this.dialog.open(DglConfirmacaoComponent, { data: { mensagem: 'DESEJA FINALIZAR A PRODUÇÃO DESTE ITEM?', observacao: 'Para concluir o item digita a Observação', status: "finalizado" } });
    dialogo.afterClosed().subscribe(res => {
      if (res.data) {
        item.status = "FINALIZADO";
        item.inicioProducao = new Date();
        this.programacaoService.salvar(item).subscribe({
          next: (res) => { },
          complete: () => {
            this.atualizarVisualizacaoAposAlteracao();
          }
        })
      }
    });
  }

  public excluirSetup(itens: Programacao[]) {
    this.ativo = !this.ativo;
    let dialogo = this.dialog.open(DlgExclusaoComponent, { disableClose: true, });
    dialogo.afterClosed().subscribe({
      next: (res) => {
        if (itens.some(i => i.status != 'AGUARDANDO')) {
          this.openSnackBar('Impossível excluir a programação com itens em produção!', this.snackBarErro);
          return;
        }
        if (res.data) {
          itens.forEach(i => {
            this.programacaoService.excluirProgramacao(i.id!).subscribe({
              next: (res) => {
              },
              complete: () => {
                this.limpar();
                this.consultarItensProgramadosAguardando();
                this.openSnackBar('Setup excluido com sucesso!', this.snackBarSucesso)
              }
            });
          });
        }
      }
    });
  }

  openSnackBar(mensagem: string, tipo: string) {
    this.snackBar.open(mensagem, "X", {
      duration: 6000,
      panelClass: [tipo],
      horizontalPosition: "right",
      verticalPosition: "top",
    });
  }

  limpar() {
    this.itensProgramados = [];
    this.itensIniciados = [];
    this.itensLinha = [];
    this.itensLinhaTurno1 = [];
    this.itensLinhaTurno2 = [];
    this.itensLinhaTurno3 = [];
    this.linhas = [];
    this.turnos = [];
    this.itensLinhaVisualizacao = new ItensLinha();
    this.sequenciaSetup = [];
  }

  criarSetup(setup: any) {
    this.listaSetup = []
    this.totalTbQtde = 0;
    this.sequenciaSetup.forEach(e => {
      if (setup == e.setup) {
        this.listaSetup = e.itensProgramados;
        this.listaSetup.forEach(i => {
          this.totalTbQtde += i.qtdeProgramada;
        });
      }
    });
    setTimeout(() => {
      this.verificarSeTemObservcao()
    }, 100);
   
  }


  public sort(sort: Sort) {
    const data = this.listaSetup.slice();
    if (!sort.active || sort.direction === '') {
      this.listaSetup = data;
      return;
    }
    this.listaSetup = data.sort((a, b) => {
      const isAsc = sort.direction === 'desc';
      switch (sort.active) {
        case 'cdEntrada':
          return this.compare(a.cdEntrada, b.cdEntrada, isAsc);
        case 'item':
          return this.compare(a.item, b.item, isAsc);
        case 'nomeCliente':
          return this.compare(a.nomeCliente, b.nomeCliente, isAsc);
        case 'nomeProduto':
          return this.compare(a.nomeProduto, b.nomeProduto, isAsc);
        case 'espessura':
          return this.compare(a.espessura, b.espessura, isAsc);
        case 'nomeBeneficiamento':
          return this.compare(a.nomeBeneficiamento, b.nomeBeneficiamento, isAsc);
        case 'quantidade':
          return this.compare(a.qtdeProgramada, b.qtdeProgramada, isAsc);
        case 'status':
          return this.compare(a.status, b.status, isAsc);
        default:
          return 0;
      }
    });
    this.salvarOrdenacao();
  }

  public salvarOrdenacao() {
    var listTemp: any = [];
    listTemp = this.listaSetup;
    let seq = 0;
    listTemp.forEach((f: any) => {
      f.sequencia = 0;
      f.sequencia = ++seq
      this.programacaoService.salvar(f).subscribe(({
        next: (res) => { },
        complete: () => {

        }
      }))
    });
  }

  public compare(a: any, b: any, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

}
