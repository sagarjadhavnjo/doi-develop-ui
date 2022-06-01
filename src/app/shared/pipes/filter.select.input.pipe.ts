import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filterSelectInput' })
export class FilterSelectInputPipe implements PipeTransform {
    transform(arr: any[], searchString?: string, keyName?: string): any {
        if (!searchString || !arr) {
            return arr;
        }
        if(arr[0][keyName]) {
            return arr.filter((item) => item[keyName].toLowerCase().indexOf(searchString.toLowerCase()) > -1);
        } else {
            return arr.filter((item) => item.toLowerCase().indexOf(searchString.toLowerCase()) > -1);
        }
        // if(arr[0].value) {
        //     return arr.filter((item) => item.value.toLowerCase().indexOf(searchString.toLowerCase()) > -1);
        // }else if(arr[0].name) {
        //     return arr.filter((item) => item.name.toLowerCase().indexOf(searchString.toLowerCase()) > -1);
        // }else if(arr[0].bankAccountNo) {
        //     return arr.filter((item) => item.bankAccountNo.toLowerCase().indexOf(searchString.toLowerCase()) > -1);
        // } else if(arr[0].accountNo) {
        //     return arr.filter((item) => item.accountNo.toLowerCase().indexOf(searchString.toLowerCase()) > -1);
        // }
    }
}
