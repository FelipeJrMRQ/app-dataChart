import { ExcelService } from './../../../services/excel.service';
import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { FaturamentoBeneficiamento } from 'src/app/models/faturamento/faturamento-beneficiamento';
import { ModeloConsulta } from 'src/app/models/modelo-consulta';
import { FaturamentoService } from 'src/app/services/faturamento.service';
import * as moment from 'moment';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-faturamento-beneficiamento',
  templateUrl: './faturamento-beneficiamento.component.html',
  styleUrls: ['./faturamento-beneficiamento.component.css']
})
export class FaturamentoBeneficiamentoComponent implements OnInit {


  beneficiamentos: FaturamentoBeneficiamento[];
  modeloConsulta: ModeloConsulta;
  dataRecebida: any;
  cdCliente: any;
  nomeCliente: any;
  total: any = 0;
  totalQtde: any = 0;
  totalArea: any = 0;
  exportarDados: boolean = false;
  public itensPagina: number = 15;
  public paginaFaturamentoCliente: number = 1;
  private nomeTela: string = "faturamento-diario";

  constructor(
    private faturamentoService: FaturamentoService,
    private activeRouter: ActivatedRoute,
    private exportDataService: ExcelService,
    private router: Router,
    private controleExibicaoService: ControleExibicaoService
  ) {
    this.beneficiamentos = [];
    this.modeloConsulta = new ModeloConsulta();
  }

  ngOnInit(): void {
    this.controleExibicaoService.registrarLog('ACESSOU A TELA DETALHES POR BENEFICIAMENTO EM FATURAMENTO DIARIO');
    this.verificaPermissaoDeAcesso();
  }

  private verificaPermissaoDeAcesso() {
    forkJoin({
      s1: this.controleExibicaoService.verificaPermissaoDeAcesso('exportar_dados', this.nomeTela)
    }).subscribe({
      next: ({ s1 }) => {
        this.exportarDados = s1;
      },
      complete:()=>{
        this.activeRouter.params.subscribe((param: any) => {
          this.cdCliente = param.id;
          this.dataRecebida = param.data;
          this.nomeCliente = param.nomeCliente;
          this.consultaFaturamentoPorBeneficiamento();
        });
      },
      error:(e)=>{
        console.log(e);
      }
    });
  }
  
  //GERADOR EXCEL
  public gerarArquivo() {
    this.exportDataService.gerarExportBeneficiamentoDiario(this.beneficiamentos, 'Faturamento_por_cliente_por_Beneficiamento');
  }


  public navegar(cdBeneficiamento: any, nomeBeneficiamento: any) {
    this.router.navigate([`faturamento-diario/beneficiamento/${cdBeneficiamento}/${moment(this.dataRecebida).format('yyyy-MM-DD')}/${nomeBeneficiamento}`]);
  }

  public consultaFaturamentoPorBeneficiamento() {
    this.faturamentoService.consultaFaturamentoPorBeneficiamento(
      this.modeloConsulta.getInstance(this.dataRecebida, this.dataRecebida, "faturamento-beneficiamento", "", this.cdCliente)
    ).subscribe({
      next: (res) => {
        this.beneficiamentos = res.objeto;
        this.beneficiamentos.forEach(e => {
          this.total += e.valor;
          this.totalArea += e.area;
          this.totalQtde += e.quantidade;
        })
      }, error: (e) => {
        console.log(e);
      }
    })
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
        case 'quantidade':
          return compare(a.quantidade, b.quantidade, isAsc);
        case 'area':
          return compare(a.area, b.area, isAsc);
        default:
          return 0;
      }
    });
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
