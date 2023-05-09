import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
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
  imagem : any;
  idTurno: any;
  idLinhaDeProducao: any;
  prioridade: any;
  snackBarErro = 'my-snack-bar-erro';
  snackBarSucesso = 'my-snack-bar-sucesso';
  public urlImagem: any;
  quantidade: any;


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
    //Captura a quantidade programada do item antes de qualquer alteração
    this.quantidade = this.data.qtdeProgramada;
    this.consultarImagem();
    this.consultarLinhasDeProducao();
    this.consultarTurnoDeTrabalho();
    this.controleExibicaoService.registrarLog(`VISUALIZOU DETALHES DO ITEM PROGRAMADO: [${this.data.nomeProduto}]`);
  }

  public consultarImagem() {
    this.service.downloadImg(`${this.data.cdProduto}`).subscribe({
      next:(res)=>{
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

  public excluirProgramacao(id: number){
    this.programacaoService.excluirProgramacao(id).subscribe({
      next:(res)=>{
        this.dialogRef.close(this.data);
        this.controleExibicaoService.registrarLog(`EXCLUIU A PROGRAMAÇÃO DO ITEM: [${this.data.nomeProduto}]`);
        this.openSnackBar("Item excluído com sucesso!", this.snackBarSucesso);
      },
      error:(e)=>{
        console.log(e);
      }
    });
  }

  public fecharDialogo(retorno: boolean){
    this.dialogRef.close({
      data: retorno
    });
  }

  public consultarLinhasDeProducao(){
    this.linhaService.consultar().subscribe({
      next:(res)=>{
        this.linhas = res;
      }, error:(e)=>{
        console.log(e);
      }
    });
}

public alterarProgramacao(){
  if(this.data.qtdeProgramada <= 0 ){
    this.openSnackBar('A quantidade programada não pode ser menor ou igual a zero!', this.snackBarErro);
    return;
  }else if(this.data.qtdeProgramada > this.quantidade){
    this.openSnackBar('A quantidade programada não pode ser maior que o saldo!', this.snackBarErro);
    return;
  }
  this.data.valorPrevisto = ((this.data.valorPrevisto/this.quantidade)*this.data.qtdeProgramada);
  this.data.turno.id = this.idTurno;
  this.data.linhaDeProducao.id = this.idLinhaDeProducao;
  this.data.prioridade = this.prioridade;
  this.programacaoService.salvar(this.data).subscribe({
    next:()=>{
      this.openSnackBar("Programação alterada com sucesso!", this.snackBarSucesso);
      this.controleExibicaoService.registrarLog(`ALTEROU A PROGRAMAÇÃO DO ITEM: [${this.data.nomeProduto}]`);
      this.fecharDialogo(true);
    },
    error:()=>{
      this.openSnackBar("Falha ao alterar programação", this.snackBarErro);
    }
  });
}

public consultarTurnoDeTrabalho(){
  this.turnoService.consultar().subscribe({
      next:(res)=>{
        this.turnos = res;
      },error:(e)=>{
        console.log(e);
      },complete:()=>{
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
