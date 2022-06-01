import { PVUWorkflowService } from './../services/pvu-workflow.service';
import { RouteService } from 'src/app/shared/services/route.service';
import { ShettyPayComponent } from './../shetty-pay/shetty-pay.component';
import { SeniorScaleComponent } from './../../../pvu-common/senior-scale/senior-scale.component';
import { ChangeOfScaleComponent } from './../../../pvu-common/change-of-scale/change-of-scale.component';
import { SelectionGradeComponent } from './../selection-grade/selection-grade.component';
import { SteppingUpComponent } from './../stepping-up/stepping-up.component';
import { AssuredProgressionComponent } from './../assured-career-progression/assured-career-progression.component';
import { TikuPayComponent } from './../tiku-pay/tiku-pay.component';
import { HigherPayScaleComponent } from './../higher-pay-scale/higher-pay-scale.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ViewCommentsComponent } from './../../../pvu-common/view-comments/view-comments.component';
import { PVUEventsService } from './../services/pvu-event.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ResetClearDialogEventComponent } from './reset-clear-dialog.component';
import { EVENT_ERRORS, EVENT_APIS, EVENT_CONST_DATA } from './../index';
import { StorageService } from './../../../../../../shared/services/storage.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, Validators, FormControl, FormGroup, FormArray, NgForm } from '@angular/forms';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy, Input } from '@angular/core';
import * as _ from 'lodash';
import { CareerAdvancementSchemeComponent } from '../career-advancement-scheme/career-advancement-scheme.component';
import { ForwardDialogPVUComponent } from '../../../pvu-common/forward-dialog-pvu/forward-dialog-pvu.component';
import { AttachmentPvuComponent } from '../../../pvu-common/attachment-pvu/attachment-pvu.component';
import { COMMON_APIS } from '../../../pvu-common';
@Component({
    selector: 'app-pvu-event',
    templateUrl: './pvu-event.component.html',
    styleUrls: ['./pvu-event.component.css']
})
export class PVUEventComponent implements OnInit, OnDestroy {
    todayDate = new Date();
    eventMinDate = new Date(1996, 0, 1);
    selectedIndex: number = 0;
    payCommissionList = [];
    payCommissionCtrl: FormControl = new FormControl();
    errorMessage = EVENT_ERRORS;
    transactionNumber: string;
    transactionDate: Date;
    eventDetails: any;
    eventForm: FormGroup;
    userInfo: any;
    eventType: string;
    userOffice: any;
    submitted = false;
    transactionId: number;
    action: string = 'new';
    subscribeParams: Subscription[] = [];
    empId: number;
    promotionTypeCtrl: FormControl = new FormControl();
    promotionTypeList = [];
    eventCtrl: FormControl = new FormControl();
    eventList: any;
    lookUpData: any;
    showExamDetails: boolean = true;
    showPromotionType: boolean = false;
    subscriber: Subscription[] = [];
    eventId: number;
    @ViewChild('eventRef') eventRef;
    currentPost: any;
    lkPoOffUserId: any;
    dialogRef: any;
    isSubmitClick: boolean = false;
    statusId: number = 0;
    officeId: number;
    createdDate: Date;
    isTabDisabled = true;
    showSubmitButton = true;
    employeeDetails: any;
    employeeNoEvent: any;
    loader: boolean = false;
    @ViewChild('attachmentTab') attachmentTab: AttachmentPvuComponent;
    attachmentData = {
        moduleName: ''
    };
    displayedColumns: string[] = ['serialNo', 'reasonName'];
    dataSource: MatTableDataSource<any>;
    employeeDetail;
    eventWorkFlow: string = 'PVU';
    showHighPayType: boolean = false;
    showSeniorScaleType: boolean = false;
    showCASType: boolean = false;
    showSelectionGradeType: boolean = false;
    showACPType: boolean = false;
    showTikuType: boolean = false;
    showShettyType: boolean = false;
    showSteppingType: boolean = false;
    showChangeScaleType: boolean = false;
    defaultPayCommList = [];
    hpScaleForCtrl: FormControl = new FormControl();
    hpScaleForList = [];
    hpScaleTypeCtrl: FormControl = new FormControl();
    hpScaleTypeList = [];
    acpTypeCtrl: FormControl = new FormControl();
    acpTypeList = [];
    tikuTypeCtrl: FormControl = new FormControl();
    tikuPayTypeList = [];
    casTypeCtrl: FormControl = new FormControl();
    casTypeList = [];
    stepuptypectrl: FormControl = new FormControl();
    stepuptypeList = [];
    lookupData;
    pvuScreen: boolean = false;
    otherReason: string;
    isOtherReturnReason: boolean = false;
    approverRemarks: string;
    approverRemarksPresent: boolean = false;
    recommendationFlag: boolean = false;
    reasonData: any;
    returnReasonList = [];
    isApprover: boolean = false;
    isCreator: boolean = false;
    isRework: boolean = false;
    isVerifier: boolean = false;
    isNonEditable: boolean = false;
    constructor(
        private fb: FormBuilder,
        private storageService: StorageService,
        private toastr: ToastrService,
        private activatedRoute: ActivatedRoute,
        private eventService: PVUEventsService,
        private router: Router,
        private dialog: MatDialog,
        private routeService: RouteService,
        private pvuWfService: PVUWorkflowService
    ) { }

    /**
     * @method ngOnInit
     * @description Call when component is load and initialize the view and load data
     */
    ngOnInit() {
        const userOffice = this.storageService.get('currentUser');
        if (userOffice && userOffice['post'][0]['loginPost'] !== undefined) {
            this.currentPost = userOffice['post'].filter((item) => item['loginPost'] === true);
        }
        this.lkPoOffUserId = this.currentPost[0]['lkPoOffUserId'];
        const self = this;
        self.userInfo = self.storageService.get('currentUser');
        self.userOffice = self.storageService.get('userOffice');
        self.officeId = self.userOffice.officeId;
        self.createEventForm();
        self.getAllCommission();
        self.getPVUEvents();
        self.subscribeParams.push(self.activatedRoute.params.subscribe(resRoute => {
            self.action = resRoute.action;
            self.eventType = resRoute.event;
            if (self.action === 'view') {
                self.submitted = true;
                self.showSubmitButton = false;
            }
            if (self.action === 'edit' || self.action === 'view') {
                self.transactionId = +resRoute.id;
                if (self.transactionId) {
                    self.getEventDetail();
                    if (self.action === 'view') {
                        self.submitted = true;
                    }
                }
            }
        }));
    }

    /**
     * @method getPVUEvents
     * @description Function to get all PVU events
     */
    getPVUEvents() {
        const self = this;
        self.eventService.getPVUEvents().subscribe(res => {
            if (res['status'] === 200 && res['result']) {
                self.eventList = res['result'];
                if (self.action === 'new') {
                    self.eventForm.get('eventCode').patchValue(self.eventList[0].eventCode);
                    self.eventType = self.eventList[0].eventCode;
                    self.attachmentData.moduleName = EVENT_APIS.ATTACHMENT_PREFIX[self.eventType];
                    self.onEventChange();
                }
            } else {
                self.toastr.error(res['message']);
            }
        }, err => {
            self.toastr.error(err);
        });
    }

    /**
     * @method onEventChange
     * @description Function is called when event is changed
     */
    onEventChange() {
        const self = this;
        self.eventType = self.eventForm.get('eventCode').value;
        // self.eventForm.removeControl('employeeForm');
        // self.eventForm.removeControl('postForm');
        this.showHighPayType = false;
        this.showSeniorScaleType = false;
        this.showCASType = false;
        this.showSelectionGradeType = false;
        this.showACPType = false;
        this.showTikuType = false;
        this.showShettyType = false;
        this.showSteppingType = false;
        this.showChangeScaleType = false;
        this.eventForm.removeControl('hpScaleFor');
        this.eventForm.removeControl('hpScaleType');
        this.eventForm.removeControl('acpType');
        this.eventForm.removeControl('tikuType');
        self.eventForm.removeControl('casType');
        this.eventForm.removeControl('steppingUpTypeId');
        this.payCommissionList = _.cloneDeep(this.defaultPayCommList);
        if (this.action === 'new') {
            this.onPayCommissionChange();
        }
        if (this.eventList && this.eventList.length > 0) {
            const event = self.eventList.filter(eventI => {
                return eventI.eventCode === self.eventType;
            });
            if (event && event[0]) {
                self.eventId = event[0].id;
            }
        }
        switch (self.eventType) {
            case EVENT_CONST_DATA.HIGHER_PAY_SCALE:
                this.showHighPayType = true;
                this.eventForm.addControl('hpScaleFor', new FormControl(Validators.required));
                this.eventForm.addControl('hpScaleType', new FormControl(Validators.required));
                this.eventRef = this.eventRef as HigherPayScaleComponent;
                break;
            case EVENT_CONST_DATA.TIKU_PAY:
                this.showTikuType = true;
                this.eventForm.addControl('tikuType', new FormControl(Validators.required));
                this.eventRef = this.eventRef as TikuPayComponent;
                break;
            case EVENT_CONST_DATA.ASSURED_CARREER_PROGRESSION:
                this.showACPType = true;
                this.eventForm.addControl('acpType', new FormControl(Validators.required));
                this.eventRef = this.eventRef as AssuredProgressionComponent;
                this.payCommissionList = this.defaultPayCommList.filter(payComm => {
                    return Number(payComm.lookupInfoId) !== 152;
                });
                if (this.eventForm.get('payCommId').value === 152) {
                    this.eventForm.get('payCommId').patchValue(151);
                }
                break;
            case EVENT_CONST_DATA.STEPPING_UP:
                this.showSteppingType = true;
                this.eventForm.addControl('steppingUpTypeId', new FormControl('', Validators.required));
                this.eventRef = this.eventRef as SteppingUpComponent;
                break;
            case EVENT_CONST_DATA.SELECTION_GRADE:
                this.showSelectionGradeType = true;
                this.eventRef = this.eventRef as SelectionGradeComponent;
                break;
            case EVENT_CONST_DATA.SENIOR_SCALE_PVU:
                this.showSeniorScaleType = true;
                this.eventRef = this.eventRef as SeniorScaleComponent;
                break;
            case EVENT_CONST_DATA.CARREER_ADVANCEMENT_SCHEME:
                this.showCASType = true;
                this.eventForm.addControl('casType', new FormControl(Validators.required));
                this.eventRef = this.eventRef as CareerAdvancementSchemeComponent;
                break;
            case EVENT_CONST_DATA.SHETTY_PAY:
                this.showShettyType = true;
                this.eventRef = this.eventRef as ShettyPayComponent;
                this.payCommissionList = this.defaultPayCommList.filter(payComm => {
                    return Number(payComm.lookupInfoId) !== 152;
                });
                if (this.eventForm.get('payCommId').value === 152) {
                    this.eventForm.get('payCommId').patchValue(151);
                }
                this.eventMinDate = new Date(2003, 3, 1);
                this.todayDate = new Date(2015, 11, 31);
                break;
            case EVENT_CONST_DATA.CHANGE_OF_SCALE_PVU:
                this.showChangeScaleType = true;
                this.pvuScreen = true;
                this.eventRef = this.eventRef as ChangeOfScaleComponent;
                break;
        }
        if (!this.showSelectionGradeType && !this.showSeniorScaleType &&
            !this.showShettyType && !this.showChangeScaleType) {
            self.getLookupData();
        }
        self.attachmentData.moduleName = EVENT_APIS.ATTACHMENT_PREFIX[self.eventType];
        if (this.eventList && this.eventList.length > 0 && self.eventType) {
            const event = self.eventList.filter(eventI => {
                return eventI.eventCode === self.eventType;
            });
            if (event && event[0]) {
                self.eventId = event[0].id;
            }
        }
    }

    /**
     * @method onEffectiveDateChange
     * @description Function is called on effective date change and sets minimum date
     * @param event Changed effective date
     */
    onEffectiveDateChange(event) {
        if (this.eventForm.value.eventEffectiveDate instanceof Date) {
            const effDateYear = this.eventForm.value.eventEffectiveDate.getFullYear();
            if (effDateYear >= 2016) {
                this.eventForm.controls.payCommId.patchValue(152);
            } else if (effDateYear >= 2006 && effDateYear < 2016) {
                this.eventForm.controls.payCommId.patchValue(151);
            } else {
                this.eventForm.controls.payCommId.patchValue(150);
            }
            if (this.showACPType || this.showShettyType) {
                if (effDateYear >= 2006) {
                    this.eventForm.controls.payCommId.patchValue(151);
                } else {
                    this.eventForm.controls.payCommId.patchValue(150);
                }
            }
        }
    }

    /**
     * @method onPayCommissionValueChange
     * @description Function is called when pay commission is changed
     */
    onPayCommissionChange() {
        const payCommValue = this.eventForm.controls.payCommId.value;
        switch (payCommValue) {
            case 152:
                this.eventMinDate = new Date(2016, 0, 1);
                break;
            case 151:
                this.eventMinDate = new Date(2006, 0, 1);
                break;
            case 150:
                this.eventMinDate = new Date(1996, 0, 1);
                break;
        }
        if (this.employeeDetails && this.employeeDetails.employee) {
            let doj;
            if (this.employeeDetails.employee.dateJoining.indexOf(' ') !== -1) {
                doj = this.employeeDetails.employee.dateJoining.split(' ')[0].split('-');
                doj = new Date(doj[0], Number(doj[1]) - 1, doj[2]);
            } else if (this.employeeDetails.employee.dateJoining.indexOf('T') !== -1) {
                doj = this.employeeDetails.employee.dateJoining.split('T')[0].split('-');
                doj = new Date(doj[0], Number(doj[1]) - 1, doj[2]);
            }
            let dor;
            if (this.employeeDetails.employee.retirementDate.indexOf(' ') !== -1) {
                dor = this.employeeDetails.employee.retirementDate.split(' ')[0].split('-');
                dor = new Date(dor[0], Number(dor[1]) - 1, dor[2]);
            } else if (this.employeeDetails.employee.retirementDate.indexOf('T') !== -1) {
                dor = this.employeeDetails.employee.retirementDate.split('T')[0].split('-');
                dor = new Date(dor[0], Number(dor[1]) - 1, dor[2]);
            }
            if (doj > this.eventMinDate) {
                this.eventMinDate = doj;
            }
            if (dor < this.todayDate) {
                this.todayDate = dor;
            }
            if (this.showHighPayType) {
                if ((doj > new Date(2007, 6, 2))) {
                    const hpTypeList = _.cloneDeep(this.lookupData['Higher_Pay_Scale_For']);
                    this.hpScaleForList = hpTypeList.filter((hpType) => {
                        return hpType.lookupInfoId !== 330;
                    });
                } else {
                    this.hpScaleForList = _.cloneDeep(this.lookupData['Higher_Pay_Scale_For']);
                }
            }
            if (this.showShettyType) {
                if (doj < new Date('2003-04-01')) {
                    this.eventMinDate = new Date('2003-04-01');
                }
                if (dor > new Date('2015-12-31')) {
                    this.todayDate = new Date('2015-12-31');
                }
            }
        } else {
            this.todayDate = new Date();
        }
        if (this.eventForm.get('eventOrderDate') && this.eventForm.get('eventOrderDate').value) {
            this.eventForm.get('eventOrderDate').markAsTouched({ onlySelf: true });
        }
        if (this.eventForm.get('eventEffectiveDate') && this.eventForm.get('eventEffectiveDate').value) {
            this.eventForm.get('eventEffectiveDate').markAsTouched({ onlySelf: true });
        }
    }

    /**
     * @method getLookupData
     * @description Function is called to get Constants of PVU events from server
     */
    getLookupData() {
        const self = this;
        self.eventService.getLookUp(self.eventType).subscribe(res => {
            if (res['status'] === 200 && res['result']) {
                self.lookupData = res['result'];
                self.assignLookupData();
            } else {
                self.toastr.error(res['message']);
            }
        }, err => {
            self.toastr.error(err);
        });
    }

    /**
     * @method assignLookupData
     * @description Function is called to set Constants of PVU events get from server to respective dropdown
     */
    assignLookupData() {
        const self = this;
        switch (self.eventType) {
            case EVENT_CONST_DATA.HIGHER_PAY_SCALE:
                self.hpScaleForList = _.cloneDeep(self.lookupData['Higher_Pay_Scale_For']);
                self.hpScaleTypeList = _.cloneDeep(self.lookupData['Higher_Pay_Type']);
                break;
            case EVENT_CONST_DATA.TIKU_PAY:
                self.tikuPayTypeList = _.cloneDeep(self.lookupData['Tiku_Pay_Type']);
                break;
            case EVENT_CONST_DATA.ASSURED_CARREER_PROGRESSION:
                self.acpTypeList = _.cloneDeep(self.lookupData['Assured_Career_Progression_Type']);

                break;
            case EVENT_CONST_DATA.STEPPING_UP:
                self.stepuptypeList = _.cloneDeep(self.lookupData['SteppingUpEvent']);
                break;
            case EVENT_CONST_DATA.SELECTION_GRADE:
                break;
            case EVENT_CONST_DATA.SENIOR_SCALE_PVU:
                break;
            case EVENT_CONST_DATA.CARREER_ADVANCEMENT_SCHEME:
                self.casTypeList = _.cloneDeep(self.lookupData['CAS_Type']);
                break;
            case EVENT_CONST_DATA.SHETTY_PAY:
                break;
            case EVENT_CONST_DATA.CHANGE_OF_SCALE_PVU:
                break;
        }
    }

    /**
     * @method setEventSubTypeDetails
     * @description Function is called to set Sub event type
     */
    setEventSubTypeDetails() {
        const self = this;
        switch (self.eventType) {
            case EVENT_CONST_DATA.HIGHER_PAY_SCALE:
                self.eventForm.patchValue({
                    hpScaleFor: self.eventDetails.hpScaleFor,
                    hpScaleType: self.eventDetails.hpScaleType
                });
                break;
            case EVENT_CONST_DATA.TIKU_PAY:
                self.eventForm.patchValue({
                    tikuType: self.eventDetails.tikuType,
                });
                break;
            case EVENT_CONST_DATA.ASSURED_CARREER_PROGRESSION:
                self.eventForm.patchValue({
                    acpType: self.eventDetails.acpType
                });
                break;
            case EVENT_CONST_DATA.STEPPING_UP:
                self.eventForm.patchValue({
                    steppingUpTypeId: self.eventDetails.steppingUpTypeId
                });
                break;
            case EVENT_CONST_DATA.SELECTION_GRADE:
                break;
            case EVENT_CONST_DATA.SENIOR_SCALE_PVU:
                break;
            case EVENT_CONST_DATA.CARREER_ADVANCEMENT_SCHEME:
                self.eventForm.patchValue({
                    casType: self.eventDetails.casType
                });
                break;
            case EVENT_CONST_DATA.SHETTY_PAY:
                break;
            case EVENT_CONST_DATA.CHANGE_OF_SCALE_PVU:
                break;
        }
    }

    /**
     * @method onTabChange
     * @description Function is called on tab change
     */
    // Kept for future purpose
    onTabChange() { }

    /**
     * @method saveDetails
     * @description Function is called when save as draft is clicked and it further emits so event details can be saved
     */
    saveDetails(event?) {
        let self = this,
            dataToSend = _.cloneDeep(self.eventDetails) ? _.cloneDeep(self.eventDetails) : {},
            eventForm = self.eventForm.getRawValue();
        if (!eventForm.eventOrderNo || !eventForm.eventOrderDate
            || !eventForm.eventEffectiveDate || !eventForm.eventCode) {
            _.each(this.eventForm.controls, eventFormControl => {
                if (eventFormControl.status === 'INVALID') {
                    eventFormControl.markAsTouched({ onlySelf: true });
                }
            });
            if (!eventForm.eventCode) {
                this.eventForm.get('eventCode').markAsTouched({ onlySelf: true });
            }
            self.toastr.error(EVENT_ERRORS.MANDATORY_FIELDS);
        } else {
            if (self.eventForm) {
                for (const key in eventForm) {
                    if (key !== 'postForm' && key !== 'notionalForm' && key !== 'otherDetailsForm'
                        && key !== 'steppingUpJnr') {
                        if (eventForm[key] instanceof Date) {
                            const date: Date = eventForm[key],
                                month =
                                    (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1),
                                day = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
                            dataToSend[key] = '' + date.getFullYear() + '-' + month + '-' + day;
                        } else {
                            dataToSend[key] = eventForm[key];
                        }
                    } else if (key === 'postForm' || key === 'notionalForm' || key === 'otherDetailsForm') {
                        for (const empKey in eventForm[key]) {
                            if (empKey && !(eventForm[key][empKey] instanceof Date)) {
                                if (empKey === 'srSeniorNo' || empKey === 'jrSeniorNo') {
                                    dataToSend[empKey] = +eventForm[key][empKey];
                                } else {
                                    dataToSend[empKey] = eventForm[key][empKey];
                                }
                                if (empKey === 'isStpAvail') {
                                    dataToSend[empKey] = +eventForm[key][empKey] ? 2 : 1;
                                }
                            } else if (eventForm[key][empKey] instanceof Date) {
                                dataToSend[empKey] = eventForm[key][empKey];
                                const date: Date = dataToSend[empKey],
                                    month = (date.getMonth() + 1) < 10 ? '0' +
                                        (date.getMonth() + 1) : (date.getMonth() + 1),
                                    day = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
                                dataToSend[empKey] = '' + date.getFullYear() + '-' + month + '-' + day;
                            }
                        }
                    } else if (key === 'steppingUpJnr') {
                        if (this.isSubmitClick && !eventForm[key]['jrEmpId']) {
                            this.isSubmitClick = false;
                            self.toastr.error(EVENT_ERRORS.STEPPING_JNR_ERROR);
                            return;
                        }
                        dataToSend['jrEmpNo'] = eventForm[key].jrEmpNo;
                        dataToSend['jrEmpId'] = eventForm[key].jrEmpId;
                    }
                }
                if (dataToSend['optionAvailableId'] && dataToSend['optionAvailableId'] === 1) {
                    dataToSend['optionAvailableDate'] = null;
                }
                dataToSend['eventId'] = self.eventId;
                dataToSend['statusId'] = this.statusId;
                dataToSend['id'] = self.transactionId;
                dataToSend['trnNo'] = this.transactionNumber;
                dataToSend['employeeId'] = self.empId;

                if (this.employeeNoEvent) {
                    if (Number(self.employeeDetails.employee.employeeNo) !== Number(this.employeeNoEvent)) {
                        dataToSend['same'] = false;
                    }
                }
                dataToSend['officeId'] = self.officeId;
                dataToSend['cOfficeId'] = self.officeId;
                if (this.employeeDetails && this.employeeDetails.employee) {
                    dataToSend['employeeNo'] = self.employeeDetails.employee.employeeNo;
                    dataToSend['departmentCategoryId'] = this.employeeDetails.employee.departmentCategoryId;
                    dataToSend['currentDetailsEventId'] = this.employeeDetails.employee.currentDetailsEventId;
                } else {
                    dataToSend['employeeNo'] = null;
                    dataToSend['departmentCategoryId'] = null;
                    dataToSend['currentDetailsEventId'] = null;
                }
                if (this.employeeDetails && this.employeeDetails.employee) {
                    if (this.employeeDetails.employee.classId) {
                        dataToSend['cClassId'] = Number(this.employeeDetails.employee.classId);
                    }
                    if (this.employeeDetails.employee.designationId) {
                        dataToSend['cDesignationId'] = Number(this.employeeDetails.employee.designationId);
                    }
                    if (this.employeeDetails.employee.payLevelId) {
                        dataToSend['cPayLevelId'] = Number(this.employeeDetails.employee.payLevelId);
                    }
                    if (this.employeeDetails.employee.cellId) {
                        dataToSend['cCellId'] = Number(this.employeeDetails.employee.cellId);
                    }
                    if (this.employeeDetails.employee.empBasicPay) {
                        dataToSend['cBasicPay'] = Number(this.employeeDetails.employee.empBasicPay);
                    }
                    if (this.employeeDetails.employee.payBandId) {
                        dataToSend['cPayBandId'] = Number(this.employeeDetails.employee.payBandId);
                    }
                    if (this.employeeDetails.employee.payBandName) {
                        dataToSend['cPayBandIdValue'] = this.employeeDetails.employee.payBandName;
                    }
                    if (this.employeeDetails.employee.payBandValue) {
                        dataToSend['cPayBandValue'] = Number(this.employeeDetails.employee.payBandValue);
                    }
                    if (this.employeeDetails.employee.gradePayId) {
                        dataToSend['cGradePayId'] = Number(this.employeeDetails.employee.gradePayId);
                    }
                    if (this.employeeDetails.employee.payScale) {
                        dataToSend['cPayScaleId'] = Number(this.employeeDetails.employee.payScale);
                    }
                    if (this.employeeDetails.employee.retirementDate) {
                        // dataToSend['cDateOfRetiremnet'] = this.employeeDetails.employee.retirementDate;
                        dataToSend['cDateOfRetirement'] = new Date(this.employeeDetails.employee.retirementDate);
                        const date: Date = dataToSend['cDateOfRetirement'],
                            month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1),
                            day = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
                        dataToSend['cDateOfRetirement'] = '' + date.getFullYear() + '-' + month + '-' + day;
                    }
                    if (this.employeeDetails.employee.dateNxtIncr) {
                        // dataToSend['cDateOfNextIncrement'] = this.employeeDetails.employee.dateNxtIncr;
                        dataToSend['cDateOfNextIncrement'] = new Date(this.employeeDetails.employee.dateNxtIncr);
                        const date: Date = dataToSend['cDateOfNextIncrement'],
                            month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1),
                            day = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
                        dataToSend['cDateOfNextIncrement'] = '' + date.getFullYear() + '-' + month + '-' + day;
                    }
                    if (this.employeeDetails.employee.dateJoining) {
                        dataToSend['cDateOfJoining'] = new Date(this.employeeDetails.employee.dateJoining);
                        const date: Date = dataToSend['cDateOfJoining'],
                            month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1),
                            day = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
                        dataToSend['cDateOfJoining'] = '' + date.getFullYear() + '-' + month + '-' + day;
                    }
                    if (this.showTikuType) {
                        if (this.employeeDetails.employee.tikuPay1 &&
                            !(this.employeeDetails.employee.tikuPay1 instanceof Date)) {
                            dataToSend['tikuPay1'] = new Date(this.employeeDetails.employee.tikuPay1);
                            const date: Date = dataToSend['tikuPay1'],
                                month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) :
                                    (date.getMonth() + 1),
                                day = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
                            dataToSend['tikuPay1'] = '' + date.getFullYear() + '-' + month + '-' + day;
                        }
                        if (this.employeeDetails.employee.tikuPay2 &&
                            !(this.employeeDetails.employee.tikuPay2 instanceof Date)) {
                            dataToSend['tikuPay2'] = new Date(this.employeeDetails.employee.tikuPay2);
                            const date: Date = dataToSend['tikuPay2'],
                                month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) :
                                    (date.getMonth() + 1),
                                day = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
                            dataToSend['tikuPay2'] = '' + date.getFullYear() + '-' + month + '-' + day;
                        }
                    }
                }
                if (self.isSubmitClick) {
                    dataToSend['submit'] = true;
                }
                if (this.createdDate && this.action === 'new') {
                    dataToSend['createdDate'] = self.createdDate;
                }
                if (this.showSeniorScaleType || this.showChangeScaleType) {
                    dataToSend['eventId'] = self.eventId;
                }
            }

            if (dataToSend['eventCode'] === 'Higher_Pay_Scale' || dataToSend['eventCode'] === 'Tiku_Pay' || dataToSend['eventCode'] === 'Career_Advancement_Scheme') {
                if (this.eventRef && this.eventRef.optionAvailedData) {
                    dataToSend = { ...dataToSend, ...this.eventRef.optionAvailedData };
                }

            }

            this.eventService.saveEvent(dataToSend, dataToSend['eventCode']).subscribe(res => {
                if (res['status'] === 200 && res['result']) {
                    if (res['result']) {
                        self.statusId = res['result']['statusId'];
                        self.toastr.success(res['message']);
                        self.transactionId = res['result']['id'];
                        self.isTabDisabled = false;
                        self.transactionNumber = res['result']['trnNo'];
                        self.transactionDate =
                            res['result']['refDate'] ? new Date(res['result']['refDate']) : null;
                        self.createdDate = res['result']['createdDate'];
                        self.employeeNoEvent = res['result'].employeeNo;
                        this.eventForm.get('eventCode').disable();
                        if (self.isSubmitClick) {
                            self.openWorkFlowPopUp();
                        }
                        // }
                    } else {
                        self.toastr.error(res['message']);
                        self.isSubmitClick = false;
                    }
                } else {
                    self.toastr.error(res['message']);
                    self.isSubmitClick = false;
                }
            }, err => {
                self.toastr.error(err);
                self.isSubmitClick = false;
            });
        }
    }

    /**
     * @method setEmployeeId
     * @description Function is called to set emloyee id on employee search
     * @param employeeDetails details of employee searched
     */
    setEmployeeId(employeeDetails) {
        this.employeeDetails = employeeDetails;
        if (employeeDetails && employeeDetails.employee) {
            this.empId = employeeDetails.employee.employeeId;
        } else {
            this.empId = null;
            this.employeeNoEvent = null;
        }
        this.onPayCommissionChange();
    }

    /**
     * @method getEventDetail
     * @description Function is called to get saved event details
     */
    getEventDetail() {
        const self = this;
        this.eventService.getEventDetails({ id: self.transactionId }, self.eventType).subscribe(res => {
            if (res['status'] === 200) {
                if (res['result']) {
                    self.eventDetails = res['result'];
                    self.transactionId = res['result']['id'];
                    self.transactionNumber = res['result']['trnNo'];
                    self.eventType = res['result']['eventCode'];
                    self.statusId = res['result']['statusId'];
                    self.eventId = res['result']['eventId'];
                    self.employeeNoEvent = res['result'].employeeNo;
                    self.transactionDate =
                        res['result']['refDate'] ? new Date(res['result']['refDate']) : null;
                    self.eventForm.patchValue({
                        officeName: self.userOffice.officeName,
                        eventCode: self.eventType,
                        eventOrderNo: self.eventDetails.eventOrderNo,
                        payCommId: self.eventDetails.payCommId,
                        eventOrderDate: new Date(self.eventDetails.eventOrderDate),
                        eventEffectiveDate: new Date(self.eventDetails.eventEffectiveDate)
                    });
                    let date;
                    if (self.eventDetails.eventOrderDate) {
                        date = self.eventDetails.eventOrderDate.split('-');
                        date = new Date(date[0], Number(date[1]) - 1, date[2]);
                        self.eventForm.patchValue({
                            eventOrderDate: date
                        });
                    }
                    if (self.eventDetails.eventEffectiveDate) {
                        date = self.eventDetails.eventEffectiveDate.split('-');
                        date = new Date(date[0], Number(date[1]) - 1, date[2]);
                        self.eventForm.patchValue({
                            eventEffectiveDate: date
                        });
                    }
                    this.onEventChange();
                    self.isTabDisabled = false;
                    this.setEventSubTypeDetails();
                    this.eventForm.get('eventCode').disable();
                    // let disableFields = false;
                    if (self.eventDetails.classTwoRemarks !== null && self.eventDetails.classTwoRemarks !== '') {
                        self.approverRemarksPresent = true;
                        self.approverRemarks = self.eventDetails.classTwoRemarks;
                    }
                    if (self.eventDetails.classOneRemarks !== null && self.eventDetails.classOneRemarks !== '') {
                        self.approverRemarksPresent = true;
                        self.approverRemarks = self.eventDetails.classOneRemarks;
                    }
                    if (this.statusId !== 0 && this.statusId !== 205) {
                        // TODO: 06-11-2020 Pankaj - commented code due to sonar issue
                        // disableFields = true;
                        if (self.action === 'edit') {
                            self.getEventTransactionWfRoleCode();
                        } else {
                            // To do for different level disabling
                            this.isNonEditable = true;
                            this.disableFields();
                        }
                    } else if (this.action === 'view') {
                        this.isNonEditable = true;
                        this.disableFields();
                    }
                }
            } else {
                self.toastr.error(res['message']);
            }
        }, err => {
            self.toastr.error(err);
        });
    }

    setEventId() {
        if (!this.eventId) {
            if (this.eventList && this.eventList.length > 0 && this.eventType) {
                const event = this.eventList.filter(eventI => {
                    return eventI.eventCode === this.eventType;
                });
                if (event && event[0]) {
                    this.eventId = event[0].id;
                }
            }
        }
    }

    /**
     * @method createEventForm
     * @description Function is called to initialize form group for event details
     */
    createEventForm() {
        const self = this;
        self.eventForm = self.fb.group({
            officeName: [self.userOffice.officeName, Validators.required],
            eventOrderNo: ['', Validators.required],
            payCommId: ['', Validators.required],
            eventOrderDate: ['', Validators.required],
            eventEffectiveDate: ['', Validators.required],
            eventCode: ['', Validators.required]
        });
    }

    /**
     * @method getAllCommission
     * @description Function is called to get commission list
     */
    getAllCommission() {
        const self = this;
        this.eventService.getAllCommissions().subscribe(res => {
            if (res['status'] === 200 && res['result']) {
                self.payCommissionList = _.cloneDeep(res['result']['Dept_Pay_Commission']);
                self.defaultPayCommList = _.cloneDeep(res['result']['Dept_Pay_Commission']);
            } else {
                self.toastr.error(res['message']);
            }
        }, err => {
            self.toastr.error(err);
        });
    }

    /**
     * @method submitDetails
     * @description Function is called to submit event details
     */
    submitDetails(fromAttachment?) {
        const formValid = this.eventForm.invalid,
            eventPostDetailsStatus = !this.eventRef.getStatus(),
            attachmentStatus = !this.attachmentTab.checkForMandatory();
        if (formValid || eventPostDetailsStatus || attachmentStatus) {
            _.each(this.eventForm.controls, eventFormControl => {
                if (eventFormControl.status === 'INVALID') {
                    eventFormControl.markAsTouched({ onlySelf: true });
                }
                if (eventFormControl instanceof FormGroup) {
                    _.each(eventFormControl.controls, nestedEventFormControl => {
                        if (nestedEventFormControl.status === 'INVALID') {
                            nestedEventFormControl.markAsTouched({ onlySelf: true });
                        }
                    });
                }
            });
            if (fromAttachment) {
                this.toastr.error('Please fill all details!');
            }
            if (!formValid && !eventPostDetailsStatus) {
                this.selectedIndex = 1;
            }
        } else {
            if (!this.empId) {
                this.toastr.error(EVENT_ERRORS.EMPLOYEE_NOT_SEARCHED);
                return;
            }
            this.setEventId();
            this.isSubmitClick = true;
            this.saveDetails();
        }
    }

    /**
     * @method resetForm
     * @description Function is called when reset is clicked and it further emits so event details can be reset
     * @param eventFormTag form to reset all
     */
    resetForm(eventFormTag: NgForm) {
        const self = this;
        this.dialog.open(ResetClearDialogEventComponent, {
            width: '360px'
        })
            .afterClosed().subscribe(result => {
                if (result === 'yes') {
                    this.eventForm.reset();
                    eventFormTag.resetForm();
                    this.eventForm.enable();
                    this.eventForm.patchValue({
                        officeName: self.userOffice.officeName,
                        eventCode: self.eventType
                    });
                    this.eventForm.get('employeeCurrentForm').get('employeeNo').disable();
                    if (this.eventRef.clearExmDetails) {
                        this.eventRef.clearExmDetails();
                    }
                    if (this.transactionId) {
                        this.eventForm.get('eventCode').disable();
                        this.getEventDetail();
                    }
                    this.eventMinDate = new Date(1996, 0, 1);
                    this.todayDate = new Date();
                }
            });
    }

    /**
     * To get the workflow role code of the selected tranasaction
     */
    getEventTransactionWfRoleCode() {
        const param = {
            id: this.transactionId
        },
            self = this;
        this.pvuWfService.getPVUEventTransactionWfRoleCode(param, this.eventType).subscribe((res) => {
            if (res && res['status'] === 200) {

                if (res['result'] === null || res['result'] === 'null') {
                    this.isCreator = true;
                } else if (res['result'] === COMMON_APIS.WORKFLOW.CODES.CREATOR_WF_ROLE_CODE) {
                    this.isRework = true;
                } else if (res['result'] === COMMON_APIS.WORKFLOW.CODES.VERIFIER_WF_ROLE_CODE) {
                    this.isVerifier = true;
                } else if (res['result'] === COMMON_APIS.WORKFLOW.CODES.APPROVER_WF_ROLE_CODE) {
                    if (this.approverRemarksPresent) {
                        self.getReasonList();
                    }
                    this.isApprover = true;
                } else {
                    this.isNonEditable = true;
                }
                this.disableFields();
            } else {
                this.toastr.error(res['message']);
            }
        }, (err) => {
            this.toastr.error(err);
        });
    }

    /**
     * To disable specific fields on basis of login
     */
    disableFields() {
        const self = this;
        if (this.isNonEditable) {
            this.eventForm.disable();
        } else {
            if (this.isCreator) {
                _.forEach(this.eventForm.controls, control => {
                    if (control instanceof FormControl) {
                        control.enable();
                    }
                });
            } else if (this.isVerifier || this.isApprover) {
                _.forEach(this.eventForm.controls, control => {
                    if (control instanceof FormControl) {
                        control.disable();
                    }
                });
                if (!this.showShettyType) {
                    self.eventForm.get('eventOrderNo').enable();
                    self.eventForm.get('eventOrderDate').enable();
                    self.eventForm.get('eventEffectiveDate').enable();
                    self.eventForm.get('payCommId').enable();
                }
            }
        }
        this.eventForm.get('eventCode').disable();
    }

    /**
     * To get the reason list
     */
    getReasonList() {
        this.isOtherReturnReason = false;
        this.pvuWfService.getReturnReasonList().subscribe((res) => {
            if (res && res['status'] === 200) {
                this.returnReasonList = res['result'];
                this.loadReason();
            } else {
                this.toastr.error(res['message']);
            }
        }, (err) => {
            this.toastr.error(err);
        });
    }

    /**
     * To load the reason list in dropdown list
     */
    loadReason() {
        const param = {
            'id': this.transactionId
        };
        this.pvuWfService.getPVUEventReasonData(param, this.eventType).subscribe((res) => {
            if (res && res['status'] === 200 && res['result']) {
                this.reasonData = res['result'];
                // let returnReason = [];
                if (this.reasonData.length > 0 && this.approverRemarksPresent) {
                    this.recommendationFlag = true;
                }
                this.reasonData.forEach(reasonObj => {
                    if (reasonObj && reasonObj.reasonId) {
                        // TODO : 6 Nov 2020 - Pankaj - commented code due to sonar issue
                        // returnReason.push(reasonObj.reasonId);
                        if (reasonObj.reasonId === 115) {
                            this.otherReason = reasonObj.remarks;
                            this.isOtherReturnReason = true;
                        }
                    }
                });
                this.reasonChangeSelection();
            } else {
                this.toastr.error(res['message']);
            }
        }, (err) => {
            this.toastr.error(err);
        });
    }

    /**
     * On Reason Selection change update the selected reason list and show/hide the Other Reason field
     * 116 is id for the Other Reason option
     */
    reasonChangeSelection() {
        const dataSelected = [];
        const selectedArray = this.reasonData;
        if (selectedArray && selectedArray.length !== 0
            && this.returnReasonList && this.returnReasonList.length !== 0) {
            selectedArray.forEach(el => {
                const findData: any[] = this.returnReasonList.filter(data => data.reasonId === el.reasonId);
                const reason = {
                    reasonId: findData[0]['reasonId'],
                    reasonName: findData[0]['reasonName']
                };
                dataSelected.push(reason);
            });
            if (dataSelected) {
                this.dataSource = new MatTableDataSource(dataSelected);
            }
        } else {
            this.dataSource = new MatTableDataSource([]);
        }
    }

    /**
     * @method openWorkFlowPopUp
     * @description Function is called to submit event for further process in workflow
     */
    openWorkFlowPopUp(): void {
        this.setEventId();
        const self = this,
            params = {
                'trnNo': self.transactionNumber,
                'initiationDate': self.transactionDate,
                'trnId': self.transactionId,
                'lkPoOffUserId': self.lkPoOffUserId,
                'event': self.eventForm.get('eventCode').value,
                'eventId': self.eventId,
                'empId': self.empId,
                'isAuditor': false,
                'isPvuApprover': false,
                'pvuReturnOfficeId': null
            },
            eventNameObj = this.eventList.filter(event => {
                return event.eventCode === self.eventForm.get('eventCode').value;
            });
        if (eventNameObj) {
            params['eventName'] = eventNameObj[0].eventName;
        }
        const dialogRef = this.dialog.open(ForwardDialogPVUComponent, {
            width: '2700px',
            height: '600px',
            data: params
        });
        dialogRef.afterClosed().subscribe(result => {
            this.isSubmitClick = false;
            if (result === 'yes') {
                let url = '/dashboard';
                if (this.action !== 'new') {
                    url += '/pvu/pvu-events/list';
                    url += ('/' + this.eventType);
                }
                this.router.navigate([url], { skipLocationChange: true });
            }
            // Kept for future
            // else if (result === 'no') {
            // }
        });
    }

    /**
     * @method viewComments
     * @description Function is called to see all remarks till date
     */
    viewComments() {
        if (this.transactionId && this.empId) {
            const event = this.eventList.filter(eventObj => {
                return eventObj.eventCode === this.eventType;
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
                    'trnId': this.transactionId,
                    'event': 'PVU',
                    'isPVU': true,
                    'eventId': eventId,
                    'trnNo': this.transactionNumber,
                    'initiationDate': this.transactionDate
                }
            });
            // Kept for future purpose if required to check Yes clicked or No clicked
            // dialogRef.afterClosed().subscribe(result => {
            // });
        }
    }

    /**
     * @method OnListClick
     * @description Function is called to go listing and it will provide information if event should be seected or not
     */
    onListClick() {
        let url = '/dashboard/pvu/pvu-events/list';
        if (this.action !== 'new') {
            url += ('/' + this.eventType);
        }
        this.router.navigate([url], { skipLocationChange: true });
    }

    /**
     * @method goBackToPreviousPage
     * @description Function is called when close button is clicked and it wil navigate to grand parent route
     */
    goBackToPreviousPage() {
        this.router.navigate([this.routeService.getPreviousUrl()], { skipLocationChange: true });
    }

    printComparisonStatement() {
        const self = this,
            params = {
                'id': self.transactionId
            };
        // const eventType = this.eventForm.get('eventCode').value;
        this.eventService.printComparisonStatement(params).subscribe(res => {
            if (res) {
                const file = res['result'];
                const docType = 'application/pdf';
                const byteArray = new Uint8Array(atob(file).split('').map(char => char.charCodeAt(0)));
                const blob = new Blob([byteArray], { type: docType });
                if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                    // this.onSubmitSearch();
                    window.navigator.msSaveOrOpenBlob(blob);
                    this.loader = false;
                } else {
                    // this.onSubmitSearch();
                    const url = window.URL.createObjectURL(blob);
                    window.open(url, '_blank');
                }
            }
        }, err => {
            this.toastr.error(err);
        });
    }

    /**
     * @method ngOnDestroy
     * @description Function is called when compnent is destroyed to take necessary calls on view destroy from browser
     */
    ngOnDestroy() {
        this.subscribeParams.forEach(subscriber => {
            subscriber.unsubscribe();
        });
    }

}
