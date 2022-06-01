import { LongDateFormatKey } from "moment";

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
    schemeId: number;
    schemeNameGuj: string;
    schemeShortname: string;
    nodalOffice: string;
    nodelOfficeId: number;
    schemeStatusId: number;
    claimAmount: number;
    createdDate: string;
    updatedDate: string;
    status: number;
    maximumAgeRange: number;
    minimumAgeRange: number;
    remarks: string;
    referenceNo: string;
    referenceDate: string;
    activeStatus: number;
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
export class JpaLegalDetails {
    legalEntryId: number;
    inwardDt: string;
    inwardNo: string;
    jpaClaimId: string;
    referenceDt: string;
    referenceNo: string;
    jpaLegalDtlDTO:  Array<JpaLegal>=[];
}

export class JpaLegal {
    legalDtlsId: number;
    accidentDeathDt: string;
    appealAdmtDt: string;
    appealNo: string;
    appealPaidId: number;
    appealRemarks: string;
    commissionType: string;
    courtDecision: string;
    courtOrderDt: string;
    srno: string;
    district: string;
    inwardNo: number;
    inwardDate: string;
    caseNo: string;
    courtCaseDt: string;
    courtDetail: string;
    claimNumber: string;
    courtCaseNo:string;
    policyNo: string;
    scheme: string;
    schemeType: string;
    applicantName: string;
    nameofDeceasedPerson: string;
    detailOfQuery: string;
    dateOfAccident: string;
    status: string;
    action: string;
    replyVal: string;
    replayDate: string;
    courtDesc: string;
    rpAdmitDate: string;
    revisionPetitionNo: number;
    orderStatus: boolean;
    appealPaid3: number;
    payMode: number;
    paidChequeNo: number;
    ddNo: number;
    paidDate: string;
    paidAmount: number;
    nameOfDese: string;
    doiJpaLegalOthrPaymentDTO :  Array<OtherPayment>=[] ;
    courtTypeId: string;
    deadPersonName: string;
    depPaymntModeId: string;
    depositAmount: number;
    depositDt: string;
    districtCaseNo: string;
    districtId: number;
    orderStatusId: number;
    paidPaymntModeId: number;
    paymentAmount: number;
    paymentDt: string;
    policyNum: string;
    queryDetails: string;
    refPaymntModeId: number;
    refundAmount: number;
    refundDt: string;
    replayDt: string;
    replyDetails:string;
    revPetitionNo: string;
    rpAdmtDt: string;
    schemeId:number;
    cmaNo: string;
    createModeON: string;
    updatedDate: string;
    personName: string;
    paymentModeId:string;
}

export class OtherPayment {
    id: number;
    payMode: string;
    paidRefNo: string;
    paidChequeNo: string;
    ddNo: number;
    paidDate:string;
    paidAmount: number;
    paymentRemarks: string;
    othrPaymntsId: number;
    chequeDt: string;
    chequeNum: number;
    commissionType: string;
    ddNum: number;
    paymentAmount: number;
    paymentModeId: number;
    referenceNo: string;
    remarks: string;

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
    legalEntryId:number;
    legalDtlsId:number;
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
    coinsPremRefundId:number;
	insuredName:string;
	leaderId:number;
	leaderName:string;
	leaderPolicyNo:string;
	majorheadId:number;
	minorheadId:number;
	policyEndDt:any;
	policyStartDt:any;
	premiumAmount:string;
	referenceDt:any;
	referenceNo:string;
	refundAmount:string;
	refundAmountWords:string;
	refundReason:string;
	submajorheadId:number;
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

export class JpaClaimsEntryBase {
    personTypeId: number;
    disableTypeId: number
    isNodlJtaEntry: string;
    policyNum: string;
    personName: string;
    aadharNum: number;
    fatherHusbName: string;
    motherWifeName: string;
    maritalTypeId: number;
    communicateAddr: string;
    dobDt: string;
    accidentDt: string;
    deathDisableDt: string;
    lossCauseId: number;
    isPersonDriving: number;
    isApplicantSame: number;
    isNodalSame: number;
    schemeId: number;
    isSentForPay: number;
    isPaymentDone: number;
    claimStatus: string;
    month: string;
    year: string;
}

export class JpaClaimsEntry extends JpaClaimsEntryBase {
    districtId: number;
    talukaId: number;
    villageId: number;
    pincode: number;
    genderId: number;
    ageOnDeath: number;
    accidentPlace: string;
    drvLicenseNum: string;
    applicantName: string;
    applAadharNum: number;
    applicantAddr: string;
    applRelationId: number;
    appDistrictId: number;
    appTalukaId: number;
    appVillageId: number;
    appPincode: number;
    appBankId: number;
    appBankName: string;
    appBranchId: string;
    bankIfscCode: string;
    appMobileNo: number;
    fromDate: string;
    toDate: string;
    nodalTalukaId: number;
    nodalVillageId: number;
    nodalPincode: number;
    schemeName: string;
    deceasedRegRelId: string;
    nodalOfficerName: string;
    claimAmount: number;
    inwardId: string;
    inwardNo: string;
    inwardDt: string;
    inwardAcceptDt: string;
    claimMonthId: string;
    claimYearId: string;
    claimGenerateDt: string;
    claimNumber: string;
    claimStatusId: string;
    claimStatus: string;
    claimAcceptDt: string;
    claimAcceptById: string;
    currReccomdType: string;
    claimEntryStatus: string;
    transactionId: string;
    chequeNum: string;
    paymentDt: string;
    paidAmount: string;
    referenceNo: string;
    referenceDt: string;
}

export class JpaMasterEntry {
    clID: string;
    clDate: string;
    disabledDied: string;
    PersonDisabllity: string;
    nameOfApplicant: string;
    adharNo: string;
    fatherName: string;
    motherName: string;
    maritalStatus: string;
    commAdd: string;
    district: string;
    taluka: string;
    pincode: string;
    village: string;
    gender: string;
    dateOfBirth: string;
    dateOfAccident: string;
    dateOfisability: string;
    ageOnDeath: string;
    placeofAccident: string;
    causeofLoss: string;
    driveVEhicle: string;
    licenseNo: string;
    fullName: string;
    farmer: string;
    applicantNo: string;
    applicantADD: string;
    relationPerson: string;
    pincodeadd: string;
    districtadd: string;
    talukaadd: string;
    villageadd: string;
    banName: string;
    bankBranch: string;
    bankAccount: string;
    nameOfApp: string;
    bankIFSC: string;
    mobileNo: string;
    inwardDate: string;
    inwardNo: string;
    dateOfDisability: string;
    claimAmount: string;
    nodalDistrict: string;
    nodalTaluka: string;
    nodalOffice: string;
    ploicyNo: string;
    schemeType: string;
    recomnded: string;
    deathCertiNo: string;
    deathCertiDate: string;
    aadharAvail: string;
    availDoc: string;
    docNo: string;
    licType: string;
    valDateTo: string;
    valDateFrom: string;
    permAdd: string;
    mobileNoAlt: string;
    email: string;
    nodalEmail: string;
}

export class JpaMasterClaimEntryRequest {
    claimStatus: string;
    personTypeId: number;
    disableTypeId: string;
    isAdharAvaliable: boolean;
    personName: string;
    aadharNum: string;
    fatherHusbName: string;
    motherWifeName: string;
    maritalTypeId: string;
    districtId: string;
    talukaId: string;
    villageId: string;
    genderId: string;
    dobDt: string;
    accidentDt: string;
    deathDisableDt: string;
    ageOnDeath: number;
    accidentPlace: string;
    lossCauseId: string;
    deathCertificateNumber: string;
    deathCertificateDate: string;
    driveVehicle: number;
    licenseNo: string;
    licType: number;
    valDateTo: string;
    valDateFrom: string;

    applicantName: string;
    applAadharNum: string;
    communicateAddr: string;
    applicantAddr: string;
    applRelationId: string;
    appDistrictId: string;
    appTalukaId: string;
    appVillageId: string;
    appPincode: string;

    applicantAddPer: string;
    districtAddPer: string;
    talukaAddPer: string;
    villageAddPer: string;
    pincodeAddPer: string;
    
    appBankId: string;
    appBranchId: string;
    appBankName: string;
    appBankAccountNo: string;
    appNameInBank: string;
    bankIfscCode: string;
    appMobileNo: number;
    appMobileNoAlt: number;
    appEmail: string;

    nodalDistrictId: string;
    nodalTalukaId: string;
    schemeId: string;
    schemeName: string;
    nodalOfficer: string;
    nodalEmailAddress: string;
    policyNum: string;
    claimAmount: number;
    inwardNumber: number;
    inwrdDate: string;

    isNodlJtaEntry: number = 1;

}

export class CheckRegister {
    agentCommission: number;
    riskTypeId: string;
    challanNo: string;
    challanDt: string;
    challanAmount: number;
    transChequeAmount: number;
    chequeDt: string;
    chequeNo: string;
    chequeTypeId: string;
    bankId: string;
    branchId: string;
    doBoPlace: number;
    receivedFrom: string;
    
}

export class CoInsuranceClaimEntry {
    coinsClaimId: string;
    acceptedPolDtls: string;
    challanAmt: number;
    challanDt: any;
    claimAmount: number;
    claimAmountGif: string;
    claimDesc: string;
	claimFormPageNo:number;
	claimStatus: string;
	claimStatusId:number;
	coinsClaimDt:any;
	coinsClaimNo: string;
	coinsPolicyHdrId:number;
	coinsPolicyNo: string;
	damageDt:any;
	damageReason: string;
	dmamgeScalpAmt:number;
	doiRespPageNo:number;
	gifClaimAmt:number;
	gifClaimPerc:any;
	gifSharePerc:number;
	gifSurveyAmt:number;
	gifTotAmt:number;
	insuredAddress: string;
	insuredName: string;
	intimClaimAmt:number;
	intimClaimPerc:any;
	intimSurveyAmt:number;
	intimTotAmt:number;
	intimationDt:any;
	intimationThruId:number;
	isClaimFormRecv:number;
	isClaimUnderInv:number;
	isDoiResponsible:number;
	isSurveyRepRecv:number;
	isTpClaimRecv:number;
	leaderAddress: string;
	leaderClaimAmt:number;
	leaderClaimId: string;
	leaderEmail: string;
	leaderId:number;
	leaderName: string;
	leaderPaidPerc:any;
	leaderPhone: string;
	leaderPolicyNo: string;
	leaderSurveyAmt:number;
	leaderTotAmt:number;
	netClaimAmt:number;
	policyEndDt:any;
	policyStartDt:any;
	policyTypeId:number;
	premPaidChallanDt:any;
	premiumAmt:number;
	premiumShareAmt:number;
	railReceiptDt:any;
	railReceiptNo: string;
	receivedAmt:number;
	referenceDt:any;
	referenceNo: string;
	remarks: string;
	riskLocation: string;
	sumInsuredAmt:number;
	surveyRepPageNo:number;
	totClaimAmt:number;
	totSurveyAmt:number;
	doiCoinsClaimRiDtl:any;
}

export class CiPremiumRegister {
    coinsPremiumId:number;
    agencyCommAmt:number;
    cessionToGicAmt:number;
    cessionToGicPc:number;
    challanAmount:number;
    challanDt:any;
    challanNo: string;
    coinsSharePrem:number;
    coinsSharePremPc:number;
    endorsementNo: string;
    excessPremAmt:number;
    facRiPremAmt:number;
    facRiPremPc:number;
    gifPremAmt:number;
    gifPremPc:number;
    gifTerrorPoolAmt:number;
    gifTerrorPremPc:number;
    grossSiAmt:number;
    insurCompId:number;
    insurCompLoc: string;
    insurCompLocId:number;
    insurCompName: string;
    insurCompOffc: string;
    insurCompOffcId:number;
    insuranceEndDt:any;
    insuranceStartDt:any;
    insuredName: string;
    netGifShare:number;
    policyNo: string;
    policyTypeId:number;
    prem100pcAmt:number;
    premMonthId:number;
    premRecvEndDt:any;
    premRecvStartDt:any;
    premYearId:number;
    referenceDt:any;
    referenceNo: string;
    remarks: string;
    riskLocation: string;
    riskTypeId:number;
    shortPremAmt:number;
    terrorPremAmt:number;
    totGifPremium:number;
    totPremAmt:number;    
}

export class RiPremiumRegister {
    riPremiumId:number;
    agencyCommAmt:number;
    gicShareAmt:number;
    gicSharePc:number;
    challanAmount:number;
    challanDt:any;
    challanNo: string;
    coinsSharePrem:number;
    coinsSharePremPc:number;
    endorsementNo: string;
    excessPremAmt:number;
    gifPremAmt:number;
    gifPremPc:number;
    gifTerrorPoolAmt:number;
    gifTerrorPremPc:number;
    grossSiAmt:number;
    insurCompId:number;
    insurCompLoc: string;
    insurCompLocId:number;
    insurCompName: string;
    insurCompOffc: string;
    insurCompOffcId:number;
    insuranceEndDt:any;
    insuranceStartDt:any;
    insuredName: string;
    netGifShare:number;
    policyNo: string;
    policyTypeId:number;
    grossPremAmt:number;
    premMonthId:number;
    premRecvEndDt:any;
    premRecvStartDt:any;
    premYearId:number;
    referenceDt:any;
    referenceNo: string;
    riPremAmt: number;
    riPremPc: number;
    remarks: string;
    riskLocation: string;
    riskTypeId:number;
    shortPremAmt:number;
    terrorPremAmt:number;
    totGifPremium:number;
    totPremAmt:number;    
}


export class ReInsuranceClaimRecovery {
    riClaimId: number;
    claimAmount: number;
    claimId: string;
    claimStatus: string;
    claimStatusId: number;
    gifShareAmt: number;
    gifSharePerc: number;
    insuredName: string;
    leaderName: string;
    policyNo: string;
    referenceDt: any;
    referenceNo: string;
    riClaimDt: any;
    doiRiClaimDtl: any;
}

export class ReInsurancePolicyMasterEntry {
    riPolicyHdrId: number;
    agencyCommissPc: number;
    commissionAmt: number;
    departmentId: number;
    departmentName: string;
    insurEndDt: any;
    insurStartDt: any;
    insuredAddress: string;
    insuredName: string;
    policyNo: string;
    policyTypeId: number;
    premiumAmount: number;
    referenceDt: any;
    referenceNo: string;
    riskLocation: string;
    riskLocationId: number;
    sumInsuredAmt: number;
    doiRiPolicyDtl: any;
}