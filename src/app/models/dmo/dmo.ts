export class CreditDebitTable {
    transactionsName: string;
    credit: string;
    debit: string;
}

export class TbInvestRediscountTable {
    memoNo: string;
    adviceNo: string;
    adviceDate: string;
    adviceBy: string;
    transaction: string;
    description: string;
    credit: string;
    debit: string;
}

export class LoanReceivedPaidDataSourceTable {
    memoNo: string;
    adviceNo: string;
    adviceDate: string;
    adviceBy: string;
    transaction: string;
    description: string;
    credit: string;
    debit: string;
}

export class WaysAndMeansAdvancesDataSourceTable {
    memoNo: string;
    adviceNo: string;
    adviceDate: string;
    adviceBy: string;
    transaction: string;
    description: string;
    credit: string;
    debit: string;
}

export class OtherIgaTransactionsDataSourceTable {
    memoNo: string;
    adviceNo: string;
    adviceDate: string;
    adviceBy: string;
    transaction: string;
    description: string;
    credit: string;
    debit: string;
}

export class TBillInvestment {
    dateOfInvestment: string;
    dateOfMaturity: string;
    faceValue: string;
    discountValue: string;
    costValue: string;
    yield: string;
}

export class TBillMaturity {
    issueDate: string;
    originalFaceValue: string;
    currentFaceValue: string;
}

export class TBillRediscounting {
    issueDate: string;
    originalFaceValue: string;
    currentFaceValue: string;
    rediscountAmount: string;
    faceValueOfRediscounted: string;
    residualAmount: string;
}

export class Nwma {
    totalOutstandingNwma: string;
    noOfDaysInNwma: string;
    interestRate: string;
    interestPayable: string;
    interestPaid: string;
    perOfNwmaLimitUtilized: string;
}

export class Swma {
    totalOutstandingSwma: string;
    noOfDaysInSwma: string;
    interestRate: string;
    interestPayable: string;
    interestPaid: string;
    perOfSwmaLimitUtilized: string;
}

export class Overdraft {
    totalOutstandingOverdraf: string;
    noOfDaysInOverdraf: string;
    interestRate: string;
    interestPayable: string;
    interestPaid: string;
    perOfOverdrafLimitUtilized: string;
}

export class LoanRepaymentSchedule {
    financialYear: string;
    installmentDate: string;
    openingBalance: string;
    principal: string;
    interest: string;
    closingBalance: string;
}

export class MarketLoanRepaymentSchedule {
    financialYear: string;
    installmentDate: string;
    openingBalance: string;
    principal: string;
    interest: string;
    closingBalance: string;
}

export class MarketLoanReceived {
    memoNo: string;
    adviceNo: string;
    dpDate: string;
    adviceDate: string;
    adviceBy: string;
    transactionDescription: string;
    creditAmount: string;
    addDetails: boolean;
}

export class InstituteLoanApproved {
    accountNo: string;
    loanSanctionDate: string;
    loanReceiptData: string;
    loanAmt: string;
    loanTenure: string;
    moratoriumPeriod: string;
    rate: string;
}
export class MarketLoanApproved {
    sanctionNo: string;
    loanSanctionDate: Date;
    loanReceiptDate: Date;
    loanAmount: string;
    loanTenureYears: string;
    moratoriumPeriodYears: string;
    interestRate: string;
    select: string;
}

export class NssfLoanApproved {
    sanctionNo: string;
    loanSanctionDate: Date;
    loanReceiptDate: Date;
    loanAmount: string;
    loanTenureYears: string;
    moratoriumPeriodYears: string;
    interestRate: string;
    status: string;
}

export class MemoGenerationDetails {
    tranche: string;
    accountNo: string;
    loanAmount: string;
    loanOutstandingAmount: string;
    repaymentDue: string;
    dueDate: Date;
}

export class RemoveLoan {
    loanNo: string;
    loanReceiptDate: Date;
    maturityDate: Date;
    loanAmount: number;
    loanTenureYears: number;
    interestRate: number;
    status: string;
}

export class RbiAdviceForSaleOfSecurities {
  loanNo: string;
  currentFaceValueRs: string;
  faceOfTheSecuritiesSoldRs: string;
  noOfUnitsSold: string;
  salePriceRs: string;
  amountRealizedOnSaleOfSecuritiesRs: string;
  brokenDays: string;
  accuredInterestReceivedForBrokenPeriodRs: string;
  totalAmountReleasedRs: string;
}

export class RbiAdviceForSaleOfSecurities1 {
    securityTypeId: string;
    currFaceValue: string;
    faceValSecSold: string;
    unitsSoldNo: string;
    salesPrice: string;
    saleSecRelzdAmt: string;
    brokenDays: string;
    accrIntrstRecv: string;
    totalRelzdAmt: string;
}

export class PressCommuniqueForPrinciplePayment {
    loanDescription: string;
    notificationNo: string;
    notificationDate: string;
    loanStartDate: string;
    loanAmount: string;
    maturityDate: string;
}

export class MarketLoanRecived {
    memoNo: string;
    deviceNo: string;
    dpDate: string;
    adviceDate: string;
    adviceBy: string;
    transactionDescription: string;
    creditAmount: string;
}

export class LoanListing {
    typeOfTransaction: string;
    referenceNo: string;
    referenceDate: Date;
    receivedFromReceivedOn: Date;
    sentToSentOn: Date;
    lyingWith: string;
    status: string;
    workFlowStatus: string;
}

export class AdviceMasterListing {
    adviceCode: string;
    adviceBy: string;
}
export class GoiDepartmentMinistryNameMaster {
    departmentMinistryName: string;
}
export class SecurityMasterListing {
    nameOfSecurity: string;
}
export class GoiLoanPurposeMaster {
    loanPurpose: string;
    planSchemeName: string;
}
export class BudgetLoanEstimateMaster {
    financialYear: string;
    nssfLoanAmount: string;
    marketLoanAmount: string;
    goiLoanAmount: string;
    instituteLoanAmount: string;
}
export class WmaMaster {
    wmaType: string;
    startDate: string;
    endDate: string;
    limit: string;
    roi: string;
}
export class GuaranteeOrganizationsMaster {
    departmentName: string;
    nameOfOrganization: string;
}
export class MarketLoanRepaymentTreasury {
    startDate: Date;
    loanAmount: string;
    loanDescription: string;
    interestRate: string;
    interestPayable: string;
    treasuryAmount: string;
    paymentDate: string;
}
