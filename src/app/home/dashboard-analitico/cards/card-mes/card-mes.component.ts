import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { ParametrosMeta } from 'src/app/models/parametros-meta';
import { FaturamentoService } from 'src/app/services/faturamento.service';
import { MetaProjetadaService } from 'src/app/services/meta-projetada.service';
import { ParametrosMetaService } from 'src/app/services/parametros-meta.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario';

@Component({
  selector: 'app-card-mes',
  templateUrl: './card-mes.component.html',
  styleUrls: ['./card-mes.component.css']
})
export class CardMesComponent implements OnInit {

  bgColor: string = "";
  valorFaturamentoMes: number = 0;
  valorGapMes: number = 0;
  colorMes: string = "bg-danger";
  colorBorderMes: string = "border-danger";
  valorMetaProjetada: number = 0;
  valorMetaProjetadaPorcetagem: number = 0;
  valorCarteira: number = 0;
  dataAtual: any = moment().format('yyyy-MM-DD');
  rote: string = "";
  parametrosMeta: ParametrosMeta;
  snackBarErro = 'my-snack-bar-erro';
  snackBarSucesso = 'my-snack-bar-sucesso';
  arrowGap: any;
  usuario: Usuario;
  percentualFaturamento: any = 0;

  constructor(
    private metaProjetadaService: MetaProjetadaService,
    private parametrosMetaService: ParametrosMetaService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {
    this.parametrosMeta = new ParametrosMeta();
    this.usuario = new Usuario();
  }

  ngOnInit(): void {
    // UsuarioService.usuarioAutenticado.subscribe((res) => {
    //   this.usuario = res;
    //   this.consultarParametrosMeta();
    //   this.receberDataAtualizada();
    //   this.receberValorFaturamentoDoMes();
    //   this.recebeValorCarteira();
    // });
  }

  consultaMetaProjetada() {
      this.metaProjetadaService.consultarMetaProjetada(this.dataAtual).subscribe({
        next: (res) => {
          this.valorMetaProjetada = res.valor;
          this.calcularPorcetagemMetaProjetada();
        }, complete: () => {
          if (this.valorMetaProjetada >= this.parametrosMeta.valorMetaMensal) {
            this.colorBorderMes = "border-success";
            this.colorMes = "bg-success";
          } else if (this.valorMetaProjetada <= this.parametrosMeta.valorMetaMensal) {
            this.colorBorderMes = "border-danger";
            this.colorMes = "bg-danger";
          }
        }
      });
  }

  public exibirDetalhesDoFaturamentoMensal() {
      this.router.navigate([`faturamento-mensal/${this.dataAtual}`]);
  }

  private calculaPercentualDeFaturamentoDoMes() {
    this.percentualFaturamento = ((this.valorFaturamentoMes / this.parametrosMeta.valorMetaMensal) * 100);
  }

  private calculaGapMes() {
    this.percentualFaturamento = 0;
    this.calculaPercentualDeFaturamentoDoMes();
    this.valorGapMes = (this.parametrosMeta.valorMetaMensal - this.valorFaturamentoMes);
    if (this.valorGapMes < 0) {
      this.valorGapMes *= -1;
      this.arrowGap = "text-success fa-angle-double-up";
    } else {
      this.arrowGap = "text-danger fa-angle-double-down";
    }
  }

  private receberValorFaturamentoDoMes() {
    FaturamentoService.emitirValorFaturamentoMes.subscribe(res => {
      this.valorFaturamentoMes = res;
      if (this.valorFaturamentoMes == 0) {
        this.valorFaturamentoMes = 0.000001;
      }
    });
  }

  private recebeValorCarteira() {
    FaturamentoService.emitirValorCarteira.subscribe(res => {
      this.valorCarteira = res;
      if (this.valorCarteira == 0) {
        this.valorCarteira = 0.000001;
      }
    });
  }

  openSnackBar(mensagem: string, tipo: string) {
    this.snackBar.open(mensagem, 'X', {
      panelClass: [tipo],
      duration: 6000,
      horizontalPosition: "right",
      verticalPosition: "top",
    });
  }

  private calcularPorcetagemMetaProjetada() {
    this.valorMetaProjetadaPorcetagem = ((this.valorMetaProjetada * 100) / this.parametrosMeta.valorMetaMensal);
  }

  /**
   * Consulta de parametro de meta do mês
   * 
   * Faturamento para dias úteis
   * Orçamento
   * Faturamento por sábado
   */
  private consultarParametrosMeta() {
    this.parametrosMetaService.consultarParamentrosMeta(this.inicioMes).subscribe({
      next: (res) => {
        this.parametrosMeta = res;
      }, complete: () => {
        this.consultaMetaProjetada();
        setTimeout(() => {
          this.graficoAtribuirPercentualMes();
          this.calculaGapMes();
        }, 500);
      }
    });
  }

  /**
   * Retorno a data de início do mês com base na data recebida
   */
  private get inicioMes() {
    return `${moment(this.dataAtual).format('yyyy')}-${moment(this.dataAtual).format('MM')}-01`;
  }

  /**
   * Com base no valor do faturamento o sistema atribui um percentual de cor ao gráfico
   */
  public graficoAtribuirPercentualMes() {
    let i = 45;
    let valorPercentual = (180 / this.parametrosMeta.valorMetaMensal);
    i += (valorPercentual * this.valorFaturamentoMes);
    if (i <= 134) {
      this.bgColor = 'bg-color-chart-30';
    }
    if (i >= 135) {
      this.bgColor = 'bg-color-chart-50';
    }
    if (i > 222) {
      this.bgColor = 'bg-color-chart-70';
    }
    if (i > 225) {
      i = 225;
    }
    this.rote = `rotate:${i}deg; transition:4s`;
  }

  /**
   * Sempre que houver um alteração na data da consulta o sistema executará 
   * estes dados para atualizar as informações do sistema
   */
  private receberDataAtualizada() {
    FaturamentoService.emitirData.subscribe(res => {
      this.dataAtual = res;
      this.consultarParametrosMeta();
      this.consultaMetaProjetada();
      this.receberValorFaturamentoDoMes();
      this.recebeValorCarteira();
    });
  }
}
