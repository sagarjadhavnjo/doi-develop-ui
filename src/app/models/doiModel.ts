
export class ListValue {
    value: string;
    viewValue: string;
}
export class BrwoseData {
    name: string;
    file: string;
    uploadedBy: string;
}
export class AttachmentData {
    attachmentType: undefined | string;
    name: undefined | string;
    file: undefined | string;
}

export class MasterEntry {
    schemeName: string;
    srNo: string;
    schemeNameGuj: string;
    schemeShortname: string;
    nodalOffice: string;
    claimAmt: string;
    createdOn: string;
    updatedOn: string;
    status: Boolean;
}

export class JPAPendingApproval {
    srno: string;
    claimId: string;
    policyNo: string;
    scheme: string;

    DecPersonName: string;
    applicantName: string;
    district: string;
    taluka: string;
    claimEnterDate: string;
    status: string;
    action: string;
}

export class JPAPendingApprovalListing {
    srno: string;
    claimId: string;
    policyNo: string;
    scheme: string;
    DecPersonName: string;
    applicantName: string;
    district: string;
    taluka: string;
    claimEnterDate: string;
    status: string;
    remarks: string;
    action: string;
}

export class JPAREJECTION {
    srno: string;
    claimId: string;
    policyNo: string;
    scheme: string;
    DecPersonName: string;
    applicantName: string;
    district: string;
    taluka: string;
    claimEnterDate: string;
    status: string;
    remarks: string;
    sendOn: string;
    fieldName: string;
    sendBy: string;
    action: string;
}

export class JPAPendingSendForPayment {
    srno: string;
    claimId: string;
    policyNo: string;
    scheme: string;
    DecPersonName: string;
    applicantName: string;
    district: string;
    taluka: string;
    inwardNo: string;
    status: string;
    remarks: string;
    action: string;
}

export class BankBranch {
    srno: string;
    bankName: string;
    branchName: string;
    ifscCode: string;
    district: string;
    taluka: string;
    action: string;
}

export class MasterPolicy {
    srno: string;
    plocyNo: string;
    scheme: string;
    startDate: string;
    endDate: string;
    numberofBenificiaries: string;
    premiumAmount: string;
    death: string;
    fiftyDiablity: string;
    hundredDisablity: string;
    action: string;
}

export class JPALEGAL {
    srno: string;
    district: string;
    inwardNo: string;
    inwardDate: string;
    courtCaseNo: string;
    courtCaseDate: string;
    courtDetail: string;
    claimId: string;
    ploicyNo: string;
    scheme: string;
    applicantName: string;
    nameofDeceasedPerson: string;
    detailofQuery: string;
    dateOfAci: string;
    courtDecision: string;
    status: string;
    action: string;
}

export class DOcumentElement {
    scheme: string;
    policy: string;
    document: string;
    requirement: string;
}

export class DocumentCasu {
    causeName: string;
    document: string;
    requirement: string;
}

export class DocumentRequirement {
    document: string;
    requirement: string;
}

export class JPLLegalReq {
    srno: string;
    district: string;
    courtCaseNo: string;
    courtCaseDate: string;
    courtDetail: string;
    claimId: string;
    ploicyNo: string;
    scheme: string;
    applicantName: string;
    detailofQuery: string;
    nameofDeceasedPerson: string;
    dateOfAci: string;
    courtDecision: string;
    status: string;
    action: string;
}

export class CashBook {
    date: string;
    srNoOdSubVoucherNo: string;
    paidTo: string;
    receiptToBeCredited: string;
    payAndAllowance: string;
    advance: string;
    travelAllowance: string;
    total: string;
    permanentAdvance: string;
    amtDrawn: string;
    misc: string;
    majorHead: string;
    subMajorHead: string;
    minorHead: string;
    subHead: string;
}

export class CashBookReciver {
    rdate: string;
    srNoOfBill: string;
    receivedFrom: string;
    chequeNo: string;
    receiptToBeCredited: string;
    payAndAllowance: string;
    advance: string;
    travelAllowance: string;
    permanentAdvance: string;
    amtDrawn: string;
    misc: string;
    total: string;
    majorHead: string;
    subMajorHead: string;
    minorHead: string;
    subHead: string;
    ddNo: string;
}

export class LEgalEntryRequest {
    srno: string;
    district: string;
    courtCaseNo: string;
    courtCaseDate: string;
    courtDetail: string;
    claimId: string;
    ploicyNo: string;
    scheme: string;
    applicantName: string;
    detailofQuery: string;
    nameofDeceasedPerson: string;
    dateOfAci: string;
    courtDecision: string;
    status: string;
    action: string;
}

export class PolicyProposalLettter {
    policyType: string;
    sumInsured: string;
    types: string;
    coverage: number;
    unit: string;
}

export class PolicyProposalOffer {
    proposerName: string;
    district: string;
    taluka: string;
    referenceNo: string;
    proposalDate: Date;
}

export class PolicyOfferView {
    policyType: string;
    sumInsured: string;
    types: string;
    coverage: number;
    unit: string;
    premiumAmountAddOn: number;
    premiumAmountPolicy: number;
}

export class PaymentDetails {
    paymentType: string;
    paymentDate: Date;
    bankName: string;
    chequeDdDate: Date;
    chequeDdNo: string;
}

export class PolicyMasterListing {
    policyNo: string;
    insuredName: string;
    district: string;
    taluka: string;
    createdOn: Date;
    status: string;
}

export class ClaimEntryListing {
    policyNo: string;
    insuredName: string;
    claimCreatedOn: Date;
    claimAmount: number;
    status: string;
}

export class ClaimEntryPropertyDetails {
    serialNo: string;
    itemDescription: string;
    actualValue: number;
    valueAtLossTime: number;
    amountClaim: number;
}

export class ClaimEntryPreviousLoss {
    claimYear: string;
    claimDescription: string;
    claimAmount: number;
}

export class AttachmentTypeList {
    attachmentType: string;
    type?: string;
}

export class ClaimEntryListingApplicationAccepted {
    policyNo: string;
    insuredName: string;
    policyType: string;
    district: string;
    taluka: string;
    claimEnteredDate: Date;
    claimAmount: Number;
    status: string;
}

export class ClaimEntryListingSendForApproval {
    policyNo: string;
    insuredName: string;
    claimCreatedOn: Date;
    claimAmount: Number;
    claimPendingWith: string;
    designation: string;
    status: string;
}

export class ClaimEntryListingSendForPayment {
    policyNo: string;
    claimId: number;
    insuredName: string;
    policyType: string;
    district: string;
    taluka: string;
    inwardNo: number;
    claimAmount: number;
    status: string;
}

export class ClaimInvestigationSurveyor {
    serialNo: string;
    itemDescription: string;
    actualValue: number;
    valueAtLossTime: number;
    amountClaim: number;
    surveyorRemarks: string;
}

export class CoInsuranceClaimDetails {
    particulars: string;
    percentage: string;
    claimAmount: number;
    surveyorAmount: number;
}

export class CoInsuranceReInsurer {
    particulars1: string;
    percentage1: string;
}

export class CoInsuranceNetGifLiability {
    claimAmount2: string;
    surveyorAmount2: string;
    total2: string;
}

export class CoInsuranceClaimEntryListing {
    claimId: string;
    policyNo: string;
    leaderName: string;
    insuredName: string;
    claimAmountLeader: string;
    claimAmountGif: string;
    status: string;
}

export class PremiumRefundEntry {
    leaderName: string;
    policyNo: string;
    period: string;
    premiumAmount: string;
    refundAmount: string;
    reason: string;
    majorHead: string;
    subMajorHead: string;
    minorHead: string;
}

export class PremiumRefundListing {
    claimId: string;
    policyNo: string;
    leaderName: string;
    insuredName: string;
    premiumAmount: string;
    refundAmount: string;
    reason: string;
    majorHead: string;
    subMajorHead: string;
    minorHead: string;
    status: string;
}

export class BurglaryHouseBreaking {
    particulars: string;
    sumInsured: number;
    ratePercent: number;
    premium: number;
}

export class TalukaList {
    value: string;
    district: string;
    viewValue: string;
}

export class Note1 {
    column1: string;
    column2: string;
}

export class Note2 {
    column1: string;
    column2: string;
    column3: string;
    column4: string;
    column5: string;
}

export class CoInsuranceDetails {
    particulars: string;
    oic: string;
    uii: string;
    nia: string;
    other: string;
}

export class EquipmentDetails {
    details: string;
    quantity: string;
    description: string;
    yearOfManufacture: string;
    equipmentHiredPurchased: string;
    sumInsured: string;
    excessAsOfClaimAmount: string;
}

export class ProposerDetails {
    riskLocation: string;
    address: string;
    pinCode: string;
}

export class PartThreePolicyDetails {
    premiumStartDate: string;
    premiumEndDate: string;
    premium: string;
    claims: string;
}

export class BuildingWiseValue {
    descriptionOfBlock1: string;
    buildingIncludingPath: string;
    ma: string;
    ffOtherEquipment: string;
    ssp: string;
    propertyInsuredSeparately: string;
    total: string;
    age: string;
    height: string;
    construction: string;
}

export class TotalSumInsured {
    particulars: string;
    clausePerilCode: string;
    riskCode: string;
    rateCode: string;
    rate: string;
    sumInsured: string;
    premium: string;
    riskCode1: string;
    rateCode1: string;
}

export class TalukaList1 {
    value: string;
    district: string;
    districtadd: string;
    nodalDistrict: string;
    viewValue: string;
}

export class PartyMasterOfficeDetails {
    officeType: string;
    officeName: string;
    officeAddress: string;
    district: string;
    taluka: string;
    city: string;
    pinCode: string;
}

export class PartyMasterLocationDetails {
    locationType: string;
    locationName: string;
    locationAddress: string;
    district: string;
    taluka: string;
    city: string;
    pinCode: string;
}

export class PartyMasterBankDetails {
    bankName: string;
    branchName: string;
    ifscCode: string;
    accountNo: string;
    paymentPrefered: string;
}

export class PartyMasterListing {
    partyType: string;
    partyName: string;
    address: string;
    officeLocationName: string;
    addrerss: string;
    contactNo: string;
    emailId: string;
    paymentPreferred: string;
    status: Boolean;
}

export class ReInsurancePolicyMaster {
    riCompanyName: string;
    location: string;
    share: string;
    premiumAmount: string;
    challanNo: string;
    challanDate: string;
    remarks: string;
}

export class SurveyorMasterListing {
    surveryorName: string;
    surveryorFirmName: string;
    address: string;
    district: string;
    taluka: string;
    contactNo: string;
    emailId: string;
    paymentPreferred: string;
    status: string;
}
export class PremiumSubsidiary {
    noOfPolicy: string;
    grossPremium: string;
    refund: string;
    premiumAfterRefund: string;
    terrosim: string;
    totalT1: string;
    gifShare: string;
    grossPremiumGif: string;
    refundGif: string;
    netGross: string;
    terrosimGif: string;
    totalT2: string;
    coinsurerShare: string;
    gicShare: string;
    companyName: string;
    reInsurance: string;
    amt: string;
    coInsuranceCompany: string;
    coInsuranceAmt: string;
    net: string;
}
export class ClaimSubsidiary {
    insuredName: string;
    risk: string;
    chequeNo: string;
    chequeDate: string;
    adj: string;
    claimAmount: string;
    gifSharePercent: string;
    gifShareAmt: string;
    gicPercent: string;
    gicAmt: string;
    reInsurance: string;
    gifNet: string;
    remarks: string;

}
export class FireSummary {
    month: string;
    grossShare: string;
    gifShare: string;
    gic: string;
    liberty: string;
    icici: string;
    royal: string;
    shriram: string;
    net: string;
}
export class MarineCargo {
    month: string;
    grossShare: string;
    gifShare: string;
    gic: string;
    reInsurance: string;
    net: string;
    gif: string;
    reIns: string;
    adj: string;
    net1: string;
}

export class MiscSummary {
    month: string;
    grossShare: string;
    gifShare: string;
    gic: string;
    reInsurance: string;
    coIns: string;
    net: string;
    gif: string;
    reIns: string;
    adj: string;
    net1: string;
}

export class TreasurySchedule {
    challanNo: string;
    treasury: string;
    amt: string;
    newIndia: string;
    united: string;
    oriental: string;
    national: string;
    gst: string;
    gic: string;
    gpa: string;
    royal: string;
    liberty: string;
    universal: string;
    iffco: string;
    direct: string;
    hbaCheq: string;
    hbaChallan: string;
}