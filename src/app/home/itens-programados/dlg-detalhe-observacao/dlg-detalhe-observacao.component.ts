import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { Motivo } from 'src/app/models/motivo';
import { ObservacaoProgramacao } from 'src/app/models/observacoes/observacao-programacao';
import { ImageService } from 'src/app/services/image.service';
import { MotivoService } from 'src/app/services/motivo.service';
import { ProgramacaoService } from 'src/app/services/programacao.service';
import { DlgCadastroMotivoComponent } from '../dlg-cadastro-motivo/dlg-cadastro-motivo.component';

@Component({
  selector: 'app-dlg-detalhe-observacao',
  templateUrl: './dlg-detalhe-observacao.component.html',
  styleUrls: ['./dlg-detalhe-observacao.component.css']
})
export class DlgDetalheObservacaoComponent implements OnInit {


  quantidade: number = 0;
  imagem: any
  sequencia: number = 0;
  linkBook: any;
  itens: any = []
  urlImagem: any;

  obsApont: any;
  status: any;
  snackBarErro = 'my-snack-bar-erro';
  snackBarSucesso = 'my-snack-bar-sucesso';
  bloqueado: boolean = false;
  itensObservacoes: ObservacaoProgramacao[] = [];
  exibir: boolean = false;
  motivo: Motivo;
  motivo_descricao: Motivo;
  listaMotivosBloqueio: Motivo[] = [];
  listaMotivosConcluir: Motivo[] = [];
  listaMotivosDesbloqueio: Motivo[] = [];
  messagemBotao: string = "Exibir observação";
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: ImageService,
    private sanitizer: DomSanitizer,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<DlgDetalheObservacaoComponent>,
    private programacao: ProgramacaoService,
    private motivoService: MotivoService,
    private dialog: MatDialog,

  ) {
    this.motivo_descricao = new Motivo();
    this.motivo = new Motivo();
  }

  ngOnInit(): void {
    this.quantidade = this.data.qtdeProgramada;
    this.sequencia = this.data.sequencia;
    this.status = this.data.status;
    this.linkBook = `https://cromart.bitqualy.tech/eng_produto_ftp_produto_integra_sm.php?cod_peca=${this.data.cdProduto}`
    this.itens = this.data;
    this.consultarImagem();
    this.consultarTodosMotivos();
    this.consultarMotivosCadastrados();

  }

  public consultarImagem() {
    this.service.downloadImg(`${this.data.cdProduto}`).subscribe({
      next: (res) => {
        this.imagem = res;
        this.urlImagem = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.imagem));
      }, complete: () => {

      },
    });
  }

  public salvarObservacao() {
    if (this.obsApont != undefined && this.status == "AGUARDANDO") {
      this.bloqueado = true;
      this.data.status = "BLOQUEADO";
      this.dialogRef.close({
        data: { "tipo": "BLOQUEIO", "retorno": this.bloqueado, "motivo": this.motivo, "obsApont": this.obsApont, "id": this.data.id }
      });
    } else if (this.data.status == "PRODUZINDO") {
      this.bloqueado = false;
      this.data.status = "FINALIZADO";
      this.dialogRef.close({
        data: { "tipo": "FINALIZADO", "motivo": this.motivo, "retorno": this.bloqueado, "obsApont": this.obsApont, "id": this.data.id }
      });
    } else {
      this.openSnackBar("Para salvar a alteração os campos tem que esta preenchido", this.snackBarErro);
    }
  }

  public desbloquearItem() {
    if (this.obsApont != undefined) {
      this.bloqueado = false;
      this.data.status = "AGUARDANDO";
      this.dialogRef.close({
        data: { "tipo": "DESBLOQUEIO", "retorno": this.bloqueado, "motivo": this.motivo, "obsApont": this.obsApont, "id": this.data.id }
      });
      this.openSnackBar("Item Desbloqueado", this.snackBarSucesso);
    } else {
      this.openSnackBar("Para salvar a alteração os campos tem que esta preenchido", this.snackBarErro);
    }

  }


  public fecharDialog() {
    this.dialogRef.close({
      data: {}
    });
  }

  public openSnackBar(mensagem: string, tipo: string) {
    this.snackBar.open(mensagem, "X", {
      duration: 6000,
      panelClass: [tipo],
      horizontalPosition: "right",
      verticalPosition: "top",
    });
  }

  public criarMotivoObs() {
    const dlg = this.dialog.open(DlgCadastroMotivoComponent, {
    });
    dlg.afterClosed().subscribe(res => {
      this.consultarMotivosCadastrados();
    });
  }

  public consultarMotivosCadastrados() {
    this.motivoService.consultarMotivos().subscribe(({
      next: (res) => {
        this.listaMotivosConcluir = res.filter((motivo: any) => motivo.tipoMotivo === "CONCLUIDO");
        this.listaMotivosBloqueio = res.filter((motivo: any) => motivo.tipoMotivo === "BLOQUEAR");
        this.listaMotivosDesbloqueio = res.filter((motivo: any) => motivo.tipoMotivo === "DESBLOQUEAR");
      },
      complete: () => {

      }
    }))

  }


  public consultarTodosMotivos() {
    if (this.data.observacoes.length > 0) {
      this.programacao.consultarPorIdProgramacao(this.data.id).subscribe(({
        next: (res) => {
          this.itensObservacoes = res.observacoes
        }, error: (erro) => {

        }
      }))
    }
  }

  public exibirObservacoes() {
    if (this.exibir) {
      this.exibir = false;
      this.messagemBotao = "Exibir observações"
    } else {
      this.exibir = true;
      this.messagemBotao = "Ocultar observaçoes";
    }
  }

}
