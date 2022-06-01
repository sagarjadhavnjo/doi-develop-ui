import { CommonDirective } from '../../../../../shared/directive/validation.directive';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { LoanRepaymentSchedule } from 'src/app/models/dmo/dmo';
import { NssfLoanService } from '../../services/nssf-loan.service';
import { getNssfRepaymentObject } from '../../model/nssf-loan.data-model'
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-loan-repayment-schedule',
  templateUrl: './loan-repayment-schedule.component.html',
  styleUrls: ['./loan-repayment-schedule.component.css']
})
export class LoanRepaymentScheduleComponent implements OnInit {

  // Table data for Loan Repayment Schedule Table
  Element_Data: LoanRepaymentSchedule[] = [
    {
      financialYear: '2015-2016',
      installmentDate: '31-Jan-2016',
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
    'interest',
    'closingBalance'
  ];

  // Initialize variables and form
  loanRepaymentScheduleForm: FormGroup;
  todayDate = Date.now();
  directiveObj = new CommonDirective();
  // dataSource = new MatTableDataSource<LoanRepaymentSchedule>(this.Element_Data);
  dataSource: any;

  // Initialize Paginator
  private paginator: MatPaginator;
  private sort: MatSort;
  loanId: any;
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  constructor(private fb: FormBuilder
    , private _nssfLoanService: NssfLoanService
    , private router: Router) { }

  // Initialize Form Fields
  ngOnInit() {
    this.loanRepaymentScheduleForm = this.fb.group({
      sanctionDate: [],
      loanStartDate: [],
      loanAmount: [],
      interestRate: [],
      loanTenure: [],
      moratoriumPeriod: [],
    });

    this.loanId = this._nssfLoanService.getLoanId();
    if(!this.loanId) {
      this.router.navigate(['/dashboard/dmo/nssf-loan-approved']);
    }
    this.fetchScheduleDetails(this.loanId);
  }

  fetchScheduleDetails(loanId) {
    this._nssfLoanService.fetchRepaymentScheduleData({id: loanId}).subscribe(res => {
      if (res && res['status'] === 200) {
        const data = res['result'];
        const element_data = [];
        const formData = {
          sanctionDate: data.sanctionOrderDate ? moment(data.sanctionOrderDate).format('YYYY-MM-DD') : '',
          loanStartDate: data.loanStartDate ? moment(data.loanStartDate).format('YYYY-MM-DD') : '',
          loanAmount: data.loanAmount ? data.loanAmount : '',
          interestRate: data.loanROI ? data.loanROI : '',
          loanTenure: data.loanTenure ? data.loanTenure : '',
          moratoriumPeriod: data.moratariumPeriod ? data.moratariumPeriod : ''
        }
        this.loanRepaymentScheduleForm.patchValue(formData);
        this.loanRepaymentScheduleForm.controls.sanctionDate.disable();
        this.loanRepaymentScheduleForm.controls.loanStartDate.disable();
        this.loanRepaymentScheduleForm.controls.loanAmount.disable();
        this.loanRepaymentScheduleForm.controls.interestRate.disable();
        this.loanRepaymentScheduleForm.controls.loanTenure.disable();
        this.loanRepaymentScheduleForm.controls.moratoriumPeriod.disable();
        data.dtos.forEach(element => {
          element_data.push(getNssfRepaymentObject(element))
        });
        this.dataSource = new MatTableDataSource<LoanRepaymentSchedule>(element_data);
      }
    }, error => {

    });
  }

  // Method to for setting data source attributes
  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}
