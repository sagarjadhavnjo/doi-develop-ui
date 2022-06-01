export class DdoOfficesCreate {
    grNo: string;
    uniqueId: number;
    requestNo: number;
    district: string;
    officeLevel: string;
    level: string;
    ddoOfficeName: string;
    cardexNo: number;
    ddoNo: number;
    ddoType: string;
    nonDdoType: string;
    pvu: string;
    designationName: string;
    requestTo: string;
    treasuryType: string;
    address1: string;
    address2: string;
    taluka: string;
    station: string;
    pinCode: number;
    stdCode: number;
    phoneNo: number;
    mobileNo: number;
    faxNo: number;
    emailId: string;
    officeNameForDisplay: string;
    department: string;
    hod: string;
    coName: string;
    coOfficeName: string;
    treasuryOffice: string;
    billType: string;
    selectedBill: string;
    moduleType: string;
    approvalComment: string;
    checked: boolean;
    objectionRemarks: string;
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
    size: number;
    pathUploadFile: string;
    rolePermId: number;
    file: File;
    ofcAttactmentId: number;
    common: boolean;
    mandatoryFlag: boolean;
}
export class DdoSubOfficesCreate {
    subOfficeCode: number;
    ddoOfficeName: string;
    district: string;
    uniqueId: number;
    address: string;
    taluka: string;
    station: string;
    pinCode: number;
    phoneNo: number;
    faxNo: number;
    emailId: string;
    department: string;
    hod: string;
}
export interface DataElement {
    attechment: string;
    filename: string;
    uploadedBy: string;
}
export interface DDORequestList {
    requestNo: number;
    district: string;
    designation: string;
    ddoOfficeName: string;
    pendingWith: string;
    status: string;
    remarks: string;
}
export interface OfficeSummaryList {
    districtCode: number;
    district: string;
    ddoCount: number;
    nonDDOCount: number;
    panchayatCount: number;
}
export interface OfficeUpdationList {
    districtCode: number;
    district: string;
    ddoNo: number;
    cardexNo: number;
    designation: string;
    officeName: string;
    ddoType: string;
    startDate: string;
    status: string;
    verificationLevel: string;
}
export interface Taluka {
    id: number;
    name: string;
    code: string;
    codeName: string;
    parentId: number;
}
export interface District {
    id: number;
    name: string;
    code: string;
    codeName: string;
    parentId: number;
    taluka: Taluka[];
}
export interface OfficeType {
    id: number;
    name: string;
}
export interface Level {
    id: number;
    name: string;
}
export interface DdoType {
    id: number;
    name: string;
}
export interface NonDdoType {
    id: number;
    name: string;
}
export interface PVU {
    id: number;
    name: string;
}
export interface DesignationOfDdo {
    id: number;
    name: string;
}
export interface TreasuryType {
    id: number;
    name: string;
}
export interface RequestTo {
    id: number;
    name: string;
    tresuryType: TreasuryType[];
}
export interface IsCoOffice {
    id: number;
    name: string;
}
export interface EmployeeName {
    id: number;
    name: string;
}
export interface Department {
    id: number;
    name: string;
    code?: string;
    officeList?: Hod;
}
export interface Hod {
    id: number;
    name: string;
}
export interface CoDesignation {
    id: number;
    name: string;
}
export interface CoOfficeName {
    id: number;
    name: string;
}
export interface TreasuryOffice {
    id: number;
    name: string;
}
export interface BillSubmnittedTo {
    id: number;
    name: string;
}
export interface BillType {
    id: number;
    name: string;
}
export interface ListOfBills {
    id: number;
    name: string;
}
export interface ModuleType {
    id: number;
    name: string;
}
export interface Status {
    id: number;
    name: string;
}