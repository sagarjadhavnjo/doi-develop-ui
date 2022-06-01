import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MarketLoanReceived } from '../../model/dmo';
import { MarketLoanService } from '../../services/market-loan.service';
import { getMarketListObject } from '../../model/market-loan.data-model';

@Component({
  selector: 'app-market-loan-received',
  templateUrl: './market-loan-received.component.html',
  styleUrls: ['./market-loan-received.component.css']
})
export class MarketLoanReceivedComponent implements OnInit {

  // Table data for Market Loan Received Table
  public element_data: MarketLoanReceived[] = [];

  // Table Columns for Market Loan Received Table
  displayedColumns: any[] = [
    'position',
    'memoNo',
    'adviceNo',
    'dpDate',
    'adviceDate',
    'adviceBy',
    'transactionDescription',
    'creditAmount',
    'action'
  ];

  showTable = false;
  marketLoanReceivedForm: FormGroup;
  todayDate = Date.now();
  dataSource;

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

  totalRecords: number = 0;
  pageSize:number = 10;
  pageIndex: number = 0;

  constructor(private fb: FormBuilder
    , private router: Router
    , private _marketLoanService: MarketLoanService) { }

  ngOnInit() {
    this.marketLoanReceivedForm = this.fb.group({
      fromDate: [''],
      toDate: ['']
    });
    this.getDetails(null);
  }

  getDetails(reqObj) {
    let obj = reqObj ? reqObj : {
      "pageIndex": 0,
      "pageElement": 10,
      "jsonArr": [{ key: "transactTypeId", value: 19 }]
    };
    this._marketLoanService.fetchMarketLoanReceivedList(obj).subscribe((res: any) => {
      if (res && res.result && res.status === 200) {
        this.element_data = [];
        const data = res && res.result ? res.result : null;
        const {size, totalElement, result, totalPage} = data;
        this.totalRecords = totalElement;
        this.pageSize = size;
        result.forEach(element => {
          this.element_data.push(getMarketListObject(element))
        });
        this.dataSource = new MatTableDataSource<any>(this.element_data);
        this.showTable = true;
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

  // Method to for setting data source attributes
  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  addDetails(dpObj) {
    this._marketLoanService.setDPData(dpObj);
    this.router.navigate(['dashboard/dmo/market-loan-received/add-details']);
  }

}
