import * as moment from 'moment';

export const getDPListObject = (element) => {
    return {
        dpSheetId: element.id ? element.id : null,
        memoNo: element.memoNo ? element.memoNo: '',
        adviceNo: element.adviceNo ? element.adviceNo : '',
        dpSheetReciveDate: element.dpSheetReciveDate ? moment(element.dpSheetReciveDate).format('DD-MMM-YYYY') : '',
        dpDate: element.dpSheetReciveDate ? moment(element.dpSheetReciveDate).format('DD-MMM-YYYY') : '',
        adviceDate: element.adviceDate ? moment(element.adviceDate).format('DD-MMM-YYYY') : '',
        adviceBy: element.adviceBy ? element.adviceBy : '',
        transactionDescription: element.transactionDesc ? element.transactionDesc : '',
        creditAmount: element.creditAmt ? element.creditAmt : '',
        addDetails: element.addDetails ? element.addDetails : 'Add Details',
        debitAmount: element.debitAmt ? element.debitAmt : ''
    }
}

export const setDPRequestObject = (reqObj) => {
    return {
        "dpSheetId": reqObj.dpSheetId ? reqObj.dpSheetId : '',
        "dpSheetRecDate": moment(reqObj.dpSheetReciveDate).format('YYYY-MM-DD'),
        "memono": reqObj.memoNo ? reqObj.memoNo : '',
        "adviceNo": reqObj.adviceNo ? reqObj.adviceNo : '',
        "adviceDate": reqObj.adviceDate ? moment(reqObj.adviceDate).format('YYYY-MM-DD') : '',
        "adviceBy": reqObj.adviceBy ? reqObj.adviceBy : '',
        "transactionDesc": reqObj.transactionDescription ? reqObj.transactionDescription : '',
        "creditAmount": reqObj.creditAmount ? reqObj.creditAmount : '',
        "sanctionOrderNo": reqObj.sanctionNo ? reqObj.sanctionNo : '',
        "organizationName": reqObj.organizationName ? reqObj.organizationName : '',
        "sanctionOrderDate": reqObj.sanctionDate ? reqObj.sanctionDate : '',
        "loanReceiptDate": reqObj.loanReceiptDate ? moment(reqObj.loanReceiptDate).format('YYYY-MM-DD') : '',
        "loanStartDate": reqObj.sanctionDate ? moment(reqObj.sanctionDate).format('YYYY-MM-DD') : '',
        "loanAmount": reqObj.loanAmount ? reqObj.loanAmount : '',
        "loanTenure": reqObj.loanTenure ? reqObj.loanTenure : '',
        "moratariumPeriod": reqObj.moratoriumPeriod ? reqObj.moratoriumPeriod : '',
        "loanROI": reqObj.rateOfInterest ? reqObj.rateOfInterest : '',
        "prncplInstallYear": reqObj.principalInstalmentsInYear ? reqObj.principalInstalmentsInYear : '',
        "totalPrncplInstall": reqObj.principalTotalNoOfInstalments ? reqObj.principalTotalNoOfInstalments : '',
        "intrestInstallYear": reqObj.interestInstalmentsInYear ? reqObj.interestInstalmentsInYear : '',
        "firstInstallDate": moment().format('YYYY-MM-DD')
    }
}

// Loan repayment data model
export const getNssfPaybleObject = (element) => {
    return {
        loanNo: element.loanNumber ? element.loanNumber : '',
        dueDate: element.installDueDate ? element.installDueDate : '',
        dpDate: element.openingBalanceAmount ? element.openingBalanceAmount : '',
        interest: element.intrestAmount ? element.intrestAmount : '',
        principal: element.principalAmount ? element.principalAmount : '',
    }
}

export const getNssfRepaymentObject = (element) => {
    return {
        rePaymentNo: element.rePaymentNo ? element.rePaymentNo : '',
        financialYear: element.financeYearId ? element.financeYearId : '',
        installmentDate: element.installDueDate ? moment(element.installDueDate).format('DD-MMM-YYYY') : '',
        openingBalance: element.openingBalanceAmount ? element.openingBalanceAmount : '',
        interest: element.intrestAmount ? element.intrestAmount : '',
        principal: element.principalAmount ? element.principalAmount : '',
        closingBalance: element.closingBalAmount ? element.closingBalAmount : ''
    }
}