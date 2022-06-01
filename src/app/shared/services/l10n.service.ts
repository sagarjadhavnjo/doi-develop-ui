import { Injectable } from '@angular/core';
import * as PVULabel from '../lang/pvu.json';
import * as Commonlabel from '../lang/common.json';

@Injectable()

export class L10nService {

    /**
       * Used to store default language
       */
    defaultLanguage = 'en-US';

    /**
     * Used to store common labels.
     */
    CommonLabelDetails = (Commonlabel as any).default;

    /**
     * Used to store bond labels.
     */
    PVULabelDetails = (PVULabel as any).default;

    /**
     * Used to store module name.
     */
    moduleName: string;

    /**
     * Used to return label based on key.
     * @param key Used to store key for label.
     */
    Label(key: string): string {
        if (!key) {
            return '';
        }
        const extractModule = key.split('.');
        const module = extractModule.length === 3 ? extractModule[0] : 'Common';

        key = extractModule.length === 3 ? extractModule[2] : extractModule[0];
        if (extractModule.length === 3 ? !this[`${module}LabelDetails`][this.defaultLanguage][extractModule[1]][key] : !this[`${module}LabelDetails`][this.defaultLanguage][key] ) {
            return '';
        }

        return extractModule.length === 3 ? this[`${module}LabelDetails`][this.defaultLanguage][extractModule[1]][key] : this[`${module}LabelDetails`][this.defaultLanguage][key];
    }

    /**
    * Used to change Default language based on the key.
    * @param lang Used to store key for language.
    */
    changeLanguage(lang: string) {
        if (this.CommonLabelDetails[lang]) {
            this.defaultLanguage = lang;
        } else {
            this.defaultLanguage = 'en-US';
        }
    }
}
