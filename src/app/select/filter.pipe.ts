import { Pipe, PipeTransform } from '@angular/core';
import { country_list } from './countries';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
private contries = country_list;
  transform(value: any, args?: any): any {
    
  if(args===undefined || args==="")
  return this.contries;
    const inp:string[]= this.contries.filter(function(element) {
      return element.toLowerCase().startsWith(args?args.toLowerCase():'');
    });
    // console.log("Input"+(inp.length!=undefined)?inp[0]:"Nope");
   


    return (inp!=undefined)? inp:   null;
    
  }

}
