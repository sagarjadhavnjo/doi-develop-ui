import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { MaterialModule } from '../../material-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { CommonProtoModule } from '../../common/common.module';
import { DoiRoutingModule } from './doi-routing.module';
/*import { JpaClaimEntryComponent, ValidationDialogComponent } from './jpa/jpa-claim-entry/jpa-claim-entry.component';
import { MasterClaimEntryComponent } from './jpa/master-claim-entry/master-claim-entry.component';
import { JpaPendingApprovalListingComponent } from './jpa/jpa-pending-approval-listing/jpa-pending-approval-listing.component';

import { JpaMasterFromBankBranchComponent } from './jpa/jpa-master-from-bank-branch/jpa-master-from-bank-branch.component';
import { JpaMasterPolicyComponent } from './jpa/jpa-master-policy/jpa-master-policy.component';
import { JpaApprovalListingComponent } from './jpa/jpa-approval-listing/jpa-approval-listing.component';
import { JpaRejectionListingComponent } from './jpa/jpa-rejection-listing/jpa-rejection-listing.component';
import { HbaProposalComponent } from './hba/hba-proposal/hba-proposal.component';
import { JpaSendForPaymentListingComponent } from './jpa/jpa-send-for-payment-listing/jpa-send-for-payment-listing.component';
import { JpaPendingApplicationListingComponent } from './jpa/jpa-pending-application-listing/jpa-pending-application-listing.component';
import { JpaLegalEntryComponent } from './jpa-legal-entry/jpa-legal-entry.component';
import { DocumentMasterComponent } from './jpa/document-master/document-master.component';
import { JpaLegalListingComponent } from './jpa-legal-listing/jpa-legal-listing.component';
import { DeadStockRegisterComponent } from './account-admin/dead-stock-register/dead-stock-register.component';
import { ChallanRegisterComponent } from './account-admin/challan-register/challan-register.component';
import { BtrFiveComponent } from './account-admin/btr-five/btr-five.component';
import { ChequeRegisterComponent } from './account-admin/cheque-register/cheque-register.component';
import {
  JpaLegalEntryForRequestListingComponent
} from './jpa-legal-entry-for-request-listing/jpa-legal-entry-for-request-listing.component';
import { JpaLegalEntryForRequestComponent } from './jpa-legal-entry-for-request/jpa-legal-entry-for-request.component';
import { InwardEntryComponent } from './inward/inward-entry/inward-entry.component';
import { InwardListingComponent } from './inward/inward-listing/inward-listing.component';
import { OutwardEntryComponent } from './outward/outward-entry/outward-entry.component';
import { OutwardListingComponent } from './outward/outward-listing/outward-listing.component';
import { ManagementExpenditureComponent } from './account-admin/management-expenditure/management-expenditure.component';
import { ChallanComponent } from './account-admin/challan/challan.component';
import { CashbookComponent } from './account-admin/cashbook/cashbook.component';
import { DbPolicyEntryComponent } from './db-policy-entry/db-policy-entry.component';
import { ClaimNoteComponent } from './jpa-report/claim-note/claim-note.component';
import { MemorandumComponent } from './jpa-report/memorandum/memorandum.component';
import { NoClaimComponent } from './jpa-report/no-claim/no-claim.component';
import { QueryGenerateComponent } from './jpa-report/query-generate/query-generate.component';
import { WorkflowDoiComponent } from './workflow-doi/workflow-doi.component';
import { JpaQueryDialogComponent } from './jpa-query-dialog/jpa-query-dialog.component';
import { JpaRejectionQueryDialogComponent } from './jpa-rejection-query-dialog/jpa-rejection-query-dialog.component';
import { JpaClaimEntryViewComponent } from './jpa/jpa-claim-entry-view/jpa-claim-entry-view.component';
import { PremiumRegisterComponent } from './premium-register/premium-register.component';

import { IChallanRegisterComponent } from './i-challan-register/i-challan-register.component';
*/
import { IChequeRegisterComponent } from './i-cheque-register/i-cheque-register.component';
import { PremiumRegisterReInsuranceComponent } from './premium-register-re-insurance/premium-register-re-insurance.component';
/*import {
  PolicyProposalLetterComponent, PolicyProposalSubmissionComponent
} from './direct-business/policy-proposal-letter/policy-proposal-letter.component';
import { PolicyProposalOfferComponent } from './direct-business/policy-proposal-offer/policy-proposal-offer.component';
import { PolicyPaymentComponent } from './direct-business/policy-payment/policy-payment.component';
import { PolicyPaymentScreenComponent } from './direct-business/policy-payment-screen/policy-payment-screen.component';
import { PolicyOfferViewComponent } from './direct-business/policy-offer-view/policy-offer-view.component';
import { GeneratePolicyNoComponent, PolicyMasterComponent } from './direct-business/policy-master/policy-master.component';
import { PolicyMasterListingComponent } from './direct-business/policy-master-listing/policy-master-listing.component';
import { PolicyMasterViewComponent } from './direct-business/policy-master-view/policy-master-view.component';
import { ClaimEntryComponent } from './direct-business/claim-entry/claim-entry.component';
import { ClaimEntryListingComponent } from './direct-business/claim-entry-listing/claim-entry-listing.component';
import { ClaimEntryViewComponent } from './direct-business/claim-entry-view/claim-entry-view.component';
import { ClaimInvestigationSurveyorComponent } from './direct-business/claim-investigation-surveyor/claim-investigation-surveyor.component';
import { ClaimEntryListingSendForApprovalComponent } from './direct-business/claim-entry-listing-send-for-approval/claim-entry-listing-send-for-approval.component';
import { ClaimEntryListingSendForPaymentComponent } from './direct-business/claim-entry-listing-send-for-payment/claim-entry-listing-send-for-payment.component';
import { ClaimEntryListingApplicationAcceptedComponent } from './direct-business/claim-entry-listing-application-accepted/claim-entry-listing-application-accepted.component';
import { BurglaryHouseBreakingPolicyComponent } from './direct-business/burglary-house-breaking-policy/burglary-house-breaking-policy.component';
import { ElectronicEquipmentPolicyComponent } from './direct-business/electronic-equipment-policy/electronic-equipment-policy.component';
import { CoInsuranceClaimEntryComponent } from './co-insurance/co-insurance-claim-entry/co-insurance-claim-entry.component';
import { CoInsuranceClaimListingComponent } from './co-insurance/co-insurance-claim-listing/co-insurance-claim-listing.component';
import { CoInsuranceClaimViewComponent } from './co-insurance/co-insurance-claim-view/co-insurance-claim-view.component';
import { CoInsuranceMemorandumComponent } from './co-insurance/co-insurance-memorandum/co-insurance-memorandum.component';
import { StandardFirePolicyComponent } from './direct-business/standard-fire-policy/standard-fire-policy.component';
import { StampRegisterComponent } from './account-admin/stamp-register/stamp-register.component';
import { PremiumRefundMemorandumComponent } from './co-insurance/premium-refund-memorandum/premium-refund-memorandum.component';*/
import { PremiumRefundListingComponent } from './co-insurance/premium-refund-listing/premium-refund-listing.component';
import { PremiumRefundEntryComponent } from './co-insurance/premium-refund-entry/premium-refund-entry.component';
/*
import { ReInsurancePolicyMasterComponent } from './re-insurance-policy-master/re-insurance-policy-master.component';

import { PartyMasterComponent } from './party-master/party-master/party-master.component';
import { PartyMasterListingComponent } from './party-master/party-master-listing/party-master-listing.component';
import { SurveyorMasterComponent } from './surveyor-master/surveyor-master/surveyor-master.component';
import { SurveyorMasterListingComponent } from './surveyor-master/surveyor-master-listing/surveyor-master-listing.component';
import { SurveyInvestigationAllotmentComponent } from './surveyor-master/survey-investigation-allotment/survey-investigation-allotment.component'; */
import { PolicyEntryComponent } from './co-insurance/policy-entry/policy-entry.component';
 import { PolicyEntryListingComponent } from './co-insurance/policy-entry-listing/policy-entry-listing.component';
/*import { HbaPolicyListingComponent } from './hba/hba-policy-listing/hba-policy-listing.component';

import { RiClaimRecoveryComponent } from './ri-claim-recovery/ri-claim-recovery.component';

import { ClaimListingComponent } from './hba/claim-listing/claim-listing.component';
import { ClaimListingSendForPaymentComponent } from './hba/claim-listing-send-for-payment/claim-listing-send-for-payment.component';
import { HbaPolicyEntryComponent } from './hba/hba-policy-entry/hba-policy-entry.component';
import { ClaimEntryHbaComponent } from './hba/claim-entry-hba/claim-entry-hba.component';
import { CashbookListingComponent } from './account-admin/cashbook-listing/cashbook-listing.component';
import { WorkflowDoiModuleComponent } from './workflow-doi-module/workflow-doi-module.component';
import { HbaProposalListingComponent } from './hba/hba-proposal-listing/hba-proposal-listing.component';
import { DbProposalListingComponent } from './direct-business/db-proposal-listing/db-proposal-listing.component';
import { HbaProposalListComponent } from './hba-proposal-list/hba-proposal-list.component'; */
import { IChequeRegisterListingComponent } from './i-cheque-register-listing/i-cheque-register-listing.component';
/*import { PremiumRegisterReInsurListingComponent } from './premium-register-re-insur-listing/premium-register-re-insur-listing.component';
import { BtrFivePrintComponent } from './account-admin/btr-five-print/btr-five-print.component';
import { BtrFiveListingComponent } from './account-admin/btr-five-listing/btr-five-listing.component';


import { DocumentDialogComponent } from './jpa/jpa-claim-entry/document-dialog/document-dialog.component';
import { BtrFiveReportComponent } from './account-admin/btr-five/btr-five-report/btr-five-report.component';
import { JpaLegalClaimListingComponent } from './jpa-legal-claim-listing/jpa-legal-claim-listing.component';
import { SurveyorBillGenerationComponent } from './surveyor-bill-generation/surveyor-bill-generation.component';
import { SurveyorBillGenerationListingComponent } from './surveyor-bill-generation/surveyor-bill-generation-listing/surveyor-bill-generation-listing.component';
import { PolicyPrintoutFormatComponent } from './hba/policy-printout-format/policy-printout-format.component';
import { MoneyInTransitPolicyComponent } from './direct-business/money-in-transit-policy/money-in-transit-policy.component';
import { MoneyInTransitProposalComponent } from './direct-business/money-in-transit-proposal/money-in-transit-proposal.component';
import { AvaiationProposalComponent } from './direct-business/avaiation-proposal/avaiation-proposal.component';
import { AvaiationPolicyComponent } from './direct-business/avaiation-policy/avaiation-policy.component';
import { StdFirePolicyComponent } from './direct-business/std-fire-policy/std-fire-policy.component';
import { BurgHouseBreakingPolicyComponent } from './direct-business/burg-house-breaking-policy/burg-house-breaking-policy.component';
import { ElectronicEquipPolicyComponent } from './direct-business/electronic-equip-policy/electronic-equip-policy.component';
import { ChallanRegisterPrintComponent } from './account-admin/challan-register-print/challan-register-print.component';
import { JpaClaimEntryEditComponent } from './jpa/jpa-claim-entry-edit/jpa-claim-entry-edit.component';
import { GicBorderComponent } from './account-commercial/gic-border/gic-border.component';
import { GicBorderReportComponent } from './account-commercial/gic-border-report/gic-border-report.component';
import { PremiumSubsidiaryComponent } from './account-commercial/premium-subsidiary/premium-subsidiary.component';
import { ClaimSubsidiaryComponent } from './account-commercial/claim-subsidiary/claim-subsidiary.component';
import { GstBorderComponent } from './account-commercial/gst-border/gst-border.component';
import { GstBorderMemorandumComponent } from './account-commercial/gst-border-memorandum/gst-border-memorandum.component';
import { ClaimSubsidiarySummaryComponent } from './account-commercial/claim-subsidiary-summary/claim-subsidiary-summary.component';
import { TerrorPoolBorderReportComponent } from './account-commercial/terror-pool-border-report/terror-pool-border-report.component';
import { TerrorPoolBorderMemorandumComponent } from './account-commercial/terror-pool-border-memorandum/terror-pool-border-memorandum.component';
import { MiscReportComponent } from './account-commercial/misc-report/misc-report.component';
import { ReinPremiaSummaryComponent } from './account-commercial/rein-premia-summary/rein-premia-summary.component';
import { ClaimsRecoverableReportComponent } from './account-commercial/claims-recoverable-report/claims-recoverable-report.component';
import { TreasuryScheduleComponent } from './account-commercial/treasury-schedule/treasury-schedule.component';
import { TreasuryScheduleSearchComponent } from './account-commercial/treasury-schedule-search/treasury-schedule-search.component';
import { DbMarineReportComponent } from './account-commercial/db-marine-report/db-marine-report.component';
import { RiClaimRecoverableComponent } from './account-commercial/ri-claim-recoverable/ri-claim-recoverable.component';
import { ClaimDetailsOfIrdaComponent } from './account-commercial/claim-details-of-irda/claim-details-of-irda.component';
import { TerrorismPoolDetailsComponent } from './account-commercial/terrorism-pool-details/terrorism-pool-details.component';
import { LegalAppealRegisterComponent } from './account-commercial/legal-appeal-register/legal-appeal-register.component';
import { RevenueAccountComponent } from './account-commercial/revenue-account/revenue-account.component';
import { BalanceSheetComponent } from './account-commercial/balance-sheet/balance-sheet.component';
import { ScheduleBalanceSheetComponent } from './account-commercial/schedule-balance-sheet/schedule-balance-sheet.component'; */
import { UploadProvisionComponent } from './co-insurance/policy-entry/upload-provision/upload-provision.component';
/*import { SubmitDetailComponent } from './jpa/jpa-send-for-payment-listing/submit-detail/submit-detail.component';
import { TerrorismAdminChargeComponent } from './account-commercial/terrorism-admin-charge/terrorism-admin-charge.component';
import { GstMatrixInvoiceComponent } from './account-commercial/gst-matrix-invoice/gst-matrix-invoice.component';
*/

@NgModule({
  imports: [
    CommonModule,
    //MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMatSelectSearchModule,
    CommonProtoModule,
    DoiRoutingModule,

  ],
  declarations: [
    /*JpaClaimEntryComponent,
    MasterClaimEntryComponent,
    JpaPendingApprovalListingComponent,
    JpaClaimEntryViewComponent,
    JpaMasterFromBankBranchComponent,
    JpaMasterPolicyComponent,
    JpaApprovalListingComponent,
    JpaRejectionListingComponent,
    HbaProposalComponent,
    JpaSendForPaymentListingComponent,
    JpaPendingApplicationListingComponent,
    JpaLegalEntryComponent,
    DocumentMasterComponent,
    JpaLegalListingComponent,
    DeadStockRegisterComponent,
    ChallanRegisterComponent,
    BtrFiveComponent,
    ChequeRegisterComponent,
    JpaLegalEntryForRequestListingComponent,
    JpaLegalEntryForRequestComponent,
    InwardEntryComponent,
    InwardListingComponent,
    OutwardEntryComponent,
    OutwardListingComponent,
    ManagementExpenditureComponent,
    ChallanComponent,
    CashbookComponent,
    DbPolicyEntryComponent,

    ClaimNoteComponent,
    MemorandumComponent,
    NoClaimComponent,
    QueryGenerateComponent,

    WorkflowDoiComponent,
    JpaQueryDialogComponent,
    JpaRejectionQueryDialogComponent,
    PremiumRegisterComponent,
    IChallanRegisterComponent,
    */
   PremiumRegisterReInsuranceComponent,
    IChequeRegisterComponent,
    
    /*

    PolicyProposalLetterComponent,
    PolicyProposalOfferComponent,
    PolicyPaymentComponent,
    PolicyProposalSubmissionComponent,
    PolicyPaymentScreenComponent,
    PolicyOfferViewComponent,
    PolicyMasterComponent,
    PolicyMasterListingComponent,
    PolicyMasterViewComponent,
    GeneratePolicyNoComponent,
    ClaimEntryComponent,
    ClaimEntryListingComponent,
    ClaimEntryViewComponent,
    ClaimInvestigationSurveyorComponent,
    ClaimEntryListingSendForApprovalComponent,
    ClaimEntryListingSendForPaymentComponent,
    ClaimEntryListingApplicationAcceptedComponent,
    ValidationDialogComponent,
    BurglaryHouseBreakingPolicyComponent,
    ElectronicEquipmentPolicyComponent,
    CoInsuranceClaimEntryComponent,
    CoInsuranceClaimListingComponent,
    CoInsuranceClaimViewComponent,
    CoInsuranceMemorandumComponent,
    StandardFirePolicyComponent,
    StampRegisterComponent, */
    PremiumRefundEntryComponent,
     PremiumRefundListingComponent,
   /* PremiumRefundMemorandumComponent,
    
	ReInsurancePolicyMasterComponent,
    
	PartyMasterComponent,
    PartyMasterListingComponent,
    SurveyorMasterComponent,
    SurveyorMasterListingComponent,
    SurveyInvestigationAllotmentComponent, */
    PolicyEntryComponent,
    PolicyEntryListingComponent,
    /*HbaPolicyListingComponent,
    
	RiClaimRecoveryComponent,
	
    ClaimListingComponent,
    ClaimListingSendForPaymentComponent,
    HbaPolicyEntryComponent,
    ClaimEntryHbaComponent,
    CashbookListingComponent,
    WorkflowDoiModuleComponent,
    HbaProposalListingComponent,
    DbProposalListingComponent,
    HbaProposalListComponent, */
    IChequeRegisterListingComponent,
    /*PremiumRegisterReInsurListingComponent,
    BtrFivePrintComponent,
    BtrFiveListingComponent,
    DocumentDialogComponent,
    BtrFiveReportComponent,
    SurveyorBillGenerationComponent,
    PolicyPrintoutFormatComponent,
    JpaLegalClaimListingComponent,
    SurveyorBillGenerationListingComponent,
    SurveyorBillGenerationListingComponent,
    MoneyInTransitPolicyComponent,
    MoneyInTransitProposalComponent,
    PolicyPrintoutFormatComponent,
    JpaLegalClaimListingComponent,
    AvaiationProposalComponent,
    AvaiationPolicyComponent,
    StdFirePolicyComponent,
    BurgHouseBreakingPolicyComponent,
    ElectronicEquipPolicyComponent,
    ChallanRegisterPrintComponent,
    JpaClaimEntryEditComponent,
    GicBorderComponent,
    GicBorderReportComponent,
    PremiumSubsidiaryComponent,
    ClaimSubsidiaryComponent,
    GstBorderComponent,
    GstBorderMemorandumComponent,
    ClaimSubsidiarySummaryComponent,
    TerrorPoolBorderReportComponent,
    TerrorPoolBorderMemorandumComponent,
    MiscReportComponent,
    ReinPremiaSummaryComponent,
    ClaimsRecoverableReportComponent,
    TreasuryScheduleComponent,
    TreasuryScheduleSearchComponent,
    DbMarineReportComponent,
    RiClaimRecoverableComponent,
    ClaimDetailsOfIrdaComponent,
    TerrorismPoolDetailsComponent,
    LegalAppealRegisterComponent,
    RevenueAccountComponent,
    BalanceSheetComponent,
    ScheduleBalanceSheetComponent, */
    UploadProvisionComponent,
    /*SubmitDetailComponent,
    TerrorismAdminChargeComponent,
    GstMatrixInvoiceComponent,
*/
  ],
  entryComponents: [
	/*
    WorkflowDoiModuleComponent,
    JpaQueryDialogComponent,
    JpaRejectionQueryDialogComponent,
    WorkflowDoiComponent,
    PolicyProposalSubmissionComponent,
    GeneratePolicyNoComponent,
    DocumentDialogComponent, */
    UploadProvisionComponent,
   /* SubmitDetailComponent,
    ValidationDialogComponent
	*/
	]
})
export class DoiModule { }
