import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { EntradaMensal } from 'src/app/models/entrada/entrada-mensal';
import { FaturamentoMensal } from 'src/app/models/faturamento/faturamento-mensal';
import { ModeloConsulta } from 'src/app/models/modelo-consulta';
import { ClienteService } from 'src/app/services/cliente.service';
import { EntradaService } from 'src/app/services/entrada.service';
import { FaturamentoMensalService } from 'src/app/services/faturamento-mensal.service';
import { DateControllerService } from 'src/app/utils/date-controller.service';

@Component({
  selector: 'app-card-informacoes',
  templateUrl: './card-informacoes.component.html',
  styleUrls: ['./card-informacoes.component.css']
})
export class CardInformacoesComponent implements OnInit {

  public entradasDoMes: EntradaMensal[] = [];
  public faturamentoDoMes: FaturamentoMensal[] = [];
  valorEntrada: any = 0;
  valorEntradaMesAnterior = 0;
  valorFaturamento: any = 0;
  valorFaturamentoMesAnterior: any = 0;
  xy1Entrada: any = 0;
  xy1Faturamento: any = 0;
  valorCarteira: any = 0;
  dataRecebida: any = moment().format('yyyy-MM-DD');
  modeloConsulta: ModeloConsulta = new ModeloConsulta();

  constructor(
    private entradaService: EntradaService,
    private dateService: DateControllerService,
    private faturamentoService: FaturamentoMensalService,
    private clienteService: ClienteService
  ) { }

  ngOnInit(): void {
    this.consultaEntradaDoMes();
    this.consultaFaturamentoDoMes();
    this.consultarCarteiraCliente();
  }

  private consultaFaturamentoDoMes() {
    this.faturamentoService.consultaTotalFaturamentoPorMes(this.dateService.getInicioDoMes(this.dataRecebida), this.dataRecebida).subscribe({
      next: (res) => {
        this.faturamentoDoMes = res;
        this.valorFaturamento = this.faturamentoDoMes[0].valor;
      },
      complete:()=>{
        this.consultaFaturamentoDoMesAnoPassado();
      }
    });
  }

  private consultaFaturamentoDoMesAnoPassado() {
    let data = moment(this.dataRecebida).subtract(1, 'year');
    this.faturamentoService.consultaTotalFaturamentoPorMes(
      this.dateService.getInicioDoMes(data), this.dateService.getFimDoMes(data)).subscribe({
        next: (res) => {
          this.valorFaturamentoMesAnterior = res[0].valor;
        },
        complete:()=>{
          this.calcularxY1Faturamento();
        }
      });
  }

  private consultaEntradaDoMes() {
    this.entradaService.consultarEntradaMensal(this.dateService.getInicioDoMes(this.dataRecebida), this.dataRecebida).subscribe({
      next: (res) => {
        this.entradasDoMes = res;
        this.valorEntrada = this.entradasDoMes[0].valor;
      },
      complete:()=>{
        this.consultaEntradaDoMesAnoPassado();
      }
    });
  }

  private consultaEntradaDoMesAnoPassado() {
    let data = moment(this.dataRecebida).subtract(1, 'year');
    this.entradaService.consultarEntradaMensal(this.dateService.getInicioDoMes(data), this.dateService.getFimDoMes(data)).subscribe({
      next: (res) => {
        this.valorEntradaMesAnterior = res[0].valor;
      },
      complete:()=>{
        this.calcularxY1Entada();
      }
    });
  }

  private consultarCarteiraCliente() {
    this.valorCarteira = 0;
    this.clienteService.consultarCarteiraPorCliente(this.modeloConsulta.getInstance(
      this.dataRecebida,
      this.dataRecebida,
      '',
      '',
      0
    )).subscribe({
      next: (res) => {
        res.objeto.forEach((e: any) => {
          this.valorCarteira += e.valor;
        });
      }
    });
  }

  private calcularxY1Entada(){
      let v1 = this.valorEntrada;
      let v2 = this.valorEntradaMesAnterior;
      this.xy1Entrada =  ((v1-v2)/v1)*100;
  }

  private calcularxY1Faturamento(){
    let v1 = this.valorFaturamento;
    let v2 = this.valorFaturamentoMesAnterior;
    console.log(v1);
    console.log(v2);
    this.xy1Faturamento =  ((v1-v2)/v1)*100;
}


}
