import { ExcelService } from './../../../../services/excel.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { EntradaService } from 'src/app/services/entrada.service';
import { ModeloConsulta } from 'src/app/models/modelo-consulta';
import { EntradaCliente } from 'src/app/models/entrada/entrada-cliente';
import * as bootstrap from 'bootstrap';
import { forkJoin } from 'rxjs';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';

@Component({
  selector: 'app-entrada-beneficiamento-cliente',
  templateUrl: './entrada-beneficiamento-cliente.component.html',
  styleUrls: ['./entrada-beneficiamento-cliente.component.css']
})
export class EntradaBeneficiamentoClienteComponent implements OnInit {

  dataRecebida: any;
  cdBeneficiamento: any;
  nomeBeneficiamento: any
  modeloConsulta: ModeloConsulta;
  entradas: EntradaCliente[];
  valor: number = 0;
  pagina: number = 1;
  itensPagina: number = 20;
  toolTip = [];
  exportarDados: boolean = false;
  private nomeTela = "entrada";

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private entradaService: EntradaService,
    private renderer: Renderer2,
    private exporta: ExcelService,
    private controleExibicaoService: ControleExibicaoService,
  ) {
    this.modeloConsulta = new ModeloConsulta();
    this.entradas = [];
  }

  ngOnInit(): void {
    this.controleExibicaoService.registrarLog('ACESSOU A TELA DE DETALHES POR CLIENTE EM ENTRADA [ENTRADA -> BENEFICIAMENTO]')
    this.renderer.selectRootElement(this.toolTip = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]')));
    var tootipList = this.toolTip.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    });

    this.activatedRoute.params.subscribe((param: any) => {
      this.dataRecebida = param.data
      this.cdBeneficiamento = param.cdBeneficiamento
      this.nomeBeneficiamento = param.nomeBeneficiamento
      this.verificaPermissaoDeAcesso();
    });
   
  }

  private verificaPermissaoDeAcesso() {
    forkJoin({
      s1: this.controleExibicaoService.verificaPermissaoDeAcesso('exportar_dados', this.nomeTela),
    }).subscribe({
      next:({s1})=>{
        this.exportarDados = s1;
      },
      complete:()=>{
        this.consultarClientePorBenficiamento();
      },
      error:(e)=>{
        console.log(e);
      }
    });
  }

  public navegar(cdCliente: any, nomeCliente: any) {
    this.router.navigate([`entrada/beneficiamento/produto/${this.cdBeneficiamento}/${cdCliente}/${this.dataRecebida}/${nomeCliente}`])
  }

  public gerarArquivo() {
    this.exporta.geradorExcell(this.entradas, "Entradas-de-cliente-por-beneficiamento");
  }

  public consultarClientePorBenficiamento() {
    this.valor = 0;
    this.entradaService.consultaEntradaDeClientePorBeneficiamento(
      this.modeloConsulta.getInstance(this.dataRecebida, this.dataRecebida, '', '', this.cdBeneficiamento)
    ).subscribe({
      next: (res) => {
        this.entradas = res.objeto;
        this.entradas.forEach((c) => {
          this.valor += c.valor;
        })
      }
    })
  }



  public voltar() {
    this.router.navigate([`entrada/cliente/${this.dataRecebida}`])
  }

}
