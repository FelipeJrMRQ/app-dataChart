import { ProdutoExport } from './../../../models/exports/produto-export';
import { ExcelService } from './../../../services/excel.service';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { FaturamentoMensalBeneficiamento } from 'src/app/models/faturamento/faturamento-mensal-beneficiamento';
import { FaturamentoMensalCliente } from 'src/app/models/faturamento/faturamento-mensal-cliente';
import { FaturamentoMensalProduto } from 'src/app/models/faturamento/faturamento-mensal-produto';
import { FaturamentoMensalService } from 'src/app/services/faturamento-mensal.service';
import { DlgFatMensalProdutoComponent } from 'src/app/shared/dialog/dlg-fat-mensal-produto/dlg-fat-mensal-produto.component';
import { DateControllerService } from 'src/app/utils/date-controller.service';
import * as bootstrap from 'bootstrap';
import { Sort } from '@angular/material/sort';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';

@Component({
  selector: 'app-faturamento-datalhe',
  templateUrl: './faturamento-datalhe.component.html',
  styleUrls: ['./faturamento-datalhe.component.css']
})
export class FaturamentoDatalheComponent implements OnInit {

  //OBJETOS
  clientes: FaturamentoMensalCliente[];
  clientesFiltro: FaturamentoMensalCliente[];
  beneficiamentos: FaturamentoMensalBeneficiamento[];
  beneficiamentosFiltro: FaturamentoMensalBeneficiamento[];
  produtos: FaturamentoMensalProduto[];
  produtosFiltro: FaturamentoMensalProduto[];

  //HTML VARIAVEIS
  paginaCliente: number = 1;
  paginaBeneficiamento: number = 1;
  paginaProduto: number = 1;
  itensPagina: number = 20;
  dialogRef: any;
  toolTip = [];
  nomeCliente: any = "";
  nomeBeneficiamento: any = "";
  nomeProduto: any = "";

  //DATA
  dataRecebida: any;

  //VALORES
  totalBeneficiamentos: number = 0;
  totalProdutos: number = 0;
  totalClientes: number = 0;

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private faturamentoMensalService: FaturamentoMensalService,
    private dateSevice: DateControllerService,
    private dialogo: MatDialog,
    private exporta: ExcelService,
    private renderer: Renderer2,
    private controleExibicaoService: ControleExibicaoService,
    
  ) {
    this.clientes = [];
    this.clientesFiltro = [];
    this.beneficiamentos = [];
    this.beneficiamentosFiltro = [];
    this.produtos = [];
    this.produtosFiltro = [];
    
  }

  ngOnInit(): void {
    this.renderer.selectRootElement(this.toolTip = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]')));
    var tooltipList = this.toolTip.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    this.activeRoute.params.subscribe((param: any) => {
      this.dataRecebida = param.data;
    });
    this.consultaFaturamentoMensalCliente();
    this.consultaFaturamentoMensalBeneficiamento();
    this.consultaFaturamentoMensalProduto();
    this.controleExibicaoService.registrarLog('ACESSOU A TELA DE FUTAMENTO MENSAL');
  }

  //METODOS PARA MUDANÇA DE ROTA 

  public detalheCliente(cdCliente: any, nomeCliente: any) {
    this.router.navigate([`faturamento-mensal/cliente/${cdCliente}/${nomeCliente}/${this.dataRecebida}`]);
  }

  public detalheBeneficiamento(cdBenficiamento: any, nomeBeneficiamento: any) {
    this.router.navigate([`faturamento-mensal/beneficiamento/${cdBenficiamento}/${nomeBeneficiamento}/${this.dataRecebida}`]);
  }

  public openDetalhesProduto(produto: FaturamentoMensalProduto) {
    this.dialogRef = this.dialogo.open(DlgFatMensalProdutoComponent, {
      data: produto,
      maxHeight: '95vh',
    });
  }
  
  public voltar() {
    this.router.navigate(['/dashboard-sintetico']);
  }

  //GERADORES EXPORT EXCEL
  public gerarExportCliente() {
    this.exporta.gerarExportCliente(this.clientes, "Faturamento-Mensal-Clientes")
  }

  public gerarExportBeneficiamento() {
    this.exporta.gerarExportBeneficiamento(this.beneficiamentos, "Faturamento-Mensal-Beneficiamento")
  }

  public gerarExportProduto() {
    this.exporta.gerarExportProduto(this.produtos, "Faturamento-Mensal-Produtos")
  }

  //METODOS DE CONSULTAS 
  public consultaFaturamentoMensalCliente() {
    this.faturamentoMensalService.consultaFaturamentoMensalCliente(this.dateSevice.getInicioDoMes(this.dataRecebida), moment(this.dataRecebida).format('yyyy-MM-DD'))
      .subscribe({
        next: (res) => {
          this.clientes = res;
        }, error: (e) => {
          console.log(e);
        }, complete: () => {
          this.somaTotalClientes();
        }
      });
  }

  public consultaFaturamentoMensalBeneficiamento() {
    this.faturamentoMensalService.consultaFaturamentoMensalBeneficiamento(this.dateSevice.getInicioDoMes(this.dataRecebida), moment(this.dataRecebida).format('yyyy-MM-DD')).subscribe({
      next: (res) => {
        this.beneficiamentos = res;
      }, error: (e) => {
        console.log(e);
      }, complete: () => {
        this.somaTotalBeneficiamentos();
      }
    });
  }

  public consultaFaturamentoMensalProduto() {
    this.faturamentoMensalService.consultaFaturamentoMensalProduto(this.dateSevice.getInicioDoMes(this.dataRecebida), moment(this.dataRecebida).format('yyyy-MM-DD')).subscribe({
      next: (res) => {
        this.produtos = res;
      }, error: (e) => {
        console.log(e);
      }, complete: () => {
        this.somaTotalProdutos();
      }
    });
  }

  //METODOS DE CALCULOS
  public somaTotalProdutos() {
    this.produtos.forEach((e) => {
      this.totalProdutos += e.valor;
    })
  }

  public somaTotalBeneficiamentos() {
    this.beneficiamentos.forEach((e) => {
      this.totalBeneficiamentos += e.valor;
    });
  }

  public filtrarPorCliente() {
    if (this.nomeCliente != '') {
      this.clientesFiltro = this.clientes.filter(cliente => {
        return cliente.nomeCliente?.includes(this.nomeCliente.toUpperCase());
      });
      this.somaTotalClientesFiltro();
    } else {
      this.totalClientes = 0
      this.clientesFiltro = [];
      this.consultaFaturamentoMensalCliente();
    }
  }

  public filtrarPorBeneficiamento() {
    if (this.nomeBeneficiamento != '') {
      this.beneficiamentosFiltro = this.beneficiamentos.filter(beneficiamento => {
        return beneficiamento.nomeBeneficiamento?.includes(this.nomeBeneficiamento.toUpperCase());
      });
      this.somaTotalBeneficiamentoFiltro();
    } else {
      this.totalBeneficiamentos = 0
      this.beneficiamentosFiltro = [];
      this.consultaFaturamentoMensalBeneficiamento();
    }
  }

  public filtrarPorProduto() {
    if (this.nomeProduto != '') {
      this.produtosFiltro = this.produtos.filter(produto => {
        return produto.nomeProduto?.includes(this.nomeProduto.toUpperCase());
      });
      console.log(this.produtosFiltro);
      this.somaTotalProdutoFiltro();
    } else {
      this.totalProdutos = 0
      this.produtosFiltro = [];
      this.consultaFaturamentoMensalProduto();
    }
  }

  public somaTotalClientesFiltro() {
    this.totalClientes = 0
    this.clientesFiltro.forEach(e => {
      this.totalClientes += e.valor
    })
  }

  public somaTotalBeneficiamentoFiltro() {
    this.totalBeneficiamentos = 0
    this.beneficiamentosFiltro.forEach(e => {
      this.totalBeneficiamentos += e.valor
    })
  }

  public somaTotalProdutoFiltro() {
    this.totalProdutos = 0
    this.produtos.forEach(e => {
      this.totalProdutos += e.valor
    })
  }

  public somaTotalClientes() {
    this.totalClientes = 0
    this.clientes.forEach((e) => {
      this.totalClientes += e.valor;
    });
  }

  public sortCliente(sort: Sort) {
    const data = this.clientes.slice();
    if (!sort.active || sort.direction === '') {
      this.clientes = data;
      return;
    }

    this.clientes = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'nomeCliente':
          return compare(a.nomeCliente, b.nomeCliente, isAsc);
        default:
          return 0;
      }
    });
  }

  public sortBeneficiamento(sort: Sort) {
    const data = this.beneficiamentos.slice();
    if (!sort.active || sort.direction === '') {
      this.beneficiamentos = data;
      return;
    }

    this.beneficiamentos = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'nomeBeneficiamento':
          return compare(a.nomeBeneficiamento, b.nomeBeneficiamento, isAsc);
        default:
          return 0;
      }
    });
  }

  public sortProduto(sort: Sort) {
    const data = this.produtos.slice();
    if (!sort.active || sort.direction === '') {
      this.produtos = data;
      return;
    }

    this.produtos = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'nomeProduto':
          return compare(a.nomeProduto, b.nomeProduto, isAsc);
        default:
          return 0;
      }
    });
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
