import { ViewInnerHtmlDialogComponent } from './components/view-inner-html-dialog/view-inner-html-dialog.component';
import { NumberToWordsTwelveDigitPipe } from './pipes/number.to.words.twelve.digit.pipe';
import { AlphaNumericWithSpaceInGujaratiAndEnglishDirective } from './directives/alphaNumericWithSpaceInGujaratiAndEnglish.directive';
import { AlphaNumericWithSpecialCharatecersInGujaratiAndEnglisDirective } from './directives/alphaNumericWithSpecialCharactersInGujratiAndEnglish.directive';
import { NumberWithAutoAddedDecimalDigitsDirective } from './directives/number-with-auto-added-decimal-digits.directive';
import { DataExchangeService } from './services/data-exchange.service';
import { SevenPlusTwoDecimalDirective } from './directives/seven-plus-two-decimal.directive';
import { TwodecimalnumberDirective } from './directives/twodecimalnumber.directive';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterSelectInputPipe } from './pipes/filter.select.input.pipe';

import { FilterMultiSelectInputPipe } from './pipes/filter.multiselect.input.pipe';
import { AttachmentComponent } from './components/attachment/attachment.component';
import { ControlMessagesComponent } from './components/error-messages.component';
import { OnlynumberDirective } from './directives/onlynumber.directive';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { NumbersOnlyDirective, CdkDetailRowDirective, CommonDirective } from './directive/validation.directive';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { OkDialogComponent } from './components/ok-dialog/ok-dialog.component';
import { SaveConfirmDialogComponent } from './components/save-confirm-dialog/save-confirm-dialog.component';
import { OnlyAlphabetDirective } from './directives/onlyAlphabet.directive';
import { OnlyAlphabetWithSpaceDirective,
     OnlyAlphabetsWithSpaceDotDirective } from './directives/onlyAlphabetWithSpace.directive';
import { UppercaseDirective } from './directives/uppercase.directive';
import { AlphaNumericWithSlashHyphenDirective } from './directives/alphaNumericWithSlashHyphen.directive';
import { OnlyAlphabetNumberWithSpaceDirective } from './directives/onlyAlphabetNumberWithSpace.directive';
import { AlphaNumericWithSpaceSlashHyphenDirective } from './directives/alphaNumericWithSpaceSlashHyphen.directive';
import { NoSpaceDirective } from './directives/noSpace.directive';
import { NumberWithSlashDirective } from './directives/numberWithSlash.directive';
import { TwoDigitDecimaNumberDirective } from './directives/numberWithTwoDecimal.directive';
import { TwoDecimalWithCountDirective } from './directives/twoDecimalWithCount.directive';
import { AlphaNumericWithSlashHyphenSmallBracketsDirective } from './directives/alphaNumericWithSlashHyphenSmallBrackets.directive';
import { OnlyNumberWithHyphenDirective } from './directives/onlyNumberWithHyphen.directive';

import { DeleteConfirmDialogComponent } from './components/delete-confirm-dialog/delete-confirm-dialog.component';
import { PercentageDirective } from './directives/percentage.directive';
import { SafePipe } from './pipes/safe.pipe';
import { PercentageValidationDirective } from './directives/percentage-validation.directive';
import { AlphaNumericWithUpperCaseOnlyDirective } from './directives/alphaNumericWithUpperCaseOnly.directive';
import { OnlyAlphabetInBtwSpaceDirective } from './directives/onlyAlphabetInBtwSpace.directive';
import { OnlyNumberWithSpecialCharactersDirective } from './directives/only-number-with-special-characters.directive';
import { HandleGujaratiLangChangeDirective } from './directives/handle-gujarati-lang-change.directive';
import { HandleRatioBasedOnNoOfDigitsDirective } from './directives/handle-ratio-based-on-no-of-digits.directive';
import { HandleGujLangChangeWithoutFormControlDirective } from './directives/handle-guj-lang-change-without-form-control.directive';
import { CommonWorkflowComponent } from '../modules/core/common/common-workflow/common-workflow.component';
import { ViewCommonWorkflowHistoryComponent } from './../modules/core/common/view-common-workflow-history/view-common-workflow-history.component';
import { FilterMultipleFieldOfDataPipe } from './pipes/filter.multiple.field.pipe';
import { SearchDialogComponent } from './components/search-dialog/search-dialog.component';
import { PostTransferService } from '../modules/core/edp/services/post-transfer.service';
import { OnlyAlpaNumericSpaceDirective } from './directives/onlyAlphaNumericSpace.directive';
import { EdpCodeMaskingDirective } from './directives/edpCodeMasking.directive';
import { OnlyNumberSpaceColonDirective } from './directives/onlyNumberSpaceColon.directive';
import { JoinPipe } from './pipes/join.pipe';
import { OnlyNumberInGujaratiAndEnglishDirective } from './directives/onlyNumberInGujaratiAndEnglish.directive';
import { CommonTableComponent } from './components/common-table/common-table.component';
import { ViewDataDialogComponent } from './components/view-data-dialog/view-data-dialog.component';
import { PhoneStartValidationDirective } from './directives/phone-start-validation.directive';
import { AlphaNumericDirective, AlphaNumericslashDirective } from './directives/alphaNumeric.directive';

import { TwoDecimalNumberWithConfigDirective } from './directives/two-decimal-number.directive';
import { LowercaseDirective } from './directives/lowercase.directive';
import { L10nPipe } from './pipes/l10n.pipe';
import { L10nService } from './services/l10n.service';
// import { EmployeeConfirmationDialogComponent } from '../modules/core/pvu/employee-creation/employee-confirmation-dialog.component';
import { NoInwardSpaceDirective } from './directives/noInwardSpace.directive';
import { TwoDecimalNumberPercentageDirective } from './directives/percentage-decimal-number.directive';
import { AfterDecimalExtenstionPipe } from './pipes/after-decimal-extenstion.pipe';
import { InLakhsPipe } from './pipes/in-lakhs.pipe';


@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        FilterSelectInputPipe,
        FilterMultiSelectInputPipe,
        FilterMultipleFieldOfDataPipe,
        JoinPipe,
        AttachmentComponent,
        ControlMessagesComponent,
        CommonWorkflowComponent,
        ViewCommonWorkflowHistoryComponent,
        OnlynumberDirective,
        PhoneStartValidationDirective,
        NumbersOnlyDirective,
        TwodecimalnumberDirective,
        SevenPlusTwoDecimalDirective,
        OnlyAlphabetDirective,
        OnlyAlphabetsWithSpaceDotDirective,
        NoSpaceDirective,
        NoInwardSpaceDirective,
        OnlyAlphabetWithSpaceDirective,
        UppercaseDirective,
        AlphaNumericWithUpperCaseOnlyDirective,
        AlphaNumericWithSlashHyphenDirective,
        AlphaNumericWithSpaceSlashHyphenDirective,
        CdkDetailRowDirective,
        OnlyAlphabetNumberWithSpaceDirective,
        NumberWithSlashDirective,
        AfterDecimalExtenstionPipe,
        TwoDigitDecimaNumberDirective,
        TwoDecimalWithCountDirective,
        AlphaNumericWithSlashHyphenSmallBracketsDirective,
        OnlyNumberWithHyphenDirective,
        InLakhsPipe,
        PercentageDirective,
        NumberWithAutoAddedDecimalDigitsDirective,
        SafePipe,
        PercentageValidationDirective,
        OnlyAlphabetInBtwSpaceDirective,
        OnlyNumberWithSpecialCharactersDirective,
        HandleGujaratiLangChangeDirective,
        HandleRatioBasedOnNoOfDigitsDirective,
        HandleGujLangChangeWithoutFormControlDirective,
        ViewCommonWorkflowHistoryComponent,
        OnlyAlpaNumericSpaceDirective,
        EdpCodeMaskingDirective,
        CommonDirective,
        OnlyNumberSpaceColonDirective,
        OnlyNumberInGujaratiAndEnglishDirective,
        AlphaNumericWithSpaceInGujaratiAndEnglishDirective,
        AlphaNumericWithSpecialCharatecersInGujaratiAndEnglisDirective,
        CommonTableComponent,
        AlphaNumericDirective,
        AlphaNumericslashDirective,
        TwoDecimalNumberWithConfigDirective,
        LowercaseDirective,
        NumberToWordsTwelveDigitPipe,
        L10nPipe,
        TwoDecimalNumberPercentageDirective,
        ViewInnerHtmlDialogComponent
    ],
    declarations: [
        AfterDecimalExtenstionPipe,
        FilterSelectInputPipe,
        FilterMultiSelectInputPipe,
        FilterMultipleFieldOfDataPipe,
        JoinPipe,
        AttachmentComponent,
        ControlMessagesComponent,
        CommonWorkflowComponent,
        ViewCommonWorkflowHistoryComponent,
        OnlynumberDirective,
        PhoneStartValidationDirective,
        TwodecimalnumberDirective,
        SevenPlusTwoDecimalDirective,
        NumbersOnlyDirective,
        OnlyAlphabetDirective,
        OnlyAlphabetsWithSpaceDotDirective,
        NoSpaceDirective,
        NoInwardSpaceDirective,
        OnlyAlphabetWithSpaceDirective,
        UppercaseDirective,
        AlphaNumericWithUpperCaseOnlyDirective,
        AlphaNumericWithSlashHyphenDirective,
        AlphaNumericWithSpaceSlashHyphenDirective,
        CdkDetailRowDirective,
        //ConfirmationDialogComponent,
        OkDialogComponent,
        SaveConfirmDialogComponent,
        OnlyAlphabetNumberWithSpaceDirective,
        NumberWithSlashDirective,
        TwoDigitDecimaNumberDirective,
        TwoDecimalWithCountDirective,
        AlphaNumericWithSlashHyphenSmallBracketsDirective,
        OnlyNumberWithHyphenDirective,
        InLakhsPipe,
        DeleteConfirmDialogComponent,
        PercentageDirective,
        NumberWithAutoAddedDecimalDigitsDirective,
        SafePipe,
        PercentageValidationDirective,
        OnlyAlphabetInBtwSpaceDirective,
        OnlyNumberWithSpecialCharactersDirective,
        HandleGujaratiLangChangeDirective,
        HandleRatioBasedOnNoOfDigitsDirective,
        HandleGujLangChangeWithoutFormControlDirective,
        ViewCommonWorkflowHistoryComponent,
        SearchDialogComponent,
        OnlyAlpaNumericSpaceDirective,
        EdpCodeMaskingDirective,
        CommonDirective,
        OnlyNumberSpaceColonDirective,
        OnlyNumberInGujaratiAndEnglishDirective,
        AlphaNumericWithSpaceInGujaratiAndEnglishDirective,
        AlphaNumericWithSpecialCharatecersInGujaratiAndEnglisDirective,
        CommonTableComponent,
        ViewDataDialogComponent,
        AlphaNumericDirective,
        AlphaNumericslashDirective,
        TwoDecimalNumberWithConfigDirective,
        LowercaseDirective,
        NumberToWordsTwelveDigitPipe,
        L10nPipe,
        TwoDecimalNumberPercentageDirective,
        ViewInnerHtmlDialogComponent
    ],
    entryComponents: [CommonWorkflowComponent, ConfirmationDialogComponent],
    providers: [
        DatePipe,
        DataExchangeService,
        L10nService,
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        AfterDecimalExtenstionPipe,
        AlphaNumericWithSlashHyphenSmallBracketsDirective,
        PostTransferService
    ]
})
export class SharedModule { }
