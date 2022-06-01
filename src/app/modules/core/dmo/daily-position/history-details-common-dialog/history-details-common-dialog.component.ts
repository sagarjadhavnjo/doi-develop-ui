import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

const todayDate = new Date();

const HISTORY_DATA: any[] = [
  {
    userRole: 'Approver', userSortName: 'Shri S M Modi', userCode: 'GAD12345',
    designation: 'Secretary', dateAndTime: '20-Oct-2020 11:23:01', proposedAmt: 100.00, remark: ''
  },

  {
    userRole: 'Verifier', userSortName: 'Shri P J Patel', userCode: 'GAGUJ23231',
    designation: 'Joint Secretary', dateAndTime: '19-Oct-2020 12:24:01', proposedAmt: 200.00, remark: 'We may approve.'
  },

  {
    userRole: 'Verifier', userSortName: 'Shri S M Jani', userCode: 'GAGUJ23343',
    designation: 'Deputy Secretary', dateAndTime: '18-Oct-2020 01:25:21', proposedAmt: 170.00, remark: 'We may approve.'
  },

  {
    userRole: 'Verifier', userSortName: 'Shri R P Joshi', userCode: 'GAGUJ23232',
    designation: 'Under Secretary', dateAndTime: '17-Oct-2020 02:52:51', proposedAmt: 250.00, remark: ''
  },

  {
    userRole: 'Verifier', userSortName: 'Shri P S Patel', userCode: 'GAGUJ23341',
    designation: 'Section Officer', dateAndTime: '10-Oct-2020 05:00:31', proposedAmt: 300.00, remark: 'We may approve.'
  },

  {
    userRole: 'Creator', userSortName: 'Shri M J Soni', userCode: 'GAGUJ34342',
    designation: 'Deputy Section Officer', dateAndTime: '09-Oct-2020 03:34:01', proposedAmt: 300.00, remark: 'Approved.'
  },

];

@Component({
  selector: 'app-history-details-common-dialog',
  templateUrl: './history-details-common-dialog.component.html',
  styleUrls: ['./history-details-common-dialog.component.css']
})
export class HistoryDetailsCommonDialogComponent implements OnInit {

  // showAction: Boolean = true;

  screenName = 'Stamp Processing History Details';
  fileBrowseIndex: number;
  date: any = new Date();
  brwoseData: any[] = [
    {
      name: undefined,
      file: undefined
    }
  ];
  dataSourceBrowse = new MatTableDataSource(this.brwoseData);
  displayedBrowseColumns = [
    'attachmentType',
    'fileName',
    'browse',
    'uploadedFileName',
    'action'
  ];
  headerJso: any[] = [
    { label: 'Financial Year', value: '2020-2021' },
    { label: 'Gross Total of Indent', value: 'Rs. 54000' },
    { label: 'Name of Office', value: 'Superintendent of Stamp Office' },
    { label: 'Duration of Indent', value: '4-May-2020 to 8-Nov-2020' },
    { label: 'Date of Indent', value: '3-Apr-2020' },
    { label: 'Indent Received From', value: 'District Treasury Office, Gandhinagar' },
    { label: 'Type of Indent', value: 'Regular Indent' },
  ];

  displayData = false;

  attachment = [
    // {fileName:'Attachment 1', fileType:'image', filePath:'', imgStatus: false},
    {
      fileName: 'Attachment 1',
      fileType: 'image',
      filePath: '../../../assets/sample-attachments/image-sample.jpg',
      imgStatus: false
    },
    {
      fileName: 'Attachment 2',
      fileType: 'pdf',
      filePath: '../../../assets/sample-attachments/pdf-sample.pdf',
      pdfStatus: false
    }
  ];
  sample = 'src/assets/img/pdf-test.pdf';
  fieldArray = Array.apply(null, { length: 10 }).map(Number.call, Number);
  show = true;
  page = 1;
  totalPages: number;
  isLoaded = false;
  sampleFlag: boolean;



  actionForm: FormGroup;

  errorMessages = {
    FIN_YEAR: 'Please select any Financial Year',
    DEPARTMENT: 'Please select any Department'
  };

  master_checked = false;
  master_indeterminate = false;

  forwardDialog_history_list: any[] = [
    {
      disabled: false,
      checked: false,
      labelPosition: 'after',
      id: 1,
      userName: 'Shri P M Shah',
      designation: 'Deputy Secretary',
      role: 'Approver',
      date: '11/11/2019',
      comment: 'We may approve'
    },
    {
      disabled: false,
      checked: false,
      labelPosition: 'after',
      id: 2,
      userName: 'Shri C Patel',
      designation: 'Section Officer',
      role: 'Verifier',
      date: '10/11/2019',
      comment: 'We may approve'
    },
    {
      disabled: false,
      checked: false,
      labelPosition: 'after',
      id: 3,
      userName: 'Shri S M Modi',
      designation: 'Deputy Section Officer',
      role: 'Creator',
      date: '1/11/2019',
      comment:
        // tslint:disable-next-line: max-line-length
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    }
  ];

  action_list: any[] = [
    { value: '1', viewValue: 'Forward' }
  ];

  user_list: any[] = [
    { value: '1', viewValue: 'Satendra Zala (DDO)' }
  ];

  attachmentType_list: any[] = [{ value: '1', viewValue: 'WorkFlow' }];
  branch_list: any[] = [
    { value: '1', viewValue: 'A Branch' },
    { value: '2', viewValue: 'CH Branch' },
    { value: '3', viewValue: 'CASH Branch' },
    { value: '4', viewValue: 'REGISTRY Branch' }
  ];

  branchPopupCtrl: FormControl = new FormControl();
  branchPopupType: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  actionCtrl: FormControl = new FormControl();
  filteredAction: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  userCodeCtrl: FormControl = new FormControl();
  filteredUserCode: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  attachmentTypeCodeCtrl: FormControl = new FormControl();
  filteredAttachmentTypeCode: ReplaySubject<any[]> = new ReplaySubject<any[]>(
    1
  );

  private _onDestroy = new Subject<void>();

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<HistoryDetailsCommonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private el: ElementRef
  ) { }

  filteredOptions: Observable<string[]>;
  options: any;
  myControl = new FormControl();
  additionalText = new FormControl();

  ngOnInit() {
    this.createForm();

    if (this.action_list) {
      this.filteredAction.next(this.action_list.slice());
    }
    this.actionCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterObjValue(
          this.action_list,
          this.actionCtrl.value,
          this.filteredAction
        );
      });
    if (this.user_list) {
      this.filteredUserCode.next(this.user_list.slice());
    }
    this.branchPopupCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterObjValue(
          this.branch_list,
          this.branchPopupCtrl.value,
          this.branchPopupType
        );
      });

    this.userCodeCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterObjValue(
          this.user_list,
          this.userCodeCtrl.value,
          this.filteredUserCode
        );
      });

    this.filteredAttachmentTypeCode.next(this.attachmentType_list.slice());
    this.attachmentTypeCodeCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterObjValue(
          this.attachmentType_list,
          this.attachmentTypeCodeCtrl.value,
          this.filteredAttachmentTypeCode
        );
      });
    console.log('data', this.data);
    this.options = this.data;
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );

    this.actionForm.patchValue({
      actionCode: '1',
      userCode: '1'
    });

    if (this.data === 'dailyPositionSheetList') {
      this.screenName = 'Daily Position Sheet';
      this.headerJso = [
        { label: 'Financial Year', value: '2020-2021' },
        { label: 'Date of DP Sheet', value: '02-Apr-2021' },
        { label: 'Name of Office', value: 'Finance Department' },
        // { label: 'Name of Office', value: 'District Treasury Office, Gandhinagar' },
        // { label: 'Duration of Indent', value: '4-May-2020 to 8-Nov-2020' },
        // { label: 'Date of Indent', value: '3-Apr-2020' }
      ];
      // } else if (this.data === 'fromIndentConsolidationList') {
      //   this.screenName = 'Stamp Processing History Details';
      //   this.headerJso = [
      //     { label: 'Financial Year', value: '2020-2021' },
      //     { label: 'Date of Indent Consolidation', value: '15-Oct-2018' },
      //     { label: 'Indent Number', value: '51/00057/072019/23' },
      //     { label: 'Indent Duration', value: '01-Jul-2019 to 31-Dec-2019' },
      //     { label: 'Type of Indent', value: 'Regular Indent' },
      //     { label: 'Date of Last Consoldiated Indent', value: '21-Mar-2019' },
      //     { label: 'Gross Total of Indent', value: 'Rs. 54000' },
      //   ];
      // } else if (this.data === 'preparationOfChallanToList') {
      //   this.screenName = 'Preparation of Challan';
      //   this.headerJso = [
      //     { label: 'Financial Year', value: '2020-2021' },
      //     { label: 'Name of Office', value: 'District Treasury Office, Gandhinagar' },
      //     { label: 'Mode of Payment', value: 'Online Payment (Receipt Management Portal)' },
      //     { label: 'Challan Number', value: '51/00057/072019/23' },
      //     { label: 'Net Amount of Challan', value: 'Rs. 12000' },
      //     { label: 'Date of Challan', value: '14-Apr-2020' },
      //     { label: 'Vendor Name and Code', value: 'B S Patel (10005)' }
      //   ];
      // } else if (this.data === 'stampIssue') {
      //   this.screenName = 'Stamp Issue';
      //   this.headerJso = [
      //     { label: 'Financial Year', value: '2020-2021' },
      //     { label: 'Stamp Issue To', value: 'Vendor / Party' },
      //     { label: 'Name of Vendor / Party', value: 'B.S.Patel (000123)' },
      //     { label: 'Challan Number', value: '51/00057/072019/23' },
      //     { label: 'Date of Challan', value: '14-Apr-2020' },
      //   ];
      // } else if (this.data === 'revertStampIssue') {
      //   this.screenName = 'Revert Stamp Issue';
      //   this.headerJso = [
      //     { label: 'Financial Year', value: '2020-2021' },
      //     { label: 'Name of Office', value: 'District Treasury Office, Gandhinagar' },
      //     { label: 'Date of Revert Issued Stamp', value: '14-Apr-2020' },
      //     { label: 'Vendor / Party Name', value: 'B.S.Patel (000123)' },
      //   ];
      // } else if (this.data === 'stampReturnSsoTo') {
      //   this.screenName = 'Stamp Return to Sup. Of Stamp / Return to Treasury from STO';
      //   this.headerJso = [
      //     { label: 'Financial Year', value: '2020-2021' },
      //     { label: 'Return To', value: 'Superintendent of Stamps Office' },
      //     { label: 'Date of Return', value: '14-Apr-2020' },
      //     { label: 'Indent Number', value: '51/00057/072019/23' },
      //   ];
      // } else if (this.data === 'challanCancel') {
      //   this.screenName = 'Challan Cancellation';
      //   this.headerJso = [
      //     { label: 'Financial Year', value: '2020-2021' },
      //     { label: 'Challan Number', value: '51/00057/072019/23' },
      //     { label: 'Date of Challan Cancellation', value: '1-Oct-2020' },
      //     { label: 'Challan Amount:', value: ' 11200' },
      //     { label: 'Name of Vendor and Code', value: 'B S Patel (000123)' },
      //   ];
      // } else if (this.data === 'challanCancelAuth') {
      //   this.screenName = 'Cancel Challan Authorization';
      //   this.headerJso = [
      //     { label: 'Financial Year', value: '2020-2021' },
      //     { label: 'Challan Number', value: '51/00057/072019/23' },
      //     { label: 'Date of Challan Authorization', value: '1-Oct-2020' },
      //     { label: 'Challan Amount:', value: ' 11200' },
      //     { label: 'Name of Vendor and Code', value: 'B S Patel (000123)' },
      //   ];
      // } else if (this.data === 'fromAuthorizationOfChallanTo') {
      //   this.screenName = 'Authorization of Challan';
      //   this.headerJso = [
      //     { label: 'Financial Year', value: '2020-2021' },
      //     { label: 'Challan Number', value: '51/00057/072019/23' },
      //     { label: 'Date of Challan', value: '14-Apr-2020' },
      //     { label: 'Challan Amount', value: 'Rs. 23500/-' },
      //     { label: 'Name of Vendor and Code', value: 'B S Patel (000123)' },
      //     { label: 'Bank Scroll Ref. No', value: 'TO/GNR/2020-21/37' },
      //     { label: 'Bank Scroll Amount', value: 'Rs. 22500/-' }
      //   ];
      // } else {
      //   this.screenName = 'Stamp Processing History Details';
      //   this.headerJso = [
      //     { label: 'Financial Year', value: '2020-2021' },
      //     { label: 'Gross Total of Indent', value: 'Rs. 54000' },
      //     { label: 'Name of Office', value: 'Superintendent of Stamp Office' },
      //     { label: 'Duration of Indent', value: '4-May-2020 to 8-Nov-2020' },
      //     { label: 'Date of Indent', value: '3-Apr-2020' },
      //     { label: 'Indent Received From', value: 'District Treasury Office, Gandhinagar' },
      //     { label: 'Type of Indent', value: 'Regular Indent' },
      //   ];

    }

    // this.checkDisplayFile(this.attachment[0]);
  }

  gotoListing() {
    this.router.navigate(['./budget/standing-charge-list']);
  }

  filterObjValue(arrValue, searchValue, filteredValue) {
    if (!arrValue) {
      return;
    }
    // get the search keyword
    let search = searchValue;
    if (!search) {
      filteredValue.next(arrValue.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the values
    filteredValue.next(
      arrValue.filter(item => item.viewValue.toLowerCase().indexOf(search) > -1)
    );
  }

  createForm() {
    this.actionForm = this.fb.group({
      actionCode: ['', Validators.required],
      userCode: ['', Validators.required],
      branchPopupCode: ['']
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option =>
      option.toLowerCase().includes(filterValue)
    );
  }

  onNoClick(): void {
    this.dialogRef.close('no');
  }

  forwardConsolidate() {
    console.log('forwardConsolidate');
    this.dialogRef.close('yes');
  }

  nextPage() {
    this.page += 1;
    if (this.page > this.totalPages) {
      this.page = this.totalPages;
    }
  }

  previousPage() {
    this.page -= 1;
    if (this.page < 1) {
      this.page = 1;
    }
  }

  afterLoadComplete(pdfData: any) {
    // console.log("pdfData",  pdfData)
    this.totalPages = pdfData.numPages;
    // this.isLoaded = true;
  }

  // initVar(){
  //   this.totalPages = 0;
  //   this.page = 1;
  // }

  checkDisplayFile(data) {
    for (let i = 0; i < this.attachment.length; i++) {
      if (data.fileType === 'image') {
        if (this.attachment[i].fileName === data.fileName) {
          this.attachment[i].imgStatus = !this.attachment[i].imgStatus;
          this.show = this.attachment[i].imgStatus ? true : false;
        } else {
          this.attachment[i].imgStatus = false;
          // this.show = false;
        }
      } else if (data.fileType === 'pdf') {
        if (this.attachment[i].fileName === data.fileName) {
          this.attachment[i].pdfStatus = !this.attachment[i].pdfStatus;
          this.show = this.attachment[i].pdfStatus ? true : false;
        } else {
          this.attachment[i].pdfStatus = false;
        }
      } else {
        // this.attachment[i].imgStatus? false : '';
        // this.attachment[i].pdfStatus? false : '';
      }
      if (this.show === false) {
        if (this.attachment[i].fileType === 'image') {
          this.attachment[i].imgStatus = false;
        } else if (this.attachment[i].fileType === 'pdf') {
          this.attachment[i].pdfStatus = false;
        }
      }
    }
    console.log(data);
  }

  onFileSelection(fileSelected) {
    if (fileSelected.target && fileSelected.target.files) {
      this.dataSourceBrowse.data[this.fileBrowseIndex].file =
        fileSelected.target.files[0];
    }
  }

  openFileSelector(index) {
    this.el.nativeElement.querySelector('#fileBrowse').click();
    this.fileBrowseIndex = index;
  }

  onBrowseSelectChange() { }

  addBrowse() {
    if (this.dataSourceBrowse) {
      const data = this.dataSourceBrowse.data[
        this.dataSourceBrowse.data.length - 1
      ];
      if (data && data.name && data.file) {
        const p_data = this.dataSourceBrowse.data;
        p_data.push({
          name: undefined,
          file: undefined
        });
        this.dataSourceBrowse.data = p_data;
      } else {
        this.toastr.error('Please fill the detail.');
      }
    }
  }

  deleteBrowse(index) {
    this.dataSourceBrowse.data.splice(index, 1);
    this.dataSourceBrowse = new MatTableDataSource(this.dataSourceBrowse.data);
  }

  master_change() {
    for (const value of Object.values(this.forwardDialog_history_list)) {
      value.checked = this.master_checked;
    }
  }

  list_change() {
    let checked_count = 0;
    // Get total checked items
    for (const value of Object.values(this.forwardDialog_history_list)) {
      if (value.checked) {
        checked_count++;
      }
    }

    if (
      checked_count > 0 &&
      checked_count < this.forwardDialog_history_list.length
    ) {
      // If some checkboxes are checked but not all; then set Indeterminate state of the master to true.
      this.master_indeterminate = true;
    } else if (checked_count == this.forwardDialog_history_list.length) {
      // If checked count is equal to total items; then check the master checkbox and also set Indeterminate state to false.
      this.master_indeterminate = false;
      this.master_checked = true;
    } else {
      // If none of the checkboxes in the list is checked then uncheck master also set Indeterminate to false.
      this.master_indeterminate = false;
      this.master_checked = false;
    }
  }

}
