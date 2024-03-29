import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import { HistoricoFaturamentoCliente } from 'src/app/models/faturamento/historico-faturamento-cliente';
import { HistoricoFaturamentoClienteDTO } from 'src/app/models/faturamento/historico-faturamento-cliente-dto';
import { ValoresMes } from 'src/app/models/faturamento/valores-mes';
import { ExcelService } from 'src/app/services/excel.service';
import { FaturamentoService } from 'src/app/services/faturamento.service';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';
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
  clientes: any = [];
  ordenacaoAscendente: boolean = false;
  urlOrigem: string = 'faturamento-periodo';
  nomeTela = '';
  visualizarDetalhes: boolean = false;
  exportarDadosExcel: boolean = false;
  pagina = 1;
  itensPagina= 20;

  constructor(
    private dateService: DateControllerService,
    private faturamentoService: FaturamentoService,
    private router: Router,
    private exportDataService: ExcelService,
    private controleExibicaoService: ControleExibicaoService,
  ) { }

  ngOnInit(): void {
    this.dataInicial = this.dateService.getInicioDoMes(moment(this.dataFinal).subtract(11, 'months').format('yyyy-MM-DD'));
    this.dataFinal = moment().format('yyyy-MM-DD');
    this.verificaPermissaoDeAcesso();
  }

  private verificaPermissaoDeAcesso(){
    forkJoin({
      s1: this.controleExibicaoService.verificaPermissaoDeAcesso('exportar_dados', 'faturamento-periodo'),
    }).subscribe(({s1})=>{
        this.exportarDadosExcel = s1;
        this.controleExibicaoService.registrarLog('ACESSOU A TELA FATURAMENTO DE CLIENTE POR PERIODO', 'FATURAMENTO POR CLIENTE')
        this.consultaHistoricoDeFaturamentoPorCliente();
    });
  }

  public consultaHistoricoDeFaturamentoPorCliente() {
    this.historico = [];
    this.faturamentoService.consultaHistoricoDeFaturamentoPorCliente(this.dataInicial, this.dataFinal).subscribe({
      next: (res) => {
        this.historico = res;
      },
      complete: () => {
        this.prepararEstruturaDeDados();
      }
    });
  }

  /**
   * Inicializa o processo de construção do objeto que será exibido ao usuário
   * em um formato compreensível 
   */
  public prepararEstruturaDeDados() {
    this.historicoMeses = [];
    this.historico.forEach(h => {
      if (!this.historicoMeses.some(hm => hm.nomeCliente == h.nomeCliente)) {
        let historico = new HistoricoFaturamentoCliente();
        historico.nomeCliente = h.nomeCliente;
        historico.cdCliente = h.cdCliente;
        this.historicoMeses.push(historico)
      }
    });
    this.iniciarValoresDosMeses();
  }

  public iniciarValoresDosMeses() {
    this.colunas = [];
    let data = this.dataInicial;
    while (moment(data).isBefore(this.dataFinal)) {
      //Cria as colunas de exibição da tabela com base nas datas inicial e final
      this.colunas.push(moment(data).format('M-yyyy'));
      //inicia o valor de todos o meses como zero
      this.historicoMeses.forEach(e => {
        let vm = new ValoresMes();
        vm.mesAno = moment(data).format('M-yyyy')
        vm.valor = 0;
        e.valoresMes.push(vm);
      });
      //Incrementa um mês a data até que a condição do while seja satisfeita
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
    this.historicoMesesFiltro =[...this.historicoMeses];
  }

  

  /**
   * Quando o usuário clicar em qualquer celula da tabela ele será redirecionado
   * ao detalhamento do cliente onde todos os dados referente aquele faturamento 
   * serão exibidos.
   * 
   * @param cliente 
   * @param mes 
   */
  public selecionarFaturamento(cliente: any, mes: any) {
    let mesAno: any = mes.split('-');
    let data: any = [];
    data.push(mesAno[1]);
    data.push(mesAno[0]);
    data.push('1');
    let dt = this.dateService.getFimDoMes(moment(new Date(data)).format('yyyy-MM-DD'));
    this.router.navigate([`detalhamento-cliente/${cliente.cdCliente}/${cliente.nomeCliente}/${dt}`]);
  }

  public exportarDados() {
    let dataExport: any = [];
    this.historicoMesesFiltro.forEach(cliente => {
      let obj: any = {
        'cdCliente': cliente.cdCliente,
        'nomeCliente': cliente.nomeCliente
      };
      let filtroCliente = this.historicoMesesFiltro.find(e => e.cdCliente == cliente.cdCliente);
      if (filtroCliente) {
        filtroCliente.valoresMes.forEach(vm => {
          obj[vm.mesAno] = vm.valor;
        });
      }
      dataExport.push(obj);
    });
    this.exportDataService.geradorExcell(dataExport, 'faturamento_cliente');
  }

  /**
   * Utilizado pelo metodo de ordenação para definir sua classificação
   * 
   * ASC - DESC
   */
  public alternarOrdem() {
    this.ordenacaoAscendente = !this.ordenacaoAscendente;
  }

  public ordenarPorValoresMes(coluna: string) {
    this.historicoMesesFiltro.sort((a, b) => {
      const valorA = a.valoresMes.find(vm => vm.mesAno === coluna)?.valor || 0;
      const valorB = b.valoresMes.find(vm => vm.mesAno === coluna)?.valor || 0;
      let resultado = 0;
      if (this.ordenacaoAscendente) {
        resultado = valorA - valorB;
      } else {
        resultado = valorB - valorA;
      }
      return resultado;
    });
    this.alternarOrdem();
  }


  public valorClass(valor: number) {
    if (valor == 0) {
      return "text-danger";
    } else {
      return "bold";
    }
  }

  public filtrarPorCliente() {
    let temp: any = this.historicoMeses.filter(cli => {
      return cli.nomeCliente.includes(this.nomeCliente.toUpperCase());
    });
    if(temp.length == 0){
     temp =  [{nomeCliente: 'CLIENTE NÃO ENCONTRADO.'}]
    }
   
    this.historicoMesesFiltro = temp;
  }


  public voltar() {
    window.history.back();
  }
}
