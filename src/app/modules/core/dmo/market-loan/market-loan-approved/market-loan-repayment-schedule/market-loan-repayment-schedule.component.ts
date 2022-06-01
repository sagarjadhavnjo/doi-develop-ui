import { CommonDirective } from 'src/app/common/directive/validation.directive';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MarketLoanRepaymentSchedule } from '../../../model/dmo';
import { Router } from '@angular/router';
@Component({
  selector: 'app-market-loan-repayment-schedule',
  templateUrl: './market-loan-repayment-schedule.component.html',
  styleUrls: ['./market-loan-repayment-schedule.component.css']
})
export class MarketLoanRepaymentScheduleComponent implements OnInit {

  // Table data for Loan Repayment Schedule Table
  Element_Data: MarketLoanRepaymentSchedule[] = [
    {
      financialYear: '2015-2016',
      installmentDate: '31-Jan-2016',
      openingBalance: '51000',
      principal: '0',
      interest: '4750',
      closingBalance: '50000'
    },
    {
      financialYear: '2016-2017',
      installmentDate: '31-Jan-2017',
      openingBalance: '51000',
      principal: '0',
      interest: '4750',
      closingBalance: '50000'
    },
    {
      financialYear: '2017-2018',
      installmentDate: '31-Jan-2018',
      openingBalance: '51000',
      principal: '0',
      interest: '4750',
      closingBalance: '50000'
    }
    ,
    {
      financialYear: '2018-2019',
      installmentDate: '31-Jan-2019',
      openingBalance: '51000',
      principal: '0',
      interest: '4750',
      closingBalance: '50000'
    }
    ,
    {
      financialYear: '2019-2020',
      installmentDate: '31-Jan-2020',
      openingBalance: '51000',
      principal: '0',
      interest: '4750',
      closingBalance: '50000'
    }
  ];

  // Table Columns for Loan Repayment Schedule Table
  displayedColumns: any[] = [
    'position',
    'financialYear',
    'installmentDate',
    'openingBalance',
    'principal',
    // 'interest',
    'closingBalance'
  ];

  // Initialize variables and form
  marketLoanRepaymentScheduleForm: FormGroup;
  todayDate = Date.now();
  dataSource = new MatTableDataSource<MarketLoanRepaymentSchedule>(this.Element_Data);

  // Initialize Paginator
  private paginator: MatPaginator;
  private sort: MatSort;

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }
  directiveObj = new CommonDirective();
  constructor(private fb: FormBuilder
    , private router: Router) { }

  // Initialize Form Fields
  ngOnInit() {
    this.marketLoanRepaymentScheduleForm = this.fb.group({
      sanctionDate: [{ value: '01-APR-2016', disabled: true }],
      loanStartDate: [{ value: '01-APR-2015', disabled: true }],
      loanAmount: [{ value: '50000.00', disabled: true }],
      interestRate: [{ value: '0.5', disabled: true }],
      loanTenure: [{ value: '25.0', disabled: true }],
      moratoriumPeriod: [{ value: '5.0', disabled: true }],
    });
  }


  // Method to for setting data source attributes
  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onSubmit() {
    this.router.navigate(['dashboard/dmo/market-loan-received']);
  }
}
