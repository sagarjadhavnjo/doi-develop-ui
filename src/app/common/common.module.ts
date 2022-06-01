import { MaterialModule } from './../shared/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { BlockCopyPasteDirective } from './directive/block-copy-paste.directive';
import { ToastrModule } from 'ngx-toastr';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AppHeaderComponent, SwitchRoleDialogComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
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
  PercentageOnlyDecimalTwoDirective, NumberSlashOnlyDirective, AlphabetsSpaceDashOnlyDirective
} from './directive/validation.directive';
import { CharactersOnlyDirective } from './directive/characters-only-directive';
import { FilterSelectInputPipe } from './pipes/filter.select.input.pipe';
import { NoRightClickDirective } from './directive/no-right-click.directive';
import { NumberToWordsPipe } from './pipes/number-to-words.pipe';
import { CommonAttachmentComponent } from './common-attachment/common-attachment.component';
import { DebounceKeyupDirective } from './directive/debounce-keyup.directive';


// import { DdoDirectiveDirective } from './directive/ddo-directive.directive';
// import { LockingUnlockingTimeLimitComponent }
// from './locking-unlocking-time-limit/locking-unlocking-time-limit.component';
// tslint:disable-next-line: max-line-length

@NgModule({
  declarations: [
    FooterComponent,
    AppHeaderComponent,
    NumbersOnlyDirective,
    CdkDetailRowDirective,
    FilterSelectInputPipe,
    NumberToWordsPipe,
    BlockCopyPasteDirective,
    CharactersOnlyDirective,
    SwitchRoleDialogComponent,
    NoRightClickDirective,
    AutoFocusDirective,
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
    CommonAttachmentComponent,
    PercentageOnlyDecimalTwoDirective,
    NumberSlashOnlyDirective,
    AlphabetsSpaceDashOnlyDirective,
    // DdoDirectiveDirective,
    AlphabetsSpaceDashOnlyDirective,
    AlphabetsSpaceDashOnlyDirective,
    //DdoDirectiveDirective,
    DebounceKeyupDirective,
  ],
  exports: [
    FooterComponent,
    AppHeaderComponent,
    NumbersOnlyDirective,
    CdkDetailRowDirective,
    FilterSelectInputPipe,
    BlockCopyPasteDirective,
    NumberToWordsPipe,
    MaterialModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMatSelectSearchModule,
    CharactersOnlyDirective,
    NoRightClickDirective,
    AutoFocusDirective,
    NumbersAlphabetsOnlyDirective,
    NumbersAlphabetsSpaceOnlyDirective,
    AlphabetsNumberSpaceSpecialOnlyDirective,
    AlphabetSpaceDotDirective,
    NoSpecialCharacterDirective,
    AlphabetOnlyDirective,
    NumbersOnlyKeypressDirective,
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
    NumbersHyphenOnlyDirective,
    AlphabetSpaceDotCommaOnlyDirective,
    TwoDigitTwoDecimalOnlyDirective,
    NumberDotOnlyDirective,
    AlphabetSpaceSlashOnlyDirective,
    HourFormatDirective,
    AlphabetNumberHypenOnlyDirective,
    PrEmpNoOnlyDirective,
    NumbersAsteriskOnlyDirective,
    SevenDigitOnlyDirective,
    PayrollBudgetHeadsOnlyDirective,
    EmpNoDirective,
    NegativeNumberDirective,
    AppendDecimalDirective,
    CommonAttachmentComponent,
    PercentageOnlyDecimalTwoDirective,
    NumberSlashOnlyDirective,
    AlphabetsSpaceDashOnlyDirective,
    // DdoDirectiveDirective,
    DebounceKeyupDirective,
  ],
  imports: [
    MaterialModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMatSelectSearchModule,
    NgxMaskModule.forRoot(),
    ToastrModule.forRoot()
  ],
  // tslint:disable-next-line:max-line-length
  entryComponents: [
    SwitchRoleDialogComponent
    // RevisedRecepitForwardDialogComponent,
    // // NewItemEstimatesForwardDialogComponent,
    // RevisedEstimateForwardDialogComponent,
    // ReceiptForwardDialogComponent,
    // LockingUnlockingChargeForwardDialogComponent
  ],
  providers: []
})
export class CommonProtoModule { }
