import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ParametrosMeta } from 'src/app/models/parametros-meta';
import { Usuario } from 'src/app/models/usuario';
import { FaturamentoService } from 'src/app/services/faturamento.service';
import { ParametrosMetaService } from 'src/app/services/parametros-meta.service';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { forkJoin } from 'rxjs'

@Component({
  selector: 'app-card-meta',
  templateUrl: './card-meta.component.html',
  styleUrls: ['./card-meta.component.css']
})
export class CardMetaComponent implements OnInit {

  valorOrcamento: any = 0;
  metaPorSabado: any = 0;
  metaDoMes: any = 0;
  dataRecebida: any = moment().format('yyyy-MM-DD');
  parametrosMeta: ParametrosMeta
  usuario: Usuario;
  private exibirValorOrcamento: boolean = false;
  private exibirMetaMes: boolean = false;
  private exibirMetaSabado: boolean = false;
  private nomeTela = "dashboard-sintetico";

  constructor(
    private parametrosService: ParametrosMetaService,
    private controleExibicaoService: ControleExibicaoService
  ) {
    this.parametrosMeta = new ParametrosMeta();
    this.usuario = new Usuario;
  }

  ngOnInit(): void {
    this.receberDataEscolhida();
    this.verificaPemissaoDeAcesso();
  }
  
  public verificaPemissaoDeAcesso() {
    forkJoin({
      s1: this.controleExibicaoService.verificaPermissaoDeAcesso('valor_orcamento', this.nomeTela),
      s2: this.controleExibicaoService.verificaPermissaoDeAcesso('meta_mes', this.nomeTela),
      s3: this.controleExibicaoService.verificaPermissaoDeAcesso('meta_sabado', this.nomeTela),
    }).subscribe(({s1, s2, s3})=>{
        this.exibirValorOrcamento = s1;
        this.exibirMetaMes = s2;
        this.exibirMetaSabado = s3;
        this.consultarParametros();
    })
  }

  public consultarParametros() {
    this.parametrosService.consultarParamentrosMeta(this.dataRecebida).subscribe({
      next: (res) => {
        this.parametrosMeta = res;
      },
      complete: () => {
       try {
        if (this.exibirValorOrcamento) {
          this.valorOrcamento = this.parametrosMeta.valorOrcamento;
        }
        if (this.exibirMetaMes) {
          this.metaDoMes = this.parametrosMeta.valorMetaMensal;
        }
        if (this.exibirMetaSabado) {
          this.metaPorSabado = this.parametrosMeta.valorPorSabado;
        }
       } catch (error) {
        
       }
      }
    });
  }

  public receberDataEscolhida() {
    FaturamentoService.emitirData.subscribe((res: any) => {
      this.dataRecebida = res;
      this.verificaPemissaoDeAcesso();
    });
  }

}
