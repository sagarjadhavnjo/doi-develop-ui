// import { StringMap } from '@angular/core/src/render3/jit/compiler_facade_interface';

export interface EmployeeDetails {
    empNo: number;
    empId?: number;
    empName: string;
    postName: string;
    postType: string;
    postOfficeUserId: number;
}

export interface UserRightsMap {
    empNo?: number;
    employeeNumber?: number;
    postOfficeUserId?: number;
    empName?: string;
    postName?: string;
    postType?: string;
    branch?: string;
    workFLow?: string;
    menuId: number;
    rolePrmId: number;
    isRemoved: number;
    isRightsRemoved?: number;
    isWorkFlow: number;
    trnUsrRolePrmId?: number;
    userRoleMappingId: number;
    transactionNumber?: number;
    createdDate?: string;
    submmissionStatusName?: string;
    trnUsrWfRoleId?: number;
    isRightsRemovedWf?: number;
    workFlowName?: string;
}

export class UserRoleMappingList {
    selected?: Boolean | '';
    requestNo: string | '';
    requestDate: string | '';
    district: string | '';
    ddoNo: number | '';
    cardexNo: number | '';
    ddoOfficeName: string | '';
    employeeNo: string | '';
    userName: string | '';
    lyingWith: string | '';
    requestStatus: string | '';
    remarks: string | '';
}

export class AttachmentModel {
    actionId?: number;
    activeStatus?: number;
    attachmentId?: number | '';
    createdBy?: number;
    createdByPost?: number;
    createdDate?: string;
    attachmenttType: string | '';
    file?: string | '';
    fileName: string | '';
    uploadedBy: string | '';
    headerId: number | '';
    pathUploadedFile: string | '';
    updatedBy?: number;
    updatedByPost?: number;
    updatedDate?: string;
    uploadedFileName: string;
    versionId?: number;
}

// Table on clcik serch button
export interface Userole {
    empNo: string;
    position: number;
    empName: string;
    postName: string;
    postType: string;
}

// Rights to be Given table
export interface UseroleMap {
    empNo: string;
    position: number;
    empName: string;
    postName: string;
    postType: string;
    moduleList: string;
    subModule: string;
    manuCounter: string;
    permission: string;
    branch: string;
    workFLow: string;
}
export interface EmployeeName {
    empId: number;
    empNo: string;
    empName: string;
}

export interface RightsMappingAttachment {
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
    rolePermId: number;
    file: File;
    common: boolean;
    mandatoryFlag: boolean;
    userRgMapId: number;
    userRgMpAttrId: number;
}
export class FileNode {
    id: number;
    name: string;
    submodule?: FileNode[];
}
