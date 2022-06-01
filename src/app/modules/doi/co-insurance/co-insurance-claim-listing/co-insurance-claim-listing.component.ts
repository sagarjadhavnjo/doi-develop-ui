import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DoiDirectives } from 'src/app/common/directive/doi';
import { ListValue } from 'src/app/models/common-listing';
import { CoInsuranceClaimEntryListing } from 'src/app/models/doiModel';

@Component({
  selector: 'app-co-insurance-claim-listing',
  templateUrl: './co-insurance-claim-listing.component.html',
  styleUrls: ['./co-insurance-claim-listing.component.css']
})
export class CoInsuranceClaimListingComponent implements OnInit {

  todayDate = new Date();
  // Form Group
  coInsuranceClaimForm: FormGroup;
  // Control
  districtCtrl: FormControl = new FormControl();
  schemeTypeCtrl: FormControl = new FormControl();
  typeOfYearCtrl: FormControl = new FormControl();
  typeMonthCtrl: FormControl = new FormControl();
  // List
  schemeType_list: ListValue[] = [
    {
      value: '1', viewValue: 'Registered Farmer'
    },
    { value: '2', viewValue: 'ITI Students ' },
    { value: '3', viewValue: 'Unorganised Landless Labours    ' },
    { value: '4', viewValue: ' Secondary and Higher Secondary Student ' },
    { value: '5', viewValue: ' Nominee of Registered Farmer  ' },
    { value: '6', viewValue: '  Primary School Student ' },
    { value: '7', viewValue: 'Safai Kamdar' },
    { value: '8', viewValue: 'Orphan Widows  ' },
    { value: '9', viewValue: 'Sports Hostel Trainees  ' },
    { value: '10', viewValue: ' Hira Udhyog Workers' },
    { value: '11', viewValue: ' Handicapped Person ' },
    { value: '12', viewValue: 'Police Personnel DYSP and above ' },
    { value: '13', viewValue: 'Police Personnel PI and PSI and PSO ' },
    { value: '14', viewValue: 'Police Personnel Head Constable and Constable    ' },
    { value: '16', viewValue: 'Police Personnel ATS and Bomb Squad  ' },
    { value: '17', viewValue: 'Police Personnel CM Security and Chetak Commando' },
    { value: '18', viewValue: 'All Jail Guards ' },
    { value: '19', viewValue: 'All uniformed employee of Jail Dept Other than Jail Guards' },
    { value: '20', viewValue: 'Pilgrim of Kailash Mansarovar' },
    { value: '21', viewValue: 'Pilgrim of Amarnath' },
    { value: '22', viewValue: 'Participants of Adventurous Activities' },
    { value: '23', viewValue: 'Shahid Veer Kinarivbrala College Student' },
  ];
  districtList: ListValue[] = [
    { value: '00', viewValue: 'Ahmedabad' },
    { value: '01', viewValue: 'Amreli' },
    { value: '02', viewValue: 'Anand' },
    { value: '03', viewValue: 'Aravalli' },
    { value: '04', viewValue: 'Banaskantha' },
    { value: '05', viewValue: 'Bharuch' },
    { value: '06', viewValue: 'Bhavnagar' },
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
  // Table Source

  ELEMENT_DATA: any[] = [
    {
      claimId: '271',
      policyNo: 'DOI/48/P/2019-20/000001',
      leaderName: 'Bajaj Allianz General Insurance Co. Ltd.',
      insuredName: 'Gujarat State Electricity Corporation',
      claimAmountLeader: '95,153,840',
      claimAmountGif: '23,788,460	',
      createModeON: '2-Apr-2018 12:22PM',
      modifyModeON: '12-Jun-2018 01:22PM',
      status: 'Approve'
    },
    {
      claimId: '141',
      policyNo: 'DOI/48/P/2019-20/000001',
      leaderName: 'XYZ Allianz General Insurance Co. Ltd.',
      insuredName: 'Gujarat State Electricity Corporation',
      claimAmountLeader: '96,153,540',
      claimAmountGif: '24,785,460',
      createModeON: '22-Apr-2018 12:22PM',
      modifyModeON: '22-Jun-2018 01:22PM',
      status: 'Approve'
    },

  ];

  header1: string[] = [
    'selectHeader',
    'srnoHeader',
    'claimIdHeader',
    'policyNoHeader',
    'leaderNameHeader',
    'insuredNameHeader',
    'claimAmount',
    'createModeONHeader',
    'modifyModeONHeader',
    'statusHeader',
    'actionHeader',
  ];

  header2: string[] = [
    'claimAmountLeaderHeader',
    'claimAmountGifHeader',
  ];

  displayedColumns: string[] = [
    'select',
    'srno',
    'claimId',
    'policyNo',
    'leaderName',
    'insuredName',
    'claimAmountLeader',
    'claimAmountGif',
    'createModeON',
    'modifyModeON',
    'status',
    'action'

  ];

  dataSource = new MatTableDataSource<CoInsuranceClaimEntryListing>(this.ELEMENT_DATA);
  selection = new SelectionModel<CoInsuranceClaimEntryListing>(true, []);
  constructor(private router: Router, public dialog: MatDialog, private fb: FormBuilder,) { }
  directiveObject = new DoiDirectives(this.router, this.dialog);

  ngOnInit() {
    this.coInsuranceClaimForm = this.fb.group({
      district: [''],
      month: [''],
      year: [''],
      fromDate: [''],
      endDate: [''],
      schemeType: ['']
    });
  }

  // Navigation Route
  navigate() {
    this.router.navigate(['./doi/co-insurance-claim-view']);
  }


}
