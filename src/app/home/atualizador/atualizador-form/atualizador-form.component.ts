import { FaturamentoProduto } from '../../../models/faturamento/faturamento-produto';
import { AtualizadorService } from './../../../services/atualizador.service';
import { Component, OnInit } from '@angular/core';
import { ModeloConsulta } from 'src/app/models/modelo-consulta';
import * as moment from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MetaProjetadaService } from 'src/app/services/meta-projetada.service';
import { MetaDiariaService } from 'src/app/services/meta-diaria.service';
import { MetaProjetada } from 'src/app/models/meta-projetada';
import { MetaDiaria } from 'src/app/models/meta-diaria';
import { Usuario } from 'src/app/models/usuario';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';
import { forkJoin } from 'rxjs';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-atualizador-form',
  templateUrl: './atualizador-form.component.html',
  styleUrls: ['./atualizador-form.component.css']
})
export class AtualizadorFormComponent implements OnInit {

  //Controle interno
  btnDisable: boolean = false;
  inputDisable: boolean = true;
  dataInicial: any;
  dataFinal: any;
  tipoConsulta: any;
  cdCliente: any;
  faturamento: any;
  diasTrabalhados: any;
  valorSabado: any;
  diasUteisDoMes: any;
  resultaDoMetaProjetada: any;
  valorGap: any;
  valorFatSabado: any;
  resultadoMetaDiaria: any;
  usuario: Usuario;


  //Objetos
  modeloConsulta: ModeloConsulta;
  metaProjetada: MetaProjetada;
  metaDiaria: MetaDiaria;
  faturamentoClienteProduto: FaturamentoProduto;


  //Estilos
  snackBarErro = 'my-snack-bar-erro';
  snackBarSucesso = 'my-snack-bar-sucesso';

  public exportarDados: boolean = false;

  constructor(
    private atualizadorService: AtualizadorService,
    private snackBar: MatSnackBar,
    private metaProjetadaService: MetaProjetadaService,
    private metaDiariaService: MetaDiariaService,
    private controleExibicaoService: ControleExibicaoService,
    private clienteService: ClienteService,
  ) {
    this.modeloConsulta = new ModeloConsulta();
    this.metaDiaria = new MetaDiaria();
    this.metaProjetada = new MetaProjetada();
    this.faturamentoClienteProduto = new FaturamentoProduto();
    this.usuario = new Usuario();
  }

  ngOnInit(): void {
    this.controleExibicaoService.registrarLog('ACESSOU A TELA ATUALIZADOR DE INFORMAÇÕES', 'AUTALIZADOR INFORMACOES');
    this.dataInicial = moment().subtract(1, 'days').format("yyyy-MM-DD");
    this.dataFinal = moment().format("yyyy-MM-DD");
    this.tipoConsulta = "selecione uma opção";
    this.consultarValorMetaProjetada();
    this.consultaMetaDiaria();
  }

  private consultarValorMetaProjetada() {
    this.metaProjetadaService.consultarMetaProjetada(this.dataFinal).subscribe({
      next: (res) => {
        this.metaProjetada = res;
      }
    });
  }

  private consultaMetaDiaria() {
    this.metaDiariaService.consultarMetaDoDia(this.dataFinal).subscribe({
      next: (res) => {
        this.metaDiaria = res;
      }
    });
  }

  public atualizarCadastroDeProdutos() {
    this.atualizadorService.atualizarCadastroDeProdutos().subscribe({
      next: (res) => {
        this.openSnackBar('Produtos atualizados com sucesso!', this.snackBarSucesso);
      },
      error: (e) => {
        this.openSnackBar('Falha ao tentar atualizar cadastro de produtos!', this.snackBarErro);
      }
    });
  }

  public atualizarMetaDiaria() {
    this.atualizadorService.atualizarMetaDiaria(this.modeloConsulta.getInstance(this.dataInicial, this.dataFinal, this.tipoConsulta, '', 0)).subscribe({
      next: (res) => {
        this.openSnackBar("Meta diária atualizada com sucesso!", this.snackBarSucesso);
        this.consultaMetaDiaria();
      }, error: (e) => {
        this.openSnackBar("Falha ao tentar atualizar meta diária!", this.snackBarErro);
      }
    });
  }

  public atualizarEntradaDoDia() {
    this.atualizadorService.atualizarEntradaDoDia(this.modeloConsulta.getInstance(this.dataInicial, this.dataFinal, this.tipoConsulta, '', 0)).subscribe({
      next: (res) => {
        this.openSnackBar("Entradas do dia atualizada com sucesso!", this.snackBarSucesso);
      }, error: (e) => {
        this.openSnackBar("Falha ao tentar atualizar entradas do dia!", this.snackBarErro);
      }
    });
  }

  public atualizarEntradaPorCliente() {
    this.atualizadorService.atualizarEntradaPorCliente(this.modeloConsulta.getInstance(this.dataInicial, this.dataFinal, this.tipoConsulta, '', 0)).subscribe({
      next: (res) => {
        this.openSnackBar("Entradas por cliente atualizada com sucesso!", this.snackBarSucesso);
      }, error: (e) => {
        this.openSnackBar("Falha ao tentar atualizar entradas por cliente!", this.snackBarErro);
      }
    });
  }

  public atualizarEntradaPorProduto() {
    this.atualizadorService.atualizarEntradaPorProduto(this.modeloConsulta.getInstance(this.dataInicial, this.dataFinal, this.tipoConsulta, '', 0)).subscribe({
      next: (res) => {
        this.openSnackBar("Entradas por produto atualizada com sucesso!", this.snackBarSucesso);
      }, error: (e) => {
        this.openSnackBar("Falha ao tentar atualizar entradas por produto!", this.snackBarErro);
      }
    });
  }

  public atualizarCarteiraCliente() {
    this.atualizadorService.atualizarCarteiraCliente(this.modeloConsulta.getInstance(this.dataInicial, this.dataFinal, this.tipoConsulta, '', 0)).subscribe({
      next: (res) => {

      }
    });
  }

  public atualizarCarteiraBeneficiamento() {
    this.atualizadorService.atualizarCarteiraBeneficiamento(this.modeloConsulta.getInstance(this.dataInicial, this.dataFinal, this.tipoConsulta, '', 0)).subscribe({
      next: (res) => {

      }
    });
  }

  public atualizarFaturamentoDiario() {
    this.atualizadorService.atualizarFaturamentoDiario(this.modeloConsulta.getInstance(this.dataInicial, this.dataFinal, this.tipoConsulta, '', 0)).subscribe({
      next: (res) => {
        this.openSnackBar("Faturamento diário atualizado com sucesso!", this.snackBarSucesso);
      }, error: (e) => {
        this.openSnackBar("Falha ao tentar atualizar faturamento diário!", this.snackBarErro);
      }
    });
  }

  public atualizarMetaProjetada() {
    this.atualizadorService.atualizarMetaProjetada(this.modeloConsulta.getInstance(this.dataInicial, this.dataFinal, this.tipoConsulta, '', 0)).subscribe({
      next: (res) => {
        this.openSnackBar("Meta projetada atualizada com sucesso!", this.snackBarSucesso);
        this.consultarValorMetaProjetada();
      }, error: () => {
        this.openSnackBar("Falha ao tentar atualizar meta projetada!", this.snackBarErro);
      }
    });
  }

  public atualizarFaturamentoCliente() {
    this.atualizadorService.atualizarFaturamentoCliente(this.modeloConsulta.getInstance(this.dataInicial, this.dataFinal, "faturamento-cliente", "", 0)).subscribe({
      next: (res) => {
        this.openSnackBar("Faturamento de cliente atualizado com sucesso!", this.snackBarSucesso);
      }, error: () => {
        this.openSnackBar("Falha ao tentar atualizar faturamento de cliente", this.snackBarErro);
      }
    })
  }

  public atualizarFaturamentoClienteProduto() {
    this.modeloConsulta.cdCliente = this.cdCliente;
    this.modeloConsulta.dataInicial = this.dataInicial;
    this.modeloConsulta.dataFinal = this.dataFinal;
    this.modeloConsulta.tipoConsulta = "faturamento-cliente-produto";
    this.atualizadorService.atualizarFaturamentoClienteProduto(this.modeloConsulta).subscribe({
      next: (res) => {
        this.openSnackBar("Faturamento de cliente por produto atualizado com sucesso!", this.snackBarSucesso);
      }, error: () => {
        this.openSnackBar("Falha ao tentar atualizar faturamento de cliente por produto", this.snackBarErro);
      }
    })
  }

  public atualizarNotasCanceladas(){
    this.atualizadorService.atualizarNotasCanceladas().subscribe({
        next:(res)=>{
          console.log(res);
          this.openSnackBar("Operação realizada com sucesso! ", this.snackBarSucesso);
        },
        error:(e)=>{
          this.openSnackBar("Falha ao atualizar notas canceladas: ", this.snackBarErro);
        }
    });
  }

  public salvarMetaProjetada() {
    this.metaProjetada.data = new Date();
    this.metaProjetadaService.salvarMetaProjetada(this.metaProjetada).subscribe({
      next: (res) => {
        this.openSnackBar("Meta projetada salva com sucesso!", this.snackBarSucesso);
      }, error: () => {
        this.openSnackBar("Falha ao tentar salvar meta projetada!", this.snackBarErro);
      }
    });
  }

  public atualizarCadastroDeCliente(){
      this.clienteService.atualizarClientes(
        this.modeloConsulta.getInstance('', '', 'consulta_clientes', '', undefined)
      ).subscribe({
          next:(res)=>{
            this.openSnackBar("Cadastro de clientes atualizado com sucesso!", this.snackBarSucesso);
          }
      });
  }

  public salvarMetaDiaria() {
    this.metaDiaria.data = new Date();
    this.metaDiariaService.salvarMetaDiaria(this.metaDiaria).subscribe({
      next: (res) => {
        this.openSnackBar("Meta diária salva com sucesso!", this.snackBarSucesso);
      }, error: (e) => {
        this.openSnackBar("Falha ao tentar salvar meta diária!", this.snackBarErro);
      }
    });
  }

  /**
   * Utilizado para simular os cáculos de meta projetada
   */
  public calculaMetaProjetada() {
    this.resultaDoMetaProjetada = ((((this.faturamento - this.valorSabado) / this.diasTrabalhados) * this.diasUteisDoMes) + 400000);
  }

  /**
   * Utilizado para simular os cálculos de meta diaria
   */
  public calculaMetaDiaria() {
    this.resultadoMetaDiaria = ((this.valorGap - this.valorFatSabado) / this.diasUteisDoMes);
  }

  /**
   * Utilizado para exibir mensagens de alerta para o usuário
   * 
   * @param mensagem 
   * @param tipo 
   */
  openSnackBar(mensagem: string, tipo: string) {
    this.snackBar.open(mensagem, 'X', {
      panelClass: [tipo],
      duration: 6000,
      horizontalPosition: "right",
      verticalPosition: "top",
    });
  }

  /**
   * Com base na opção escolhida pelo usuário e realiza o predimento escolhido
   */
  public atualizar() {
    switch (this.tipoConsulta) {
      case "meta-diaria":
        this.atualizarMetaDiaria();
        break;
      case "entrada-dia":
        this.atualizarEntradaDoDia();
        break;
      case "entrada-cliente":
        this.atualizarEntradaPorCliente();
        break;
      case "entrada-produto":
        this.atualizarEntradaPorProduto();
        break;
      case "carteira-cliente":
        this.atualizarCarteiraCliente();
        break;
      case "valor-faturamento":
        this.atualizarMetaProjetada();
        break;
      case "faturamento-diario":
        this.atualizarFaturamentoDiario();
        break;
      case "faturamento-cliente":
        this.atualizarFaturamentoCliente();
        break;
      case "faturamento-cliente-produto":
        this.atualizarFaturamentoClienteProduto();
        break;
      case "cadastro-produtos":
        this.atualizarCadastroDeProdutos();
        break;
      case "notas-canceladas":
        this.atualizarNotasCanceladas();
        break;
      case "cadastro-clientes":
        this.atualizarCadastroDeCliente();
        break;
      default:
        break;
    }
    this.btnDisable = true;
    setTimeout(() => {
      this.btnDisable = false;
    }, 2000);
  }

  public inpDisable() {
    if (this.tipoConsulta == "faturamento-cliente-produto") {
      this.inputDisable = false;
    } else {
      this.inputDisable = true;
    }
  }

}
