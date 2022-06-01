import { CommonService } from 'src/app/modules/services/common.service';
import { EventViewPopupService } from './../../services/event-view-popup.service';
import { pvuMessage, MessageConst, MENU_ID } from './../../../../../shared/constants/pvu/pvu-message.constants';
import { ExtraOrdinaryLeaveService } from './../../../../services/pvu/extra-ordinary-leave.service';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, ValidatorFn } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { SearchEmployeeComponent } from '../../pvu-common/search-employee/search-employee.component';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ForwardDialogComponent } from '../../pvu-common/forward-dialog/forward-dialog.component';
import { ViewCommentsComponent } from '../../pvu-common/view-comments/view-comments.component';
import { StorageService } from 'src/app/shared/services/storage.service';


const trimValidator: ValidatorFn = (control: FormControl) => {
    if (control.value.startsWith(' ')) {
        return {
            'trimError': { value: 'control has leading whitespace' }
        };
    }
    if (control.value.endsWith(' ')) {
        return {
            'trimError': { value: 'control has trailing whitespace' }
        };
    }
    return null;
};

@Component({
    selector: 'app-eol',
    templateUrl: './eol.component.html',
    styleUrls: ['./eol.component.css']
})
export class EolComponent implements OnInit {
    maxDate: Date;
    initiationDate;
    EolStartDate;
    EolEndDate;
    empId;
    empNo;
    statusId;
    currentPost;
    lkPoOffUserId;
    isEditable;
    action: string;
    isSaveDraftVisible: boolean = true;
    viewMode: boolean = true;
    eolDetail: any = {};
    saveDraftStatusId: number = 327;
    isDisabled = false;
    transNo: any;
    subscribeParams: Subscription;
    empEolId: number;
    isCreator: boolean = false;
    isVerifyer: boolean = false;
    isApprover: boolean = false;
    btnSave = false;
    btnSubmit = false;
    showSaveasDraft: boolean = false;
    errorMessages = pvuMessage;
    createEOLForm: FormGroup;
    date: Date = new Date();
    isStartDate: boolean = true;
    isEndDate: boolean = true;
    isOrderNoDate: boolean = true;
    loader: boolean = true;
    retirementDate: Date;
    dialogOpen: boolean;
    menuId: number;
    approverCase: boolean = false;
    clickButtonEvent: boolean = false;
    constructor(
        public fb: FormBuilder,
        public dialog: MatDialog,
        private toastr: ToastrService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private datepipe: DatePipe,
        private extraOrdinaryLeaveService: ExtraOrdinaryLeaveService,
        private storageService: StorageService,
        private eventViewPopupService: EventViewPopupService,
        private commonService: CommonService
    ) { }

    ngOnInit() {
        const userOffice = this.storageService.get('currentUser');
        this.menuId = this.commonService.getLinkMenuId();
        if (userOffice && userOffice['post'][0]['loginPost'] !== undefined) {
            this.currentPost = userOffice['post'].filter((item) => item['loginPost'] === true);
        }

        this.createForm();
        this.subscribeParams = this.activatedRoute.params.subscribe(resRoute => {
            this.action = resRoute.action;
            if (this.action === 'edit' || this.action === 'view') {
                this.empEolId = +resRoute.id;
                const params = { 'id': this.empEolId };
                this.getEOLDetail(params);
                if (this.empEolId) {
                    if (this.action === 'view') {
                        this.createEOLForm.disable();
                        this.isDisabled = true;
                        this.btnSave = true;
                        this.btnSubmit = true;
                        this.initiationDate = true;
                        this.viewMode = false;
                        this.isSaveDraftVisible = false;
                    } else if (this.action === 'edit') {
                        this.initiationDate = true;
                        this.showSaveasDraft = true;
                        this.isEditable = 0;
                        this.durationCal();
                        this.isDisabled = true;
                        this.createEOLForm.controls.employeeNo.enable();
                    }
                } else {
                    this.router.navigate(['../new'], { relativeTo: this.activatedRoute });
                }
            } else {
                this.isSaveDraftVisible = true;
            }
        });

        const eventID = +this.eventViewPopupService.eventID;
        // const eventCode = this.eventViewPopupService.eventCode;
        this.eventViewPopupService.eventID = 0;
        this.eventViewPopupService.eventCode = '';
        if (eventID !== 0) {
            this.menuId = MENU_ID.EOL_CREATE;
            this.dialogOpen = true;
            this.action = 'view';
            this.empEolId = +eventID;
            const params = { 'id': this.empEolId };
            this.getEOLDetail(params);
            this.createEOLForm.disable();
            this.isDisabled = true;
            this.btnSave = true;
            this.btnSubmit = true;
            this.initiationDate = true;
            this.viewMode = false;
        }
    }

    approverEditCase() {
        this.approverCase = true;
        this.btnSubmit = true;
        this.viewMode = false;
        this.isSaveDraftVisible = false;
        this.createEOLForm.controls.startDate.enable();
        this.createEOLForm.controls.endDate.enable();
    }

    createForm() {
        this.createEOLForm = this.fb.group({
            employeeNo: ['', Validators.required],
            empName: [''],
            class: [''],
            designation: [''],
            ofcName: [''],
            startDate: ['', Validators.required],
            endDate: ['', Validators.required],
            orderNoDate: ['', [Validators.required, trimValidator, Validators.maxLength(100)]],
            noOfDays: [''],
            officeId: [''],
        });
    }
    getEOLDetail(params) {
        const self = this;
        this.extraOrdinaryLeaveService.getEOLDetails(params).subscribe((res) => {
            if (res && res['result'] && res['status'] === 200) {
                this.eolDetail = res['result'];
                if (this.saveDraftStatusId === this.eolDetail['statusId'] && this.action === 'edit') {
                    this.approverEditCase();
                }

                this.setEOLDetail(res['result']);
                this.extraOrdinaryLeaveService.getEmpByNo(this.eolDetail.employeeNumber).subscribe((resp) => {
                    if (resp && resp['result'] && resp['status'] === 200) {
                        this.createEOLForm.patchValue({
                            'empName': resp['result'].employeeName,
                            'class': resp['result'].className,
                            'designation': resp['result'].designationName,
                            'ofcName': resp['result'].officeName,
                        });
                        this.empNo = resp['result']['employee']['employeeNo'];
                        this.empId = resp['result']['employee']['employeeId'];
                        if (resp['result']['employee'].retirementDate &&
                            !(resp['result']['employee'].retirementDate instanceof Date)) {
                            let doj;
                            if (resp['result']['employee'].retirementDate.indexOf(' ') !== -1) {
                                doj = resp['result']['employee'].retirementDate.split(' ')[0].split('-');
                                this.retirementDate = new Date(Number(doj[0]), Number(doj[1]) - 1, Number(doj[2]));
                            } else if (resp['result']['employee'].retirementDate.indexOf('T') !== -1) {
                                doj = resp['result']['employee'].retirementDate.split('T')[0].split('-');
                                this.retirementDate = new Date(Number(doj[0]), Number(doj[1]) - 1, Number(doj[2]));
                            }
                        }
                        this.EolStartDate = resp['result']['employee']['dateJoining'];
                    }
                });
            } else {
                self.toastr.error(res['message']);
            }
        }, (err) => {
            self.toastr.error(err);
        });
    }
    setEOLDetail(detail) {
        this.createEOLForm.patchValue({
            'employeeNo': detail.employeeNo,
            'orderNoDate': detail.orderNoDate,
            'noOfDays': detail.noOfDays,
        });
        let dateTo,
            convertedDate;
        if (detail.startDate) {

            dateTo = detail.startDate.split('-');
            convertedDate = new Date(dateTo[0], Number(dateTo[1]) - 1, dateTo[2]);
            this.createEOLForm.patchValue({
                'startDate': convertedDate
            });

        }

        if (detail.endDate) {
            dateTo = detail.endDate.split('-');
            convertedDate = new Date(dateTo[0], Number(dateTo[1]) - 1, dateTo[2]);
            this.createEOLForm.patchValue({
                'endDate': convertedDate
            });
        }
        this.transNo = detail.transNo;
        this.initiationDate = detail.refDate;
        this.empId = detail.empId;
        this.empNo = detail.employeeNo;
        this.statusId = detail.statusId;
        this.showSaveasDraft = true;
        this.getEmployeeDetail();
        // if (this.statusId !== 205) {
        //     this.isSaveDraftVisible = false;
        // }
    }

    onEmployeeKeyUp(event: KeyboardEvent) {
        const self = this;
        // tslint:disable-next-line: deprecation
        if (event['keyCode'] === 13 || event['keyCode'] === 9) { // For the Enter - 13, Tab - 9
            event.preventDefault();
            event.stopPropagation();
            self.getEmployeeDetail();
        }
    }

    openDialogEmployeeNumber() {
        const dialogRef = this.dialog.open(SearchEmployeeComponent, {
            width: '800px',
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.createEOLForm.get('employeeNo').patchValue(result.employeeNo);
                this.getEmployeeDetail();
            }
        });
    }

    getEmployeeDetail() {
        if ((this.createEOLForm.get('employeeNo').value).toString().length !== 10) {
            return false;
        }
        const passData = {
            'pageIndex': 0,
            'pageElement': 10,
            'jsonArr': [
                {
                    'key': 'empNo',
                    'value': Number(this.createEOLForm.get('employeeNo').value)
                },
                {
                    'key': 'effectiveDate',
                    'value': this.convertDateFormatEmp(new Date),
                },
                {
                    'key': 'eventId',
                    'value': 2
                },
                {
                    'key': 'payCommission',
                    'value': 0
                },
                {
                    'key': 'menuId',
                    'value': this.menuId
                }
            ]
        };
        this.extraOrdinaryLeaveService.getEmpByNo(passData).
            subscribe((res) => {
                if (res && res['result'] && res['status'] === 200) {
                    const detail = res['result']['employee'];
                    if (detail) {
                        this.createEOLForm.patchValue({
                            'employeeNo': detail.employeeNo,
                            'empName': detail.employeeName,
                            'class': detail.employeeClass,
                            'designation': detail.designationName,
                            'ofcName': detail.officeName,
                        });
                        this.empNo = detail.employeeNo;
                        this.empId = detail.employeeId;
                        this.EolStartDate = new Date(detail.dateJoining);
                    }
                    if (res['result']['employee'].retirementDate &&
                        !(res['result']['employee'].retirementDate instanceof Date)) {
                        let doj;
                        if (res['result']['employee'].retirementDate.indexOf(' ') !== -1) {
                            doj = res['result']['employee'].retirementDate.split(' ')[0].split('-');
                            this.retirementDate = new Date(Number(doj[0]), Number(doj[1]) - 1, Number(doj[2]));
                        } else if (res['result']['employee'].retirementDate.indexOf('T') !== -1) {
                            doj = res['result']['employee'].retirementDate.split('T')[0].split('-');
                            this.retirementDate = new Date(Number(doj[0]), Number(doj[1]) - 1, Number(doj[2]));
                        }
                    }
                } else {
                    this.toastr.error(res['message']);
                    this.createEOLForm.patchValue({
                        'employeeNo': null,
                        'empName': null,
                        'class': null,
                        'designation': null,
                        'ofcName': null,
                    });
                    this.empNo = null;
                    this.empId = null;
                    this.EolStartDate = null;
                }
            });
    }

    durationCal() {
        if (this.createEOLForm.controls.startDate.value && this.createEOLForm.controls.endDate.value) {
            const startDate = new Date(this.createEOLForm.controls.startDate.value).getTime();
            const endDate = new Date(this.createEOLForm.controls.endDate.value).getTime();
            if (startDate <= endDate) {
                const diffTime: number = endDate - startDate;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                this.createEOLForm.controls.noOfDays.patchValue(diffDays);
            } else {
                this.toastr.error('End date should be greater than Start date');
            }
        }
    }

    saveEOLData() {
        this.durationCal();
        const self = this;
        let valid = true;
        this.showSaveasDraft = true;
        if (this.createEOLForm.get('employeeNo').invalid) {
            this.createEOLForm.get('employeeNo').markAsTouched();
            valid = false;
        }

        if (!this.empId) {
            this.createEOLForm.controls.employeeNo.markAsTouched();
            valid = false;
        }
        if (valid) {
            const dataToSend = {
                employeeNo: this.empNo.toString(),
                startDate: this.convertDateFormat(this.createEOLForm.controls.startDate.value),
                endDate: this.convertDateFormat(this.createEOLForm.controls.endDate.value),
                orderNoDate: this.createEOLForm.controls.orderNoDate.value,
                noOfDays: this.createEOLForm.controls.noOfDays.value,
                transNo: this.transNo,
                refDate: this.initiationDate,
                statusId: this.statusId,
                empEolId: this.empEolId,
                empId: this.empId
            };

            let params;
            if (this.action === 'add') {
                params = {
                    startDate: this.convertDateFormat(this.createEOLForm.controls.startDate.value),
                    endDate: this.convertDateFormat(this.createEOLForm.controls.endDate.value),
                    empId: this.empId
                };
            } else {
                params = {
                    startDate: this.convertDateFormat(this.createEOLForm.controls.startDate.value),
                    endDate: this.convertDateFormat(this.createEOLForm.controls.endDate.value),
                    empId: this.empId,
                    statusId: this.statusId,
                    empEolId: this.empEolId
                };
            }
            this.extraOrdinaryLeaveService.validateEOL(params, this.action).subscribe((res) => {
                if (res && res['status'] === 404) {
                    self.toastr.error(res['message']);
                } else {
                    this.extraOrdinaryLeaveService.saveEOLDetails(dataToSend).subscribe((res) => {
                        if (res && res['result'] && res['status'] === 200) {
                            if (res['result']) {
                                this.clickButtonEvent = true;
                                self.toastr.success(res['message']);
                                this.empEolId = res['result']['empEolId'];
                                this.statusId = res['result']['statusId'];
                            }
                            this.transNo = res['result']['transNo'];
                            this.initiationDate = res['result']['refDate'];
                        } else {
                            self.toastr.error(res['message']);
                        }
                    }, (err) => {
                        self.toastr.error(err);
                    });
                }
            }, (err) => {
                self.toastr.error(err);
            });
        } else {
            this.toastr.error(MessageConst.VALIDATION.TOASTR_REQUIRED);
        }
    }
    submitEOLDetails() {
        this.durationCal();
        let valid = true;
        _.each(this.createEOLForm.controls, function (control) {
            if (control.status === 'INVALID') {
                control.markAsTouched({ onlySelf: true });
                valid = false;
            }
        });
        if (this.createEOLForm.controls.employeeNo.invalid ||
            this.createEOLForm.controls.empName.invalid ||
            this.createEOLForm.controls.class.invalid ||
            this.createEOLForm.controls.designation.invalid ||
            this.createEOLForm.controls.ofcName.invalid ||
            this.createEOLForm.controls.startDate.invalid ||
            this.createEOLForm.controls.endDate.invalid ||
            this.createEOLForm.controls.orderNoDate.invalid ||
            this.createEOLForm.controls.noOfDays.invalid) {
            this.createEOLForm.controls.employeeNo.markAsTouched();
            this.createEOLForm.controls.empName.markAsTouched();
            this.createEOLForm.controls.class.markAsTouched();
            this.createEOLForm.controls.designation.markAsTouched();
            this.createEOLForm.controls.ofcName.markAsTouched();
            this.createEOLForm.controls.startDate.markAsTouched();
            this.createEOLForm.controls.endDate.markAsTouched();
            this.createEOLForm.controls.orderNoDate.markAsTouched();
            this.createEOLForm.controls.noOfDays.markAsTouched();
            valid = false;
        }
        if (!this.empId) {
            this.createEOLForm.controls.employeeNo.markAsTouched();
            valid = false;
        }

        if (valid) {
            const self = this;
            const dataToSend = {
                employeeNo: this.empNo.toString(),
                startDate: this.convertDateFormat(this.createEOLForm.controls.startDate.value),
                endDate: this.convertDateFormat(this.createEOLForm.controls.endDate.value),
                orderNoDate: this.createEOLForm.controls.orderNoDate.value,
                noOfDays: this.createEOLForm.controls.noOfDays.value,
                transNo: this.transNo,
                refDate: this.initiationDate,
                statusId: this.statusId,
                empEolId: this.empEolId,
                empId: this.empId,
            };
            dataToSend['lkPoOffUserId'] = this.currentPost[0]['lkPoOffUserId'];
            let params;
            if (this.action === 'add') {
                params = {
                    startDate: this.convertDateFormat(this.createEOLForm.controls.startDate.value),
                    endDate: this.convertDateFormat(this.createEOLForm.controls.endDate.value),
                    empId: this.empId
                };
            } else {
                params = {
                    startDate: this.convertDateFormat(this.createEOLForm.controls.startDate.value),
                    endDate: this.convertDateFormat(this.createEOLForm.controls.endDate.value),
                    empId: this.empId,
                    statusId: this.statusId,
                    empEolId: this.empEolId
                };
            }
            if (!this.clickButtonEvent) {
                this.extraOrdinaryLeaveService.validateEOL(params, this.action).subscribe((res) => {
                    if (res && res['status'] === 404) {
                        self.toastr.error(res['message']);
                    } else {
                        this.createEOL(dataToSend);
                    }
                }, (err) => {
                    self.toastr.error(err);
                });
            } else {
                this.createEOL(dataToSend);
            }
        } else {
            this.toastr.error(MessageConst.VALIDATION.TOASTR);
        }
    }

    public createEOL(dataToSend) {
        const self = this;
        this.extraOrdinaryLeaveService.saveEOLDetails(dataToSend).subscribe((res) => {
            if (res && res['result'] && res['status'] === 200) {
                if (res['result']) {
                    self.toastr.success(res['message']);
                    if (this.statusId !== res['result']['statusId']) {
                        this.isSaveDraftVisible = false;
                    }
                    this.isDisabled = true;
                    this.btnSave = true;
                    this.btnSubmit = true;
                    this.empEolId = res['result']['empEolId'];
                    this.transNo = res['result']['transNo'];
                    this.initiationDate = res['result']['refDate'];
                    this.lkPoOffUserId = res['result']['lkPoOffUserId'];
                    this.showSaveasDraft = true;
                    if (this.saveDraftStatusId !== this.eolDetail['statusId']) {
                        this.openWorkFlowPopUp();
                    }
                }
                // this.createEOLForm.disable();
                this.btnSave = true;
                this.btnSubmit = true;
            } else {
                self.toastr.error(res['message']);
            }
        }, (err) => {
            self.toastr.error(err);
        });
    }


    viewComments() {
        if (this.empEolId) {
            const dialogRef = this.dialog.open(ViewCommentsComponent, {
                width: '2700px',
                height: '600px',
                data: {
                    'empId': this.empId,
                    'trnId': this.empEolId,
                    'event': 'EOL',
                    'trnNo': this.transNo,
                    'initiationDate': this.initiationDate,
                }
            });

            dialogRef.afterClosed().subscribe(result => {
                if (result === 'yes') {
                    if (this.action === 'edit') {
                        this.router.navigate(['/dashboard/pvu/extra-ordinary-leave'], { skipLocationChange: true });
                    } else {
                        this.router.navigate(['/dashboard'], { skipLocationChange: true });
                    }
                }
            });
        }
    }
    openWorkFlowPopUp(): void {
        const dialogRef = this.dialog.open(ForwardDialogComponent, {
            width: '2700px',
            height: '600px',
            data: {
                'empId': this.empId,
                'trnId': this.empEolId,
                'event': 'EOL',
                'trnNo': this.transNo,
                'initiationDate': this.initiationDate,
                'lkPoOffUserId': this.lkPoOffUserId
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result === 'yes') {
                if (this.action === 'edit') {
                    this.router.navigate(['/dashboard/pvu/extra-ordinary-leave'], { skipLocationChange: true });
                    this.showSaveasDraft = true;
                } else {
                    this.router.navigate(['/dashboard'], { skipLocationChange: true });
                }
            }
        });
    }

    convertDateFormat(date) {
        if (date !== '' && date !== undefined && date !== null) {
            return this.datepipe.transform(date, 'yyyy-MM-dd');
        }
        return '';
    }

    convertDateFormatEmp(date) {
        if (date !== '' && date !== undefined && date !== null) {
            date = new Date(date);
            return this.datepipe.transform(date, 'yyyy/MM/dd');
        }
        return '';
    }

    goToDashboard() {
        if (!this.dialogOpen) {
            if ((this.action === 'edit' || this.action === 'view')) {
                this.router.navigate(['../../../../'], { relativeTo: this.activatedRoute });
            } else {
                this.router.navigate(['../../../'], { relativeTo: this.activatedRoute });
            }
        } else {
            this.dialog.closeAll();
        }
    }

    reset() {
        if (this.empEolId) {
            const params = { 'id': this.empEolId };
            this.getEOLDetail(params);
        } else {
            this.createEOLForm.reset();
        }
    }
    goToListing() {
        this.router.navigate(['/dashboard/pvu/extra-ordinary-leave'], { skipLocationChange: true });
    }
    employeeNoCheck(event) {
        if (event.target.value.length === 10) {
            this.getEmployeeDetail();
        }
    }

    onPrint() {
        const params = {
            'id': this.empEolId
        };
        this.extraOrdinaryLeaveService.printOrder(params).subscribe(res => {
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
}
