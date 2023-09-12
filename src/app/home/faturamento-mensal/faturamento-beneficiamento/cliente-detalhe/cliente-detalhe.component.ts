import { ExcelService } from 'src/app/services/excel.service';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { FaturamentoMensalProduto } from 'src/app/models/faturamento/faturamento-mensal-produto';
import { FaturamentoMensalService } from 'src/app/services/faturamento-mensal.service';
import { DlgFatMensalProdutoComponent } from 'src/app/shared/dialog/dlg-fat-mensal-produto/dlg-fat-mensal-produto.component';
import { DateControllerService } from 'src/app/utils/date-controller.service';
import * as bootstrap from 'bootstrap';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';

@Component({
  selector: 'app-cliente-detalhe',
  templateUrl: './cliente-detalhe.component.html',
  styleUrls: ['./cliente-detalhe.component.css']
})
export class ClienteDetalheComponent implements OnInit {

  cdBeneficiamento: any;
  cdCliente: any;
  nomeBeneficiamento: any;
  nomeCliente: any;

  //DATA
  dataRecebida: any;

  //OBJETO
  beneficiamentos: FaturamentoMensalProduto[];
  produtos: FaturamentoMensalProduto[];

  // VALORES
  totalBeneficiamento: number = 0;
  totalProduto: number = 0;
  totalQtde: number = 0;

  //HTML VARIAVEIS
  paginaProduto = 1
  itensPagina: number = 20;
  itensBeneficiamentoPagina: number = 20
  paginasBeneficiamento: number = 1;
  dialogRef: any;
  toolTip = [];

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private service: FaturamentoMensalService,
    private dateService: DateControllerService,
    private dialog: MatDialog,
    private exporta: ExcelService,
    private renderer: Renderer2,
    private controleExibicaoService: ControleExibicaoService,
  ) {

    this.produtos = [];
    this.beneficiamentos = [];
  }

  ngOnInit(): void {
    this.controleExibicaoService.registrarLog('ACESSOU A TELA DETALHES POR CLIENTE [FATURAMENTO MENSAL -> BENEFICIAMENTO -> CLIENTE ] ', 'FATURAMENTO MENSAL -> BENEFICIAMENTO -> CLIENTE ')
    this.renderer.selectRootElement(this.toolTip = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]')));
    var tootipList = this.toolTip.map(function(tooltipTriggerEl){
     return new bootstrap.Tooltip(tooltipTriggerEl);
   });
    this.activeRoute.params.subscribe((param: any) => {
      this.cdBeneficiamento = param.cdBeneficiamento;
      this.nomeBeneficiamento = param.nomeBeneficiamento;
      this.cdCliente = param.cdCliente;
      this.nomeCliente = param.nomeCliente;
      this.dataRecebida = param.data;
    });
    this.consultaBeneficiamentos();
    this.consultaProdutos();
  }

  //METODO DE ROTAS

  public voltar() {
    this.router.navigate([`faturamento-mensal/beneficiamento/${this.cdBeneficiamento}/${this.nomeBeneficiamento}/${this.dataRecebida}`]);
  }


  //GERADOR DE ARQUIVO
  public gerarExportBeneficiamento() {
    this.exporta.gerarExportBeneficiamento(this.beneficiamentos, `Faturamento-beneficiamento(${this.nomeCliente})-Mes`)
  }

  public gerarExportProduto() {
    this.exporta.gerarExportProduto(this.produtos, `Faturamento-beneficiamento(${this.nomeCliente})-Mes`)
  }

  //METODOS DE CONSULTA 
  public consultaBeneficiamentos() {
    this.service.faturamentoDeProdutosDoBeneficiamentoDeCliente(
      this.dateService.getInicioDoMes(this.dataRecebida), moment(this.dataRecebida).format('yyyy-MM-DD'), this.cdCliente, this.cdBeneficiamento
    ).subscribe({
      next: (res) => {
        this.beneficiamentos = res;
      },
      complete: () => {
        this.somaTotalBeneficiamento();
      }
    })
  }

  public consultaProdutos() {
    this.service.detalhesDoBeneficiamentoPorProduto(
      this.dateService.getInicioDoMes(this.dataRecebida), moment(this.dataRecebida).format('yyyy-MM-DD'), this.cdCliente, this.cdBeneficiamento
    ).subscribe({
      next: (res) => {
        this.produtos = res;
      },
      complete: () => {
        this.somaTotalProduto();
      }
    });
  }

  //METODOS DE CALCULOS

  private somaTotalBeneficiamento() {
    this.beneficiamentos.forEach(b => {
      this.totalBeneficiamento += b.valor;
    });
  }

  private somaTotalProduto() {
    this.produtos.forEach(p => {
      this.totalProduto += p.valor;
      this.totalQtde += p.quantidade;
    });
  }

//ABRIR DIALOG

  public openDetalhesProduto(produto: FaturamentoMensalProduto) {
    this.dialogRef = this.dialog.open(DlgFatMensalProdutoComponent, {
      data: produto,
      maxHeight: '95vh',
    });
  }
}
