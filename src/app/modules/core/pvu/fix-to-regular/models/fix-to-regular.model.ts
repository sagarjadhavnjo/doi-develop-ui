
export interface EmployeeCurrentDetailInterface {
    employeeNumber: number;
    employeeName: string;
    class: string;
    designation: string;
    officeName: string;
    employeeType: string;
    empId: number;
}

// export interface PostDetailInterface {
//     commisionType: string;
//     scaleId: number;
//     payBandId: number;
//     payLevelId: number;
//     basicPay: number;
//     benifitEffictiveDate: Date | string;
//     dateOfNextIncrement: Date | string;
//     payBandValue: number;
//     gradePayId: number;
//     cellId: number;
// }

export interface FifthCommPayInterface {
    payCommId: number;
    payScaleId: number;
    basicPay: number;
    benEffDate: Date | string;
    dateOfNxtInc: Date | string;
}

export class FifthCommPay implements FifthCommPayInterface {
    payCommId: number;
    payScaleId: number;
    basicPay: number;
    benEffDate: Date | string;
    dateOfNxtInc: Date | string;

    constructor(source: any) {
        this.payCommId = source.payComm ? source.payComm : null;
        this.payScaleId = source.payScale ? source.payScale : null;
        this.basicPay = source.basicPay ? source.basicPay : null;
        this.benEffDate = source.convEffDate ? source.convEffDate : null;
        this.dateOfNxtInc = source.nextIncrDate ? source.nextIncrDate : null;

    }
}

export interface SixthPayCommInterface {
    payCommId: number;
    payBandId: number;
    gradePayId: number;
    payBandValue: number;
    basicPay: number;
    benEffDate: Date | string;
    dateOfNxtInc: Date | string;
}

export class SixthPayComm implements SixthPayCommInterface {
    payCommId: number;
    payBandId: number;
    gradePayId: number;
    payBandValue: number;
    basicPay: number;
    benEffDate: Date | string;
    dateOfNxtInc: Date | string;

    constructor(source: any) {
        this.payCommId = source.payComm ? source.payComm : null;
        this.payCommId = (source.sixCommissionPayId) ? source.sixCommissionPayId : this.payCommId;
        this.payBandId = source.payBand ? source.payBand : null;
        this.gradePayId = source.gradePay ? source.gradePay : null;
        this.payBandValue = source.payBandValue ? source.payBandValue : null;
        this.basicPay = (source.basicPay && source.payComm === 151) ? source.basicPay : null;
        this.basicPay = (source.basicPayComm6 && source.payComm === 152) ? source.basicPayComm6 : this.basicPay;
        this.benEffDate = source.convEffDate ? source.convEffDate : null;
        this.dateOfNxtInc = source.nextIncrDate ? source.nextIncrDate : null;

    }

}

export interface SeventhPayCommInterface {
    payCommId: number;
    payLevelId: number;
    cellId: number;
    basicPay: number;
    benEffDate: Date | string;
    dateOfNxtInc: Date | string;
}

export class SeventhPayComm implements SeventhPayCommInterface {
    payCommId: number;
    payLevelId: number;
    cellId: number;
    basicPay: number;
    benEffDate: string | Date;
    dateOfNxtInc: string | Date;

    constructor(source: any) {
        this.payCommId = source.payComm ? source.payComm : null;
        this.payLevelId = source.payLevel ? source.payLevel : null;
        this.cellId = source.cellId ? source.cellId : null;
        this.basicPay = source.basicPay ? source.basicPay : null;
        this.benEffDate = source.convEffDate ? source.convEffDate : null;
        this.dateOfNxtInc = source.nextIncrDate ? source.nextIncrDate : null;
    }

}
export interface FixtoRegularInterface {
    id?: number;
    officeId: number;
    officeName: string;
    eventOrderNumber: number;
    employeeNo: number;
    eventOrderDate: Date | string;
    eventEffectiveDate: Date | string;
    employeeDetail: EmployeeCurrentDetailInterface;
    fifthPc: FifthCommPayInterface;
    sixthPc: SixthPayCommInterface;
    sevenPc: SeventhPayCommInterface;
}


export class FixtoRegular implements FixtoRegularInterface {
    id?: number;
    officeId: number;
    officeName: string;
    eventOrderNumber: number;
    employeeNo: number;
    eventOrderDate: string | Date;
    eventEffectiveDate: string | Date;
    employeeDetail: EmployeeCurrentDetailInterface;
    fifthPc: FifthCommPayInterface;
    sixthPc: SixthPayCommInterface;
    sevenPc: SeventhPayCommInterface;

    constructor(source: any) {
        this.id = source.fixRegDsId ? source.fixRegDsId : null;
        this.officeId = source.officeId ? source.officeId : null;
        this.officeName = source.officeName ? source.officeName : null;
        this.eventOrderNumber = source.convOrderNo ? source.convOrderNo : null;
        this.eventOrderDate = source.convOrderDate ? source.convOrderDate : null;
        this.eventEffectiveDate = source.convEffDate ? source.convEffDate : null;
        this.employeeDetail = source.employeeDetail ? source.employeeDetail : null;
        this.employeeNo = source.employeeNo ? source.employeeNo : null;
        // this.fifthPc = source.fifthPc ? source.fifthPc : null;
        // this.sixthPc = source.sixthPc ? source.sixthPc : null;
        // this.sevenPc = source.sevenPc ? source.sevenPc : null;
        this.setInnerFormData(source);
    }

    setInnerFormData(source: any) {
        if (source.payComm === 150) {
            this.fifthPc = new FifthCommPay(source);
        } else if (source.payComm === 151) {
            this.sixthPc = new SixthPayComm(source);
        } else {
            source.sixCommissionPayId = 151;
            this.sixthPc = new SixthPayComm(source);
            this.sevenPc = new SeventhPayComm(source);
        }
    }
}


// export class FixtoRegularDto {
//     id?: number;
//     officeId: number;
//     officeName: string;
//     eventOrderNumber: number;
//     eventOrderDate: string | Date;
//     eventEffectiveDate: string | Date;
//     employeeDetail: EmployeeCurrentDetailInterface;
//     postDetail: PostDetailInterface;

//     constructor(source: any) {
//         this.id = source.id ? source.id : null;
//         this.officeId = source.officeId ? source.officeId : null;
//         this.officeName = source.officeName ? source.officeName : null;
//         this.eventOrderNumber = source.eventOrderNumber ? source.eventOrderNumber : null;
//         this.eventEffectiveDate = source.eventEffectiveDate ? source.eventEffectiveDate : null;
//         this.employeeDetail = source.employeeDetail ? source.employeeDetail : null;
//         this.postDetail = source.postDetail ? source.postDetail : null;
//     }
// }

export interface FixtoRegularDtoInterface {
    action: string;
    basicPay: number;
    basicPayComm6: number;
    cellId: number;
    cfixPay: number;
    convEffDate: Date;
    convOrderDate: Date;
    convOrderNo: number;
    curMenuId: number;
    empId: number;
    empPayType: number;
    fixRegDsId: number;
    formAction: string;
    gradePay: number;
    nextIncrDate: Date;
    nxtIncrDate6: Date;
    officeId: number;
    payBand: number;
    payBandValue: number;
    payComm: number;
    payLevel: number;
    payScale: number;
    refDate: string;
    statusId: number;
    trnNo: string;
}


export class FixtoRegularDto implements FixtoRegularDtoInterface {
    action: string;
    basicPay: number;
    cellId: number;
    cfixPay: number;
    basicPayComm6: number;
    convEffDate: Date;
    convOrderDate: Date;
    convOrderNo: number;
    curMenuId: number;
    empId: number;
    empPayType: number;
    fixRegDsId: number;
    formAction: string;
    gradePay: number;
    nextIncrDate: Date;
    nxtIncrDate6: Date;
    officeId: number;
    payBand: number;
    payBandValue: number;
    payComm: number;
    payLevel: number;
    payScale: number;
    refDate: string;
    statusId: number;
    trnNo: string;
    fyId: number;

    constructor(source: any) {
        this.action = source.action ? source.action : 'DRAFT';
        this.basicPay = source.basicPay ? source.basicPay : null;
        this.cellId = source.cellPID ? source.cellPID : null;
        this.cfixPay = source.cfixPay ? source.cfixPay : null;
        this.convEffDate = source.eventEffectiveDate ? new Date(source.eventEffectiveDate) : null;
        this.convOrderDate = source.eventOrderDate ? new Date(source.eventOrderDate) : null;
        this.convOrderNo = source.eventOrderNumber ? source.eventOrderNumber : null;
        this.empId = source.empId ? source.empId : null;
        this.fixRegDsId = source.id ? source.id : null;
        this.formAction = this.action;
        this.gradePay = source.gradePayId ? source.gradePayId : null;
        this.nextIncrDate = source.dateOfNxtInc ? new Date(source.dateOfNxtInc) : null;
        this.nxtIncrDate6 = source.nxtIncrDate6 ? new Date(source.nxtIncrDate6) : null;
        this.officeId = source.officeId ? source.officeId : null;
        this.payBand = source.payBandId ? source.payBandId : null;
        this.payBandValue = source.payBandValue ? source.payBandValue : null;
        this.payComm = source.payCommId ? source.payCommId : null;
        this.payLevel = source.payLevelId ? source.payLevelId : null;
        this.payScale = source.payScaleId ? source.payScaleId : null;
        this.refDate = source.refDate ? source.refDate : null;
        this.statusId = source.statusId ? source.statusId : null;
        this.trnNo = source.trnNo ? source.trnNo : null;
        this.fyId = source.fyId ? source.fyId : null;
        this.empPayType = source.empPayType ? source.empPayType : null;
        this.basicPayComm6 = source.basicPayComm6 ? source.basicPayComm6 : null;
    }

}

export class FixtoRegularDtoList {
    dtos: FixtoRegularDto[];

    constructor() { }
    setData(source: any) {
        this.dtos = source.dtos ? source.dtos : null;
    }

    pushData(source: FixtoRegularDto) {
        this.dtos.push(source);
    }
}

export class FixtoRegularListingDto {
    desigId?: number;
    empNo: number;
    empName: string;
    offName: string;
    trNo: string;
    statusId: number;
    createdFromDate: Date;
    createdToDate: Date;
    constructor(source: any) {
        this.desigId = source.desigId ? source.desigId : 0;
        this.empNo = source.empNo ? source.empNo : 0;
        this.empName = source.empName ? source.empName : '';
        this.offName = source.offName ? source.offName : '';
        this.trNo = source.trNo ? source.trNo : '';
        this.statusId = source.statusId ? source.statusId : 0;
        this.createdFromDate = source.createdFromDate ? source.createdFromDate : '';
        this.createdToDate = source.createdToDate ? source.createdToDate : '';

    }
}
