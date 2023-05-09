import { Component, OnInit,Inject  } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { LinhaDeProducao } from 'src/app/models/linha-de-producao';
import { Programacao } from 'src/app/models/programacao';
import { Turno } from 'src/app/models/turno';
import { ImageService } from 'src/app/services/image.service';
import { LinhaDeProducaoService } from 'src/app/services/linha-de-producao.service';
import { ProgramacaoService } from 'src/app/services/programacao.service';
import { TurnoService } from 'src/app/services/turno.service';
import { DlgCadLinhaComponent } from '../dlg-cad-linha/dlg-cad-linha.component';
import { DlgCadTurnoComponent } from '../dlg-cad-turno/dlg-cad-turno.component';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';
import { DomSanitizer } from '@angular/platform-browser';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-dlg-programacao',
  templateUrl: './dlg-programacao.component.html',
  styleUrls: ['./dlg-programacao.component.css']
})
export class DlgProgramacaoComponent implements OnInit {

  public imagemProduto: Blob;
  public idLinhaDeProducao: any;
  public idTurno: any;
  public linhas: LinhaDeProducao[];
  public turnos: Turno[];
  programacao: Programacao;
  snackBarErro = 'my-snack-bar-erro';
  snackBarSucesso = 'my-snack-bar-sucesso';
  public urlImagem: any;
  public qtdeProgramada: any;

  
  constructor(
    private programacaoService: ProgramacaoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private service: ImageService,
    private linhaService: LinhaDeProducaoService,
    private turnoService: TurnoService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DlgProgramacaoComponent>,
    private controleExibicaoService: ControleExibicaoService,
    private sanitizer: DomSanitizer,
    private usuarioService: UsuarioService,
  ) { 
    this.linhas = [];
    this.turnos = [];
    this.programacao = new Programacao();
    this.imagemProduto = new Blob();
  }

  ngOnInit(): void {
    this.programacao.sequencia = 999;
    this.programacao.prioridade = 2;
    this.idTurno = this.data.turno;
    this.idLinhaDeProducao = this.data.linhaDeProducao;
    this.qtdeProgramada = this.data.qtdeProgramada;
    this.programacao.data = moment(this.data.dataProgramacao).format('yyyy-MM-DD');
    this.alterarValorPrevisto(this.data);
    this.consultarImagem();
    this.consultarLinhasDeProducao();
    this.consultarTurnoDeTrabalho();
    LinhaDeProducaoService.linhaCadastrada.subscribe(()=>{
      this.consultarLinhasDeProducao();
    });
    TurnoService.turnoCadastrado.subscribe(()=>{
      this.consultarTurnoDeTrabalho();
    });
  }

  public salvarProgramacao(){
     this.usuarioService.consultarUsuarioPorEmail(sessionStorage.getItem('user')).subscribe({
      next:(res)=>{
        if(this.qtdeProgramada > this.data.saldoRetorno){
          this.openSnackBar(`A quantidade não pode ser maior que o saldo que é de ${this.data.saldoRetorno}`, this.snackBarErro);
          return;
        }
        if(this.qtdeProgramada <= 0){
          this.openSnackBar(`A quantidade não pode ser menor ou igual a zero!`, this.snackBarErro);
          return;
        }
        this.programacao.dataInclusao = new Date();
        this.programacao.responsavel = res[0].nome.toUpperCase();
        this.programacao.espessura = this.data.espessura;
        this.programacao.cdCliente = this.data.cdCliente;
        this.programacao.nomeCliente = this.data.nomeCliente;
        this.programacao.cdProduto = this.data.cdProduto;
        this.programacao.nomeProduto = this.data.nomeProduto;
        this.programacao.cdEntrada = this.data.cdEntrada;
        this.programacao.item = this.data.item;
        this.programacao.cdBeneficiamento = this.data.cdBeneficiamento;
        this.programacao.nomeBeneficiamento = this.data.nomeBeneficiamento;
        this.programacao.status = "AGUARDANDO";
        this.programacao.turno.id = this.idTurno;
        this.programacao.linhaDeProducao.id = this.idLinhaDeProducao;
        this.programacao.data = moment(this.data).format('yyyy-MM-DD');
        this.programacao.qtdeProgramada = this.qtdeProgramada;
        this.programacaoService.salvar(this.programacao).subscribe({
            next:(res)=>{
              this.controleExibicaoService.registrarLog(`COLOCOU NA PROGRAMAÇÃO O ITEM: [${this.data.cdProduto} - ${this.data.nomeProduto}]`);
              this.openSnackBar("Item programado com sucesso!", this.snackBarSucesso);
              this.fechar(true);
            },
            error:(e)=>{
              this.openSnackBar("Falha ao programar item!", this.snackBarErro);
              this.fechar(false);
            }
        });
      }
     })
  }

  public alterarValorPrevisto(item: any){
    let valorUnitario = (item.valorPrevisto / item.saldoRetorno);
    this.programacao.valorPrevisto = (valorUnitario * this.qtdeProgramada);
  }

  public consultarImagem() {
    this.service.downloadImg(`${this.data.cdProduto}`).subscribe({
      next:(res)=>{
        this.imagemProduto = res;
        this.urlImagem = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.imagemProduto));
      }
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

  public consultarTurnoDeTrabalho(){
    this.turnoService.consultar().subscribe({
        next:(res)=>{
          this.turnos = res;
        },error:(e)=>{
          this.openSnackBar("Falha ao consultar turno de trabalho!", this.snackBarErro);
        }
    });
  }

  public fechar(resultado: any){
    this.dialogRef.close(resultado);
  }

  public cadastrarLinha(){
      this.dialog.open(DlgCadLinhaComponent, {
      });
  }

  public cadastrarTurno(){
    this.dialog.open(DlgCadTurnoComponent, {
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
