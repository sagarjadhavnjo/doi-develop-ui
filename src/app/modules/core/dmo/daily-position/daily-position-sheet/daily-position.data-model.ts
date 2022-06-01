import * as moment from 'moment';

export const getDPListObject = (dpObj, index) => {
    return {
        index: index+1,
        id: dpObj && dpObj.id ? dpObj.id : null,
        memoNo: dpObj && dpObj.memoNo ? dpObj.memoNo : '',
        adviceNo: dpObj && dpObj.adviceNo ? dpObj.adviceNo : '',
        adviceDate: dpObj && dpObj.adviceDate ? dpObj.adviceDate : '',
        adviceBy: dpObj && dpObj.adviceBy ? dpObj.adviceBy : '',
        mainTransaction: dpObj && dpObj.mainTransaction ? dpObj.mainTransaction : '',
        transaction: dpObj && dpObj.transactTypeId ? dpObj.transactTypeId : '',
        description: dpObj && dpObj.transactionDesc ? dpObj.transactionDesc : '',
        debit: dpObj && dpObj.debitAmt ? dpObj.debitAmt : '',
        credit: dpObj && dpObj.creditAmt ? dpObj.creditAmt : '',
        dpSheetDate: dpObj.dpSheetDate ? dpObj.dpSheetDate : '',
        paymentTypeDesc: dpObj.paymentTypeDesc ? dpObj.paymentTypeDesc : '',
        paymentTypeId: dpObj.paymentTypeId ? dpObj.paymentTypeId : ''
    }
}

export const setDPListRecord = (dpFormObj, dbCrList, dpListObj) => {
    return {
        id: dpFormObj.id ? dpFormObj.id : null,
        dpSheetReciveDate: moment(dpFormObj.date).format('YYYY-MM-DD'),
        dpSheetDate: moment(dpFormObj.lastDpDate).format('YYYY-MM-DD'),
        gogCode: dpFormObj.code ? dpFormObj.code : 104,
        openBalDr: dbCrList[0].debit ? parseFloat(dbCrList[0].debit) : 0,
        openBalCr: dbCrList[0].credit ? parseFloat(dbCrList[0].credit) : 0,
        padTransDr: dbCrList[1].debit ? parseFloat(dbCrList[1].debit) : 0,
        padTransCr: dbCrList[1].credit ? parseFloat(dbCrList[1].credit) : 0,
        padMumbGstDr: dbCrList[2].debit ? parseFloat(dbCrList[2].debit) : 0,
        padMumbGstCr: dbCrList[2].credit ? parseFloat(dbCrList[2].credit) : 0,
        agencyBankDr: dbCrList[3].debit ? parseFloat(dbCrList[3].debit) : 0,
        agencyBankCr: dbCrList[3].credit ? parseFloat(dbCrList[3].credit) : 0,
        memoNo: dpFormObj.memoNo ? dpFormObj.memoNo : '',
        debitAmount: 4985,
        creditAmount: 888,
        totalDebitAmount: 592,
        totalCreditAmount: 8022,
        closMinBal: parseFloat(dpFormObj.closingMinimumBalance),
        tBill14DBal: parseFloat(dpFormObj.fourteenDayTbillBalance),
        dpSheetDtos: setDtos(dpFormObj.id, dpListObj)
    }
}

const setDtos = (id, reqObj) => {
    const listArr = [];
    reqObj.forEach(element => {
        if(element.transaction) {
            listArr.push({
                id:element.id ? element.id : null,
                parentDpSheetId: id ? id : null,
                adviceNo: element.adviceNo ? element.adviceNo : '',
                adviceDate: moment(element.adviceDate).format('YYYY-MM-DD'),
                adviceBy: element.adviceBy ? element.adviceBy : '',
                dpSheetDate: element.dpSheetDate ? element.dpSheetDate : '',
                paymentTypeId: element.paymentTypeId ? element.paymentTypeId : '',
                paymentTypeDesc: element.paymentTypeDesc ? element.paymentTypeDesc : '',
                transactTypeId: element.transaction ? parseInt(element.transaction) : null,
                transactionDesc: element.description ? element.description : '',
                creditAmt: element.credit ? element.credit : 0,
                debitAmt: element.debit ? element.debit : 0,
                memoNo: element.memoNo ? parseInt(element.memoNo) : ''
            })
        }
    });
    return listArr;
}