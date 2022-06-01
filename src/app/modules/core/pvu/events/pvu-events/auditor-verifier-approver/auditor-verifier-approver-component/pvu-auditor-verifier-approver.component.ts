import { ForwardDialogPVUComponent } from './../../../../pvu-common/forward-dialog-pvu/forward-dialog-pvu.component';
import { ViewCommentsComponent } from './../../../../pvu-common/view-comments/view-comments.component';
import { PvuCommonService } from './../../../../pvu-common/services/pvu-common.service';
import { PVUWorkflowService } from './../../services/pvu-workflow.service';
import { COMMON_APIS, COMMON_MESSAGES } from './../../../../pvu-common/index';
import { EVENT_APIS, EVENT_ERRORS, EVENT_CONST_DATA } from './../../index';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { pvuMessage } from 'src/app/shared/constants/pvu/pvu-message.constants';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { DatePipe } from '@angular/common';
import { EmployeeCreationComponent } from '../../../../employee-creation/employee-creation.component';
import { EmployeeCreationPopUpServiceService } from 'src/app/modules/pvu/pvu-common/employee-creation-pop-up-service.service';
import { PVUEventsService } from '../../services/pvu-event.service';

@Component({
    selector: 'app-pvu-auditor-verifier-approver',
    templateUrl: './pvu-auditor-verifier-approver.component.html',
    styleUrls: ['./pvu-auditor-verifier-approver.component.css']
})
export class PVUAuditorVerifierApproverComponent implements OnInit {
    isVerifierRemarks = false;
    subscribeParams;
    action: string;
    pvuEventForm: FormGroup;
    eventType: string;
    eventTypeList = [];
    reasonForChangeList = [];
    recommendationList = [];
    returnReasonList = [];
    isTabDisabled = true;
    reasonForChangeCtrl: FormControl = new FormControl();
    recomandCtrl: FormControl = new FormControl();
    returnReasonCtrl: FormControl = new FormControl();
    date: Date = new Date();
    errorMessage = EVENT_ERRORS;
    employeeDetails;
    postDetail;
    eventDataLabelValue;
    currentDetails;
    steppingUpJnr;
    eventDetails;
    higherPayDates;
    higherPayPromotionDetails;
    empId: number;
    eventId: number;
    trnNo: string;
    trnDate: string;
    officeId: number;
    showDataEmployee: boolean = false;
    showSeventhPayCommField = false;
    showSixthPayCommField = false;
    displayedAry: string[] = [];
    canApproverDecide = false;
    displayedBrowseColumns = [
        'sr_no', 'attachmentType', 'fileName', 'browse', 'uploadedFileName', 'uploadedBy', 'action'
    ];

    postData: any;
    isApproverRemarks = false;
    isApproverClassIRemarks = false;
    remarksVisible: boolean;
    maxDate = new Date();
    eventMinDate = new Date();
    displayedColumns: string[] = ['serialNo', 'reasonName'];
    dataSource: MatTableDataSource<any>;
    attachmentData = {
        moduleName: EVENT_APIS.ATTACHMENT_PREFIX.Higher_Pay_Scale,
    };
    eventData: any = {};
    reasonData: any;
    isViewCommentsVisible: boolean = false;
    isAuditor: boolean = false;
    isPvuApprover: boolean = false;
    isPvuApproverClassI: boolean = false;
    isPvuVerifier: boolean = false;
    wfRoleCodeArray: string[] = [];
    isReturn: boolean = false;
    isNonEditable: boolean = false;
    isOtherReturnReason: boolean = false;
    userInfo;
    pvuReturnOfficeId: number = null;
    valid_Reason: any[];
    isAuthZ: boolean;
    trnId: number;
    isJudiciaryDepartment: boolean = false;
    isOptionAvailed = false;
    displayedColumnsData = [];
    tableData: any = {};
    dataSourceforCommision = new MatTableDataSource();
    constructor(
        private fb: FormBuilder,
        private toastr: ToastrService,
        public dialog: MatDialog,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private pvuCommonService: PvuCommonService,
        private pvuWorkflowService: PVUWorkflowService,
        private pvuEventService: PVUEventsService,
        private employeeCreationPopUpServiceService: EmployeeCreationPopUpServiceService
    ) { }

    ngOnInit() {
        this.createForm();

        this.subscribeParams = this.activatedRoute.params.subscribe(resRoute => {
            this.action = resRoute.action;
            if (this.action && this.action === 'edit' || this.action === 'view') {
                this.trnId = +resRoute.id;
                if (this.trnId) {
                    this.eventType = resRoute.eventType;
                    this.attachmentData['moduleName'] = EVENT_APIS.ATTACHMENT_PREFIX[this.eventType];
                    this.setEventId();
                    // this.getPVUEventConfiguration();
                    this.getCurrentUserInfo();
                } else {
                    this.router.navigate(['/dashboard'], { skipLocationChange: true });
                }
                if (this.action === 'view') {
                    if (this.activatedRoute.snapshot.url[0].path === 'auditor') {
                        this.isAuditor = true;
                    } else if (this.activatedRoute.snapshot.url[0].path === 'verifier') {
                        this.isPvuVerifier = true;
                    } else if (this.activatedRoute.snapshot.url[0].path === 'approver') {
                        this.isPvuApprover = true;
                    }
                }
            } else {
                this.router.navigate(['/dashboard'], { skipLocationChange: true });
            }
        });
    }

    checkForDate(data) {
        if (!isNaN(data)) {
            return false;
        } else if ((data.match(/-/g) || []).length !== 2) {
            return false;
        }
        const dateCheck: any = new Date(data);
        if (this.isValidDate(dateCheck) && (data.indexOf('-') !== -1)) {
            return true;
        }
        return false;
    }

    isValidDate(d) {
        return !isNaN(d) && d instanceof Date;
    }

    getDate(date) {
        date = new Date(date);
        if (date !== 0 && date !== null && date !== undefined && date !== '') {
            const datePipe = new DatePipe('en-US');
            return datePipe.transform(date, 'dd/MM/yyyy');
        } else {
            return '';
        }
    }

    /**
     * To get the current user info
     */
    getCurrentUserInfo() {
        this.pvuCommonService.getCurrentUserDetail().then(res => {
            if (res) {
                this.userInfo = res;
                this.officeId = res['officeDetail']['officeId'];
                this.wfRoleCodeArray = res['wfRoleCodeArray'];
                this.pvuEventForm.patchValue({
                    officeName: res['officeDetail']['officeName']
                });
                if (this.trnId) {
                    this.getPVUEventTransactionWfRoleCode();
                }
            }
        });
    }

    /**
     * To create the PVU Event form group
     */
    createForm() {
        this.pvuEventForm = this.fb.group({
            reasonForChangeEffectiveDate: [''],
            remarks: [''],
            recommendationFor: ['', Validators.required],
            returnReason: [[]],
            otherReason: [''],
            auditorRemarks: [''],
            verifierRemarks: [''],
            approverRemarks: [''],
            approverClassIRemarks: ['']
        });
    }

    get fc() {
        return this.pvuEventForm.controls;
    }

    /**
     * To get the PVU Event event data
     */
    loadPVUEventLabelData() {
        const param = {
            'id': this.trnId
        };
        if (this.eventType) {
            this.pvuWorkflowService.getPVUEventData(param, this.eventType).subscribe((res) => {
                if (res && res['status'] === 200 && res['result']) {
                    this.eventDataLabelValue = _.cloneDeep(res['result']);
                    if (this.eventDataLabelValue.postDetails) {
                        this.postDetail = _.cloneDeep(this.eventDataLabelValue.postDetails);
                    }
                    if (this.eventDataLabelValue.currentDetails) {
                        this.currentDetails = _.cloneDeep(this.eventDataLabelValue.currentDetails);
                        if (this.postDetail && (!this.postDetail.tikuType && !this.postDetail.casType
                            && !this.postDetail.hpScaleType) &&
                            this.currentDetails.departmentCategoryId &&
                            (this.currentDetails.departmentCategoryId === 17 )) {
                                this.isJudiciaryDepartment = true;
                        } else {
                            this.isJudiciaryDepartment = false;
                        }
                    }
                    if (this.eventDataLabelValue.steppingUpJnr) {
                        this.steppingUpJnr = _.cloneDeep(this.eventDataLabelValue.steppingUpJnr);
                    }
                    if (this.eventDataLabelValue.promotion) {
                        this.higherPayPromotionDetails =
                            _.cloneDeep(this.eventDataLabelValue.higherPayPromotionDetails);
                        for (const fieldKey in this.higherPayPromotionDetails) {
                            if (this.checkForDate(this.higherPayPromotionDetails[fieldKey])) {
                                this.higherPayPromotionDetails[fieldKey] =
                                    this.getDate(this.higherPayPromotionDetails[fieldKey]);
                            }
                        }
                    }
                    if (this.eventDataLabelValue.higherPayDate) {
                        this.higherPayDates = _.cloneDeep(this.eventDataLabelValue.higherPayDates);
                        for (const fieldKey in this.higherPayDates) {
                            if (this.checkForDate(this.higherPayDates[fieldKey])) {
                                this.higherPayDates[fieldKey] = this.getDate(this.higherPayDates[fieldKey]);
                            }
                        }
                    }

                    for (const fieldKey in this.postDetail) {
                        if (this.checkForDate(this.postDetail[fieldKey])) {
                            this.postDetail[fieldKey] = this.getDate(this.postDetail[fieldKey]);
                        }
                    }
                    for (const fieldKey in this.currentDetails) {
                        if (this.checkForDate(this.currentDetails[fieldKey])) {
                            this.currentDetails[fieldKey] = this.getDate(this.currentDetails[fieldKey]);
                        }
                    }
                    for (const fieldKey in this.steppingUpJnr) {
                        if (this.checkForDate(this.steppingUpJnr[fieldKey])) {
                            this.steppingUpJnr[fieldKey] = this.getDate(this.steppingUpJnr[fieldKey]);
                        }
                    }
                    if (this.isPvuApprover) {
                        this.checkForDecision();
                    } else if (this.isPvuApproverClassI) {
                        this.canApproverDecide = true;
                    }
                } else {
                    this.toastr.error(res['message']);
                }
            }, (err) => {
                this.toastr.error(err);
            });
        }
    }

    /**
     * To get the PVU Event event data
     */
    loadPVUEventData() {
        const param = {
            'id': this.trnId
        };
        if (this.eventType) {
            this.pvuEventService.getEventDetails(param, this.eventType).subscribe((res) => {
                if (res && res['status'] === 200 && res['result']) {
                    this.eventData = _.cloneDeep(res['result']);
                    this.empId = this.eventData.employeeId;
                    this.isTabDisabled = false;
                    this.loadPVUEventLabelData();
                    this.getOptionAvaildViewDetails(res['result']);
                } else {
                    this.eventData = {};
                    this.toastr.error(res['message']);
                }
                this.setData();
            }, (err) => {
                this.eventData = {};
                this.setData();
                this.toastr.error(err);
            });
        }
    }

    checkForDecision() {
        if (this.eventData.eventCode !== EVENT_CONST_DATA.ASSURED_CARREER_PROGRESSION) {
            if (this.eventData && this.eventDataLabelValue && this.eventDataLabelValue.postDetails) {
                switch (this.eventData.payCommId) {
                    case 150:
                        // if (payLevel.name.includes('8500') && payLevel.name.includes('14050')) {
                        //     currentPayScale = index;
                        // }
                        let scaleValues;
                        if (this.eventDataLabelValue.postDetails.scaleId) {
                            scaleValues = this.eventDataLabelValue.postDetails.scaleId.split('-');
                        } else if (this.eventDataLabelValue.postDetails.payScale) {
                            scaleValues = this.eventDataLabelValue.postDetails.payScale.split('-');
                        }
                        if (scaleValues) {
                            if ((Number(scaleValues[0]) < 8000)) {
                                this.canApproverDecide = true;
                            } else {
                                this.canApproverDecide = false;
                            }
                        } else {
                            this.canApproverDecide = false;
                        }
                        break;
                    case 151:
                        if (Number(this.eventDataLabelValue.postDetails.gradePayId) < 5400) {
                            this.canApproverDecide = true;
                        } else {
                            this.canApproverDecide = false;
                        }
                        break;
                    case 152:
                        if (Number(this.eventDataLabelValue.postDetails.payLevelId) < 9) {
                            this.canApproverDecide = true;
                        } else if (this.eventDataLabelValue.postDetails.payLevelId.includes('IS')) {
                            this.canApproverDecide = true;
                        } else {
                            this.canApproverDecide = false;
                        }
                        break;
                }
            }
        } else {
            this.canApproverDecide = false;
        }
    }

    /**
     * Set the Event data to forms
     */
    setData() {
        let data = this.eventData;
        if (!data) {
            data = {};
        }
        this.trnNo = data.trnNo;
        this.trnDate = data.refDate;

        if (data.classTwoRemarks !== null && data.classTwoRemarks !== '') {
            this.isApproverRemarks = true;
        }

        if (data.verifierRemarks !== null && data.verifierRemarks !== '') {
            this.isVerifierRemarks = true;
        }

        if (data.classOneRemarks !== null && data.classOneRemarks !== '') {
            this.isApproverClassIRemarks = true;
        }

        this.pvuEventForm.patchValue({
            remarks: data.remarks,
            auditorRemarks: data.auditorRemarks,
            verifierRemarks: data.verifierRemarks,
            approverRemarks: data.classTwoRemarks,
            approverClassIRemarks: data.classOneRemarks,
            recommendationFor: data.auditorReturnReason,
        });

        this.recommendationChange();
        this.reasonChangeSelection();
        this.loadReason();
        this.pvuReturnOfficeId = data.officeId;
        this.eventMinDate = this.dateFormating(data.dateOfJoining);

        if (this.empId && this.trnId) {
            this.isViewCommentsVisible = true;
        }

        if (this.action === 'view') {
            this.pvuEventForm.disable();
        }
    }

    /**
     * To load the reason list in dropdown list
     */
    loadReason() {
        const param = {
            'id': this.trnId
        };
        this.pvuWorkflowService.getPVUEventReasonData(param, this.eventType).subscribe((res) => {
            if (res && res['status'] === 200 && res['result']) {
                this.reasonData = res['result'];
                const returnReason = [];
                let otherReason = '';
                this.reasonData.forEach(reasonObj => {
                    if (reasonObj && reasonObj.reasonId) {
                        returnReason.push(reasonObj.reasonId);
                        if (reasonObj.reasonId === 115) {
                            otherReason = reasonObj.remarks;
                        }
                    }
                });
                if (returnReason) {
                    this.pvuEventForm.patchValue({
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
    getPVUEventLookup() {
        this.pvuWorkflowService.getPVUEventLookUpInfoData().subscribe((res) => {
            if (res && res['status'] === 200) {
                this.eventTypeList = res['result']['pvuEvents'];
                this.reasonForChangeList = res['result']['ReasonforChangeinEffectiveDate'];
                this.recommendationList = res['result']['Recommendation For'];
                if (this.trnId) {
                    this.loadPVUEventData();
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
        this.pvuWorkflowService.getReturnReasonList().subscribe((res) => {
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
     * To get the Transaction currebt workflow status
     */
    getPVUEventTransactionWfRoleCode() {
        const param = {
            id: this.trnId
        };
        if (this.eventType) {
            this.pvuWorkflowService.getPVUEventTransactionWfRoleCode(param, this.eventType).subscribe((res) => {
                if (res && res['status'] === 200) {
                    if (res['result'] === COMMON_APIS.WORKFLOW.CODES.AUDITOR_WF_ROLE_CODE) {
                        if (this.wfRoleCodeArray.indexOf(res['result']) !== -1) {
                            this.isAuditor = true;
                        }
                    } else if (res['result'] === COMMON_APIS.WORKFLOW.CODES.PVU_VERIFIER_WF_ROLE_CODE) {
                        if (this.wfRoleCodeArray.indexOf(res['result']) !== -1) {
                            this.isPvuVerifier = true;
                        }
                    } else if (res['result'] === COMMON_APIS.WORKFLOW.CODES.PVU_APPROVER_WF_ROLE_CODE) {
                        if (this.wfRoleCodeArray.indexOf(res['result']) !== -1) {
                            this.isPvuApprover = true;
                        }
                    } else if (res['result'] === COMMON_APIS.WORKFLOW.CODES.PVU_APPROVER_CLASS_1_WF_ROLE_CODE) {
                        if (this.wfRoleCodeArray.indexOf(res['result']) !== -1) {
                            this.isPvuApproverClassI = true;
                        }
                    } else {
                        this.isNonEditable = true;
                    }
                    this.getPVUEventLookup();
                    this.getReasonList();
                } else {
                    this.toastr.error(res['message']);
                }
            }, (err) => {
                this.toastr.error(err);
            });
        }
    }

    /**
     * On Recommendation For selection change, show/hide the reason dropdown
     * // 420 is id for Return Option
     */
    recommendationChange() {
        if (this.pvuEventForm.get('recommendationFor').value === 420) {
            this.isReturn = true;
            this.isAuthZ = false;
            this.isOtherReturnReason = false;
            this.pvuEventForm.controls.returnReason.setValidators(Validators.required);
            this.pvuEventForm.controls.returnReason.updateValueAndValidity();
            this.loadReason();
            if (this.isAuditor) {
                this.pvuEventForm.controls.auditorRemarks.setValidators(
                    [Validators.required, Validators.maxLength(10000)]);
                this.pvuEventForm.controls.auditorRemarks.updateValueAndValidity();
            }
            if (this.isPvuVerifier) {
                this.pvuEventForm.controls.verifierRemarks.setValidators(
                    [Validators.required, Validators.maxLength(10000)]);
                this.pvuEventForm.controls.verifierRemarks.updateValueAndValidity();
            }
            if (this.isPvuApprover) {
                this.pvuEventForm.controls.approverRemarks.setValidators(
                    [Validators.required, Validators.maxLength(10000)]);
                this.pvuEventForm.controls.approverRemarks.updateValueAndValidity();
            }
            if (this.isPvuApproverClassI) {
                this.pvuEventForm.controls.approverClassIRemarks.setValidators(
                    [Validators.required, Validators.maxLength(10000)]);
                this.pvuEventForm.controls.approverClassIRemarks.updateValueAndValidity();
            }
        } else {
            this.isReturn = false;
            this.isAuthZ = true;
            this.pvuEventForm.controls.returnReason.setValue([]);
            this.pvuEventForm.controls.returnReason.clearValidators();
            this.pvuEventForm.controls.returnReason.markAsUntouched();
            this.pvuEventForm.controls.returnReason.updateValueAndValidity();
            this.pvuEventForm.controls.otherReason.setValue([]);
            this.pvuEventForm.controls.otherReason.clearValidators();
            this.pvuEventForm.controls.otherReason.markAsUntouched();
            this.pvuEventForm.controls.otherReason.updateValueAndValidity();
            this.reasonChangeSelection();
            if (this.isAuditor) {
                this.pvuEventForm.controls.auditorRemarks.clearValidators();
                this.pvuEventForm.controls.auditorRemarks.markAsUntouched();
                this.pvuEventForm.controls.auditorRemarks.updateValueAndValidity();
            }
            if (this.isPvuVerifier) {
                this.pvuEventForm.controls.verifierRemarks.clearValidators();
                this.pvuEventForm.controls.verifierRemarks.markAsUntouched();
                this.pvuEventForm.controls.verifierRemarks.updateValueAndValidity();
            }
            if (this.isPvuApprover) {
                this.pvuEventForm.controls.approverRemarks.clearValidators();
                this.pvuEventForm.controls.approverRemarks.markAsUntouched();
                this.pvuEventForm.controls.approverRemarks.updateValueAndValidity();
            }
            if (this.isPvuApproverClassI) {
                this.pvuEventForm.controls.approverClassIRemarks.clearValidators();
                this.pvuEventForm.controls.approverClassIRemarks.markAsUntouched();
                this.pvuEventForm.controls.approverClassIRemarks.updateValueAndValidity();
            }
        }
    }

    /**
     * On Reason Selection change update the selected reason list and show/hide the Other Reason field
     * 116 is id for the Other Reason option
     */
    reasonChangeSelection() {
        const dataSelected = [];
        const selectedArray = this.pvuEventForm.get('returnReason').value;
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
            if (selectedArray.indexOf(115) !== -1) {
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
        if (this.isAuthZ) {
            this.isOtherReturnReason = false;
        }

        if (this.pvuEventForm.get('recommendationFor').value !== 420) {
            this.dataSource = new MatTableDataSource([]);
        }
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
     * @method formatDate
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
     * @method convertDate
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
     * To save or submit the PVUEvent events
     * @param saveAction Action 'submit'
     */
    savePVUEventDetails(saveAction) {
        const self = this,
            formData = this.pvuEventForm.getRawValue(),
            dataToSend = {};
        if (saveAction === 'submit') {
            _.each(this.pvuEventForm.controls, function (control) {
                if (control.status === 'INVALID') {
                    control.markAsTouched({ onlySelf: true });
                }
            });

            if (!this.pvuEventForm.valid) {
                self.toastr.error(EVENT_ERRORS.MANDATORY_FIELDS);
                return false;
            }
        }
        dataToSend['auditorRemarks'] = formData.auditorRemarks;
        if (this.isPvuApprover) {
            dataToSend['classTwoRemarks'] = formData.approverRemarks;
        }
        if (this.isPvuApproverClassI) {
            dataToSend['classOneRemarks'] = formData.approverClassIRemarks;
        }
        if (this.isPvuVerifier) {
            dataToSend['verifierRemarks'] = formData.verifierRemarks;
        }
        dataToSend['auditorReturnReason'] = formData.recommendationFor;
        dataToSend['empId'] = this.empId;
        dataToSend['id'] = this.trnId;
        const reasonArray = [];
        if (formData.returnReason) {
            formData.returnReason.forEach(reasonObj => {
                if (reasonObj) {
                    reasonArray.push({
                        'reasonId': reasonObj,
                        'remarks': reasonObj === 115 ? formData.otherReason : ''
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

        this.pvuWorkflowService.updateRemarks(dataToSend, this.eventType).subscribe(res => {
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

    setEventId() {
        const event = this.eventTypeList.filter(eventObj => {
            return eventObj.code === this.eventType;
        })[0];
        if (event) {
            this.eventId = event.id;
        }
    }

    /**
     * To open the workflow popup
     */
    openWfPopup() {
        this.setEventId();
        const self = this,
            params = {
                'trnNo': self.trnNo,
                'initiationDate': self.trnDate,
                'trnId': self.trnId,
                // 'lkPoOffUserId': self.lkPoOffUserId,
                'event': self.eventType,
                'eventId': self.eventId,
                'empId': self.empId,
                'isAuditor': this.isAuditor,
                'isPvuVerifier': this.isPvuVerifier,
                'isPvuApprover': this.isPvuApprover,
                'isPvuApproverClassI': this.isPvuApproverClassI,
                'canDecide': this.canApproverDecide,
                'pvuReturnOfficeId': this.pvuReturnOfficeId,
                'isReturn': this.isReturn,
                'isAuthZ': this.isAuthZ,
                'remarksLabel': COMMON_MESSAGES.VIEW_PVU_REMARKS_LABEL
            },
            eventNameObj = this.eventTypeList.filter(event => {
                return event.code === self.eventType;
            });
        if (eventNameObj) {
            params['eventName'] = eventNameObj[0].name;
        }
        const dialogRef = this.dialog.open(ForwardDialogPVUComponent, {
            width: '2700px',
            height: '600px',
            data: params
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                if (this.isAuditor) {
                    this.router.navigate(['/dashboard/pvu/pvu-events/auditor-list', this.eventType],
                        { skipLocationChange: true });
                } else if (this.isPvuVerifier) {
                    this.router.navigate(['/dashboard/pvu/pvu-events/verifier-list', this.eventType],
                        { skipLocationChange: true });
                } else if (this.isPvuApprover || this.isPvuApproverClassI) {
                    this.router.navigate(['/dashboard/pvu/pvu-events/approver-list', this.eventType],
                        { skipLocationChange: true });
                }
            }
            // Kept for future
            // else if (result === 'no') {
            // }
        });
    }

    /**
     * To display the workflow history comments
     */
    viewComments() {
        if (this.trnId && this.empId) {
            const event = this.eventTypeList.filter(eventObj => {
                return eventObj.code === this.eventType;
            })[0];
            let eventId;
            if (event) {
                eventId = event.id;
            }
            // Kept for future purpose if required
            // const dialogRef = this.dialog.open(ViewCommentsComponent, {
            this.dialog.open(ViewCommentsComponent, {
                width: '2700px',
                height: '600px',
                data: {
                    'empId': this.empId,
                    'trnId': this.trnId,
                    'event': 'PVU',
                    'isPVU': true,
                    'eventId': eventId,
                    'trnNo': this.trnNo,
                    'initiationDate': this.trnDate,
                    'remarksLabel': COMMON_MESSAGES.VIEW_PVU_REMARKS_LABEL
                }
            });
            // Kept for future purpose if required to check Yes clicked or No clicked
            // dialogRef.afterClosed().subscribe(result => {
            // });
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
                this.router.navigate(['/dashboard'], { skipLocationChange: true });
            }
        });
    }

    /**
     * Navigate to the listing screen
     */
    goToListing() {
        if (this.isAuditor) {
            this.router.navigate(['/dashboard/pvu/pvu-events/auditor-list', this.eventType],
                { skipLocationChange: true });
        } else if (this.isPvuVerifier) {
            this.router.navigate(['/dashboard/pvu/pvu-events/verifier-list', this.eventType],
                { skipLocationChange: true });
        } else if (this.isPvuApprover || this.isPvuApproverClassI) {
            this.router.navigate(['/dashboard/pvu/pvu-events/approver-list', this.eventType],
                { skipLocationChange: true });
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
                if (this.trnId) {
                    this.loadPVUEventData();
                } else {
                    this.pvuEventForm.reset();
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


    getOptionAvaildViewDetails(data) {
        this.tableData = data;
        if ((this.eventType ===  EVENT_CONST_DATA.HIGHER_PAY_SCALE || this.eventType ===  EVENT_CONST_DATA.TIKU_PAY
            || this.eventType ===  EVENT_CONST_DATA.CARREER_ADVANCEMENT_SCHEME ) && data['optionAvailableId'] === 2) {
            this.isOptionAvailed = true;
            if (Number(data['payCommId']) === 150) {
                this.displayedColumnsData = [];
                this.displayedColumnsData.push('PayAsonIncrementDate', 'PayScale', 'Basic');
                this.dataSourceforCommision = new MatTableDataSource([{
                    ...data,
                    PayAsonIncrementDate: data['optionAvailableDate'],
                    payScale: data['scaleName']
                }]);
            } else if (Number(data['payCommId']) === 151) {
                this.displayedColumnsData = [];
                this.displayedColumnsData.push('PayAsonIncrementDate', 'PayBand', 'PayBandValue', 'GradePay', 'Basic');
                this.dataSourceforCommision = new MatTableDataSource([{
                    PayAsonIncrementDate: data['optionAvailableDate'],
                    payBand: data.payBandName,
                    gradePay: data.gradePayName,
                    ...data
                }]);
            } else {
                this.displayedColumnsData = [];
                this.displayedColumnsData.push('PayAsonIncrementDate', 'payLevel', 'cellId', 'Basic');
                this.dataSourceforCommision = new MatTableDataSource([{
                    ...data,
                    PayAsonIncrementDate: data['optionAvailableDate'],
                    payLevel: data.payLevelName,
                    cellId: data.oaCellIdValue,
                }]);

            }
        }
    }
}
