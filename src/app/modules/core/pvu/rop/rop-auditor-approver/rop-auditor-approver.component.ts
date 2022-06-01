import { EventViewPopupService } from './../../services/event-view-popup.service';
import { RopAttachmentComponent } from './../rop-attachment/rop-attachment.component';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { pvuMessage } from 'src/app/shared/constants/pvu/pvu-message.constants';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ROPService } from '../service/rop.service';
import * as _ from 'lodash';
import { DatePipe } from '@angular/common';
import { RopWfComponent } from '../rop-wf/rop-wf.component';
import { APIConst } from 'src/app/shared/constants/pvu/pvu-api.constants';
import { RopSearchEmployeeComponent } from '../rop-search-employee/rop-search-employee.component';
import { RopCommentsComponent } from '../rop-comments/rop-comments.component';
import { DataConst } from 'src/app/shared/constants/pvu/pvu-data.constants';
import { EmployeeCreationComponent } from '../../employee-creation/employee-creation.component';
import { EmployeeCreationPopUpServiceService } from 'src/app/modules/pvu/pvu-common/employee-creation-pop-up-service.service';

@Component({
    selector: 'app-rop-auditor-approver',
    templateUrl: './rop-auditor-approver.component.html',
    styleUrls: ['./rop-auditor-approver.component.css']
})
export class RopAuditorApproverComponent implements OnInit {
    subscribeParams;
    action: string;
    containers = [];
    ropForm: FormGroup;
    isApproverRemarks: boolean = false;

    ropConfig;
    ropTypeList = [];
    reasonForChangeList = [];
    recommendationList = [];
    returnReasonList = [];

    ropCtrl: FormControl = new FormControl();
    reasonForChangeCtrl: FormControl = new FormControl();
    recomandCtrl: FormControl = new FormControl();
    returnReasonCtrl: FormControl = new FormControl();
    date: Date = new Date();
    errorMessage;
    employeeDetails;
    curBasicPay: number;
    curGradePay: number;
    curPayBandId: number;
    curPayBandValue: number;
    empClassId: number;
    designationId: number;
    curScaleId: number;
    npaId: number;

    revGradePay: number;
    revPayBand: number;
    revPayBandValue: number;
    revPayLevel: number;
    revCellId: number;

    empId: number;
    eventId: number;
    trnNo: string;
    trnDate: string;
    officeId: number;
    showDataEmployee: boolean = false;
    showSeventhPayCommField = false;
    showSixthPayCommField = false;
    displayedAry: string[] = [];

    displayedBrowseColumns = [
        'sr_no', 'attachmentType', 'fileName', 'browse', 'uploadedFileName', 'uploadedBy', 'action'
    ];

    postData: any;
    isReasonForChangeVisible: boolean;
    remarksVisible: boolean;
    maxDate = new Date();
    eventMinDate = new Date();
    displayedColumns: string[] = ['serialNo', 'reasonName'];
    dataSource: MatTableDataSource<any>;

    @ViewChild('attachmentTab', { static: true }) attachmentTab: RopAttachmentComponent;
    // attachmentTab;
    attachmentData = {
        moduleName: APIConst.ROP.ROP_PREFIX,
    };
    eventData: any;
    reasonData: any;
    isViewCommentsVisible: boolean = false;
    isAuditor: boolean = false;
    isPvuApprover: boolean = false;
    wfRoleCodeArray: string[] = [];
    isReturn: boolean = false;
    isNonEditable: boolean = false;
    isOtherReturnReason: boolean = false;
    userInfo;
    pvuReturnOfficeId: number = null;
    valid_Reason: any[];
    isAuthZ: boolean;
    dialogOpen: boolean;
    dialogLinkMenuId: number = 0;
    constructor(
        private fb: FormBuilder,
        private toastr: ToastrService,
        public dialog: MatDialog,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private ropService: ROPService,
        private employeeCreationPopUpServiceService: EmployeeCreationPopUpServiceService,
        private eventViewPopupService: EventViewPopupService
    ) { }

    ngOnInit() {
        this.errorMessage = pvuMessage;
        this.createForm();
        this.containers.push(this.containers.length);

        this.subscribeParams = this.activatedRoute.params.subscribe(resRoute => {
            this.action = resRoute.action;
            if (this.activatedRoute.snapshot.url[0].path === 'auditor') {
                this.isAuditor = true;
            } else if (this.activatedRoute.snapshot.url[0].path === 'approver') {
                this.isPvuApprover = true;
            }
            if (this.action && this.action === 'edit' || this.action === 'view') {
                this.eventId = +resRoute.id;
                if (this.eventId) {
                    // this.getRopConfiguration();
                    this.getCurrentUserInfo();
                } else {
                    this.router.navigate(['/dashboard'], { skipLocationChange: true });
                }
            } else {
                this.router.navigate(['/dashboard'], { skipLocationChange: true });
            }
        });

        const eventID = +this.eventViewPopupService.eventID;
        // const eventCode = this.eventViewPopupService.eventCode;
        const dialogLinkMenuId = this.eventViewPopupService.linkMenuID;
        this.eventViewPopupService.eventID = 0;
        this.eventViewPopupService.eventCode = '';
        this.eventViewPopupService.linkMenuID = 0;
        if (eventID !== 0) {
            this.dialogOpen = true;
            this.dialogLinkMenuId = +dialogLinkMenuId;
            this.action = 'view';
            this.isPvuApprover = true;
            this.eventId = eventID;
            this.isNonEditable = true;
            this.getRopConfiguration();
        }
    }

    /**
     * To get the current user info
     */
    getCurrentUserInfo() {
        this.ropService.getCurrentUserDetail().then(res => {
            if (res) {
                this.userInfo = res;
                this.officeId = res['officeDetail']['officeId'];
                this.wfRoleCodeArray = res['wfRoleCodeArray'];
                this.ropForm.patchValue({
                    officeName: res['officeDetail']['officeName']
                });
                if (this.eventId) {
                    this.getRopTransactionWfRoleCode();
                }
            }
        });
    }

    /**
     * To create the ROP form group
     */
    createForm() {
        this.ropForm = this.fb.group({
            officeName: [''],
            orderNumber: [''],
            orderDate: [''],
            ropType: [''],
            effectiveDate: [''],
            empNumber: [''],
            empName: [''],
            empClass: [''],
            empDesignation: [''],
            employeePayLevel: [''],
            employeePayBand: [''],
            employeePayBandValue: [''],
            employeeGradePay: [''],
            empPayScale: [''],
            employeeBasicPay: [''],
            employeeDoj: [''],
            dateOfRetirement: [''],
            employeeOfficeName: [''],
            empDateOfNextIncrement: [''],
            npaValue: [''],
            payBand: [''],
            payBandValue: [''],
            gradePay: [''],
            payLevel: [''],
            cellId: [''],
            basicPay: [''],
            postEffectiveDate: [''],
            dateOfNextIncrement: [''],
            reasonForChangeEffectiveDate: [''],
            remarks: [''],
            recommendationFor: ['', Validators.required],
            returnReason: [[]],
            otherReason: [''],
            auditorRemarks: [''],
            approverRemarks: [''],
        });
    }

    get fc() {
        return this.ropForm.controls;
    }

    /**
     * To get the ROP event data
     */
    loadRopEventData(id) {
        const param = {
            'id': id
        };
        this.ropService.getRopEventData(param).subscribe((res) => {
            if (res && res['status'] === 200 && res['result']) {
                this.eventData = res['result'];
                this.setData(res['result']);
            } else {
                this.toastr.error(res['message']);
            }
        }, (err) => {
            this.toastr.error(err);
        });
    }

    /**
     * Set the Event data to forms
     * @param data data received from the ROP event data get API
     */
    setData(data) {
        this.trnNo = data.trnNo;
        this.trnDate = data.createdDate;

        switch (data.ropType) {
            case 412:
                this.showSixthPayCommField = true;
                break;
            case 413:
                this.showSeventhPayCommField = true;
        }

        if (data.remarks !== '' && data.remarks !== null) {
            this.remarksVisible = true;
            this.ropForm.controls.remarks.setValidators(Validators.required);
            this.ropForm.controls.remarks.updateValueAndValidity();
            console.log(this.remarksVisible);
        } else {
            this.remarksVisible = false;
            console.log(this.remarksVisible);
            this.ropForm.controls.remarks.clearValidators();
            this.ropForm.controls.remarks.updateValueAndValidity();
        }
        if (data.ropChangeEffDate !== '' && data.ropChangeEffDate !== null) {
            this.isReasonForChangeVisible = true;
            this.ropForm.controls.reasonForChangeEffectiveDate.setValidators(Validators.required);
            this.ropForm.controls.reasonForChangeEffectiveDate.updateValueAndValidity();
        } else {
            this.isReasonForChangeVisible = false;
            this.ropForm.controls.reasonForChangeEffectiveDate.clearValidators();
            this.ropForm.controls.reasonForChangeEffectiveDate.updateValueAndValidity();
        }
        if (data.classTwoRemarks !== null && data.classTwoRemarks !== '') {
            this.isApproverRemarks = true;
        }

        this.ropForm.patchValue({
            officeName: data.officeName, // office name of created by
            orderNumber: data.orderNo,
            orderDate: this.dateFormating(data.orderDate),
            ropType: data.ropType,
            effectiveDate: this.dateFormating(data.effectiveDate),
            empNumber: data.empNo,
            empName: data.empName,
            empClass: data.className,
            empDesignation: data.designationName,
            employeePayLevel: data.curPayLevelValue,
            employeePayBand: data.curPayBandName,
            employeePayBandValue: data.curPayBandValue,
            employeeGradePay: data.curGradePayValue,
            empPayScale: data.curScaleName,
            employeeBasicPay: data.curBasicPay,
            employeeDoj: this.convertDate(data.dateOfJoining),
            dateOfRetirement: this.convertDate(data.retirmentDate),
            employeeOfficeName: data.officeName,
            empDateOfNextIncrement: this.showSeventhPayCommField ? this.convertDate(data.curNextIncrementDate) : '',
            npaValue: data.npaValue,
            payBand: data.revPayBandName,
            payBandValue: data.revPayBandValue,
            gradePay: data.revGradePayValue,
            payLevel: data.revPayLevelValue,
            cellId: data.revCellValue,
            basicPay: data.revBasicPay,
            postEffectiveDate: this.convertDate(data.effectiveDate),
            dateOfNextIncrement: this.dateFormating(data.revNextIncrementDate),
            reasonForChangeEffectiveDate: data.ropChangeEffDate,
            remarks: data.remarks,
            auditorRemarks: data.auditorRemarks,
            approverRemarks: data.classTwoRemarks,
            recommendationFor: data.auditorReturnReason,
        });

        this.recommendationChange();
        this.reasonChangeSelection();
        this.loadReason();
        this.pvuReturnOfficeId = data.officeId;
        this.eventMinDate = this.dateFormating(data.dateOfJoining);

        this.curBasicPay = data.curBasicPay;
        this.curGradePay = data.curGradePay;
        this.curPayBandId = data.curPayBand;
        this.curPayBandValue = data.curPayBandValue;
        this.designationId = data.designationId;
        this.empClassId = data.classId;
        this.curScaleId = data.curScaleId;
        this.npaId = data.npa;

        this.revGradePay = data.revGradePay;
        this.revPayBand = data.revPayBand;
        this.revPayBandValue = data.revPayBandValue;
        this.revPayLevel = data.revPayLevel;
        this.revCellId = data.revCellId;
        this.empId = data.empId;

        if (this.empId && this.eventId) {
            this.isViewCommentsVisible = true;
        }

        if (this.action === 'view') {
            this.ropForm.disable();
        }
    }

    /**
     * To load the reason list in dropdown list
     */
    loadReason() {
        const param = {
            'id': this.eventId
        };
        this.ropService.getRopReasonData(param).subscribe((res) => {
            if (res && res['status'] === 200 && res['result']) {
                this.reasonData = res['result'];
                console.log(this.reasonData);
                const returnReason = [];
                let otherReason = '';
                this.reasonData.forEach(reasonObj => {
                    if (reasonObj && reasonObj.reasonId) {
                        returnReason.push(reasonObj.reasonId);
                        if (reasonObj.reasonId === 116) {
                            otherReason = reasonObj.remarks;
                        }
                    }
                });
                if (returnReason) {
                    this.ropForm.patchValue({
                        'returnReason': returnReason,
                        'otherReason': otherReason
                    });
                }
                this.reasonChangeSelection();
            } else {
                this.toastr.error(res['message']);
            }
        }, (err) => {
            this.toastr.error(err);
        });
    }

    /**
     * To get the Look up master data
     */
    getRopLookup() {
        this.ropService.getRopLookUpInfoData('').subscribe((res) => {
            if (res && res['status'] === 200) {
                this.ropTypeList = res['result']['ROPType'];
                this.reasonForChangeList = res['result']['ReasonforChangeinEffectiveDate'];
                this.recommendationList = res['result']['RecommendationFor'];
                if (this.eventId) {
                    this.loadRopEventData(this.eventId);
                }
            } else {
                this.toastr.error(res['message']);
            }
        }, (err) => {
            this.toastr.error(err);
        });
    }

    /**
     * To get the reason list
     */
    getReasonList() {
        this.ropService.getReturnReasonList('').subscribe((res) => {
            if (res && res['status'] === 200) {
                this.returnReasonList = res['result'];
            } else {
                this.toastr.error(res['message']);
            }
        }, (err) => {
            this.toastr.error(err);
        });
    }

    /**
     * To get the ROP Type configuration data
     */
    getRopConfiguration() {
        this.ropService.getRopConfiguration('').subscribe((res) => {
            if (res && res['status'] === 200) {
                this.ropConfig = res['result'];
                this.getRopLookup();
                this.getReasonList();
            } else {
                this.toastr.error(res['message']);
            }
        }, (err) => {
            this.toastr.error(err);
        });
    }

    /**
     * To get the Transaction currebt workflow status
     */
    getRopTransactionWfRoleCode() {
        const param = {
            id: this.eventId
        };
        this.ropService.getRopTransactionWfRoleCode(param).subscribe((res) => {
            if (res && res['status'] === 200) {
                if (res['result'] === DataConst.ROP.AUDITOR_WF_ROLE_CODE) {
                    if (this.wfRoleCodeArray.indexOf(res['result']) !== -1) {
                        this.isAuditor = true;
                    }
                } else if (res['result'] === DataConst.ROP.PVU_APPROVER_WF_ROLE_CODE) {
                    if (this.wfRoleCodeArray.indexOf(res['result']) !== -1) {
                        this.isPvuApprover = true;
                    }
                } else {
                    this.isNonEditable = true;
                }
                this.getRopConfiguration();
            } else {
                this.toastr.error(res['message']);
            }
        }, (err) => {
            this.toastr.error(err);
        });
    }

    /**
     * On Recommendation For selection change, show/hide the reason dropdown
     * // 420 is id for Return Option
     */
    recommendationChange() {
        if (this.ropForm.get('recommendationFor').value === 420) {
            this.isReturn = true;
            this.isAuthZ = false;
            this.isOtherReturnReason = false;
            this.ropForm.controls.returnReason.setValidators(Validators.required);
            this.ropForm.controls.returnReason.updateValueAndValidity();
            this.loadReason();
            if (this.isPvuApprover) {
                this.ropForm.controls.approverRemarks.setValidators([Validators.required, Validators.maxLength(10000)]);
                this.ropForm.controls.approverRemarks.updateValueAndValidity();
            }
        } else {
            this.isReturn = false;
            this.isAuthZ = true;
            this.isOtherReturnReason = false;
            this.ropForm.controls.returnReason.setValue([]);
            this.ropForm.controls.returnReason.clearValidators();
            this.ropForm.controls.returnReason.markAsUntouched();
            this.ropForm.controls.returnReason.updateValueAndValidity();
            this.ropForm.controls.otherReason.setValue([]);
            this.ropForm.controls.otherReason.clearValidators();
            this.ropForm.controls.otherReason.markAsUntouched();
            this.ropForm.controls.otherReason.updateValueAndValidity();
            this.reasonChangeSelection();
            if (this.isPvuApprover) {
                this.ropForm.controls.approverRemarks.clearValidators();
                this.ropForm.controls.approverRemarks.markAsUntouched();
                this.ropForm.controls.approverRemarks.updateValueAndValidity();
            }
        }
    }

    /**
     * On Reason Selection change update the selected reason list and show/hide the Other Reason field
     * 116 is id for the Other Reason option
     */
    reasonChangeSelection() {
        const dataSelected = [];
        const selectedArray = this.ropForm.get('returnReason').value;
        if (selectedArray && selectedArray.length !== 0
            && this.returnReasonList && this.returnReasonList.length !== 0) {
            selectedArray.forEach(el => {
                const findData: any[] = this.returnReasonList.filter(data => data.reasonId === el);
                const reason = {
                    reasonId: findData[0]['reasonId'],
                    reasonName: findData[0]['reasonName']
                };
                dataSelected.push(reason);
            });
            if (selectedArray.indexOf(116) !== -1) {
                this.isOtherReturnReason = true;
            } else {
                this.isOtherReturnReason = false;
            }
            if (dataSelected) {
                this.dataSource = new MatTableDataSource(dataSelected);
            }
        } else {
            this.dataSource = new MatTableDataSource([]);
        }

        if (this.ropForm.get('recommendationFor').value !== 420) {
            this.dataSource = new MatTableDataSource([]);
        }
    }

    /**
     * To clear the post details
     */
    clearPostDetails() {
        this.ropForm.patchValue({
            'payLevel': '',
            'cellId': '',
            'basicPay': '',
            'postEffectiveDate': '',
            'dateOfNextIncrement': '',
            'payBand': '',
            'payBandValue': '',
            'gradePay': '',
            'reasonForChangeEffectiveDate': '',
            'remarks': '',
        });

        this.isReasonForChangeVisible = false;
        this.ropForm.controls.reasonForChangeEffectiveDate.clearValidators();
        this.ropForm.controls.reasonForChangeEffectiveDate.updateValueAndValidity();
        this.remarksVisible = false;
        this.ropForm.controls.remarks.clearValidators();
        this.ropForm.controls.remarks.updateValueAndValidity();
    }

    /**
     * To create the date object of MM/dd/yyyy date format
     * @param date date in format of MM/dd/yyyy
     */
    convertMonthDate(date) {
        if (date !== 0 && date !== null && date !== undefined && date !== '') {
            let d;
            d = date.split('/');
            if (d.length > 0) {
                return new Date(Number(d[2]), Number(d[1]) - 1, Number(d[0]));
            } else {
                return '';
            }
        } else {
            return '';
        }
    }

    /**
     * To convert the date object
     * @param date date object in string format
     */
    dateFormating(date) {
        if (date !== 0 && date !== '' && date != null) {
            let d;
            if (date.indexOf('T') !== -1) {
                d = date.split('T')[0].split('-');
            } else if (date.indexOf(' ') !== -1) {
                d = date.split(' ')[0].split('-');
            } else {
                d = date.split('-');
            }
            d = new Date(d[0], Number(d[1]) - 1, d[2]);
            return d;
        }
        return '';
    }

    /**
     * Show hide the remarks field based the selected reason as well as set and reset the validation for remarks field
     */
    reasonChange() {
        const reasonVal = this.ropForm.get('reasonForChangeEffectiveDate').value;
        if (reasonVal === 418) {
            this.remarksVisible = true;
            this.ropForm.controls.remarks.setValue('');
            this.ropForm.controls.remarks.setValidators(Validators.required);
            this.ropForm.controls.remarks.updateValueAndValidity();
        } else {
            this.remarksVisible = false;
            this.ropForm.controls.remarks.setValue('');
            this.ropForm.controls.remarks.clearValidators();
            this.ropForm.controls.remarks.updateValueAndValidity();
        }
    }

    /**
     * To convert the date format into (yyyy-mm-dd)
     * @param date default date
     */
    formatDate(date) {
        if (date !== 0 && date !== null && date !== undefined && date !== '') {
            const datePipe = new DatePipe('en-US');
            return datePipe.transform(date, 'yyyy-MM-dd');
        } else {
            return '';
        }
    }

    /**
     * Clear the Employee details fields
     */
    clearEmplDetail() {
        this.ropForm.patchValue({
            empName: '',
            empClass: '',
            empDesignation: '',
            empPayScale: '',
            employeeBasicPay: '',
            employeeDoj: '',
            dateOfRetirement: '',
            employeeOfficeName: '',
            empDateOfNextIncrement: '',
            employeePayBand: '',
            employeePayBandValue: '',
            employeeGradePay: '',
            npaValue: '',
        });
    }

    /**
     * convert the date object in the dd/MM/yyyy format
     * @param date Date object
     */
    convertDate(date) {
        if (date !== 0 && date !== null && date !== undefined && date !== '') {
            const datePipe = new DatePipe('en-US');
            return datePipe.transform(date, 'dd/MM/yyyy');
        } else {
            return '';
        }
    }

    /**
     * hide and show the employee information for the expansion panel
     */
    emplyeeeDataList() {
        this.showDataEmployee = !this.showDataEmployee;
    }

    /**
     * To save or submit the Rop events
     * @param saveAction Action 'submit'
     */
    saveRopDetails(saveAction) {
        const self = this,
            formData = this.ropForm.getRawValue();
        const dataToSend = {};

        if (saveAction === 'submit') {
            _.each(this.ropForm.controls, function (control) {
                if (control.status === 'INVALID') {
                    control.markAsTouched({ onlySelf: true });
                }
            });

            if (!this.ropForm.valid) {
                return false;
            }
        }
        dataToSend['auditorRemarks'] = formData.auditorRemarks;
        if (this.isPvuApprover) {
            dataToSend['classTwoRemarks'] = formData.approverRemarks;
        }
        dataToSend['auditorReturnReason'] = formData.recommendationFor;
        dataToSend['empId'] = this.empId;
        dataToSend['id'] = this.eventId;
        const reasonArray = [];
        if (formData.returnReason) {
            formData.returnReason.forEach(reasonObj => {
                if (reasonObj) {
                    reasonArray.push({
                        'reasonId': reasonObj,
                        'remarks': reasonObj === 116 ? formData.otherReason : ''
                    });
                }
            });
        }
        if (reasonArray && reasonArray.length !== 0) {
            dataToSend['returnReasons'] = reasonArray;
        }
        if (this.userInfo['wfRoleId'] && this.userInfo['wfRoleId'].length > 0) {
            dataToSend['wfRoleId'] = this.userInfo['wfRoleId'][0];
        } else if (this.userInfo['wfRoleId']) {
            dataToSend['wfRoleId'] = this.userInfo['wfRoleId'];
        }

        this.ropService.updateRemarks(dataToSend).subscribe(res => {
            if (res['status'] === 200 && res['result']) {
                self.toastr.success(res['message']);
                if (saveAction === 'submit') {
                    self.openWfPopup();
                }
            } else {
                self.toastr.error(res['message']);
            }
        }, err => {
            self.toastr.error(err);
        });
    }

    /**
     * To open the workflow popup
     */
    openWfPopup() {
        console.log('return', this.isReturn);
        console.log('authz', this.isAuthZ);
        if (this.ropTypeList) {
            const ropData = this.ropTypeList.filter(obj => {
                return obj.lookupInfoId === this.ropForm.get('ropType').value;
            })[0];
            const dialogRef = this.dialog.open(RopWfComponent, {
                width: '2700px',
                height: '600px',
                data: {
                    'empId': this.empId,
                    'officeId': this.officeId,
                    'eventId': this.eventId,
                    'heading': ropData.lookupInfoName,
                    'isAuditor': this.isAuditor,
                    'isPvuApprover': this.isPvuApprover,
                    'pvuReturnOfficeId': this.pvuReturnOfficeId,
                    'isReturn': this.isReturn,
                    'isAuthZ': this.isAuthZ
                }
            });

            dialogRef.afterClosed().subscribe(result => {
                if (result === 'yes') {
                    if (this.action === 'edit') {
                        if (this.isAuditor) {
                            this.router.navigate(['/dashboard/pvu/rop/auditor-list'], { skipLocationChange: true });
                        } else if (this.isPvuApprover) {
                            this.router.navigate(['/dashboard/pvu/rop/approver-list'], { skipLocationChange: true });
                        }
                    }
                }
            });
        }
    }

    /**
     * To display the workflow history comments
     */
    viewComments() {
        if (this.ropTypeList) {
            const ropData = this.ropTypeList.filter(obj => {
                return obj.lookupInfoId === this.ropForm.get('ropType').value;
            })[0];
            const dialogRef = this.dialog.open(RopCommentsComponent, {
                width: '2700px',
                height: '600px',
                data: {
                    'empId': this.empId,
                    'officeId': this.officeId,
                    'eventId': this.eventId,
                    'heading': ropData.lookupInfoName
                }
            });

            dialogRef.afterClosed().subscribe(result => {
                if (result === 'yes') {
                    // close logic
                }
            });
        }
    }

    /**
     * Navigate to the dashboard
     */
    goToDashboard() {
        if (!this.dialogOpen) {
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                width: '360px',
                data: pvuMessage.CLOSE
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result === 'yes') {
                    this.router.navigate(['/dashboard'], { skipLocationChange: true });
                }
            });
        } else {
            this.dialog.closeAll();
        }
    }

    /**
     * Navigate to the listing screen
     */
    goToListing() {
        if (this.isAuditor) {
            this.router.navigate(['/dashboard/pvu/rop/auditor-list'], { skipLocationChange: true });
        } else if (this.isPvuApprover) {
            this.router.navigate(['/dashboard/pvu/rop/approver-list'], { skipLocationChange: true });
        }
    }

    /**
     * To reset the forms
     */
    resetForm() {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: pvuMessage.RESET
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                if (this.eventId) {
                    this.loadRopEventData(this.eventId);
                } else {
                    this.ropForm.reset();
                }
            }
        });
    }

    openEventHistoryDialog() {
        const width: string = String(window.innerWidth) + 'px';
        const height = String(window.innerHeight) + 'px';
        this.employeeCreationPopUpServiceService.empID = this.empId;
        this.dialog.open(EmployeeCreationComponent, {
            minWidth: width,
            maxWidth: width,
            height: height
        });
    }

}
