import { Component, OnInit, Input, Output, EventEmitter, OnChanges, ElementRef, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Subscription, merge } from 'rxjs';
import * as _ from 'lodash';
import { PVUEventsService } from '../services/pvu-event.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { SearchEmployeeComponent } from '../../../pvu-common/search-employee/search-employee.component';
import { EVENT_ERRORS } from '..';
import { DatePipe } from '@angular/common';

// declare function SetGujarati();
// declare function SetEnglish();


@Component({
    selector: 'app-tiku-pay',
    templateUrl: './tiku-pay.component.html',
    styleUrls: ['./tiku-pay.component.css']
})
export class TikuPayComponent implements OnInit, OnChanges, OnDestroy {
    @Input() eventForm: FormGroup;
    @Input() eventDetails: any;
    @Input() lookupData: any;
    @Input() action: string;
    @Input() isRework = false;
    @Output() employeeDetailChange: EventEmitter<any> = new EventEmitter();
    @Output() saveEvent: EventEmitter<any> = new EventEmitter();
    @Output() resetFormEvent: EventEmitter<any> = new EventEmitter();
    todayDate = new Date();
    minDate = new Date(1991, 0, 1);
    maxGpscExamPass;
    showExamDetails: boolean = true;
    enableEmployeeSearch: boolean = false;
    clearEmployeeCurrentDetails: boolean = false;
    employeeDetails: any;
    payMasterData: any;
    classCtrl: FormControl = new FormControl();
    defaultClassList: any = [];
    classList: any;
    designationCtrl: FormControl = new FormControl();
    designationList: any;
    employeeCurrentForm: FormGroup;
    postForm: FormGroup;
    errorMessage = EVENT_ERRORS;
    adhocCtrl: FormControl = new FormControl;
    adhocList = [];
    serviceRegularisedCtrl: FormControl = new FormControl;
    serviceRegularisedList: [];
    gpscExamPassedCtrl: FormControl = new FormControl;
    gpscExamPassedList = [];
    optionAvailedCtrl: FormControl = new FormControl;
    optionAvailedList = [];
    payBandCtrl: FormControl = new FormControl;
    payBandList = [];
    gradePayCtrl: FormControl = new FormControl;
    gradePayList = [];
    payLevelCtrl: FormControl = new FormControl;
    payLevelList = [];
    cellIdCtrl: FormControl = new FormControl;
    cellList = [];
    payScaleCtrl: FormControl = new FormControl;
    scaleList = [];
    subscriber: Subscription[] = [];
    eventClass: string;
    title: string = 'Employee Current Details';
    eventEffectiveDate: Date;
    cccExamData = [];
    departmentalExamData = [];
    languageExamData = [];
    payCommSelected: number;
    cccExamDataSource = new MatTableDataSource(this.cccExamData);
    departmentalExamDataSource = new MatTableDataSource(this.departmentalExamData);
    languageExamDataSource = new MatTableDataSource(this.languageExamData);
    examColumns = ['examName', 'examBody', 'examPassingDate', 'examStatus'];
    examFooterColumns = ['examName'];
    empId: number;
    eligible: boolean = true;
    tikuType: number;
    currentPayscaleSelected: any = [];
    fifthMin: number = 0;
    fifthMax: number = 0;
    isFifth: boolean = false;
    optionMinDate: Date;
    tikuTypeSubs: any;
    isResetClicked = false;
    previousEmployeeNo;
    // currentLang = new BehaviorSubject<string>('Eng');
    // isLangChange = false;
    // hasFocusSet: number;
    optionValid = false;
    public columnsToDisplay: any = [];
    displayedColumns = [];
    optionAvailedData: any;
    optionalDataSource = new MatTableDataSource<any>([]);

    constructor(
        private fb: FormBuilder,
        private eventService: PVUEventsService,
        private toastr: ToastrService,
        private el: ElementRef,
        private dialog: MatDialog,
        private datePipe: DatePipe,
        private elem: ElementRef,
    ) { }

    ngOnInit() {
        const self = this;
        self.creatEmployeeForm();
        this.getDesignations();
        this.employeeCurrentForm.get('employeeNo').disable();
        this.postForm.disable();
        if (this.eventForm.get('payCommId').value) {
            self.onPayCommissionValueChange(this.eventForm.get('payCommId').value);
        }
        this.subscriber.push(this.eventForm.get('payCommId').valueChanges.subscribe(res => {
            self.onPayCommissionValueChange(res);
        }));
        if (this.eventForm.get('eventEffectiveDate').value) {
            self.onEventEffectiveDateChange(this.eventForm.get('eventEffectiveDate').value);
        }
        this.subscriber.push(this.eventForm.get('eventEffectiveDate').valueChanges.subscribe(res => {
            self.onEventEffectiveDateChange(res);
        }));
        if (this.eventForm.get('tikuType').value) {
            self.onTikuPayTypeChange(this.eventForm.get('tikuType').value);
        }
        this.tikuTypeSubs = this.eventForm.get('tikuType').valueChanges.subscribe(res => {
            self.onTikuPayTypeChange(res);
        });

        this.employeeCurrentForm.get('employeeNo').valueChanges.subscribe(res => {
            if (!res) {
                this.postForm.reset();
                this.optionValid = false;
            }
        });
        this.postForm.get('optionAvailableId').valueChanges.subscribe(res => {
            if (res === 2) {
                this.optionValid = true;
            } else if (res === 1) {
                this.optionValid = false;
                if (!this.eventDetails) {
                    Object.keys(this.postForm.controls).map(control => {
                        if (control) {
                            if (control === 'optionAvailableDate' || control === 'basicPay'
                                || control === 'payScale' || control === 'payBandId' || control === 'gradePayId' ||
                                control === 'cellId' || control === 'payLevelId' || control === 'basicPay' ||
                                control === 'payBandValue') {
                                this.postForm.get(control).reset();
                                this.postForm.get(control).updateValueAndValidity();
                            }
                        }
                    });
                }
            }
        });
        merge(
            this.eventForm.get('payCommId').valueChanges,
            this.eventForm.get('eventCode').valueChanges,
            this.postForm.get('optionAvailableId').valueChanges,
            this.postForm.get('optionAvailableDate').valueChanges,

        ).subscribe(
            res => {
                if (this.eventForm.get('eventCode').value === 'Tiku_Pay' &&
                    this.postForm.get('optionAvailableId').value === 2) {
                    if (this.eventForm.get('payCommId').value === 150) {
                        this.calculateFifthPayIncrement();
                    }
                    if (this.eventForm.get('payCommId').value === 151) {
                        this.calculateSixthPayIncrement();
                    }
                    if (this.eventForm.get('payCommId').value === 152) {
                        this.calculateSeventhPayIncrement();
                    }
                }
            }
        );
    }

    onTikuPayTypeChange(res) {
        this.tikuType = res;
        if (res) {
            if (res === 306 || res === 307) {
                this.employeeCurrentForm.addControl('tikuPay1', new FormControl());
                this.employeeCurrentForm.removeControl('tikuPay2');
                this.postForm.removeControl('adhocId');
                this.postForm.removeControl('gpscExamPassedId');
                this.postForm.updateValueAndValidity();
            } else {
                this.employeeCurrentForm.removeControl('tikuPay1');
                this.employeeCurrentForm.removeControl('tikuPay2');
                this.postForm.addControl('adhocId', new FormControl(Validators.required));
                this.postForm.addControl('gpscExamPassedId', new FormControl(Validators.required));
                this.postForm.updateValueAndValidity();
            }
            if (res === 307) {
                this.employeeCurrentForm.addControl('tikuPay2', new FormControl());
                this.postForm.updateValueAndValidity();
            }
        }
        if (this.eventEffectiveDate && !this.employeeCurrentForm.get('employeeNo').value) {
            this.employeeCurrentForm.get('employeeNo').enable();
        } else if (this.eventEffectiveDate && this.employeeCurrentForm.get('employeeNo').value) {
            this.onEmployeeKeyUp(null);
        }
    }

    creatEmployeeForm() {
        const self = this;
        this.eventForm.removeControl('postForm');
        if (self.eventForm) {
            this.eventForm.addControl('employeeCurrentForm', self.fb.group({
                employeeNo: [{ value: null, disabled: true }, Validators.required],
                empId: [''],
                name: [''],
                class: [''],
                designation: [''],
                basicPay: [''],
                doj: [''],
                dor: [''],
                officeName: [''],
                dateOfNextIncrement: [''],
                tikuPay1: [''],
                tikuPay2: [''],
            }));
            this.eventForm.removeControl('postForm');
            self.eventForm.addControl('postForm', self.fb.group({
                adhocId: ['', Validators.required],
                adhocFromDate: [''],
                adhocToDate: [''],
                serviceRegularisedId: [''],
                gpscExamPassedId: ['', Validators.required],
                gpscExamPassedDate: [''],
                dojRegularServiceDate: [''],
                employeeClassId: [''],
                designationId: [''],
                optionAvailableId: ['', Validators.required],
                optionAvailableDate: [''],
                basicPay: [''],
                benEffDate: [''],
                dateOfNextIncrement: [''],
                gujRemarks: ['']
            }));
        } else {
            self.eventForm = self.fb.group({
                employeeCurrentForm: self.fb.group({
                    employeeNo: [{ value: null, disabled: true }, Validators.required],
                    empId: [''],
                    name: [''],
                    class: [''],
                    designation: [''],
                    basicPay: [''],
                    doj: [''],
                    dor: [''],
                    officeName: [''],
                    dateOfNextIncrement: [''],
                    tikuPay1: [''],
                    tikuPay2: [''],
                }),
                postForm: self.fb.group({
                    adhocId: ['', Validators.required],
                    adhocFromDate: [''],
                    adhocToDate: [''],
                    serviceRegularisedId: [''],
                    gpscExamPassedId: ['', Validators.required],
                    gpscExamPassedDate: [''],
                    dojRegularServiceDate: [''],
                    employeeClassId: [''],
                    designationId: [''],
                    optionAvailableId: ['', Validators.required],
                    optionAvailableDate: [''],
                    basicPay: [''],
                    benEffDate: [''],
                    dateOfNextIncrement: [''],
                    gujRemarks: ['']
                })
            });
        }
        self.employeeCurrentForm = self.eventForm.get('employeeCurrentForm') as FormGroup;
        self.postForm = this.eventForm.get('postForm') as FormGroup;
    }

    /**
     * @method onEventEffectiveDateChange
     * @description Function is called on effective date change and sets minimum date
     * @param res Changed effective date
     */
    onEventEffectiveDateChange(res) {
        const self = this;
        if (res) {
            if (this.eventEffectiveDate !== res) {
                if (this.tikuType) {
                    this.employeeCurrentForm.get('employeeNo').enable();
                    this.enableEmployeeSearch = true;
                    this.onEmployeeKeyUp(null);
                }
            }
        } else {
            this.employeeCurrentForm.get('employeeNo').disable();
            this.enableEmployeeSearch = false;
        }
        self.eventEffectiveDate = res;
        this.postForm.patchValue({
            benEffDate: self.eventEffectiveDate,
        });
    }

    /**
     * @method onEmployeeKeyUp
     * @description Function is called to check if employee details should be get from server
     * @param event Keybooard event is recieved to check Enter is pressed or not
     */
    onEmployeeKeyUp(event: KeyboardEvent) {
        const self = this,
            empNo = self.employeeCurrentForm.get('employeeNo').value;
        if (empNo && empNo.length === 10) {
            if (event) {
                if (event['keyCode'] === 13 || event['keyCode'] === 9) {
                    event.preventDefault();
                    event.stopPropagation();
                    if (!this.eventForm.get('eventEffectiveDate').errors) {
                        self.checkForEligibility();
                    }
                }
            } else {
                if (!this.eventForm.get('eventEffectiveDate').errors) {
                    self.checkForEligibility();
                }
            }
        }
    }

    /**
     * @method transforminYMDDateFormat
     * @description Function is called to get Date in format YYYY-MM-DD
     * @param date for which format is required
     */
    transforminYMDDateFormat(date) {
        if (date !== '' && date !== undefined && date !== null) {
            date = new Date(date);
            return this.datePipe.transform(date, 'dd/MM/yyyy');
        }
        return '';
    }

    /**
     * @method checkForEligibility
     * @description Function is called to check eligibility of employee searched
     * as he is applicable for Tiku pay or not
     */
    checkForEligibility() {
        const self = this,
            effectiveDate: Date = this.eventForm.controls.eventEffectiveDate.value,
            dataToSend = {
                'pageIndex': 0,
                'pageElement': 10,
                'jsonArr': [
                    {
                        'key': 'empNo',
                        'value': Number(self.employeeCurrentForm.get('employeeNo').value)
                    },
                    {
                        'key': 'effectiveDate',
                        'value': '0'
                    },
                    {
                        'key': 'payCommission',
                        'value': self.payCommSelected
                    },
                    {
                        'key': 'eventId',
                        'value': '0'
                    },
                    {
                        'key': 'tikuPayType',
                        'value': self.tikuType
                    },
                    {
                        'key': 'isViewPage',
                        'value': this.action === 'view'
                    }
                ]
            };
        if (effectiveDate) {
            let effDateToSend = '';
            effDateToSend += effectiveDate.getFullYear();
            effDateToSend += '/';
            if (effectiveDate.getMonth() < 9) {
                effDateToSend += '0' + (effectiveDate.getMonth() + 1);
                effDateToSend += '/';
            } else {
                effDateToSend += '' + (effectiveDate.getMonth() + 1);
                effDateToSend += '/';
            }
            if (effectiveDate.getDate() <= 9) {
                effDateToSend += '0' + effectiveDate.getDate();
            } else {
                effDateToSend += effectiveDate.getDate();
            }
            // tslint:disable-next-line:max-line-length
            dataToSend['jsonArr'][1].value = effDateToSend;
        }
        this.eventService.checkforTikuPayEligibility(dataToSend).subscribe(res => {
            if (res['status'] === 200 && res['result'] !== null) {
                self.employeeDetails = _.cloneDeep(res['result']);
                if (self.employeeDetails.employee) {
                    self.empId = self.employeeDetails.employee.employeeId;
                }
                if (self.employeeDetails) {
                    if (self.employeeDetails.exams) {
                        self.cccExamData = self.employeeDetails.exams.cccExams;
                        self.languageExamData = self.employeeDetails.exams.langExams;
                        self.departmentalExamData = self.employeeDetails.exams.deptExams;
                        self.cccExamDataSource = new MatTableDataSource(self.cccExamData);
                        self.departmentalExamDataSource = new MatTableDataSource(self.departmentalExamData);
                        self.languageExamDataSource = new MatTableDataSource(self.languageExamData);
                    }
                    if (this.employeeDetails && this.employeeDetails.employee) {
                        this.postForm.patchValue({
                            employeeClassId: Number(this.employeeDetails.employee.classId),
                            designationId: Number(this.employeeDetails.employee.designationId),
                            dojRegularServiceDate: this.dateFormating(this.employeeDetails.employee.dateJoining)
                        });
                    }
                    this.maxGpscExamPass = new Date(this.employeeDetails.employee.dateJoining);
                }
                self.checkForDateOfNxtIncr();
                self.setEmployeeInfo();
                self.onEmployeeEligible();
                self.eligible = true;
            } else {
                self.employeeDetails = null;
                self.eligible = false;
                this.postForm.reset();
                this.postForm.disable();
                self.clearEmployeeDetails();
                self.toastr.error(res['message']);
            }
            self.employeeDetailChange.emit(self.employeeDetails);
        }, err => {
            self.employeeDetails = null;
            self.eligible = false;
            this.postForm.reset();
            this.postForm.disable();
            self.clearEmployeeDetails();
            self.toastr.error(err);
            self.employeeDetailChange.emit(self.employeeDetails);
        });
    }

    /**
     * /@function  adhoceFromChange
     *  @description Check that Adhoc From date is always less then Date of Joining in Regular Service.
     *  @param event pass Date of Joining in Regular Service
     *  @returns Check that Adhoc From data is always less then Date of Joining in Regular Service.
     */
    adhoceFromChange(event) {
        const dateOfJoining = this.postForm.get('dojRegularServiceDate').value;
        if (dateOfJoining < this.postForm.controls.adhocFromDate.value) {
            this.toastr.error('Adhoc from Date is always lesser then Date of Joining in Regular Service');
            this.postForm.patchValue({ adhocFromDate: '' });
        }
    }

    /**
     * /@function  adhoceToChange
     *  @description Check that Adhoc To date is always less then Date of Joining in Regular Service
     * and greater then Adhoc From Date.
     *  @param event pass Date of Joining in Regular Service
     *  @returns Check that Adhoc From data is always less then Date of Joining in Regular Service.
     */
    adhoceToChange(event) {
        const dateOfJoining = this.postForm.get('dojRegularServiceDate').value;
        if (dateOfJoining < this.postForm.controls.adhocToDate.value) {
            this.toastr.error('Adhoc to Date is always lesser then Date of Joining in Regular Service');
            this.postForm.patchValue({ adhocToDate: '' });
        }
        if (this.postForm.controls.adhocFromDate.value > this.postForm.controls.adhocToDate.value) {
            this.toastr.error('Adhoc to Date is always greater then Adhoc From Date');
            this.postForm.patchValue({ adhocToDate: '' });
        }
    }

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

    checkForDateOfNxtIncr() {
        const params: any = { 'data': {} },
            self = this;
        params['data']['employeeId'] = self.employeeDetails.employee.employeeId;
        if (self.eventEffectiveDate) {
            let effDate: any = self.eventEffectiveDate,
                dateToSend = '';
            if (effDate.getMonth() < 9) {
                dateToSend = '0' + (effDate.getMonth() + 1);
                dateToSend += '/';
            } else {
                dateToSend = effDate.getMonth() + 1;
                dateToSend += '/';
            }
            if (effDate.getDate() <= 9) {
                dateToSend += '0' + effDate.getDate();
                dateToSend += '/';
            } else {
                dateToSend += effDate.getDate();
                dateToSend += '/';
            }
            dateToSend += effDate.getFullYear();
            effDate = dateToSend;
            params['data']['effectiveDate'] = effDate;
        }
        // tslint:disable-next-line:max-line-length
        if (this.employeeDetails.employee.dateNxtIncr && !(this.employeeDetails.employee.dateNxtIncr instanceof Date)) {
            let doj;
            if (this.employeeDetails.employee.dateNxtIncr.indexOf(' ') !== -1) {
                doj = this.employeeDetails.employee.dateNxtIncr.split(' ')[0].split('-');
                params['data']['dateOfNextInc'] = doj[1] + '/' + doj[2] + '/' + doj[0];
            } else if (this.employeeDetails.employee.dateNxtIncr.indexOf('T') !== -1) {
                doj = this.employeeDetails.employee.dateNxtIncr.split('T')[0].split('-');
                params['data']['dateOfNextInc'] = doj[1] + '/' + doj[2] + '/' + doj[0];
            }
        }
        if (params['data']['dateOfNextInc'] && params['data']['employeeId'] && params['data']['effectiveDate']) {
            this.eventService.checkforDateNxtIncr(params).subscribe(res => {
                if (res['status'] === 200 && res['result'] !== null) {
                    self.eligible = res['result'];
                    if (self.eligible) {
                        self.postForm.get('optionAvailableId').disable();
                    } else {
                        if (self.action !== 'view') {
                            self.postForm.get('optionAvailableId').enable();
                        }
                    }
                    if (!self.eventDetails) {
                        self.postForm.get('optionAvailableId').patchValue(1);
                    } else {
                        if (self.eventDetails.optionAvailableId) {
                            self.postForm.get('optionAvailableId').patchValue(self.eventDetails.optionAvailableId);
                        }
                    }
                    self.setDateOfNxtIncr();
                } else {
                    self.toastr.error(res['message']);
                }
            }, err => {
                self.toastr.error(err);
            });
        } else {
            self.eligible = false;
            self.postForm.get('optionAvailableId').enable();
            if (!self.eventDetails) {
                self.postForm.get('optionAvailableId').patchValue(1);
            } else {
                if (self.eventDetails.optionAvailableId) {
                    self.postForm.get('optionAvailableId').patchValue(self.eventDetails.optionAvailableId);
                }
            }
            self.setDateOfNxtIncr();
        }
    }

    /**
     * @method setDateOfNxtIncr
     * @description Function is called to set date of next increment
     */
    setDateOfNxtIncr() {
        const eventDetail = this.eventForm.getRawValue(),
            payComm = eventDetail.payCommId,
            optionAvail = this.postForm.get('optionAvailableId').value === 2;
        let doi;
        if (this.employeeDetails && this.employeeDetails.employee) {
            // tslint:disable-next-line:max-line-length
            if (this.employeeDetails.employee.dateNxtIncr && !(this.employeeDetails.employee.dateNxtIncr instanceof Date)) {
                if (this.employeeDetails.employee.dateNxtIncr.indexOf(' ') !== -1) {
                    doi = this.employeeDetails.employee.dateNxtIncr.split(' ')[0].split('-');
                    doi = new Date(doi[0], Number(doi[1]) - 1, doi[2]);
                } else if (this.employeeDetails.employee.dateNxtIncr.indexOf('T') !== -1) {
                    doi = this.employeeDetails.employee.dateNxtIncr.split('T')[0].split('-');
                    doi = new Date(doi[0], Number(doi[1]) - 1, doi[2]);
                }
            }
        }
        switch (payComm) {
            case 148:
                // 3 comm
                break;
            case 149:
                // 4 comm
                break;
            case 150:
                // 5 comm
                if (this.eligible) {
                    if (doi) {
                        this.postForm.patchValue({
                            dateOfNextIncrement: doi
                        });
                    }
                } else {
                    if (optionAvail) {
                        const optionDate = this.postForm.get('optionAvailableDate').value;
                        this.postForm.patchValue({
                            dateOfNextIncrement: new Date(optionDate.getFullYear() + 1, optionDate.getMonth(), 1)
                        });
                    } else {
                        if (doi) {
                            this.postForm.patchValue({
                                dateOfNextIncrement: new Date(doi.getFullYear() + 1, doi.getMonth(), doi.getDate())
                            });
                        }
                    }
                }
                break;
            case 151:
                // 6 comm
                if (this.eligible) {
                    if (doi) {
                        this.postForm.patchValue({
                            dateOfNextIncrement: doi
                        });
                    }
                } else {
                    if (optionAvail) {
                        const optionDate = this.postForm.get('optionAvailableDate').value;
                        this.postForm.patchValue({
                            dateOfNextIncrement: new Date(optionDate.getFullYear() + 1, optionDate.getMonth(), 1)
                        });
                    } else {
                        if (doi) {
                            this.postForm.patchValue({
                                dateOfNextIncrement: new Date(doi.getFullYear() + 1, 6, 1)
                            });
                        }
                    }
                }
                break;
            case 152:
                // 7 comm
                if (this.eligible) {
                    if (doi) {
                        this.postForm.patchValue({
                            dateOfNextIncrement: doi
                        });
                    }
                } else {
                    let month;
                    if (optionAvail) {
                        const optionDate = this.postForm.get('optionAvailableDate').value;
                        this.postForm.patchValue({
                            dateOfNextIncrement: new Date(optionDate.getFullYear() + 1, optionDate.getMonth(), 1)
                        });
                    } else {
                        if (doi) {
                            let year = doi.getFullYear();
                            if (this.eventEffectiveDate.getMonth() >= 6) {
                                month = 6;
                            } else {
                                month = 0;
                                year += 1;
                            }
                            this.postForm.patchValue({
                                dateOfNextIncrement: new Date(year, month, 1)
                            });
                        }
                    }
                }
                break;
        }
    }

    /**
     * @method setEmployeeInfo
     * @description Function is called when we recieve saved event details
     */
    setEmployeeInfo() {
        if (this.employeeDetails && this.employeeDetails.employee) {
            this.employeeCurrentForm.patchValue({
                employeeNo: this.employeeDetails.employee.employeeNo,
                empId: this.employeeDetails.employee.employeeId,
                name: this.employeeDetails.employee.employeeName,
                class: this.employeeDetails.employee.employeeClass,
                designation: this.employeeDetails.employee.designationName,
                basicPay: this.employeeDetails.employee.empBasicPay,
                officeName: this.employeeDetails.employee.officeName,
            });
            // tslint:disable-next-line:max-line-length
            if (this.employeeDetails.employee.dateJoining && !(this.employeeDetails.employee.dateJoining instanceof Date)) {
                let doj;
                if (this.employeeDetails.employee.dateJoining.indexOf(' ') !== -1) {
                    doj = this.employeeDetails.employee.dateJoining.split(' ')[0].split('-');
                    this.employeeCurrentForm.patchValue({
                        doj: doj[2] + '/' + doj[1] + '/' + doj[0]
                    });
                } else if (this.employeeDetails.employee.dateJoining.indexOf('T') !== -1) {
                    doj = this.employeeDetails.employee.dateJoining.split('T')[0].split('-');
                    this.employeeCurrentForm.patchValue({
                        doj: doj[2] + '/' + doj[1] + '/' + doj[0]
                    });
                }
            }
            // tslint:disable-next-line:max-line-length
            if (this.employeeDetails.employee.retirementDate && !(this.employeeDetails.employee.retirementDate instanceof Date)) {
                let doj;
                if (this.employeeDetails.employee.retirementDate.indexOf(' ') !== -1) {
                    doj = this.employeeDetails.employee.retirementDate.split(' ')[0].split('-');
                    this.employeeCurrentForm.patchValue({
                        dor: doj[2] + '/' + doj[1] + '/' + doj[0]
                    });
                } else if (this.employeeDetails.employee.retirementDate.indexOf('T') !== -1) {
                    doj = this.employeeDetails.employee.retirementDate.split('T')[0].split('-');
                    this.employeeCurrentForm.patchValue({
                        dor: doj[2] + '/' + doj[1] + '/' + doj[0]
                    });
                }
            }
            // tslint:disable-next-line:max-line-length
            if (this.employeeDetails.employee.dateNxtIncr && !(this.employeeDetails.employee.dateNxtIncr instanceof Date)) {
                let doj;
                if (this.employeeDetails.employee.dateNxtIncr.indexOf(' ') !== -1) {
                    doj = this.employeeDetails.employee.dateNxtIncr.split(' ')[0].split('-');
                    this.employeeCurrentForm.patchValue({
                        dateOfNextIncrement: doj[2] + '/' + doj[1] + '/' + doj[0]
                    });
                } else if (this.employeeDetails.employee.dateNxtIncr.indexOf('T') !== -1) {
                    doj = this.employeeDetails.employee.dateNxtIncr.split('T')[0].split('-');
                    this.employeeCurrentForm.patchValue({
                        dateOfNextIncrement: doj[2] + '/' + doj[1] + '/' + doj[0]
                    });
                }
            }
            if (this.employeeDetails.employee.tikuPay1 && !(this.employeeDetails.employee.tikuPay1 instanceof Date)) {
                let tikuPay1;
                if (this.employeeDetails.employee.tikuPay1.indexOf(' ') !== -1) {
                    tikuPay1 = this.employeeDetails.employee.tikuPay1.split(' ')[0].split('-');
                    this.employeeCurrentForm.patchValue({
                        tikuPay1: tikuPay1[2] + '/' + tikuPay1[1] + '/' + tikuPay1[0]
                    });
                } else if (this.employeeDetails.employee.tikuPay1.indexOf('T') !== -1) {
                    tikuPay1 = this.employeeDetails.employee.tikuPay1.split('T')[0].split('-');
                    this.employeeCurrentForm.patchValue({
                        tikuPay1: tikuPay1[2] + '/' + tikuPay1[1] + '/' + tikuPay1[0]
                    });
                }
            }
            if (this.employeeDetails.employee.tikuPay2 && !(this.employeeDetails.employee.tikuPay2 instanceof Date)) {
                let tikuPay2;
                if (this.employeeDetails.employee.tikuPay2.indexOf(' ') !== -1) {
                    tikuPay2 = this.employeeDetails.employee.tikuPay2.split(' ')[0].split('-');
                    this.employeeCurrentForm.patchValue({
                        tikuPay2: tikuPay2[2] + '/' + tikuPay2[1] + '/' + tikuPay2[0]
                    });
                } else if (this.employeeDetails.employee.tikuPay2.indexOf('T') !== -1) {
                    tikuPay2 = this.employeeDetails.employee.tikuPay2.split('T')[0].split('-');
                    this.employeeCurrentForm.patchValue({
                        tikuPay2: tikuPay2[2] + '/' + tikuPay2[1] + '/' + tikuPay2[0]
                    });
                }
            }
        } else {
            this.employeeCurrentForm.patchValue({
                name: null,
                class: null,
                empId: null,
                designation: null,
                basicPay: null,
                doj: null,
                dor: null,
                officeName: null,
                dateOfNextIncrement: null,
                tikuPay1: null
            });
        }
        if (this.eventForm.get('payCommId') && this.eventForm.get('payCommId').value) {
            this.setEmployeePayDetailsOnPayCommChange(this.eventForm.get('payCommId').value);
        }

    }

    clearEmployeeDetails() {
        this.employeeDetails = null;
        this.setEmployeeInfo();
        this.departmentalExamDataSource = new MatTableDataSource([]);
        this.languageExamDataSource = new MatTableDataSource([]);
        this.cccExamDataSource = new MatTableDataSource([]);
        this.employeeCurrentForm.get('employeeNo').patchValue('');
        setTimeout(() => {
            this.el.nativeElement.querySelector('.employee-number-field').focus();
        }, 0);
    }

    /**
     * @method onEmployeeEligible
     * @description Function is called to perform further on employee eligibility
     */
    onEmployeeEligible() {
        if (this.action !== 'view') {
            this.postForm.enable();
        } else {
            this.postForm.disable();
        }
        if (this.postForm.get('cellId')) {
            this.postForm.get('cellId').disable();
        }
        if (this.postForm.get('dojRegularServiceDate')) {
            this.postForm.get('dojRegularServiceDate').disable();
        }
        if (this.postForm.get('employeeClassId')) {
            this.postForm.get('employeeClassId').disable();
        }
        if (this.postForm.get('designationId')) {
            this.postForm.get('designationId').disable();
        }
        if (this.postForm.get('benEffDate')) {
            this.postForm.get('benEffDate').disable();
        }
        if (this.postForm.get('dateOfNextIncrement')) {
            this.postForm.get('dateOfNextIncrement').disable();
        }
        if (this.employeeDetails && this.employeeDetails.employee) {
            this.getPayMasters();
            if (!this.previousEmployeeNo) {
                this.previousEmployeeNo = this.employeeDetails.employee.employeeNo;
            }
            if (Number(this.previousEmployeeNo) !== Number(this.employeeDetails.employee.employeeNo)) {
                this.postForm.reset();
                this.clearPayDetails();
            }
        }
        if (this.defaultClassList && this.defaultClassList.length > 0) {
            this.changeClassList();
        }
    }

    /**
     * @method changeClassList
     * @description Function is called to change class dropdown on employee curent class
     */
    changeClassList() {
        const self = this;
        if (this.employeeDetails && this.employeeDetails.employee) {
            if (this.employeeDetails.employee.classId) {
                const classList = this.defaultClassList.filter((classC) => {
                    // tslint:disable-next-line:max-line-length
                    return (classC.lookupInfoId <= Number(self.employeeDetails.employee.classId)) && (classC.lookupInfoId !== 166);
                }),
                    noGrade = this.defaultClassList.filter((classC) => {
                        return classC.lookupInfoId === 166;
                    });
                this.classList = _.cloneDeep(classList);
                _.orderBy(this.classList, 'lookupInfoId', 'desc');
                this.classList.unshift(noGrade[0]);
            } else {
                this.classList = _.cloneDeep(this.defaultClassList);

            }
        }
    }

    /**
     * @method getDesignations
     * @description Function is called to get all designations
     */
    getDesignations() {
        const self = this;
        self.eventService.getDesignations().subscribe(res => {
            if (res['status'] === 200 && res['result']) {
                self.designationList = res['result'];
            } else {
                self.toastr.error(res['message']);
            }
        }, err => {
            self.toastr.error(err);
        });
    }

    /**
     * @method clearPayDetails
     * @description Function is called when promotion type is changed and selected as Promotion is same
     * Pay scale and if employee is searched and set pay commission data
     * @param payCommissionId Current selected pay commission
     * @param payData Saved post details
     */
    clearPayDetails() {
        const payCommissionId = this.eventForm.get('payCommId').value;
        switch (payCommissionId) {
            case 148:
                // 3 comm
                break;
            case 149:
                // 4 comm
                break;
            case 150:
                // 5 comm
                this.postForm.patchValue({ 'payScale': null });
                if (this.eventDetails && this.eventDetails.payScale) {
                    this.eventDetails.payScale = null;
                }
                break;
            case 151:
                // 6 comm
                this.postForm.patchValue({
                    'payBandId': null,
                    'payBandValue': null,
                    'gradePayId': null
                });
                if (this.eventDetails && this.eventDetails.payBandId) {
                    this.eventDetails.payBandId = null;
                    this.eventDetails.payBandValue = null;
                    this.eventDetails.gradePayId = null;
                }
                break;
            case 152:
                // 7 comm
                this.postForm.patchValue({
                    'payLevelId': null,
                    'cellId': null
                });
                if (this.eventDetails && this.eventDetails.payLevelId) {
                    this.eventDetails.payLevelId = null;
                    this.eventDetails.cellId = null;
                }
                break;
        }
        this.postForm.patchValue({
            'basicPay': null
        });
    }

    /**
     * @method setEmployeePayDetailsOnPayCommChange
     * @description Function is called when pay commission is changed
     * @param payCommissionId what pay commission is selected, that id is provided
     */
    setEmployeePayDetailsOnPayCommChange(payCommissionId) {
        this.employeeCurrentForm.removeControl('payLevel');
        this.employeeCurrentForm.removeControl('cellId');
        this.employeeCurrentForm.removeControl('payBand');
        this.employeeCurrentForm.removeControl('payBandValue');
        this.employeeCurrentForm.removeControl('gradePay');
        this.employeeCurrentForm.removeControl('scale');
        switch (payCommissionId) {
            case 148:
                // 3 comm
                break;
            case 149:
                // 4 comm
                break;
            case 150:
                let payScaleValue = null;
                // tslint:disable-next-line:max-line-length
                if (this.employeeDetails && this.employeeDetails.employee && this.employeeDetails.employee.payScaleName) {
                    payScaleValue = this.employeeDetails.employee.payScaleName;
                }
                this.employeeCurrentForm.addControl('scale', new FormControl(payScaleValue));
                // 5 comm
                break;
            case 151:
                let payBandId = null,
                    payBandValue = null,
                    gradePayId = null;
                if (this.employeeDetails && this.employeeDetails.employee) {
                    if (this.employeeDetails.employee.payBandName) {
                        payBandId = this.employeeDetails.employee.payBandName;
                    }
                    if (this.employeeDetails.employee.payBandValue) {
                        payBandValue = this.employeeDetails.employee.payBandValue;
                    }
                    if (this.employeeDetails.employee.gradePayName) {
                        gradePayId = this.employeeDetails.employee.gradePayName;
                    }
                }
                this.employeeCurrentForm.addControl('payBand', new FormControl(payBandId));
                this.employeeCurrentForm.addControl('payBandValue', new FormControl(payBandValue));
                this.employeeCurrentForm.addControl('gradePay', new FormControl(gradePayId));
                // 6 comm
                break;
            case 152:
                // 7 comm
                let payLevelId = null,
                    cellId = null;
                if (this.employeeDetails && this.employeeDetails.employee) {
                    if (this.employeeDetails.employee.payLevelId) {
                        payLevelId = this.employeeDetails.employee.payLevelName;
                    }
                    if (this.employeeDetails.employee.cellId) {
                        cellId = this.employeeDetails.employee.cellName;
                    }
                }
                this.employeeCurrentForm.addControl('payLevel', new FormControl(payLevelId));
                this.employeeCurrentForm.addControl('cellId', new FormControl(cellId));
                break;
        }
    }

    /**
     * @method onAdhocChange
     * @description Function is called to check if option availed or not and changes acccording to it.
     * It is called from multiple dropdown change
     * @param checkId In this is form control name is given
     * @param implementId In this is form control value is given
     * @returns Option Availed dropdown
     */
    onAdhocChange(adhocId) {
        if (this.postForm.controls[adhocId].value === 2) {
            this.postForm.get('adhocFromDate').setValidators(Validators.required);
            this.postForm.get('adhocFromDate').updateValueAndValidity();
            this.postForm.get('adhocToDate').setValidators(Validators.required);
            this.postForm.get('adhocToDate').updateValueAndValidity();
            this.postForm.get('serviceRegularisedId').setValidators(Validators.required);
            this.postForm.get('serviceRegularisedId').updateValueAndValidity();
            this.postForm.get('gpscExamPassedDate').setValidators(Validators.required);
            this.postForm.get('gpscExamPassedDate').updateValueAndValidity();
        } else {
            this.postForm.patchValue({
                adhocFromDate: '',
                adhocToDate: '',
                serviceRegularisedId: '',
                gpscExamPassedDate: ''
            });
            this.postForm.get('adhocFromDate').markAsUntouched();
            this.postForm.get('adhocFromDate').setValidators(null);
            this.postForm.get('adhocFromDate').updateValueAndValidity();
            this.postForm.get('adhocToDate').markAsUntouched();
            this.postForm.get('adhocToDate').setValidators(null);
            this.postForm.get('adhocToDate').updateValueAndValidity();
            this.postForm.get('serviceRegularisedId').markAsUntouched();
            this.postForm.get('serviceRegularisedId').setValidators(null);
            this.postForm.get('serviceRegularisedId').updateValueAndValidity();
            this.onServiceRegularisedId(adhocId);
        }
    }


    /**
     * @method onServiceRegularisedId
     * @description Function is called to check if Service Regularised 'Yes' and 'No' and changes acccording to it.
     * It is called from multiple dropdown change
     * @param serviceRegularisedId In this is form control name is given
     * @returns Service Regularised dropdown
     */
    onServiceRegularisedId(serviceRegularisedId) {
        if (this.postForm.controls[serviceRegularisedId].value === 2) {
            this.postForm.get('gpscExamPassedId').setValidators(Validators.required);
            this.postForm.get('gpscExamPassedId').updateValueAndValidity();
            this.postForm.get('gpscExamPassedDate').setValidators(Validators.required);
            this.postForm.get('gpscExamPassedDate').updateValueAndValidity();
        } else {
            this.postForm.patchValue({
                gpscExamPassedId: '',
                gpscExamPassedDate: ''
            });
            this.postForm.get('gpscExamPassedId').markAsUntouched();
            this.postForm.get('gpscExamPassedId').setValidators(null);
            this.postForm.get('gpscExamPassedId').updateValueAndValidity();
            this.postForm.get('gpscExamPassedDate').markAsUntouched();
            this.postForm.get('gpscExamPassedDate').setValidators(null);
            this.postForm.get('gpscExamPassedDate').updateValueAndValidity();
        }
    }

    /**
     * @method ongpscExamPassedChange
     * @description Function is called to check if GPSC Exam Passed or not and changes acccording to it.
     * It is called from multiple dropdown change
     * @param checkId In this is form control name is given
     * @param gpscExamPassedDate In this is form control value is given
     * @returns GPSC Exam Passed dropdown
     */
    ongpscExamPassedChange(checkId, gpscExamPassedDate) {
        if (this.postForm.controls[checkId].value === 2) {
            this.postForm.get('gpscExamPassedDate').setValidators(Validators.required);
            this.postForm.get('gpscExamPassedDate').updateValueAndValidity();
        } else {
            this.postForm.patchValue({
                gpscExamPassedDate: ''
            });
            this.postForm.get('gpscExamPassedDate').markAsUntouched();
            this.postForm.get('gpscExamPassedDate').setValidators(null);
            this.postForm.get('gpscExamPassedDate').updateValueAndValidity();
        }
    }

    /**
     * @method onOptionAvailedChange
     * @description Function is called to check if option availed or not and changes acccording to it.
     * It is called from multiple dropdown change
     * @param checkId In this is form control name is given
     * @param implementId In this is form control value is given
     * @returns Option Availed dropdown
     */
    onOptionAvailedChange(checkId, implementId) {
        if (this.postForm.get(checkId).value === 2) {
            this.postForm.get(implementId).setValidators(Validators.required);
            this.postForm.get(implementId).updateValueAndValidity();
            if (this.employeeDetails && this.employeeDetails.employee) {
                if (!(this.employeeDetails.employee.dateNxtIncr instanceof Date)) {
                    let datNxtIncr;
                    if (this.employeeDetails.employee.dateNxtIncr.indexOf(' ') !== -1) {
                        datNxtIncr = this.employeeDetails.employee.dateNxtIncr.split(' ')[0].split('-');
                        datNxtIncr = new Date(datNxtIncr[0], datNxtIncr[1] - 1, datNxtIncr[2]);
                    } else if (this.employeeDetails.employee.dateNxtIncr.indexOf('T') !== -1) {
                        datNxtIncr = this.employeeDetails.employee.dateNxtIncr.split('T')[0].split('-');
                        datNxtIncr = new Date(datNxtIncr[0], datNxtIncr[1] - 1, datNxtIncr[2]);
                    }
                    this.optionMinDate = datNxtIncr;
                    this.postForm.patchValue({
                        optionAvailableDate: datNxtIncr
                    });
                }
            }
        } else {
            this.postForm.get(implementId).setValidators(null);
            this.postForm.patchValue({
                optionAvailableDate: ''
            });
            this.postForm.get(implementId).updateValueAndValidity();
        }
        this.setDateOfNxtIncr();
        this.checkForPayOnOptionAvail();

    }

    /**
    * @method checkForPayOnOptionAvail
    * @description Function is called to assign pay band or cell id
    */
    checkForPayOnOptionAvail() {
        if (this.eventForm.get('payCommId').value) {
            const postValue = this.postForm.getRawValue();
            switch (this.eventForm.get('payCommId').value) {
                case 151:
                    if (postValue.payBandId && postValue.payBandValue) {
                        this.calculateSixthBasicPay();
                    }
                    break;
                case 152:
                    if (postValue.payLevelId) {
                        this.calculateSeventhBasicPay();
                    }
                    break;
            }
        }
    }

    /**
     * To filter the date picker for Date Of Next Increment in Seventh Pay
     * Allow only 1st January and 1st July of every year
     */
    seventhDateOfNextIncrFilter: (date: Date | null) => boolean =
        (date: Date | null) => {
            const first = new Date(date.getFullYear(), 6, 1); // 6 for July Month, 1 for Date 1
            const firstDate = first.getDate();
            const datePickerFirstDate = date.getDate();
            const datePickerMonth = date.getMonth();
            // 0 is for January and 6 is for July Months
            if (firstDate === datePickerFirstDate && (datePickerMonth === 0 || datePickerMonth === 6)) {
                return true;
            } else {
                return false;
            }
        }

    /**
     * @method ngOnChanges
     * @description Set lookup Value in Post Details section
     * @param -
     * @returns Set lookup Value in Post Details section
     */
    ngOnChanges() {
        const self = this;
        // if (self.action === 'edit' || self.action === 'view') {
        if (self.eventDetails && this.postForm) {
            if (this.isResetClicked) {
                this.isResetClicked = false;
                this.tikuTypeSubs.unsubscribe();
                if (this.eventDetails.tikuType) {
                    self.onTikuPayTypeChange(this.eventDetails.tikuType);
                }
                this.tikuTypeSubs = this.eventForm.get('tikuType').valueChanges.subscribe(res => {
                    self.onTikuPayTypeChange(res);
                });
            }
            this.postForm.patchValue({
                basicPay: self.eventDetails.basicPay
            });
            this.setTikuPayData();
        }
        // }
        // tslint:disable-next-line: max-line-length
        if (this.employeeDetails && this.eventForm && this.eventForm.get('payCommId') && this.eventForm.get('payCommId').value && this.payMasterData && this.payMasterData.data) {
            this.setCommList(this.eventForm.get('payCommId').value);
        }
        if (this.employeeCurrentForm && this.eventDetails && this.eventDetails.employeeNo) {
            this.employeeCurrentForm.get('employeeNo').patchValue('' + this.eventDetails.employeeNo);
            if (!this.eventForm.get('eventEffectiveDate').errors && this.tikuType) {
                this.onEmployeeKeyUp(null);
            }
        }
        if (this.lookupData) {
            this.defaultClassList = _.cloneDeep(this.lookupData['Dept_Class']);
            this.adhocList = _.cloneDeep(this.lookupData['ConditionCheck']);
            this.serviceRegularisedList = _.cloneDeep(this.lookupData['ConditionCheck']);
            this.gpscExamPassedList = _.cloneDeep(this.lookupData['ConditionCheck']);
            this.optionAvailedList = _.cloneDeep(this.lookupData['ConditionCheck']);
        }
        if (this.action === 'view' && this.employeeCurrentForm) {
            this.employeeCurrentForm.get('employeeNo').disable();
        }
    }

    /**
     * @method setTikuPayData
     * @description Function is called to set Tiku pay scale saved data
     */
    setTikuPayData() {
        const self = this;
        this.postForm.patchValue({
            tikuType: self.eventDetails.tikuType,
            adhocId: self.eventDetails.adhocId,
            adhocFromDate: self.eventDetails.adhocFromDate ? new Date(this.eventDetails.adhocFromDate) : null,
            adhocToDate: self.eventDetails.adhocToDate ? new Date(this.eventDetails.adhocToDate) : null,
            serviceRegularisedId: self.eventDetails.serviceRegularisedId,
            gpscExamPassedId: self.eventDetails.gpscExamPassedId,
            // tslint:disable-next-line: max-line-length
            gpscExamPassedDate: self.eventDetails.gpscExamPassedDate ? new Date(this.eventDetails.gpscExamPassedDate) : null,
            // tslint:disable-next-line: max-line-length
            dojRegularServiceDate: self.eventDetails.dojRegularServiceDate ? new Date(this.eventDetails.dojRegularServiceDate) : null,
            employeeClassId: self.eventDetails.employeeClassId,
            designationId: self.eventDetails.designationId,
            optionAvailableId: self.eventDetails.optionAvailableId,
            // tslint:disable-next-line:max-line-length
            optionAvailableDate: self.eventDetails.optAvailedDate ? new Date(this.eventDetails.optAvailedDate) : null,
            basicPay: self.eventDetails.basicPay,
            // tslint:disable-next-line:max-line-length
            benEffDate: self.eventDetails.benEffDate ? new Date(this.eventDetails.benEffDate) : null,
            // tslint:disable-next-line: max-line-length
            dateOfNextIncrement: self.eventDetails.dateOfNextIncrement ? new Date(this.eventDetails.dateOfNextIncrement) : null,
        });
        if (self.eventDetails.dateOfNextIncrement) {
            let datNxtIncr = self.eventDetails.dateOfNextIncrement.split('-');
            datNxtIncr = new Date(datNxtIncr[0], datNxtIncr[1] - 1, datNxtIncr[2]);
            this.postForm.patchValue({
                dateOfNextIncrement: datNxtIncr
            });
        }
        if (self.eventDetails.optionAvailableDate) {
            let optionAvailableDate = self.eventDetails.optionAvailableDate.split('-');
            optionAvailableDate = new Date(optionAvailableDate[0], optionAvailableDate[1] - 1, optionAvailableDate[2]);
            this.postForm.patchValue({
                optionAvailableDate: optionAvailableDate
            });
        }
        if (self.eventDetails.employeeNo) {
            self.previousEmployeeNo = self.eventDetails.employeeNo;
        } else {
            self.previousEmployeeNo = null;
        }
        if (this.postForm.get('optionAvailableId').value === 2) {
            if (this.eventForm.get('payCommId').value == 151) {
                this.optionalDataSource = new MatTableDataSource([{
                    PayAsonIncrementDate: this.postForm.get('optionAvailableDate').value,
                    payBand: this.eventDetails.payBandName,
                    gradePay: this.eventDetails.gradePayName,
                    payBandValue: this.postForm.get('payBandValue').value,
                    ...this.eventDetails
                }]);
            } else if (this.eventForm.get('payCommId').value == 152) {
                this.optionalDataSource = new MatTableDataSource([{
                    ...this.eventDetails,
                    PayAsonIncrementDate: this.postForm.get('optionAvailableDate').value,
                    payLevel: this.eventDetails.payLevelName,
                    cellId: this.eventDetails.oaCellIdValue,
                }]);
            } else if (this.eventForm.get('payCommId').value == 150) {
                this.optionalDataSource = new MatTableDataSource([{
                    ...this.eventDetails,
                    PayAsonIncrementDate: this.postForm.get('optionAvailableDate').value,
                    payScale: this.eventDetails.scaleName,
                }]);
            }
        }
    }

    /**
     * @method ngOnDestroy
     * @description Function is called when compnent is destroyed to take necessary calls on view destroy from browser
     * Kept for future purpose
     */
    ngOnDestroy() {
        this.subscriber.forEach(subscriber => {
            subscriber.unsubscribe();
        });
    }

    /**
     * @method onPayCommissionValueChange
     * @description Function is called when pay commission is changed
     * @param payCommId what pay commission is selected, that id is provided
     * @returns Show/Hide Fields on the selection of pay commission
     */
    onPayCommissionValueChange(payCommissionId) {
        // tslint:disable-next-line: max-line-length
        if (this.payCommSelected !== this.eventForm.get('payCommId').value && this.eventForm.get('payCommId').value && !this.employeeCurrentForm.controls.employeeNo.errors) {
            this.payCommSelected = this.eventForm.get('payCommId').value;
            if (this.tikuType) {
                this.enableEmployeeSearch = true;
                this.onEmployeeKeyUp(null);
            }
        }
        this.payCommSelected = payCommissionId;
        this.postForm.removeControl('payLevelId');
        this.postForm.removeControl('cellId');
        this.postForm.removeControl('payBandId');
        this.postForm.removeControl('payBandValue');
        this.postForm.removeControl('gradePayId');
        this.postForm.removeControl('payScale');
        this.isFifth = false;
        switch (payCommissionId) {
            case 148:
                // 3 comm
                break;
            case 149:
                // 4 comm
                break;
            case 150:
                // 5 comm
                this.isFifth = true;
                let payScaleValue = null;
                if (this.eventDetails && this.eventDetails.payScale) {
                    payScaleValue = this.eventDetails.payScale;
                }
                this.postForm.get('basicPay').enable();
                this.postForm.get('basicPay').setValidators(Validators.required);
                this.postForm.get('basicPay').updateValueAndValidity();
                this.postForm.addControl('payScale', new FormControl(payScaleValue, Validators.required));
                break;
            case 151:
                // 6 comm
                let payBandId = null,
                    payBandValue = null,
                    gradePayId = null;
                this.postForm.get('basicPay').disable();
                if (this.eventDetails) {
                    if (this.eventDetails.payBandId) {
                        payBandId = this.eventDetails.payBandId;
                    }
                    if (this.eventDetails.payBandValue) {
                        payBandValue = this.eventDetails.payBandValue;
                    }
                    if (this.eventDetails.gradePayId) {
                        gradePayId = this.eventDetails.gradePayId;
                    }
                }
                this.postForm.addControl('payBandId', new FormControl(payBandId, Validators.required));
                // tslint:disable-next-line: max-line-length
                this.postForm.addControl('payBandValue', new FormControl(payBandValue, Validators.required));
                this.postForm.addControl('gradePayId', new FormControl(gradePayId, Validators.required));
                this.postForm.get('payBandValue').disable();
                break;
            case 152:
                // 7 comm
                let payLevelId = null,
                    cellId = null;
                this.postForm.get('basicPay').disable();
                if (this.eventDetails) {
                    if (this.eventDetails.payLevelId) {
                        payLevelId = this.eventDetails.payLevelId;
                    }
                    if (this.eventDetails.cellId) {
                        cellId = this.eventDetails.cellId;
                    }
                }
                this.postForm.addControl('payLevelId', new FormControl(payLevelId, Validators.required));
                this.postForm.addControl('cellId', new FormControl(cellId, Validators.required));
                this.postForm.get('cellId').disable();
                break;
        }
        if (this.employeeDetails && this.payMasterData && this.payMasterData.data) {
            this.setCommList(payCommissionId);
        }
    }

    /**
     * @method setCommList
     * @description Function is called to set pay commission data to dropdown on what commission is selected
     * @param payCommissionId what pay commission is selected, that id is provided
     * @returns -
     */
    setCommList(payCommissionId) {
        switch (payCommissionId) {
            case 148:
                // 3 comm
                break;
            case 149:
                // 4 comm
                break;
            case 150:
                this.setFifthData(payCommissionId);
                // 5 comm
                break;
            case 151:
                this.setSixthData(payCommissionId);
                // 6 comm
                break;
            case 152:
                // 7 comm
                this.setSeventhData(payCommissionId);
                break;
        }
    }

    /**
     * @method setFifthData
     * @description Function is called to set fifth pay commission data
     * @param payCommissionId what pay commission is selected, that id is provided
     * @returns set fifth pay commission drop down field values
     */
    setFifthData(payCommissionId) {
        const scaleList = _.orderBy(_.cloneDeep(this.payMasterData.data), 'order', 'asc');
        if (this.employeeDetails) {
            if (this.employeeDetails.employee.payScale) {
                let currentPayScale = 0;
                scaleList.forEach((payScale, index) => {
                    if (payScale.id === Number(this.employeeDetails.employee.payScale)) {
                        currentPayScale = index;
                    }
                });
                if (currentPayScale || currentPayScale === 0) {
                    this.scaleList = _.cloneDeep(this.getListAccEvent(scaleList, currentPayScale));
                }
            }
            // tslint:disable-next-line:max-line-length
            if (this.employeeDetails && this.employeeDetails.employee && Number(this.previousEmployeeNo) !== Number(this.employeeDetails.employee.employeeNo)) {
                this.previousEmployeeNo = Number(this.employeeDetails.employee.employeeNo);
                this.postForm.get('payScale').patchValue(null);
            } else if (this.eventDetails) {
                // if (this.employeeDetails && this.employeeDetails.employee) {
                //     if (Number(this.eventDetails.payScale) !== Number(this.employeeDetails.employee.payScale)) {
                //         this.postForm.get('payScale').patchValue(this.employeeDetails.employee.payScale);
                //     }
                // } else {
                //     this.postForm.get('payScale').patchValue(this.eventDetails.payScale);
                // }
                // this.setFifthBasicParams();
                if (this.eventDetails.payScale) {
                    this.postForm.get('payScale').patchValue(this.eventDetails.payScale);
                    this.setFifthBasicParams();
                }
            }
        }
    }

    /**
     * @method setFifthBasicParams
     * @description Function is called to set fifth pay commission basic valdations
     */
    setFifthBasicParams(matEvent: any = null) {
        const self = this,
            fifthData = this.scaleList.filter((scale) => {
                return scale.id === Number(self.postForm.get('payScale').value);
            })[0];
        if (fifthData) {
            let payScaleName = fifthData.name;
            if (fifthData.name.includes('(')) {
                payScaleName = fifthData.name.split('(')[0];
                payScaleName = payScaleName.trim();
            }
            this.currentPayscaleSelected = payScaleName.split('-');
            this.fifthMin = Number(this.currentPayscaleSelected[0]);
            const paySelectedLength = this.currentPayscaleSelected.length;
            if (!isNaN(this.currentPayscaleSelected[paySelectedLength - 1])) {
                this.fifthMax = Number(this.currentPayscaleSelected[paySelectedLength - 1]);
            } else {
                this.fifthMax = Number(this.currentPayscaleSelected[0]);
            }
            // tslint:disable-next-line:max-line-length
            this.postForm.get('basicPay').setValidators([Validators.required, Validators.min(this.fifthMin), Validators.max(this.fifthMax)]);
            this.postForm.get('basicPay').updateValueAndValidity();
            if (this.postForm.get('basicPay').value) {
                this.calculateFifthBasic();
            }
        }
        if (matEvent && matEvent.value) {
            this.postForm.get('basicPay').reset();
            this.postForm.get('basicPay').updateValueAndValidity();
            this.computeFifththIncrement();
        }
    }

    /**
     * @method calculateFifthBasic
     * @description Function is called to check enetered basic fifth pay commission basic is correct or not
     */
    calculateFifthBasic() {
        if (this.postForm.controls.basicPay.errors) {
            return true;
        }
        const self = this,
            currentPaySel = self.postForm.get('basicPay').value;
        if (!isNaN(currentPaySel)) {
            const paySelectedLenth = this.currentPayscaleSelected.length;
            if (paySelectedLenth > 2) {
                for (let i = 2; i < paySelectedLenth; i += 2) {
                    // tslint:disable-next-line:max-line-length
                    if (Number(currentPaySel) >= Number(this.currentPayscaleSelected[i - 2]) && Number(currentPaySel) <= this.currentPayscaleSelected[i]) {
                        let diff = this.currentPayscaleSelected[i - 2] - currentPaySel;
                        diff /= this.currentPayscaleSelected[i - 1];
                        if (diff.toString().indexOf('.') !== -1) {
                            this.postForm.controls.basicPay.setErrors({
                                // tslint:disable-next-line:max-line-length
                                wrongValue: 'Please enter between ' + this.currentPayscaleSelected[i - 2] + '-' + this.currentPayscaleSelected[i] + ' in multiples of ' + this.currentPayscaleSelected[i - 1] + ' like ' + (Number(this.currentPayscaleSelected[i - 2]) + Number(this.currentPayscaleSelected[i - 1])) + ', ' + (Number(this.currentPayscaleSelected[i - 2]) + (Number(this.currentPayscaleSelected[i - 1])) * 2) + '...'
                            });
                            this.postForm.controls.basicPay.markAsTouched({ onlySelf: true });
                        }
                    }
                }
            }
        }
    }

    /**
     * @method setSixthData
     * @description Function is called to check set six pay commission data in dropdown
     * @param payCommissionId what pay commission is selected, that id is provided
     * @returns set six pay commission drop down field values
     */
    setSixthData(payCommissionId) {
        const sixData = _.orderBy(_.cloneDeep(this.payMasterData.data), 'order', 'asc');
        if (this.employeeDetails && this.employeeDetails.employee) {
            if (this.employeeDetails.employee.payBandId) {
                let currentPayScale = 0;
                sixData.forEach((payBand, index) => {
                    if (payBand.id === Number(this.employeeDetails.employee.payBandId)) {
                        currentPayScale = index;
                    }
                });
                if (currentPayScale || currentPayScale === 0) {
                    this.payBandList = _.cloneDeep(this.getListAccEvent(sixData, (currentPayScale - 1)));
                }
            }
        }

        // tslint:disable-next-line:max-line-length
        if (this.employeeDetails && this.employeeDetails.employee && Number(this.previousEmployeeNo) !== Number(this.employeeDetails.employee.employeeNo)) {
            this.previousEmployeeNo = Number(this.employeeDetails.employee.employeeNo);
            this.postForm.get('payBandId').patchValue(null);
            this.postForm.get('payBandValue').patchValue(null);
            this.postForm.get('gradePayId').patchValue(null);
        } else if (this.eventDetails) {
            if (this.eventDetails.payBandId) {
                this.postForm.get('payBandId').patchValue(this.eventDetails.payBandId);
            }
            if (this.eventDetails.payBandValue) {
                this.postForm.get('payBandValue').patchValue(this.eventDetails.payBandValue);
            }
            if (this.eventDetails.gradePayId) {
                this.postForm.get('gradePayId').patchValue(this.eventDetails.gradePayId);
            }
            this.onPayBandChange();
        }
    }

    /**
     * @method onPayBandChange
     * @description Function is called to take necessary action on values change of pay band
     */
    onPayBandChange() {
        const self = this,
            sixData = _.cloneDeep(this.payMasterData.data),
            payBandId = this.postForm.get('payBandId') ? this.postForm.get('payBandId').value : null;
        this.gradePayList = [];
        if (payBandId) {
            const gradePayData = sixData.filter((payBand) => {
                return payBand.id === payBandId;
            });
            const setSelectedPayBand = gradePayData[0];
            if (setSelectedPayBand) {
                this.calculateSixthBasicPay();
                if (!self.eventDetails || (self.eventDetails && self.eventDetails.payBandId !== payBandId)) {
                    this.postForm.get('basicPay').patchValue('');
                    this.postForm.get('gradePayId').patchValue('');
                }
                // tslint:disable-next-line:max-line-length
                this.postForm.get('payBandValue').setValidators([Validators.min(setSelectedPayBand.startingValue), Validators.max(setSelectedPayBand.endValue)]);
            }
            if (gradePayData[0]) {
                let gradePayIndex = -1;
                // tslint:disable-next-line:max-line-length
                if (this.employeeDetails && this.employeeDetails.employee && this.employeeDetails.employee.gradePayName) {
                    for (let i = 0; i < gradePayData[0].gradePays.length; i++) {
                        const gradePay = gradePayData[0].gradePays[i];
                        if (gradePay.gradePayValue === this.employeeDetails.employee.gradePayName) {
                            gradePayIndex = i;
                        }
                    }
                    this.gradePayList = _.cloneDeep(this.getListAccEvent(gradePayData[0].gradePays, gradePayIndex));
                } else {
                    this.gradePayList = _.cloneDeep(gradePayData[0].gradePays);
                }
            }
            if (this.eventDetails) {
                this.calculateSixthPayIncrement();
            }
        }
    }

    /**
     * @method onGradePayChange
     * @description Function is called to take necessary action on values change of grade pay
     */
    onGradePayChange() {
        const gradePayId = this.postForm.get('gradePayId').value;
        if (gradePayId) {
            this.calculateSixthBasicPayOnGrade();
        }
    }

    /**
     * @method calculateSixthBasicPayOnGrade
     * @description Function is called to calculate basic on selection of grade pay and pay band
     */
    calculateSixthBasicPayOnGrade() {
        const self = this;
        if (this.postForm.get('gradePayId').value && this.postForm.get('payBandValue').value) {
            // debugger;
            const gradPay = this.gradePayList.filter(gradePayObject => {
                return gradePayObject.id === this.postForm.get('gradePayId').value;
            })[0];
            let basicPay = 0;
            if (gradPay) {
                if (!isNaN(Number(gradPay.gradePayValue))) {
                    basicPay = Number(gradPay.gradePayValue);
                } else {
                    basicPay = 0;
                }
            }
            basicPay += Number(this.postForm.get('payBandValue').value);
            self.postForm.patchValue({
                basicPay: basicPay
            });
        }
    }

    /**
     * @method calculateSixthBasicPay
     * @description Function is called to get pay band and pay band value from server
     */
    calculateSixthBasicPay() {
        const self = this,
            params = {
                'request': {
                    'oldPayBandValue': this.employeeDetails.employee.payBandValue,
                    'oldGradePay': this.employeeDetails.employee.gradePayName,
                    'selectedPayBandId': this.postForm.get('payBandId').value,
                    'oldBasic': this.employeeDetails.employee.empBasicPay,
                    'optionalAvail': this.postForm.get('optionAvailableId').value === 2 ? 1 : 0
                }
            };
        this.eventService.calcHigherPaySixthBasic(params).subscribe(res => {
            if (res['result'] && res['status'] === 200) {
                self.postForm.patchValue({
                    payBandValue: res['result']['payBandValue'],
                });
                if (self.postForm.get('gradePayId').value) {
                    self.calculateSixthBasicPayOnGrade();
                }
            }
        });
    }

    /**
     * @method getListAccEvent
     * @description function return spliced array according to current index
     * @param data array of values needed to splice
     * @param index from which index the array elements should be taken
     */
    getListAccEvent(data, index) {
        return data.splice(index + 1);
    }

    /**
     * @method setSeventhData
     * @description Function is called to check set seven pay commission data in dropdown
     * @param payCommissionId what pay commission is selected, that id is provided
     * @returns set seven pay commission drop down field values
     */
    setSeventhData(payCommissionId) {
        const sevenData = _.orderBy(_.cloneDeep(this.payMasterData.data), 'order', 'asc');
        if (this.employeeDetails && this.employeeDetails.employee) {
            if (this.employeeDetails.employee.payLevelId) {
                let currentPayScale = 0;
                sevenData.forEach((payLevel, index) => {
                    if (payLevel.id === Number(this.employeeDetails.employee.payLevelId)) {
                        currentPayScale = index;
                    }
                });
                if (currentPayScale || currentPayScale === 0) {
                    this.payLevelList = _.cloneDeep(this.getListAccEvent(sevenData, currentPayScale));
                }
            }
        }
        // tslint:disable-next-line:max-line-length
        if (this.employeeDetails && this.employeeDetails.employee && Number(this.previousEmployeeNo) !== Number(this.employeeDetails.employee.employeeNo)) {
            this.previousEmployeeNo = Number(this.employeeDetails.employee.employeeNo);
            this.postForm.get('payLevelId').patchValue(null);
            this.postForm.get('cellId').patchValue(null);
        } else if (this.eventDetails) {
            if (this.eventDetails.cellId) {
                this.postForm.get('cellId').patchValue(this.eventDetails.cellId);
            }
            if (this.eventDetails.payLevelId) {
                this.postForm.get('payLevelId').patchValue(this.eventDetails.payLevelId);
                this.onPayLevelChange();
            }
        }
    }

    /**
     * @method onPayLevelChange
     * @description Function is called to take necessary actions on pay level change
     */
    onPayLevelChange() {
        const sevenData = _.cloneDeep(this.payMasterData.data),
            payLevelId = this.postForm.get('payLevelId') ? this.postForm.get('payLevelId').value : null;
        if (payLevelId) {
            const cellData = sevenData.filter((payBand) => {
                return payBand.id === payLevelId;
            });
            if (cellData[0]) {
                this.cellList = _.cloneDeep(cellData[0].cells);
            }
            // tslint:disable-next-line: max-line-length
            if (this.employeeDetails && this.employeeDetails.employee) {
                this.calculateSeventhBasicPay();
            }
            if (this.eventDetails) {
                this.calculateSeventhPayIncrement();
            }
        }
    }

    /**
     * @method calculateSeventhBasicPay
     * @description Function is called to assign cell id and basic pay from server when pay level is changed
     */
    calculateSeventhBasicPay() {
        const self = this,
            params = {
                'request': {
                    'oldPayLevelId': this.employeeDetails.employee.payLevelId,
                    'oldCellValue': this.employeeDetails.employee.empBasicPay,
                    'payLevelId': this.postForm.get('payLevelId').value,
                    'optionalAvail': this.postForm.get('optionAvailableId').value === 2 ? 1 : 0
                }
            };
        this.eventService.calcHigherPaySeventhBasic(params).subscribe(res => {
            if (res['result'] && res['status'] === 200) {
                self.postForm.patchValue({
                    cellId: res['result']['id'],
                    basicPay: res['result']['cellValue']
                });
            }
        });
    }

    /**
     * @method getPayMasters
     * @description Function is called to get all paymasters according to department category
     */
    getPayMasters() {
        const self = this,
            dataToSend = {
                request: {
                    departmentCategoryId: this.employeeDetails.employee.departmentCategoryId,
                    payCommissionId: this.eventForm.get('payCommId').value
                }
            };
        this.eventService.getPayMasters(dataToSend).subscribe(res => {
            if (res['status'] === 200 && res['result']) {
                self.payMasterData = res['result'];
                self.setCommList(self.eventForm.get('payCommId').value);
            } else {
                self.toastr.error(res['message']);
            }
        }, err => {
            self.toastr.error(err);
        });
    }

    saveDetails() {
        this.saveEvent.emit(this.optionAvailedData);
    }

    /**
     * @method getStatus
     * @description Function is called to get status if this post details can be save or submit
     * @returns boolean value for status
     */
    getStatus() {
        if (this.postForm.invalid) {
            _.each(this.postForm.controls, control => {
                if (control.status === 'INVALID') {
                    control.markAsTouched({ onlySelf: true });
                }
            });
            return false;
        } else {
            if (Number(this.postForm.get('basicPay').value) < Number(this.employeeDetails.employee.empBasicPay)) {
                this.toastr.error('Selected Employee is not eligible for Tiku Pay!');
            } else {
                if (!this.checkForPayChange()) {
                    return false;
                }
                return true;
            }
        }
    }

    /**
     * @method checkForPayChange
     * @description Function is called to check if pay details selected are valid or not
     * @returns boolean value for pay detail validation
     */
    checkForPayChange() {
        const payComm = this.eventForm.get('payCommId').value,
            postValue = this.postForm.getRawValue(),
            employeeDetail = this.employeeDetails ? this.employeeDetails.employee : null;
        if (this.postForm.get('optionAvailableId').value === 2) {
            switch (Number(this.eventForm.get('payCommId').value)) {
                case 150:
                    // tslint:disable-next-line:max-line-length
                    if (Number(postValue.basicPay) !== Number(employeeDetail.empBasicPay)) {
                        // tslint:disable-next-line:max-line-length
                        this.toastr.error('Employee\'s pay is getting higher so employee can\'t avail option!');
                        return false;
                    }
                    break;
                case 151:
                    // tslint:disable-next-line:max-line-length
                    if (Number(postValue.payBandValue) !== Number(employeeDetail.payBandValue)) {
                        // tslint:disable-next-line:max-line-length
                        this.toastr.error('Employee\'s pay is getting higher so employee can\'t avail option!');
                        return false;
                    }
                    break;
                case 152:
                    const cellId = Number(postValue.cellId);
                    const selectedCell = this.cellList.filter((cell) => Number(cell.id) === cellId);
                    if (selectedCell[0]) {
                        if (Number(postValue.basicPay) !== Number(employeeDetail.empBasicPay) &&
                            (Number(selectedCell[0].cellId) === 1)) {
                            this.toastr.error('Employee\'s pay is getting higher so employee can\'t avail option!');
                            return false;
                        }
                    }
                    break;
            }
        } else if (postValue.basicPay <= Number(employeeDetail.empBasicPay)) {
            switch (payComm) {
                case 150:
                    this.toastr.error('Please change Pay scale');
                    return false;
                case 151:
                    this.toastr.error('Please change Grade pay');
                    return false;
                case 152:
                    this.toastr.error('Please change Pay level');
                    return false;
            }
        }
        return true;
    }

    resetForm() {
        this.isResetClicked = true;
        this.clearEmployeeDetails();
        this.resetFormEvent.emit();
    }

    /**
     * @method openSearchEmployeeDialog
     * @description Function is called if search icon is click, This help in searchng employee from other parameters
     */
    openSearchEmployeeDialog() {
        if (this.enableEmployeeSearch) {
            // tslint:disable-next-line: no-use-before-declare
            // tslint:disable-next-line:max-line-length
            if ((this.eventDetails && this.eventDetails.statusId !== 205
                && this.eventDetails.statusId !== 0) || this.action === 'view') {
                return;
            }
            if (!this.employeeCurrentForm.controls.employeeNo.value) {
                const dialogRef = this.dialog.open(SearchEmployeeComponent, {
                    width: '800px',
                }),
                    self = this;

                dialogRef.afterClosed().subscribe(result => {
                    console.log('The dialog was closed', result);
                    if (result) {
                        self.employeeCurrentForm.patchValue({
                            employeeNo: result.employeeNo
                        });
                        self.empId = result.employeeId;
                        if (!this.eventForm.get('eventEffectiveDate').errors) {
                            self.checkForEligibility();
                        }
                    }
                });
            } else {
                if (!this.eventForm.get('eventEffectiveDate').errors) {
                    this.checkForEligibility();
                }
            }
        }
    }

    // setEnglishOnFocusOut() {
    //     SetEnglish();
    // }

    // toggleLanguage() {
    //     this.isLangChange = true;
    //     const elements = this.elem.nativeElement.querySelectorAll('.hasfocus')[0];
    //     if (elements !== undefined) {
    //         if (this.currentLang.value === 'Guj') {
    //             SetEnglish();
    //             this.currentLang.next('Eng');
    //         } else {
    //             SetGujarati();
    //             this.currentLang.next('Guj');
    //         }
    //         elements.focus();
    //     }
    // }

    calculateSeventhPayIncrement() {
        this.columnsToDisplay = [];
        this.columnsToDisplay.push({
            colHeader: 'Pay Level',
            key: 'payLevel'
        }, {
            colHeader: 'Cell ID',
            key: 'cellId'
        });
        this.displayedColumns = [];
        this.displayedColumns.push('PayAsonIncrementDate', 'Pay Level', 'Cell ID', 'Basic');
        this.computeSeventhIncrement();
        this.postForm.get('payLevelId').valueChanges
            .subscribe(res => {
                this.computeSeventhIncrement();
            });
    }
    /***
     * Used to calculate 6th pay commission
     */
    calculateSixthPayIncrement(): void {
        this.columnsToDisplay = [];
        this.columnsToDisplay.push({
            colHeader: 'Pay Band',
            key: 'payBand'
        }, {
            colHeader: 'Pay Band Value',
            key: 'oaPayBandValue'
        },
            {
                colHeader: 'Grade Pay',
                key: 'gradePay'
            });
        this.displayedColumns = [];
        this.displayedColumns.push('PayAsonIncrementDate', 'Pay Band', 'Pay Band Value', 'Grade Pay', 'Basic');
        this.computeSixthIncrement();
        merge(
            this.postForm.get('payBandId').valueChanges,
            this.postForm.get('payBandValue').valueChanges,
            this.postForm.get('gradePayId').valueChanges
        )
            .subscribe(res => {
                this.computeSixthIncrement();
            });
    }


    /**
      * Used to Seventh compute Increment
      */
    computeSeventhIncrement() {
        const self = this;

        const data = {
            cCellIdValue: +self.employeeDetails.employee.cellName,
            cPayLevelValue: +self.employeeDetails.employee.payLevelName,
            // pPayLevelValue: +seventhPayLevel[0].payLevelValue,
            payCommissionId: +this.eventForm.get('payCommId').value
        };
        const payLevelId = this.postForm.get('payLevelId').value;

        let seventhPayLevel;
        seventhPayLevel = this.payLevelList.filter((payBand) => Number(payBand.id) === Number(payLevelId));
        if (payLevelId) {
            data['pPayLevelValue'] = seventhPayLevel[0].payLevelValue;
        }
        if (this.postForm.get('payLevelId').value) {
            this.eventService.calculateOptionAvailedYes(data).subscribe(res => {
                if (res['status'] === 200 && res['result'] !== null) {
                    this.optionalDataSource = new MatTableDataSource([{
                        PayAsonIncrementDate: this.postForm.get('optionAvailableDate').value,
                        payLevel: seventhPayLevel[0].payLevelValue,
                        cellId: res['result']['pCellIdValue'],
                        ...res['result']
                    }]);
                const oaCellIdValue = this.payLevelList.
                    find((paylevel) => (paylevel.payLevelValue) === (res['result']['pPayLevelValue']));
                this.optionAvailedData = {
                    oaBasicPayValue: res['result']['oaBasicPayValue'],
                    oaPayLevelId: oaCellIdValue.id,
                    oaCellIdValue: res['result']['pCellIdValue'],
                    oaPayCellId: res['result']['pPayCellId']
                };
                }
            });
        }
    }
    /***
     * Used to calculate 5th pay commission
     */
    calculateFifthPayIncrement(): void {
        this.columnsToDisplay = [];
        this.columnsToDisplay.push({
            colHeader: 'pay scale',
            key: 'payScale'
        });
        this.displayedColumns = [];
        this.displayedColumns.push('PayAsonIncrementDate', 'pay scale', 'Basic');
        this.computeFifththIncrement();
    }

    /**
    * Used to Sixth compute Increment
    */
    computeSixthIncrement() {

        const self = this;
        const data = {
            cGradePayId: +self.employeeDetails.employee.gradePayId,
            cPayBandId: +self.employeeDetails.employee.payBandId,
            pPayBandId: +this.postForm.get('payBandId').value,
            pGradePayId: +this.postForm.get('gradePayId').value,
            pPayBandValue: +this.postForm.get('payBandValue').value,
            payCommissionId: +this.eventForm.get('payCommId').value,
            empDeptCatId: this.employeeDetails.employee.departmentCategoryId
        };
        if (this.employeeDetails.employee.departmentCategoryId === 17) {
            if (this.postForm.get('payBandId').value) {
                this.eventService.calculateOptionAvailedYes(data).subscribe(res => {
                    if (res['status'] === 200 && res['result'] !== null) {
                        const selectedPayBand = this.payBandList.
                            filter((payBand) => Number(payBand.id) === data.pPayBandId);
                        this.optionalDataSource = new MatTableDataSource([{
                            PayAsonIncrementDate: this.postForm.get('optionAvailableDate').value,
                            payBand: selectedPayBand[0].payBandName,
                            payBandValue: this.postForm.get('payBandValue').value,
                            ...res['result']
                        }]);
                        this.optionAvailedData = {
                            oaBasicPayValue: res['result']['oaBasicPayValue'],
                            oaPayBandId: res['result']['pPayBandId'],
                            oaPayBandValue: res['result']['oaPayBandValue'],
                            oaGradePayId: res['result']['pGradePayId']
                        };
                    }
                });
            } else {
                this.optionalDataSource = new MatTableDataSource([]);
            }
        } else {
            if (this.postForm.get('payBandId').value && this.postForm.get('gradePayId').value) {
                this.eventService.calculateOptionAvailedYes(data).subscribe(res => {
                    if (res['status'] === 200 && res['result'] !== null) {
                        const selectedPayBand = this.payBandList.
                            filter((payBand) => Number(payBand.id) === data.pPayBandId);
                        const selectedGradePay = this.gradePayList.
                            filter((gradePay) => Number(gradePay.id) === data.pGradePayId);
                        this.optionalDataSource = new MatTableDataSource([{
                            PayAsonIncrementDate: this.postForm.get('optionAvailableDate').value,
                            payBand: selectedPayBand[0].payBandName,
                            payBandValue: this.postForm.get('payBandValue').value,
                            gradePay: selectedGradePay[0].gradePayValue,
                            ...res['result']
                        }]);
                        this.optionAvailedData = {
                            oaBasicPayValue: res['result']['oaBasicPayValue'],
                            oaPayBandId: res['result']['pPayBandId'],
                            oaPayBandValue: res['result']['oaPayBandValue'],
                            oaGradePayId: res['result']['pGradePayId']
                        };
                    }
                });
            } else {
                this.optionalDataSource = new MatTableDataSource([]);
            }
        }
    }
    /**
     * Used to Fifth compute Increment
     */
    computeFifththIncrement(basicPay?: AbstractControl) {
        const self = this;
        const data = {
            cPayScaleId: +self.employeeDetails.employee.payScale,
            pBasicPayValue: +this.postForm.get('basicPay').value,
            pPayScaleId: this.postForm.get('payScale').value,
            payCommissionId: this.eventForm.get('payCommId').value
        };
        if (this.postForm.get('payScale').value && this.postForm.get('basicPay').value && this.optionValid) {
            if (this.postForm.get('basicPay').valid || (basicPay && basicPay.valid)) {
                const selectedScale = this.scaleList.filter((scale) => Number(scale.id) === data.pPayScaleId);
                this.eventService.calculateOptionAvailedYes(data).subscribe(res => {
                    if (res['status'] === 200 && res['result'] !== null) {
                        this.optionalDataSource = new MatTableDataSource([{
                            PayAsonIncrementDate: this.postForm.get('optionAvailableDate').value,
                            payScale: selectedScale[0].name,
                            ...res['result']
                        }]);
                        this.optionAvailedData = {
                            oaBasicPayValue: res['result']['oaBasicPayValue'],
                            oaPayScaleId: res['result']['pPayScaleId']
                        };
                    }
                });
            } else {
                this.optionalDataSource = new MatTableDataSource([]);
            }
        } else {
            this.optionalDataSource = new MatTableDataSource([]);
        }
    }
    /**
 * @description changes the value in datasource of optionAvail
 */
    optionAvailDateChanged() {
        if (this.postForm.get('optionAvailableId') && this.postForm.get('optionAvailableId').value === 2
            && this.postForm.get('optionAvailableDate') && this.postForm.get('optionAvailableDate').value) {
            const optDataSource = this.optionalDataSource.data;
            if (optDataSource && optDataSource.length > 0) {
                optDataSource[0]['PayAsonIncrementDate'] = this.postForm.get('optionAvailableDate').value;
                this.optionalDataSource = new MatTableDataSource(optDataSource);
            }
        }
    }
}
