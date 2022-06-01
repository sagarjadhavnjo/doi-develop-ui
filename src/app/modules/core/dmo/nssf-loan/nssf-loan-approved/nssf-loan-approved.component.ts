import { CommonDirective } from 'src/app/common/directive/validation.directive';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { NssfLoanApproved } from '../../model/dmo';
import { DataService } from 'src/app/common/data.service';
import { NssfLoanService } from '../../services/nssf-loan.service';
import * as moment from 'moment';

@Component({
  selector: 'app-nssf-loan-approved',
  templateUrl: './nssf-loan-approved.component.html',
  styleUrls: ['./nssf-loan-approved.component.css']
})
export class NssfLoanApprovedComponent implements OnInit {

  nssfLoanApprovedForm: FormGroup;
  maxDate = new Date();
  todayDate = Date.now();

  directiveObj = new CommonDirective();
  dataSource: any;

  displayedColumns: any[] = [
    'select',
    'position',
    'sanctionNo',
    'loanSanctionDate',
    'loanReceiptDate',
    'loanAmount',
    'loanTenureYears',
    'moratoriumPeriodYears',
    'interestRate',
    'status',
    'action',
  ];

  totalRecords: number = 0;
  pageSize:number = 10;
  pageIndex: number = 0;

  constructor(private fb: FormBuilder
    , private router: Router
    , private dataService: DataService
    , private _nssfLoanService: NssfLoanService) { }

  ngOnInit() {
    this.nssfLoanApprovedForm = this.fb.group({
      loanNo: [''],
      fromDate: [''],
      toDate: [''],
    });
    let reqObj = {
      "pageIndex": 0,
      "pageElement": 10,
      "jsonArr": []
    };
    this.fetchReceivedLoanList(reqObj);
  }

  fetchReceivedLoanList(reqObj) {
    this._nssfLoanService.fetchNssfLoanReceived(reqObj).subscribe((res: any) => {
      if (res && res.result && res.status === 200) {
        const data = res && res.result ? res.result : null;
        const {size, totalElement, result, totalPage} = data;
        this.totalRecords = totalElement;
        this.pageSize = size;
        const element_data: any = [];
        result.forEach(element => {
          element_data.push({
            id: element.id ? element.id: '',
            sanctionNo: element.sanctionOrderNo ? element.sanctionOrderNo: '',
            loanSanctionDate: element.sanctionOrderDate ? element.sanctionOrderDate : '',
            loanReceiptDate: element.loanReceiptDate ? element.loanReceiptDate: '',
            loanAmount: element.loanAmount ? element.loanAmount: '',
            loanTenureYears: element.loanTenure ? element.loanTenure: '',
            moratoriumPeriodYears: element.moratariumPeriod ? element.moratariumPeriod: '',
            interestRate: element.loanROI ? element.loanROI: '',
            status: element.activeStatus ? 'isApproved' : 'notApproved'
          })
        });
        console.log('element_data =>',element_data)
        this.dataSource = new MatTableDataSource<NssfLoanApproved>(element_data);
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
      "jsonArr": []
    };
    this.fetchReceivedLoanList(dpObj);
  }

  onSubmit() { }

  onApprove(obj) {
    this._nssfLoanService.setLoanId(obj.id);
    this.router.navigate(['/dashboard/dmo/nssf-loan-approved/approve']);
  }

  onEdit(id) {
    this.dataService.setOption('fromApproved', 'editMode');
    this.router.navigate([`/dashboard/dmo/nssf-loan-received/add-details/${id}`]);
  }

  onView(id) {
    this.dataService.setOption('fromApproved', 'viewMode');
    this.router.navigate([`/dashboard/dmo/nssf-loan-received/add-details/${id}`]);

  }
}
