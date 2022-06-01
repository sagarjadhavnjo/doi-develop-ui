import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { dmoMessage } from 'src/app/common/error-message/common-message.constants';
import { CommonList } from 'src/app/modules/core/common/model/common-listing';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { msgConst } from 'src/app/shared/constants/dmo/dmo-msg.constants';
import { WorkflowDmoComponent } from '../../../daily-position/workflow-dmo/workflow-dmo.component';
import { setMarketLoanRequestObject } from '../../../model/market-loan.data-model';
import { MarketLoanService } from '../../../services/market-loan.service';
import { ToastMsgService } from '../../../services/toast.service';

@Component({
  selector: 'app-market-loan-received-add-details',
  templateUrl: './market-loan-received-add-details.component.html',
  styleUrls: ['./market-loan-received-add-details.component.css']
})
export class MarketLoanReceivedAddDetailsComponent implements OnInit, OnDestroy {

  finanacialYearList: any[] = [
    { value: '1', viewValue: '2018-2019' },
    { value: '2', viewValue: '2019-2020' },
    { value: '3', viewValue: '2020-2021' },
    { value: '4', viewValue: '2021-2022' },
    { value: '5', viewValue: '2022-2023' },
    { value: '6', viewValue: '2023-2024' },
  ];

  wayOfFloatationList: any[] = [
    { value: '1', viewValue: 'Auction' },
  ];

  loanList: any[] = [
    { value: '1', viewValue: 'New Loan' },
  ];
  todayDate = new Date();
  marketLoanReceivedAddDetailsForm: FormGroup;
  financialYearCtrl: FormControl = new FormControl;
  wayOfFloatationCtrl: FormControl = new FormControl;
  typeOfLoanCtrl: FormControl = new FormControl;
  errorMessages = dmoMessage;
  marketLoanDPObj: any;

  constructor(private fb: FormBuilder
    , private router: Router
    , private _marketLoanService: MarketLoanService
    , private _toast: ToastMsgService
    , private dialog: MatDialog) { }

  ngOnInit() {
    this.marketLoanDPObj = this._marketLoanService.getDPObj();
    if(!this.marketLoanDPObj) {
      this.router.navigate(['dashboard/dmo/market-loan-received']);
    }
    this.initForm();
    this.marketLoanReceivedAddDetailsForm.get('totalAmountReceived').patchValue(this.marketLoanDPObj.creditAmount);
    this.marketLoanReceivedAddDetailsForm.get('premiumAmount').patchValue(this.marketLoanDPObj.creditAmount);
    // On Value change premium amount would changed
    this.marketLoanReceivedAddDetailsForm.get('totalAmountReceived').valueChanges.subscribe(value => {
      const loanAmt = this.marketLoanReceivedAddDetailsForm.value.loanAmount;
      if(loanAmt) {
        this.marketLoanReceivedAddDetailsForm.get('premiumAmount').patchValue(value-loanAmt);
      }
    });
    this.marketLoanReceivedAddDetailsForm.get('loanAmount').valueChanges.subscribe(value => {
      const totAmt = this.marketLoanReceivedAddDetailsForm.value.totalAmountReceived;
      if(totAmt) {
        this.marketLoanReceivedAddDetailsForm.get('premiumAmount').patchValue(totAmt-value);
      }
    });
  }

  ngOnDestroy() {
    this._marketLoanService.setDPData(null);
  }

  initForm() {
    this.marketLoanReceivedAddDetailsForm = this.fb.group({
      finanacialYear: ['', Validators.required],
      totalAmountReceived: ['', Validators.required],
      loanAmount: ['', Validators.required],
      premiumAmount: ['', Validators.required],
      notificationNumber: ['', Validators.required],
      notificationDate: [''],
      loanStartDate: [''],
      wayOfFloatation: ['', Validators.required],
      typeOfLoan: ['', Validators.required],
      loanDescription: ['', Validators.required],
      tranche: [''],
      loanTenure: ['', Validators.required],
      interestRate: ['', Validators.required],
      numberOfIssue: ['', Validators.required],
      moratotiumPeriod: ['', Validators.required],
      principalUnderMoratoritum: ['', Validators.required],
      totalNumberOfRepaymentInstallments: ['', Validators.required],
      numberOfRepaymentInstallmentsPerYear: ['', Validators.required],
      firstInstallmentDate: ['', Validators.required],
      numberOfInstallmentsinaYear: ['', Validators.required],
      firstInstallmentDateInterest: ['', Validators.required],
    });
  }

  getMarketLoanDetails() {
    const reqObj = {};
    this._marketLoanService.fetchMarketLoanReceivedDetails(reqObj).subscribe(res => {
      if (res && res['result'] && res['status'] === 200) {}
    })
  }

  onSubmit() {
    if(this.marketLoanReceivedAddDetailsForm.valid) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '360px',
        data: msgConst.CONFIRMATION_DIALOG.CONFIRMATION
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result === 'yes') {
          const dialogRef = this.dialog.open(WorkflowDmoComponent, {
            width: '1200px',
            height: '600px'
          });
          dialogRef.afterClosed().subscribe(result => {
            if (result === 'submit') {
              console.log(this.marketLoanReceivedAddDetailsForm.getRawValue());
              const reqObj = setMarketLoanRequestObject(this.marketLoanReceivedAddDetailsForm.getRawValue(), this.marketLoanDPObj);
              console.log('reqObj ==>', reqObj);
              this._marketLoanService.saveMarketLoanReceivedDetails(reqObj).subscribe(res => {
                if (res && res['result'] && res['status'] === 200) {
                  this._toast.success('Data submitted successfully.');
                  this.router.navigate(['dashboard/dmo/market-loan-received']);
                }
              }, error => {
                this._toast.error('Something went wrong.');
              });
            }
          });
        }
      });
    } else {
      this.marketLoanReceivedAddDetailsForm.markAllAsTouched();
    }
  }

  onClose() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '360px',
      data: msgConst.CONFIRMATION_DIALOG.CONFIRMATION
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.router.navigate(['dashboard/dmo/market-loan-received']);
      }
    })
  }
}
