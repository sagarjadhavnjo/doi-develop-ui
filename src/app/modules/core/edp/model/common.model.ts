export interface FilterNamesWithType {
    name: string;
    type: Types;
    value?: string | number;
}

export enum Types {
    Number = 'number',
    String = 'string',
    Date = 'date'
}
