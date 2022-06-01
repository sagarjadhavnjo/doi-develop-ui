import * as moment from 'moment';

export const getMarketListObject = (element) => {
    return {
        dpSheetId: element.id ? element.id : null,
        memoNo: element.memono ? element.memono: '',
        adviceNo: element.adviceNo ? element.adviceNo : '',
        dpDate: element.dpSheetReciveDate ? moment(element.dpSheetReciveDate).format('DD-MMM-YYYY') : '',
        adviceDate: element.adviceDate ? moment(element.adviceDate).format('DD-MMM-YYYY') : '',
        adviceBy: element.adviceBy ? element.adviceBy : '',
        transactionDescription: element.transactionDesc ? element.transactionDesc : '',
        creditAmount: element.creditAmt ? element.creditAmt : '',
        addDetails: element.addDetails ? element.addDetails : true,
        debitAmount: element.debitAmt ? element.debitAmt : ''
    }
}

export const setMarketLoanRequestObject = (reqObj, dpSheetObj) => {
    return {
        "dpSheetId": dpSheetObj.dpSheetId ? dpSheetObj.dpSheetId : null,
        "dpSheetRecvDt": "2021-04-22",
        "isLoanOlder": 47,
        "loanNumber": "CVAmrb",
        "memoNo": dpSheetObj.memoNo,
        "referenceNo": "WruYZ",
        "referenceDt": "2021-04-22T23:10:04",
        "adviceNo": dpSheetObj.adviceNo,
        "adviceDt": dpSheetObj.adviceDate ? moment(reqObj.adviceDate).format('YYYY-MM-DD') : null,
        "adviceBy": dpSheetObj.adviceBy,
        "transactionDesc": dpSheetObj.transactionDescription,
        "sanctionOrderNo": "zSKfecpmKNBCErB",
        "sanctionOrderDt": "2021-05-28T13:41:09",
        "organizationName": "hdGKnABwM",
        "loanReceiptDt": "2021-09-26",
        "loanFinYrId": reqObj.finanacialYear ? reqObj.finanacialYear : null,
        "loanStartDt": reqObj.loanStartDate ? moment(reqObj.loanStartDate).format('YYYY-MM-DD') : null,
        "totAmountRecd": reqObj.totalAmountReceived ? reqObj.totalAmountReceived : '',
        "loanAmount": reqObj.loanAmount ? reqObj.loanAmount : '',
        "premiumAmount": reqObj.premiumAmount ? reqObj.premiumAmount : '',
        "notificationNo": reqObj.notificationNumber ? reqObj.notificationNumber : '',
        "notificationDt": reqObj.notificationDate ? new Date(reqObj.notificationDate) : null,
        "floatationWayId": reqObj.wayOfFloatation,
        "loanTypeId": reqObj.typeOfLoan,
        "newLoanTran": reqObj.loanDescription ? reqObj.loanDescription : '',
        "tranDesc": reqObj.tranche,
        "loanTenure": reqObj.loanTenure,
        "loanRoi": reqObj.interestRate,
        "issueNumber": reqObj.numberOfIssue,
        "moratoriumPeriod": reqObj.moratotiumPeriod,
        "moratrmPncplPerc": reqObj.principalUnderMoratoritum,
        "totRepayInstall": reqObj.totalNumberOfRepaymentInstallments,
        "repayInstallYr": reqObj.numberOfRepaymentInstallmentsPerYear,
        "pncplFirstInstallDt": reqObj.firstInstallmentDate ? moment(reqObj.firstInstallmentDate).format('YYYY-MM-DD') : null,
        "interstInstallYr": reqObj.numberOfInstallmentsinaYear,
        "intrstFirstInstallDt": reqObj.firstInstallmentDateInterest ? moment(reqObj.firstInstallmentDateInterest).format('YYYY-MM-DD') : null,
        "loanMaturityDt": moment().format('YYYY-MM-DD'),
        "loanDeleteDt": moment().format('YYYY-MM-DD'),
        "loanDeleteBy": 2104528942537451462
    }
}

// Loan repayment data model
export const getMarketLoanObject = (element) => {
    return {
        sanctionNo: element.sanctionOrderNo ? element.sanctionOrderNo : '',
        loanSanctionDate: element.sanctionOrderDt ? element.sanctionOrderDt : '',
        loanReceiptDate: element.loanReceiptDt ? element.loanReceiptDt : '',
        loanAmount: element.loanAmount ? element.loanAmount : '',
        loanTenureYears: element.loanTenure ? element.loanTenure : '',
        moratoriumPeriodYears: element.moratoriumPeriod ? element.moratoriumPeriod : '',
        interestRate: element.loanRoi ? element.loanRoi : '',
        select: element.select ? element.select : 'notApproved'
    }
}

export const getNssfRepaymentObject = (element) => {
    return {
        financialYear: element.financialYear ? element.financialYear : '',
        installmentDate: element.installPaidDate ? element.installPaidDate : '',
        openingBalance: element.openingBalanceAmount ? element.openingBalanceAmount : '',
        interest: element.intrestAmount ? element.intrestAmount : '',
        principal: element.principalAmount ? element.principalAmount : '',
        closingBalance: element.closingBalAmount ? element.closingBalAmount : ''
    }
}