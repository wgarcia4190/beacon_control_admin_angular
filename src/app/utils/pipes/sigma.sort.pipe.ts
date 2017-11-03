import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
   name: 'SortPipe'
})
export class SortPipe implements PipeTransform {
   transform(array: Array<any>, args?: any): Array<any> {
      array.sort((a: any, b: any) => {
         const order = args.order === 'desc' ? -1 : 1;
         let result = 0;
         if (!args.innerProperty) {
            result = (a[args.key] < b[args.key]) ? -1 : (a[args.key] > b[args.key]) ? 1 : 0;
         } else {
            result = (a[args.key][args.innerProperty] <
               b[args.key][args.innerProperty]) ? -1 : (a[args.key][args.innerProperty] >
                  b[args.key][args.innerProperty]) ? 1 : 0;
         }

         return result * order;
      });
      return [].concat(array);
   }
}
