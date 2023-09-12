import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import * as moment from 'moment';
import { ProducaoPorBeneficiamentoDTO } from 'src/app/models/produto/producao-beneficiamento-dto';
import { ExcelService } from 'src/app/services/excel.service';
import { FaturamentoService } from 'src/app/services/faturamento.service';
import { DateControllerService } from 'src/app/utils/date-controller.service';

@Component({
  selector: 'app-tbl-producao-beneficiamento',
  templateUrl: './tbl-producao-beneficiamento.component.html',
  styleUrls: ['./tbl-producao-beneficiamento.component.css']
})
export class TblProducaoBeneficiamentoComponent implements OnInit {

  dataInicial: any;
  dataFinal: any;
  beneficiamentos: ProducaoPorBeneficiamentoDTO[] = [];
  pagina: any = 1;
  quantidade: number =0;
  peso:number = 0;
  area:number = 0;
  valor: number = 0;

  constructor(
    private dateService: DateControllerService,
    private faturamentoService: FaturamentoService,
    private exportDataService: ExcelService,
  ) { }

  ngOnInit(): void {
    this.dataInicial = this.dateService.getInicioDoMes(moment().format('yyyy-MM-DD'));
    this.dataFinal = moment().format('yyyy-MM-DD');
    this.consultarProducaoPorBeneficiamentoValorQuantidade();
  }


  public consultarProducaoPorBeneficiamentoValorQuantidade() {
    this.faturamentoService.consultarProducaoPorBeneficiamentoValorQuantidade(this.dataInicial, this.dataFinal).subscribe({
      next: (res) => {
        this.beneficiamentos = [];
        this.beneficiamentos = res;
      },
      complete:()=>{
        this.somarTotais();
      }
    });
  }

  public exportarDados() {
    this.exportDataService.geradorExcell(this.beneficiamentos, 'producao_beneficiamento_valor_quantidade');
  }

  public ordenarDados(sort: Sort) {
    const data = this.beneficiamentos.slice();
    if (!sort.active || sort.direction === '') {
      this.beneficiamentos = data;
      return;
    }

    this.beneficiamentos = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'nomeBeneficiamento':
          return this.compare(a.nomeBeneficiamento, b.nomeBeneficiamento, isAsc);
        case 'quantidade':
          return this.compare(a.quantidade, b.quantidade, isAsc);
        case 'peso':
          return this.compare(a.peso, b.peso, isAsc);
        case 'area':
          return this.compare(a.area, b.area, isAsc);
        case 'valor':
          return this.compare(a.valor, b.valor, isAsc);
        default:
          return 0;
      }
    });
  }

  public somarTotais(){
      this.quantidade = 0;
      this.area = 0;
      this.valor = 0;
      this.peso = 0;
      this.beneficiamentos.forEach(e=>{
        this.quantidade += e.quantidade;
        this.area += e.area;
        this.peso += e.peso;
        this.valor += e.valor;
      });
  }

  private compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

}
