import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LcAdviceReceivedComponent } from './lc-advice-received/lc-advice-received.component';
// tslint:disable-next-line: max-line-length

import { LcChequebookActivateInactivateComponent } from './cheque-book-activate-inactivate/lc-chequebook-activate-inactivate/lc-chequebook-activate-inactivate.component';
// tslint:disable-next-line: max-line-length
import { ChequeCancelationDivisionComponent } from './cheque-cancelation-division/cheque-cancelation-division.component';
import { ChequeToChequeEffectDivisionComponent } from './cheque-to-cheque-effect-division/cheque-to-cheque-effect-division.component';
import { InwardOnlineAdviceComponent } from './inward-online-advice/inward-online-advice.component';
import { AdviceCardexVerificationComponent } from './advice-cardex-verification/advice-cardex-verification.component';
import { LcAdviceVerificationComponent } from './lc-advice-verification/lc-advice-verification.component';
import { LcAdviceAuthorizationComponent } from './lc-advice-authorization/lc-advice-authorization.component';
// tslint:disable-next-line: max-line-length
// tslint:disable-next-line: max-line-length
import { LcChequebookListingComponent } from './cheque-book-activate-inactivate/lc-chequebook-listing/lc-chequebook-listing.component';
// tslint:disable-next-line: max-line-length
import { LcChequebookListingViewComponent } from './cheque-book-activate-inactivate/lc-chequebook-listing-view/lc-chequebook-listing-view.component';
// tslint:disable-next-line: max-line-length
// tslint:disable-next-line: max-line-length
// tslint:disable-next-line: max-line-length
// tslint:disable-next-line: max-line-length
// tslint:disable-next-line: max-line-length
// tslint:disable-next-line: max-line-length
import { LcAccountClosingRequestCreateComponent } from './lc-closing-request/lc-account-closing-request-create/lc-account-closing-request-create.component';
// tslint:disable-next-line: max-line-length
import { LcAccountClosingRequestSavedComponent } from './lc-closing-request/lc-account-closing-request-saved/lc-account-closing-request-saved.component';
// tslint:disable-next-line: max-line-length
import { LcDistributionCircleComponent } from './lc-distribution/lc-distribution-circle/lc-distribution-circle.component';
// tslint:disable-next-line: max-line-length
import { LcVerificationToEditComponent } from './lc-distribution/lc-verification-to-edit/lc-verification-to-edit.component';
import { LcAdvicePreparationViewComponent } from './lc-advice-preparation-view/lc-advice-preparation-view.component';
// tslint:disable-next-line: max-line-length
import { ChequeCancelationDivisionListingComponent } from './cheque-cancelation-division-listing/cheque-cancelation-division-listing.component';
import { ChequeCancelationDivisionViewComponent } from './cheque-cancelation-division-view/cheque-cancelation-division-view.component';
import { CreateLcAccountDivisionComponent } from './lc-opening-request/create-lc-account-division/create-lc-account-division.component';
// tslint:disable-next-line: max-line-length
import { CreateLcAccountListingDivisionComponent } from './lc-opening-request/create-lc-account-listing-division/create-lc-account-listing-division.component';
// tslint:disable-next-line: max-line-length
import { SavedAdviceComponent } from './saved-advice/saved-advice.component';
import { ChequeToChequeEffectDivisionListingComponent } from './cheque-to-cheque-effect-divlisting/cheque-to-cheque-effect-divlisting.component';
import { ChequeToChequeEffectDivisionViewComponent } from './cheque-to-effect-cheque-division-view/cheque-to-cheque-effect-division-view.component';
const routes: Routes = [
  {
    path: 'lc-advice-preparation',
    component: LcAdviceReceivedComponent
  },
  {
    path: 'lc-cheque-activate-inactivate-division',
    component: LcChequebookActivateInactivateComponent
  },
  {
    path: 'lc-cheque-cancelation-division',
    component: ChequeCancelationDivisionComponent
  },
{
    path: 'lc-cheque-to-cheque-effect',
    component: ChequeToChequeEffectDivisionComponent
  },

  {
    path: 'lc-cheque-to-cheque-effect-listing',
    component: ChequeToChequeEffectDivisionListingComponent
  },
  {
    path: 'lc-cheque-to-cheque-effect-view',
    component: ChequeToChequeEffectDivisionViewComponent
  },
{
    path: 'lc-inward-online-advice',
    component: InwardOnlineAdviceComponent
  },
  {
    path: 'lc-saved-advice',
    component: SavedAdviceComponent
  },
  {
    path: 'lc-advice-cardex-verification',
    component: AdviceCardexVerificationComponent
  },
  {
    path: 'lc-advice-verification',
    component: LcAdviceVerificationComponent
  },
{
    path: 'lc-advice-authorization',
    component: LcAdviceAuthorizationComponent
  },
  {
    path: 'lc-chequebook-listing',
    component: LcChequebookListingComponent
  },
  {
    path: 'lc-chequebook-listing-view',
    component: LcChequebookListingViewComponent
  },
  {
    path: 'lc-closing-request-create',
    component: LcAccountClosingRequestCreateComponent
  },
  {
    path: 'lc-closing-request-saved',
    component: LcAccountClosingRequestSavedComponent
  },
  {
    path: 'lc-distribution-circle',
    component: LcDistributionCircleComponent
  },
  {
    path: 'lc-verification-to-edit',
    component: LcVerificationToEditComponent
  },
  {
    path: 'lc-advice-preparation-view',
    component: LcAdvicePreparationViewComponent
  },
{
    path: 'lc-cheque-cancelation-division-listing',
    component: ChequeCancelationDivisionListingComponent
  },
  {
    path: 'lc-cheque-cancelation-division-view',
    component: ChequeCancelationDivisionViewComponent
  },
  {
    path: 'create-lc-account-division',
    component: CreateLcAccountDivisionComponent
  },
  {
    path: 'create-lc-account-listing-division',
    component: CreateLcAccountListingDivisionComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class LetterOfCreditRoutingModule { }
