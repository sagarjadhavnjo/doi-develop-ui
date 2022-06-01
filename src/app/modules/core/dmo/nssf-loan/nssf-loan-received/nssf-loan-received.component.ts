import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { CommonListing } from '../../../common/model/common-listing';
import { dmoMessage } from 'src/app/common/error-message/common-message.constants';
import { NssfLoanService } from '../../services/nssf-loan.service';
import { getDPListObject } from '../../model/nssf-loan.data-model'

import * as moment from 'moment';

@Component({
  selector: 'app-nssf-loan-received',
  templateUrl: './nssf-loan-received.component.html',
  styleUrls: ['./nssf-loan-received.component.css']
})
export class NssfLoanReceivedComponent implements OnInit {


  selectedIndex: number;
  tabDisable: Boolean = true;
  nssfLoanReceivedForm: FormGroup;
  addDetailsForm: FormGroup;
  isDetails = false;
  maxDate = new Date();
  todayDate = Date.now();
  errorMessages = dmoMessage;

  typeOfTransactionsCtrl: FormControl = new FormControl();
  typeOfTransactionsList: CommonListing[] = [
    { value: '1', viewValue: 'NSSF Loan Received' },
    { value: '2', viewValue: 'Market Loan Received' },
    { value: '3', viewValue: 'GOI Loan Received' },
  ];

  dataSource: any;
  displayedColumns: any[] = [
    'position',
    'memoNo',
    'adviceNo',
    'dpDate',
    'adviceDate',
    'adviceBy',
    'transactionDescription',
    'creditAmount',
    'addDetails',
  ];

  totalRecords: number = 0;
  pageSize:number = 10;
  pageIndex: number = 0;

  constructor(private fb: FormBuilder
    , private router: Router
    , private _nssfLoanService: NssfLoanService) { }

  ngOnInit() {
    this.nssfLoanReceivedForm = this.fb.group({
      typeOfTransactions: [''],
      fromDate: [''],
      toDate: [''],
    });
    this.addDetailsForm = this.fb.group({
      sanctionNo: [''],
      sanctionDate: [''],
      loanReceiptDate: [''],
      loanAmount: [''],
      loanTenure: [''],
      moratoriumPeriod: [''],
      rateOfInterest: [''],
      principalInstalmentsInYear: [''],
      principalTotalNoOfInstalments: [''],
      interestInstalmentsInYear: [''],
      interestTotalNoOfInstalments: [''],
    });
  }


  getDetails(reqObj) {
    let obj = reqObj ? reqObj : {
      "pageIndex": 0,
      "pageElement": 10,
      "jsonArr": [{ key: "transactTypeId", value: 16 }]
    };
    this._nssfLoanService.fetchNssfLoanReceivedList(obj).subscribe((res: any) => {
      if (res && res.result && res.status === 200) {
        const data = res && res.result ? res.result : null;
        const {size, totalElement, result, totalPage} = data;
        this.totalRecords = totalElement;
        this.pageSize = size;
        const element_data: any = [];
        result.forEach(element => {
          element_data.push(getDPListObject(element))
        });
        this.dataSource = new MatTableDataSource<any>(element_data);
        this.isDetails = true;
      }
    }, error => {
      // Error
    })
  }

  onPaginateChange(event) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    const dpObj = {
      "pageIndex": event.pageIndex,
      "pageElement": event.pageSize,
      "jsonArr": [
        { key: "transactTypeId", value: 16 }
      ]
    };
    this.getDetails(dpObj);
  }

  onAddDetails(obj) {
    this._nssfLoanService.setDPData(obj);
    this.router.navigate([`/dashboard/dmo/nssf-loan-received/add-details`]);
  }
  getTabIndex(tabIndex) {
    this.selectedIndex = tabIndex;
    const temp = this.selectedIndex;
  }
  goToNext() {
    this.tabDisable = false;
    this.selectedIndex = 1;
  }
  onSave() {
    this.router.navigate(['/dashboard/dmo/nssf-loan-approved']);
  }
}
