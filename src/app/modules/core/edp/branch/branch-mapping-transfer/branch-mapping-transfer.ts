export interface BranchMappingAndTransferListing {
    referenceNumber: string;
    referenceDate: Date;
    district: string;
    ddoNo: string;
    cardexNo: string;
    officeName: string;
    requestType: string;
    fromEmployeeNumber: string;
    fromPostName: string;
    toEmployeeNumber: string;
    toPostName: string;
    lyingWith: string;
    transactionStatus: string;
}
export interface BranchMappingTransfer {
    employeeNo: string;
    employeeName: string;
    postName: string;
    branch: string;
    mappedBranch: string;
    toBeTrasnferred: string;
}
export interface BranchMappingTo {
    employeeNo: string;
    employeeName: string;
    postName: string;
    branch: string[];
}

export interface BranchMappingRequest {
    branchesToBeMapped: number[];
    formAction: FormActions;
    fromPouId: number;
    requestType: number;
    tedpBrHdrId: number;
    toPouId: number;
    trnNo: string;
}

export enum FormActions {
    SUBMITTED = 'SUBMITTED',
    DRAFT = 'DRAFT'
}

export interface ToFromEmpDetails {
    postOfficeUserId: number;
    empNo: string;
    empName: string;
    postName: string;
    mappedBranches: number[];
}
