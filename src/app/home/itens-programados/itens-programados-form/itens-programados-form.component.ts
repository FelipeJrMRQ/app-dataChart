import { Component, OnInit } from '@angular/core';
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


@Component({
  selector: 'app-itens-programados-form',
  templateUrl: './itens-programados-form.component.html',
  styleUrls: ['./itens-programados-form.component.css']
})
export class ItensProgramadosFormComponent implements OnInit {

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
  itensLinhaVisualizacao: Programacao[];
  nomeLinhaVisualizacao: any;
  turnoVisualizacao: any;
  itemSelecionadoVisualizacao: any;
  atualizarExibicao: boolean = false;
  intervalo: any;
  panelOpenState = false;
  sequenciaSetup: Setup[] = [];

  constructor(
    private programacaoService: ProgramacaoService,
    private dialog: MatDialog,
    private linhaService: LinhaDeProducaoService,
    private turnoService: TurnoService,
    private controleExibicaoService: ControleExibicaoService,
  ) {
    this.itensProgramados = [];
    this.itensIniciados = [];
    this.itensLinha = [];
    this.itensLinhaTurno1 = [];
    this.itensLinhaTurno2 = [];
    this.itensLinhaTurno3 = [];
    this.linhas = [];
    this.turnos = [];
    this.itensLinhaVisualizacao = [];
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

  /**
   * Método utilizado para conseguir atualizar todos usuários sobre
   * alterações realizadas na programação.
   * 
   */
  veriricarAtualizacoesPorIntervalo() {
    clearInterval(this.intervalo);
    this.intervalo = setInterval(() => {
      this.atualizarExibicao = true;
      this.consultarItensProgramadosAguardando();
    }, 2000);
  }

  public visualizarDetalhesDoItem(item: Programacao) {
    let dialogo = this.dialog.open(DlgDetalheItemComponent, {
      data: item,
      maxHeight: '95%'
    });

    /**
     * Quanto houver alguma alteração na programação o sistema realiza uma nova consulta
     * e limpa a lista de exibição atual
     */
    dialogo.afterClosed().subscribe({
      next: (res) => {
        if (res.data) {
          this.atualizarExibicao = true;
          this.alterarSequenciaDeExibicaoDosItensDoSetUp(item.setup);
        }
      }
    });
  }

  private alterarSequenciaDeExibicaoDosItensDoSetUp(setup: any) {
    let index = this.sequenciaSetup.findIndex(s => s.setup == setup);
    this.programacaoService.consultarPorSetupData(setup, moment().format('yyyy-MM-DD')).subscribe({
      next: (res) => {
        this.sequenciaSetup[index].nomeBeneficiamento = res[0].nomeBeneficiamento;
        this.sequenciaSetup[index].itensProgramados = res;
      }
    });
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

  public alterarSetup(setupAltual: Setup) {
    let dialogo = this.dialog.open(DlgAlterarSetupComponent, {

    });

    dialogo.afterClosed().subscribe(res=>{
      this.verificaExistenciaDeSetupCadastrado(res.data, setupAltual);
    });
  }

  private verificaExistenciaDeSetupCadastrado(setupFuturo: number, setupAtual: Setup){
    let setupTemp: any = new Setup();
     if(this.setupEstaCadastrado(setupFuturo)){
      setupTemp = this.sequenciaSetup.find((s: Setup)=> s.setup == setupFuturo);
      this.alterarSetupAtual(setupFuturo, setupAtual);
      this.alterarSetupExistente(setupTemp, setupAtual.setup);
     }else{
      console.log('Não existe setup');
     }
  }

  private alterarSetupAtual(setupFuturo: number, setupAtual: Setup){
      setupAtual.itensProgramados.forEach(s=>{
        s.setup = setupFuturo;
        this.programacaoService.salvar(s).subscribe({
          next:(res)=>{
            console.log(res);
          },
          complete:()=>{
            this.alterarSequenciaDeExibicaoDosItensDoSetUp(setupFuturo);
          }
        });
      });
  }

  private alterarSetupExistente(setup: Setup, setupAtual: any){
    setup.itensProgramados.forEach((i: Programacao)=>{
      i.setup = setupAtual;
       this.programacaoService.salvar(i).subscribe({
        next:(res)=>{
          console.log(res);
        },
        complete:()=>{
          this.alterarSequenciaDeExibicaoDosItensDoSetUp(setupAtual);
        } 
       });
    });
  }

  private setupEstaCadastrado(setupFuturo: number): boolean{
    return this.sequenciaSetup.some(s=> s.setup == setupFuturo);
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

  public atualizarVisualizacaoAposAlteracao() {
    if (this.atualizarExibicao) {
      let itens: any;
      switch (this.itemSelecionadoVisualizacao.turno.nome) {
        case 'MANHÃ':
          itens = this.itensLinhaTurno1.filter(i => i.linhaDeProducao.id == this.itemSelecionadoVisualizacao.linhaDeProducao.id);
          this.exibirItensProgramados(itens[0]);
          this.atualizarExibicao = false;
          break;
        case 'TARDE':
          itens = this.itensLinhaTurno2.filter(i => i.linhaDeProducao.id == this.itemSelecionadoVisualizacao.linhaDeProducao.id);
          this.exibirItensProgramados(itens[0]);
          this.atualizarExibicao = false;
          break;
        case 'NOITE':
          itens = this.itensLinhaTurno3.filter(i => i.linhaDeProducao.id == this.itemSelecionadoVisualizacao.linhaDeProducao.id);
          this.exibirItensProgramados(itens[0]);
          this.atualizarExibicao = false;
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

  public exibirItensProgramados(itens: ItensLinha) {
    this.sequenciaSetup = [];
    itens.itensProgramados.forEach(item => {
      if (!this.sequenciaSetup.find(s => s.setup == item.setup)) {
        let st = new Setup();
        st.nomeBeneficiamento  = item.nomeBeneficiamento;
        st.setup = item.setup;
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
    item.status = "INICIADO";
    item.inicioProducao = new Date();
    // let dialogo= this.dialog.open(DglConfirmacaoComponent, {

    // });

    // dialogo.afterClosed().subscribe(res=>{
    //   if(res.data){

    //   }
    // })
    this.programacaoService.salvar(item).subscribe({
      next: (res) => {

      },
      complete: () => {
        this.atualizarVisualizacaoAposAlteracao();
      }
    })
  }

  public finalizaProgramacao(item: Programacao) {
    item.status = "FINALIZADO";
    item.fimProducao = new Date();
    this.programacaoService.salvar(item).subscribe({
      next: (res) => {

      },
      complete: () => {
        this.atualizarVisualizacaoAposAlteracao();
      }
    })
  }
}
