import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { CarteiraCliente } from 'src/app/models/carteira/carteira-cliente';
import { ModeloConsulta } from 'src/app/models/modelo-consulta';
import { ClienteService } from 'src/app/services/cliente.service';
import { EntradaService } from 'src/app/services/entrada.service';
import { FaturamentoService } from 'src/app/services/faturamento.service';
import { MetaProjetadaService } from 'src/app/services/meta-projetada.service';
import { forkJoin } from 'rxjs';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';

@Component({
  selector: 'app-card-outros',
  templateUrl: './card-outros.component.html',
  styleUrls: ['./card-outros.component.css']
})
export class CardOutrosComponent implements OnInit {

  valorEmCarteira: any = 0;
  valorEntradasDoDia: any = 0;
  valorMetaProjetada: any = 0;
  dataRecebida: any = moment().format('yyyy-MM-DD');
  modeloDeConsulta: ModeloConsulta;
  carteiraCliente: CarteiraCliente[] = [];
  exibirValorCarteira: boolean = false;
  exibirValorEntradas: boolean = false;
  exibirValorMetaProjetada: boolean = false;
  private nomeTela = "dashboard-sintetico";

  constructor(
    private metaProjetadaService: MetaProjetadaService,
    private clienteService: ClienteService,
    private entradaService: EntradaService,
    private router: Router,
    private controleExibicaoService: ControleExibicaoService,
  ) {
    this.modeloDeConsulta = new ModeloConsulta();
  }

  ngOnInit(): void {
    this.receberDataEscolhida();
    this.verificaPermissoesDeAcesso();
  }

  private verificaPermissoesDeAcesso() {
    forkJoin({
      s1: this.controleExibicaoService.verificaPermissaoDeAcesso('valor_carteira', this.nomeTela),
      s2: this.controleExibicaoService.verificaPermissaoDeAcesso('entradas_dia', this.nomeTela),
      s3: this.controleExibicaoService.verificaPermissaoDeAcesso('meta_projetada', this.nomeTela),
    }).subscribe(({ s1, s2, s3 }) => {
      this.exibirValorCarteira = s1;
      this.exibirValorEntradas = s2;
      this.exibirValorMetaProjetada = s3;
      this.consultaMetaProjetada();
    })
  }

  public receberDataEscolhida() {
    FaturamentoService.emitirData.subscribe((res: any) => {
      this.dataRecebida = res;
      this.verificaPermissoesDeAcesso();
    });
  }

  public consultarCarteira() {
    this.router.navigate(['dashboard-analitico']);
  }

  public consultarEntradasDoDia() {
    this.router.navigate([`${'/entrada/cliente'}/${this.dataRecebida}`]);
    window.scrollTo(0, 0);
  }

  public consultaMetaProjetada() {
    this.metaProjetadaService.consultarMetaProjetada(this.dataRecebida).subscribe({
      next: (res) => {
        if (this.exibirValorMetaProjetada) {
          this.valorMetaProjetada = res.valor;
        }
      },
      complete: () => {
        this.consultarValorCarteira();
      }
    });
  }

  public consultarValorCarteira() {
    this.clienteService.consultarCarteiraPorCliente(
      this.modeloDeConsulta.getInstance(
        this.dataRecebida,
        this.dataRecebida,
        '',
        '',
        undefined
      )
    ).subscribe({
      next: (res) => {
        if (this.exibirValorCarteira) {
          this.carteiraCliente = res.objeto;
        }
      },
      error: (e) => {

      },
      complete: () => {
        this.valorEmCarteira = 0;
        this.carteiraCliente.forEach((res) => {
          if(res != undefined){
            this.valorEmCarteira += res.valor;
          }
        });
        this.consultarValorEntrada();
      }
    });
  }

  public consultarValorEntrada() {
    this.entradaService.consultarEntradasPorPeriodo(
      this.modeloDeConsulta.getInstance(
        this.dataRecebida,
        this.dataRecebida,
        '',
        '',
        undefined
      )
    ).subscribe({
      next: (res) => {
        this.valorEntradasDoDia = 0;
        if (this.exibirValorEntradas) {
          if(res.objeto.length > 0){
            this.valorEntradasDoDia = res.objeto[0].valor;
          }
        }
      }
    })
  }

}
