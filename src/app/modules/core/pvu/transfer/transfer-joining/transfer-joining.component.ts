import { EventViewPopupService } from './../../services/event-view-popup.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { StorageService } from 'src/app/shared/services/storage.service';
import { pvuMessage, MessageConst } from 'src/app/shared/constants/pvu/pvu-message.constants';
import * as _ from 'lodash';
import { TransferService } from '../services/transfer.service';
import { RouteService } from 'src/app/shared/services/route.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { ViewCommentsComponent } from '../../pvu-common/view-comments/view-comments.component';
import { ForwardDialogComponent } from '../../pvu-common/forward-dialog/forward-dialog.component';

@Component({
  selector: 'app-transfer-joining',
  templateUrl: './transfer-joining.component.html',
  styleUrls: ['./transfer-joining.component.css']
})
export class TransferJoiningComponent implements OnInit {

  trnNo;
  initiationDate;
  transferJoiningForm: FormGroup;
  errorMessages;
  showDataEmployee: boolean = false;
  currentDetails: boolean = false;
  subscribeParams: Subscription;
  action;
  isView = false;
  currentPost;
  id: number;
  employeeId: number;
  officeId: number;
  doj;
  dor;
  relDate;
  date = new Date();
  transferDetails;
  statusId;

  empName;
  empDesignation;
  curDistrictName;
  curOffName;
  curSubOfficeName;

  subOfficeNameList;
  noonTypeList;
  districtList;
  reasonList;

  subOfficeNameCtrl: FormControl = new FormControl();
  forenoonAfternoonCtrl: FormControl = new FormControl();
  reasonForTransferCtrl: FormControl = new FormControl();
  districtCtrl: FormControl = new FormControl();
  dialogOpen: boolean;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private toastr: ToastrService,
    public router: Router,
    private storageService: StorageService,
    private activatedRoute: ActivatedRoute,
    private transferService: TransferService,
    private routeService: RouteService,
    private eventViewPopupService: EventViewPopupService
  ) { }

  ngOnInit() {
    this.errorMessages = pvuMessage;

    const userOffice = this.storageService.get('currentUser');
    if (userOffice && userOffice['post'][0]['loginPost'] !== undefined) {
      this.currentPost = userOffice['post'].filter((item) => item['loginPost'] === true);
    }

    this.createForm();

    this.subscribeParams = this.activatedRoute.params.subscribe(resRoute => {
      this.action = resRoute.action;
      if (this.action === 'edit' || this.action === 'view') {
        const params = { 'id': +resRoute.id };
        this.getTransferDetail(params);
        if (this.action === 'view') {
          this.isView = true;
          this.transferJoiningForm.disable();
        }
      }
    });

    const eventID = +this.eventViewPopupService.eventID;
    // const eventCode = this.eventViewPopupService.eventCode;
    this.eventViewPopupService.eventID = 0;
    this.eventViewPopupService.eventCode = '';
    if (eventID !== 0) {
      this.dialogOpen = true;
      this.action = 'view';
      const params = { 'id': eventID };
      this.getTransferDetail(params);
      this.isView = true;
      this.transferJoiningForm.disable();
    }

    this.transferService.getLookupData().subscribe(data => {
      if (data && data != null) {
        this.noonTypeList = data['result']['Noon_Type'];
        this.reasonList = data['result']['ReasonForTransfer'];
      }
    }, (err) => { });
    this.transferService.getDistrictDesg().subscribe(data => {
      if (data && data != null) {
        this.districtList = data['result']['district'];
      }
    }, (err) => { });
  }

  /**
  * @description Create Transfer Joining From
  */
  createForm() {
    this.transferJoiningForm = this.fb.group({
      officename: [this.currentPost[0]['oauthTokenPostDTO']['edpMsOfficeDto']['officeName']],
      employeeNo: [''],
      transferOrderNo: [''],
      transferOrderDate: [''],
      curCardexNo: [''],
      curDDONo: [''],
      curDistrict: [''],
      curOfficeId: [''],
      relievingDate: [''],
      transferNoonType: [''],
      districtId: [''],
      cardexNo: [''],
      ddoCode: [''],
      joiningSubOfficeId: [''],
      joiningNoonType: [''],
      actualJoiningDate: [''],
      reasonForTransfer: [''],
      // joiningRemarks: ['']
    });
  }

  /**
  * @description Get Transfer detail by id
  * @param param id of the Transfer event
  */
  getTransferDetail(params) {
    this.transferService.getTransfer(params).subscribe((res) => {
      if (res && res['status'] === 200) {
        this.id = res['result']['id'];
        this.transferDetails = res['result'];
        this.setTransferDetails(res['result']);
      } else {
        this.toastr.error(res['message']);
      }
    }, (err) => {
      this.toastr.error(err);
    });
  }

  /**
  * Set Transfer details for edit/view
  * @param data transfer details
  */
  setTransferDetails(detail) {
    this.id = detail.id;
    this.employeeId = detail.employeeId;
    this.trnNo = detail.trnNo;
    this.initiationDate = detail.refDate;
    this.statusId = detail.statusId;
    this.transferJoiningForm.patchValue({
      'employeeNo': detail.employeeNo,
      'transferOrderNo': detail.transferOrderNo,
      'transferOrderDate': this.convertDateFormat(detail.transferOrderDate),
      'curCardexNo': detail.curCardexNo,
      'curDDONo': detail.curDDONo,
      'curDistrict': detail.curDistrict,
      'curOfficeId': detail.curOfficeId,
      'districtId': detail.districtId,
      'cardexNo': detail.cardexNo,
      'ddoCode': detail.ddoCode,
      'relievingDate': this.convertDateFormat(detail.relievingDate),
      'transferNoonType': detail.transferNoonType,
      'reasonForTransfer': detail.reasonForTransfer,
      'joiningSubOfficeId': detail.joiningSubOfficeId,
      'actualJoiningDate': this.convertDateFormat(detail.actualJoiningDate),
      'joiningNoonType': detail.joiningNoonType,
      //  'joiningRemarks': detail.joiningRemarks
    });
    this.officeId = detail.officeId;

    this.empName = detail.empName;
    this.empDesignation = detail.empDesignation;
    this.curDistrictName = detail.curDistrictName;
    this.curOffName = detail.curOffName;
    this.curSubOfficeName = detail.curSubOfficeName;

    this.relDate = this.convertDateFormat(detail.relievingDate);

    this.transferService.getSubOffice({ 'id': detail.officeId }).subscribe((res) => {
      if (res && res['result'] && res['result'].length > 0) {
        this.subOfficeNameList = res['result'];
      }
    });
    this.transferService.getSelectedEmpDetail(
      {
        'id': detail.employeeNo,
        'transfer': false
      }).subscribe((resp) => {
        if (resp && resp['status'] === 200) {
          this.setEmpDetails(resp['result']);
        }
      });
  }

  /**
   * @description set Employee Details
   * @param detail Employee Details
   */
  setEmpDetails(detail) {
    this.employeeId = detail.empId;
    // this.curDistrictName = detail.districtName;

    const dateOfJoin = detail.dateOfJoining.split('T')[0].split('-');
    this.doj = new Date(dateOfJoin[0], dateOfJoin[1] - 1, dateOfJoin[2]);
    const dateOfRetire = detail.dateOfRetirement.split('T')[0].split('-');
    this.dor = new Date(dateOfRetire[0], dateOfRetire[1] - 1, dateOfRetire[2]);
    if (this.dor < this.date) {
      this.date = this.dor;
    }
  }

  /**
 * @description Modify Date format
 * @param date date to formatted
 * @returns date string| null
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

  /** Save as draft functionality cancelled at present. May be required in future */
  /**
   * @description Save Transfer Joining Details
   */
  /**  saveJoiningDetails() {
     let valid = true;
     const self = this;

     if (this.transferJoiningForm.invalid) {
       _.each(this.transferJoiningForm.controls, function (control) {
         if (control.status === 'INVALID') {
           control.markAsTouched({ onlySelf: true });
           valid = false;
         }
       });
     }
     if (valid) {
       const dataToSend = _.cloneDeep(this.transferJoiningForm.value);
       dataToSend['actualJoiningDate'] = this.convertDateFormat
       (this.transferJoiningForm.get('actualJoiningDate').value),
         dataToSend['id'] = Number(this.id),
         dataToSend['employeeId'] = Number(this.employeeId),
         dataToSend['officeId'] = this.officeId,
         this.transferService.updateTransfer(dataToSend).subscribe((res) => {
           if (res && res['status'] === 200) {
             self.toastr.success(res['message']);
           } else {
             self.toastr.error(res['message']);
           }
         }, (err) => {
           self.toastr.error(err);
         });
     } else {
       this.toastr.error(MessageConst.VALIDATION.TOASTR_REQUIRED);
     }
   } */

  /**
   * @description Submit Transfer Joining Description
   */
  submitJoiningDetails() {
    // let valid = true;
    const self = this;
    // if (
    //   //  this.transferJoiningForm.controls.joiningNoonType.value === 0 ||
    //   // this.transferJoiningForm.controls.joiningNoonType.invalid ||
    //   this.transferJoiningForm.controls.actualJoiningDate.invalid) {
    //   this.transferJoiningForm.controls.actualJoiningDate.markAsTouched();
    //   // this.transferJoiningForm.controls.joiningNoonType.setErrors(Validators.required);
    //   valid = false;
    // }
  //  if (valid) {
      const dataToSend = _.cloneDeep(this.transferJoiningForm.value);
      for (const key in this.transferJoiningForm.controls) {
        if (this.transferJoiningForm.controls[key].value instanceof Date) {
          const date: Date = this.transferJoiningForm.controls[key].value,
            // tslint:disable-next-line:max-line-length
            month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1),
            // tslint:disable-next-line:max-line-length
            day = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
          // tslint:disable-next-line:max-line-length
          dataToSend[key] = '' + date.getFullYear() + '-' + month + '-' + day;
        }
      }
      dataToSend['id'] = Number(this.id);
      dataToSend['employeeId'] = Number(this.employeeId);
      dataToSend['officeId'] = this.officeId;
      dataToSend['trnNo'] = this.trnNo;
      dataToSend['createdDate'] = this.initiationDate;
      dataToSend['refDate'] = this.initiationDate;
      dataToSend['statusId'] = this.statusId;
      this.transferService.createTransfer(dataToSend).subscribe((res) => {
        if (res && res['status'] === 200) {
          self.toastr.success(res['message']);
          this.transferDetails = res['result'];
          this.openWorkFlowPopUp();
        } else {
          self.toastr.error(res['message']);
        }
      }, (err) => {
        self.toastr.error(err);
      });

    // } else {
    //   this.toastr.error(MessageConst.VALIDATION.TOASTR);
    // }
  }

  /**
 * @description Open Workflow Popup Dialog after successful submission
 */
  openWorkFlowPopUp(): void {
    // tslint:disable-next-line: no-use-before-declare
    let isTransferApprove;
    if (this.transferJoiningForm.get('actualJoiningDate').value) {
      isTransferApprove = true;
    } else {
      isTransferApprove = false;
    }
    const dialogRef = this.dialog.open(ForwardDialogComponent, {
      width: '2700px',
      height: '600px',
      data: {
        'empId': this.employeeId,
        'trnId': this.id,
        'event': 'TRANSFER_JOINING',
        'trnNo': this.trnNo,
        'initiationDate': this.initiationDate,
        'isTransferApprove' : isTransferApprove
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        if (this.action === 'edit') {
          this.router.navigate(['/dashboard/pvu/transfer/transfer-joining'], { skipLocationChange: true });
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
          this.transferJoiningForm.reset();
          this.employeeId = 0;
          this.empName = '';
          this.empDesignation = '';
          this.curDistrictName = '';
          this.curOffName = '';
          this.curSubOfficeName = '';
          this.doj = '';
          this.dor = new Date();
          this.transferJoiningForm.patchValue({
            'officename': this.currentPost[0]['oauthTokenPostDTO']['edpMsOfficeDto']['officeName']
          });
          if (this.id) {
            this.setTransferDetails(this.transferDetails);
          }
        }
      });
  }

  /**
 * @description Navigate to dashboard
 */
  goToDashboard() {
    if (!this.dialogOpen) {
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
    } else {
      this.dialog.closeAll();
    }
  }

  /**
  * @description Navigate to listing page
  */
  goToListing() {
    this.router.navigate(['/dashboard/pvu/transfer/transfer-joining'], { skipLocationChange: true });
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
