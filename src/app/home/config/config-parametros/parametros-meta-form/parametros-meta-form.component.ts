import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatasetController } from 'chart.js';
import * as moment from 'moment';

//Componentes
import { ParametrosMeta } from 'src/app/models/parametros-meta';
import { ParametrosMetaService } from 'src/app/services/parametros-meta.service';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { DateControllerService } from 'src/app/utils/date-controller.service';

@Component({
  selector: 'app-parametro-meta-form',
  templateUrl: './parametros-meta-form.component.html',
  styleUrls: ['./parametros-meta-form.component.css']
})
export class ParametrosMetaFormComponent implements OnInit {

  parametrosMeta: ParametrosMeta;
  metaFaturamento: ParametrosMeta;
  listaParamentrosMeta: ParametrosMeta[];
  dataParamentro: ParametrosMeta[];
  paginaMeta: number = 1;
  itensPagina: number = 10;

  //Variaveis de estilo
  private snackBarErro = 'my-snack-bar-erro';
  private snackBarSucesso = 'my-snack-bar-sucesso';

  constructor(
    private parametrosServices: ParametrosMetaService,
    private snackBar: MatSnackBar,
    private dataController: DateControllerService,
    private usuarioService: UsuarioService,
    private controleExibicaoService: ControleExibicaoService,

  ) {
    this.parametrosMeta = new ParametrosMeta();
    this.metaFaturamento = new ParametrosMeta();
    this.dataParamentro = [];
    this.listaParamentrosMeta = []; 
  }

  ngOnInit(): void {
    console.log(this.parametrosMeta.valorMetaMensal)
    this.controleExibicaoService.registrarLog('ACESSOU A TELA DE CONFIGURACAO DE META', 'CONFIGURACAO META');
    this.consultarParametros();
    this.consultaParetrosDoMes();
  }


  public salvar() {
    if(moment(this.parametrosMeta.data) >= moment(this.dataController.getInicioDoMes(moment().format('yyyy-MM-DD').toString()))){
      this.parametrosServices.salvarMetasDoMes(this.parametrosMeta).subscribe({
      next: (res) => {
        this.consultarParametros();
        this.openSnackBar("Parametro de meta salvo com sucesso!", this.snackBarSucesso);
      },
      error: (e) => {
        this.openSnackBar("Falha ao salvar parametro de meta", this.snackBarErro);
      }, complete() {

      },
    });
    }else{
      this.openSnackBar("Não é permitido alterar meta de datas anteriores!", this.snackBarErro);
    }
    
  }

  openSnackBar(mensagem: string, tipo: string) {
    this.snackBar.open(mensagem, 'X', {
      panelClass: [tipo],
      duration: 6000,
      horizontalPosition: "right",
      verticalPosition: "top",
    });
  }

  consultaParetrosDoMes(){
    this.parametrosServices.consultarParamentrosMeta(moment().format('yyyy-MM-DD')).subscribe({
      next:(res)=>{
       this.parametrosMeta = res;
      }
    });
  }

  public consultarParametros() {
    this.parametrosServices.consultarMetasDeFaturamento().subscribe({
      next: (res) => {
        this.listaParamentrosMeta = res;
      }
    });
  }

}
