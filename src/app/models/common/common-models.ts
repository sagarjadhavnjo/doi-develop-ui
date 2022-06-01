export class CommonModels {
}

export interface MajorHeadDetailInterface {
    id: number;
    name: string;
    code: string;
    codeName: string;
    sectorHeadCode: string;
    subSectorCode: string;
    majorHeadSubType: string;
    majorHeadSubTypeId: number;
    description: string;
}

export interface LookUpInfoValInterface {
    lookUpInfoId: number;
    lookUpInfoName: string;
    lookUpInfoNameGuj: string;
    parentLookupId: number;
    lookUpInfoValue: number | string;
    orderId: number;
    lookUpInfoDescription: string;
}
