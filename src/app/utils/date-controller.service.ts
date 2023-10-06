import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { FeriadoService } from '../services/feriado.service';

@Injectable({
  providedIn: 'root'
})
export class DateControllerService {

  constructor(
    private feriadoService: FeriadoService,
  ) { }

  diasUteisDoMes: any = 0;
  feriadoSabados: number = 0;
  feriadoDiasUteis: number = 0;
  feriadosDoMes: [] = [];

  /**
   * Retorno o dia da semana por extenso recebe com parametro um 
   * interiro que representa o dia da semana.
   * 
   * @param dia 
   * @returns 
   */
  public diaDaSemana(dia: any) {
    let diaSemana = "";
    switch (moment(dia).weekday()) {
      case 1:
        diaSemana = "Segunda-feira";
        break;
      case 2:
        diaSemana = "Terça-feira";
        break;
      case 3:
        diaSemana = "Quarta-feira";
        break;
      case 4:
        diaSemana = "Quinta-feira";
        break;
      case 5:
        diaSemana = "Sexta-feira";
        break;
      case 6:
        diaSemana = "Sábado";
        break;
      case 0:
        diaSemana = "Domingo";
        break;
      default:
        break;
    }
    return diaSemana;
  }

  public calculaDiasTrabalhados(data: any): Observable<any> {
    let observable = new Observable((value) => {
      this.consultaFeriadosDoMes(data).subscribe({
        next: (res) => {
          this.feriadosDoMes = res;
        },
        complete: () => {
          value.next(this.somaDiasTrabalhados(data));
          value.complete();
        }
      });
    });
    return observable;
  }

  public somaDiasTrabalhados(data: any): number {
    let diasTrabalhados = 0;
    for (let i = 1; i < (moment(data).date()); i++) {
      if (this.diaUtil(moment(data).date(i))) {
        if (!this.feriado(moment(data).date(i))) {
          diasTrabalhados++;
        }
      }
    }
    if(this.dataMenorQueHojeENaoFimDeSemana(data)){
      diasTrabalhados++;
    }
    return diasTrabalhados;
  }

  /**
   * Quando a data for menor que o dia corrente o dia selecionado 
   * deve ser incluso na contagem de dias uteis trabalhados
   * @param data 
   * @returns 
   */
  private dataMenorQueHojeENaoFimDeSemana(data: any){
    if (moment(data).format('yyyy-MM-DD') < moment().format('yyyy-MM-DD') && moment(data).day() != 6 && moment(data).day() != 0) {
      return true;
    }else{
      return false;
    }
  }

  /**
   * Verifica de a data passada por parametro correponde a um dia útil
   * @param data 
   * @returns 
   */
  public diaUtil(data: any): boolean {
    return (moment(data).weekday() != 0 && moment(data).weekday() != 6);
  }

  /**
   * Com base na data recebida checa se a data é anterior ao dia corrente
   * @param data 
   * @returns 
   */
  public isDataAnterior(data: any): boolean {
    return ((moment().diff(moment(data), 'days')) >= 1 ? true : false);
  }

  /**
   * Verifica se a data passada por parametro correponde a um feriado
   * @param dia 
   * @returns 
   */
  private feriado(dia: any): boolean {
    let isFeridado: boolean = false;
    this.feriadosDoMes.forEach((feriado) => {
      if (moment(dia).format('yyyy-MM-DD') == moment(feriado).format('yyyy-MM-DD')) {
        isFeridado = true;
      }
    });
    return isFeridado;
  }

  public consultaFeriadosDoMes(data: any): Observable<any> {
    const observable = new Observable((value) => {
      this.feriadoService.consultarFeriadosExistentes(this.getInicioDoMes(data)).subscribe({
        next: (res) => {
          value.next(res);
          value.complete();
        }
      });
    });
    return observable;
  }

  /**
   * Realiza o cálculo de dias úteis para o fim do mês este método 
   * não inclui sábados ou domingos
   * @param data 
   * @returns 
   */
  public calculaDiasUteisParaFimDoMes(data: any): Observable<number> {
    let observable = new Observable<number>((value) => {
      this.consultaFeriadosDoMes(data).subscribe({
        next: (res) => {
          this.feriadosDoMes = res;
        },
        complete: () => {
          value.next(this.somaDiaUteisDoMes(data));
          value.complete();
        }
      });
    });
    return observable;
  }

  /**
   * Realiza a contagem de todos os dias úteis do mês a partir de uma determinada data
   * @param data 
   * @returns 
   */
  private somaDiaUteisDoMes(data: any): number {
    this.diasUteisDoMes = 0;
    for (let i = moment(data).date(); i <= moment(data).daysInMonth(); ++i) {
      if (this.diaUtil(moment(data).date(i))) {
        if (!this.feriado(moment(data).date(i).format('yyyy-MM-DD'))) {
          this.diasUteisDoMes++;
        }
      }
    }
    if(this.dataMenorQueHojeENaoFimDeSemana(data)){
      this.diasUteisDoMes--;
    }
    return this.diasUteisDoMes;
  }

  /**
   * A partir de uma data fornecida realiza o cálculo de quantos sábados
   * aquele mês possui tendo como início da contangem a data recebida:
   * 
   * @param data 
   * @returns 
   */
  public calculaSabadoDoMes(data: any): number {
    let sabadosMes = 0;
    for (let i = moment(data).date(); i <= moment(data).daysInMonth(); ++i) {
      if (this.sabado(moment(data).date(i))) {
        if (!this.feriado(moment(data).date(i))) {
          sabadosMes++;
        }
      }
    };
    return sabadosMes;
  }

  /**
   * Identifica se o dia da semana é sábado e retorna o boolean
   * @param data 
   * @returns 
   */
  public sabado(data: any): boolean {
    return (moment(data).weekday() == 6 ? true : false);
  }

  /**
   * A partir de uma determinada data consegue identificar e retornar o inicio do mês
   * @param data 
   * @returns 
   */
  public getInicioDoMes(data: any) {
    return `${moment(data).format('yyyy-MM')}-01`;
  }

  public getFimDoMes(data: any){
    return `${moment(data).endOf('month').format('yyyy-MM-DD')}`;
  }

  /**
   * A partir de uma determinada data consegue identificar e retornar o inicio do ano
   * @param data 
   * @returns 
   */
  public getInicioDoAno(data: any) {
    return moment(data).startOf('year').format('yyyy-MM-DD');
  }

}
