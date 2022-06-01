import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { doiMessage } from 'src/app/common/error-message/common-message.constants';
import { CommonListing, ListValue } from 'src/app/models/common-listing';
import { PremiumRefundEntry } from 'src/app/models/doiModel';

@Component({
  selector: 'app-premium-refund-entry',
  templateUrl: './premium-refund-entry.component.html',
  styleUrls: ['./premium-refund-entry.component.css']
})
export class PremiumRefundEntryComponent implements OnInit {

  todayDate = new Date();
  premiumRefundEntryForm: FormGroup;
  errorMessage = doiMessage;

  nameCtrl: FormControl = new FormControl();
  policyNoCtrl: FormControl = new FormControl();
  majorHeadCtrl: FormControl = new FormControl();
  subMajorHeadCtrl: FormControl = new FormControl();
  minorHeadCtrl: FormControl = new FormControl();

  nameList: ListValue[] = [
    { value: '1', viewValue: 'Bajaj Allianz General Insurance Co. Ltd.' },
    { value: '2', viewValue: 'ABC Pvt. Ltd.' },
  ];

  policyNoList: ListValue[] = [
    { value: '1', viewValue: 'OC-19-2201-4090-00000004' },
    { value: '2', viewValue: 'OC-19-2201-4090-00000078' },
  ];

  subMajorHeadList: CommonListing[] = [
    {
      value: '1',
      viewValue: '00:Secretariat-Economic Services'
    },

    {
      value: '2',
      viewValue: '00:Capital Outlay on other General Economics Services'
    },

    {
      value: '3',
      viewValue: '00:Crop Husbandry'
    },

    {
      value: '4',
      viewValue: '00:Secretariat-Economic Services'
    },

    {
      value: '5',
      viewValue: '00::Capital Outlay on other General Economics Services'
    },

    {
      value: '6',
      viewValue: '01:Civil'
    },

    {
      value: '7',
      viewValue: '00:Stationery and Printing'
    },

    {
      value: '8',
      viewValue: '00::Co-operation'
    },
  ];

  majorHead_list: CommonListing[] = [
    { value: '1', viewValue: '3451:Secretariat-Economic Services' },
    { value: '2', viewValue: '5475:Capital Outlay on other General Economics Services' },
    { value: '3', viewValue: '2401:Crop Husbandry' },
    { value: '4', viewValue: '2071:Pensions and Other Retirement Benefits' },
    { value: '5,', viewValue: '2058:Stationery and Printing' },
    { value: '6', viewValue: '8235:General & Other Reserve Fund' },
  ];

  minorHead_list: CommonListing[] = [
    { value: '1', viewValue: '090:Secretariat' },
    { value: '2', viewValue: '101:Niti Aayog' },
    { value: '3', viewValue: '101:Direction And Administration' },
    { value: '4', viewValue: '102:Food grain Crops' },
    { value: '5', viewValue: '103:Seed' },
    { value: '6', viewValue: '800:Other Expenditure' },
    { value: '7', viewValue: '108:Contribution to Provident Funds' },
    { value: '8', viewValue: '001:Direction and Administration' },
    { value: '9', viewValue: '101:Purchase and Supply of Stationery Stores' },
    { value: '10', viewValue: '103:Government Presses' },
    { value: '11', viewValue: '105:Government Publications' },
    { value: '12', viewValue: '797:Transfer to Reserve fund and Deposite Account' },
    { value: '13', viewValue: '108:Assistance to other co-operatives' },
    { value: '14', viewValue: '800:Other Expenditure' },
  ];

  columns: string[] = [
    'leaderName',
    'policyNo',
    'period',
    'premiumAmount',
    'refundAmount',
    'reason',
    'majorHead',
    'subMajorHead',
    'minorHead',
    'action',
  ];
  elementData: PremiumRefundEntry[] = [
    {
      leaderName: '',
      policyNo: '',
      period: '',
      premiumAmount: '',
      refundAmount: '',
      reason: '',
      majorHead: '',
      subMajorHead: '',
      minorHead: '',
    }
  ];
  dataSource = new MatTableDataSource<PremiumRefundEntry>(this.elementData);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.premiumRefundEntryForm = this.fb.group({
      name: [''],
      policyNo: [''],
      chNo: [{ value: 'ACP/254454', disabled: true }],
      chDate: [{ value: new Date(), disabled: true }],
      policyStartDate: [{ value: '', disabled: true }],
      policyEndDate: [{ value: '', disabled: true }],
      insuredName: [{ value: '', disabled: true }],
      premiumAmount: [{ value: '', disabled: true }],
      refundAmount: [''],
      refundAmountWords: [{ value: '', disabled: true }],
      reason: [''],
      majorHead: ['6'],
      subMajorHead: [''],
      minorHead: [''],
      endorsementNo: [''],
      endorsementDate: [''],
      gIFPremiumRefundNo: ['']
    });
  }

  addRecord() {

  }

  onSubmit() {

  }

  onReset() {
    this.premiumRefundEntryForm.reset();
  }

  goToListing() {
    this.router.navigate(['./doi/premium-refund-listing']);
  }

  onCloseClaimEntry() {

  }

  edit() {

  }

  delete(index) {
    this.dataSource.data.splice(index, 1);
    this.dataSource.data = this.dataSource.data;
  }

  onPolicyNoSelection(event) {
    if (event.value) {
      this.premiumRefundEntryForm.patchValue({
        policyStartDate: new Date('04/01/2018'),
        policyEndDate: new Date('03/31/2019'),
        insuredName: 'Gujarat State Electricity Corporation',
        premiumAmount: '53275454',
      });
    }
  }

}
