import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'join'
})
/**
 * Join pipe used for display of array joined by separator. Here default is comma separator
 */
export class JoinPipe implements PipeTransform {
    transform(input: Array<any>, separator = ',', property = null): string {
        if (input && input.length) {
            if (property) {
                input = input.map(x => x[property]);
            }
            return input.join(separator);
        }
        return null;
    }
}
