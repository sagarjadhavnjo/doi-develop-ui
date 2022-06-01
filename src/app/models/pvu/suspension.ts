export class SuspensionModel {
    transNo: string;
    susOrderNo: number;
    susOrderDate: string;
    susEventDate: string;
    officeName: string;
    payCommission: string;
    employeeNumber: number;
    empName: string;
    class: string;
    designation: string;
    empOfficeName: string;
    payBand: string;
    payBandValue: string;
    gradePay: string;
    payLevel: string;
    cellId: string;
    basicPay: string;
    dateRetirement: string;
    doj: string;
    reasonForSus: string;
    description: string;
    susStartDate: string;
    remarks: string | '';
    susEndDate: string;
    susClsDate: string;
    closureId: string;
    punishmentType: string;
    closureRemarks: string | '';
    reinstateFlagId: number;
    noOfDayInSus: number;
}


export class DataFixPcModel {
    payableFromDate: Date;
    payableToDate: Date;
    currentBasicPay;
    payableBasicPayPerc;
    payableBasicPayAmt;
    statusId;
    isHighlight: boolean;
    id: number;
}

export class Data5thModel {
    payableFromDate: Date;
    payableToDate: Date;
    currentScale;
    currentBasicPay;
    payableBasicPayPerc;
    payableBasicPayAmt;
    statusId;
    isHighlight: boolean;
    id: number;
}

export class Data6thModel {
    payableFromDate: Date;
    payableToDate: Date;
    currentPayBand;
    currentPayBandValue;
    currentGradePay;
    payableGradePayPerc;
    payableGradePayAmt;
    payablePayBandPerc;
    payablePayBandAmt;
    statusId;
    isHighlight: boolean;
    id: number;
}

export class Data7thModel {
    payableFromDate: Date;
    payableToDate: Date;
    currentPayLevel;
    currentCellId;
    currentBasicPay;
    payableBasicPayPerc;
    payableBasicPayAmt;
    statusId;
    isHighlight: boolean;
    id: number;
}

export class AttachmentModel {
    actionId?: number;
    activeStatus?: number;
    attachmentId?: number | '';
    createdBy?: number;
    createdByPost?: number;
    createdDate?: string;
    file?: string | '';
    fileName: string | '';
    headerId: number | '';
    pathUploadedFile: string | '';
    updatedBy?: number;
    updatedByPost?: number;
    updatedDate?: string;
    uploadedFileName: string;
    versionId?: number;
}

export class SuspensionListModel {
    empNo: number | '';
    empName: string | '';
    payCom: string | '';
    designation: string | '';
    transactionNo: string | '';
    class: string | '';
    suspensionStartDate: string | '';
    suspensionReason: string | '';
    officeName: string | '';
    status: string | '';
}


export class SuspensionSearchFormModel {
    transactionNumber: string;
    employeeNumber: number;
    empName: string;
    suspensionCreatedFromDate: string;
    suspensioncreatedToDate: string;
    paycommision: string;
    status: string;
    reason: string;
}

