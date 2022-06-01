import { CommonDirective } from 'src/app/common/directive/validation.directive';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NssfLoanService } from '../../services/nssf-loan.service';
import { getDPListObject, getNssfPaybleObject } from '../../model/nssf-loan.data-model'

@Component({
  selector: 'app-nssf-loan-repayment',
  templateUrl: './nssf-loan-repayment.component.html',
  styleUrls: ['./nssf-loan-repayment.component.css']
})
export class NssfLoanRepaymentComponent implements OnInit {


  nssfLoanRepaymentForm: FormGroup;
  maxDate = new Date();
  todayDate = Date.now();
  ismatchWithPayable = false;

  // table data
  Element_Data: any[] = [
    {
      memoNo: '1',
      adviceNo: '1',
      dpDate: '01-Apr-2015',
      adviceDate: '01-Apr-2015',
      adviceBy: 'NAGALAND',
      transactionDescription: 'Other IGA Transaction',
      debitAmount: '50000.00',
    },
    {
      memoNo: '2',
      adviceNo: '2',
      dpDate: '04-Jan-2017',
      adviceDate: '04-Jan-2017',
      adviceBy: 'ASSAM',
      transactionDescription: 'GIA',
      debitAmount: '10000.00',
      addDetails: 'Add Details',
    },
    {
      memoNo: '2',
      adviceNo: '2',
      dpDate: '07-Jan-2017',
      adviceDate: '07-Jan-2017',
      adviceBy: 'NAGALAND',
      transactionDescription: 'GIA',
      debitAmount: '1000000.00',
      addDetails: 'Add Details',
    },
    {
      memoNo: '28',
      adviceNo: '108',
      dpDate: '11-Dec-2018',
      adviceDate: '11-Dec-2018',
      adviceBy: 'RAJASTHAN',
      transactionDescription: '9.50% NSSF Loan',
      debitAmount: '1000000.00',
    },

  ];
  payableAmountData: any[] = [
    {
      loanNo: '467654',
      dueDate: new Date('01-31-2016'),
      dpDate: new Date('01-31-2016'),
      interest: '4750.00',
      principal: '0.00',
    },
    {
      loanNo: '467655',
      dueDate: new Date('01-31-2016'),
      dpDate: new Date('01-31-2016'),
      interest: '4750.00',
      principal: '0.00',
    },
    {
      loanNo: '467656',
      dueDate: new Date('01-31-2016'),
      dpDate: new Date('01-31-2016'),
      interest: '4750.00',
      principal: '0.00',
    },
  ];
  matchWithPayableData: any[] = [
    {
      memoNo: '1',
      adviceNo: '1',
      dueDate: new Date('01-31-2027'),
      principal: '2500.00',
      interest: '0.00',
      amountUnpaid: '2500.00',
      amountPaid: '0.00',
      amountOutstanding: '32500.00',
    },
  ];

  // dataSource = new MatTableDataSource<any>(this.Element_Data);
  dataSource: any;
  // payableAmountsDataSource = new MatTableDataSource<any>(this.payableAmountData);
  payableAmountsDataSource: any;
  matchWithPayableDataSource = new MatTableDataSource<any>(this.matchWithPayableData);

  displayedColumns: any[] = [
    'select',
    'position',
    'memoNo',
    'adviceNo',
    'dpDate',
    'adviceDate',
    'adviceBy',
    'transactionDescription',
    'debitAmount',
  ];

  payableAmountsDisplayedColumns: any[] = [
    'select',
    'position',
    'loanNo',
    'dueDate',
    'dpDate',
    'interest',
    'principal',
  ];

  matchWithPayableDisplayedColumns: any[] = [
    'memoNo',
    'adviceNo',
    'dueDate',
    'principal',
    'interest',
    'amountUnpaid',
    'amountPaid',
    'amountOutstanding',
  ];


  directiveObj = new CommonDirective();
  constructor(private fb: FormBuilder
    , private router: Router
    , private _nssfLoanService: NssfLoanService) { }

  ngOnInit() {
    this.nssfLoanRepaymentForm = this.fb.group({
      fromDate: [''],
      toDate: [''],
    });
    this.getPaybleDetails(null);
    this.getActualDetails(null);
  }

  getPaybleDetails(reqObj) {
    let obj = reqObj ? reqObj : {
      "pageIndex": 0,
      "pageElement": 10,
      "jsonArr": []
    };
    this._nssfLoanService.fetchNssfLoanPaybleDetails(obj).subscribe((res: any) => {
      if (res && res.result && res.status === 200) {
        const data = res && res.result ? res.result : null;
        const {size, totalElement, result, totalPage} = data;
        const element_data: any = [];
        result.forEach(element => {
          element_data.push(getNssfPaybleObject(element))
        });
        this.payableAmountsDataSource = new MatTableDataSource<any>(element_data);
      }
    }, error => {
      // Error
    })
  }

  getActualDetails(reqObj) {
    let obj = reqObj ? reqObj : {
      "pageIndex": 0,
      "pageElement": 10,
      "jsonArr": [{ key: "transactTypeId", value: 16 }]
    };
    this._nssfLoanService.fetchNssfLoanReceivedList(obj).subscribe((res: any) => {
      if (res && res.result && res.status === 200) {
        const data = res && res.result ? res.result : null;
        const {size, totalElement, result, totalPage} = data;
        const element_data: any = [];
        result.forEach(element => {
          element_data.push(getDPListObject(element))
        });
        this.dataSource = new MatTableDataSource<any>(element_data);
      }
    }, error => {
      // Error
    })
  }

  onMatchWithPayable() {
    this.ismatchWithPayable = true;
  }

}
