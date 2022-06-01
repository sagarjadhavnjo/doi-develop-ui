import { EventViewPopupService } from './../../../services/event-view-popup.service';
import { RouteService } from 'src/app/shared/services/route.service';
import { ViewCommentsComponent } from './../../../pvu-common/view-comments/view-comments.component';
import { SeniorScaleComponent } from './../../../pvu-common/senior-scale/senior-scale.component';
import { ChangeOfScaleComponent } from './../../../pvu-common/change-of-scale/change-of-scale.component';
import { ReversionComponent } from './../reversion/reversion.component';
import { PromotionForgoComponent } from './../promotion-forgo/promotion-forgo.component';
import { EventsService } from './../services/events.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { EVENT_ERRORS, EVENT_APIS } from './../index';
import { StorageService } from './../../../../../../shared/services/storage.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, Validators, FormControl, FormGroup, NgForm } from '@angular/forms';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import * as _ from 'lodash';
import { PromotionComponent } from '../promotion/promotion.component';
import { DeemedDateComponent } from '../deemed-date/deemed-date.component';
import { MatDialog } from '@angular/material/dialog';
import { ForwardDialogComponent } from '../../../pvu-common/forward-dialog/forward-dialog.component';
import { SaveDraftDialogEventComponent } from './save-draft-dialog.component';
import { AttachmentPvuComponent } from '../../../pvu-common/attachment-pvu/attachment-pvu.component';
import { ResetClearDialogPayEventComponent } from './reset-clear-dialog.component';
@Component({
    selector: 'app-event',
    templateUrl: './event.component.html',
    styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit, OnDestroy {
    todayDate = new Date();
    eventMinDate = new Date(1996, 0, 1);
    selectedIndex: number = 0;
    payCommissionList = [];
    eventWorkFlow: string = 'Pay Fixation';
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
    submitClick = false;
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
    loader: boolean = true;
    @ViewChild('attachmentTab') attachmentTab: AttachmentPvuComponent;
    attachmentData = {
        moduleName: ''
    };
    dialogOpen: boolean = false;
    dialogLinkMenuId: number = 0;
    constructor(
        private fb: FormBuilder,
        private storageService: StorageService,
        private toastr: ToastrService,
        private activatedRoute: ActivatedRoute,
        private eventService: EventsService,
        private router: Router,
        private dialog: MatDialog,
        private routeService: RouteService,
        private eventViewPopupService: EventViewPopupService
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
        self.getPayEvents();
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
        const eventID = +this.eventViewPopupService.eventID;
        const eventCode = this.eventViewPopupService.eventCode;
        const dialogLinkMenuId = +this.eventViewPopupService.linkMenuID;
        this.eventViewPopupService.eventID = 0;
        this.eventViewPopupService.eventCode = '';
        this.eventViewPopupService.linkMenuID = 0;
        if (eventID !== 0 && eventCode !== '') {
            self.action = 'view';
            self.dialogOpen = true;
            self.dialogLinkMenuId = dialogLinkMenuId;
            self.transactionId = eventID;
            self.eventType = eventCode;
            self.submitted = true;
            self.showSubmitButton = false;
            if (self.transactionId) {
                self.getEventDetail();
            }
        }
    }

    /**
     * @method getPayEvents
     * @description Function to get all pay fixation events
     */
    getPayEvents() {
        const self = this;
        self.eventService.getPayEvents().subscribe(res => {
            if (res['status'] === 200 && res['result']) {
                self.eventList = res['result'];
                if (self.action === 'new') {
                    self.eventForm.get('eventCode').patchValue(self.eventList[0].eventCode);
                    self.eventType = self.eventList[0].eventCode;
                    self.attachmentData.moduleName = EVENT_APIS.ATTACHMENT_PREFIX[self.eventType];
                    self.onEventChange();
                }
                if (this.eventDetails && !this.eventId) {
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
     * @method createEventForm
     * @description Function is called to initialize form group for event details
     */
    createEventForm() {
        const self = this;
        self.eventForm = self.fb.group({
            officeName: [self.userOffice.officeName, Validators.required],
            eventCode: [self.eventType, Validators.required],
            promotionTypeId: [''],
            eventOrderNo: ['', Validators.required],
            payCommId: ['', Validators.required],
            eventOrderDate: ['', Validators.required],
            eventEffectiveDate: ['', Validators.required]
        });
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
        }
        if (this.eventForm.get('eventOrderDate')) {
            this.eventForm.get('eventOrderDate').markAsTouched({ onlySelf: true });
        }
        if (this.eventForm.get('eventEffectiveDate')) {
            this.eventForm.get('eventEffectiveDate').markAsTouched({ onlySelf: true });
        }
    }

    /**
     * @method onEventChange
     * @description Function is called when event is changed
     */
    onEventChange() {
        const self = this,
            eventValue = this.eventForm.controls.eventCode.value;
        this.showPromotionType = false;
        this.showExamDetails = false;
        this.eventForm.get('promotionTypeId').setValidators(null);
        this.eventForm.get('promotionTypeId').updateValueAndValidity();
        switch (eventValue) {
            case 'Promotion':
                this.showPromotionType = true;
                this.showExamDetails = true;
                this.eventForm.get('promotionTypeId').setValidators(Validators.required);
                this.eventForm.get('promotionTypeId').updateValueAndValidity();
                this.eventRef = this.eventRef as PromotionComponent;
                break;
            case 'Promotion_Forgo':
                this.eventRef = this.eventRef as PromotionForgoComponent;
                break;
            case 'Reversion':
                this.eventRef = this.eventRef as ReversionComponent;
                break;
            case 'Deemed_Date':
                this.eventRef = this.eventRef as DeemedDateComponent;
                break;
            case 'Change_of_Scale':
                this.eventRef = this.eventRef as ChangeOfScaleComponent;
                break;
            case 'Senior_Scale':
                this.eventRef = this.eventRef as SeniorScaleComponent;
                break;
        }

        self.eventType = this.eventForm.get('eventCode').value;
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
     * @method onPromotionLookupData
     * @description Function is called to assign promotion look up data
     * @param list to assign to dropdown
     */
    onPromotionLookupData(list) {
        this.promotionTypeList = _.cloneDeep(list);
    }

    /**
     * @method onTabChange
     * @description Function is called on tab change
     */
    onTabChange() { }

    /**
     * @method saveDetails
     * @description Function is called when save as draft is clicked and it further emits so event details can be saved
     */
    saveDetails(event?) {
        let self = this,
            dataToSend = _.cloneDeep(self.eventDetails) ? _.cloneDeep(self.eventDetails) : {},
            eventForm = self.eventForm.getRawValue();
        // tslint:disable-next-line:max-line-length
        if (!eventForm.eventOrderNo || !eventForm.eventOrderDate || !eventForm.eventEffectiveDate || !eventForm.eventCode) {
            _.each(this.eventForm.controls, eventFormControl => {
                if (eventFormControl.status === 'INVALID') {
                    eventFormControl.markAsTouched({ onlySelf: true });
                }
            });
            if (!eventForm.eventCode) {
                this.eventForm.get('eventCode').markAsTouched({ onlySelf: true });
            }
            self.toastr.error('Please fill mandatory fields for save as draft!');
        } else {
            // this.transactionId = true;
            if (self.eventForm) {
                for (const key in eventForm) {
                    if (key !== 'postForm' && key !== 'notionalForm' && key !== 'deemedJnrEmp') {
                        if (eventForm[key] instanceof Date) {
                            const date: Date = eventForm[key],
                                // tslint:disable-next-line:max-line-length
                                month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1),
                                // tslint:disable-next-line:max-line-length
                                day = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
                            // tslint:disable-next-line:max-line-length
                            dataToSend[key] = '' + date.getFullYear() + '-' + month + '-' + day;
                        } else {
                            dataToSend[key] = eventForm[key];
                        }
                    } else if (key === 'postForm' || key === 'notionalForm') {
                        for (const empKey in eventForm[key]) {
                            if (empKey && !(eventForm[key][empKey] instanceof Date)) {
                                if (empKey === 'srSeniorNo' || empKey === 'jrSeniorNo') {
                                    dataToSend[empKey] = +eventForm[key][empKey];
                                } else {
                                    dataToSend[empKey] = eventForm[key][empKey];
                                }
                            } else if (eventForm[key][empKey] instanceof Date) {
                                dataToSend[empKey] = eventForm[key][empKey];
                                const date: Date = dataToSend[empKey],
                                    // tslint:disable-next-line:max-line-length
                                    month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1),
                                    // tslint:disable-next-line:max-line-length
                                    day = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
                                // tslint:disable-next-line:max-line-length
                                dataToSend[empKey] = '' + date.getFullYear() + '-' + month + '-' + day;
                            }
                        }
                    } else if (key === 'deemedJnrEmp') {
                        if (this.isSubmitClick && !eventForm[key]['againstEmployeeId']) {
                            this.isSubmitClick = false;
                            // tslint:disable-next-line:max-line-length
                            self.toastr.error('Please fetch junior details by pressing enter or tab button on junior employee number field!');
                            return;
                        }
                        dataToSend['againstEmployeeId'] = eventForm[key]['againstEmployeeId'];
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
                    // tslint:disable-next-line:max-line-length
                    if (Number(self.employeeDetails.employee.employeeNo) !== Number(this.employeeNoEvent)) {
                        dataToSend['same'] = false;
                    }
                }
                dataToSend['officeId'] = self.officeId;
                if (this.employeeDetails && this.employeeDetails.employee) {
                    dataToSend['employeeNo'] = self.employeeDetails.employee.employeeNo;
                    dataToSend['departmentCategoryId'] = this.employeeDetails.employee.departmentCategoryId;
                    dataToSend['currentDetailsEventId'] = this.employeeDetails.employee.currentDetailsEventId;
                } else {
                    dataToSend['employeeNo'] = null;
                    dataToSend['departmentCategoryId'] = null;
                    dataToSend['currentDetailsEventId'] = null;
                }
                dataToSend['cOfficeId'] = self.officeId;
                if (this.employeeDetails && this.employeeDetails.employee) {
                    // if (this.employeeDetails.employee.officeId) {
                    //     dataToSend['cOfficeId'] = Number(this.employeeDetails.employee.officeId);
                    // }
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
                        dataToSend['cDateOfRetirement'] = new Date(this.employeeDetails.employee.retirementDate);
                        const date: Date = dataToSend['cDateOfRetirement'],
                            month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1),
                            day = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
                        dataToSend['cDateOfRetirement'] = '' + date.getFullYear() + '-' + month + '-' + day;
                    }
                    if (this.employeeDetails.employee.dateNxtIncr) {
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
                }
                if (self.isSubmitClick) {
                    dataToSend['isSubmit'] = true;
                    dataToSend['submit'] = true;
                }
                if (this.createdDate && this.action === 'new') {
                    dataToSend['createdDate'] = self.createdDate;
                }
            }
            if (dataToSend['eventCode'] === 'Promotion' || dataToSend['eventCode'] === 'Deemed_Date') {
                if (this.eventRef && this.eventRef.optionAvailedData) {
                    dataToSend = { ...dataToSend, ...this.eventRef.optionAvailedData };
                }
            }
            // tslint:disable-next-line:max-line-length
            this.eventService.saveEvent(dataToSend, dataToSend['eventCode']).subscribe(res => {
                if (res['status'] === 200 && res['result']) {
                    if (res['result']) {
                        self.statusId = res['result']['statusId'];
                        self.toastr.success(res['message']);
                        self.transactionId = res['result']['id'];
                        self.transactionNumber = res['result']['trnNo'];
                        self.isTabDisabled = false;
                        // tslint:disable-next-line:max-line-length
                        self.transactionDate = res['result']['refDate'] ? new Date(res['result']['refDate']) : null;
                        self.createdDate = res['result']['createdDate'];
                        this.employeeNoEvent = res['result'].employeeNo;
                        if (self.isSubmitClick) {
                            self.openWorkFlowPopUp();
                        }
                    } else {
                        self.toastr.error(res['message']);
                        self.isSubmitClick = false;
                    }
                    this.eventForm.get('eventCode').disable();
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
                    // tslint:disable-next-line:max-line-length
                    self.transactionDate = res['result']['refDate'] ? new Date(res['result']['refDate']) : null;
                    self.eventForm.patchValue({
                        officeName: self.userOffice.officeName,
                        eventCode: self.eventType,
                        promotionTypeId: self.eventDetails.promotionTypeId,
                        eventOrderNo: self.eventDetails.eventOrderNo,
                        payCommId: self.eventDetails.payCommId,
                        eventOrderDate: new Date(self.eventDetails.eventOrderDate),
                        eventEffectiveDate: new Date(self.eventDetails.eventEffectiveDate)
                    });
                    let date;
                    self.employeeNoEvent = res['result'].employeeNo;
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
                    this.eventForm.get('eventCode').disable();
                    if (this.statusId !== 205 && this.statusId !== 0) {
                        self.eventForm.get('eventOrderNo').disable();
                        if (self.eventDetails.promotionTypeId) {
                            this.eventForm.get('promotionTypeId').disable();
                        }
                        self.eventForm.get('eventOrderDate').disable();
                        self.eventForm.get('eventEffectiveDate').disable();
                        if (self.eventForm.get('payCommId') && self.eventDetails.employeeNo) {
                            self.eventForm.get('payCommId').disable();
                        }
                    } else if (this.action === 'view') {
                        self.eventForm.disable();
                    }
                }
            } else {
                self.toastr.error(res['message']);
            }
        }, err => {
            self.toastr.error(err);
        });
    }

    /**
     * @method setEmployeeId
     * @description Function is called to set emloyee id on employee search
     * @param employeeDetails details of employee searched
     */
    setEmployeeId(employeeDetails) {
        if (employeeDetails && employeeDetails.employee) {
            this.empId = employeeDetails.employee.employeeId;
            this.employeeDetails = employeeDetails;
        } else {
            this.employeeDetails = null;
            this.empId = null;
            this.employeeNoEvent = null;
        }
        this.onPayCommissionChange();
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
        if (this.eventForm.invalid || !this.eventRef.getStatus()) {
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
        } else {
            if (!this.empId) {
                // tslint:disable-next-line:max-line-length
                this.toastr.error('Please fetch employee details by pressing enter or tab button on employee number field!');
                return;
            }
            this.setEventId();
            this.isSubmitClick = true;
            this.saveDetails();
        }
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
                'isEightScreen': true,
                'eventId': self.eventId,
                'empId': self.empId,
            },
            eventNameObj = this.eventList.filter(event => {
                return event.eventCode === self.eventForm.get('eventCode').value;
            });
        if (eventNameObj) {
            params['eventName'] = eventNameObj[0].eventName;
        }
        // tslint:disable-next-line: no-use-before-declare
        const dialogRef = this.dialog.open(ForwardDialogComponent, {
            width: '2700px',
            height: '600px',
            data: params
        });
        dialogRef.afterClosed().subscribe(result => {
            this.isSubmitClick = false;
            if (result === 'yes') {
                if (this.action === 'edit') {
                    this.router.navigate(['/dashboard/pvu/pay-fixation-events'], { skipLocationChange: true });
                } else {
                    this.router.navigate(['/dashboard'], { skipLocationChange: true });
                }
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
                    'event': 'PAY_FIXATION',
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
     * @method resetForm
     * @description Function is called when reset is clicked and it further emits so event details can be reset
     * @param eventFormTag form to reset all
     */
    resetForm(eventFormTag: NgForm) {
        const self = this;
        this.dialog.open(ResetClearDialogPayEventComponent, {
            width: '360px'
        })
            .afterClosed().subscribe(result => {
                if (result === 'yes') {
                    eventFormTag.resetForm();
                    this.eventForm.reset();
                    this.eventForm.enable();
                    this.eventForm.patchValue({
                        officeName: self.userOffice.officeName,
                        eventCode: self.eventType
                    });
                    if (this.eventRef.clearExmDetails) {
                        this.eventRef.clearExmDetails();
                    }
                    this.eventForm.get('employeeCurrentForm').get('employeeNo').disable();
                    if (this.transactionId) {
                        this.eventForm.get('eventCode').disable();
                        this.getEventDetail();
                    }
                    this.eventMinDate = new Date(1996, 0, 1);
                }
            });
    }

    /**
     * @method OnListClick
     * @description Function is called to go listing and it will provide information if event should be seected or not
     */
    OnListClick() {
        let url = '/dashboard/pvu/pay-fixation-events/list';
        if (this.action !== 'new') {
            url += ('/' + this.eventType);
        }
        this.router.navigate([url], { skipLocationChange: true });
    }

    goBackToPreviousPage() {
        if (!this.dialogOpen) {
            this.router.navigate([this.routeService.getPreviousUrl()], { skipLocationChange: true });
        } else {
            this.dialog.closeAll();
        }
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

    onPrint() {
        const self = this,
            params = {
                'id': self.eventDetails.id
            };
        const eventType = this.eventForm.get('eventCode').value;
        this.eventService.printOrder(params, eventType).subscribe(res => {
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

    printComparisonStatement() {
        const self = this,
            params = {
                'id': self.transactionId
            };
        // const eventType = this.eventForm.get('eventCode').value;
        this.eventService.printComparisonStatement(params).subscribe(resCompair => {
            if (resCompair) {
                const file = resCompair['result'];
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
}
