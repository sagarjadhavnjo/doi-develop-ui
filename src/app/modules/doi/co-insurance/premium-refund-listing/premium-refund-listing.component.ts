import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ListValue } from 'src/app/models/common-listing';
import { PremiumRefundListing } from 'src/app/models/doiModel';

@Component({
  selector: 'app-premium-refund-listing',
  templateUrl: './premium-refund-listing.component.html',
  styleUrls: ['./premium-refund-listing.component.css']
})
export class PremiumRefundListingComponent implements OnInit {

  todayDate = new Date();
  premiumRefundListingForm: FormGroup;

  nameCtrl: FormControl = new FormControl();
  policyNoCtrl: FormControl = new FormControl();
  claimIdCtrl: FormControl = new FormControl();
  insuredNameCtrl: FormControl = new FormControl();
  typeMonthCtrl: FormControl = new FormControl();
  typeOfYearCtrl: FormControl = new FormControl();

  nameList: ListValue[] = [
    { value: '1', viewValue: 'Bajaj Allianz General Insurance Co. Ltd.' },
    { value: '2', viewValue: 'ABC Pvt. Ltd.' },
  ];

  policyTypeList: ListValue[] = [
    { value: '1', viewValue: 'Fire' },
    { value: '2', viewValue: 'Marine' },
    { value: '3', viewValue: 'Miscellanous' },
    { value: '4', viewValue: 'IAR(Industrial All Risk Policy)' }
  ];

  claimIdList: ListValue[] = [
    { value: '1', viewValue: '4567' },
    { value: '2', viewValue: '6756' },
  ];

  insuredNameList: ListValue[] = [
    { value: '1', viewValue: 'Gujarat State Electricity Corporation' },
  ];

  year_list: ListValue[] = [
    { value: '1', viewValue: '2009' },
    { value: '2', viewValue: '2010' },
    { value: '3', viewValue: '2011' },
    { value: '4', viewValue: '2012' },
    { value: '5', viewValue: '2013' },
    { value: '6', viewValue: '2014' },
    { value: '7', viewValue: '2015' },
    { value: '8', viewValue: '2016' },
    { value: '9', viewValue: '2017' },
    { value: '10', viewValue: '2018' },
    { value: '11', viewValue: '2019' },
    { value: '12', viewValue: '2020' },
  ];
  month_list: ListValue[] = [
    { value: '1', viewValue: 'Jan' },
    { value: '2', viewValue: 'Feb' },
    { value: '3', viewValue: 'Mar' },
    { value: '4', viewValue: 'Apr' },
    { value: '5', viewValue: 'May' },
    { value: '6', viewValue: 'Jun' },
    { value: '7', viewValue: 'Jul' },
    { value: '8', viewValue: 'Aug' },
    { value: '9', viewValue: 'Sep' },
    { value: '10', viewValue: 'Oct' },
    { value: '11', viewValue: 'Nov' },
    { value: '12', viewValue: 'Dec' },

  ];

  policyNoList: ListValue[] = [
    { value: '1', viewValue: 'OC-19-2201-4090-00000004' },
    { value: '2', viewValue: 'OC-19-2201-4090-00000078' },
  ];

  displayedColumns: string[] = [
    'srNo',
    'claimId',
    'policyNo',
    'leaderName',
    'insuredName',
    'premiumAmount',
    'refundAmount',
    'reason',
    'majorHead',
    'subMajorHead',
    'minorHead',
    'createModeON',
    'modifyModeON',
    'status',
    'action',
  ];

  ELEMENT_DATA: any[] = [
    {
      claimId: '271',
      policyNo: 'DOI/48/P/2019-20/000001',
      leaderName: 'Bajaj Allianz General Insurance Co. Ltd.',
      insuredName: 'Gujarat State Electricity Corporation',
      premiumAmount: '53275454',
      refundAmount: '237884.6',
      reason: 'Fire due to heavy flash over in joining kit of R-Phase of 400 KV 1200 sq. mm EHV XLPE cable',
      majorHead: '5475:Capital Outlay on other Economic Services',
      subMajorHead: '00: Co-operation',
      minorHead: '101:Direction and Adminstration',
      createModeON: '22-Apr-2018 12:22PM',
      modifyModeON: '22-Jun-2018 01:22PM',
      status: 'Approve'
    }

  ];

  dataSource = new MatTableDataSource<PremiumRefundListing>(this.ELEMENT_DATA);

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.premiumRefundListingForm = this.fb.group({
      name: [''],
      policyNo: [''],
      claimId: [''],
      insuredName: [''],
      month: [''],
      year: [''],
    });
  }

  navigate() {

  }

}
