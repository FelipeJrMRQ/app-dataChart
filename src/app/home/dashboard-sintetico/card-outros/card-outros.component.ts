import { Component, OnInit, OnDestroy, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import * as bootstrap from 'bootstrap';
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
export class CardOutrosComponent implements OnInit, OnDestroy, AfterViewInit {

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
  private toolTipElements: Element[] = [];
  private tooltips: bootstrap.Tooltip[] = [];


  constructor(
    private metaProjetadaService: MetaProjetadaService,
    private clienteService: ClienteService,
    private entradaService: EntradaService,
    private router: Router,
    private controleExibicaoService: ControleExibicaoService,
    private el: ElementRef
  ) {
    this.modeloDeConsulta = new ModeloConsulta();
  }

  ngOnInit(): void {
    this.receberDataEscolhida();
    this.verificaPermissoesDeAcesso();
  }

  ngAfterViewInit() {
    // Selecione os elementos com o atributo data-bs-toggle="tooltip"
    this.toolTipElements = [].slice.call(this.el.nativeElement.querySelectorAll('[data-bs-toggle="tooltip"]'));

    // Inicialize os tooltips
    this.tooltips = this.toolTipElements.map((tooltipTriggerEl: Element) => {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

  ngOnDestroy(): void{
   // Destrua os tooltips ao sair da página
   this.tooltips.forEach(tooltip => {
    if (tooltip && typeof tooltip.dispose === 'function') {
      tooltip.dispose();
    }
   });
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
