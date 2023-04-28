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
  totalTbValor: any = 0;
  processo: any = [];
  linhas: LinhaDeProducao[];
  turnos: Turno[];
  itensProgramados: Programacao[];
  itensIniciados: Programacao[];
  idTurno: number = 0;
  idLinha: number = 0;
  docPdf: jsPDF;
  dataProgramacao: string = moment().format("yyyy-MM-DD");
  itensLinhaVisualizacao: Programacao[];
  nomeLinhaVisualizacao: any;
  turnoVisualizacao: any;

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
    this.consultarLinhasDeProducao();
    this.consultarTurnoDeTrabalho();
    this.consultarItensProgramadosAguardando();
    this.controleExibicaoService.registrarLog('ACESSOU A TELA ITENS PROGRAMADOS');
    let txt = document.getElementById('txt-fd');
  }

  public testarPDF(itensLinha: ItensLinha) {
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
      headStyles: { fillColor: 'black', fontSize: 4 },
      footStyles: { fillColor: 'black' },
      theme: 'grid',
      styles: { fontSize: 4, fontStyle: 'bold', lineColor: 'black' },
      head: [
        ['ENTRADA', 'CLIENTE', 'PRODUTO', 'PROCESSO 1', 'PROCESSO 2', 'ESPESSURA', 'QTDE', 'CONTROLE', 'ITEM', 'OBS', 'SIM', 'NÃO', 'POR QUE?']
      ],
      body: bodyTabela
      ,
      // foot: [['TOTAIS', '', '', '', '', '', '', '', '', '', '', '']]
    });

    this.docPdf.output("dataurlnewwindow");
    // this.docPdf.save("A");
  }

  private colocarItensNaLista() {
    this.itensLinha = [];
    this.itensProgramados.forEach(item => {
      if (this.itensLinha.some(il => il.linhaDeProducao.id == item.linhaDeProducao.id && il.turno.id == item.turno.id)) {
        let index = this.itensLinha.findIndex(itl => itl.linhaDeProducao.id == item.linhaDeProducao.id && itl.turno.id == item.turno.id);
        this.itensLinha[index].valorPrevisto += item.valorPrevisto;
        this.itensLinha[index].itensProgramados.push(item);
        this.itensLinha[index].turno = item.turno;
      } else {
        let il = new ItensLinha();
        il.itensProgramados.push(item);
        il.linhaDeProducao = item.linhaDeProducao;
        il.valorPrevisto += item.valorPrevisto;
        il.turno = item.turno;
        this.itensLinha.push(il);
      }
    });
    console.log(this.itensLinha);
    this.separItensPorTurno();
  }

  public consultarItensProgramadosAguardando() {
    if (this.idTurno == 0 && this.idLinha == 0) {
      this.programacaoService.consultarPorDataStatus(this.dataProgramacao, "AGUARDANDO").subscribe({
        next: (res) => {
          this.itensProgramados = res;
        },
        complete: () => {
          this.colocarItensNaLista();
        }
      });
    } else {
      this.programacaoService.consultar(this.idLinha, this.idTurno, this.dataProgramacao, "AGUARDANDO").subscribe({
        next: (res) => {
          this.itensProgramados = res;
        }
      });
    }
  }

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
    this.itensLinhaVisualizacao = itens.itensProgramados;
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
    itens.itensProgramados.forEach(e=>{
      this.totalTbValor += e.valorPrevisto;
      this.totalTbQtde += e.qtdeProgramada;
    })
  }

  public visualizarDetalhes(item: Programacao) {
    this.dialog.open(DlgDetalheItemComponent, {
      data: item,
      maxHeight: '95vh',
      disableClose: true,
    });
  }

}
