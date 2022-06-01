import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { dmoMessage } from 'src/app/common/error-message/common-message.constants';
import { CommonListing } from '../../../common/model/common-listing';
import { HistoryDetailsCommonDialogComponent } from '../history-details-common-dialog/history-details-common-dialog.component';

@Component({
  selector: 'app-daily-position-sheet-listing',
  templateUrl: './daily-position-sheet-listing.component.html',
  styleUrls: ['./daily-position-sheet-listing.component.css']
})
export class DailyPositionSheetListingComponent implements OnInit {

  private paginator: MatPaginator;
  private sort: MatSort;

  // Search Field Details
  finYear_list: CommonListing[] = [
    { value: '1', viewValue: '2011-2012' },
    { value: '2', viewValue: '2012-2013' },
    { value: '3', viewValue: '2013-2014' },
    { value: '4', viewValue: '2014-2015' },
    { value: '5', viewValue: '2015-2016' },
    { value: '6', viewValue: '2016-2017' },
    { value: '7', viewValue: '2017-2018' },
    { value: '8', viewValue: '2018-2019' },
    { value: '9', viewValue: '2019-2020' },
    { value: '10', viewValue: '2020-2021' },
  ];
  status_List: CommonListing[] = [
    { value: '1', viewValue: 'Draft' },
    { value: '2', viewValue: 'Pending' },
    { value: '3', viewValue: 'Approved' },
    { value: '4', viewValue: 'Returned' },
    { value: '5', viewValue: 'Cancelled' },
  ];

  receive_List: CommonListing[] = [
    { value: '1', viewValue: 'Received From' },
    { value: '2', viewValue: 'Sent To' },
  ];

  wStatus_List: CommonListing[] = [
    { value: '1', viewValue: 'Cancelled' },
    { value: '2', viewValue: 'Forwarded to Verifier' },
    { value: '3', viewValue: 'Returned to Creator' },
    { value: '4', viewValue: 'Forwarded to Approver' },
    { value: '5', viewValue: 'Returned to Verifier' },
    { value: '6', viewValue: 'Approved by Approver' },
    { value: '7', viewValue: 'Returned to Creator' },
    { value: '8', viewValue: 'Rejected by Approver' },
  ];



  // Listing table data
  DailyPositionSheetData: any[] = [
    {
      financialYear: '2020-2021',
      refNum: '19-20/DMO/DPS/001',
      refDate: '14-Apr-2020',
      dateOfDPSheet: '14-Apr-2020 ',
      recFromOn: 'Rajesh 10-Feb-2020 10:30',
      sentToON: 'Rajesh 10-Feb-2020 10:30',
      lyingWith: 'Mr. S G Yadav',
      wStatus: 'Forwarded to Verifier',
      status: 'Approved',
    }
  ];

  DailyPositionSheetDataColumn: string[] = [
    'srno', 'financialYear', 'refNum', 'refDate', 'dateOfDPSheet',
    'recFromOn', 'sentToON', 'lyingWith', 'wStatus', 'status', 'action'
  ];

  DailyPositionSheetDataSource = new MatTableDataSource(this.DailyPositionSheetData);

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  dailyPositionSheetForm: FormGroup;
  finYearCtrl: FormControl = new FormControl();
  statusCtrl: FormControl = new FormControl();
  vendorNameCtrl: FormControl = new FormControl();
  receiveCtrl: FormControl = new FormControl();
  wStatusCtrl: FormControl = new FormControl();
  challanModeCtrl: FormControl = new FormControl();
  errorMessages = dmoMessage;


  constructor(private fb: FormBuilder, private router: Router, public dialog: MatDialog,) { }

  ngOnInit() {
    this.dailyPositionSheetFormData();
  }

  dailyPositionSheetFormData() {
    this.dailyPositionSheetForm = this.fb.group({
      finYear: ['10'],
      dpFromDate: [''],
      dpToDate: [''],
      refNo: [''],
      fromDate: [''],
      toDate: [''],
      receive: [''],
      wStatus: [''],
      status: [''],
      recFrom: [''],
      sentTo: [''],
    });
  }

  goToScreen() {
    this.router.navigate(['dashboard/dmo/daily-position-sheet']);
  }

  showHistoryDialog() {
    const dialogRef = this.dialog.open(HistoryDetailsCommonDialogComponent, {
      width: '2700px',
      height: '600px',
      data: 'dailyPositionSheetList'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'no') {
        console.log('The dialog was closed', result);
      } else if (result === 'yes') {
        console.log('The dialog was closed', result);
      }
    });
  }


  setDataSourceAttributes() {
    this.DailyPositionSheetDataSource.paginator = this.paginator;
    this.DailyPositionSheetDataSource.sort = this.sort;
  }

}
