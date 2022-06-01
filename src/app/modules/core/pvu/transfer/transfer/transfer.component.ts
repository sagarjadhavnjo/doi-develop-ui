import { StorageService } from './../../../../../shared/services/storage.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { pvuMessage, MessageConst } from 'src/app/shared/constants/pvu/pvu-message.constants';
import { TransferService } from '../services/transfer.service';
import { SearchEmployeeComponent } from '../../pvu-common/search-employee/search-employee.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { RouteService } from 'src/app/shared/services/route.service';
import { ForwardDialogComponent } from '../../pvu-common/forward-dialog/forward-dialog.component';
import { ViewCommentsComponent } from '../../pvu-common/view-comments/view-comments.component';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent implements OnInit {
  trnNo;
  initiationDate;
  date = new Date();
  doj;
  dor;
  transferForm: FormGroup;
  currentPost;
  loginOffName;
  transferOffId;
  subscribeParams: Subscription;
  action;
  isView = false;
  id: number;
  employeeId: number;
  districtList = [];
  officeDetails = [];
  officeDetailCardex = [];
  officeDetailDDO = [];
  subOfficeList = [];
  reasonList = [];
  noonTypeList = [];
  transferDetails;
  statusId = 0;

  districtCtrl: FormControl = new FormControl();
  cardexCtrl: FormControl = new FormControl();
  ddoCtrl: FormControl = new FormControl();
  officeNameCtrl: FormControl = new FormControl();
  subOfficeNameCtrl: FormControl = new FormControl();
  reasonForTransferCtrl: FormControl = new FormControl();
  forenoonAfternoonCtrl: FormControl = new FormControl();

  empName;
  empDesignation;
  curDistrictName;
  curOffName;
  curSubOfficeName;

  errorMessages;

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private transferService: TransferService,
    private storageService: StorageService,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private routeService: RouteService
  ) { }


  ngOnInit() {

    this.getLookupInfo();
    this.errorMessages = pvuMessage;
    const userOffice = this.storageService.get('currentUser');
    if (userOffice && userOffice['post'][0]['loginPost'] !== undefined) {
      this.currentPost = userOffice['post'].filter((item) => item['loginPost'] === true);
      this.loginOffName = this.currentPost[0]['oauthTokenPostDTO']['edpMsOfficeDto']['officeName'];
    }
    this.createForm();
    this.subscribeParams = this.activatedRoute.params.subscribe(resRoute => {
      this.action = resRoute.action;
      this.id = resRoute.id;
      if (this.action === 'edit' || this.action === 'view') {
        if (this.id) {
          const params = { 'id': this.id };
          this.getTransferDetail(params);
          if (this.action === 'view') {
            this.transferForm.disable();
            this.isView = true;
          }
        } else {
          this.router.navigate(['../new'], { relativeTo: this.activatedRoute });
        }
      }
    });
  }

  /**
   * @description Method to get lookup data
   */
  getLookupInfo() {
    this.transferService.getLookupData().subscribe(data => {
      if (data && data != null) {
        this.districtList = data['result']['district'];
        this.noonTypeList = data['result']['Noon_Type'];
        this.reasonList = data['result']['ReasonForTransfer'];
      }
    });

    this.transferService.getDistrictDesg().subscribe(data => {
      if (data && data != null) {
        this.districtList = data['result']['district'];
      }
    });
  }

  /**
   * @description Create Transfer From
   */
  createForm() {
    this.transferForm = this.fb.group({
      curOfficeId: this.currentPost[0]['oauthTokenPostDTO']['edpMsOfficeDto']['officeId'],
      transferOrderNo: ['', [Validators.required, Validators.maxLength(100)]],
      transferOrderDate: ['', Validators.required],
      employeeNo: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
      curDistrict: [''],
      curCardexNo: [''],
      curDDONo: [''],
      districtId: ['', Validators.required],
      cardexNo: ['', Validators.required],
      ddoCode: ['', Validators.required],
      officeName: [''],
      subOfficeId: [0],
      relievingDate: ['', Validators.required],
      transferNoonType: [''],
      reasonForTransfer: ['', Validators.required],
      //  transferRemarks: ['']
    });
  }

  /**
   * @description Get Transfer detail by id
   * @param param id of the Transfer event
   */
  getTransferDetail(param) {
    const self = this;
    let data;
    self.transferService.getTransfer(param).subscribe((res) => {
      if (res && res['result'] && res['status'] === 200) {
        data = res['result'];
        if (data !== null) {
          self.transferDetails = res['result'];
          self.setTransferDetail(data);
        }
      } else {
        self.toastr.error(res['message']);
      }
    }, (err) => {
      self.toastr.error(err);
    });
  }

  /**
   * Set Transfer details for edit/view
   * @param data transfer details
   */
  /**async,await and other sequence in code is necessary to load all data properly */
  async setTransferDetail(data) {
    this.id = data.id;
    this.trnNo = data.trnNo;
    this.initiationDate = data.refDate ? data.refDate : null;
    this.employeeId = data.employeeId;
    this.transferOffId = data.officeId;
    this.statusId = data.statusId;

    if (data.statusId === 484) {
      this.transferForm.disable();
    }

    this.transferForm.patchValue({
      'transferOrderNo': data.transferOrderNo,
      'transferOrderDate': this.convertDateFormat(data.transferOrderDate),
      'employeeNo': data.employeeNo,
      'districtId': data.districtId,
      'relievingDate': this.convertDateFormat(data.relievingDate),
      'transferNoonType': data.transferNoonType,
      'reasonForTransfer': data.reasonForTransfer,
      'curDistrict': data.curDistrict,
      'curCardexNo': data.curCardexNo,
      'curDDONo': data.curDDONo,
      'officeName': data.officeName,
      // 'transferRemarks': data.transferRemarks
    });

    this.empName = data.empName;
    this.empDesignation = data.empDesignation;
    this.curDistrictName = data.curDistrictName;
    this.curOffName = data.curOffName;
    this.curSubOfficeName = data.curSubOfficeName;

    if (this.statusId !== 487) {
      this.getEmployeeDetail(data.employeeNo);
    }
    await this.getCardexNoByDistrict(data.districtId);
    setTimeout(() => {
      this.getDDONo(Number(data.cardexNo));
      this.getOfficeName(data.ddoCode);
      this.transferForm.patchValue({
        'cardexNo': Number(data.cardexNo),
        'ddoCode': data.ddoCode,
        'subOfficeId': data.subOfficeId,
      });
    }, 0);
  }

  /**
   * @description Open Employee search dialog box
   */
  openSearchEmployeeDialog() {
    if (!this.transferForm.controls.employeeNo.value) {
      const dialogRef = this.dialog.open(SearchEmployeeComponent, {
        width: '800px',
      }),
        self = this;

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          self.transferForm.patchValue({
            employeeNo: result.employeeNo
          });
          self.getEmployeeDetail(self.transferForm.get('employeeNo').value);
        }
      });
    }
  }

  /**
   * @description Search employee through employee number
   * @param event keyboard event
   */
  onEmployeeKeyUp(event: KeyboardEvent) {
    const self = this;
    if (event) {
      if ((event['keyCode'] === 13 || event['keyCode'] === 9) &&
        this.transferForm.get('employeeNo').value.length === 10) {
        event.preventDefault();
        event.stopPropagation();
        self.getEmployeeDetail(self.transferForm.get('employeeNo').value);
      }
    } else {
      const employeeNo = self.transferForm.get('employeeNo').value;
      if (employeeNo && employeeNo.length === 10) {
        self.getEmployeeDetail(self.transferForm.get('employeeNo').value);
      }
    }
  }

  /**
   * @description Fetch employee details based on employee number
   * @param empNumber Employee Number
   */
  getEmployeeDetail(empNumber) {
    const param = {
      'id': +empNumber,
      'transfer': true
    };
    this.transferService.getSelectedEmpDetail(param).subscribe(data => {
      if (data && data['result'] && data['status'] === 200) {
        this.employeeId = data['result']['empId'];
        this.empName = data['result']['employeeName'];
        this.empDesignation = data['result']['designationName'];
        this.curDistrictName = data['result']['districtName'];
        this.curOffName = data['result']['officeName'];
        this.curSubOfficeName = data['result']['subOfficeName'];

        this.transferForm.patchValue({
          'curCardexNo': data['result']['cardexNo'],
          'curDDONo': data['result']['ddoNo'],
          'curDistrict': data['result']['districtId']
        });
        const dateOfJoin = data['result']['dateOfJoining'].split('T')[0].split('-');
        this.doj = new Date(dateOfJoin[0], dateOfJoin[1] - 1, dateOfJoin[2]);
        const dateOfRetire = data['result']['dateOfRetirement'].split('T')[0].split('-');
        this.dor = new Date(dateOfRetire[0], dateOfRetire[1] - 1, dateOfRetire[2]);
        if (this.dor < this.date) {
          this.date = this.dor;
        }
        if (this.transferForm.get('transferOrderDate').value) {
          if (this.transferForm.get('transferOrderDate').value < this.doj) {
            this.toastr.error('Employee Joining Date is ' +
            this.doj.getDate() + '/' + (this.doj.getMonth() + 1) + '/' + this.doj.getFullYear());
          }
          if (this.transferForm.get('transferOrderDate').value > this.dor) {
            this.toastr.error('Employee Retirement Date is ' +
            this.dor.getDate() + '/' + (this.dor.getMonth() + 1) + '/' + this.dor.getFullYear());
          }
        }
      } else {
        this.toastr.error(data['message']);
        this.employeeId = 0;
        this.empName = '';
        this.empDesignation = '';
        this.curDistrictName = '';
        this.curOffName = '';
        this.curSubOfficeName = '';

        this.transferForm.patchValue({
          'curCardexNo': '',
          'curDDONo': '',
          'curDistrict': 0
        });

        this.doj = '';
        this.dor = new Date();
      }
    }, (err) => {
      this.toastr.error(err);
    });
  }

  /**
   * @description Fetch Cardex No based on selected district
   * @param eventVal district value selected
   */
  async getCardexNoByDistrict(eventVal) {
    const param = {
      'id': eventVal
    };
    this.transferForm.patchValue({
      'cardexNo': '',
      'ddoCode': '',
      'officeName': '',
      'subOfficeId': ''
    });
    await this.transferService.getOfficeByDistrictID(param).toPromise().then(data => {
      if (data && data['result'] && data['result'].length > 0) {
        this.officeDetails = _.orderBy(_.cloneDeep(data['result']), 'cardexno', 'asc');
        if (this.transferForm.get('reasonForTransfer').value) {
          this.reasonChange(this.transferForm.get('reasonForTransfer').value);
        } else {
          this.officeDetailCardex = _.orderBy(_.cloneDeep(data['result']), 'cardexno', 'asc');
          this.officeDetailCardex = this.officeDetailCardex.map(item => {
            item['cardexNoString'] = item['cardexno'] + '';
            return item;
          });
          this.officeDetailDDO = [];
          this.subOfficeList = [];
        }
      } else {
        this.toastr.error(data['message']);
        this.officeDetailCardex = [];
        this.officeDetailDDO = [];
        this.subOfficeList = [];
      }
    });
  }

  /**
   * @description Fetch DDO No based on Cardex No selection
   * @param eventVal Cardex No value selected
   */
  getDDONo(eventVal) {
    this.transferForm.patchValue({
      'ddoCode': '',
      'officeName': '',
      'subOfficeId': ''
    });
    if (this.officeDetailCardex.length > 0) {
      const selectedOffice = this.officeDetailCardex.
        // tslint:disable-next-line:triple-equals
        filter((item) => item['cardexno'] == eventVal);
      this.officeDetailDDO = _.orderBy(_.cloneDeep(selectedOffice), 'ddoNo', 'asc');
      this.subOfficeList = [];
      // tslint:disable-next-line:triple-equals
      if (selectedOffice.length == 1) {
        this.transferForm.get('ddoCode').setValue(selectedOffice[0]['ddoNo']);
        this.getOfficeName(selectedOffice[0]['ddoNo']);
      }
    }
  }

  /**
   * @description Fetch Office Name and Sub Office Detail based on DDO No selected
   * @param eventVal DDO No value selected
   */
  getOfficeName(eventVal) {
    const selectedOffice = this.officeDetailDDO.
      // tslint:disable-next-line:triple-equals
      filter((item) => item['ddoNo'] == eventVal);
    // this.officeDetailDDO = selectedOffice;
    if (selectedOffice && selectedOffice.length > 0) {
      if (this.transferForm.get('curOfficeId').value === selectedOffice[0]['officeId']) {
        this.toastr.error('Employee can not be transferred to same office');
        this.transferForm.patchValue({
          'cardexNo': '',
          'ddoCode': '',
          'officeName': '',
          'subOfficeId': ''
        });
      } else {
        this.transferForm.patchValue({
          'officeName': selectedOffice[0]['officeName']
        });
        this.transferOffId = selectedOffice[0]['officeId'];
        this.transferService.getSubOffice({ 'id': this.transferOffId }).subscribe((res) => {
          if (res && res['result']) {
            this.subOfficeList = res['result'];
          } else {
            this.subOfficeList = [];
          }
        });
      }
    }
  }

  /**
   * @description If selected reason value is 253 (On deputation out of IFMS),
   * then show cardex,ddo of HOD
   * @param eventVal value of selected reason
   */
  reasonChange(eventVal) {
    if (eventVal === 253) {
      const selectedOffice = this.officeDetails.
        filter((item) => item['isHod'] === 2);
      // isHod value 2 is for HOD offices
      this.officeDetailCardex = selectedOffice;
      this.officeDetailDDO = selectedOffice.filter((item) =>
        // tslint:disable-next-line:triple-equals
        item['cardexno'] == this.transferForm.get('cardexNo').value);
      if (selectedOffice.filter((item) =>
        // tslint:disable-next-line:triple-equals
        item['cardexno'] == this.transferForm.get('cardexNo').value).length === 0 ||
        selectedOffice.filter((item) =>
          // tslint:disable-next-line:triple-equals
          item['ddoNo'] == this.transferForm.get('ddoCode').value).length === 0) {
        this.transferForm.patchValue({
          'cardexNo': '',
          'ddoCode': '',
          'officeName': '',
          'subOfficeId': ''
        });
        this.toastr.error('Please select HOD office as Reason for Transfer is Deputation out of IFMS');
        this.subOfficeList = [];
      }
    } else {
      this.officeDetailCardex = this.officeDetails;
      this.officeDetailDDO = this.officeDetails.filter((item) =>
        // tslint:disable-next-line:triple-equals
        item['cardexno'] == this.transferForm.get('cardexNo').value);
    }
  }

  /**
   * @description Modify Date format
   * @param date date to formatted
   * @returns date string | null
   */
  convertDateFormat(dates) {
    let date;
    if (dates) {
      if (dates.indexOf(' ') !== -1) {
        date = dates.split(' ')[0].split('-');
        return new Date(date[0], Number(date[1]) - 1, date[2]);
      } else if (dates.indexOf('T') !== -1) {
        date = dates.split('T')[0].split('-');
        return new Date(date[0], Number(date[1]) - 1, date[2]);
      } else {
        date = dates.split('-');
        return new Date(date[0], Number(date[1]) - 1, date[2]);
      }
    }
  }

  /**
   * @description Submit Transfer Details
   */
  submitTransferDetails() {
    let isValid = true;
    if (this.transferForm.invalid) {
      _.each(this.transferForm.controls, function (control) {
        if (control.status === 'INVALID') {
          control.markAsTouched({ onlySelf: true });
          isValid = false;
        }
      });
    }

    if (!this.employeeId) {
      this.transferForm.controls.employeeNo.markAsTouched();
      isValid = false;
    }

    if (isValid) {
      this.transferForm.removeControl('officeName');
      const dataToSend = _.cloneDeep(this.transferForm.value);
      for (const key in this.transferForm.controls) {
        if (this.transferForm.controls[key].value instanceof Date) {
          const date: Date = this.transferForm.controls[key].value,
            // tslint:disable-next-line:max-line-length
            month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1),
            // tslint:disable-next-line:max-line-length
            day = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
          // tslint:disable-next-line:max-line-length
          dataToSend[key] = '' + date.getFullYear() + '-' + month + '-' + day;
        }
      }
      dataToSend['officeId'] = this.transferOffId;
      dataToSend['statusId'] = this.statusId;
      dataToSend['formAction'] = 'SUBMITTED';
      dataToSend['employeeId'] = this.employeeId;
      dataToSend['id'] = this.id;
      dataToSend['trnNo'] = this.trnNo;
      dataToSend['createdDate'] = this.initiationDate;
      dataToSend['refDate'] = this.initiationDate;
      this.transferService.createTransfer(dataToSend).subscribe(data => {
        if (data && data['status'] === 200 && data['result'] != null) {
          this.toastr.success(data['message']);
          this.id = data['result']['id'];
          this.transferDetails = data['result'];
          this.openWorkFlowPopUp();
        } else {
          this.toastr.error(data['message']);
        }
      });
    } else {
      this.toastr.error(MessageConst.VALIDATION.TOASTR);
    }
  }

  /**
   * @description Open Workflow Popup Dialog after successful submission
   */
  openWorkFlowPopUp(): void {
    // tslint:disable-next-line: no-use-before-declare
    const dialogRef = this.dialog.open(ForwardDialogComponent, {
      width: '2700px',
      height: '600px',
      data: {
        'empId': this.employeeId,
        'trnId': this.id,
        'event': 'TRANSFER',
        'transferOffId': this.transferOffId,
        'trnNo': this.trnNo,
        'initiationDate': this.initiationDate
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        if (this.action === 'edit') {
          this.router.navigate(['/dashboard/pvu/transfer/transfer'], { skipLocationChange: true });
        } else {
          this.router.navigate(['/dashboard'], { skipLocationChange: true });
        }
      }
    });
  }


  /**
   * @description Reset Transfer Form
   */
  reset() {
    this.dialog.open(ConfirmationDialogComponent, {
      width: '360px',
      data: pvuMessage.RESET
    })
      .afterClosed().subscribe(result => {
        if (result === 'yes') {
          this.transferForm.reset();
          this.employeeId = 0;
          this.empName = '';
          this.empDesignation = '';
          this.curDistrictName = '';
          this.curOffName = '';
          this.curSubOfficeName = '';
          this.doj = '';
          this.dor = new Date();
          this.transferForm.patchValue({
            'curOfficeId': this.currentPost[0]['oauthTokenPostDTO']['edpMsOfficeDto']['officeId']
          });
          this.loginOffName = this.currentPost[0]['oauthTokenPostDTO']['edpMsOfficeDto']['officeName'];
          if (this.id) {
            this.setTransferDetail(this.transferDetails);
          }
        }
      });
  }

  /**
   * @description Navigate to dashboard
   */
  goToDashboard() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '360px',
      data: pvuMessage.CLOSE
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        const url: string = this.routeService.getPreviousUrl();
        this.router.navigate([url.toString()], { skipLocationChange: true });
      }
    });
  }

  /**
  * @description Navigate to listing page
  */
  goToListing() {
    this.router.navigate(['/dashboard/pvu/transfer/transfer'], { skipLocationChange: true });
  }

  /**
    * @description Method to open ViewComments Dialog
    */
  viewComments() {
    if (this.id) {
      this.dialog.open(ViewCommentsComponent, {
        width: '2700px',
        height: '600px',
        data: {
          'empId': this.employeeId,
          'trnId': this.id,
          'event': 'TRANSFER',
          'trnNo': this.trnNo,
          'initiationDate': this.initiationDate
        }
      });
    }
  }
}

