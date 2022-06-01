import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { PvuCommonService } from './../services/pvu-common.service';
import { Subscription } from 'rxjs';
import { SENIOR_SCALE_EVENT_ERRORS } from './../index';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Component, OnInit, Input, OnDestroy, OnChanges, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';

@Component({
    selector: 'app-change-of-scale',
    templateUrl: './change-of-scale.component.html',
    styleUrls: ['./change-of-scale.component.css']
})
export class ChangeOfScaleComponent implements OnInit, OnDestroy, OnChanges {
    @Input() eventForm: FormGroup;
    @Input() action: string;
    @Input() eventType: string;
    @Input() eventDetails: any;
    @Input() pvuScreen: boolean = false;
    @Input() isRework: boolean = false;
    @Output() saveEvent: EventEmitter<any> = new EventEmitter();
    @Output() resetEvent: EventEmitter<any> = new EventEmitter();
    @Output() employeeDetailChange: EventEmitter<any> = new EventEmitter();
    showExamDetails: boolean = false;
    employeeDetails: any;
    payMasterData: any;
    payBandCtrl: FormControl = new FormControl();
    gradePayCtrl: FormControl = new FormControl();
    payLevelCtrl: FormControl = new FormControl();
    cellIdCtrl: FormControl = new FormControl();
    scaleCtrl: FormControl = new FormControl();
    setSelectedPayBand: any;
    payLevelList = [];
    cellList = [];
    payBandList = [];
    gradePayList = [];
    title: string = 'Post Details';
    scaleList = [];
    notionalForm: FormGroup;
    postForm: FormGroup;
    empId: number;
    subscriber: Subscription[] = [];
    errorMessage = SENIOR_SCALE_EVENT_ERRORS;

    eligible: boolean = false;
    eventEffectiveDate: Date;
    actualMinDate: Date;
    lookUpData;
    startDateLesser = false;
    isFifth: boolean = false;
    currentPayscaleSelected: any = [];
    fifthMin: number = 0;
    fifthMax: number = 0;
    clearEmployeeCurrentDetails = false;
    todayDate: Date;
    notionalToFromDate: Date;
    notionalToMinDate: Date;
    effDate: any;
    notionalFromDate: Date;
    previousEmployeeNo;
    postBasicPay;
    currentBasicPay;
    isJudiciaryDepartment: boolean = false;

    constructor(
        private fb: FormBuilder,
        private eventService: PvuCommonService,
        private dialog: MatDialog,
        private toastr: ToastrService
    ) { }

    /**
     * @description Call when component is load
     */
    ngOnInit() {
        const self = this;
        this.creatEmployeeForm();
        // this.postForm.disable();
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
        if (self.action === 'view') {
            this.postForm.disable();
        }
    }

    /**
    * @description selected value from date picker on event effective date field
    * @param res selected date value
    */
    onEventEffectiveDateChange(res) {
        const self = this;
        this.todayDate = new Date();
        this.effDate = _.cloneDeep(res);
        self.eventEffectiveDate = res;
        this.postForm.patchValue({
            benefitEffectiveDate: self.eventEffectiveDate
        });
        if (this.effDate > this.todayDate) {
            self.actualMinDate = this.effDate;
        } else {
            self.actualMinDate = this.todayDate;
        }

        this.postForm.get('benefitEffectiveDate').disable();
    }

    /**
     * @description form creation and set validators
     */
    creatEmployeeForm() {
        const self = this;
        if (this.eventForm) {
            this.eventForm.removeControl('postForm');
            this.eventForm.removeControl('notionalForm');
            this.eventForm.addControl('postForm', self.fb.group({
                basicPay: [''],
                dateOfNextIncrement: [''],
                benefitEffectiveDate: ['']
            }));
            self.eventForm.addControl('notionalForm', this.fb.group({
                notionalFromDate: [''],
                notionalToDate: [''],
                duration: [''],
            }));
        } else {
            this.eventForm = self.fb.group({
                postForm: self.fb.group({
                    basicPay: [''],
                    dateOfNextIncrement: [''],
                    benefitEffectiveDate: ['']
                }),
                notionalForm: self.fb.group({
                    notionalFromDate: [''],
                    notionalToDate: [''],
                    duration: [''],
                })
            });
        }
        this.postForm = this.eventForm.get('postForm') as FormGroup;
        this.notionalForm = this.eventForm.get('notionalForm') as FormGroup;
        if (self.eventDetails && this.postForm) {
            this.postForm.patchValue({
                basicPay: self.eventDetails.basicPay,
                // tslint:disable-next-line:max-line-length
                benefitEffectiveDate: self.eventDetails.benefitEffectiveDate ? new Date(self.eventDetails.benefitEffectiveDate) : null,
                // tslint:disable-next-line:max-line-length
                dateOfNextIncrement: self.eventDetails.dateOfNextIncrement ? new Date(self.eventDetails.dateOfNextIncrement) : null
            });
            this.setEventPostData();
        }
    }

    /**
    * @method checkForEligibility
    * @description Function is called to check eligibility of employee searched
    * as he is applicable for promotion or not
    */
    checkForEligibility() {
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
            this.eventService.checkforEligibility(params).subscribe(res => {
                if (res['status'] === 200 && res['result'] !== null) {
                    self.eligible = res['result'];
                    self.setDateOfNxtIncr();
                } else {
                    self.toastr.error(res['message']);
                }
            }, err => {
                self.toastr.error(err);
            });
        } else {
            self.eligible = false;
            self.setDateOfNxtIncr();
        }
    }

    /**
     * @method setDateOfNxtIncr
     * @description Function is called to set date of next increment
     */
    setDateOfNxtIncr() {
        const eventDetail = this.eventForm.getRawValue(),
            payComm = eventDetail.payCommId;
        // this.postBasicPay = this.postForm.value.basicPay;
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
                    if (doi) {
                        const currentBasic = Number(this.employeeDetails.employee.empBasicPay);
                        let postbasic = Number(this.postForm.get('basicPay').value);
                        postbasic = !this.pvuScreen ?
                            (postbasic + Number(this.postForm.get('personalPay').value)) : postbasic;
                        if (postbasic && (currentBasic < postbasic)) {
                            this.postForm.patchValue({
                                dateOfNextIncrement: new Date(doi.getFullYear() + 1, doi.getMonth(), doi.getDate())
                            });
                        } else {
                            this.postForm.patchValue({
                                dateOfNextIncrement: doi
                            });
                        }
                    }
                }
                break;
            case 151:
                // 6 comm
                this.currentBasicPay = Number(eventDetail.employeeCurrentForm.payBandValue);
                if (this.eligible) {
                    if (doi) {
                        this.postForm.patchValue({
                            dateOfNextIncrement: doi
                        });
                    }
                } else {
                    if (this.postBasicPay && this.currentBasicPay !== this.postBasicPay) {
                        if (doi) {
                            this.postForm.patchValue({
                                dateOfNextIncrement: new Date(doi.getFullYear() + 1, 6, 1)
                            });
                        }
                    } else {
                        if (doi) {
                            this.postForm.patchValue({
                                dateOfNextIncrement: doi
                            });
                        }
                    }
                }
                break;
            case 152:
                // 7 comm
                this.currentBasicPay = Number(eventDetail.employeeCurrentForm.basicPay);
                if (this.eligible) {
                    if (doi) {
                        this.postForm.patchValue({
                            dateOfNextIncrement: doi
                        });
                    }
                } else {
                    let month;
                    if (this.postBasicPay && this.currentBasicPay !== this.postBasicPay) {
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
                    } else {
                        if (doi) {
                            this.postForm.patchValue({
                                dateOfNextIncrement: doi
                            });
                        }
                    }
                }
                break;
        }
        // this.postForm.get('dateOfNextIncrement').disable();
    }

    /**
     * @description get employee details from employeen current details component
     * @param empl employee details
     */
    onEmployeeDetailsChange(empl) {
        this.employeeDetails = empl;
        if (this.eventForm.get('payCommId').value && this.payMasterData && this.payMasterData.data) {
            this.setCommList(this.eventForm.get('payCommId').value);
        }
        if (this.postForm.get('cellId')) {
            this.postForm.get('cellId').disable();
            this.postForm.get('personalPay').disable();
        }
        this.clearEmployeeCurrentDetails = false;
        if (this.employeeDetails && this.employeeDetails.employee) {
            if ((this.employeeDetails.employee.departmentCategoryId === 17 )
                && this.eventForm.get('payCommId').value === 151) {
                this.isJudiciaryDepartment = true;
            } else {
                this.isJudiciaryDepartment = false;
            }
            // tslint:disable-next-line:max-line-length
            if (this.employeeDetails.employee.dateNxtIncr && !(this.employeeDetails.employee.dateNxtIncr instanceof Date)) {
                let datNxtIncr;
                if (this.employeeDetails.employee.dateNxtIncr.indexOf(' ') !== -1) {
                    datNxtIncr = this.employeeDetails.employee.dateNxtIncr.split(' ')[0].split('-');
                    datNxtIncr = new Date(datNxtIncr[0], datNxtIncr[1] - 1, datNxtIncr[2]);
                } else if (this.employeeDetails.employee.dateNxtIncr.indexOf('T') !== -1) {
                    datNxtIncr = this.employeeDetails.employee.dateNxtIncr.split('T')[0].split('-');
                    datNxtIncr = new Date(datNxtIncr[0], datNxtIncr[1] - 1, datNxtIncr[2]);
                }
                this.postForm.patchValue({
                    dateOfNextIncrement: datNxtIncr
                });
            }
            // this.postForm.get('dateOfNextIncrement').disable();
            this.getPayMasters();
            // this.setDateOfNxtIncr();
            this.checkEmployeeEligibility();
        }
        this.employeeDetailChange.emit(empl);
    }

    /**
    * @method checkEmployeeEligibility
    * @description Function is called to check eligibility of employee searched
    * as he is applicable for promotion or not on basis of class selection and
    * he has undergone for promotion forgo or not
    */
    checkEmployeeEligibility() {
        this.onEmployeeEligible();
    }

    /**
    * @method onEmployeeEligible
    * @description Function is called to perform further on employee eligibility
    */
    onEmployeeEligible() {
        if (this.action !== 'view') {
            this.postForm.enable();
            if (!this.postForm.get('payBandId') && this.pvuScreen) {
                this.postForm.get('personalPay').disable();
            }
        } else {
            this.postForm.disable();
        }
        if (this.postForm.get('cellId')) {
            this.postForm.get('cellId').disable();
            // this.postForm.get('personalPay').disable();
        }
        if (this.employeeDetails && this.employeeDetails.employee) {
            this.checkForEligibility();
        }
    }

    /**
     * @description pass save event details
     */
    saveDetails() {
        this.saveEvent.emit();
    }

    /**
     * @description event details can be reset when reset button is clicked
     */
    resetForm() {
        // this.clearEmployeeCurrentDetails = true;
        this.resetEvent.emit();
    }

    /**
     * @description calculate duration based on notion form date and to date
     */
    setEventPostData() {
        const self = this;
        self.postForm.patchValue({
            basicPay: self.eventDetails.basicPay
        });
        if (this.isFifth) {
            self.postForm.patchValue({
                personalPay: self.eventDetails.personalPay
            });
        }
        this.notionalFromDate = self.eventDetails.notionalFromDate.split('-');
        let notionalToDate = self.eventDetails.notionalToDate.split('-');
        this.notionalFromDate = new Date(this.notionalFromDate[0], this.notionalFromDate[1] - 1,
            this.notionalFromDate[2]);
        notionalToDate = new Date(notionalToDate[0], notionalToDate[1] - 1, notionalToDate[2]);
        self.notionalForm.patchValue({
            'notionalFromDate': this.notionalFromDate,
            'notionalToDate': notionalToDate,
            'duration': self.eventDetails.duration
        });
        if (this.notionalFromDate && self.action === 'edit') {
            self.notionalToMinDate = this.notionalFromDate;
        } else {
            self.notionalToMinDate = self.actualMinDate;
        }

        if (self.action === 'view') {
            this.notionalForm.get('notionalFromDate').disable();
            this.notionalForm.get('notionalToDate').disable();
        }

        let datNxtIncr = self.eventDetails.dateOfNextIncrement.split('-');
        let benefitEffectiveDate = self.eventDetails.eventEffectiveDate.split('-');
        datNxtIncr = new Date(datNxtIncr[0], datNxtIncr[1] - 1, datNxtIncr[2]);
        benefitEffectiveDate = new Date(benefitEffectiveDate[0], benefitEffectiveDate[1] - 1, benefitEffectiveDate[2]);
        self.postForm.patchValue({
            benefitEffectiveDate: benefitEffectiveDate,
            dateOfNextIncrement: datNxtIncr
        });
    }

    /**
     * @description get all paymasters according to department category
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

    /**
     * @description based on paycommissionId update basic pay, payscale and personal pay value
     * @param payCommissionId number pay commission selected based on id
     */
    onPayCommissionValueChange(payCommissionId) {
        const self = this;
        this.postForm.removeControl('payLevelId');
        this.postForm.removeControl('cellId');
        self.postForm.removeControl('personalPay');
        this.postForm.removeControl('payBandId');
        this.postForm.removeControl('payBandValue');
        this.postForm.removeControl('gradePayId');
        this.postForm.removeControl('payScale');
        this.postForm.get('basicPay').setValidators(null);
        this.postForm.get('basicPay').updateValueAndValidity();
        this.isFifth = false;
        let personalPay = null;
        switch (payCommissionId) {
            case 148:
                // 3 comm
                break;
            case 149:
                // 4 comm
                break;
            case 150:
                // 5 comm
                this.postForm.get('basicPay').setValidators(Validators.required);
                this.postForm.get('basicPay').updateValueAndValidity();
                this.isFifth = true;
                let payScaleValue = null;
                if (this.eventDetails) {
                    if (this.eventDetails.payScale) {
                        payScaleValue = this.eventDetails.payScale;
                    }
                    if (this.eventDetails.personalPay) {
                        personalPay = this.eventDetails.personalPay;
                    }
                }
                this.postForm.get('basicPay').enable();

                this.postForm.addControl('personalPay', new FormControl(personalPay, Validators.required));
                this.postForm.addControl('payScale', new FormControl(payScaleValue, Validators.required));
                if (this.pvuScreen || this.eventType === 'Change_of_Scale_PVU' && self.action === 'edit') {
                    this.postForm.get('personalPay').disable();
                    // this.notionalForm.get('notionalToDate').disable();
                }
                break;
            case 151:
                let payBandId = null,
                    payBandValue = null,
                    gradePayId = null;
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
                this.postForm.addControl('payBandValue', new FormControl(payBandValue));
                this.postForm.addControl('gradePayId', new FormControl(gradePayId, Validators.required));
                // 6 comm
                break;
            case 152:
                // 7 comm
                let payLevelId = null,
                    cellId = null;
                personalPay = null;
                if (this.eventDetails) {
                    if (this.eventDetails.payLevelId) {
                        payLevelId = this.eventDetails.payLevelId;
                    }
                    if (this.eventDetails.cellId) {
                        cellId = this.eventDetails.cellId;
                    }
                    if (this.eventDetails.personalPay) {
                        personalPay = this.eventDetails.personalPay;
                    }
                }
                this.postForm.addControl('payLevelId', new FormControl(payLevelId, Validators.required));
                this.postForm.addControl('cellId', new FormControl(cellId, Validators.required));
                this.postForm.addControl('personalPay', new FormControl(personalPay, Validators.required));
                this.postForm.get('cellId').disable();
                this.postForm.get('personalPay').disable();
                break;
        }
        if (this.employeeDetails) {
            this.setCommList(payCommissionId);
        }
    }

    /**
     * @description pass paycommissionId for call paycommission functions
     * @param payCommissionId what pay commission is selected, that id is provided
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
     * @description set 5th pay commission data
     */
    setFifthData(payCommissionId) {
        const scaleList = _.orderBy(_.cloneDeep(this.payMasterData.data), 'order', 'asc');
        // _.orderBy(scaleList, 'order', 'asc');
        if (this.employeeDetails) {
            if (this.employeeDetails.employee.payScale) {
                let currentPayScale;
                scaleList.forEach((payScale, index) => {
                    if (payScale.id === Number(this.employeeDetails.employee.payScale)) {
                        currentPayScale = index;
                    }
                });
                if (currentPayScale || currentPayScale === 0) {
                    this.scaleList = _.cloneDeep(this.getListAccEvent(scaleList, currentPayScale));
                }
            }
            if (this.eventDetails) {
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
    setFifthBasicParams() {
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
                this.calculateFifthBasic(this.postForm.get('basicPay'));
            }
        }
    }

    /**
     * @method calculateFifthBasic
     * @description Function is called to check enetered basic fifth pay commission basic is correct or not
     */
    calculateFifthBasic(control: AbstractControl) {
        if (control.errors) {
            return true;
        }
        const currentPaySel = control.value;
        if (!isNaN(currentPaySel)) {
            const paySelectedLenth = this.currentPayscaleSelected.length;
            if (paySelectedLenth > 2) {
                for (let i = 2; i < paySelectedLenth; i += 2) {
                    // tslint:disable-next-line:max-line-length
                    if (Number(currentPaySel) >= Number(this.currentPayscaleSelected[i - 2]) && Number(currentPaySel) <= this.currentPayscaleSelected[i]) {
                        let diff = this.currentPayscaleSelected[i - 2] - currentPaySel;
                        diff /= this.currentPayscaleSelected[i - 1];
                        if (diff.toString().indexOf('.') !== -1) {
                            control.setErrors({
                                // tslint:disable-next-line:max-line-length
                                wrongValue: 'Please enter between ' + this.currentPayscaleSelected[i - 2] + '-' + this.currentPayscaleSelected[i] + ' in multiples of ' + this.currentPayscaleSelected[i - 1] + ' like ' + (Number(this.currentPayscaleSelected[i - 2]) + Number(this.currentPayscaleSelected[i - 1])) + ', ' + (Number(this.currentPayscaleSelected[i - 2]) + (Number(this.currentPayscaleSelected[i - 1])) * 2) + '...'
                            });
                            control.markAsTouched({ onlySelf: true });
                        } else {
                            this.setDateOfNxtIncr();
                        }
                    }
                }
            }
        }
    }

    setCurrentPayValidation(fifthData, control) {
        if (fifthData) {
            let payScaleName = fifthData.payBandName;
            if (fifthData.payBandName.includes('(')) {
                payScaleName = fifthData.payBandName.split('(')[0];
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
            control.setValidators([Validators.required,
            Validators.min(this.fifthMin), Validators.max(this.fifthMax)]);
            control.updateValueAndValidity();
            if (control.value) {
                this.calculateFifthBasic(control);
            }
        }
    }

    /**
     * @description set pay band value for 6th pay commission
     * @param payCommissionId what pay commission is selected, that id is provided
     */
    setSixthData(payCommissionId) {
        const sixData = _.orderBy(_.cloneDeep(this.payMasterData.data), 'order', 'asc');
        // _.orderBy(sixData, 'order', 'asc');
        if (this.employeeDetails && this.employeeDetails.employee) {
            if (this.employeeDetails.employee.payBandId) {
                let currentPayScale = 0;
                sixData.forEach((payBand, index) => {
                    if (payBand.id === Number(this.employeeDetails.employee.payBandId)) {
                        currentPayScale = index;
                    }
                });
                if (currentPayScale || currentPayScale === 0) {
                    // if (currentPayScale !== 0) {
                    currentPayScale -= 1;
                    // }
                    this.payBandList = _.cloneDeep(this.getListAccEvent(sixData, currentPayScale));
                    // this.payBandList = sixData.splice(currentPayScale);
                }
            }
        }

        if (this.eventDetails) {
            if ((this.eventDetails.departmentCategoryId && (this.eventDetails.departmentCategoryId === 17) )
                && this.eventForm.get('payCommId').value === 151) {
                this.isJudiciaryDepartment = true;
            } else {
                this.isJudiciaryDepartment = false;
            }
            if (this.eventDetails.payBandId) {
                this.postForm.get('payBandId').patchValue(this.eventDetails.payBandId);
                this.postForm.get('payBandValue').patchValue(this.eventDetails.payBandValue);
                this.postForm.get('gradePayId').patchValue(this.eventDetails.gradePayId);
                this.onPayBandChange();
                // this.calculateBasicPay();
            }
        }
    }

    /**
     * @description removed item based on index from data
     * @param data First Arg Array Provided
     * @param index Second Arg index value extrcted
     * @returns get the Extracted Array result
     */
    getListAccEvent(data, index) {
        return data.splice(index + 1);
    }

    /**
     * @description Higher grade pay values display based on pay band selection
     */
    onPayBandChange() {
        const self = this,
            sixData = _.cloneDeep(this.payMasterData.data),
            payBandId = this.postForm.get('payBandId') ? this.postForm.get('payBandId').value : null;
        self.gradePayList = [];
        if (payBandId) {
            const gradePayData = sixData.filter((payBand) => {
                return payBand.id === payBandId;
            });
            const setSelectedPayBand = gradePayData[0];
            if (!self.eventDetails || (self.eventDetails && self.eventDetails.payBandId !== payBandId)) {
                this.postForm.get('basicPay').patchValue('');
                this.postForm.get('gradePayId').patchValue('');
            }
            // tslint:disable-next-line:max-line-length
            this.postForm.get('payBandValue').setValidators([Validators.min(setSelectedPayBand.startingValue), Validators.max(setSelectedPayBand.endValue)]);
            if (setSelectedPayBand.startingValue > this.employeeDetails.employee.payBandValue) {
                if (this.eventDetails && Number(this.eventDetails.payBandId) === Number(payBandId)) {
                    this.postForm.get('payBandValue').patchValue(this.eventDetails.payBandValue);
                } else {
                    this.postForm.get('payBandValue').patchValue(setSelectedPayBand.startingValue);
                }
            } else {
                if (this.eventDetails && Number(this.eventDetails.payBandId) === Number(payBandId)) {
                    this.postForm.get('payBandValue').patchValue(this.eventDetails.payBandValue);
                } else {
                    this.postForm.get('payBandValue').patchValue(this.employeeDetails.employee.payBandValue);
                }
            }
            if (gradePayData[0]) {
                let gradePayIndex = -1;
                if (this.employeeDetails && this.employeeDetails.employee &&
                    this.employeeDetails.employee.gradePayName) {
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
            if (this.isJudiciaryDepartment) {
                if (setSelectedPayBand.gradePays && setSelectedPayBand.gradePays[0]) {
                    this.postForm.get('gradePayId').patchValue(setSelectedPayBand.gradePays[0].id);
                }
                this.setCurrentPayValidation(setSelectedPayBand, this.postForm.get('payBandValue'));
                if (this.postForm.get('payBandValue')) {
                    this.onGradePayChange();
                }
            } else {
                this.calculateSixthBasicPayOnGrade();
            }
            this.postBasicPay = Number(this.postForm.value.payBandValue);
            this.setDateOfNxtIncr();
        }
    }

    /**
     * @description basic pay calculation based on gradePayChange selection
     */
    onGradePayChange() {
        const self = this,
            gradePayId = self.postForm.get('gradePayId').value;
        if (gradePayId) {
            self.calculateSixthBasicPayOnGrade();
        }
    }

    /**
     * @description calculate Basic pay for 6th pay commission
     */
    calculateSixthBasicPayOnGrade() {
        const self = this;
        if (this.postForm.get('gradePayId').value && this.postForm.get('payBandValue').value) {
            const gradPay = this.gradePayList.filter(gradePayObject => {
                return gradePayObject.id === this.postForm.get('gradePayId').value;
            })[0];
            let basicPay = 0;
            if (gradPay) {
                if (!isNaN(gradPay.gradePayValue)) {
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

    onPayBandValueChange(control: AbstractControl) {
        this.calculateFifthBasic(control);
        if (!control.errors) {
            this.calculateSixthBasicPayOnGrade();
        }
    }

    /**
     * @description pay level values
     * @param payCommissionId number
     */
    setSeventhData(payCommissionId) {
        const sevenData = _.orderBy(_.cloneDeep(this.payMasterData.data), 'order', 'asc');
        // _.orderBy(sevenData, 'order', 'asc');
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
        if (this.eventDetails) {
            if (this.eventDetails.payLevelId) {
                this.postForm.get('payLevelId').patchValue(this.eventDetails.payLevelId);
                this.postForm.get('cellId').patchValue(this.eventDetails.cellId);
                this.onPayLevelChange();
            }
        }
    }

    /**
     * @description Based on pay level selection calculate seventh basic pay
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
            if (this.employeeDetails && this.employeeDetails.employee) {
                this.calculateSeventhBasicPay();
            }
        }
    }

    /**
     * @description calculate seventh pay
     */
    calculateSeventhBasicPay() {
        const self = this,
            params = {
                'request': {
                    'oldPayLevelId': this.employeeDetails.employee.payLevelId,
                    'oldCellValue': this.employeeDetails.employee.empBasicPay,
                    'payLevelId': this.postForm.get('payLevelId').value,
                    'optionalAvail': 0
                }
            };
        if (!this.pvuScreen) {
            this.eventService.calcSeventhBasic(params, self.eventType).subscribe(res1 => {
                if (res1['result'] && res1['status'] === 200) {
                    if (res1['result']['changeDNI']) {
                        this.setDateOfNxtIncr();
                    } else {
                        if (this.employeeDetails.employee.dateNxtIncr) {
                            let datNxtIncr;
                            if (this.employeeDetails.employee.dateNxtIncr.indexOf(' ') !== -1) {
                                datNxtIncr = this.employeeDetails.employee.dateNxtIncr.split(' ')[0].split('-');
                                datNxtIncr = new Date(datNxtIncr[0], datNxtIncr[1] - 1, datNxtIncr[2]);
                            } else if (this.employeeDetails.employee.dateNxtIncr.indexOf('T') !== -1) {
                                datNxtIncr = this.employeeDetails.employee.dateNxtIncr.split('T')[0].split('-');
                                datNxtIncr = new Date(datNxtIncr[0], datNxtIncr[1] - 1, datNxtIncr[2]);
                            }
                            self.postForm.patchValue({
                                dateOfNextIncrement: datNxtIncr
                            });
                        }
                    }
                    self.postForm.patchValue({
                        cellId: res1['result']['cellId'],
                        basicPay: res1['result']['basicPay'],
                        personalPay: res1['result']['personalPay']
                    });
                    this.postBasicPay = self.postForm.value.basicPay;
                    // this.setDateOfNxtIncr();
                }
            });
        } else {
            this.eventService.calcSeventhBasicPVU(params).subscribe(res => {
                if (res['result'] && res['status'] === 200) {
                    self.postForm.patchValue({
                        cellId: res['result']['cellId'],
                        basicPay: res['result']['basicPay'],
                        personalPay: res['result']['personalPay']
                    });
                    this.postBasicPay = self.postForm.value.basicPay;
                    this.setDateOfNxtIncr();
                }
            });
        }
    }

    /**
     * @description input parameters are changed from outside at that time function called
     */
    ngOnChanges() {
        const self = this;
        // if (self.action === 'edit' || self.action === 'view') {
        if (self.eventDetails && this.postForm) {
            this.setEventPostData();
        }
        // }
        // tslint:disable-next-line:max-line-length
        if (this.employeeDetails && this.eventForm && this.eventForm.get('payCommId') && this.eventForm.get('payCommId').value && this.payMasterData && this.payMasterData.data) {
            this.setCommList(this.eventForm.get('payCommId').value);
        }
    }

    /**
     * @description post details can be save or submit
     * @returns boolean value
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
            if (!this.checkForPayChange()) {
                return false;
            }
            return true;
        }
    }

    /**
     * @description check pay details value selected
     * @returns boolean vlaue
     */
    checkForPayChange() {
        const payComm = this.eventForm.get('payCommId').value,
            postValue = this.postForm.getRawValue(),
            employeeDetail = this.employeeDetails ? this.employeeDetails.employee : null;
        switch (payComm) {
            case 150:
                if (this.pvuScreen) {
                    const basicPay = Number(postValue.basicPay);
                    if (basicPay <= Number(employeeDetail.empBasicPay)) {
                        this.toastr.error('Basic pay should not lesser than employee current basic pay');
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    if (Number(employeeDetail.empBasicPay) >= Number(this.fifthMin) &&
                        Number(employeeDetail.empBasicPay) <= Number(this.fifthMax)) {
                        if ((Number(postValue.basicPay) + Number(postValue.personalPay))
                            !== Number(employeeDetail.empBasicPay)) {
                            this.toastr.error('Employee Basic Pay + ' +
                                'Personal Pay should not be greater or lesser than current Basic Pay!');
                            return false;
                        } else {
                            return true;
                        }
                    } else {
                        if ((Number(postValue.basicPay) + Number(postValue.personalPay))
                            !== Number(this.fifthMin)) {
                            this.toastr.error('Employee Basic Pay + ' +
                                'Personal Pay should not be greater or lesser than ' + this.fifthMin + '!');
                            return false;
                        } else {
                            return true;
                        }
                    }
                }
                break;
            case 151:
                // if (postValue.payBandId === employeeDetail.payBandId) {
                //     return false;
                // } else {
                return true;
                // }
                break;
            case 152:
                if (postValue.payLevelId === employeeDetail.payLevelId) {
                    this.toastr.error('Please change Pay Level!');
                    return false;
                } else {
                    return true;
                }
                break;
        }
    }

    /**
     * @description calculate the duration of start date to end date in notional period
     * @param startDate First Arg
     * @param endDate Second Arg
     */
    calculateDuration(startDate, endDate) {
        if ((startDate instanceof Date) && (endDate instanceof Date)) {
            if (startDate <= endDate) {
                const diffTime: any = Math.abs(endDate.getTime() - startDate.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                this.notionalForm.get('duration').patchValue(diffDays);
                this.startDateLesser = false;
            } else {
                this.toastr.error('Start date should be lesser than End date!');
                this.startDateLesser = true;
            }
        }
    }

    /**
     * @description calculate the day difference based on start date and end date
     */
    changeOfScaleDuration() {
        this.notionalToMinDate = this.notionalForm.controls.notionalFromDate.value;
        // tslint:disable-next-line:max-line-length
        this.calculateDuration(this.notionalForm.controls.notionalFromDate.value, this.notionalForm.controls.notionalToDate.value);
    }

    /**
     * @ignore
     * @description Function is called when compnent is destroyed
     */
    ngOnDestroy() {
        this.eventForm.removeControl('notionalForm');
    }

}
