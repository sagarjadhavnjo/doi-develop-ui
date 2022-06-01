export class CommonListing {
    value: string | number;
    viewValue: string;
}
export class CommonList {
    id: string | number;
    name: string;
}

export class HeaderElement {
    label: string | '';
    value: string | '';
}

export class CommonListingClass {
    value: string | number;
    viewValue: string;
    class: string;
}

export interface TransactionList {
    id: number;
    transactionType: string;
    transactionSubType: any[];
}

export interface TransactionSubType {
    id: number,
    transactionType: string
}