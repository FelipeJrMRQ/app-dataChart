import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numeroAbreviado'
})
export default class NumeroAbreviadoPipe implements PipeTransform {

  transform(value: number): string {
    let newValue = value;
    let suffix = '';
    
    if (value >= 1000 && value < 1000000) {
      newValue = value / 1000;
      suffix = 'K';
    } else if (value >= 1000000 && value < 1000000000) {
      newValue = value / 1000000;
      suffix = 'M';
    } else if (value >= 1000000000 && value < 1000000000000) {
      newValue = value / 1000000000;
      suffix = 'B';
    } else if (value >= 1000000000000) {
      newValue = value / 1000000000000;
      suffix = 'T';
    }

    return newValue.toFixed(1) + suffix;
  }

}
