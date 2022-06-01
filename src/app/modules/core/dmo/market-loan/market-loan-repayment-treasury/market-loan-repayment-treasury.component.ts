import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { CommonDirective } from 'src/app/common/directive/validation.directive';
import { ListValue } from '../../model/common-grant';
import { MarketLoanRepaymentTreasury } from '../../model/dmo';

@Component({
  selector: 'app-market-loan-repayment-treasury',
  templateUrl: './market-loan-repayment-treasury.component.html',
  styleUrls: ['./market-loan-repayment-treasury.component.css']
})
export class MarketLoanRepaymentTreasuryComponent implements OnInit {
  // date
  todayDate = new Date();
  // variable
  isDetails = false;
  // form group
  loanRepaymentTreasuryForm: FormGroup;
  // form control
  majorHeadCtrl: FormControl = new FormControl();
  // lists
  majorHeadList: ListValue[] = [
    { value: '1', viewValue: '6003 – Principal Payment – Capital Expenditure' },
    { value: '2', viewValue: '2049 – Interest Payment – Revenue Expenditure' }
  ];

  // table data start
  displayedColumns: string[] = [
    'select',
    'position',
    'loanDescription',
    'startDate',
    'loanAmount',
    'interestRate',
    'interestPayable',
    'treasuryAmount',
    'paymentDate',
  ];
  tableData: MarketLoanRepaymentTreasury[] = [
    {
      loanDescription: 'Reissue of 7.83',
      startDate: new Date('07/13/2016'),
      loanAmount: '20,00,00,00,000.00',
      interestRate: '7.83',
      interestPayable: ' 6,26,39,99,988.00',
      treasuryAmount: '',
      paymentDate: '',
    },
    {
      loanDescription: 'Mkt Loan @8.25%',
      startDate: new Date('01/01/2019'),
      loanAmount: '69,00,00,000.00',
      interestRate: '8.25',
      interestPayable: ' 11,38,49,877.00',
      treasuryAmount: '',
      paymentDate: '',
    },
    {
      loanDescription: 'Mkt Loan @8.43%',
      startDate: new Date('01/01/2019'),
      loanAmount: '61,00,00,000.00',
      interestRate: '8.43',
      interestPayable: ' 10,28,17,900.00',
      treasuryAmount: '',
      paymentDate: '',
    },
  ];
  dataSource = new MatTableDataSource<MarketLoanRepaymentTreasury>(this.tableData);

  // directive object for checkbox
  directiveObj = new CommonDirective();

  // paginator
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.dataSource.paginator = mp;
  }

  // constructor
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.loanRepaymentTreasuryForm = this.fb.group({
      majorHead: ['']
    });
  }

  getDetails() {
    this.isDetails = true;
  }

  onCancelClick() {
    this.loanRepaymentTreasuryForm.reset();
  }

}
