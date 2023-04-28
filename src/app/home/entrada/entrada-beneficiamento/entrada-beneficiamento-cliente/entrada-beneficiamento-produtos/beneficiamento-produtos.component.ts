import { ExcelService } from './../../../../../services/excel.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { EntradaService } from 'src/app/services/entrada.service';
import { EntradaProduto } from 'src/app/models/entrada/entrada-produto';
import * as bootstrap from 'bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { DlgFatMensalProdutoComponent } from 'src/app/shared/dialog/dlg-fat-mensal-produto/dlg-fat-mensal-produto.component';
import { forkJoin } from 'rxjs';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';

@Component({
  selector: 'app-beneficiamento-produtos',
  templateUrl: './beneficiamento-produtos.component.html',
  styleUrls: ['./beneficiamento-produtos.component.css']
})
export class BeneficiamentoProdutosComponent implements OnInit {

  cdBeneficiamento:any;
  cdCliente: any;
  data:any;
  nomeCliente: any;
  nomeBeneficiamento:any;
  entradas: EntradaProduto[];
  totalQtde: number = 0;
  totalArea: number = 0;
  totalProdutos: number =0;
  pagina: number =1;
  itensPagina: number = 20;
  dialogRef:any;
  exportarDados: boolean = false;
  private visualizarDetalheProduto: boolean = false;
  public toolTip = [];
  private nomeTela = "entrada";

  constructor(
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private entradaService: EntradaService,
    private renderer:Renderer2,
    private exportar:ExcelService,
    private dialog: MatDialog,
    private controleExibicaoService: ControleExibicaoService,
  ) { 
    this.entradas = [];
  }

  ngOnInit(): void {
    this.controleExibicaoService.registrarLog('ACESSOU A DETALHES DO BENEFICIAMENTO [ENTRADA -> BENEFICIAMENTO -> CLIENTE]  ');
    this.renderer.selectRootElement(this.toolTip = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]')));
    var toolTipList = this.toolTip.map((e)=>{
      return new bootstrap.Tooltip(e);
    });
    this.activatedRoute.params.subscribe((param:any)=>{
      this.cdBeneficiamento = param.cdBeneficiamento;
      this.data = param.data;
      this.nomeCliente = param.nomeCliente;
      this.cdCliente = param.cdCliente;
      this.verificaPermissaoDeAcesso();
    });
  }
  
  private verificaPermissaoDeAcesso(){
    forkJoin({
      s1: this.controleExibicaoService.verificaPermissaoDeAcesso('exportar_dados', this.nomeTela),
      s2: this.controleExibicaoService.verificaPermissaoDeAcesso('visualizar_detalhes_produto', this.nomeTela),
    }).subscribe({
      next:({s1, s2})=>{
        this.exportarDados = s1;
        this.visualizarDetalheProduto = s2;
      },
      complete:()=>{
        this.consultarEntradasPorBeneficiamentoECliente();     
      },
      error:(e)=>{
        console.log(e);
      }
    })
  }
    
  public voltar(){
    this.router.navigate([`entrada/beneficiamento/cliente/${this.cdBeneficiamento}/${this.data}/${this.nomeBeneficiamento}`])
  }

public gerarArquivo(){
  this.exportar.geradorExcell(this.entradas,"Entrada de produto por beneficiamento e cliente")
}

  public consultarEntradasPorBeneficiamentoECliente(){
    this.totalProdutos = 0;
    this.entradaService.consultaEntradasPorBeneficiamentoECliente(this.cdBeneficiamento, this.cdCliente, this.data).subscribe({
      next:(res)=>{
        this.entradas = res.objeto;
        this.somaValores(this.entradas);
      }
    });
  }

  public somaValores(entradas: EntradaProduto[]){
    this.entradas.forEach((e)=>{
      this.totalProdutos += e.valorTotal;
      this.totalArea += e.area;
      this.totalQtde += e.quantidade;
      this.nomeBeneficiamento = e.nomeBeneficiamento;
    });
  }
  public openDetalhesProduto(produto: EntradaProduto) {
   if(this.visualizarDetalheProduto){
    this.dialogRef = this.dialog.open(DlgFatMensalProdutoComponent, {
      data: produto,
      maxHeight: '90vh',
    });
   }
  }

}
