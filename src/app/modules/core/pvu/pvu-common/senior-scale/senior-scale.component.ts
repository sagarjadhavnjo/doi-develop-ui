import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { PvuCommonService } from './../services/pvu-common.service';
import { Subscription } from 'rxjs';
import { SENIOR_SCALE_EVENT_ERRORS } from './../index';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Component, OnInit, Input, OnDestroy, OnChanges, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';

@Component({
    selector: 'app-senior-scale',
    templateUrl: './senior-scale.component.html',
    styleUrls: ['./senior-scale.component.css']
})
export class SeniorScaleComponent implements OnInit, OnDestroy, OnChanges {
    @Input() eventForm: FormGroup;
    @Input() action: string;
    @Input() eventType: string;
    @Input() eventDetails: any;
    @Input() isRework = false;
    @Output() saveEvent: EventEmitter<any> = new EventEmitter();
    @Output() resetEvent: EventEmitter<any> = new EventEmitter();
    @Output() employeeDetailChange: EventEmitter<any> = new EventEmitter();
    showExamDetails: boolean = true;
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
    clearExamDetails = false;
    bindedPromotionType: boolean = false;
    payBandList = [];
    gradePayList = [];
    title: string = 'Post Details';
    scaleList = [];
    postForm: FormGroup;
    empId: number;
    subscriber: Subscription[] = [];
    errorMessage = SENIOR_SCALE_EVENT_ERRORS;
    eventEffectiveDate: Date;
    currentPayscaleSelected: any = [];
    fifthMin: number = 0;
    fifthMax: number = 0;
    isFifth: boolean = false;
    clearEmployeeCurrentDetails = false;
    previousEmployeeNo;
    loadedPayComission: number;
    eligible = false;
    changeDNI = false;
    isJudiciaryDepartment: boolean = false;

    constructor(
        private fb: FormBuilder,
        private eventService: PvuCommonService,
        private dialog: MatDialog,
        private toastr: ToastrService
    ) { }

    /**
     * @method ngOnInit
     * @description Call when component is load and initialize the view and load data
     */
    ngOnInit() {
        const self = this;
        this.creatEmployeeForm();
        this.subscriber.push(this.eventForm.get('payCommId').valueChanges.subscribe(res => {
            self.onPayCommissionValueChange(res);
        }));
        if (this.eventForm.get('payCommId').value) {
            self.onPayCommissionValueChange(this.eventForm.get('payCommId').value);
        }
        if (this.eventForm.get('eventEffectiveDate').value) {
            self.onEventEffectiveDateChange(this.eventForm.get('eventEffectiveDate').value);
        }
        this.subscriber.push(this.eventForm.get('eventEffectiveDate').valueChanges.subscribe(res => {
            self.onEventEffectiveDateChange(res);
        }));
        if (self.action === 'view') {
            this.postForm.disable();
        }
        // this.postForm.get('dateOfNextIncrement').disable();
    }

    /**
     * @method onEventEffectiveDateChange
     * @description Function is called on effective date change and sets minimum date
     * @param res Changed effective date
     */
    onEventEffectiveDateChange(res) {
        const self = this;
        self.eventEffectiveDate = res;
        this.postForm.patchValue({
            benefitEffectiveDate: self.eventEffectiveDate
        });
        this.postForm.get('benefitEffectiveDate').disable();
    }

    /**
     * @method creatEmployeeForm
     * @description Function is called to initialize form group for post details
     */
    creatEmployeeForm() {
        const self = this;
        if (this.eventForm) {
            this.eventForm.removeControl('postForm');
            this.eventForm.addControl('postForm', self.fb.group({
                basicPay: [''],
                dateOfNextIncrement: [''],
                benefitEffectiveDate: ['']
            }));
        } else {
            this.eventForm = self.fb.group({
                postForm: self.fb.group({
                    basicPay: [''],
                    dateOfNextIncrement: [''],
                    benefitEffectiveDate: ['']
                })
            });
        }
        this.postForm = this.eventForm.get('postForm') as FormGroup;
        if (self.eventDetails && this.postForm) {
            this.setEventPostData();
        }
    }

    /**
     * @method onEmployeeDetailsChange
     * @description Function is called when employee is searched and assign appropriate values of Class
     * Designation and pay details
     * @param empl In this is employee details are provided
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
            this.clearExamDetails = false;
            if (this.employeeDetails.employee.dateNxtIncr &&
                !(this.employeeDetails.employee.dateNxtIncr instanceof Date)) {
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
            if ((this.employeeDetails.employee.departmentCategoryId === 17 )
                && this.eventForm.get('payCommId').value === 151) {
                this.isJudiciaryDepartment = true;
            } else {
                this.isJudiciaryDepartment = false;
            }
            // this.postForm.get('dateOfNextIncrement').disable();
            if (!this.previousEmployeeNo) {
                this.previousEmployeeNo = this.employeeDetails.employee.employeeNo;
            }
            if (Number(this.previousEmployeeNo) !== Number(this.employeeDetails.employee.employeeNo)) {
                this.postForm.patchValue({
                    basicPay: null
                });
            }
            if (this.eventForm.get('payCommId').value !== this.loadedPayComission) {
                this.getPayMasters();
            }
            this.checkForEligibility();
        }
        this.employeeDetailChange.emit(empl);
    }

    /**
     * @method saveDetails
     * @description Function is called when save as draft is clicked and it further emits so event details can be saved
     */
    saveDetails() {
        this.saveEvent.emit();
    }

    /**
     * @method resetForm
     * @description Function is called when reset is clicked and it further emits so event details can be reset
     */
    resetForm() {
        // this.clearEmployeeCurrentDetails = true;
        this.resetEvent.emit();
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
            if (!this.checkForPayChange()) {
                return false;
            }
            return true;
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
        switch (payComm) {
            case 150:
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
                break;
            case 151:
                // if (Number(postValue.basicPay) <= Number(employeeDetail.empBasicPay)) {
                //     this.toastr.error('Please change Grade Pay!');
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
     * @method setEventPostData
     * @description Function is called when we recieve saved event details
     */
    setEventPostData() {
        const self = this;
        self.postForm.patchValue({
            basicPay: self.eventDetails.basicPay ? self.eventDetails.basicPay : null
        });
        let datNxtIncr,
            benefitEffectiveDate;
        if (self.eventDetails.dateOfNextIncrement) {
            datNxtIncr = self.eventDetails.dateOfNextIncrement.split('-');
            datNxtIncr = new Date(datNxtIncr[0], datNxtIncr[1] - 1, datNxtIncr[2]);
        }
        if (self.eventDetails.benefitEffectiveDate) {
            benefitEffectiveDate = self.eventDetails.benefitEffectiveDate.split('-');
            // tslint:disable-next-line:max-line-length
            benefitEffectiveDate = new Date(benefitEffectiveDate[0], benefitEffectiveDate[1] - 1, benefitEffectiveDate[2]);
        }
        self.postForm.patchValue({
            benefitEffectiveDate: benefitEffectiveDate,
            dateOfNextIncrement: datNxtIncr
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
        self.eventService.getPayMasters(dataToSend).subscribe(res => {
            if (res['status'] === 200 && res['result']) {
                self.payMasterData = res['result'];
                self.loadedPayComission = dataToSend.request.payCommissionId;
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
        const self = this;
        self.postForm.removeControl('payLevelId');
        self.postForm.removeControl('personalPay');
        self.postForm.removeControl('cellId');
        self.postForm.removeControl('payBandId');
        self.postForm.removeControl('payBandValue');
        self.postForm.removeControl('gradePayId');
        self.postForm.removeControl('scaleId');
        this.postForm.get('basicPay').setValidators(null);
        this.postForm.get('basicPay').updateValueAndValidity();
        this.isFifth = false;
        this.changeDNI = false;
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
                    if (this.eventDetails.scaleId) {
                        payScaleValue = this.eventDetails.scaleId;
                    }
                    if (this.eventDetails.personalPay || this.eventDetails.personalPay === 0) {
                        personalPay = this.eventDetails.personalPay;
                    }
                }
                if (this.action !== 'view') {
                    this.postForm.get('basicPay').enable();
                }
                this.postForm.addControl('personalPay', new FormControl(personalPay, Validators.required));
                this.postForm.addControl('scaleId', new FormControl(payScaleValue, Validators.required));
                if (this.action === 'view') {
                    this.postForm.get('personalPay').disable();
                    this.postForm.get('scaleId').disable();
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

                if (this.action === 'view') {
                    this.postForm.get('payBandId').disable();
                    this.postForm.get('payBandValue').disable();
                    this.postForm.get('gradePayId').disable();
                }
                // 6 comm
                break;
            case 152:
                // 7 comm
                let payLevelId = null,
                    cellId = null;
                if (this.eventDetails) {
                    if (this.eventDetails.payLevelId) {
                        payLevelId = this.eventDetails.payLevelId;
                    }
                    if (this.eventDetails.cellId) {
                        cellId = this.eventDetails.cellId;
                    }
                    if (this.eventDetails.personalPay || this.eventDetails.personalPay === 0) {
                        personalPay = this.eventDetails.personalPay;
                    }
                }
                this.postForm.addControl('payLevelId', new FormControl(payLevelId, Validators.required));
                this.postForm.addControl('cellId', new FormControl(cellId, Validators.required));
                this.postForm.addControl('personalPay', new FormControl(personalPay, Validators.required));
                this.postForm.get('cellId').disable();
                this.postForm.get('personalPay').disable();
                if (this.action === 'view') {
                    this.postForm.get('payLevelId').disable();
                }
                break;
        }
        if (this.employeeDetails) {
            this.setCommList(payCommissionId);
        }
    }

    /**
     * @method setCommList
     * @description Function is called to set pay commission datta to dropdown on what commission is selected
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
     * @method setFifthData
     * @description Function is called to set fifth pay commission data
     * @param payCommissionId what pay commission is selected, that id is provided
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
                this.postForm.get('scaleId').patchValue(null);
                this.postForm.get('personalPay').patchValue(null);
            } else if (this.eventDetails) {
                if (this.eventDetails.scaleId) {
                    this.postForm.get('scaleId').patchValue(this.eventDetails.scaleId);
                    this.postForm.get('personalPay').patchValue(this.eventDetails.personalPay);
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
                return scale.id === Number(self.postForm.get('scaleId').value);
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
     * @method setSixthData
     * @description Function is called to check set six pay commission data in dropdown
     * @param payCommissionId what pay commission is selected, that id is provided
     */
    setSixthData(payCommissionId) {
        const self = this,
            sixData = _.orderBy(_.cloneDeep(self.payMasterData.data), 'order', 'asc');
        if (this.employeeDetails && this.employeeDetails.employee) {
            if (this.employeeDetails.employee.payBandId) {
                let currentPayScale = 0;
                sixData.forEach((payBand, index) => {
                    if (payBand.id === Number(this.employeeDetails.employee.payBandId)) {
                        currentPayScale = index;
                    }
                });
                if (currentPayScale || currentPayScale === 0) {
                    currentPayScale -= 1;
                    this.payBandList = _.cloneDeep(this.getListAccEvent(sixData, currentPayScale));
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
            if ((this.eventDetails.departmentCategoryId && (this.eventDetails.departmentCategoryId === 17) )
                && this.eventForm.get('payCommId').value === 151) {
                this.isJudiciaryDepartment = true;
            } else {
                this.isJudiciaryDepartment = false;
            }
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
     * @method onPayBandChange
     * @description Function is called to take necessary action on values change of pay band
     */
    onPayBandChange() {
        const self = this,
            sixData = _.cloneDeep(self.payMasterData.data),
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
            this.setDateOfNxtIncr();
        }
    }

    onPayBandValueChange(control: AbstractControl) {
        this.calculateFifthBasic(control);
        if (!control.errors) {
            this.calculateSixthBasicPayOnGrade();
        }
    }

    /**
     * @method setSeventhData
     * @description Function is called to check set seven pay commission data in dropdown
     * @param payCommissionId what pay commission is selected, that id is provided
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
            if (this.eventDetails.payLevelId) {
                this.postForm.get('payLevelId').patchValue(this.eventDetails.payLevelId);
                this.postForm.get('cellId').patchValue(this.eventDetails.cellId);
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
            if (this.employeeDetails && this.employeeDetails.employee) {
                this.calculateSeventhBasicPay();
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
                    'optionalAvail': 0
                }
            };
        this.eventService.calcSeventhBasic(params, self.eventType).subscribe(res => {
            if (res['result'] && res['status'] === 200) {
                this.changeDNI = res['result']['changeDNI'];
                if (res['result']['changeDNI']) {
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
                    cellId: res['result']['cellId'],
                    basicPay: res['result']['basicPay'],
                    personalPay: res['result']['personalPay']
                });
            }
        });
    }

    clearExmDetails() {
        this.clearExamDetails = true;
    }

    /**
     * @method onGradePayChange
     * @description Function is called to take necessary action on values change of grade pay
     */
    onGradePayChange() {
        const self = this,
            gradePayId = self.postForm.get('gradePayId').value;
        if (gradePayId) {
            self.calculateSixthBasicPayOnGrade();
        }
    }

    /**
     * @method calculateSixthBasicPayOnGrade
     * @description Function is called to calculate basic on selection of grade pay and pay band
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

    /**
     * @method ngOnChanges
     * @description Function is called to take necessary actions when input parameters are changed from outside
     */
    ngOnChanges() {
        const self = this;
        // if (self.action === 'edit' || self.action === 'view') {
        if (self.eventDetails && this.postForm) {
            this.postForm.patchValue({
                basicPay: self.eventDetails.basicPay,
                // tslint:disable-next-line:max-line-length
                dateOfNextIncrement: self.eventDetails.dateOfNextIncrement ? new Date(self.eventDetails.dateOfNextIncrement) : null
            });
            this.setEventPostData();
        }
        // }
        // tslint:disable-next-line:max-line-length
        if (this.employeeDetails && this.eventForm && this.eventForm.get('payCommId') && this.eventForm.get('payCommId').value && this.payMasterData && this.payMasterData.data) {
            this.setCommList(this.eventForm.get('payCommId').value);
        }
    }

    /**
     * @method ngOnDestroy
     * @description Function is called when compnent is destroyed to take necessary calls on view destroy from browser
     */
    // Kept for future purpose
    ngOnDestroy() { }

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
                        const currentBasic = Number(this.employeeDetails.employee.empBasicPay),
                            postbasic = Number(this.postForm.get('basicPay').value),
                            postpersonalpay = Number(this.postForm.get('personalPay').value);
                        if (postbasic && (currentBasic < (postbasic + postpersonalpay))) {
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
                const currentPayBandValue = Number(eventDetail.employeeCurrentForm.payBandValue);
                const postPayBandValue = Number(this.postForm.get('payBandValue').value);
                if (this.eligible) {
                    if (doi) {
                        this.postForm.patchValue({
                            dateOfNextIncrement: doi
                        });
                    }
                } else {
                    if (postPayBandValue && currentPayBandValue !== postPayBandValue) {
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
                if (this.eligible) {
                    if (doi) {
                        this.postForm.patchValue({
                            dateOfNextIncrement: doi
                        });
                    }
                } else {
                    let month;
                    if (this.changeDNI) {
                        if (doi) {
                            const year = (doi.getMonth() + 6) > 11 ? (doi.getFullYear() + 1) : (doi.getFullYear());
                            month = (doi.getMonth() + 6) > 11 ? (doi.getMonth() % 6) : (doi.getMonth() + 6);
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

}
