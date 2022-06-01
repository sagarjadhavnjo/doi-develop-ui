export interface UserPostMappingDetailsPosts {
    position: number;
    name: string;
    pname: string;

}
export interface UserPostMappingToPosts {
    position: number;
    name: string;
    pname: string;

}
export interface UserPostMappingfromPosts {
    sr_no: number;
    post_name: string;
    post_type: string;
    office_type?: string;
}
export class DialogData {
}
export interface District {
    id: number;
    name: string;
}
export interface StatusName {
    statusId: number;
    name: string;
}
export interface TabelElement {
    attachmentId: number;
    attachmentName: string;
    attachmentCode: string;
    attachmentDesc: string;
    attahcmentType: number;
    fileName: string;
    uploadedFileName: string;
    uploadedBy: string;
    uploadedByName: string;
    size: number;
    pathUploadFile: string;
    officeId: string;
    rolePermId: number;
    file: File;
    edpUsrPoTranAttId: number;
    edpUsrPoTrnsHeadrId: number;
    mandatoryFlag?: boolean;
}

export interface PostTransferList {
    lookUpInfoId: number;
    lookUpInfoName: string;
    lookUpInfoValue: number;
}
export interface Officedata {
    officeId: number;
    officeName: string;
    cardexNo: number | '';
    ddoNo: number | '';
    status: string;
}
