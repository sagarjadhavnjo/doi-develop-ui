import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-market-loan-repayment-rbi',
  templateUrl: './market-loan-repayment-rbi.component.html',
  styleUrls: ['./market-loan-repayment-rbi.component.css']
})
export class MarketLoanRepaymentRbiComponent implements OnInit {


  loanRepaymentForm: FormGroup;
  maxDate = new Date();
  todayDate = Date.now();
  isDetails = false;

  // table data
  Element_Data: any[] = [
    {
      memoNo: '1',
      adviceNo: '1',
      dpDate: '01-Apr-2015',
      adviceDate: '01-Apr-2015',
      adviceBy: 'NAGALAND',
      transactionDescription: 'Other IGA Transaction',
    },
    {
      memoNo: '2',
      adviceNo: '2',
      dpDate: '04-Jan-2017',
      adviceDate: '04-Jan-2017',
      adviceBy: 'ASSAM',
      transactionDescription: 'GIA',
      addDetails: 'Add Details',
    },
    {
      memoNo: '2',
      adviceNo: '2',
      dpDate: '07-Jan-2017',
      adviceDate: '07-Jan-2017',
      adviceBy: 'NAGALAND',
      transactionDescription: 'GIA',
      addDetails: 'Add Details',
    },
    {
      memoNo: '28',
      adviceNo: '108',
      dpDate: '11-Dec-2018',
      adviceDate: '11-Dec-2018',
      adviceBy: 'RAJASTHAN',
      transactionDescription: '9.50% NSSF Loan',
    },

  ];

  dataSource = new MatTableDataSource<any>(this.Element_Data);

  displayedColumns: any[] = [
    'position',
    'memoNo',
    'adviceNo',
    'dpDate',
    'adviceDate',
    'adviceBy',
    'transactionDescription',
  ];

  constructor(private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.loanRepaymentForm = this.fb.group({
      fromDate: [''],
      toDate: [''],
    });
  }

  getDetails() {
    this.isDetails = true;
  }


}
