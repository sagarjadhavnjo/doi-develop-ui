
export class DialogData {

}

export class HeaderElement {
    label: string | '';
    value: string | '';
}

export class BrwoseDatagrant {
    name: string;
    file: string;
    uploadedBy: string;
}

export class ListValue {
    value: string;
    viewValue: string;
}
export class BrwoseData {
    name: string;
    file: string;
    uploadedBy: string;
}

export interface LcAdviceCardexVerification {
    virtualTokenNo: string;
    virtualTokenDate: string;
    adviceNo: string;
    adviceDate: string;
    divisionCode: string;
    divisionName: string;
    cardexNo: string;
    ddoNO: string;
    adviceAmount: string;
    totalDeduction: string;
    adviceNetAmount: string;
    lcBranchUser: string;
    ddoApproverName: string;
    signVerify: string;
}

export interface NotActivateInLC {
    issueDate: string;
    startingChequeSeries: string;
    endingChequeSeries: string;
}

export interface NotActivateInLCTO {
    issueDate: string;
    startingChequeSeries: string;
    endingChequeSeries: string;
    chequeRequestReceivedDate: string;
}

// export interface ActivatedChequeInLC {
//     activatedDate: string;
//     startingChequeSeries: string;
//     endingChequeSeries: string;
// }

// export interface InactivatedChequeInLC {
//     activatedDate: string;
//     inactivateDate: string;
//     startingChequeSeries: string;
//     endingChequeSeries: string;
// }

export interface ChequebookDetails {
    referenceNumber: string;
    referenceDate: string;
    typeOfRequest: string;
    startingChequeSeries: string;
    endingChequeSeries: string;
    receivedFrom: string;
    receivedDate: string;
    sentTo: string;
    sentDate: string;
    lyingWith: string;
    workFlowStatus: string;
    status: string;
}

export interface ChequebookDetailsTO {
    referenceNumber: string;
    referenceDate: string;
    divisionCode: string;
    divisionName: string;
    typeOfRequest: string;
    startingChequeSeries: string;
    endingChequeSeries: string;
    receivedFrom: string;
    receivedDate: string;
    sentTo: string;
    sentDate: string;
    lyingWith: string;
    status: string;
    workFlowStatus: string;
}

export interface ChequeCancellation {
    
    fundType: string | number;
    chargedVoted: string | number;
    budgetType: string | number;
    demandCode: string | number;
    majoreheadCode: string | number;
    submajorheadCode: string | number;
    minorheadCode: string | number;
    subheadCode: string | number;
    detailheadCode: string | number;
    estimateType: string | number;
    itemCode: string | number;
    objectclassCode: string | number;
    schemeNo: string | number;
    expensitureAmt: string | number;
    hdCnclChqAmt: string | number;
}

export interface chequeCancellationDivision {
    referenceNo: string;
    referenceDate: string;
    chequeNo: string;
    chequeDate: string;
    chequeAmount: string;
    receivedFrom: string;
    receivedDate: string;
    sentTo: string;
    sentDate: string;
    lyingWith: string;
    status: string;
    workflowStatus:string;

}

export interface chequeToChequeEffect {
    referenceNo: string;
    referenceDate: string;
    missingChequeNo:string;
    chequeNo: string;
    chequeDate: string;
    chequeAmount: string;
    receivedFrom: string;
    receivedDate: string;
    sentTo: string;
    sentDate: string;
    lyingWith: string;
    status: string;
    workflowStatus:string;

}

export interface chequeCancellationTO {
    fund: string;
    classOfExpenditure: string;
    budgetType: string;
    schemeNo: string;
    demandNo: string;
    majorHead: string;
    subMajorHead: string;
    minorHead: string;
    subHead: string;
    detailHead: string;
    objectHead: string;
    expenditureAmount: string;
    headwiseCancelChequeAmount: string;
}

export interface chequeCancellationTOListing {
    referenceNo: string;
    referenceDate: string;
    divisionCode: string;
    divisionName: string;
    cardexNo: string;
    ddoNo: string;
    chequeNo: string;
    chequeDate: string;
    chequeAmount: string;
    receivedFrom: string;
    receivedDate: string;
    sentTo: string;
    sentDate: string;
    lyingWith: string;
    status: string;
}

export interface ChequeToChequeEffect {
    chequeDate: Date| string;
    chequeNo: string;
    chequeAmnt: Number | string;
    partyName: string;
    isGenerateChequeNo: boolean;
    isDelete:boolean;
 
}

export interface InwardOnlineAdvice {
    adviceNo: string;
    referenceNo: string;
    adviceDate: string;
    divisionCode: string;
    divisionName: string;
    cardexNo: string;
    ddoNO: string;
    virtualTokenNo: string;
    virtualTokenDate: string;
    adviceAmount: string;
    totalDeduction: string;
    adviceNetAmount: string;
    lcBranchUser: string;
}

export interface AdviceReceipt {
    chequeDate: Date;
    chequeNo: string;
    chequeAmount: string;
    vendorName: string;
    isGenerateChequeNo: boolean;
}
export interface AdviceReceiptAuth {
    chequeDate: Date;
    chequeNo: string;
    chequeAmount: string;
    partyName: string;
}

export interface LcAdviceReceiptEPayment {
    partyName: string;
    bankAccountNumber: string;
    IFSCCode: string;
    epaymentAmount: string;
}

export interface DetailPosting {
    classOfExpenditure: string;
    fund: string;
    budgetType: string;
    schemeNo: string;
    demandNo: string;
    majorHead: string;
    subMajorHead: string;
    minorHead: string;
    subHead: string;
    detailClass: string;
    typeOfEstimation: string;
    itemName: string;
    objectClass: string;
    mapEpayment: string;
    expenditureAmount: string;
    headwiseAvailableAmount: string;
    lcNumber: string;
    search: string;
}

export interface DeductionLCAdvice {
    professionlTax: string;
    laborClass: string;
    forAllMH: string;
    incomeTax: string;
    surcharge: string;
    gpfClassIV: string;
    cpf: string;
    rentOfBldg: string;
    govtInsuranceFund: string;
    insuranceFund: string;
    securityDeposit: string;
    establishmentCharges: string;
    machinaryCharges: string;
}
export interface Deduction {
    professionlTax: string;
    laborClass: string;
    forAllMH: string;
    incomeTax: string;
    surcharge: string;
    gpfClassIV: string;
    rentOfBldg: string;
    govtInsuranceFund: string;
    insuranceFund: string;
    securityDeposit: string;
    establishmentCharges: string;
    machinaryCharges: string;
}

export interface DetailPostingAuthorize {
    fund: string;
    classOfExpenditure: string;
    typeOfExpenditure: string;
    budgetType: string;
    schemeNo: string;
    demandNo: string;
    majorHead: string;
    subMajorHead: string;
    minorHead: string;
    subHead: string;
    detailClass: string;
    typeOfEstimation: string;
    itemName: string;
    objectClass: string;
    expenditureAmount: string;
    headwiseAvailableAmount: string;
}

export interface LcAdviceVerification {
    virtualTokenNo: string;
    virtualTokenDate: string;
    adviceNo: string;
    adviceDate: string;
    divisionCode: string;
    divisionName: string;
    ddoApproverName: string;
    adviceGrossAmount: string;
    totalDeduction: string;
    adviceNetAmount: string;
    receivedFrom: string;
    receivedDate: string;
    sentTo: string;
    sentDate: string;
    lyingWith: string;
    status: string;
    workflowStatus: string;
    AuthorizedReturnedDate: string;
    total: string;
}

export interface LcSavedAdvice {
    refNo: string;
    virtualTokenNo: string;
    virtualTokenDate: string;
    referenceNo: string;
    referenceDate: string;
    adviceNo: string;
    adviceDate: string;
    adviceAmount: string;
    totalDeduction: string;
    adviceNetAmount: string;
    receivedFrom: string;
    receivedDate: string;
    sentTo: string;
    sentDate: string;
    lyingWith: string;
    status: string;
    workflowStatus: string;
    authorizedDate: string;
    printDetails: string;
}

export interface LCRequest {
    requestNo: string;
    ddoCode: string;
    divisionName: string;
    status: string;
}

export interface LCDistribution {
    referenceNo: string;
    referenceDate: string;
    divisionCode: string;
    divisionName: string;
    lcNo: string;
    entryType: string;
    lcAmount: string;
    lcIssueDate: string;
    receivedFrom: string;
    receivedDate: string;
    sentTo: string;
    sentDate: string;
    lyingWith: string;
    status: string;
    authorizedDate: string;
}

export interface LcdistributionInput {
    classOfExpenditure: string;
    fundType: string;
    budgetType: string;
    demandNo: string;
    majorHead: string;
    subMajorHead: string;
    minorHead: string;
    subHead: string;
    detailHead: string;
    TypeOfEstimate: string;
    itemName: string;
    objectHead: string;
    schemeNo: string;
    amount: number;
}

export interface LcVerification {
    divisionCode: string;
    divisionName: string;
    lcNo: string;
    entryType: string;
    lcAmount: string;
    lcIssueDate: string;
    status: string;
    authorizedDate: string;
}

export interface Treasury {
    employeeNumber: string;
    employeeName: string;
}

export interface LcOpeningRequest {
    referenceNo: string;
    referenceDate: Date;
    divisionName: string;
    officeName: string;
    cardexNo: string;
    ddoCode: string;
    ddoName: string;
    circleName: string;
    receivedFrom: string;
    receivedDate: Date;
    sentTo: string;
    sentDate: Date;
    lyingWith: string;
    status: string;
    workflowStatus: string;
}

export interface ActivatedChequeInLC {
    startSeries: number;
    endSeries: number;
    activeDate: Date | string;

}

export interface LcAdvPreparationsaveRequest {
    adviceDate: Date | string,
    adviceNo: number,
    deptId: number,
    districtId: number,
    divCode: number | string,
    bankId: number | string,
    divId: number,
    drawingOfficeId: number,
    id: number,
    lcValidFromDate: Date | string,
    locAdvcSdDto: locAdvcSdDto[],
    officeId: number | string,
    referenceDt: number | string,
    referenceNo: number | string,
    statusId: number,
    wfId: number,
    wfRoleId: number,
    wfUserReqSDDto: wfUserReqSDDto[],
}

export interface wfUserReqSDDto {

    menuId: number | string,
    userId: number | string,
    postId: number | string,
    pouId: number | string,
    officeId: number | string,
    branchId: number | string,
    wfRoleIds: number | string,

}
export interface locAdvcSdDto {

    advcmonth: number | string,
    adviceHdrId: number | string,
    bankAccNo: number | string,
    chequeAmnt: number | string,
    chequeDt: number | Date,
    chequeNo: number | string,
    epayAmnt: number | string,
    ifscCode: number | string,
    partyName: number | string,
    paymentType: number | string,
    sdId: number | string,
    statusId: number | string,
    wfId: number | string,
    wfRoleId: number | string


}

export class adviceReceiveNonEmployee {
    vendorName: string;
    chequeType: string;
    accNo: string | number;
    ifscCode: string;
    branchName: string | number;
    panNo: string | number;
    incomeTaxRate: string | number;
    mobileNo: string | number;
    epayAmt: string | number;
}



export class employeeDetails {
    empNo: string | number;
    gpfNo: string | number;
    empName: string;
    designationName: string;
    empType: string | number;
    accNo: string | number;
    ifscCode: string | number;
    branchName: string;
}



export interface DeductionView {
    ptAmt: string;
    labourAmt: string;
    forAllMhAmt: string;
    itAmt: string;
    surchargeAmt: string;
    gpfClass4Amt: string;
    cpfAmt:string;
    buildingRentAmt: string;
    govtInsuFundAmt: string;
    insuranceFundAmt: string;
    securityDepositAmt: string;
    estdChargeAmt: string;
    machineryChargeAmt: string;
}


export class partyNameDetails {
    partyName: string;
    chqAmnt: string | number;
}