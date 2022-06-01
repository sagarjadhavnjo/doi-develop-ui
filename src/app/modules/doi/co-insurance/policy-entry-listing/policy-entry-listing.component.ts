import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ListValue } from 'src/app/models/common-listing';

@Component({
  selector: 'app-policy-entry-listing',
  templateUrl: './policy-entry-listing.component.html',
  styleUrls: ['./policy-entry-listing.component.css']
})
export class PolicyEntryListingComponent implements OnInit {

  policyEntryListingForm: FormGroup;
  todayDate = new Date();

  nameCtrl: FormControl = new FormControl();
  policyNoCtrl: FormControl = new FormControl();
  insuredNameCtrl: FormControl = new FormControl();
  typeMonthCtrl: FormControl = new FormControl();
  typeOfYearCtrl: FormControl = new FormControl();
  policyTypeCtrl: FormControl = new FormControl();
  riskTypeCtrl: FormControl = new FormControl();

  nameList: ListValue[] = [
    { value: '1', viewValue: 'Bajaj Allianz General Insurance Co. Ltd.' },
    { value: '2', viewValue: 'ABC Pvt. Ltd.' },
  ];

  policyTypeList: ListValue[] = [
    { value: '1', viewValue: 'Fire' },
    { value: '2', viewValue: 'Marine' },
    { value: '3', viewValue: 'Miscellanous' },
    { value: '4', viewValue: 'IAR(Industrial All Risk Policy)' },
    { value: '5', viewValue: 'Renewal Notice' },
    { value: '6', viewValue: 'Renew option' },
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

  riskType_list: ListValue[] = [
    {
      value: '1',
      viewValue: 'Fire'
    }
  ];

  displayedColumns: string[] = [
    'srNo',
    'policyType',
    'policyNo',
    'leaderName',
    'insuredName',
    'riskType',
    'riskDetails',
    'policyStartDate',
    'policyEndDate',
    'policyStatus',
    'sumInsured',
    'createModeON',
    'modifyModeON',
    'action',
  ];
  elementData: any[] = [
    {
      policyType: 'Fire',
      policyNo: 'OC-19-2201-4090-00000004',
      leaderName: 'Bajaj Allianz General Insurance Co. Ltd.',
      insuredName: 'Gujarat State Electricity Corporation',
      riskType: 'Fire',
      riskDetails: 'Fire in underground cable trench',
      policyStartDate: new Date('04/01/2018'),
      policyEndDate: new Date('03/30/2019'),
      policyStatus: 'Pending',
      sumInsured: '35465710000',

      createModeON: '22-Apr-2018 12:22PM',
      modifyModeON: '22-Jun-2018 01:22PM',
    }
  ];
  dataSource = new MatTableDataSource<any>(this.elementData);
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.policyEntryListingForm = this.fb.group({
      policyType: [''],
      name: [''],
      insuredName: [''],
      policyNo: [''],
      riskType: [''],
      month: [''],
      year: [''],
    });
  }



}
