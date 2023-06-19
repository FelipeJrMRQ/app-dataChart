import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import { LinhaDeProducao } from 'src/app/models/linha-de-producao';
import { Turno } from 'src/app/models/turno';
import { ImageService } from 'src/app/services/image.service';
import { LinhaDeProducaoService } from 'src/app/services/linha-de-producao.service';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';
import { ProgramacaoService } from 'src/app/services/programacao.service';
import { TurnoService } from 'src/app/services/turno.service';

@Component({
  selector: 'app-dlg-detalhe-item',
  templateUrl: './dlg-detalhe-item.component.html',
  styleUrls: ['./dlg-detalhe-item.component.css']
})
export class DlgDetalheItemComponent implements OnInit {

  linhas: LinhaDeProducao[];
  turnos: Turno[];
  imagem: any;
  idTurno: number | undefined;
  idLinhaDeProducao: number| undefined;
  prioridade: never | undefined;
  snackBarErro = 'my-snack-bar-erro';
  snackBarSucesso = 'my-snack-bar-sucesso';
  public urlImagem: any;
  quantidade: any;
  sequencia: any = undefined;
  nomeTurno: any;
  exibirSequencia: boolean = true;
  btnAlterar: any  = false;
  btnExcluir: any = false;
  btnAlterarSequeciaItem: any = false;


  constructor(
    private imageService: ImageService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DlgDetalheItemComponent>,
    private linhaService: LinhaDeProducaoService,
    private turnoService: TurnoService,
    private programacaoService: ProgramacaoService,
    private snackBar: MatSnackBar,
    private service: ImageService,
    private controleExibicaoService: ControleExibicaoService,
    private sanitizer: DomSanitizer,
  ) {
    this.linhas = [];
    this.turnos = [];
  }

  ngOnInit(): void {
    this.verificaPermissoesDeAcesso();
  }

  private verificaPermissoesDeAcesso() {
    forkJoin({
      alterarSequenciaItem: this.controleExibicaoService.verificaPermissaoDeAcesso('alterar_sequencia_item','itens-programados'),
      excluir: this.controleExibicaoService.verificaPermissaoDeAcesso('excluir_item_setup','itens-programados'),
      alterar: this.controleExibicaoService.verificaPermissaoDeAcesso('alterar_item_setup','itens-programados'),
    }).subscribe(({alterarSequenciaItem, alterar, excluir}) => {
       this.btnAlterar = alterar;
       this.btnAlterarSequeciaItem = alterarSequenciaItem;
       this.btnExcluir = excluir; 
       this.quantidade = this.data.qtdeProgramada;
       this.sequencia = this.data.sequencia;
       this.consultarImagem();
       this.consultarLinhasDeProducao();
       this.consultarTurnoDeTrabalho();
       this.controleExibicaoService.registrarLog(`VISUALIZOU DETALHES DO ITEM PROGRAMADO: [${this.data.nomeProduto}]`);
    });
   
  }

  public consultarImagem() {
    this.service.downloadImg(`${this.data.cdProduto}`).subscribe({
      next: (res) => {
        this.imagem = res;
        this.urlImagem = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.imagem));
      }
    });
  }

  // public iniciarProducao(){
  //   this.data.turno.id = this.idTurno;
  //   this.data.linhaDeProducao.id = this.idLinhaDeProducao;
  //   this.data.prioridade = this.prioridade;
  //   this.data.status = "INICIADO";
  //   this.programacaoService.salvar(this.data).subscribe({
  //     next:()=>{
  //       this.openSnackBar("Programação alterada com sucesso!", this.snackBarSucesso);
  //       this.controleExibicaoService.registrarLog(`INICIOU A PROGRAMAÇÃO DO ITEM: [${this.data.nomeProduto}]`);
  //       this.dialogRef.close();
  //     },
  //     error:()=>{
  //       this.openSnackBar("Falha ao alterar programação", this.snackBarErro);
  //     }
  //   });
  // }

  // public concluirProducao(){
  //   this.data.turno.id = this.idTurno;
  //   this.data.linhaDeProducao.id = this.idLinhaDeProducao;
  //   this.data.prioridade = this.prioridade;
  //   this.data.status = "CONCLUIDO";
  //   this.programacaoService.salvar(this.data).subscribe({
  //     next:()=>{
  //       this.openSnackBar("Programação alterada com sucesso!", this.snackBarSucesso);
  //       this.controleExibicaoService.registrarLog(`CONCLUIU A PROGRAMAÇÃO DO ITEM: [${this.data.nomeProduto}]`);
  //       this.dialogRef.close();
  //     },
  //     error:()=>{
  //       this.openSnackBar("Falha ao alterar programação", this.snackBarErro);
  //     }
  //   });
  // }

  public excluirProgramacao(id: number) {
    this.programacaoService.excluirProgramacao(id).subscribe({
      next: (res) => {
        this.dialogRef.close(this.data);
        this.controleExibicaoService.registrarLog(`EXCLUIU A PROGRAMAÇÃO DO ITEM: [${this.data.nomeProduto}]`);
        this.openSnackBar("Item excluído com sucesso!", this.snackBarSucesso);
      },
      error: (e) => {
        console.log(e);
      }
    });
  }

 public alterarSequencia(){
    this.dialogRef.close({
      data: {'retorno': 'alterar_sequencia', 'item': this.data, 'nova_sequencia': this.sequencia}
    })
  }

  public fecharDialogo(retorno: boolean) {
    let turno = this.turnos.find(t => t.id == this.idTurno);
    this.dialogRef.close({
      data: { "retorno": retorno, "item": this.data, "sequencia": this.sequencia, 'turno': turno }
    });
  }


  public consultarLinhasDeProducao() {
    this.linhaService.consultar().subscribe({
      next: (res) => {
        this.linhas = res;
      }, error: (e) => {
        console.log(e);
      }
    });
  }

  /**
   * Se houver alteração de linha ou turno de trabalho a sequencia não poderá ser modificada
   * manualmente o sistema colocará o item na última posição de acordo com a sequência encontrada
   * no banco de dados
   */
  public verificaAlteracaoLinhaTurnoPrioridade(){
    if(this.data.linhaDeProducao.id != this.idLinhaDeProducao || this.data.turno.id != this.idTurno || this.data.prioridade != this.prioridade){
      this.exibirSequencia = false;
    }else{
      this.exibirSequencia = true;
    }
  }


  public alterarProgramacao() {
    if (this.data.qtdeProgramada <= 0) {
      this.openSnackBar('A quantidade programada não pode ser menor ou igual a zero!', this.snackBarErro);
      return;
    } else if (this.data.qtdeProgramada > this.quantidade) {
      this.openSnackBar('A quantidade programada não pode ser maior que o saldo!', this.snackBarErro);
      return;
    }

    if (this.idTurno != this.data.turno.id || this.idLinhaDeProducao != this.data.linhaDeProducao.id || this.data.observacao == "" || this.data.observacao) {
      this.dialogRef.close({
        data: {'retorno': 'alterar_linha_turno' ,'item': this.data, 'turno': this.idTurno, 'linhaDeProducao': this.idLinhaDeProducao}
      });
    }

    if(this.prioridade != this.data.prioridade){
      this.data.prioridade = this.prioridade;
      this.dialogRef.close({
        data: {'retorno': 'alterar_prioridade','item': this.data}
      });
    }
  }

  public consultarTurnoDeTrabalho() {
    this.turnoService.consultar().subscribe({
      next: (res) => {
        this.turnos = res;
      }, error: (e) => {
        console.log(e);
      }, complete: () => {
        this.idTurno = this.data.turno.id;
        this.idLinhaDeProducao = this.data.linhaDeProducao.id;
        this.prioridade = this.data.prioridade;
      }
    });
  }

  openSnackBar(mensagem: string, tipo: string) {
    this.snackBar.open(mensagem, "X", {
      duration: 6000,
      panelClass: [tipo],
      horizontalPosition: "right",
      verticalPosition: "top",
    });
  }
}
