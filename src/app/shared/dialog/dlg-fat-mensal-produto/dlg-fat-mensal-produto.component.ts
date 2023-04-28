import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { forkJoin } from 'rxjs';
import { ImageService } from 'src/app/services/image.service';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';
import { ProdutoService } from 'src/app/services/produto.service';

@Component({
  selector: 'app-dlg-fat-mensal-produto',
  templateUrl: './dlg-fat-mensal-produto.component.html',
  styleUrls: ['./dlg-fat-mensal-produto.component.css']
})
export class DlgFatMensalProdutoComponent implements OnInit {

  private response: HttpErrorResponse | undefined;
  public imagemProduto: Blob;
  public visualizarPreco: boolean = false;
  private nomeTela = 'produtos'
  public urlImagem: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DlgFatMensalProdutoComponent>,
    public service: ImageService,
    private produtoService: ProdutoService,
    private controleExibicaoService: ControleExibicaoService,
    private sanitizer: DomSanitizer,
  ) {
    this.imagemProduto = new Blob();
  }

  ngOnInit(): void {
    this.iniciarNoTopo();
    this.verificaPermissaoDeAcesso();
  }

  private verificaPermissaoDeAcesso() {
    forkJoin({
      s1: this.controleExibicaoService.verificaPermissaoDeAcesso('visualizar_preco', this.nomeTela)
    }).subscribe({
      next: ({ s1 }) => {
        this.visualizarPreco = s1;
      },
      complete:()=>{
        this.consultarImagem();
        this.consultaPrecoProduto();
        if (this.data.valorTotal) {
          this.data.valor = this.data.valorTotal;
        }
      }
    })
  }




  public iniciarNoTopo() {
    window.scrollTo(0, 0);
    this.consultaPrecoProduto();
  }

  public consultaPrecoProduto(){
     if(this.visualizarPreco){
      this.produtoService.consultarPrecoProduto(this.data.cdProduto).subscribe({
        next:(res)=>{
          this.data.valorUnitario = res.objeto;
        }
      });
     }
  }

  public fechar() {
    this.dialogRef.close();
  }

  public consultarImagem() {
   this.service.downloadImg(`${this.data.cdProduto}`).subscribe({
    next:(res)=>{
      this.imagemProduto = res;
      this.urlImagem = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.imagemProduto));
    }
   });
  }

}
