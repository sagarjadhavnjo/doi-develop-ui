import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { SearchEmployeeComponent } from './../../../pvu-common/search-employee/search-employee.component';
import { Subscription } from 'rxjs';
import { EVENT_ERRORS } from './../index';
import { FormGroup, FormControl, FormBuilder, Validators, FormControlName, AbstractControl } from '@angular/forms';
import { Component, OnInit, Input, OnDestroy, OnChanges, Output, EventEmitter, ElementRef } from '@angular/core';
import { PVUEventsService } from '../services/pvu-event.service';
import * as _ from 'lodash';

@Component({
    selector: 'app-acp',
    templateUrl: './assured-career-progression.component.html',
    styleUrls: ['./assured-career-progression.component.css']
})
export class AssuredProgressionComponent implements OnInit, OnChanges, OnDestroy {
    @Input() eventForm: FormGroup;
    @Input() action: string;
    @Input() eventType: string;
    @Input() eventDetails: any;
    @Output() saveEvent: EventEmitter<any> = new EventEmitter();
    @Output() resetEvent: EventEmitter<any> = new EventEmitter();
    @Output() employeeDetailChange: EventEmitter<any> = new EventEmitter();
    @Input() lookupData: any;
    @Input() isRework = false;
    employeeDetails: any;
    payMasterData: any;
    scaleCtrl: FormControl = new FormControl();
    setSelectedPayBand: any;

    payBandCtrl: FormControl = new FormControl();
    gradePayCtrl: FormControl = new FormControl();
    payBandList = [];
    gradePayList = [];
    previousEmployeeNo;
    title: string = 'Post Details';
    scaleList = [];
    postForm: FormGroup;
    empId: number;
    subscriber: Subscription[] = [];
    errorMessage = EVENT_ERRORS;
    eventEffectiveDate: Date;
    optionMinDate: Date;
    isFifth: boolean = false;
    eligible: boolean = true;
    daysCheckEligible: boolean = false;
    currentPayscaleSelected: any = [];
    fifthMin: number = 0;
    fifthMax: number = 0;
    employeeCurrentForm: FormGroup;
    enableEmployeeSearch: boolean = false;
    payCommSelected: number;
    resetFormEvent: EventEmitter<any> = new EventEmitter();
    acpType: number;
    benEffDatePlaceholder = 'ACP 1st Effective Date';
    hidePayDetails = false;
    decRegPromoListCtrl: FormControl = new FormControl();
    decRegPromoList: any;
    constructor(
        private fb: FormBuilder,
        private eventService: PVUEventsService,
        private dialog: MatDialog,
        private toastr: ToastrService,
        private datepipe: DatePipe,
        private el: ElementRef
    ) { }

    /**
     * @method ngOnInit
     * @description Call when component is load and initialize the view and load data
     */
    ngOnInit() {
        const self = this;
        this.creatEmployeeForm();
        this.employeeCurrentForm.get('employeeNo').disable();
        // this.postForm.disable();
        if (this.eventForm.get('payCommId').value) {
            self.onPayCommissionValueChange(this.eventForm.get('payCommId').value);
        }
        if (this.eventForm.get('eventEffectiveDate').value) {
            self.onEventEffectiveDateChange(this.eventForm.get('eventEffectiveDate').value);
        }
        if (this.eventForm.get('acpType').value) {
            self.onACPTypeChange(this.eventForm.get('acpType').value);
        }
        this.subscriber.push(this.eventForm.get('payCommId').valueChanges.subscribe(res => {
            self.onPayCommissionValueChange(res);
        }));
        this.subscriber.push(this.eventForm.get('eventEffectiveDate').valueChanges.subscribe(res => {
            self.onEventEffectiveDateChange(res);
        }));
        this.subscriber.push(this.eventForm.get('acpType').valueChanges.subscribe(res => {
            self.onACPTypeChange(res);
        }));
    }

    /**
     * @method onACPTypeChange
     * @description Function is called when ACP type is changed
     * @param res Changed ACP Type
     */
    onACPTypeChange(res) {
        this.acpType = res;
        switch (res) {
            case 323:
                this.benEffDatePlaceholder = 'ACP 1st Effective Date';
                break;
            case 324:
                this.benEffDatePlaceholder = 'ACP 2nd Effective Date';
                break;
        }
        if (this.eventEffectiveDate && !this.employeeCurrentForm.get('employeeNo').value && !isNaN(this.acpType)) {
            this.employeeCurrentForm.get('employeeNo').enable();
            this.enableEmployeeSearch = true;
        } else if (this.eventEffectiveDate && this.employeeCurrentForm.get('employeeNo').value) {
            this.onEmployeeKeyUp(null);
        } else {
            this.employeeCurrentForm.get('employeeNo').disable();
            this.enableEmployeeSearch = false;
        }
    }

    /**
     * @method onDecRegPromo
     * @description Function is called when declined promotion on personal ground is changed
     * @param res declined promotion on personal ground value 'Yes' or 'No'
     */
    onDecRegPromo() {
        const decRegPromo = this.postForm.get('decRegPrm').value;
        let validators = null;
        if (decRegPromo === 2) {
            this.hidePayDetails = true;
            validators = [Validators.required];
            if (!(this.eventDetails.statusId !== 205 && this.eventDetails.statusId !== 0)) {
                this.clearPayDetails();
            }
        } else {
            this.hidePayDetails = false;
        }
        this.postForm.get('basicPay').setValidators(validators);
        switch (this.payCommSelected) {
            case 150:
                this.postForm.get('payScale').setValidators(validators);
                break;
            case 151:
                this.postForm.get('payBandId').setValidators(validators);
                this.postForm.get('payBandValue').setValidators(validators);
                this.postForm.get('gradePayId').setValidators(validators);
                break;
        }
        this.postForm.get('benEffDate').setValidators(validators);
        this.postForm.updateValueAndValidity();
    }

    /**
     * @method creatEmployeeForm
     * @description Function is called to initialize form group for post details
     */
    creatEmployeeForm() {
        const self = this;
        this.eventForm.removeControl('employeeCurrentForm');
        this.eventForm.removeControl('postForm');
        if (this.eventForm) {
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
                acpEffDate: ['']
            }));
            this.eventForm.addControl('postForm', self.fb.group({
                basicPay: ['', Validators.required],
                benEffDate: [''],
                decRegPrm: ['', Validators.required]
            }));
        } else {
            this.eventForm = self.fb.group({
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
                    acpEffDate: ['']
                }),
                postForm: self.fb.group({
                    basicPay: ['', Validators.required],
                    benEffDate: [''],
                    decRegPrm: ['', Validators.required]
                })
            });
        }
        this.employeeCurrentForm = this.eventForm.get('employeeCurrentForm') as FormGroup;
        this.postForm = this.eventForm.get('postForm') as FormGroup;
    }

    /**
     * @method setACPData
     * @description Function is called to set ACP saved data
     */
    setACPData() {
        const self = this;
        this.postForm.patchValue({
            basicPay: this.eventDetails.basicPay ? this.eventDetails.basicPay : null,
            decRegPrm: this.eventDetails.decRegPrm ? this.eventDetails.decRegPrm : null
        });
        if (self.eventDetails.benEffDate) {
            let benEffDate = self.eventDetails.benEffDate.split('-');
            benEffDate = new Date(benEffDate[0], benEffDate[1] - 1, benEffDate[2]);
            this.postForm.patchValue({
                benEffDate: benEffDate
            });
        }
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
                if (!isNaN(this.acpType)) {
                    this.employeeCurrentForm.get('employeeNo').enable();
                    this.enableEmployeeSearch = true;
                    self.eventEffectiveDate = res;
                    this.onEmployeeKeyUp(null);
                }
            }
        } else {
            this.employeeCurrentForm.get('employeeNo').disable();
            this.enableEmployeeSearch = false;
        }
        self.eventEffectiveDate = res;
        this.postForm.patchValue({
            benEffDate: self.eventEffectiveDate
        });
        // this.postForm.get('benEffDate').disable();
    }

    /**
     * @method checkForEligibility
     * @description Function is called to check eligibility of employee searched
     * as he is applicable for higher pay grade or not
     */
    checkForEligibility() {
        const self = this,
            params: any = {
                'empNo': Number(self.employeeCurrentForm.get('employeeNo').value),
                'payCommission': self.payCommSelected,
                'acpType': self.acpType ? self.acpType : self.eventDetails['acpType'],
                'isViewPage' : this.action === 'view'
            };
        if (self.eventEffectiveDate) {
            let effDate: any = self.eventEffectiveDate,
                dateToSend = '';
            dateToSend += effDate.getFullYear();
            dateToSend += '-';
            if (effDate.getMonth() < 9) {
                dateToSend += '0' + (effDate.getMonth() + 1);
                dateToSend += '-';
            } else {
                dateToSend += '' + (effDate.getMonth() + 1);
                dateToSend += '-';
            }
            if (effDate.getDate() <= 9) {
                dateToSend += '0' + effDate.getDate();
            } else {
                dateToSend += effDate.getDate();
            }
            effDate = dateToSend;
            params['effectiveDate'] = effDate;
        }
        this.eventService.checkForACPEligibility(params).subscribe(res => {
            if (res['status'] === 200 && res['result'] !== null) {
                self.employeeDetails = _.cloneDeep(res['result']);
                if (self.employeeDetails.employee) {
                    self.empId = self.employeeDetails.employee.employeeId;
                }
                self.setEmployeeInfo();
                self.onEmployeeEligible();
                self.eligible = true;
            } else {
                self.employeeDetails = null;
                self.eligible = false;
                this.postForm.disable();
                self.clearEmployeeDetails();
                self.clearPayDetails();
                self.toastr.error(res['message']);
            }
            self.employeeDetailChange.emit(self.employeeDetails);
        }, err => {
            self.employeeDetails = null;
            self.eligible = false;
            this.postForm.disable();
            self.clearEmployeeDetails();
            self.clearPayDetails();
            self.toastr.error(err);
        });
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
        if (this.employeeDetails && this.employeeDetails.employee) {
            this.getPayMasters();
            if (!this.previousEmployeeNo) {
                this.previousEmployeeNo = this.employeeDetails.employee.employeeNo;
            }
            if (Number(this.previousEmployeeNo) !== Number(this.employeeDetails.employee.employeeNo)) {
                this.postForm.patchValue({
                    basicPay: null,
                    decRegPrm: null
                });
                this.clearPayDetails();
            }
        }
        this.employeeDetailChange.emit(this.employeeDetails);
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
        }
        this.postForm.patchValue({
            'basicPay': null
        });
    }

    /**
     * @method transforminYMDDateFormat
     * @description Function is called to get Date in format YYYY-MM-DD
     * @param date for which format is required
     */
    transforminYMDDateFormat(date) {
        if (date !== '' && date !== undefined && date !== null) {
            date = new Date(date);
            return this.datepipe.transform(date, 'yyyy-MM-dd');
        }
        return '';
    }

    /**
     * @method saveDetails
     * @description Function is called when save as draft is clicked and it further emits so event details can be saved
     */
    saveDetails() {
        if (this.hidePayDetails) {
            this.toastr.error(EVENT_ERRORS.ACP_EVENT_NOT_INITIATED);
        } else {
            if (!this.eligible) {
                this.toastr.error(EVENT_ERRORS.ACP_NOT_ELIGIBLE);
            } else {
                if (!this.hidePayDetails) {
                    this.saveEvent.emit();
                } else {
                    this.toastr.error(EVENT_ERRORS.ACP_EVENT_NOT_INITIATED);
                }
            }
        }
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
            if (!this.eligible) {
                this.toastr.error(EVENT_ERRORS.ACP_NOT_ELIGIBLE);
            } else {
                if (!this.hidePayDetails) {
                    if (!this.checkForPayChange()) {
                        return false;
                    }
                } else {
                    this.toastr.error(EVENT_ERRORS.ACP_EVENT_NOT_INITIATED);
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
        const postValue = this.postForm.getRawValue(),
            employeeDetail = this.employeeDetails ? this.employeeDetails.employee : null;

        if (postValue.basicPay <= Number(employeeDetail.empBasicPay)) {
            this.toastr.error('Please change Basic Pay');
            return false;
        }
        return true;
    }

    /**
     * @method resetForm
     * @description Function is called when reset is clicked and it further emits so event details can be reset
     */
    resetForm() {
        // this.clearEmployeeDetails();
        this.resetEvent.emit();
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

    /**
     * @method onPayCommissionValueChange
     * @description Function is called when pay commission is changed
     * @param payCommissionId what pay commission is selected, that id is provided
     */
    onPayCommissionValueChange(payCommissionId) {
        if (this.payCommSelected !== this.eventForm.get('payCommId').value
            && this.eventForm.get('payCommId').value && !this.employeeCurrentForm.controls.employeeNo.errors) {
            this.payCommSelected = this.eventForm.get('payCommId').value;
            if (this.acpType) {
                this.enableEmployeeSearch = true;
                this.onEmployeeKeyUp(null);
            }
        }
        this.payCommSelected = payCommissionId;
        this.postForm.removeControl('payBandId');
        this.postForm.removeControl('payBandValue');
        this.postForm.removeControl('gradePayId');
        this.postForm.removeControl('payScale');
        this.postForm.get('basicPay').setValidators(Validators.required);
        this.postForm.get('basicPay').updateValueAndValidity();
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
                // this.postForm.get('payScale').disable();
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
                this.postForm.addControl('payBandValue',
                    new FormControl(payBandValue, Validators.required));
                this.postForm.addControl('gradePayId', new FormControl(gradePayId, Validators.required));
                this.postForm.get('payBandValue').disable();
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
                // 5 comm
                this.setFifthData();
                break;
            case 151:
                // 6 comm
                this.setSixthData();
                break;
        }
    }

    /**
     * @method getListAccEvent
     * @description Function is called to extract values from array
     * @param data Array is provided
     * @param index from which index values are extracted till last index
     * @returns Extracted Array
     */
    getListAccEvent(data, index) {
        return data.splice(index + 1);
    }

    /**
     * @method setFifthData
     * @description Function is called to set fifth pay commission data
     * @param payCommissionId what pay commission is selected, that id is provided
     */
    setFifthData() {
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

            if (this.employeeDetails && this.employeeDetails.employee
                && Number(this.previousEmployeeNo) !== Number(this.employeeDetails.employee.employeeNo)) {
                this.previousEmployeeNo = Number(this.employeeDetails.employee.employeeNo);
                this.postForm.get('payScale').patchValue(null);
            } else if (this.eventDetails) {
                if (this.eventDetails.payScale) {
                    this.postForm.get('payScale').patchValue(this.eventDetails.payScale);
                    this.setFifthBasicParams(this.postForm.get('basicPay'));
                }
            }
        }
    }

    /**
     * @method setFifthBasicParams
     * @description Function is called to set fifth pay commission basic valdations
     */
    setFifthBasicParams(control: AbstractControl) {
        const self = this,
            fifthData = this.scaleList.filter((scale) => {
                return scale.id === Number(self.postForm.get('payScale').value);
            })[0],
            currentPayScale = this.employeeDetails.employee.payScaleName;
        this.setCurrentPayValidation(fifthData, control, currentPayScale);
    }

    setCurrentPayValidation(fifthData, control, currentPayScale) {
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
            this.setBasicPay(control, currentPayScale);
            control.setValidators([Validators.required,
            Validators.min(this.fifthMin), Validators.max(this.fifthMax)]);
            control.updateValueAndValidity();
            if (control.value) {
                this.calculateFifthBasic(control);
            }
        }
    }

    setBasicPay(control: AbstractControl, currentPayScale) {
        const scaleList = currentPayScale.split('-');
        let newBasicPay = Number(this.employeeDetails.employee.empBasicPay);
        if (scaleList.length > 2) {
            for (let i = 2; i < scaleList.length; i += 2) {
                if (Number(newBasicPay) >= Number(scaleList[i - 2]) &&
                    Number(newBasicPay) <= scaleList[i]) {
                    newBasicPay += Number(scaleList[i - 1]);
                }
            }
        }
        if (newBasicPay < this.fifthMin) {
            newBasicPay = this.fifthMin;
        }
        if (control.value && control.value !== newBasicPay) {
            this.toastr.error('Employee\'s Basic Pay can be Rs. ' + newBasicPay + ' only!');
        }
        control.setValue(newBasicPay);
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
                    if (Number(currentPaySel) >= Number(this.currentPayscaleSelected[i - 2])
                        && Number(currentPaySel) <= this.currentPayscaleSelected[i]) {
                        let diff = this.currentPayscaleSelected[i - 2] - currentPaySel;
                        diff /= this.currentPayscaleSelected[i - 1];
                        if (diff.toString().indexOf('.') !== -1) {
                            control.setErrors({
                                wrongValue: 'Please enter between ' + this.currentPayscaleSelected[i - 2] + '-' +
                                    this.currentPayscaleSelected[i] + ' in multiples of ' +
                                    this.currentPayscaleSelected[i - 1] + ' like ' +
                                    (Number(this.currentPayscaleSelected[i - 2]) +
                                        Number(this.currentPayscaleSelected[i - 1]))
                                    + ', ' + (Number(this.currentPayscaleSelected[i - 2]) +
                                        (Number(this.currentPayscaleSelected[i - 1])) * 2) + '...'
                            });
                            control.markAsTouched({ onlySelf: true });
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
     */
    setSixthData() {
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
                    this.payBandList = _.cloneDeep(this.getListAccEvent(sixData, currentPayScale));
                }
            }
        }

        if (this.employeeDetails && this.employeeDetails.employee
            && Number(this.previousEmployeeNo) !== Number(this.employeeDetails.employee.employeeNo)) {
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
     * @method setSixthBasicParams
     * @description Function is called to set fifth pay commission basic valdations
     */
    setSixthBasicParams(control: AbstractControl) {
        const self = this,
            fifthData = this.payBandList.filter((scale) => {
                return scale.id === Number(self.postForm.get('payBandId').value);
            })[0],
            currentPayScale = this.employeeDetails.employee.payBandName;
        if (fifthData) {
            fifthData.name = fifthData.payBandName;
        }
        this.setCurrentPayValidation(fifthData, control, currentPayScale);
    }

    /**
     * @method onPayBandChange
     * @description Function is called to take necessary action on values change of pay band
     */
    onPayBandChange() {
        const sixData = _.cloneDeep(this.payMasterData.data),
            payBandId = this.postForm.get('payBandId') ? this.postForm.get('payBandId').value : null;
        this.gradePayList = [];
        if (payBandId) {
            const gradePayData = sixData.filter((payBand) => {
                return payBand.id === payBandId;
            });
            const setSelectedPayBand = gradePayData[0];
            if (setSelectedPayBand) {
                if (!this.eventDetails || (this.eventDetails && this.eventDetails.payBandId !== payBandId)) {
                    this.postForm.get('basicPay').patchValue('');
                    this.postForm.get('payBandValue').patchValue('');
                    // this.postForm.get('gradePayId').patchValue('');
                    if (setSelectedPayBand.gradePays && setSelectedPayBand.gradePays[0]) {
                        this.postForm.get('gradePayId').patchValue(setSelectedPayBand.gradePays[0].id);
                    }
                }
            }
            if (setSelectedPayBand) {
                this.gradePayList = _.cloneDeep(setSelectedPayBand.gradePays);
            }
            this.setSixthBasicParams(this.postForm.get('payBandValue'));
            if (this.postForm.get('payBandValue')) {
                this.onGradePayChange();
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
            this.calculateSixthBasicPay();
        }
    }

    /**
     * @method calculateSixthBasicPay
     * @description Function is called to get pay band and pay band value from server
     */
    calculateSixthBasicPay() {
        const self = this,
            postFormValue = self.postForm.getRawValue(),
            gradePayId = postFormValue['gradePayId'],
            payBandValue = postFormValue['payBandValue'];
        if (gradePayId && payBandValue) {
            const gradePay = self.gradePayList.filter(gradePayObject => {
                return Number(gradePayId) === Number(gradePayObject.id);
            })[0];
            let basicPay;
            if (gradePay) {
                basicPay = Number(gradePay.gradePayValue) + Number(payBandValue);
            }
            this.postForm.get('basicPay').patchValue(basicPay);
        }
    }

    /**
     * @method ngOnChanges
     * @description Function is called to take necessary actions when input parameters are changed from outside
     */
    ngOnChanges() {
        const self = this;
        // if (self.action === 'edit' || self.action === 'view') {
        if (self.eventDetails && this.postForm) {
            this.postForm.patchValue({
                basicPay: self.eventDetails.basicPay
            });
            this.setACPData();
        }
        // }
        if (this.employeeDetails && this.eventForm && this.eventForm.get('payCommId')
            && this.eventForm.get('payCommId').value && this.payMasterData && this.payMasterData.data) {
            this.setCommList(this.eventForm.get('payCommId').value);
        }
        if (this.employeeCurrentForm && this.eventDetails && this.eventDetails.employeeNo) {
            this.employeeCurrentForm.get('employeeNo').patchValue(this.eventDetails.employeeNo);
            if (!this.eventForm.get('eventEffectiveDate').errors) {
                this.checkForEligibility();
            } else {
                this.eventForm.get('eventEffectiveDate').markAsTouched({ onlySelf: true });
            }
        }
        if (this.lookupData) {
            this.decRegPromoList = _.cloneDeep(this.lookupData['ConditionCheck']);
        }
        if (this.action === 'view' && this.employeeCurrentForm) {
            this.employeeCurrentForm.get('employeeNo').disable();
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

    clearEmployeeDetails() {
        this.employeeDetails = null;
        this.setEmployeeInfo();
        this.employeeCurrentForm.get('employeeNo').patchValue('');
        setTimeout(() => {
            this.el.nativeElement.querySelector('.employee-number-field').focus();
        }, 0);
    }

    /**
     * @method setEmployeePayDetailsOnPayCommChange
     * @description Function is called when pay commission is changed
     * @param payCommissionId what pay commission is selected, that id is provided
     */
    setEmployeePayDetailsOnPayCommChange(payCommissionId) {
        this.employeeCurrentForm.removeControl('payBand');
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
                if (this.employeeDetails && this.employeeDetails.employee &&
                    this.employeeDetails.employee.payScaleName) {
                    payScaleValue = this.employeeDetails.employee.payScaleName;
                }
                this.employeeCurrentForm.addControl('scale', new FormControl(payScaleValue));
                // 5 comm
                break;
            case 151:
                let payBandId = null;
                    // ,payBandValue = null,
                    // gradePayId = null;
                if (this.employeeDetails && this.employeeDetails.employee) {
                    if (this.employeeDetails.employee.payBandName) {
                        payBandId = this.employeeDetails.employee.payBandName;
                    }
                    // if (this.employeeDetails.employee.payBandValue) {
                    //     payBandValue = this.employeeDetails.employee.payBandValue;
                    // }
                    // if (this.employeeDetails.employee.gradePayName) {
                    //     gradePayId = this.employeeDetails.employee.gradePayName;
                    // }
                }
                this.employeeCurrentForm.addControl('payBand', new FormControl(payBandId));
                // 6 comm
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
            if (this.employeeDetails.employee.dateJoining &&
                !(this.employeeDetails.employee.dateJoining instanceof Date)) {
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
            if (this.employeeDetails.employee.retirementDate &&
                !(this.employeeDetails.employee.retirementDate instanceof Date)) {
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
            if (this.employeeDetails.employee.dateNxtIncr &&
                !(this.employeeDetails.employee.dateNxtIncr instanceof Date)) {
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
            if (this.employeeDetails.employee.acpEffDate &&
                !(this.employeeDetails.employee.acpEffDate instanceof Date)) {
                let doj;
                if (this.employeeDetails.employee.acpEffDate.indexOf(' ') !== -1) {
                    doj = this.employeeDetails.employee.acpEffDate.split(' ')[0].split('-');
                    this.employeeCurrentForm.patchValue({
                        acpEffDate: doj[2] + '/' + doj[1] + '/' + doj[0]
                    });
                } else if (this.employeeDetails.employee.acpEffDate.indexOf('T') !== -1) {
                    doj = this.employeeDetails.employee.acpEffDate.split('T')[0].split('-');
                    this.employeeCurrentForm.patchValue({
                        acpEffDate: doj[2] + '/' + doj[1] + '/' + doj[0]
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
                acpEffDate: null
            });
        }
        if (this.eventForm.get('payCommId') && this.eventForm.get('payCommId').value) {
            this.setEmployeePayDetailsOnPayCommChange(this.eventForm.get('payCommId').value);
        }
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
                    } else {
                        this.eventForm.get('eventEffectiveDate').markAsTouched({ onlySelf: true });
                    }
                }
            } else {
                if (!this.eventForm.get('eventEffectiveDate').errors) {
                    self.checkForEligibility();
                } else {
                    this.eventForm.get('eventEffectiveDate').markAsTouched({ onlySelf: true });
                }
            }
        } else if (!self.employeeCurrentForm.get('employeeNo').errors) {
            self.employeeCurrentForm.get('employeeNo').markAsTouched({ onlySelf: true });
        }
    }

    /**
     * @method openSearchEmployeeDialog
     * @description Function is called if search icon is click, This help in searchng employee from other parameters
     */
    openSearchEmployeeDialog() {
        if (this.enableEmployeeSearch) {
            if ((this.eventDetails &&
                this.eventDetails.statusId !== 205 && this.eventDetails.statusId !== 0) || this.action === 'view') {
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
                        } else {
                            this.eventForm.get('eventEffectiveDate').markAsTouched({ onlySelf: true });
                        }
                    }
                });
            } else {
                const empNo = this.employeeCurrentForm.get('employeeNo').value;
                if (empNo && empNo.length === 10) {
                    if (!this.eventForm.get('eventEffectiveDate').errors) {
                        this.checkForEligibility();
                    } else {
                        this.eventForm.get('eventEffectiveDate').markAsTouched({ onlySelf: true });
                    }
                }
            }
        }
    }
}
