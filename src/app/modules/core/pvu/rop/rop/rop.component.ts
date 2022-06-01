import { RopAttachmentComponent } from './../rop-attachment/rop-attachment.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
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
import { RouteService } from 'src/app/shared/services/route.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'app-rop',
    templateUrl: './rop.component.html',
    styleUrls: ['./rop.component.css']
})
export class RopComponent implements OnInit {
    subscribeParams;
    action: string;
    tabDisable: boolean = true;
    selectedIndex: number;
    containers = [];
    ropForm: FormGroup;
    reasonData: any;
    ropConfig;
    ropTypeList = [];
    reasonForChangeList = [];
    returnReasonList = [];
    dataSource: MatTableDataSource<any>;

    ropCtrl: FormControl = new FormControl();
    reasonForChangeCtrl: FormControl = new FormControl();
    returnReasonCtrl: FormControl = new FormControl();
    date: Date = new Date();
    minDateOfNextInc: Date = new Date();
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
    classTwoRemaks: string;

    revGradePay: number;
    revPayBand: number;
    revPayBandValue: number;
    revPayLevel: number;
    revCellId: number;
    autoSixValidBasic: number;
    autoSixValidPayValue: number;
    autoSixValidFlag: number;
    isOtherReturnReason: boolean = false;
    empId: number;
    eventId: number;
    trnNo: string;
    trnDate: string;
    officeId: number;
    showDataEmployee: boolean = false;
    showSeventhPayCommField = false;
    showSixthPayCommField = false;
    isReturn: boolean = false;
    dataSelected = [];

    postData: any;
    isReasonForChangeVisible: boolean;
    remarksVisible: boolean;
    maxDate = new Date();
    eventMinDate = new Date();

    @ViewChild('attachmentTab', { static: true }) attachmentTab: RopAttachmentComponent;
    // attachmentTab;
    attachmentData = {
        moduleName: APIConst.ROP.ROP_PREFIX,
    };
    eventData: any;
    isViewCommentsVisible: boolean = false;
    isCreator: boolean = false;
    isVerifier: boolean = false;
    isApprover: boolean = false;
    isRework: boolean = false;
    isNonEditable: boolean = false;
    wfRoleCodeArray: string[] = [];
    isPrintEnable: boolean = false;
    isApproved: boolean = false;
    officeName: string = '';
    oldEmployeeNumber: string;
    headerJSON: any[] = [];
    wfRoleIds;
    menuId;
    linkMenuId;
    postId;
    userId;
    lkPoOffUserId;
    forwardDialog_history_list: any[] = [];
    lookupInfoName;
    disableEventOrder = false;
    wfRoleCode: string;
    recomandCtrl: FormControl = new FormControl();
    recommendationFlag: boolean = false;
    displayedColumns: string[] = ['serialNo', 'reasonName'];

    constructor(
        private fb: FormBuilder,
        private toastr: ToastrService,
        public dialog: MatDialog,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private ropService: ROPService,
        private routeService: RouteService
    ) { }

    ngOnInit() {
        this.errorMessage = pvuMessage;
        this.createForm();
        this.containers.push(this.containers.length);

        this.subscribeParams = this.activatedRoute.params.subscribe(resRoute => {
            this.action = resRoute.action;
            if (this.action && this.action === 'edit' || this.action === 'view') {
                this.eventId = +resRoute.id;
                if (this.eventId) {
                    this.getCurrentUserInfo();
                } else {
                    this.router.navigate(['../new'], { relativeTo: this.activatedRoute, skipLocationChange: true });
                }
            } else {
                this.getCurrentUserInfo();
                this.getRopConfiguration();
            }
        });

    }

    /**
     * To get the current user info
     */
    getCurrentUserInfo() {

        this.ropService.getCurrentUserDetail().then(res => {
            if (res) {
                this.wfRoleCode = res['wfRoleCode'];
                this.wfRoleCodeArray = res['wfRoleCodeArray'];
                this.wfRoleIds = res['wfRoleId'];
                this.menuId = res['menuId'];
                this.linkMenuId = res['linkMenuId'];
                this.postId = res['postId'];
                this.userId = res['userId'];
                this.officeId = res['officeDetail']['officeId'];
                this.lkPoOffUserId = res['lkPoOffUserId'];
                this.ropForm.patchValue({
                    officeName: res['officeDetail']['officeName']
                });
                this.officeName = res['officeDetail']['officeName'];
                if (this.eventId) {
                    this.getRopTransactionWfRoleCode();
                }
            }
        });
    }

    getAction() {

        const ropData = this.ropTypeList.filter(obj => {
            return obj.lookupInfoId === this.ropForm.get('ropType').value;
        })[0];
        const data = {
            'empId': this.empId,
            'officeId': this.officeId,
            'eventId': this.eventId,
            'heading': ropData.lookupInfoName,
            'isAuditor': false,
            'isPvuApprover': false,
            'pvuReturnOfficeId': null
        };
        if (this.menuId &&
            this.wfRoleIds &&
            this.postId &&
            this.userId &&
            data.eventId &&
            data.officeId
        ) {
            const params = {
                'menuId': this.linkMenuId,
                'officeId': data.officeId,
                'postId': this.postId,
                'trnId': data.eventId,
                'userId': this.userId,
                'wfRoleIds': this.wfRoleIds,
                'lkPoOffUserId': this.lkPoOffUserId
            };
            this.ropService.getWorkFlowAssignmentOpt(params).subscribe((res) => {
                if (res && res['result'] && res['result'].length > 0) {
                    if (res['result'][0]['wfActionName'] === 'Pull Back') {
                        this.ropForm.controls.orderNumber.disable();
                    }
                }
            }, (err) => {
                this.toastr.error(err);
            });
        }
    }

    /**
     * To clear the employee details and post details and reset the variables on employee number change
     */
    clearEmployeeData() {
        if (this.oldEmployeeNumber !== this.ropForm.controls.empNumber.value) {
            if (this.ropForm.get('empName').value) {
                this.clearEmplDetail();
                this.clearPostDetails();
                this.curBasicPay = null;
                this.curGradePay = null;
                this.curPayBandId = null;
                this.curPayBandValue = null;
                this.designationId = null;
                this.empClassId = null;
                this.curScaleId = null;
                this.npaId = null;

                this.revGradePay = null;
                this.revPayBand = null;
                this.revPayBandValue = null;
                this.revPayLevel = null;
                this.revCellId = null;
                this.empId = null;
                this.oldEmployeeNumber = null;
            }
        }
    }

    /**
     * To create the ROP form group
     */
    createForm() {
        this.ropForm = this.fb.group({
            officeName: [''],
            orderNumber: ['', [Validators.required, Validators.maxLength(100)]],
            orderDate: ['', Validators.required],
            ropType: ['', Validators.required],
            effectiveDate: ['', Validators.required],
            empNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
            empName: [''],
            empClass: [''],
            empDesignation: [''],
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
            otherReason: [''],
            approverRemarks: ['']
        });
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
                // console.log('response', res);
                this.eventData = res['result'];
                this.setData(res['result']);
                this.classTwoRemaks = res['result']['classTwoRemarks'];
                // console.log(this.classTwoRemaks);
                this.loadReason();
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
        } else {
            this.remarksVisible = false;
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

        this.ropForm.patchValue({
            orderNumber: data.orderNo,
            orderDate: this.dateFormating(data.orderDate),
            ropType: data.ropType,
            effectiveDate: this.dateFormating(data.effectiveDate),
            empNumber: data.empNo,
            empName: data.empName,
            empClass: data.className,
            empDesignation: data.designationName,
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
        });

        this.eventMinDate = this.dateFormating(data.dateOfJoining);
        this.minDateOfNextInc = this.ropForm.get('effectiveDate').value;
        this.oldEmployeeNumber = data.empNo;

        this.curBasicPay = data.curBasicPay;
        this.curGradePay = data.curGradePay;
        this.curPayBandId = data.curPayBand;
        this.curPayBandValue = data.curPayBandValue;
        this.designationId = data.designationId;
        this.empClassId = data.classId;
        this.curScaleId = data.curScale;
        this.npaId = data.npa;

        this.revGradePay = data.revGradePay;
        this.revPayBand = data.revPayBand;
        this.revPayBandValue = data.revPayBandValue;
        this.revPayLevel = data.revPayLevel;
        this.revCellId = data.revCellId;
        this.empId = data.empId;

        this.autoSixValidBasic = data.autoSixValidBasic;
        this.autoSixValidPayValue = data.autoSixValidPayValue;
        this.autoSixValidFlag = data.autoSixValidFlag;

        if (this.empId && this.eventId) {
            this.isViewCommentsVisible = true;
        }

        if (this.wfRoleCode === DataConst.ROP.APPROVER_WF_ROLE_CODE) {
            this.isApprover = true;
        }

        if (data.printFlag === 1) {
            if (this.isApprover) {
                this.isPrintEnable = true;
            }
            this.isApproved = true;
        }
        if (this.action === 'view') {
            this.ropForm.disable();
        }
        if (this.wfRoleCodeArray[0] === '1002') {
            this.getAction();
        }
    }
    /**
     * To get the Look up master data
     */
    getRopLookup() {
        this.ropService.getRopLookUpInfoData('').subscribe((res) => {
            if (res && res['status'] === 200) {
                this.ropTypeList = res['result']['ROPType'];
                this.reasonForChangeList = res['result']['ReasonforChangeinEffectiveDate'];
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
     * To get the ROP Type configuration data
     */
    getRopConfiguration() {
        this.ropService.getRopConfiguration('').subscribe((res) => {
            if (res && res['status'] === 200) {
                this.ropConfig = res['result'];
                this.getRopLookup();
            } else {
                this.toastr.error(res['message']);
            }
        }, (err) => {
            this.toastr.error(err);
        });
    }

    /**
     * To get the workflow role code of the selected tranasaction
     */
    getRopTransactionWfRoleCode() {
        const param = {
            id: this.eventId
        };
        this.ropService.getRopTransactionWfRoleCode(param).subscribe((res) => {
            if (res && res['status'] === 200) {
                if (res['result'] === null || res['result'] === 'null') {
                    this.isCreator = true;
                } else if (res['result'] === DataConst.ROP.CREATOR_WF_ROLE_CODE) {
                    if (this.wfRoleCodeArray.indexOf(res['result']) !== -1) {
                        this.isRework = true;
                    }
                } else if (res['result'] === DataConst.ROP.VERIFIER_WF_ROLE_CODE) {
                    if (this.wfRoleCodeArray.indexOf(res['result']) !== -1) {
                        this.isVerifier = true;
                    }
                } else if (res['result'] === DataConst.ROP.APPROVER_WF_ROLE_CODE) {
                    if (this.wfRoleCodeArray.indexOf(res['result']) !== -1) {
                        this.isApprover = true;
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
     * Show hide the fields based on the ROP Type selection change
     */
    ropTypeChange() {
        const revisionFormValue = this.ropForm.getRawValue();
        this.showSixthPayCommField = false;
        this.showSeventhPayCommField = false;
        switch (revisionFormValue.ropType) {
            case 412:   // ROP - 2009
                this.showSixthPayCommField = true;
                break;
            case 413:   // ROP - 2016
                this.showSeventhPayCommField = true;
        }

        const ropType = this.ropForm.controls.ropType.value;
        this.ropForm.controls.empNumber.setValue('');
        this.clearEmplDetail(); // To clear the employee details field
        this.clearPostDetails(); // To clear the post details field
        if (ropType) {
            if (this.ropConfig) {
                const configData = this.ropConfig.filter(confObj => {
                    return confObj.ropType === ropType;
                })[0];
                if (configData && configData['effectiveDate']) {
                    this.ropForm.controls.effectiveDate.setValue(this.dateFormating(configData['effectiveDate']));
                    this.eventMinDate = this.dateFormating(configData['effectiveDate']);
                    this.minDateOfNextInc = this.ropForm.get('effectiveDate').value;
                } else {
                    this.ropForm.controls.effectiveDate.setValue('');
                }
            }
        }
    }

    /**
     * On Employee Number Keyup
     * @param event for the keyup events
     */
    onEmployeeKeyUp(event: KeyboardEvent) {
        const self = this;
        this.clearEmployeeData();
        if (event['keyCode'] === 13 || event['keyCode'] === 9) { // For the Enter - 13, Tab - 9
            event.preventDefault();
            event.stopPropagation();
            self.validateEmp();
        }
    }

    /**
     * To validate the employee number (employee number is allowed for the ROP or not?)
     */
    validateEmp() {
        if (this.ropForm.get('empNumber').value && this.ropForm.get('empNumber').value.length === 10) {
            const self = this,
                effectiveDate: Date = this.ropForm.controls.effectiveDate.value,
                param = {
                    'empNo': Number(self.ropForm.get('empNumber').value),
                    'effectiveDate': '0',
                    'ropType': self.ropForm.get('ropType').value
                };
            if (effectiveDate) {
                param['effectiveDate'] = this.formatDate(effectiveDate);
            }
            self.ropService.validateEmployee(param).subscribe(res => {
                if (res['status'] === 200 && res['result']) {
                    // if (res['result'] && res['result']['isValid']) {
                    self.getEmployeeDetail();
                    // } else {
                    //     self.clearEmplDetail();
                    // self.toastr.error(res['message']);
                    // }
                } else {
                    self.clearEmplDetail();
                    self.toastr.error(res['message']);
                }
            }, err => {
                self.clearEmplDetail();
                self.toastr.error(err);
            });
        }
    }

    /**
     * To get the employee number
     */
    getEmployeeDetail() {
        const self = this,
            effectiveDate: Date = this.ropForm.controls.effectiveDate.value,
            dataToSend = {
                'empNo': Number(self.ropForm.get('empNumber').value),
                'effectiveDate': '0',
                'ropType': Number(self.ropForm.get('ropType').value)
            };
        if (effectiveDate) {
            dataToSend['effectiveDate'] = this.formatDate(effectiveDate);
        }
        this.ropService.getEmployeeDetails(dataToSend).subscribe(res => {
            if (res['status'] === 200 && res['result']) {
                self.employeeDetails = _.cloneDeep(res['result']);
                self.setEmployeeInfo();
                self.empId = Number(self.employeeDetails.employeeId);
            } else {
                self.employeeDetails = null;
                self.postData = null;
                self.clearEmplDetail();
                self.clearPostDetails();
                self.toastr.error(res['message']);
            }
        }, err => {
            self.employeeDetails = null;
            self.postData = null;
            self.clearEmplDetail();
            self.clearPostDetails();
            self.toastr.error(err);
        });

    }

    /**
     * To get the employee post detail and set it
     */
    getPostDetails() {
        const self = this,
            formValue = self.ropForm.value,
            param = {
                'basicPay': Number(formValue.employeeBasicPay),
                'empNo': Number(formValue.empNumber),
                'effectiveDate': this.formatDate(formValue.effectiveDate),
                'gradePay': Number(this.employeeDetails.gradePayId),
                'nextIncrementDate': this.formatDate(this.employeeDetails.dateNxtIncr),
                'payBand': Number(this.employeeDetails.payBandId),
                'payBandValue': Number(this.employeeDetails.payBandValue),
                'payScale': Number(this.curScaleId),
                'ropType': formValue.ropType
            };
        this.ropService.getPostDetails(param).subscribe(res => {
            if (res['status'] === 200 && res['result']) {
                self.postData = res['result'];
                if (this.showSeventhPayCommField) {
                    this.ropForm.patchValue({
                        'payLevel': this.postData['payLevel'],
                        'cellId': this.postData['payCellValue'],
                        'basicPay': this.postData['basicPay'],
                        'postEffectiveDate': this.convertDate(this.ropForm.get('effectiveDate').value),
                        'dateOfNextIncrement': this.dateFormating(this.postData['nextIncrementDate']),
                    });
                } else if (this.showSixthPayCommField) {
                    this.ropForm.patchValue({
                        'payBand': this.postData['payBand'],
                        'payBandValue': this.postData['payBandValue'],
                        'gradePay': this.postData['gradePay'],
                        'basicPay': this.postData['basicPay'],
                        'postEffectiveDate': this.convertDate(this.ropForm.get('effectiveDate').value),
                        'dateOfNextIncrement': this.dateFormating(this.postData['nextIncrementDate']),
                    });
                }
                this.revGradePay = this.postData.gradePayId;
                this.revPayBand = this.postData.payBandId;
                this.revPayBandValue = this.postData.payBandValue;
                this.revPayLevel = Number(this.postData.payLevelId);
                this.revCellId = this.postData.payCellId;
                this.autoSixValidBasic = this.postData.autoSixValidBasic;
                this.autoSixValidPayValue = this.postData.autoSixValidPayValue;
                this.autoSixValidFlag = this.postData.autoSixValidFlag;
            } else {
                self.clearPostDetails();
                self.toastr.error(res['message']);
            }
        }, err => {
            self.clearPostDetails();
            self.toastr.error(err);
        });
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
     * To set Employee data
     */
    setEmployeeInfo() {
        this.ropForm.patchValue({
            empNumber: this.employeeDetails.employeeNo,
            empName: this.employeeDetails.employeeName,
            empClass: this.employeeDetails.employeeClass,
            empDesignation: this.employeeDetails.designationName,
            empPayScale: this.employeeDetails.payScaleName,
            employeeBasicPay: this.employeeDetails.empBasicPay,
            employeeDoj: this.convertDate(this.employeeDetails.dateJoining),
            dateOfRetirement: this.convertDate(this.employeeDetails.retirementDate),
            employeeOfficeName: this.employeeDetails.officeName,
            empDateOfNextIncrement: this.showSeventhPayCommField ?
                this.convertDate(this.employeeDetails.dateNxtIncr) : '',
            employeePayBand: this.employeeDetails.payBandName,
            employeePayBandValue: this.employeeDetails.payBandValue,
            employeeGradePay: this.employeeDetails.gradePayName,
            npaValue: this.employeeDetails.npaValue,
        });
        // this.eventMinDate = this.dateFormating(this.employeeDetails.dateJoining);
        this.oldEmployeeNumber = this.employeeDetails.employeeNo;

        this.curBasicPay = this.employeeDetails.empBasicPay;
        this.curGradePay = this.employeeDetails.gradePayId;
        this.curPayBandId = this.employeeDetails.payBandId;
        this.curPayBandValue = this.employeeDetails.payBandValue;
        this.empClassId = this.employeeDetails.classId;
        this.designationId = this.employeeDetails.designationId;
        this.curScaleId = this.employeeDetails.payScale;
        this.npaId = this.employeeDetails.npa;
        this.getPostDetails();
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
     * To show the Reason for change In effective date as well as set and reset the validation
     */
    effectiveDateChange() {
        const effDate = this.ropForm.get('effectiveDate').value;
        const ropType = this.ropForm.get('ropType').value;
        this.minDateOfNextInc = this.ropForm.get('effectiveDate').value;
        if (ropType && this.ropConfig && this.ropConfig.length > 0) {
            if (this.postData) {
                this.postData = null;
                this.clearPostDetails();
                this.getPostDetails();
            }
            const selectedRop = this.ropConfig.filter(confObj => {
                return confObj.ropType === ropType;
            })[0];
            if (selectedRop && selectedRop['effectiveDate']) {
                if (effDate.toString() === this.dateFormating(selectedRop['effectiveDate']).toString()) {
                    this.isReasonForChangeVisible = false;
                    this.remarksVisible = false;
                    this.ropForm.controls.reasonForChangeEffectiveDate.setValue('');
                    this.ropForm.controls.reasonForChangeEffectiveDate.clearValidators();
                    this.ropForm.controls.reasonForChangeEffectiveDate.updateValueAndValidity();
                } else {
                    this.isReasonForChangeVisible = true;
                    this.ropForm.controls.reasonForChangeEffectiveDate.setValue('');
                    this.ropForm.controls.reasonForChangeEffectiveDate.setValidators(Validators.required);
                    this.ropForm.controls.reasonForChangeEffectiveDate.updateValueAndValidity();
                }
            }
        }
    }

    /**
     * hide and show the employee information for the expansion panel
     */
    emplyeeeDataList() {
        this.showDataEmployee = !this.showDataEmployee;
    }

    /**
     * To Open the dialog box for search employee
     */
    openDialogEmployeeNumber() {
        if (!this.ropForm.controls.empNumber.value) {
            const dialogRef = this.dialog.open(RopSearchEmployeeComponent, {
                width: '800px',
            }),
                self = this;

            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    self.ropForm.patchValue({
                        empNumber: '' + result.employeeNo
                    });
                    this.ropForm.updateValueAndValidity();
                    self.empId = Number(result.employeeId);
                    self.validateEmp();
                }
            });
        } else {
            this.validateEmp();
        }
    }

    /**
     * To get the selected tab index
     * @param tabIndex selected tab index
     */
    getTabIndex(tabIndex) {
        this.selectedIndex = tabIndex;
    }

    /**
     * To save or submit the Rop events
     * @param saveAction Action either 'save' or 'submit'
     */
    saveRopDetails(saveAction) {
        const self = this,
            formData = this.ropForm.getRawValue();
        const dataToSend = {};

        if (saveAction === 'save') {
            if (!formData.ropType || !formData.empNumber || !formData.orderNumber || !formData.orderDate) {
                _.each(this.ropForm.controls, function (saveControl) {
                    if (saveControl.status === 'INVALID') {
                        saveControl.markAsTouched({ onlySelf: true });
                    }
                });
                return false;
            }
            dataToSend['formAction'] = 'DRAFT';
        } else if (saveAction === 'submit') {
            _.each(this.ropForm.controls, function (submitControl) {
                if (submitControl.status === 'INVALID') {
                    submitControl.markAsTouched({ onlySelf: true });
                }
            });
            if (this.showSixthPayCommField) {
                if (formData.payBand === null || formData.payBand === ''
                    || formData.payBandValue === null || formData.payBandValue === ''
                    || formData.gradePay === null || formData.gradePay === ''
                    || formData.basicPay === null || formData.basicPay === ''
                    || formData.postEffectiveDate === null || formData.postEffectiveDate === ''
                    || formData.dateOfNextIncrement === null || formData.dateOfNextIncrement === '') {
                    this.toastr.error(this.errorMessage.ERR_POST_DETAILS);
                    return false;
                }
            } else if (this.showSeventhPayCommField) {
                if (formData.payLevel === null || formData.payLevel === ''
                    || formData.cellId === null || formData.cellId === ''
                    || formData.basicPay === null || formData.basicPay === ''
                    || formData.postEffectiveDate === null || formData.postEffectiveDate === ''
                    || formData.dateOfNextIncrement === null || formData.dateOfNextIncrement === '') {
                    this.toastr.error(this.errorMessage.ERR_POST_DETAILS);
                    return false;
                }
            }
            if (!this.ropForm.valid) {
                return false;
            }
            if (this.attachmentTab && !this.attachmentTab.checkForMandatory()) {
                this.toastr.error(this.errorMessage.ERR_MAND_ATTACHMENT);
                this.selectedIndex = 1;
                return false;
            }
            if (!this.ropForm.get('empName').value) {
                this.toastr.error(this.errorMessage.ERR_EMP_DETAILS);
                return false;
            }
            dataToSend['formAction'] = 'SUBMITTED';
        }
        dataToSend['officeId'] = this.officeId;
        dataToSend['orderNo'] = formData.orderNumber;
        dataToSend['orderDate'] = this.formatDate(formData.orderDate);
        dataToSend['empId'] = this.empId;
        dataToSend['empNo'] = Number(formData.empNumber);
        dataToSend['ropType'] = formData.ropType;
        dataToSend['curBasicPay'] = Number(this.curBasicPay) && Number(this.curBasicPay) !== 0 ?
            Number(this.curBasicPay) : null;
        dataToSend['curGradePay'] = Number(this.curGradePay) && Number(this.curGradePay) !== 0 ?
            Number(this.curGradePay) : null;
        dataToSend['curPayBand'] = Number(this.curPayBandId) && Number(this.curPayBandId) !== 0 ?
            Number(this.curPayBandId) : null;
        dataToSend['curPayBandValue'] = Number(this.curPayBandValue) && Number(this.curPayBandValue) !== 0 ?
            Number(this.curPayBandValue) : null;
        dataToSend['classId'] = Number(this.empClassId) && Number(this.empClassId) !== 0 ?
            Number(this.empClassId) : null;
        dataToSend['curScale'] = Number(this.curScaleId) && Number(this.curScaleId) !== 0 ?
            Number(this.curScaleId) : null;
        dataToSend['designationId'] = Number(this.designationId) && Number(this.designationId) !== 0 ?
            Number(this.designationId) : null;
        dataToSend['npa'] = Number(this.npaId) && Number(this.npaId) !== 0 ? Number(this.npaId) : null;
        dataToSend['effectiveDate'] = this.formatDate(formData.effectiveDate);
        dataToSend['curNextIncrementDate'] = this.showSeventhPayCommField ?
            this.formatDate(formData.empDateOfNextIncrement) : null;
        dataToSend['revBasicPay'] = Number(formData.basicPay) && Number(formData.basicPay) !== 0 ?
            Number(formData.basicPay) : null;
        dataToSend['revNextIncrementDate'] = this.formatDate(formData.dateOfNextIncrement);
        dataToSend['ropChangeEffDate'] = (formData.reasonForChangeEffectiveDate &&
            formData.reasonForChangeEffectiveDate !== '') ? formData.reasonForChangeEffectiveDate : null;
        dataToSend['remarks'] = formData.remarks;
        dataToSend['autoSixValidBasic'] = this.autoSixValidBasic ? this.autoSixValidBasic : 0;
        dataToSend['autoSixValidPayValue'] = this.autoSixValidPayValue ? this.autoSixValidPayValue : 0;
        dataToSend['autoSixValidFlag'] = this.autoSixValidFlag ? this.autoSixValidFlag : 0;
        if (this.showSixthPayCommField) {
            dataToSend['revGradePay'] = this.revGradePay ? this.revGradePay : null;
            dataToSend['revPayBand'] = this.revPayBand ? this.revPayBand : null;
            dataToSend['revPayBandValue'] = this.revPayBandValue ? this.revPayBandValue : null;
        } else if (this.showSeventhPayCommField) {
            dataToSend['revPayLevel'] = this.revPayLevel ? this.revPayLevel : null;
            dataToSend['revCellId'] = this.revCellId ? this.revCellId : null;
        }
        if (this.trnNo) {
            dataToSend['trnNo'] = this.trnNo;
        }
        if (this.eventId) {
            dataToSend['id'] = this.eventId;
        }

        this.ropService.createROP(dataToSend).subscribe(res => {
            if (res['status'] === 200 && res['result']) {
                self.toastr.success(res['message']);
                this.eventId = res['result']['id'];
                this.isViewCommentsVisible = true;
                this.trnNo = res['result']['trnNo'];
                this.trnDate = res['result']['createdDate'];
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
                    'isAuditor': false,
                    'isPvuApprover': false,
                    'pvuReturnOfficeId': null,
                    'passAction': true
                }
            });

            dialogRef.afterClosed().subscribe(result => {
                if (result && result['action']) {
                    if (this.action === 'edit') {
                        if (result['actionName'] && result['actionName'] ===  DataConst.ROP.WF_APPROVE_CODE
                        && this.isApprover && !this.isPrintEnable) {
                            this.ddoCertificate(1);
                        } else {
                            this.router.navigate(['/dashboard/pvu/rop'], { skipLocationChange: true });
                        }
                    } else {
                        this.router.navigate(['/dashboard'], { skipLocationChange: true });
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
     * Navigate to the dashboard
     */
    print() {
        const self = this;
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '360px',
            data: pvuMessage.CLOSE
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                const effectiveDate: Date = this.ropForm.controls.effectiveDate.value;
                const params = {
                    'basicPay': Number(this.curBasicPay) ? Number(this.curBasicPay) : 0,
                    'effectiveDate': '0',
                    'empId': this.empId,
                    'employeeNo': Number(self.ropForm.get('empNumber').value),
                    'gradePay': Number(this.curGradePay) ? Number(this.curGradePay) : 0,
                    'payBand': Number(this.curPayBandId) ? Number(this.curPayBandId) : 0,
                    'payBandValue': Number(this.curPayBandValue) ? Number(this.curPayBandValue) : 0,
                    'payScaleId': Number(this.curScaleId) ? Number(this.curScaleId) : 0,
                    'ropType': Number(self.ropForm.get('ropType').value)
                };
                if (effectiveDate) {
                    params['effectiveDate'] = this.formatDate(effectiveDate);
                }
                this.ropService.printAnnexure(params).subscribe(res => {
                    if (res) {
                        const file = res['result'];
                        const docType = 'application/pdf';
                        const byteArray = new Uint8Array(atob(file).split('').map(char => char.charCodeAt(0)));
                        const blob = new Blob([byteArray], { type: docType });
                        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                            window.navigator.msSaveOrOpenBlob(blob);
                        } else {
                            const url = window.URL.createObjectURL(blob);
                            window.open(url, '_blank');
                        }
                    }
                }, err => {
                    self.toastr.error(err);
                });
            }
        });
    }

    /**
     * @method ddoCertificate
     * @description print ddo certificate by passing event id as parameter
     */
    ddoCertificate(trigger = null) {
        if (this.eventId) {
            const params = {
                'id' : this.eventId
            };
            this.ropService.printDdoCertificate(params).subscribe(res => {
                if (res) {
                    const file = res['result'];
                    const docType = 'application/pdf';
                    const byteArray = new Uint8Array(atob(file).split('').map(char => char.charCodeAt(0)));
                    const blob = new Blob([byteArray], { type: docType });
                    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                        window.navigator.msSaveOrOpenBlob(blob);
                    } else {
                        const url = window.URL.createObjectURL(blob);
                        window.open(url, '_blank');
                    }
                }
                if (trigger) {
                    this.router.navigate(['/dashboard/pvu/rop'], { skipLocationChange: true });
                }
            }, err => {
                this.toastr.error(err);
                if (trigger) {
                    this.router.navigate(['/dashboard/pvu/rop'], { skipLocationChange: true });
                }
            });
        }
    }

    /**
     * Navigate to the listing screen
     */
    goToListing() {
        this.router.navigate(['/dashboard/pvu/rop'], { skipLocationChange: true });
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
                    this.ropForm.controls.officeName.setValue(this.officeName);
                }
            }
        });
    }

    loadReason() {
        const param = {
            'id': this.eventId
        };
        this.ropService.getRopReasonData(param).subscribe((res) => {
            if (res && res['status'] === 200 && res['result']) {
                this.reasonData = res['result'];
                // console.log(this.reasonData);
                const returnReason = [];
                let otherReason = '';
                this.reasonData.forEach(reasonObj => {
                    if (reasonObj && reasonObj.reasonId) {
                        returnReason.push({
                            'reasonId': reasonObj.reasonId,
                            'reasonName': reasonObj.reasonName
                        });
                        if (reasonObj.reasonId === 116) {
                            otherReason = reasonObj.remarks;
                            this.isOtherReturnReason = true;
                        }
                    }
                });
                if (returnReason.length > 0) {
                    this.recommendationFlag = true;
                    this.isReturn = true;
                    this.ropForm.patchValue({
                        otherReason: otherReason,
                        approverRemarks: this.classTwoRemaks
                    });
                    this.setReason(returnReason);
                }

            } else {
                this.toastr.error(res['message']);
            }
        }, (err) => {
            this.toastr.error(err);
        });

    }

    setReason(returnReason) {
        // console.log(returnReason, ' ret reason');
        if (!returnReason) {
            this.dataSource = new MatTableDataSource<any>([]);
        } else {
            this.dataSource = new MatTableDataSource<any>(returnReason);
        }
    }
}
