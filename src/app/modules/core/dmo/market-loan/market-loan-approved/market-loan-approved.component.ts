import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MarketLoanApproved } from '../../model/dmo';
import { MarketLoanService } from '../../services/market-loan.service';
import { getMarketLoanObject } from '../../model/market-loan.data-model';

@Component({
  selector: 'app-market-loan-approved',
  templateUrl: './market-loan-approved.component.html',
  styleUrls: ['./market-loan-approved.component.css']
})
export class MarketLoanApprovedComponent implements OnInit {

  marketLoanApprovedForm: FormGroup;
  maxDate = new Date();
  todayDate = Date.now();

  // table data
  element_data: MarketLoanApproved[] = [];

  dataSource;

  displayedColumns: any[] = [
    'position',
    'sanctionNo',
    'loanSanctionDate',
    'loanReceiptDate',
    'loanAmount',
    'loanTenureYears',
    'moratoriumPeriodYears',
    'interestRate',
    'select',
  ];

  totalRecords: number = 0;
  pageSize:number = 10;
  pageIndex: number = 0;

  constructor(private fb: FormBuilder
    , private router: Router
    , private _marketLoanService: MarketLoanService) { }

  ngOnInit() {
    this.marketLoanApprovedForm = this.fb.group({
      loanNo: [''],
      fromDate: [''],
      toDate: [''],
    });
    let reqObj: any = {
      "pageIndex": 0,
      "pageElement": 10,
      "jsonArr":[]
    }
    this.fetchApprovedList(reqObj);
  }

  fetchApprovedList(reqObj) {
    this._marketLoanService.fetchMarketLoanApprovedList(reqObj).subscribe((res: any) => {
      if (res &&  res['status'] === 200) {
        this.element_data = [];
        const data = res && res.result ? res.result : null;
        const {size, totalElement, result, totalPage} = data;
        this.totalRecords = totalElement;
        this.pageSize = size;
        result.forEach(element => {
          this.element_data.push(getMarketLoanObject(element))
        });
        this.dataSource = new MatTableDataSource<any>(this.element_data);
      }
    })
  }

  getDetails() {
    let reqObj: any = {
      "pageIndex": 0,
      "pageElement": 10,
      "jsonArr":[{key: 'loanNo', value: this.marketLoanApprovedForm.value.loanNo}]
    }
    this.fetchApprovedList(reqObj);
  }

  onPaginateChange(event) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    const dpObj = {
      "pageIndex": event.pageIndex,
      "pageElement": event.pageSize,
      "jsonArr": []
    };
    this.fetchApprovedList(dpObj);
  }

  cancel() {
    this.router.navigate(['dashboard/dmo/market-loan-received']);
  }

  onApprove() {
    this.router.navigate(['dashboard/dmo/market-loan-approved/approve']);
  }
}
