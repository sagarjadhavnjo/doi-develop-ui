//import { DocumentMasterComponent } from './jpa/document-master/document-master.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
/*import { JpaClaimEntryComponent } from './jpa/jpa-claim-entry/jpa-claim-entry.component';
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
import { DeadStockRegisterComponent } from './account-admin/dead-stock-register/dead-stock-register.component';
import { JpaLegalListingComponent } from './jpa-legal-listing/jpa-legal-listing.component';
import { ChequeRegisterComponent } from './account-admin/cheque-register/cheque-register.component';
import { BtrFiveComponent } from './account-admin/btr-five/btr-five.component';
import { ChallanRegisterComponent } from './account-admin/challan-register/challan-register.component';
import {
  JpaLegalEntryForRequestListingComponent
} from './jpa-legal-entry-for-request-listing/jpa-legal-entry-for-request-listing.component';
import { JpaLegalEntryForRequestComponent } from './jpa-legal-entry-for-request/jpa-legal-entry-for-request.component';
import { ManagementExpenditureComponent } from './account-admin/management-expenditure/management-expenditure.component';
import { ChallanComponent } from './account-admin/challan/challan.component';
import { CashbookComponent } from './account-admin/cashbook/cashbook.component';
import { InwardListingComponent } from './inward/inward-listing/inward-listing.component';
import { OutwardListingComponent } from './outward/outward-listing/outward-listing.component';
import { InwardEntryComponent } from './inward/inward-entry/inward-entry.component';
import { OutwardEntryComponent } from './outward/outward-entry/outward-entry.component';
import { DbPolicyEntryComponent } from './db-policy-entry/db-policy-entry.component';
import { ClaimNoteComponent } from './jpa-report/claim-note/claim-note.component';
import { MemorandumComponent } from './jpa-report/memorandum/memorandum.component';
import { NoClaimComponent } from './jpa-report/no-claim/no-claim.component';
import { QueryGenerateComponent } from './jpa-report/query-generate/query-generate.component';
import { JpaClaimEntryViewComponent } from './jpa/jpa-claim-entry-view/jpa-claim-entry-view.component';
import { PremiumRegisterComponent } from './premium-register/premium-register.component';
import { IChallanRegisterComponent } from './i-challan-register/i-challan-register.component';
*/
import { IChequeRegisterComponent } from './i-cheque-register/i-cheque-register.component';
import { PremiumRegisterReInsuranceComponent } from './premium-register-re-insurance/premium-register-re-insurance.component';
/*import { PolicyProposalLetterComponent } from './direct-business/policy-proposal-letter/policy-proposal-letter.component';
import { PolicyProposalOfferComponent } from './direct-business/policy-proposal-offer/policy-proposal-offer.component';
import { PolicyPaymentComponent } from './direct-business/policy-payment/policy-payment.component';
import { PolicyPaymentScreenComponent } from './direct-business/policy-payment-screen/policy-payment-screen.component';
import { PolicyOfferViewComponent } from './direct-business/policy-offer-view/policy-offer-view.component';
import { PolicyMasterViewComponent } from './direct-business/policy-master-view/policy-master-view.component';
import { PolicyMasterListingComponent } from './direct-business/policy-master-listing/policy-master-listing.component';
import { PolicyMasterComponent } from './direct-business/policy-master/policy-master.component';
import { ClaimEntryComponent } from './direct-business/claim-entry/claim-entry.component';
import { ClaimEntryListingComponent } from './direct-business/claim-entry-listing/claim-entry-listing.component';
import { ClaimEntryViewComponent } from './direct-business/claim-entry-view/claim-entry-view.component';
import {
  ClaimEntryListingApplicationAcceptedComponent
} from './direct-business/claim-entry-listing-application-accepted/claim-entry-listing-application-accepted.component';
import {
  ClaimEntryListingSendForApprovalComponent
} from './direct-business/claim-entry-listing-send-for-approval/claim-entry-listing-send-for-approval.component';
import {
  ClaimEntryListingSendForPaymentComponent
} from './direct-business/claim-entry-listing-send-for-payment/claim-entry-listing-send-for-payment.component';
import { ClaimInvestigationSurveyorComponent } from './direct-business/claim-investigation-surveyor/claim-investigation-surveyor.component';
import { ElectronicEquipmentPolicyComponent } from './direct-business/electronic-equipment-policy/electronic-equipment-policy.component';
import { BurglaryHouseBreakingPolicyComponent } from './direct-business/burglary-house-breaking-policy/burglary-house-breaking-policy.component';
import { CoInsuranceClaimEntryComponent } from './co-insurance/co-insurance-claim-entry/co-insurance-claim-entry.component';
import { CoInsuranceClaimViewComponent } from './co-insurance/co-insurance-claim-view/co-insurance-claim-view.component';
import { StandardFirePolicyComponent } from './direct-business/standard-fire-policy/standard-fire-policy.component';
import { CoInsuranceClaimListingComponent } from './co-insurance/co-insurance-claim-listing/co-insurance-claim-listing.component';
import { CoInsuranceMemorandumComponent } from './co-insurance/co-insurance-memorandum/co-insurance-memorandum.component';
import { StampRegisterComponent } from './account-admin/stamp-register/stamp-register.component';*/
import { PremiumRefundEntryComponent } from './co-insurance/premium-refund-entry/premium-refund-entry.component';
import { PremiumRefundListingComponent } from './co-insurance/premium-refund-listing/premium-refund-listing.component';
/*import { PremiumRefundMemorandumComponent } from './co-insurance/premium-refund-memorandum/premium-refund-memorandum.component';

import { ReInsurancePolicyMasterComponent } from './re-insurance-policy-master/re-insurance-policy-master.component';

import { PartyMasterComponent } from './party-master/party-master/party-master.component';
import { PartyMasterListingComponent } from './party-master/party-master-listing/party-master-listing.component';
import { SurveyorMasterListingComponent } from './surveyor-master/surveyor-master-listing/surveyor-master-listing.component';
import { SurveyorMasterComponent } from './surveyor-master/surveyor-master/surveyor-master.component';
import { SurveyInvestigationAllotmentComponent } from './surveyor-master/survey-investigation-allotment/survey-investigation-allotment.component'; */
import { PolicyEntryComponent } from './co-insurance/policy-entry/policy-entry.component'
import { PolicyEntryListingComponent } from './co-insurance/policy-entry-listing/policy-entry-listing.component';
/*import { HbaPolicyListingComponent } from './hba/hba-policy-listing/hba-policy-listing.component';

import { RiClaimRecoveryComponent } from './ri-claim-recovery/ri-claim-recovery.component';

import { ClaimListingComponent } from './hba/claim-listing/claim-listing.component';
import { ClaimListingSendForPaymentComponent } from './hba/claim-listing-send-for-payment/claim-listing-send-for-payment.component';
import { HbaPolicyEntryComponent } from './hba/hba-policy-entry/hba-policy-entry.component';
import { ClaimEntryHbaComponent } from './hba/claim-entry-hba/claim-entry-hba.component';
import { HbaProposalListingComponent } from './hba/hba-proposal-listing/hba-proposal-listing.component';
import { DbProposalListingComponent } from './direct-business/db-proposal-listing/db-proposal-listing.component';
import { HbaProposalListComponent } from './hba-proposal-list/hba-proposal-list.component';*/
import { IChequeRegisterListingComponent } from './i-cheque-register-listing/i-cheque-register-listing.component';
/*import { PremiumRegisterReInsurListingComponent } from './premium-register-re-insur-listing/premium-register-re-insur-listing.component';
import { BtrFivePrintComponent } from './account-admin/btr-five-print/btr-five-print.component';
import { BtrFiveListingComponent } from './account-admin/btr-five-listing/btr-five-listing.component';
import { BtrFiveReportComponent } from './account-admin/btr-five/btr-five-report/btr-five-report.component';
import { JpaLegalClaimListingComponent } from './jpa-legal-claim-listing/jpa-legal-claim-listing.component';
import { SurveyorBillGenerationListingComponent } from './surveyor-bill-generation/surveyor-bill-generation-listing/surveyor-bill-generation-listing.component';
import { SurveyorBillGenerationComponent } from './surveyor-bill-generation/surveyor-bill-generation.component';
import { PolicyPrintoutFormatComponent } from './hba/policy-printout-format/policy-printout-format.component';
import { MoneyInTransitPolicyComponent } from './direct-business/money-in-transit-policy/money-in-transit-policy.component';
import { MoneyInTransitProposalComponent } from './direct-business/money-in-transit-proposal/money-in-transit-proposal.component';
import { AvaiationPolicyComponent } from './direct-business/avaiation-policy/avaiation-policy.component';
import { AvaiationProposalComponent } from './direct-business/avaiation-proposal/avaiation-proposal.component';
import { StdFirePolicyComponent } from './direct-business/std-fire-policy/std-fire-policy.component';
import { BurgHouseBreakingPolicyComponent } from './direct-business/burg-house-breaking-policy/burg-house-breaking-policy.component';
import { ElectronicEquipPolicyComponent } from './direct-business/electronic-equip-policy/electronic-equip-policy.component';
import { ChallanRegisterPrintComponent } from './account-admin/challan-register-print/challan-register-print.component';
import { CashbookListingComponent } from './account-admin/cashbook-listing/cashbook-listing.component';
import { JpaClaimEntryEditComponent } from './jpa/jpa-claim-entry-edit/jpa-claim-entry-edit.component';
import { GicBorderComponent } from './account-commercial/gic-border/gic-border.component';
import { GicBorderReportComponent } from './account-commercial/gic-border-report/gic-border-report.component';
import { PremiumSubsidiaryComponent } from './account-commercial/premium-subsidiary/premium-subsidiary.component';
import { GstBorderComponent } from './account-commercial/gst-border/gst-border.component';
import { GstBorderMemorandumComponent } from './account-commercial/gst-border-memorandum/gst-border-memorandum.component';
import { ClaimSubsidiaryComponent } from './account-commercial/claim-subsidiary/claim-subsidiary.component';
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
import { ScheduleBalanceSheetComponent } from './account-commercial/schedule-balance-sheet/schedule-balance-sheet.component';
import { TerrorismAdminChargeComponent } from './account-commercial/terrorism-admin-charge/terrorism-admin-charge.component';
import { GstMatrixInvoiceComponent } from './account-commercial/gst-matrix-invoice/gst-matrix-invoice.component';
*/
const routes: Routes = [
  /*{
    path: 'jpa/jpa-claim-entry',
    component: JpaClaimEntryComponent
  },
  {
    path: 'master-scheme-entry',
    component: MasterClaimEntryComponent
  },
  {
    path: 'jpa/jpa-pending-approval-listing',
    component: JpaPendingApprovalListingComponent
  },
  {
    path: 'jpa/jpa-pending-application-listing',
    component: JpaPendingApplicationListingComponent
  },
  {
    path: 'jpa/jpa-received-application-listing',
    component: JpaApprovalListingComponent
  },
  {
    path: 'jpa/jpa-return-to-nodal-listing',
    component: JpaRejectionListingComponent
  }, {
    path: 'jpa/jpa-send-for-payment-listing',
    component: JpaSendForPaymentListingComponent
  },
  {
    path: 'jpa/jpa-claim-entry-view',
    component: JpaClaimEntryViewComponent
  },
  {
    path: 'jpa/jpa-claim-entry-edit',
    component: JpaClaimEntryEditComponent
  },
  {
    path: 'jpa/jpa-master-from-bank-branch',
    component: JpaMasterFromBankBranchComponent
  }
  ,
  {
    path: 'jpa/jpa-master-policy',
    component: JpaMasterPolicyComponent
  },
  {
    path: 'hba/hba-proposal',
    component: HbaProposalComponent
  },
  {
    path: 'hba/hba-proposal-listing',
    component: HbaProposalListingComponent
  },
  {
    path: 'jpa-legal-entry',
    component: JpaLegalEntryComponent
  },
  {
    path: 'jpa-legal-claim-listing',
    component: JpaLegalClaimListingComponent
  },
  {
    path: 'jpa-legal-entry-listing',
    component: JpaLegalListingComponent
  },
  {
    path: 'jpa/document-master',
    component: DocumentMasterComponent
  },
  {
    path: 'account-admin/dead-stock-register',
    component: DeadStockRegisterComponent
  },

  {
    path: 'account-admin/cheque-register',
    component: ChequeRegisterComponent
  }
  ,
  {
    path: 'account-admin/challan-register',
    component: ChallanRegisterComponent
  }
  ,
  {
    path: 'account-admin/btr-5',
    component: BtrFiveComponent
  },
  {
    path: 'jpa-legal-entry-for-request-listing',
    component: JpaLegalEntryForRequestListingComponent
  },
  {
    path: 'account-admin/challan',
    component: ChallanComponent
  },
  {
    path: 'account-admin/cashbook',
    component: CashbookComponent
  },
  {
    path: 'inward/inward-entry',
    component: InwardEntryComponent
  },
  {
    path: 'inward/inward-listing',
    component: InwardListingComponent
  },
  {
    path: 'outward/outward-entry',
    component: OutwardEntryComponent
  },
  {
    path: 'outward/outward-listing',
    component: OutwardListingComponent
  },
  {
    path: 'jpa-legal-entry-for-request',
    component: JpaLegalEntryForRequestComponent
  },
  {
    path: 'account-admin/management-expenditure-report',
    component: ManagementExpenditureComponent
  },
  {
    path: 'account-admin/challan',
    component: ChallanComponent
  },

  {
    path: 'account-admin/cashbook',
    component: CashbookComponent
  },
  {
    path: 'db-poicy-entry',
    component: DbPolicyEntryComponent
  },
  {
    path: 'jpa/claim-note',
    component: ClaimNoteComponent
  },
  {
    path: 'jpa/memorandum',
    component: MemorandumComponent
  },
  {
    path: 'jpa/no-claim',
    component: NoClaimComponent
  },
  {
    path: 'jpa/query-generate',
    component: QueryGenerateComponent
  },
  {
    path: 'co-insurance/premium-register',
    component: PremiumRegisterComponent
  },*/
  
  {
    path: 're-insurance-premium-register',
    component: PremiumRegisterReInsuranceComponent
  },
  
 {
    path: 'co-insurance-cheque-register',
    component: IChequeRegisterComponent
  },
   /*{
    path: 'co-insurance-challan-register',
    component: IChallanRegisterComponent
  },
  {
    path: 'db/policy-proposal-letter',
    component: PolicyProposalLetterComponent
  },
  {
    path: 'db/policy-proposal-offer',
    component: PolicyProposalOfferComponent
  },
  {
    path: 'db/policy-payment',
    component: PolicyPaymentComponent
  },
  {
    path: 'db/policy-payment-screen',
    component: PolicyPaymentScreenComponent
  },
  {
    path: 'db/policy-proposal-letter-view',
    component: PolicyOfferViewComponent
  },
  {
    path: 'db/policy-master',
    component: PolicyMasterComponent
  },
  {
    path: 'db/policy-master-listing',
    component: PolicyMasterListingComponent
  },
  {
    path: 'db/policy-master-view',
    component: PolicyMasterViewComponent
  },
  {
    path: 'db/claim-entry',
    component: ClaimEntryComponent
  },
  {
    path: 'db/claim-entry-listing',
    component: ClaimEntryListingComponent
  },
  {
    path: 'db/claim-entry-view',
    component: ClaimEntryViewComponent
  },
  {
    path: 'db/claim-entry-listing-application-accepted',
    component: ClaimEntryListingApplicationAcceptedComponent
  },
  {
    path: 'db/claim-entry-listing-send-for-approval',
    component: ClaimEntryListingSendForApprovalComponent
  },
  {
    path: 'db/claim-entry-listing-send-for-payment',
    component: ClaimEntryListingSendForPaymentComponent
  },
  {
    path: 'db/claim-investigation-surveyor',
    component: ClaimInvestigationSurveyorComponent
  },
  {
    path: 'electronic-equipment-proposal',
    component: ElectronicEquipmentPolicyComponent
  },
  {
    path: 'burglary-house-breaking-proposal',
    component: BurglaryHouseBreakingPolicyComponent
  },
  {
    path: 'co-insurance-claim-entry',
    component: CoInsuranceClaimEntryComponent
  },
  {
    path: 'co-insurance-claim-view',
    component: CoInsuranceClaimViewComponent
  },
  {
    path: 'standard-fire-proposal',
    component: StandardFirePolicyComponent
  },
  {
    path: 'co-insurance-claim-listing',
    component: CoInsuranceClaimListingComponent
  },
  {
    path: 'co-insurance-memorandum',
    component: CoInsuranceMemorandumComponent
  },
  {
    path: 'stamp-register',
    component: StampRegisterComponent
  },*/
  {
    path: 'co-insurance/premium-refund-entry',
    component: PremiumRefundEntryComponent
  },
  {
    path: 'co-insurance/premium-refund-listing',
    component: PremiumRefundListingComponent
  },
 /* {
    path: 'co-insurance/premium-memorandum',
    component: PremiumRefundMemorandumComponent
  },
    
  {
    path: 're-insurance-policy-master',
    component: ReInsurancePolicyMasterComponent
  },
  
  {
    path: 'party-master',
    component: PartyMasterComponent
  },
  {
    path: 'party-master-listing',
    component: PartyMasterListingComponent
  },
  {
    path: 'surveyor-master',
    component: SurveyorMasterComponent
  },
  {
    path: 'surveyor-master-listing',
    component: SurveyorMasterListingComponent
  },
  {
    path: 'surveyor-investigation-allotment',
    component: SurveyInvestigationAllotmentComponent
  },
  {
    path: 'surveyor-bill-generation',
    component: SurveyorBillGenerationComponent
  },
  {
    path: 'surveyor-bill-generation-listing',
    component: SurveyorBillGenerationListingComponent
  }, */
  {
    path: 'co-insurance/policy-entry',
    component: PolicyEntryComponent
  },
  {
    path: 'co-insurance/policy-entry-listing',
    component: PolicyEntryListingComponent
  },
 /* {
    path: 'hba-policy-listing',
    component: HbaPolicyListingComponent
  },
  
  {
    path: 're-insurance/ri-claim-recovery-entry',
    component: RiClaimRecoveryComponent
  },
  
  {
    path: 'hba/claim-listing',
    component: ClaimListingComponent
  },
  {
    path: 'hba/claim-listing-send-for-payment',
    component: ClaimListingSendForPaymentComponent
  },
  {
    path: 'hba-policy-entry',
    component: HbaPolicyEntryComponent
  },
  {
    path: 'policy-printout-format',
    component: PolicyPrintoutFormatComponent
  },
  {
    path: 'hba/claim-entry',
    component: ClaimEntryHbaComponent
  },
  {
    path: 'db-proposal-listing',
    component: DbProposalListingComponent
  },
  {
    path: 'hba-proposal-list',
    component: HbaProposalListComponent
  }, */
  {
    path: 'co-insurance-cheque-register-listing',
    component: IChequeRegisterListingComponent
  },
 /* {
    path: 're-insurance-premium-register-listing',
    component: PremiumRegisterReInsurListingComponent
  },
  {
    path: 'account-admin/btr-5-print',
    component: BtrFivePrintComponent
  },
  {
    path: 'account-admin/btr-5-listing',
    component: BtrFiveListingComponent
  },
  {
    path: 'money-in-transit-policy',
    component: MoneyInTransitPolicyComponent
  },
  {
    path: 'money-in-transit-proposal',
    component: MoneyInTransitProposalComponent
  },
  {
    path: 'aviation-policy',
    component: AvaiationPolicyComponent
  },
  {
    path: 'aviation-proposal',
    component: AvaiationProposalComponent
  },
  {
    path: 'standard-fire-policy',
    component: StdFirePolicyComponent
  },
  {
    path: 'burglary-house-breaking-policy',
    component: BurgHouseBreakingPolicyComponent
  },
  {
    path: 'electronic-equipment-policy',
    component: ElectronicEquipPolicyComponent
  },
  {
    path: 'account-admin/challan-register-print',
    component: ChallanRegisterPrintComponent
  },
  {
    path: 'account-admin/cashbook-listing',
    component: CashbookListingComponent
  },
  {
    path: 'account-commercial/gic-border',
    component: GicBorderComponent
  },
  {
    path: 'account-commercial/gic-border-report',
    component: GicBorderReportComponent
  },
  {
    path: 'account-commercial/gst-border',
    component: GstBorderComponent
  },
  {
    path: 'account-commercial/gst-border-memorandum',
    component: GstBorderMemorandumComponent
  },
  {
    path: 'account-commercial/terror-pool-border-report',
    component: TerrorPoolBorderReportComponent
  },
  {
    path: 'account-commercial/terror-pool-border-memorandum',
    component: TerrorPoolBorderMemorandumComponent
  },
  {
    path: 'account-commercial/misc-report',
    component: MiscReportComponent
  },
  {
    path: 'account-commercial/reins-premia-summary-gic',
    component: ReinPremiaSummaryComponent
  },
  {
    path: 'account-commercial/reins-premia-summary',
    component: ReinPremiaSummaryComponent
  },
  {
    path: 'account-commercial/claims-recoverable-report',
    component: ClaimsRecoverableReportComponent
  },
  {
    path: 'account-commercial/treasury-schedule-search',
    component: TreasuryScheduleSearchComponent
  },
  {
    path: 'btr-five-report',
    component: BtrFiveReportComponent
  },
  { path: 'account-commercial/premium-subsidiary', component: PremiumSubsidiaryComponent },
  { path: 'account-commercial/claim-subsidiary', component: ClaimSubsidiaryComponent },
  { path: 'account-commercial/claim-subsidiary-summary', component: ClaimSubsidiarySummaryComponent },
  { path: 'account-commercial/treasury-schedule', component: TreasuryScheduleComponent },

  { path: 'account-commercial/db-marine-report', component: DbMarineReportComponent },
  { path: 'account-commercial/ri-claim-recoverable', component: RiClaimRecoverableComponent },
  { path: 'account-commercial/claim-details-of-irda', component: ClaimDetailsOfIrdaComponent },
  { path: 'account-commercial/terrorism-pool-details', component: TerrorismPoolDetailsComponent },
  { path: 'account-commercial/legal-appeal-register', component: LegalAppealRegisterComponent },
  { path: 'account-commercial/revenue-account', component: RevenueAccountComponent },
  { path: 'account-commercial/balance-sheet', component: BalanceSheetComponent },
  { path: 'account-commercial/various-schedule', component: ScheduleBalanceSheetComponent },
  { path: 'account-commercial/terrorism-admin-charge', component: TerrorismAdminChargeComponent },
  { path: 'account-commercial/gst-matrix-invoice', component: GstMatrixInvoiceComponent },
*/
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: []
})
export class DoiRoutingModule { }
