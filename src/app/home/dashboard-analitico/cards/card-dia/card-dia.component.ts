import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ParametrosMeta } from 'src/app/models/parametros-meta';
import { Usuario } from 'src/app/models/usuario';
import { ClienteService } from 'src/app/services/cliente.service';
import { FaturamentoService } from 'src/app/services/faturamento.service';
import { MetaDiariaService } from 'src/app/services/meta-diaria.service';
import { ParametrosMetaService } from 'src/app/services/parametros-meta.service';

@Component({
  selector: 'app-card-dia',
  templateUrl: './card-dia.component.html',
  styleUrls: ['./card-dia.component.css']
})
export class CardDiaComponent implements OnInit {

  bgColorD: string = "";
  valorDiario: number = 0;
  dataAtual: any = moment().format('yyyy-MM-DD');
  valorFaturamentoDia: number = 0;
  valorMetaDoDia: number = 0;
  valorGapDia: number = 0;
  arrowGap = "";
  valorEntrada: number = 0;
  roteD: string = "";
  valorFaturamentoMes: number = 0;
  valorMetaDoMes: number = 0;
  parametrosMeta: ParametrosMeta;
  usuario: Usuario;
  percentualFaturamento: any = 0;


  constructor(
    private metaDiariaService: MetaDiariaService,
    private parametrosMetaService: ParametrosMetaService,
    private router: Router,
  ) {
    this.parametrosMeta = new ParametrosMeta();
    this.usuario = new Usuario();
  }

  ngOnInit(): void {
    // UsuarioService.usuarioAutenticado.subscribe((res) => {
    //   this.usuario = res;
    //   this.receberDataAtualizada();
    //   this.receberValorFaturamentoDia();
    //   this.receberValorEntrada();
    //   this.consultaMetaDiaria();
    //   this.consultarParametrosMeta();
    // });
  }

  public consultarFaturamentoPorCliente() {
    this.router.navigate([`/faturamento-diario/${this.dataAtual}`]);
  }

  public consultarEntradasPorCliente() {
    this.router.navigate([`${'/entrada'}/${this.dataAtual}`]);
    window.scrollTo(0, 0);
  }

  public consultarParametrosMeta() {
    this.parametrosMetaService.consultarParamentrosMeta(this.inicioMes).subscribe({
      next: (res) => {
        this.parametrosMeta = res;
      }
    });
  }

  private get inicioMes() {
    return `${moment(this.dataAtual).format('yyyy')}-${moment(this.dataAtual).format('MM')}-01`
  }

  private receberValorFaturamentoDia() {
    FaturamentoService.emitirValorFaturamentoDia.subscribe(res => {
      this.valorFaturamentoDia = res;
      if (this.valorFaturamentoDia == 0) {
        this.valorFaturamentoDia = 0.0000001;
      }
      this.calculaGapDia();
    });
  }

  private calcularPercentualDeFaturamentoDoDia() {
    this.percentualFaturamento = ((this.valorFaturamentoDia / this.valorMetaDoDia) * 100);
  }

  private calculaGapDia() {
    this.calcularPercentualDeFaturamentoDoDia();
    if (this.valorFaturamentoMes < this.parametrosMeta.valorMetaMensal || this.valorFaturamentoMes > this.valorMetaDoMes) {
      this.valorGapDia = ((this.valorMetaDoDia - this.valorFaturamentoDia) * -1);
      this.arrowGap = "text-success fa-angle-double-up";
      if (this.valorGapDia < 0) {
        this.valorGapDia *= -1;
        this.arrowGap = "text-danger fa-angle-double-down";
      }
      setTimeout(() => {
        this.graficoAtribuirPercentualDiario(this.valorFaturamentoDia);
      }, 500);
    }
  }

  public graficoAtribuirPercentualDiario(valorDiario: any) {
    let i = 45;
    //Utilizado para classe Css de modificação da cor do gráfico
    let valorPercentual = (180 / this.valorMetaDoDia);
    if (valorPercentual == Infinity) {
      valorPercentual = 0;
      if (valorPercentual < 0) {
        valorPercentual *= -1;
      }
    }

    //Define o percetual do grafico
    i += (valorPercentual * valorDiario);
    //Aplica cor ao gráfico conforme seu percentual
    if (i <= 134) {
      this.bgColorD = 'bg-color-chart-30';
    }
    if (i >= 135) {
      this.bgColorD = 'bg-color-chart-50';
    }
    if (i > 222) {
      this.bgColorD = 'bg-color-chart-70';
    }
    if (i > 225) {
      i = 225;
    }
    this.roteD = `rotate:${i}deg; transition:4s`;
  }

  consultaMetaDiaria() {
    this.metaDiariaService.consultarMetaDoDia(this.dataAtual).subscribe({
      next: (res) => {
        this.valorMetaDoDia = res.valor;
        if (this.valorMetaDoDia == 0) {
          this.valorMetaDoDia = 0.000001;
        }
      }, complete: () => {
        this.calculaGapDia();
      }
    });
  }


  private receberValorEntrada() {
    ClienteService.emitirValorEntradas.subscribe(res => {
      if (res == 0) {
        this.valorEntrada = 0.0000000001;
      } else {
        this.valorEntrada = res;
      }
    });
  }

  private receberDataAtualizada() {
    FaturamentoService.emitirData.subscribe(res => {
      this.dataAtual = res;
      this.consultaMetaDiaria();
    })
  }
}
