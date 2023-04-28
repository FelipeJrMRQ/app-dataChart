import { FaturamentoCliente } from './../../../models/faturamento/faturamento-cliente';
import { ModeloConsulta } from 'src/app/models/modelo-consulta';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { FaturamentoService } from 'src/app/services/faturamento.service';
import { Sort } from '@angular/material/sort';
import { ExcelService } from 'src/app/services/excel.service';
import { forkJoin } from 'rxjs';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';


@Component({
  selector: 'app-faturamento-cliente',
  templateUrl: './faturamento-cliente.component.html',
  styleUrls: ['./faturamento-cliente.component.css']
})
export class FaturamentoClienteComponent implements OnInit {

  public dataRecebida: any;
  public cdBeneficiamento: any;
  public nomeBeneficiamento: any;
  public valorTotal: number = 0;
  faturamentos: FaturamentoCliente[];
  modeloConsulta: ModeloConsulta;
  exportarDados: boolean = false;
  public itensPagina: number = 15;
  public paginasFaturamentoCliente: number = 1;
  private nomeTela: string = "faturamento-diario";


  constructor(
    private activeRouter: ActivatedRoute,
    private router: Router,
    private faturamentoService: FaturamentoService,
    private exportDataService: ExcelService,
    private controleExibicaoService: ControleExibicaoService,
  ) {
    this.modeloConsulta = new ModeloConsulta();
    this.faturamentos = [];
  }

  ngOnInit(): void {
    this.controleExibicaoService.registrarLog('ACESSOU A TELA DETALHES POR CLIENTE EM FATURAMENTO DIARIO');
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
          this.dataRecebida = param.data;
          this.cdBeneficiamento = param.cdBeneficiamento
          this.nomeBeneficiamento = param.nomeBeneficiamento;
          if (this.cdBeneficiamento) {
            this.consultaFaturamentoDeClientePorBeneficiamento();
          } else {
            this.consultarFaturamentoCliente();
          }
        });
      },
      error:(e)=>{
        console.log(e);
      }
    });
  }


  consultaFaturamentoDeClientePorBeneficiamento() {
    this.faturamentoService.consultaFaturamentoDeClientePorBeneficiamento(
      this.modeloConsulta.getInstance(this.dataRecebida, this.dataRecebida, '', '', this.cdBeneficiamento)
    ).subscribe({
      next: (res) => {
        this.faturamentos = res.objeto;
        this.faturamentos.forEach(e => {
          this.valorTotal += e.valor;
        })
      }
    })
  }

  public voltarPaginaAnterior() {
    this.router.navigate([`faturamento-diario/${this.dataRecebida}`]);
    window.scrollTo(0, 0);
  }


  public gerarArquivo() {
    this.exportDataService.geradorExcell(this.faturamentos, "Faturamento_por_cliente");
  }


  public consultarFaturamentoClienteProduto(id: any, data: any, nomeCliente: any) {
    this.router.navigate([`/faturamento-diario/produto/${id}/${data}/${nomeCliente}`]);
    window.scrollTo(0, 0);
  }

  public consultarFaturamentoCliente() {
    this.modeloConsulta.tipoConsulta = "faturamento-cliente";
    this.modeloConsulta.dataInicial = this.dataRecebida;
    this.faturamentoService.consultaFaturamentoPorCliente(this.modeloConsulta).subscribe({
      next: (res) => {
        this.faturamentos = res.objeto;

      }, complete: () => {
        this.dataRecebida = moment(this.dataRecebida).format("DD/MM/yyyy");
        this.faturamentos.forEach((e) => {
          this.valorTotal += e.valor
        })
      }
    });
  }

  public sortCliente(sort: Sort) {
    const data = this.faturamentos.slice();
    if (!sort.active || sort.direction === '') {
      this.faturamentos = data;
      return;
    }

    this.faturamentos = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'nomeCliente':
          return compare(a.nomeCliente, b.nomeCliente, isAsc);
        case 'cdCliente':
          return compare(a.cdCliente, b.cdCliente, isAsc);
        default:
          return 0;
      }
    });
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
