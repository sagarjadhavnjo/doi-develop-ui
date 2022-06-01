import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { dmoMessage } from '../../../../../../common/error-message/common-message.constants';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-market-loan-approved-approve',
  templateUrl: './market-loan-approved-approve.component.html',
  styleUrls: ['./market-loan-approved-approve.component.css']
})
export class MarketLoanApprovedApproveComponent implements OnInit {

  errorMessages = dmoMessage;
  approveForm: FormGroup;
  maxDate = new Date();
  todayDate = Date.now();

  financialYearCtrl: FormControl = new FormControl;
  wayOfFloatationCtrl: FormControl = new FormControl;
  typeOfLoanCtrl: FormControl = new FormControl;

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

  constructor(private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.approveForm = this.fb.group({
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

  onCancel() {
    this.router.navigate(['dashboard/dmo/market-loan-approved']);
  }

  onSubmit() {
    console.log('On submit click...')
    this.router.navigate(['dashboard/dmo/market-loan-approved/approve/loan-repayment-schedule']);
  }
}
