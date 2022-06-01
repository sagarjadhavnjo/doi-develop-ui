export interface HeaderJson {
    label: string;
    value: string | number;
}

export interface WorkflowPopupData {
    menuModuleName: string;
    headingName: string;
    headerJson: HeaderJson[];
    trnId: number;
    conditionUrl: string;
    fdGroupUrl: string; // discussed with shailesh, added fd group url for module specific.
    moduleInfo: any;
    refNo: string;
    refDate: string | Date;
    branchId: number;
    ministerId: number;
    isAttachmentTab: boolean;
}
