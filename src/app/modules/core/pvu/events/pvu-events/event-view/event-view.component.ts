import { EventViewPopupService } from './../../../services/event-view-popup.service';
import { ViewCommentsComponent } from './../../../pvu-common/view-comments/view-comments.component';
import { PVUWorkflowService } from './../services/pvu-workflow.service';
import { COMMON_MESSAGES } from './../../../pvu-common/index';
import { EVENT_APIS, EVENT_ERRORS, EVENT_CONST_DATA } from './../index';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { pvuMessage } from 'src/app/shared/constants/pvu/pvu-message.constants';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { Router, ActivatedRoute } from '@angular/router';
import { cloneDeep } from 'lodash';
import { DatePipe } from '@angular/common';
import { PVUEventsService } from '../services/pvu-event.service';
import { Subscription } from 'rxjs';
import { COMMON_APIS } from '../../../pvu-common';

@Component({
    selector: 'app-event-view',
    templateUrl: './event-view.component.html',
    styleUrls: ['./event-view.component.css']
})
export class PVUEventViewComponent implements OnInit {
    subscribeParams: Subscription;
    action: string;
    eventType: string;
    eventTypeList = [];
    isTabDisabled = true;
    date: Date = new Date();
    errorMessage = EVENT_ERRORS;
    employeeDetails;
    postDetail;
    eventDataLabelValue;
    currentDetails;
    steppingUpJnr;
    higherPayDates;
    higherPayPromotionDetails;
    empId: number;
    eventId: number;
    trnNo: string;
    trnDate: string;
    officeId: number;
    attachmentData = {
        moduleName: EVENT_APIS.ATTACHMENT_PREFIX.Higher_Pay_Scale,
    };
    eventData: any = {};
    trnId: number;
    cccExamData = [];
    departmentalExamData = [];
    languageExamData = [];
    masterExamsData = [];
    payCommSelected: number;
    previousEmployeeNo;
    masterExamColumns = ['examName', 'courseName', 'examBody', 'examPassingDate', 'examStatus'];
    examColumns = ['examName', 'examBody', 'examPassingDate', 'examStatus'];
    examFooterColumns = ['examName'];
    showExamDetails: boolean = false;
    CASEvent: boolean = false;
    cccExamDataSource = new MatTableDataSource(this.cccExamData);
    departmentalExamDataSource = new MatTableDataSource(this.departmentalExamData);
    masterExamsDataSource = new MatTableDataSource(this.masterExamsData);
    languageExamDataSource = new MatTableDataSource(this.languageExamData);
    isCreator: boolean = false;
    isRework: boolean = false;
    isVerifier: boolean = false;
    isNonEditable: boolean = false;
    otherReason: string;
    isOtherReturnReason: boolean = false;
    approverRemarks: string;
    approverRemarksPresent: boolean = false;
    recommendationFlag: boolean = false;
    reasonData: any;
    returnReasonList = [];
    isApprover: boolean = false;
    displayedColumns: string[] = ['serialNo', 'reasonName'];
    dataSource: MatTableDataSource<any>;
    dataSourceforCommision = new MatTableDataSource();
    isOptionAvailed = false;
    dialogOpen: boolean = false;
    isJudiciaryDepartment: boolean = false;
    dialogLinkMenuId: number;
    constructor(
        private toastr: ToastrService,
        public dialog: MatDialog,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private pvuWorkflowService: PVUWorkflowService,
        private pvuEventService: PVUEventsService,
        private datePipe: DatePipe,
        private pvuWfService: PVUWorkflowService,
        private eventViewPopupService: EventViewPopupService
    ) { }

    ngOnInit() {
        this.getPVUEvents();
        this.subscribeParams = this.activatedRoute.params.subscribe(resRoute => {
            this.trnId = +resRoute.id;
            if (this.trnId) {
                this.eventType = resRoute.event;
                this.attachmentData['moduleName'] = EVENT_APIS.ATTACHMENT_PREFIX[this.eventType];
                if (this.eventTypeList.length > 0) {
                    this.setEventId();
                }
                this.loadPVUEventData();
            }
        });
        const eventID = +this.eventViewPopupService.eventID;
        const eventCode = this.eventViewPopupService.eventCode;
        const dialogLinkMenuId = +this.eventViewPopupService.linkMenuID;
        this.eventViewPopupService.eventID = 0;
        this.eventViewPopupService.eventCode = '';
        this.eventViewPopupService.linkMenuID = 0;
        if (eventID !== 0 && eventCode !== '') {
            this.dialogOpen = true;
            this.dialogLinkMenuId = dialogLinkMenuId;
            this.trnId = eventID;
            this.eventType = eventCode;
            if (this.trnId) {
                this.attachmentData['moduleName'] = EVENT_APIS.ATTACHMENT_PREFIX[this.eventType];
                if (this.eventTypeList.length > 0) {
                    this.setEventId();
                }
                this.loadPVUEventData();
            }
        }
    }

    /**
     * @method getPVUEvents
     * @description Function to get all PVU events
     */
    getPVUEvents() {
        const self = this;
        self.pvuEventService.getPVUEvents().subscribe(res => {
            if (res['status'] === 200 && res['result']) {
                self.eventTypeList = res['result'];
                if (this.eventType) {
                    this.setEventId();
                }
            } else {
                self.toastr.error(res['message']);
            }
        }, err => {
            self.toastr.error(err);
        });
    }


    /**
     * @method setEventId
     * @description Function to set Event Id
     */
    setEventId() {
        const event = this.eventTypeList.filter(eventObj => {
            return eventObj.eventCode === this.eventType;
        })[0];
        if (event) {
            this.eventId = event.id;
        }
    }

    /**
     * To get the PVU Event event data
     */
    loadPVUEventData() {
        const param = {
            'id': this.trnId
        }, self = this;
        if (this.eventType) {
            this.pvuEventService.getEventDetails(param, this.eventType).subscribe((res) => {
                if (res && res['status'] === 200 && res['result']) {
                    this.getOptionAvaildViewDetails(res['result'])
                    this.eventData = cloneDeep(res['result']);
                    this.empId = this.eventData.employeeId;
                    this.trnNo = this.eventData.trnNo;
                    this.trnDate = this.eventData.refDate;
                    this.isTabDisabled = false;
                    if (this.eventData.statusId === 420) {
                        if (self.eventData.classTwoRemarks !== null && self.eventData.classTwoRemarks !== '') {
                            self.approverRemarksPresent = true;
                            self.approverRemarks = self.eventData.classTwoRemarks;
                        }
                        if (self.eventData.classOneRemarks !== null && self.eventData.classOneRemarks !== '') {
                            self.approverRemarksPresent = true;
                            self.approverRemarks = self.eventData.classOneRemarks;
                        }
                        self.getEventTransactionWfRoleCode();
                    }
                    this.getExamDetails();
                    this.loadPVUEventLabelData();
                } else {
                    this.eventData = {};
                    this.toastr.error(res['message']);
                }
            }, (err) => {
                this.eventData = {};
                this.toastr.error(err);
            });
        }
    }

    /**
     * To get the workflow role code of the selected tranasaction
     */
    getEventTransactionWfRoleCode() {
        const param = {
            id: this.eventData.id
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
            'id': this.eventData.id
        };
        this.pvuWfService.getPVUEventReasonData(param, this.eventType).subscribe((res) => {
            if (res && res['status'] === 200 && res['result']) {
                this.reasonData = res['result'];
                const returnReason = [];
                if (this.reasonData.length > 0 && this.approverRemarksPresent) {
                    this.recommendationFlag = true;
                }
                this.reasonData.forEach(reasonObj => {
                    if (reasonObj && reasonObj.reasonId) {
                        returnReason.push(reasonObj.reasonId);
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
     * To show exam details
     */
    decideToShowExamDetails() {
        switch (this.eventType) {
            case EVENT_CONST_DATA.HIGHER_PAY_SCALE:
            case EVENT_CONST_DATA.TIKU_PAY:
            case EVENT_CONST_DATA.SELECTION_GRADE:
            case EVENT_CONST_DATA.SENIOR_SCALE_PVU:
                this.showExamDetails = true;
                this.CASEvent = false;
                break;
            case EVENT_CONST_DATA.CARREER_ADVANCEMENT_SCHEME:
                this.showExamDetails = true;
                this.CASEvent = true;
                break;
            case EVENT_CONST_DATA.ASSURED_CARREER_PROGRESSION:
            case EVENT_CONST_DATA.STEPPING_UP:
            case EVENT_CONST_DATA.CHANGE_OF_SCALE_PVU:
            case EVENT_CONST_DATA.SHETTY_PAY:
                this.showExamDetails = false;
                this.CASEvent = false;
                break;
        }
    }

    /**
     * @method transforminYMDDateFormat
     * @description Function is called to get Date in format YYYY-MM-DD
     * @param date for which format is required
     */
    transforminYMDDateFormat(date, exam) {
        if (exam === 'Ph.D') {
            date = new Date(date);
            return this.datePipe.transform(date, 'yyyy');
        } else {
            if (date !== '' && date !== undefined && date !== null) {
                date = new Date(date);
                return this.datePipe.transform(date, 'dd/MM/yyyy');
            }

            return '';

        }
    }

    getExamDetails() {
        if (this.eventData.employeeId) {
            const self = this;
            this.pvuEventService.getEmployeeExamDetails({
                request: {
                    id: this.eventData.employeeId,
                    casEvent: this.eventType === EVENT_CONST_DATA.CARREER_ADVANCEMENT_SCHEME ? 1 : 0
                }
            }).subscribe(res => {
                if (res['status'] === 200 && res['result']) {
                    self.cccExamData = res['result'].exams.cccExams;
                    self.languageExamData = res['result'].exams.langExams;
                    self.departmentalExamData = res['result'].exams.deptExams;
                    self.masterExamsData = res['result'].masterExams;

                    self.cccExamDataSource = new MatTableDataSource(self.cccExamData);
                    self.departmentalExamDataSource = new MatTableDataSource(self.departmentalExamData);
                    self.languageExamDataSource = new MatTableDataSource(self.languageExamData);
                    self.masterExamsDataSource = new MatTableDataSource(self.masterExamsData);
                    this.decideToShowExamDetails();
                }
            });
        }
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
                    this.eventDataLabelValue = cloneDeep(res['result']);
                    if (this.eventDataLabelValue.postDetails) {
                        this.postDetail = cloneDeep(this.eventDataLabelValue.postDetails);

                    }
                    if (this.eventDataLabelValue.currentDetails) {
                        this.currentDetails = cloneDeep(this.eventDataLabelValue.currentDetails);
                        if (this.postDetail && (!this.postDetail.tikuType && !this.postDetail.casType
                            && !this.postDetail.hpScaleType) &&
                            this.currentDetails.departmentCategoryId &&
                            (this.currentDetails.departmentCategoryId === 17)) {
                            this.isJudiciaryDepartment = true;
                        } else {
                            this.isJudiciaryDepartment = false;
                        }
                    }
                    if (this.eventDataLabelValue.steppingUpJnr) {
                        this.steppingUpJnr = cloneDeep(this.eventDataLabelValue.steppingUpJnr);
                    }
                    if (this.eventDataLabelValue.promotion) {
                        this.higherPayPromotionDetails =
                            cloneDeep(this.eventDataLabelValue.higherPayPromotionDetails);
                        for (const fieldKey in this.higherPayPromotionDetails) {
                            if (this.checkForDate(this.higherPayPromotionDetails[fieldKey])) {
                                this.higherPayPromotionDetails[fieldKey] =
                                    this.getDate(this.higherPayPromotionDetails[fieldKey]);
                            }
                        }
                    }
                    if (this.eventDataLabelValue.higherPayDate) {
                        this.higherPayDates = cloneDeep(this.eventDataLabelValue.higherPayDates);
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
                } else {
                    this.toastr.error(res['message']);
                }
            }, (err) => {
                this.toastr.error(err);
            });
        }
    }
    displayedColumnsData = [];
    tableData: any = {};
    getOptionAvaildViewDetails(data) {
        this.tableData = data;
        if ((this.eventType ===  EVENT_CONST_DATA.HIGHER_PAY_SCALE || this.eventType ===  EVENT_CONST_DATA.TIKU_PAY
            || this.eventType ===  EVENT_CONST_DATA.CARREER_ADVANCEMENT_SCHEME ) && data['optionAvailableId'] === 2) {
            this.isOptionAvailed = true;
            if (data['payCommId'] == 150) {
                this.displayedColumnsData = [];
                this.displayedColumnsData.push('PayAsonIncrementDate', 'PayScale', 'Basic');
                this.dataSourceforCommision = new MatTableDataSource([{
                    ...data,
                    PayAsonIncrementDate: data['optionAvailableDate'],
                    payScale: data['scaleName']
                }])
            } else if (data['payCommId'] == 151) {
                this.displayedColumnsData = [];
                this.displayedColumnsData.push('PayAsonIncrementDate', 'PayBand', 'PayBandValue', 'GradePay', 'Basic');
                this.dataSourceforCommision = new MatTableDataSource([{
                    PayAsonIncrementDate: data['optionAvailableDate'],
                    payBand: data.payBandName,
                    gradePay: data.gradePayName,
                    ...data
                }]);
            }
            else {
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
     * To display the workflow history comments
     */
    viewComments() {
        if (this.trnId && this.empId && this.eventId) {
            const event = this.eventTypeList.filter(eventObj => {
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
                    'trnId': this.trnId,
                    'event': 'PVU',
                    'isPVU': true,
                    'eventId': eventId,
                    'trnNo': this.trnNo,
                    'initiationDate': this.trnDate,
                    'remarksLabel': COMMON_MESSAGES.VIEW_REMARKS_LABEL
                }
            });
            // Kept for future purpose if required to check Yes clicked or No clicked
            // dialogRef.afterClosed().subscribe(result => {
            // });
        }
    }

    printComparisonStatement() {
        const self = this,
            params = {
                'id': self.trnId
            };
        // const eventType = this.eventForm.get('eventCode').value;
        this.pvuEventService.printComparisonStatement(params).subscribe(res => {
            if (res) {
                const file = res['result'];
                const docType = 'application/pdf';
                const byteArray = new Uint8Array(atob(file).split('').map(char => char.charCodeAt(0)));
                const blob = new Blob([byteArray], { type: docType });
                if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                    // this.onSubmitSearch();
                    window.navigator.msSaveOrOpenBlob(blob);
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
        this.router.navigate(['/dashboard/pvu/pvu-events/list/', this.eventType], { skipLocationChange: true });
    }
}
