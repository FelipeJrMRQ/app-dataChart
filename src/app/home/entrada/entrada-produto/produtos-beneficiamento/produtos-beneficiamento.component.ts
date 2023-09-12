import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { EntradaService } from 'src/app/services/entrada.service';
import { EntradaProduto } from 'src/app/models/entrada/entrada-produto';
import { MatDialog } from '@angular/material/dialog';
import * as bootstrap from 'bootstrap';
import { DlgFatMensalProdutoComponent } from 'src/app/shared/dialog/dlg-fat-mensal-produto/dlg-fat-mensal-produto.component';
import { forkJoin } from 'rxjs';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';

@Component({
  selector: 'app-produtos-beneficiamento',
  templateUrl: './produtos-beneficiamento.component.html',
  styleUrls: ['./produtos-beneficiamento.component.css']
})
export class ProdutosBeneficiamentoComponent implements OnInit {

  dataRecebida: any;
  cdCliente: any;
  nomeCliente: any;
  cdBeneficiamento: any;
  entradas: EntradaProduto[];
  totalQtde: number = 0;
  totalArea: number = 0;
  totalValor: number = 0;
  pagina: number = 1;
  itensPagina: number = 20;
  dialogRef: any;
  toolTip = [];
  exportarDados: boolean = false;
  private visualizarDetalhesProduto: boolean = false;
  private nomeTela: string = "entrada";

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private entradaService: EntradaService,
    private dialog: MatDialog,
    private renderer: Renderer2,
    private controleExibicaoService: ControleExibicaoService,
  ) {
    this.entradas = [];
  }

  ngOnInit(): void {
    this.controleExibicaoService.registrarLog("ACESSOU A TELA ENTRADA PRODUTO BENEFICIAMENTO", "ENTRADA -> PRODUTO -> BENEFICIAMENTO");
    this.renderer.selectRootElement(this.toolTip = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]')));
    var tootipList = this.toolTip.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    this.verificaPermissaoDeAcesso();
  }

  private verificaPermissaoDeAcesso() {
    forkJoin({
      s1: this.controleExibicaoService.verificaPermissaoDeAcesso('exportar_dados', this.nomeTela),
      s2: this.controleExibicaoService.verificaPermissaoDeAcesso('visualizar_detalhes_produto', this.nomeTela)
    }).subscribe({
      next: ({s1, s2}) => {
        this.exportarDados = s1;
        this.visualizarDetalhesProduto = s2;
      },
      complete:()=>{
        this.activatedRoute.params.subscribe((param: any) => {
          this.dataRecebida = param.data;
          this.cdCliente = param.cdCliente;
          this.cdBeneficiamento = param.cdBeneficiamento;
          this.nomeCliente = param.nomeCliente;
          this.consultarProdutoPorBeneficiamentoECliente();
        });
      },
      error:(e)=>{
        console.log(e);
      }
    })
  }

  public consultarProdutoPorBeneficiamentoECliente() {
    this.entradaService.consultaEntradasPorBeneficiamentoECliente(this.cdBeneficiamento, this.cdCliente, this.dataRecebida).subscribe({
      next: (res) => {
        this.entradas = res.objeto;
        this.somaValores(this.entradas);
      }
    });
  }

  public somaValores(entradas: EntradaProduto[]) {
    entradas.forEach((e) => {
      this.totalQtde += e.quantidade;
      this.totalArea += e.area;
      this.totalValor += e.valorTotal;
    })
  }

  public voltar() {
    this.router.navigate([`entrada/produto/${this.cdCliente}/${this.dataRecebida}/${this.nomeCliente}`]);
  }

  public openDetalhesProduto(produto: EntradaProduto) {
    if (this.visualizarDetalhesProduto) {
      this.dialogRef = this.dialog.open(DlgFatMensalProdutoComponent, {
        data: produto,
        height: '80%',
      });
    }
  }

}
