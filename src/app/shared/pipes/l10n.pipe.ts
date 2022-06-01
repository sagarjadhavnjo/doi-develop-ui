import { Pipe, PipeTransform } from '@angular/core';
import { L10nService } from '../services/l10n.service';

@Pipe({
    name: 'l10n'
})
export class L10nPipe implements PipeTransform {

    constructor(private l10n: L10nService) {

    }
    transform(key: string) {
        return this.l10n.Label(key);
    }

}
