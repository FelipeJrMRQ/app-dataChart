import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { HistoricoFaturamentoCliente } from 'src/app/models/faturamento/historico-faturamento-cliente';
import { HistoricoFaturamentoClienteDTO } from 'src/app/models/faturamento/historico-faturamento-cliente-dto';
import { ValoresMes } from 'src/app/models/faturamento/valores-mes';
import { FaturamentoService } from 'src/app/services/faturamento.service';
import { DateControllerService } from 'src/app/utils/date-controller.service';

@Component({
  selector: 'app-tbl-faturamento-cliente',
  templateUrl: './tbl-faturamento-cliente.component.html',
  styleUrls: ['./tbl-faturamento-cliente.component.css']
})
export class TblFaturamentoClienteComponent implements OnInit {

  dataInicial: any;
  dataFinal: any;
  colunas: any = [];
  mesesDoAno: ValoresMes[] = [];
  historico: HistoricoFaturamentoClienteDTO[] = [];
  historicoMeses: HistoricoFaturamentoCliente[] = []
  historicoMesesFiltro: HistoricoFaturamentoCliente[] = []
  nomeCliente: any = '';

  constructor(
    private dateService: DateControllerService,
    private faturamentoService: FaturamentoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.dataInicial = this.dateService.getInicioDoMes(moment(this.dataFinal).subtract(11, 'months').format('yyyy-MM-DD'));
    this.dataFinal = moment().format('yyyy-MM-DD');
    this.consultaHistoricoDeFaturamentoPorCliente();
  }

  public consultaHistoricoDeFaturamentoPorCliente() {
    this.historico = [];
    this.faturamentoService.consultaHistoricoDeFaturamentoPorCliente(this.dataInicial, this.dataFinal).subscribe({
      next: (res) => {
        this.historico = res;
      },
      complete: () => {
        this.montarMesesDoAno();
      }
    });
  }

  public montarMesesDoAno() {
    this.historicoMeses = [];
    this.historico.forEach(h => {
      if (!this.historicoMeses.some(hm => hm.nomeCliente == h.nomeCliente)) {
        let historico = new HistoricoFaturamentoCliente();
        let vm = new ValoresMes();
        historico.nomeCliente = h.nomeCliente;
        historico.cdCliente = h.cdCliente;
        this.historicoMeses.push(historico)
      }
    });
    this.preencherMesesDoAno();
  }

  public preencherMesesDoAno() {
    this.colunas = [];
    let data = this.dataInicial;
    while (moment(data).isBefore(this.dataFinal)) {
      this.colunas.push(moment(data).format('MM-YY'));
      this.historicoMeses.forEach(e => {
        let vm = new ValoresMes();
        vm.mesAno = moment(data).format('M-yyyy')
        vm.valor = 0;
        e.valoresMes.push(vm);
      });
      data = moment(data).add(1, 'month');
    }
    this.preencherValoresDosMeses();
  }

  public preencherValoresDosMeses() {
    this.historico.forEach(h => {
      let index = this.historicoMeses.findIndex(his => his.nomeCliente == h.nomeCliente);
      let indexMes = this.historicoMeses[index].valoresMes.findIndex(vm => vm.mesAno == `${h.mes}-${h.ano}`);
      this.historicoMeses[index].valoresMes[indexMes].valor = h.valor;
    });
    this.historicoMesesFiltro = this.historicoMeses;
  }

  public valorClass(valor: number) {
    if (valor == 0) {
      return "text-danger";
    } else {
      return "bold";
    }
  }

  public filtrarPorCliente(){
    let temp = this.historicoMeses.filter(cli =>{
      return cli.nomeCliente.includes(this.nomeCliente.toUpperCase());
    });
    this.historicoMesesFiltro = temp;
  }

  public selecionarFaturamento(cliente: any, mes: any){
    let mesAno: any =  mes.split('-');
    let data : any =[];
    data.push(mesAno[1]);
    data.push(mesAno[0]);
    data.push('1');
    let dt = this.dateService.getFimDoMes(moment(new Date(data)).format('yyyy-MM-DD'));
    this.router.navigate([`detalhamento-cliente/${cliente.cdCliente}/${cliente.nomeCliente}/${dt}`]);
  }

}
