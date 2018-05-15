/**
 * Filter the dropdown items by given search input.
 */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(value: any, args?: {data:string[],input:string}): any {
    const data:string[]=args.data;
       const input=args.input;
  if(args===undefined  || !data || data.length===0)
  return value;
    const inp:string[]= data.filter(function(element) {
      return element.toLowerCase().startsWith(input?input.toLowerCase():'');
    });
    // console.log("Input"+(inp.length!=undefined)?inp[0]:"Nope");
   
    return (inp!=undefined)? inp:   null;
    
  }

}
