import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
   name: 'SearchPipe'
})
export class SearchPipe implements PipeTransform {
   transform(value, args?: any): Array<any> {
      const searchText = new RegExp(args.search, 'ig');
      if (value) {
         return value.filter(data => {
            let result = false;
            for (const property of args.properties) {
               if (property.indexOf('.') === -1) {
                  if (data[property]) {
                     result = data[property].search(searchText) !== -1;
                     if (result) {
                        return result;
                     }
                  }
               } else {
                  const properties = property.split('.');
                  if (data[properties[0]][properties[1]]) {
                     result = data[properties[0]][properties[1]].search(searchText) !== -1;
                     if (result) {
                        return result;
                     }
                  }
               }
            }
            return result;
         });
      }
   }
}

