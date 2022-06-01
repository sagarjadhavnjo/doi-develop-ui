import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filterNumberSelectInput' })
export class FilterNumberSelectInputPipe implements PipeTransform {
    transform(arr: any[], searchString?: string, keyName?: any): any {
        if (!searchString || !arr) {
            return arr;
        }
        if (arr[0].scaleValue) {
           return arr.filter(item => (item['scaleValue'].toLowerCase().indexOf(searchString.toLowerCase()) > -1));
        }
        if (arr[0].payBandValue) {
           return arr.filter(item => (item['payBandValue'].toLowerCase().indexOf(searchString.toLowerCase()) > -1));
        }

        // return arr.filter((item) => {
        //     return ((item['scaleValue'].toString().toLowerCase().indexOf(searchString.toLowerCase()) > -1 ))
        //   //  || (item['payBandValue'].toString().toLowerCase().indexOf(searchString.toLowerCase()) > -1));
        // } );
    }
}

