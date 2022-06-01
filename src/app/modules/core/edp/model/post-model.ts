export class PostCreation {
    transactionNo: number;
    district:  string;
    ddoNo: number;
    cardexNo: number;
    ddoOffice: string;
    designationName: string;
    postName: string;
    branchName: string;
    pendingWith: string;
    status: string;
    remarks: string;
}
export interface TabelElement {
    attachmentId: number;
    attachmentName: string;
    attachmentCode: string;
    attachmentDesc: string;
    attahcmentType: number;
    fileName: string;
    uploadedFileName: string;
    uploadedByName: string;
    size: number;
    pathUploadFile: string;
    postId: number;
    workFlowId: number;
    workFlowRoleId: number;
    rolePermId: number;
    file: File;
    postAttachmentId: number;
    mandatoryFlag?: boolean;
}
export interface DesignationName {
    id: number;
    name: string;
}
export interface VacantPost {
    id: number;
    name: string;
    userName: string;
}
export interface BranchName {
    id: number;
    name: string;
}
export interface Status {
    id: number;
    name: string;
}
export interface StatusName {
    statusId: number;
    name: string;
}
