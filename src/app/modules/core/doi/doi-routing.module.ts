import { MaterialModule } from './../../../shared/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { JpaClaimEntryComponent } from './jpa/jpa-claim-entry/jpa-claim-entry.component';
import { ClaimNoteComponent } from './jpa/jpa-report/claim-note/claim-note.component';
import { MemorandumComponent } from './jpa/jpa-report/memorandum/memorandum.component';
import { NoClaimComponent } from './jpa/jpa-report/no-claim/no-claim.component';
import { QueryGenerateComponent } from './jpa/jpa-report/query-generate/query-generate.component';
import { AuthGuard } from 'src/app/guards';
import { DocumentMasterComponent } from './jpa/document-master/document-master.component';
//import { MasterClaimEntryComponent } from './jpa/master-claim-entry/master-claim-entry.component';
import { MasterSchemeEntryComponent } from './jpa/jpa-scheme-entry/master-scheme-entry.component';
import { JpaPendingApprovalListingComponent } from './jpa/jpa-pending-approval-listing/jpa-pending-approval-listing.component';
import { JpaMasterFromBankBranchComponent } from './jpa/jpa-master-from-bank-branch/jpa-master-from-bank-branch.component';
import { JpaMasterPolicyComponent } from './jpa/jpa-master-policy/jpa-master-policy.component';
import { JpaApprovalListingComponent } from './jpa/jpa-approval-listing/jpa-approval-listing.component';
import { JpaRejectionListingComponent } from './jpa/jpa-rejection-listing/jpa-rejection-listing.component';
import { JpaSendForPaymentListingComponent } from './jpa/jpa-send-for-payment-listing/jpa-send-for-payment-listing.component';
import { JpaPendingApplicationListingComponent } from './jpa/jpa-pending-application-listing/jpa-pending-application-listing.component';
import { JpaClaimEntryViewComponent } from './jpa/jpa-claim-entry-view/jpa-claim-entry-view.component';
import { JpaClaimEntryEditComponent } from './jpa/jpa-claim-entry-edit/jpa-claim-entry-edit.component';


//JPA Legal Entry
import { JpaLegalEntryComponent } from './jpa-legal/jpa-legal-entry/jpa-legal-entry.component';
import { JpaLegalClaimListingComponent } from './jpa-legal/jpa-legal-claim-listing/jpa-legal-claim-listing.component';
import { JpaLegalEntryForRequestComponent } from './jpa-legal/jpa-legal-entry-for-request/jpa-legal-entry-for-request.component';
import { JpaLegalEntryForRequestListingComponent } from './jpa-legal/jpa-legal-entry-for-request-listing/jpa-legal-entry-for-request-listing.component';
import { JpaLegalListingComponent } from './jpa-legal/jpa-legal-listing/jpa-legal-listing.component';
import { JpaLegalEntryForRequestListingModule } from './jpa-legal/jpa-legal-entry-for-request-listing/jpa-legal-entry-for-request-listing.module';
import { ClaimEntryHbaComponent } from './hba/claim-entry-hba/claim-entry-hba.component';
import { ClaimListingComponent } from './hba/claim-listing/claim-listing.component';
import { ClaimListingSendForPaymentComponent } from './hba/claim-listing-send-for-payment/claim-listing-send-for-payment.component';
import { HbaPolicyEntryComponent } from './hba/hba-policy-entry/hba-policy-entry.component';
import { HbaPolicyListingComponent } from './hba/hba-policy-listing/hba-policy-listing.component';
import { HbaProposalComponent } from './hba/hba-proposal/hba-proposal.component';
import { HbaProposalListingComponent } from './hba/hba-proposal-listing/hba-proposal-listing.component';
import { PolicyPrintoutFormatComponent } from './hba/policy-printout-format/policy-printout-format.component';

// Co-insurance Entry
import { IChequeRegisterComponent } from './i-cheque-register/i-cheque-register.component';
import { PremiumRefundEntryComponent } from './co-insurance/premium-refund-entry/premium-refund-entry.component';
import { PremiumRefundListingComponent } from './co-insurance/premium-refund-listing/premium-refund-listing.component';
import { PremiumRefundMemorandumComponent } from './co-insurance/premium-refund-memorandum/premium-refund-memorandum.component';
import { PolicyEntryComponent } from './co-insurance/policy-entry/policy-entry.component'
import { PolicyEntryListingComponent } from './co-insurance/policy-entry-listing/policy-entry-listing.component';
import { IChequeRegisterListingComponent } from './i-cheque-register-listing/i-cheque-register-listing.component';
import { CoInsuranceClaimListingComponent } from './co-insurance/co-insurance-claim-listing/co-insurance-claim-listing.component';
import { CoInsuranceClaimEntryComponent } from './co-insurance/co-insurance-claim-entry/co-insurance-claim-entry.component';
import { CoInsuranceMemorandumComponent } from './co-insurance/co-insurance-memorandum/co-insurance-memorandum.component';
import { PremiumRegisterComponent } from './premium-register/premium-register.component';

// Re-insurance Entry
import { PremiumRegisterReInsuranceComponent } from './premium-register-re-insurance/premium-register-re-insurance.component';
import { ReInsurancePolicyMasterComponent } from './re-insurance-policy-master/re-insurance-policy-master.component';
import { RiClaimRecoveryComponent } from './ri-claim-recovery/ri-claim-recovery.component';


const routes: Routes = [
  //master-scheme-entry
  {
    path: 'master-scheme-entry',
    component: MasterSchemeEntryComponent
  },
  {
    path: 'master-scheme-entry',
    loadChildren: () => import('./jpa/jpa-scheme-entry/master-scheme-entry.module').then(m => m.MasterSchemeEntryModule),
    canActivate: [AuthGuard]
  },

  //jpa-master-policy
  {
    path: 'jpa/jpa-master-policy',
    component: JpaMasterPolicyComponent
  },
  {
    path: 'jpa-master-policy',
    loadChildren: () => import('./jpa/jpa-master-policy/jpa-master-policy.module').then(m => m.JpaMasterPolicyModule),
    canActivate: [AuthGuard]
  },

  //document-master
  {
    path: 'jpa/document-master',
    component: DocumentMasterComponent
  },
  {
    path: 'document-master',
    loadChildren: () => import('./jpa/document-master/document-master.module').then(m => m.DocumentMasterModule),
    canActivate: [AuthGuard]
  },

  //jpa-claim-entry
  {
    path: 'jpa/jpa-claim-entry',
    component: JpaClaimEntryComponent
  },
  {
    path: 'jpa-claim-entry',
    loadChildren: () => import('./jpa/jpa-claim-entry/jpa-claim-entry.module').then(m => m.JpaClaimEntryModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'jpa/jpa-claim-entry-view',
    component: JpaClaimEntryViewComponent
  },
  {
    path: 'jpa-claim-entry-view',
    loadChildren: () => import('./jpa/jpa-claim-entry-view/jpa-claim-entry-view.module').then(m => m.JpaClaimEntryViewModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'jpa/jpa-claim-entry-edit',
    component: JpaClaimEntryEditComponent
  },
  {
    path: 'jpa-claim-entry-edit',
    loadChildren: () => import('./jpa/jpa-claim-entry-edit/jpa-claim-entry-edit.module').then(m => m.JpaClaimEntryEditModule),
    canActivate: [AuthGuard]
  },
  //jpa-claim-entry listing
  {
    path: 'jpa/jpa-received-application-listing',
    component: JpaApprovalListingComponent
  },
  {
    path: 'jpa-approval-listing',
    loadChildren: () => import('./jpa/jpa-approval-listing/jpa-approval-listing.module').then(m => m.JpaApprovalListingModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'jpa/jpa-pending-approval-listing',
    component: JpaPendingApprovalListingComponent
  },
  {
    path: 'jpa-rejection-listing',
    loadChildren: () => import('./jpa/jpa-rejection-listing/jpa-rejection-listing.module').then(m => m.JpaRejectionListingModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'jpa/jpa-return-to-nodal-listing',
    component: JpaRejectionListingComponent
  },
  {
    path: 'jpa-pending-approval-listing',
    loadChildren: () => import('./jpa/jpa-pending-approval-listing/jpa-pending-approval-listing.module').then(m => m.JpaPendingApprovalListingModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'jpa/jpa-send-for-payment-listing',
    component: JpaSendForPaymentListingComponent
  },
  {
    path: 'jpa-send-for-payment-listing',
    loadChildren: () => import('./jpa/jpa-send-for-payment-listing/jpa-send-for-payment-listing.module').then(m => m.JpaSendForPaymentListingModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'jpa/claim-note',
    component: ClaimNoteComponent
  },
  {
    path: 'claim-note',
    loadChildren: () => import('./jpa/jpa-report/claim-note/claim-note.module').then(m => m.ClaimNoteComponentModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'jpa/memorandum',
    component: MemorandumComponent
  },
  {
    path: 'memorandum',
    loadChildren: () => import('./jpa/jpa-report/memorandum/memorandum.module').then(m => m.MemorandumComponentModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'jpa/no-claim',
    component: NoClaimComponent
  },
  {
    path: 'no-claim',
    loadChildren: () => import('./jpa/jpa-report/no-claim/no-claim.module').then(m => m.NoClaimComponentModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'jpa/query-generate',
    component: QueryGenerateComponent
  },
  {
    path: 'query-generate',
    loadChildren: () => import('./jpa/jpa-report/query-generate/query-generate.module').then(m => m.QueryGenerateComponentModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'jpa/jpa-pending-application-listing',
    component: JpaPendingApplicationListingComponent
  },
  {
    path: 'jpa-pending-application-listing',
    loadChildren: () => import('./jpa/jpa-pending-application-listing/jpa-pending-application-listing.module').then(m => m.JpaPendingApplicationListingModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'jpa/jpa-master-from-bank-branch',
    component: JpaMasterFromBankBranchComponent
  },
  {
    path: 'jpa-master-from-bank-branch',
    loadChildren: () => import('./jpa/jpa-master-from-bank-branch/jpa-master-from-bank-branch.module').then(m => m.JpaMasterFromBankBranchModule),
    canActivate: [AuthGuard]
  },
  //JPA Legal
  //JPA Legal Entry screen
  // {
  //   path: 'jpa-legal-entry',
  //   component: JpaLegalEntryComponent
  // },
  {
    path: 'jpa-legal-entry',
    loadChildren: () => import('./jpa-legal/jpa-legal-entry/jpa-legal-entry.module').then(m => m.JpaLegalEntryModule),
    canActivate: [AuthGuard]
  },
  //JPA Legal Entry Listing
  // {
  //   path: 'jpa-legal-entry-listing',
  //   component: JpaLegalListingComponent
  // },
  {
    path: 'jpa-legal-entry-listing',
    loadChildren: () => import('./jpa-legal/jpa-legal-listing/jpa-legal-listing.module').then(m => m.JpaLegalListingModule),
    canActivate: [AuthGuard]
  },
  //JPA Legal Entry for Request
  {
    path: 'jpa-legal-entry-for-request',
    component: JpaLegalEntryForRequestComponent
  },
  {
    path: 'jpa-legal-entry-for-request',
    loadChildren: () => import('./jpa-legal/jpa-legal-entry-for-request/jpa-legal-entry-for-request.module').then(m => m.JpaLegalEntryForRequestModule),
    canActivate: [AuthGuard]
  },
  //JPA Legal Entry for Request Listing
  // {
  //   path: 'jpa-legal-entry-for-request-listing',
  //   component: JpaLegalEntryForRequestListingComponent
  // },
  {
    path: 'jpa-legal-entry-for-request-listing',
    loadChildren: () => import('./jpa-legal/jpa-legal-entry-for-request-listing/jpa-legal-entry-for-request-listing.module').then(m => m.JpaLegalEntryForRequestListingModule),
    canActivate: [AuthGuard]
  },
  //JPA Legal Claim Listing
  // {
  //   path: 'jpa-legal-claim-listing',
  //   component: JpaLegalClaimListingComponent
  // },
  {
    path: 'jpa-legal-claim-listing',
    loadChildren: () => import('./jpa-legal/jpa-legal-claim-listing/jpa-legal-claim-listing.module').then(m => m.JpaLegalClaimListingModule),
    canActivate: [AuthGuard]
  },

  //doi routing
  {
    path: 're-insurance-premium-register',
    component: PremiumRegisterReInsuranceComponent
  },
  {
    path: 're-insurance-policy-master',
    component: ReInsurancePolicyMasterComponent
  },
  {
    path: 're-insurance/ri-claim-recovery-entry',
    component: RiClaimRecoveryComponent
  },

  {
    path: 'co-insurance-cheque-register',
    component: IChequeRegisterComponent
  },
  {
    path: 'co-insurance/premium-refund-entry',
    component: PremiumRefundEntryComponent
  },
  {
    path: 'co-insurance/premium-refund-listing',
    component: PremiumRefundListingComponent
  },
  {
    path: 'co-insurance/premium-memorandum',
    component: PremiumRefundMemorandumComponent
  },
  {
    path: 'co-insurance/policy-entry',
    component: PolicyEntryComponent
  },
  {
    path: 'co-insurance/policy-entry-listing',
    component: PolicyEntryListingComponent
  },
  {
    path: 'co-insurance-cheque-register-listing',
    component: IChequeRegisterListingComponent
  },

  {
    path: 'co-insurance-claim-listing',
    component: CoInsuranceClaimListingComponent
  },
  {
    path: 'co-insurance-claim-entry',
    component: CoInsuranceClaimEntryComponent
  },
  {
    path: 'co-insurance-memorandum',
    component: CoInsuranceMemorandumComponent
  },
  {
    path: 'premium-register',
    component: PremiumRegisterComponent
  },
  {
    path: 'hba/claim-entry',
    component: ClaimEntryHbaComponent
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
    path: 'hba-policy-listing',
    component: HbaPolicyListingComponent
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
    path: 'policy-printout-format',
    component: PolicyPrintoutFormatComponent
  },


];
@NgModule({
  imports: [MaterialModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: []
})
export class DoiRoutingModule { }
