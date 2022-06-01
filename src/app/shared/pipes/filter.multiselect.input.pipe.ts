import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filterMultiSelectInput' })
export class FilterMultiSelectInputPipe implements PipeTransform {
    transform(arr: any[], searchString?: string, keyName?: any): any {
        if (!searchString || !arr) {
            return arr;
        }
        return arr.filter((item) => {
            return ((item['empNo'].toString().toLowerCase().indexOf(searchString.toLowerCase()) > -1 )
            || (item['empName'].toString().toLowerCase().indexOf(searchString.toLowerCase()) > -1))
        } );
    }
}
