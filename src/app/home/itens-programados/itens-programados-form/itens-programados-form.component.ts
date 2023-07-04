import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { LinhaDeProducao } from 'src/app/models/linha-de-producao';
import { Programacao } from 'src/app/models/programacao';
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
  step: any;

  constructor(
    private programacaoService: ProgramacaoService,
    private dialog: MatDialog,
    private linhaService: LinhaDeProducaoService,
    private turnoService: TurnoService,
    private controleExibicaoService: ControleExibicaoService,
    private snackBar: MatSnackBar,
    private arrayService: ManipuladorArrayService
  ) {
    this.itensProgramados = [];
    this.itensIniciados = [];
    this.itensLinha = [];
    this.itensLinhaTurno1 = [];
    this.itensLinhaTurno2 = [];
    this.itensLinhaTurno3 = [];
    this.linhas = [];
    this.turnos = [];
    this.itensLinhaVisualizacao = new ItensLinha();
    this.docPdf = new jsPDF(
      {
        orientation: "landscape",
      }
    );
  }

  ngOnInit(): void {
    this.consultarItensProgramadosAguardando();
    this.controleExibicaoService.registrarLog('ACESSOU A TELA ITENS PROGRAMADOS');
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalo);
  }

  /**
   * Método utilizado para conseguir atualizar todos usuários sobre
   * alterações realizadas na programação.
   * 
   */
  public veriricarAtualizacoesPorIntervalo() {
    console.log('3020')
    clearInterval(this.intervalo);
    this.intervalo = setInterval(() => {
      this.consultarItensProgramadosAguardando();
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
          this.consultarItensProgramadosAguardando();
        }, 100);
      }
    });
  }

  public cadastrarNovoSetup(dados: any) {
    dados.data.item.sequencia = 0;
    dados.data.item.sequenciaSetup = 0;
    dados.data.item.turno.id = dados.data.turno;
    dados.data.item.linhaDeProducao.id = dados.data.linhaDeProducao;
    this.programacaoService.salvar(dados.data.item).subscribe({
      next: (res) => {},
      error: (e) => {console.log(e);}
    });
  }

  public atribuirSequenciaAoSetupExistente(resultado: any, dados: any) {
    dados.data.item.sequencia = 0;
    dados.data.item.setup = resultado.setup;
    dados.data.item.turno.id = dados.data.turno;
    dados.data.item.linhaDeProducao.id = dados.data.linhaDeProducao;
    this.programacaoService.salvar(dados.data.item).subscribe({
      next: (res) => {},
      error: (e) => {console.log(e);}
    });
  }

  private alterarSequenciaDeExibicaoDosItensDoSetUp(item: Programacao, novaSequencia: any) {
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
      });
    });
    this.openSnackBar('Sequencia alterada com sucesso!', this.snackBarSucesso);
  }

  public alterarSetup(setupAltual: Setup) {
    let dialogo = this.dialog.open(DlgAlterarSetupComponent, { disableClose: true,});
    dialogo.afterClosed().subscribe({
      next:(res)=>{
        if (res) {
          clearInterval(this.intervalo);
          this.alterarSequenciaDoSetUp(res.data, setupAltual);
        }
      },
      complete:()=>{
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
        next: (res) => {},
      });
    });
    this.consultarItensProgramadosAguardando();
  }

  /**
   * Realiza uma consulta dos itens programados no banco de dados com status de Aguardando
   */
  public consultarItensProgramadosAguardando() {
    this.programacaoService.consultarPorDataStatus(this.dataProgramacao, 'AGUARDANDO').subscribe({
      next: (res) => {
        this.itensProgramados = res;
      },
      complete: () => {
        this.colocarItensNaLista();
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
  public setStep(nomeSetup: any) {
    this.step = nomeSetup;
  }

  public exibirItensProgramados(itens: ItensLinha) {
    this.linhaSelecionadaVisualizacao = itens;
    this.sequenciaSetup = [];
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
      titulo = `${moment(this.dataProgramacao).format('DD/MM/yyyy')} - PROGAMAÇÃO CROMA ${item.linhaDeProducao.nome}`
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
      // foot: [['TOTAIS', '', '', '', '', '', '', '', '', '', '', '']]
    });

    this.docPdf.output("dataurlnewwindow");
    // this.docPdf.save("A");
  }

  public iniciarProgramacao(item: Programacao) {
    let dialogo = this.dialog.open(DglConfirmacaoComponent, { data: { mensagem: 'DESEJA INICIAR A PRODUÇÃO DESTE ITEM?' } });
    dialogo.afterClosed().subscribe(res => {
      if (res.data) {
        item.status = "PRODUZINDO";
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

  public finalizaProgramacao(item: Programacao) {
    let dialogo = this.dialog.open(DglConfirmacaoComponent, { data: { mensagem: 'DESEJA FINALIZAR A PRODUÇÃO DESTE ITEM?' } });
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
    let dialogo = this.dialog.open(DlgExclusaoComponent, { disableClose: true,});
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
                console.log();
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
}
