import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { CommonDirective } from 'src/app/common/directive/validation.directive';
import { PressCommuniqueForPrinciplePayment } from '../../model/dmo';

@Component({
  selector: 'app-press-communique-for-principle-payment',
  templateUrl: './press-communique-for-principle-payment.component.html',
  styleUrls: ['./press-communique-for-principle-payment.component.css']
})
export class PressCommuniqueForPrinciplePaymentComponent implements OnInit {

  // variable
  isDetails = false;
  private paginator: MatPaginator;
  private sort: MatSort;
  // date
  todayDate = new Date();
  // form group
  pressCommuniquePaymentForm: FormGroup;

  // table data start
  displayedColumns: string[] = [
    'select',
    'position',
    'loanDescription',
    'notificationNo',
    'notificationDate',
    'loanStartDate',
    'loanAmount',
    'maturityDate',
  ];
  tableData: PressCommuniqueForPrinciplePayment[] = [
    {
      loanDescription: '8.37% MKT Loan',
      notificationNo: '1234545',
      notificationDate: '10-Dec-2018',
      loanStartDate: '10-Dec-2018',
      loanAmount: '45,00,00,000.00',
      maturityDate: '09-Dec-2028'
    }, {
      loanDescription: 'Mkt Loan @8.43%',
      notificationNo: '1234546',
      notificationDate: '01-Dec-2018',
      loanStartDate: '01-Jan-2019',
      loanAmount: '55,00,00,000.00',
      maturityDate: '01-Jan-2029'
    }, {
      loanDescription: 'Mkt Loan @8.25%',
      notificationNo: 'Test1234',
      notificationDate: '01-Jan-2019',
      loanStartDate: '01-Jan-2019',
      loanAmount: '69,00,00,000.00',
      maturityDate: '01-Jan-2029'
    }
  ];
  dataSource = new MatTableDataSource<PressCommuniqueForPrinciplePayment>(this.tableData);
  // table data end

  // directive object for checkbox
  directiveObj = new CommonDirective(this.route);


  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }


  // constructor
  constructor(private fb: FormBuilder, private route: Router) { }

  ngOnInit() {
    this.pressCommuniquePaymentForm = this.fb.group({
      fromDate: [''],
      toDate: ['']
    });
  }

  // on click on get details button
  getDetails() {

    if (this.pressCommuniquePaymentForm.controls['fromDate'].value !== '' &&
      this.pressCommuniquePaymentForm.controls['toDate'].value !== '') {
      this.isDetails = true;
    }

  }

  // on click on cancel buttton
  onCancelClick() {
    this.pressCommuniquePaymentForm.reset();
  }

  // Method to for setting data source attributes
  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


}
