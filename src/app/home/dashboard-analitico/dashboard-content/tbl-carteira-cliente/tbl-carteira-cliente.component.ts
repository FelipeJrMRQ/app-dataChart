import { ExcelService } from './../../../../services/excel.service';
import { FaturamentoService } from './../../../../services/faturamento.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ModeloConsulta } from 'src/app/models/modelo-consulta';
import { CarteiraCliente } from 'src/app/models/carteira/carteira-cliente';
import { ClienteService } from 'src/app/services/cliente.service';
import { Router } from '@angular/router';
import { Sort } from '@angular/material/sort';
import { CarteiraExport } from 'src/app/models/exports/carteira-export';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-tbl-carteira-cliente',
  templateUrl: './tbl-carteira-cliente.component.html',
  styleUrls: ['./tbl-carteira-cliente.component.css']
})
export class TblCarteiraClienteComponent implements OnInit, OnDestroy {

  private modeloConsulta: ModeloConsulta;

  public elementBar: any;
  public charPie: any = "";
  public colorChart: any = [];
  public dNone: any = "d-none";
  public dataType: boolean = false;
  private intervalo: any;
  private carteiraExportData: CarteiraExport[];

  //Listas
  public listaCarteiraCliente: CarteiraCliente[];

  //Controle de paginacao
  public itensPagina: number = 15;
  public paginaCliente = 1;

  //Valores
  valorTotalCarteira: number = 0;

  //datas
  private dataRecebida: string = moment().format();

  public exportarDados: boolean = false;
  private nomeTela: string = 'dashboard-analitico';

  //Estilos
  public upDateOption: any = 'd-none';

  constructor(
    private clienteService: ClienteService,
    private exportDataService: ExcelService,
    private route: Router,
    private controleExibicaoService: ControleExibicaoService,
  ) {
    this.modeloConsulta = new ModeloConsulta();
    this.listaCarteiraCliente = [];
    this.carteiraExportData = [];
  }

  ngOnInit(): void {
    this.receberData();
    this.verificaSeOSistemaEstaAtualizando();
    this.verificaPermissaoDeAcesso();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalo);
  }

  private verificaPermissaoDeAcesso() {
    forkJoin({
      s1: this.controleExibicaoService.verificaPermissaoDeAcesso('exportar_dados_carteira_cliente', this.nomeTela)
    }).subscribe({
      next: ({ s1 }) => {
        this.exportarDados = s1;
      }, complete: () => {
        this.consultaCarteiraPorCliente();
      }, error: (e) => {
        console.log(e);
      }
    });
  }

  public verificaSeOSistemaEstaAtualizando() {
    if (this.intervalo == undefined) {
      this.intervalo = setInterval(() => {
        this.clienteService.isUpdateCarteiraCliente().subscribe({
          next: (res) => {
            if (res) {
              this.upDateOption = 'd-block';
            } else {
              this.upDateOption = 'd-none';
            }
          }
        })
      }, 3000);
    } else {
      clearInterval(this.intervalo);
    }
  }

  public navegar(cdCliente: any, nomeCliente: any) {
    setTimeout(() => {
      this.route.navigate([`/carteira-cliente/${cdCliente}/${moment(this.dataRecebida).format('yyyy-MM-DD')}/${nomeCliente}`]);
      window.scrollTo(0, 0);
    }, 100);
  }

  public gerarArquivo() {
    this.listaCarteiraCliente.forEach((e) => {
      let expor = new CarteiraExport();
      expor.NOME = e.nome;
      expor.VALOR = e.valor;
      this.carteiraExportData.push(expor);
    });
    this.exportDataService.geradorExcell(this.carteiraExportData, "Carteira-cliente");
    this.controleExibicaoService.registrarLog('EXPORTOU DADOS DA CARTEIRA POR CLIENTE', '');
  }

  private receberData() {
    FaturamentoService.emitirData.subscribe(res => {
      this.dataRecebida = res;
      this.verificaPermissaoDeAcesso();
    })
  }

  public calculoPercentual(valor: any) {
    return (valor * 100) / this.valorTotalCarteira;
  }

  private consultaCarteiraPorCliente() {
    this.modeloConsulta.tipoConsulta = "carteira-cliente";
    this.modeloConsulta.dataInicial = moment(this.dataRecebida).format("yyyy-MM-DD");
    this.clienteService.consultarCarteiraPorCliente(this.modeloConsulta).subscribe({
      next: (res) => {
        this.listaCarteiraCliente = res.objeto;
      },
      error: (e) => {
        console.log(e);
      }, complete: () => {
        this.calculaValorCarteira();
      }
    });
  }

  private calculaValorCarteira() {
    this.valorTotalCarteira = 0;
    this.listaCarteiraCliente.forEach((p) => {
      this.valorTotalCarteira += p.valor;
    });
  }

  public get calcularTotalCarteiraCliente() {
    let valor = 0;
    this.listaCarteiraCliente.forEach((e) => {
      valor += e.valor;
    });
    return valor;
  }

  public sortCliente(sort: Sort) {
    const data = this.listaCarteiraCliente.slice();
    if (!sort.active || sort.direction === '') {
      this.listaCarteiraCliente = data;
      return;
    }

    this.listaCarteiraCliente = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'nome':
          return compare(a.nome, b.nome, isAsc);
        case 'valor':
          return compare(a.valor, b.valor, isAsc);
        default:
          return 0;
      }
    });
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}


