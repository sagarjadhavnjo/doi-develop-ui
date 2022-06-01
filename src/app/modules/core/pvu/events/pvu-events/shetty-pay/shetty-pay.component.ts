import { ToastrService } from 'ngx-toastr';
import { SearchEmployeeComponent } from './../../../pvu-common/search-employee/search-employee.component';
import { CCCExamData } from './../../../../../../models/pvu/employee-creation';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { EVENT_ERRORS } from './../index';
import { FormGroup, FormControl, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { Component, OnInit, Input, OnDestroy, OnChanges, Output, EventEmitter, ElementRef } from '@angular/core';
import { PVUEventsService } from '../services/pvu-event.service';
import * as _ from 'lodash';

@Component({
    selector: 'app-shetty-pay-scale',
    templateUrl: './shetty-pay.component.html',
    styleUrls: ['./shetty-pay.component.css']
})
export class ShettyPayComponent implements OnInit, OnDestroy, OnChanges {
    @Input() eventForm: FormGroup;
    @Input() eventDetails;
    @Input() lookupData;
    @Input() action;
    @Input() isRework;
    @Output() saveEvent: EventEmitter<any> = new EventEmitter();
    @Output() employeeDetailChange: EventEmitter<any> = new EventEmitter();
    isShettyPay: boolean = true;
    dateCheck = new Date('2003-04-01');
    dateCheck2 = new Date('2006-01-01');
    clearEmployeeCurrentDetails = false;
    showExamDetails: boolean = false;
    employeeDetails;
    employeeCurrentForm: FormGroup;
    postForm: FormGroup;
    empId;
    enableEmployeeSearch: boolean = false;
    errorMessage = EVENT_ERRORS;
    subscriber: Subscription[] = [];
    designationCtrl: FormControl = new FormControl();
    designationList = [];
    payBandCtrl: FormControl = new FormControl();
    gradePayCtrl: FormControl = new FormControl();
    payLevelCtrl: FormControl = new FormControl();
    cellIdCtrl: FormControl = new FormControl();
    payScaleCtrl: FormControl = new FormControl();
    payMasterData;
    isPostFormDisable: boolean = true;
    setSelectedPayBand;
    payLevelList = [];
    cellList = [];
    scaleList = [];
    payBandList = [];
    gradePayList = [];
    eligibleShettyPay: boolean = false;
    changeEffDate: boolean = true;
    @Output() resetFormEvent: EventEmitter<any> = new EventEmitter();
    isJudiciaryDepartment: boolean = false;
    constructor(
        private fb: FormBuilder,
        private eventService: PVUEventsService,
        private dialog: MatDialog,
        private toastr: ToastrService,
        private el: ElementRef
    ) { }

     /**
     * @method ngOnInit
     * @description Call when component is load and initialize the view and load data
     */
    ngOnInit() {
        const self = this;
        this.creatEmployeeForm();
        if (this.eventForm.get('eventEffectiveDate')) {
            this.checkEffectiveDateInRange(this.eventForm.get('eventEffectiveDate').value);
        }
        this.subscriber.push(this.eventForm.get('eventEffectiveDate').valueChanges.subscribe((res) => {
            self.checkEffectiveDateInRange(res);
        }));
    }

    /**
     * @method getPayMasters
     * @description Get Pay Masters Data From Database
     */
    getPayMasters() {
        const self = this,
        dataToSend = {
            request: {
                departmentCategoryId: this.employeeDetails.employee.departmentCategoryId,
                payCommissionId: this.employeeDetails.employee.payCommId,
            }
        };
        this.eventService.getPayMasters(dataToSend).subscribe(res => {
            if (res && res['status'] === 200 && res['result']) {
                self.payMasterData = res['result'];
                // tslint:disable-next-line:max-line-length
                if (this.employeeDetails && this.employeeDetails.employee && this.employeeDetails.employee.dateJoining) {
                    this.accDOJ(this.employeeDetails.employee.dateJoining);
                }
            } else {
                self.toastr.error(res['message']);
            }
        }, err => {
            self.toastr.error(err);
        });
    }

    /**
     * @method onEmployeeDetailChange
     * @description Call When Employee Number is Changed
     * @param employeeDetails Details of the employee from database
     */
    onEmployeeDetailsChange(employeeDetails) {
            this.employeeDetails = employeeDetails;
            this.employeeDetailChange.emit(employeeDetails);
            if (this.employeeDetails && this.employeeDetails.employee) {
                if (this.employeeDetails.employee.departmentCategoryId === 17) {
                    this.isJudiciaryDepartment = true;
                } else {
                    this.isJudiciaryDepartment = false;
                }
                // this.accDOJ(this.employeeDetails.employee.dateJoining);
                this.checkEmployeeEligible();
            } else {
                this.postForm.reset();
            }
    }
    /**
     * @method checkEmployeeEligible
     * @description it checks whether employee is eligible for shetty pay on given date
     */
    checkEmployeeEligible() {
        const params = { 'data' : {} },
            eventEffectiveDate =  this.eventForm.get('eventEffectiveDate').value;
        if (this.employeeDetails && this.employeeDetails.employee && this.employeeDetails.employee.employeeNo) {
            params['data']['employeeId'] = this.employeeDetails.employee.employeeId;
            params['data']['employeeNo'] = this.employeeDetails.employee.employeeNo;
        }
        params['data']['shettyPayID'] = this.eventDetails && this.eventDetails.id ? this.eventDetails.id : null;
        if (eventEffectiveDate) {
            let effDate: any = eventEffectiveDate,
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
        this.eventService.checkEligibilityForShettPay(params).subscribe((res) => {
            if (res && res['status'] === 200 && res['result']) {
                this.eligibleShettyPay = res['result'];
                this.getPayMasters();
            } else {
                this.toastr.error(res['message']);
                this.eligibleShettyPay = false;
                this.changeEffDate = false;
                this.eventForm.controls.employeeCurrentForm.reset();
                setTimeout(() => {
                    this.el.nativeElement.querySelector('.employee-number-field').focus();
                }, 0);
                this.postForm.reset();
            }
        }, (err) => {
            this.toastr.error(err);
        });
    }
    /**
     * @method accDOJ
     * @description According to Date Of Joining it flows to 5th or 6th Pay Commission
     * @param currDoj Current Date Of Joining
     */
    accDOJ(currDoj) {
        const self = this,
            doj = new Date(currDoj.split(' ')[0]);
        this.removeControls();
        if ((doj <= self.dateCheck) || (doj > self.dateCheck && doj < self.dateCheck2)) {
            this.eventForm.controls.payCommId.patchValue(150);
            let payScaleValue = null;
            if (this.employeeDetails && this.employeeDetails.employee.payScale) {
                payScaleValue = this.employeeDetails.employee.payScale;
            }
            if (this.eventDetails && this.eventDetails.payScale) {
                payScaleValue = this.eventDetails.payScale;
            }
            this.postForm.addControl('payScale', new FormControl(payScaleValue, Validators.required));
            this.setFifthData(150);
        } else {
            this.postForm.removeControl('payScale');
            this.eventForm.get('payCommId').setValue(151);
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
            this.postForm.addControl('payBandValue', new FormControl(payBandValue));
            this.postForm.addControl('gradePayId', new FormControl(gradePayId, Validators.required));
            this.setSixthData(151);
        }
    }

    /**
     * @method checkEffectiveDateInRange
     * @description It Checks Effective date is valid or not
     * @param effDateYear Effective Date
     */
    checkEffectiveDateInRange(effDateYear) {
        if (effDateYear) {
            if (effDateYear > new Date('2015-12-31') || effDateYear < new Date('2003-03-31')) {
                setTimeout(() => this.toastr.error('Shetty Pay is not applicable for Date ' + effDateYear.getDate()
                + '/' + (effDateYear.getMonth() + 1) + '/' + effDateYear.getFullYear()));
                this.eventForm.get('eventEffectiveDate').patchValue('');
                this.eventForm.get('eventEffectiveDate').markAsDirty();
            } else {
                if (!this.payMasterData) {
                    // this.getPayMasters(); // kept for future use
                }
            }
        } else {
            this.removeControls();
        }
    }

    /**
     * @method creatEmployeeForm
     * @description Create a Employee Form Group
     */
    creatEmployeeForm() {
        this.eventForm.removeControl('postForm');
        const self = this;
        if (this.eventForm) {
            this.eventForm.addControl('postForm', self.fb.group({
                basicPay: [''],
                dateOfNextIncrement: [''],
            }));
        } else {
            this.eventForm = self.fb.group({
                remarks: [],
                postForm: self.fb.group({
                    basicPay: [''],
                    dateOfNextIncrement: [''],
                })
            });
        }
        this.postForm = this.eventForm.get('postForm') as FormGroup;
    }

    /**
     * @method setFifthData
     * @description Set Data for Employee according to 5th pay commission
     * @param payCommissionId Pay Commission Id
     */
    setFifthData(payCommissionId) {
        const self = this,
            scaleList = _.orderBy(_.cloneDeep(this.payMasterData['data']), 'order', 'asc');
        if (this.employeeDetails) {
            if (this.employeeDetails.employee.payScale) {
                let currentPayScale = 0;
                scaleList.forEach((payScale, index) => {
                    if (payScale.id === Number(this.employeeDetails.employee.payScale)) {
                        currentPayScale = index;
                    }
                });
                self.scaleList = _.cloneDeep(self.getListAccEvent(scaleList, currentPayScale));
                self.postForm.get('payScale').patchValue(self.scaleList[0].id);
                this.calculateBasicPay(payCommissionId);
            }
        }
    }

    /**
     * @method setSixthData
     * @description Set Data for Employee according to 6th pay commission
     * @param payCommissionId Pay Commission Id
     */
    setSixthData(payCommissionId) {
        const self = this,
            sixData = _.orderBy(_.cloneDeep(this.payMasterData['data']), 'order', 'asc');
        if (this.employeeDetails) {
            if (this.employeeDetails.employee.payBandId) {
                let currentPayScale = 0;
                sixData.forEach((payBand, index) => {
                    if (payBand.id === Number(this.employeeDetails.employee.payBandId)) {
                        currentPayScale = index;
                    }
                });
                this.payBandList = _.cloneDeep(self.getListAccEvent(sixData, currentPayScale));
                this.postForm.get('payBandValue').patchValue(this.employeeDetails.employee.payBandValue);
                this.postForm.get('payBandId').patchValue(Number(self.employeeDetails.employee.payBandId));
                this.onPayBandChange();
                this.calculateBasicPay(payCommissionId);
            }
        }
        if (this.eventDetails && Number(this.employeeDetails.employee.employeeNo) === this.eventDetails.employeeNo) {
            this.payBandList = this.payBandList.length === 0 ? sixData : this.payBandList;
            if (this.eventDetails.payBandId) {
                this.postForm.get('payBandId').patchValue(this.eventDetails.payBandId);
                this.postForm.get('payBandValue').patchValue(this.eventDetails.payBandValue);
                this.postForm.get('gradePayId').patchValue(this.eventDetails.gradePayId);
                this.onPayBandChange();
                this.calculateBasicPay(payCommissionId);
            }
        }
    }

    /**
     * @method getListAccEvent
     * @description Slice The array according to index and return it.
     * @param data Array of Grade Pay
     * @param index index using to slice
     */
    getListAccEvent(data, index) {
        return data.splice(index);
    }

    /**
     * @method removeControls
     * @description function removes controls from post details
     */
    removeControls() {
        this.postForm.removeControl('payBandId');
        this.postForm.removeControl('payBandValue');
        this.postForm.removeControl('gradePayId');
        this.postForm.removeControl('payScale');

        this.postForm.get('basicPay').setValue('');
        this.postForm.get('basicPay').setValidators([Validators.required]);
        this.postForm.get('basicPay').updateValueAndValidity();
        this.postForm.get('dateOfNextIncrement').setValue('');
        this.postForm.get('dateOfNextIncrement').setValidators([Validators.required]);
    }

    /**
     * @method setIncrementDate
     * @description It sets increment date
     */
    setIncrementDate() {
        let doi;
        if (this.employeeDetails && this.employeeDetails.employee) {
            // tslint:disable-next-line:max-line-length
            if (this.employeeDetails.employee.dateNxtIncr &&
                !(this.employeeDetails.employee.dateNxtIncr instanceof Date)) {
                if (this.employeeDetails.employee.dateNxtIncr.indexOf(' ') !== -1) {
                    doi = this.employeeDetails.employee.dateNxtIncr.split(' ')[0].split('-');
                    doi = new Date(doi[0], Number(doi[1]) - 1, doi[2]);
                } else if (this.employeeDetails.employee.dateNxtIncr.indexOf('T') !== -1) {
                    doi = this.employeeDetails.employee.dateNxtIncr.split('T')[0].split('-');
                    doi = new Date(doi[0], Number(doi[1]) - 1, doi[2]);
                }
            }
        }
        this.postForm.patchValue({
            dateOfNextIncrement: doi
        });
    }

    /**
     * @method onPayBandChange
     * @description Triggered when Pay Band Value is Changed
     */
    onPayBandChange() {
        const sixData = _.cloneDeep(this.payMasterData['data']),
            payBandId = this.postForm.get('payBandId') ? this.postForm.get('payBandId').value : null;
        if (payBandId) {
            const gradePayData = sixData.filter((payBand) => {
                return payBand.id === payBandId;
            });
            const setSelectedPayBand = gradePayData[0];
            // tslint:disable-next-line:max-line-length
            this.postForm.get('payBandValue').setValidators([Validators.min(setSelectedPayBand.startingValue), Validators.max(setSelectedPayBand.endValue)]);
            if (gradePayData[0]) {
                this.gradePayList = _.cloneDeep(gradePayData[0].gradePays);
                const gradePay = this.gradePayList.filter((gradPay) => {
                    return gradPay.id === Number(this.employeeDetails.employee.gradePayId);
                })[0].id;
                this.postForm.get('gradePayId').patchValue(gradePay);
            }
        }
    }

     /**
     * @method saveDetails
     * @description Function is called when save as draft is clicked and it further emits so event details can be saved
     */
    saveDetails() {
        if (this.eventForm.valid && this.postForm.valid) {
            this.eligibleShettyPay ? this.saveEvent.emit() :
            this.toastr.error('Selected Employee is not eligible for Shetty Pay');
        } else {
            this.toastr.error('Please fill mandatory fields for save as draft!');
        }
    }

    /**
     * @method resetForm
     * @description Function is called when reset is clicked and it further emits so event details can be reset
     */
    resetForm() {
        this.resetFormEvent.emit(this.postForm);
    }

    /**
     * @method getStatus
     * @description Function is called to get status if this post details can be save or submit
     * @returns boolean value for status
     */
    getStatus() {
        if (this.postForm.invalid && !this.eligibleShettyPay) {
            _.each(this.postForm.controls, control => {
                if (control.status === 'INVALID') {
                    control.markAsTouched({ onlySelf: true });
                }
            });
            return false;
        }
        return true;
    }

    /**
     * @method calScaleBasicPay
     * @description It calculates increased basic pay for 5th pay commission
     * @param scaleName Scale Range
     * @param basicPay Current Basic Pay
     * @param yearCount How may year passed by
     * @returns increased basic pay
     */
    calScaleBasicPay(scaleName: string, basicPay: number, yearCount: number) {
        let payScaleName = scaleName;
            if (scaleName.includes('(')) {
                payScaleName = scaleName.split('(')[0];
                payScaleName = payScaleName.trim();
            }
        const arrOfScale = payScaleName.split('-');
        let increasedBasic = 0;
        if (arrOfScale.length > 2) {
            for (let i = 0; i < arrOfScale.length; i++) {
                if (+arrOfScale[i] > basicPay) {
                    increasedBasic = basicPay + (+(arrOfScale[ i - 1])) * yearCount;
                    break;
                }
            }
        }
        return increasedBasic;
    }

    /**
     * @method calculateBasicPay
     * @description It Sets basic pay according to pay commission
     * @param payCommissionId Pay Commission Id
     */
    calculateBasicPay(payCommissionId) {
        if (payCommissionId === 150) {
            const yearCount = 1;
            const basicPay = +this.employeeDetails.employee.empBasicPay;
            const payScale = this.postForm.get('payScale').value;
            const scaleName = this.scaleList.filter((scale) => {
                return scale.id === payScale ? scale.name : 0;
            })[0].name;
            const increasedBasic =  this.calScaleBasicPay(scaleName, basicPay, yearCount);
            this.postForm.get('basicPay').patchValue(increasedBasic);
        } else if (payCommissionId === 151) {
            const payBandValue = +this.postForm.get('payBandValue').value;
            const gradePayId = this.postForm.get('gradePayId').value;
            const gradePayValue = +this.gradePayList.filter((gradePay) => {
                return gradePay.id === gradePayId ? gradePay.gradePayValue : 0;
            })[0].gradePayValue;
            const increasedValue = (gradePayValue + payBandValue) * 0.03;
            const roundOffValue = increasedValue % 10 === 0 ?  increasedValue : (Math.ceil(increasedValue / 10) * 10);
            const basicPayValue = (gradePayValue + payBandValue) + roundOffValue;
            this.postForm.get('basicPay').patchValue(basicPayValue);
            // this.postForm.get('payBandValue').patchValue(payBandValue);
        }
        this.setIncrementDate();
    }

    /**
     * @method setShettyPayData
     * @description It Sets the Data for Shetty Pay
     */
    setShettyPayData() {
        const self = this;
        self.postForm.patchValue({
            // tslint:disable-next-line: max-line-length
            dateOfNextIncrement: this.eventDetails.dateOfNextIncrement ? new Date(this.eventDetails.dateOfNextIncrement) : null,
        });
        let payScaleValue = null;
        if (this.eventDetails && this.eventDetails.payScale) {
            payScaleValue = this.eventDetails.payScale;
            this.postForm.addControl('payScale', new FormControl(payScaleValue, Validators.required));
        }
        let payBandId = null,
                payBandValue = null,
                gradePayId = null;
        if (this.eventDetails) {
            if (this.eventDetails.payBandId) {
                payBandId = this.eventDetails.payBandId;
                this.postForm.addControl('payBandId', new FormControl(payBandId, Validators.required));
            }
            if (this.eventDetails.payBandValue) {
                payBandValue = this.eventDetails.payBandValue;
                this.postForm.addControl('payBandValue', new FormControl(payBandValue));
            }this.postForm.addControl('payBandValue', new FormControl(payBandValue));
            if (this.eventDetails.gradePayId) {
                gradePayId = this.eventDetails.gradePayId;
                this.postForm.addControl('gradePayId', new FormControl(gradePayId, Validators.required));
            }
            if (this.postForm.get('payBandId') && this.payMasterData) {
                this.setSixthData(151);
            }
        }
    }

    /**
     * @method ngOnDestroy
     * @description Function is called when compnent is destroyed to take necessary calls on view destroy from browser
     */
    ngOnDestroy() {
        this.subscriber.forEach(subscriber => {
            subscriber.unsubscribe();
        });
    }

    /**
     * @method ngOnChanges
     * @description Function is called when compnent is changed
     */
    ngOnChanges() {
        const self = this;
        // if (self.action === 'edit' || self.action === 'view') {
            if (self.eventDetails && this.postForm) {
                this.postForm.patchValue({
                    basicPay: self.eventDetails.basicPay
                });
                // this.setShettyPayData();
            }
        // }
        if (this.eventDetails) {
            if (this.postForm) {
                this.postForm.patchValue({
                    basicPay: this.eventDetails.basicPay,
                    dateOfNextIncrement: this.eventDetails.dateOfNextIncrement
                });
                // tslint:disable-next-line:max-line-length
                if (this.employeeDetails && this.employeeDetails.employee && this.employeeDetails.employee.dateJoining && this.payMasterData) {
                    this.accDOJ(this.employeeDetails.employee.dateJoining);
                }
            }
        }
    }
}
