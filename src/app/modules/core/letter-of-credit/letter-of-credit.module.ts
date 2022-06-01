import { SharedModule } from './../../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LetterOfCreditRoutingModule } from './letter-of-credit-routing.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
//import { CommonProtoModule } from '../common/common.module';
// tslint:disable-next-line: max-line-length
import { LcAdviceReceivedComponent, LcNumberDialogComponent, MapEPaymentComponent, adviceReceiedDialogCheckList, AdviceReceivedEmployeeDialog, PrintChequeDialog, GenerateChequeNoDialog } from './lc-advice-received/lc-advice-received.component';
// tslint:disable-next-line: max-line-length
import { LcChequebookActivateInactivateComponent } from './cheque-book-activate-inactivate/lc-chequebook-activate-inactivate/lc-chequebook-activate-inactivate.component';
// tslint:disable-next-line: max-line-length
import { ChequeCancelationDivisionComponent } from './cheque-cancelation-division/cheque-cancelation-division.component';
import { ChequeToChequeEffectDivisionComponent } from './cheque-to-cheque-effect-division/cheque-to-cheque-effect-division.component';
import { InwardOnlineAdviceComponent, PartyNameDialogComponent } from './inward-online-advice/inward-online-advice.component';
import { AdviceInwardSubmitComponent, SavedAdviceComponent } from './saved-advice/saved-advice.component';
import { AdviceCardexVerificationComponent, PartyNameListDialogComponent } from './advice-cardex-verification/advice-cardex-verification.component';
import { LcAdviceVerificationComponent } from './lc-advice-verification/lc-advice-verification.component';
import { LcAdviceAuthorizationComponent } from './lc-advice-authorization/lc-advice-authorization.component';
// tslint:disable-next-line: max-line-length
// tslint:disable-next-line: max-line-length
import { LcChequebookListingComponent } from './cheque-book-activate-inactivate/lc-chequebook-listing/lc-chequebook-listing.component';
// tslint:disable-next-line: max-line-length
import { LcChequebookListingViewComponent } from './cheque-book-activate-inactivate/lc-chequebook-listing-view/lc-chequebook-listing-view.component';
// tslint:disable-next-line: max-line-length
import { LcAccountClosingRequestCreateComponent } from './lc-closing-request/lc-account-closing-request-create/lc-account-closing-request-create.component';
// tslint:disable-next-line: max-line-length
import { LcAccountClosingRequestSavedComponent } from './lc-closing-request/lc-account-closing-request-saved/lc-account-closing-request-saved.component';
// tslint:disable-next-line: max-line-length
// tslint:disable-next-line: max-line-length
import { LcDistributionCircleComponent } from './lc-distribution/lc-distribution-circle/lc-distribution-circle.component';
// tslint:disable-next-line: max-line-length
import { LcVerificationToEditComponent } from './lc-distribution/lc-verification-to-edit/lc-verification-to-edit.component';
import { LcAdvicePreparationViewComponent } from './lc-advice-preparation-view/lc-advice-preparation-view.component';
// tslint:disable-next-line: max-line-length
// tslint:disable-next-line: max-line-length
import { ChequeCancelationDivisionListingComponent } from './cheque-cancelation-division-listing/cheque-cancelation-division-listing.component';
import { ChequeCancelationDivisionViewComponent } from './cheque-cancelation-division-view/cheque-cancelation-division-view.component';
import { CreateLcAccountDivisionComponent } from './lc-opening-request/create-lc-account-division/create-lc-account-division.component';
// tslint:disable-next-line: max-line-length
import { CreateLcAccountListingDivisionComponent } from './lc-opening-request/create-lc-account-listing-division/create-lc-account-listing-division.component';
// tslint:disable-next-line: max-line-length
import { HistoryDialogComponent } from './history-dialog/history-dialog.component';

import {
  NumbersAlphabetsOnlyDirective,
  NumbersAlphabetsSpaceOnlyDirective,
  AlphabetsNumberSpaceSpecialOnlyDirective,
  AlphabetSpaceDotDirective,
  NoSpecialCharacterDirective,
  AlphabetOnlyDirective,
  NumbersOnlyDirective,
  CdkDetailRowDirective,
  AutoFocusDirective,
  AlphabetsSpaceOnlyDirective,
  DecimalLimitTwoOnlyDirective,
  DecimalPoint2Directive,
  DateOnlyDirective,
  CommonDirective,
  AlphabetsHyphenOnlyDirective,
  AlphabetSpaceCommaOnlyDirective,
  PercentageOnlyDirective,
  NumbersOnlyKeypressDirective,
  NumbersHyphenOnlyDirective,
  AlphabetSpaceDotCommaOnlyDirective,
  TwoDigitTwoDecimalOnlyDirective,
  NumberDotOnlyDirective,
  AlphabetSpaceSlashOnlyDirective,
  HourFormatDirective,
  AlphabetNumberHypenOnlyDirective,
  NumberHypenOnlyDirective,
  AlphabetNumberSpaceDotOnlyDirective,
  PrEmpNoOnlyDirective,
  NumbersAsteriskOnlyDirective,
  SevenDigitOnlyDirective,
  PayrollBudgetHeadsOnlyDirective,
  EmpNoDirective,
  NegativeNumberDirective,
  AppendDecimalDirective,
  PercentageOnlyDecimalTwoDirective, NumberSlashOnlyDirective
} from './directive/validation.directive';
import { LcCommonWorkflowComponent } from './lc-common-workflow/lc-common-workflow.component';
import { CommonProtoModule } from 'src/app/common/common.module';
import { ChequeToChequeEffectDivisionListingComponent } from './cheque-to-cheque-effect-divlisting/cheque-to-cheque-effect-divlisting.component';
import { LcCommonWorkflowHistoryComponent } from './lc-common-workflow-history/lc-common-workflow-history.component';
import { ChequeToChequeEffectDivisionViewComponent } from './cheque-to-effect-cheque-division-view/cheque-to-cheque-effect-division-view.component';
// import { CommonAttachmentComponent } from 'src/app/common/common-attachment/common-attachment.component';

@NgModule({

  imports: [
    LetterOfCreditRoutingModule,
    NgxMatSelectSearchModule,
    CommonModule,
    CommonProtoModule,
    SharedModule

  ],
  declarations: [
    LcAdviceReceivedComponent,
    LcNumberDialogComponent,
    MapEPaymentComponent,
    PartyNameDialogComponent,
    PartyNameListDialogComponent,
    adviceReceiedDialogCheckList,
    LcChequebookActivateInactivateComponent,
    ChequeCancelationDivisionComponent,
    ChequeToChequeEffectDivisionComponent,
    ChequeToChequeEffectDivisionListingComponent,
    ChequeToChequeEffectDivisionViewComponent,
    InwardOnlineAdviceComponent,
    SavedAdviceComponent,
    AdviceCardexVerificationComponent,
    LcAdviceVerificationComponent,
    // LcAdviceDetailsComponent,
    LcAdviceAuthorizationComponent,
    LcChequebookListingComponent,
    LcChequebookListingViewComponent,
    LcAccountClosingRequestCreateComponent,
    LcAccountClosingRequestSavedComponent,
    LcDistributionCircleComponent,
    LcVerificationToEditComponent,
    LcAdvicePreparationViewComponent,
    ChequeCancelationDivisionListingComponent,
    ChequeCancelationDivisionViewComponent,
    CreateLcAccountDivisionComponent,
    CreateLcAccountListingDivisionComponent,
    AdviceReceivedEmployeeDialog,
    HistoryDialogComponent,
    PrintChequeDialog,
    GenerateChequeNoDialog,
    NumbersAlphabetsOnlyDirective,
    NumbersAlphabetsSpaceOnlyDirective,
    AlphabetsNumberSpaceSpecialOnlyDirective,
    AlphabetSpaceDotDirective,
    NoSpecialCharacterDirective,
    AlphabetOnlyDirective,
    NumbersOnlyDirective,
    CdkDetailRowDirective,
    AutoFocusDirective,
    AlphabetsSpaceOnlyDirective,
    DecimalLimitTwoOnlyDirective,
    DecimalPoint2Directive,
    DateOnlyDirective,
    CommonDirective,
    AlphabetsHyphenOnlyDirective,
    AlphabetSpaceCommaOnlyDirective,
    PercentageOnlyDirective,
    NumbersOnlyKeypressDirective,
    NumbersHyphenOnlyDirective,
    AlphabetSpaceDotCommaOnlyDirective,
    TwoDigitTwoDecimalOnlyDirective,
    NumberDotOnlyDirective,
    AlphabetSpaceSlashOnlyDirective,
    HourFormatDirective,
    AlphabetNumberHypenOnlyDirective,
    NumberHypenOnlyDirective,
    AlphabetNumberSpaceDotOnlyDirective,
    PrEmpNoOnlyDirective,
    NumbersAsteriskOnlyDirective,
    SevenDigitOnlyDirective,
    PayrollBudgetHeadsOnlyDirective,
    EmpNoDirective,
    NegativeNumberDirective,
    AppendDecimalDirective,
    PercentageOnlyDecimalTwoDirective,
    NumberSlashOnlyDirective,
    LcCommonWorkflowComponent,
    AdviceInwardSubmitComponent,
    LcCommonWorkflowHistoryComponent
    // CommonAttachmentComponent
  ],
  entryComponents: [
    LcNumberDialogComponent,
    MapEPaymentComponent,
    PartyNameDialogComponent,
    PartyNameListDialogComponent,
    adviceReceiedDialogCheckList,
    // LcAdviceDetailsComponent,
    AdviceReceivedEmployeeDialog,
    HistoryDialogComponent,
    PrintChequeDialog,
    GenerateChequeNoDialog,
    AdviceInwardSubmitComponent
  ]
})

export class LetterOfCreditModule { }
