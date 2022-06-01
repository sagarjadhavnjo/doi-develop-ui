export class AddDesignation {
    refxNo: number;
    district: string;
    ddNo: number;
    cardexNo: number;
    ddoOffice: string;
    PostName: string;
    postSortName: string;
    Pending: string;
    status?: string;
    remakes: string;
}
export class EmployeeNo {
    empId: number;
    empNo: string;
    empName: string;
}
export class ActivePost {
    postId: number;
    postName: string;
    designationId: number;
}
export class Designation {
    id: number;
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
    uploadedByName: string;
    size: number;
    pathUploadFile: string;
    officeId: number;
    file: File;
    trnUpdDsgnEntity: number;
    tedpUpdDsgnAttId: number;
    mandatoryFlag?: boolean;
}
export interface ADDTabelElement {
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
    rolePermId: number;
    file: File;
    designationId: number;
    designationAttachId: number;
    mandatoryFlag?: boolean;
}
export interface District {
    id: number;
    name: string;
}
export interface DesignationOfDdo {
    id: number;
    name: string;
}
export interface StatusName {
    statusId: string;
    name: string;
}
export interface DistrictName {
    id: number;
    name: string;
    officeList?: any[];
}
export interface OfficeListData {
    id: number;
    name: string;
    cardexNo: number;
    ddoNo: string;
}
