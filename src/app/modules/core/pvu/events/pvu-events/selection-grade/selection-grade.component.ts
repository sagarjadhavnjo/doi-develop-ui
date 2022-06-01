import { ToastrService } from 'ngx-toastr';
import { SearchEmployeeComponent } from './../../../pvu-common/search-employee/search-employee.component';
import { CCCExamData } from './../../../../../../models/pvu/employee-creation';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { EVENT_ERRORS } from './../index';
import { FormGroup, FormControl, FormBuilder, Validators, FormControlName, AbstractControl } from '@angular/forms';
import { Component, OnInit, Input, OnDestroy, OnChanges, Output, EventEmitter } from '@angular/core';
import { PVUEventsService } from '../services/pvu-event.service';
import * as _ from 'lodash';
import { PvuCommonService } from '../../../pvu-common/services/pvu-common.service';

@Component({
    selector: 'app-selection-grade',
    templateUrl: './selection-grade.component.html',
    styleUrls: ['./selection-grade.component.css']
})
export class SelectionGradeComponent implements OnInit, OnDestroy, OnChanges {
    @Input() eventForm: FormGroup;
    @Input() eventDetails;
    @Input() lookupData;
    @Input() action;
    @Output() saveEvent: EventEmitter<any> = new EventEmitter();
    @Output() employeeDetailChange: EventEmitter<any> = new EventEmitter();
    @Input() isRework = false;
    clearEmployeeCurrentDetails = false;
    showExamDetails: boolean = true;
    employeeDetails;
    clearExamDetails = false;
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

    fifthMin: number = 0;
    fifthMax: number = 0;
    enableBasicPayEdit: boolean = true;
    rangeArray;
    eventEffectiveDate;

    @Output() resetFormEvent: EventEmitter<any> = new EventEmitter();
    setSelectedPayBand;
    payLevelList = [];
    cellList = [];
    scaleList = [];
    payBandList = [];
    gradePayList = [];

    eligible = false;
    changeDNI = false;
    isJudiciaryDepartment: boolean = false;
    constructor(
        private fb: FormBuilder,
        private eventService: PVUEventsService,
        private commonService: PvuCommonService,
        private dialog: MatDialog,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        const self = this;
        this.creatEmployeeForm();
        this.getDesignations();
        this.subscriber.push(this.eventForm.get('payCommId').valueChanges.subscribe(res => {
            self.onPayCommisionChange(res);
        }));
        if (this.eventForm.get('payCommId') && this.eventForm.get('payCommId').value) {
            self.onPayCommisionChange(this.eventForm.get('payCommId').value);
        }
        if (this.eventForm.get('eventEffectiveDate').value) {
            self.onEventEffectiveDateChange(this.eventForm.get('eventEffectiveDate').value);
        }
        this.subscriber.push(this.eventForm.get('eventEffectiveDate').valueChanges.subscribe(res => {
            self.onEventEffectiveDateChange(res);
        }));
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
            beneEffictDate: self.eventEffectiveDate
        });
        this.postForm.get('beneEffictDate').disable();
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
                if (this.eventForm.get('payCommId') && this.eventForm.get('payCommId').value) {
                    this.setCommList(this.eventForm.get('payCommId').value);
                }
            } else {
                self.toastr.error(res['message']);
            }
        }, err => {
            self.toastr.error(err);
        });
    }

    /**
     * @method getDesignations
     * @description Fuction is called to get all the designation
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
     * @method clearExmDetails
     * @description Function is called to clear exam details
     */
    clearExmDetails() {
        this.clearExamDetails = true;
    }

    /**
     * @method onEmployeeDetailsChange
     * @param employeeDetails Parameter brings details of loaded employee from current employe detail component
     * @description Function is called when user enters new employee number/ Update employee no.
     */
    onEmployeeDetailsChange(employeeDetails) {
        this.employeeDetails = employeeDetails;
        this.employeeDetailChange.emit(employeeDetails);
        if (this.employeeDetails) {
            if (this.employeeDetails.employee) {
                if ((this.employeeDetails.employee.departmentCategoryId === 17 )
                    && this.eventForm.get('payCommId').value === 151) {
                    this.isJudiciaryDepartment = true;
                } else {
                    this.isJudiciaryDepartment = false;
                }
                this.clearEmployeeCurrentDetails = false ;
                this.clearExamDetails = false ;
                if (this.employeeDetails.employee.designationId) {
                    this.postForm.get('designationId').setValue(Number(this.employeeDetails.employee.designationId));
                }
                if (this.employeeDetails.employee.dateNxtIncr &&
                    !(this.employeeDetails.employee.dateNxtIncr instanceof Date)) {
                    const datNxtIncr = this.getNextIncrementDate();
                    this.postForm.patchValue({
                        dateOfNextIncrement: datNxtIncr
                    });
                }
                this.getPayMasters();
                this.postForm.patchValue({
                    beneEffictDate : this.eventForm.get('eventEffectiveDate').value
                });
                this.checkForEligibility();
            }
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
            this.commonService.checkforEligibility(params).subscribe(res => {
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
                        const postbasic = Number(this.postForm.get('basicPay').value);
                        if (postbasic && currentBasic !== postbasic) {
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

    /**
     * @method getNextIncrementDate
     * @description method return current next Increament date of employee
     */
    getNextIncrementDate() {
        let doi = null;
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
        return doi;
    }

    /**
     * @method onPayCommisionChange
     * @description Fuction triggers when there is change in pay commision in event tab
     * @param payCommissionId Selected Pay commisiomn Id is passed
     */
    onPayCommisionChange(payCommissionId) {
        this.postForm.removeControl('payLevelId');
        this.postForm.removeControl('cellId');
        this.postForm.removeControl('payBandId');
        this.postForm.removeControl('payBandValue');
        this.postForm.removeControl('gradePayId');
        this.postForm.removeControl('payScale');

        this.postForm.get('basicPay').setValue('');
        this.postForm.get('basicPay').setValidators(null);
        this.postForm.get('basicPay').updateValueAndValidity();
        if ( this.postForm.get('dateOfNextIncrement') ) {
            this.postForm.get('dateOfNextIncrement').setValue('');
        }
        if ( this.postForm.get('designationId') ) {
            this.postForm.get('designationId').setValue('');
        }
        if (this.postForm.get('beneEffictDate')) {
            this.postForm.get('beneEffictDate').setValue('');
        }
        this.enableBasicPayEdit = true;
        this.changeDNI = false;
        switch (payCommissionId) {
            case 148:
                // 3 comm
                break;
            case 149:
                // 4 comm
                break;
            case 150:
                this.postForm.get('basicPay').setValidators([Validators.required]);
                this.postForm.get('basicPay').updateValueAndValidity();
                let payScaleValue = null;
                if (this.eventDetails && this.eventDetails.payScale) {
                    payScaleValue = this.eventDetails.payScale;
                }
                this.enableBasicPayEdit = false;
                this.postForm.addControl('payScale', new FormControl(payScaleValue));
                // 5 comm
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
                this.postForm.addControl('payBandId', new FormControl(payBandId));
                this.postForm.addControl('payBandValue', new FormControl(payBandValue));
                this.postForm.addControl('gradePayId', new FormControl(gradePayId));
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
                }
                this.postForm.addControl('payLevelId', new FormControl(payLevelId));
                this.postForm.addControl('cellId', new FormControl(cellId));
                break;
        }
    }

    /**
     * @method creatEmployeeForm
     * @description creates form group post details
     */
    creatEmployeeForm() {
        const self = this;
        this.eventForm.removeControl('postForm');
        if (this.eventForm) {
            this.eventForm.addControl('postForm', self.fb.group({
                designationId: ['', Validators.required],
                beneEffictDate: [''],
                basicPay: [''],
                dateOfNextIncrement: ['']
            }));
        } else {
            this.eventForm = self.fb.group({
                postForm: self.fb.group({
                    designationId: ['', Validators.required],
                    beneEffictDate: [''],
                    basicPay: [''],
                    dateOfNextIncrement: ['']
                })
            });
        }
        this.postForm = this.eventForm.get('postForm') as FormGroup;
    }

    /**
     * @method setCommList
     * @description Function is called to set pay commission datta to dropdown on what commission is selected
     * @param payCommissionId what pay commission is selected, that id is provided
     */
    setCommList(payCommissionId) {
        if (this.action === 'view') {
            this.postForm.disable();
        }
        switch (payCommissionId) {
            case 148:
                // 3 comm
                break;
            case 149:
                // 4 comm
                break;
            case 150:
                this.postForm.patchValue({
                        payScale : null,
                        basicPay : ''
                    });
                this.setFifthData();
                // 5 comm
                break;
            case 151:
                this.postForm.patchValue({
                    payBandId : null,
                    payBandValue : '',
                    gradePayId : null,
                    basicPay : ''
                });
                this.setSixthData();
                // 6 comm
                break;
            case 152:
                // 7 comm
                this.postForm.patchValue( {
                    payLevelId : null,
                    cellId : null,
                    basicPay : ''
                });
                this.setSeventhData();
                break;
        }
    }

     /**
     * @method setFifthData
     * @description Function is called to set fifth pay commission data
     */
    setFifthData() {
        const scaleList = _.orderBy(_.cloneDeep(this.payMasterData['data']), 'order', 'asc');
        if (this.employeeDetails) {
            if (this.employeeDetails.employee.payScale) {
                let currentPayScale = 0;
                scaleList.forEach((payScale, index) => {
                    if (Number(payScale.id) === Number(this.employeeDetails.employee.payScale)) {
                        currentPayScale = index;
                    }
                });
                this.scaleList = _.cloneDeep(this.getListAccEvent(scaleList, currentPayScale));
            }
        }
        if (this.eventDetails && this.employeeDetails) {
            if (this.eventDetails.payScale && (Number(this.employeeDetails.employee.employeeNo)
            === Number(this.eventDetails.employeeNo))) {
                this.postForm.get('payScale').patchValue(this.eventDetails.payScale);
                this.postForm.get('basicPay').patchValue(this.eventDetails.basicPay);
                this.onPayScaleChange();
            }
        }
    }

    /**
     * @method onPayScaleChange
     * @description Function is called when user selects pay scale value in post details
     */
    onPayScaleChange () {
        if (this.action === 'new' || this.postForm.get('basicPay').value === null ) {
            this.postForm.get('basicPay').setValue('');
        }
        const payScaleId = this.postForm.get('payScale') ? this.postForm.get('payScale').value : null;
        if (payScaleId) {
            const selectedScaleData = this.scaleList.filter((scale) => {
                return Number(scale.id) === Number(payScaleId);
            });
            if (selectedScaleData.length > 0) {
                if (selectedScaleData[0]['name']) {
                    let payScaleName = selectedScaleData[0].name;
                    if (payScaleName.includes('(')) {
                        payScaleName = payScaleName.split('(')[0];
                        payScaleName = payScaleName.trim();
                    }
                    this.rangeArray = payScaleName.split('-');
                    this.fifthMin = Number(this.rangeArray[0]);
                    this.fifthMax = Number(this.rangeArray[0]);
                    if (this.action === 'edit' || this.action === 'new') {
                        if (this.rangeArray.length > 1) {
                            this.fifthMax = Number(this.rangeArray[this.rangeArray.length - 1]);
                            if ((Number(payScaleId) === Number(this.employeeDetails.employee.payScale))
                            || ((Number(this.employeeDetails.employee.empBasicPay) > this.fifthMin)
                            && (Number(this.employeeDetails.employee.empBasicPay) < this.fifthMax))) {
                                this.postForm.get('basicPay').patchValue(this.employeeDetails.employee.empBasicPay);
                            } else {
                                this.postForm.get('basicPay').patchValue(this.fifthMin);
                            }
                            if (this.action === 'edit') {
                                if (this.eventDetails) {
                                    if (this.eventDetails.basicPay) {
                                        if (this.eventDetails.basicPay !== 0
                                            && (Number(payScaleId)
                                            === Number(this.eventDetails.payScale))) {
                                            this.postForm.get('basicPay').patchValue(this.eventDetails.basicPay);
                                        }
                                    }
                                }
                            }
                        }
                    this.postForm.get('basicPay').setValidators([Validators.min(this.fifthMin)
                        , Validators.max(this.fifthMax), Validators.required]);
                    this.postForm.get('basicPay').updateValueAndValidity();
                    }
                    this.calculateFifthBasicPay(this.postForm.get('basicPay'));
                }
            }
        }
    }

      /**
     * @method calculateFifthBasicPay
     * @description function called to check employee eligibility for next-increament-date 5th pay comm
     */
    calculateFifthBasicPay(control: AbstractControl) {
        if (control.errors) {
            return true;
        }
        if ( Number(this.eventForm.get('payCommId').value) === 150 || this.isJudiciaryDepartment) {
        const currentPaySel = control.value;
        if (!isNaN(currentPaySel)) {
            const paySelectedLenth = this.rangeArray.length;
            if (paySelectedLenth > 2) {
                for (let i = 2; i < paySelectedLenth; i += 2) {
                    // tslint:disable-next-line:max-line-length
                    if (Number(currentPaySel) >= Number(this.rangeArray[i - 2]) && Number(currentPaySel) <= this.rangeArray[i]) {
                        let diff = this.rangeArray[i - 2] - currentPaySel;
                        diff /= this.rangeArray[i - 1];
                        if (diff.toString().indexOf('.') !== -1) {
                            control.setErrors({
                                // tslint:disable-next-line:max-line-length
                                wrongValue: 'Please enter between ' + this.rangeArray[i - 2] + '-' + this.rangeArray[i] + ' in multiples of ' + this.rangeArray[i - 1] + ' like ' + (Number(this.rangeArray[i - 2]) + Number(this.rangeArray[i - 1])) + ', ' + (Number(this.rangeArray[i - 2]) + (Number(this.rangeArray[i - 1])) * 2) + '...'
                            });
                            control.markAsTouched({ onlySelf: true });
                        } else {
                            this.setDateOfNxtIncr();
                        }
                    }
                }
            }
        }
        // if (this.postForm.get('basicPay').status !== 'INVALID' ) {
        //     const payScale = Number(this.postForm.get('payScale').value);
        //     if (Number(this.postForm.get('basicPay').value)
        //     > Number(this.employeeDetails.employee.empBasicPay)) {
        //         this.setNextIncrementDate();
        //     } else {
        //         this.postForm.patchValue({
        //             dateOfNextIncrement: doi
        //         });
        //     }
        // }
        }
    }

    /**
     * @method setSixthData
     * @description Function is called to set Sixth pay commission data
     */
    setSixthData() {
        const sixData = _.orderBy(_.cloneDeep(this.payMasterData['data']), 'order', 'asc');
        if (this.employeeDetails) {
            if (this.employeeDetails.employee.payBandId) {
                let currentPayScale = 0;
                sixData.forEach((payBand, index) => {
                    if (Number(payBand.id) === Number(this.employeeDetails.employee.payBandId)) {
                        currentPayScale = index;
                    }
                });
                this.payBandList = _.cloneDeep(this.getListAccEvent(sixData, currentPayScale));
            }
        }
        if (this.eventDetails && this.employeeDetails) {
            if (this.eventDetails.payBandId && (Number(this.employeeDetails.employee.employeeNo)
            === Number(this.eventDetails.employeeNo))) {
                this.postForm.get('payBandId').patchValue(this.eventDetails.payBandId);
                this.onPayBandChange();
                this.postForm.get('payBandValue').patchValue(this.eventDetails.payBandValue);
                this.postForm.get('gradePayId').patchValue(this.eventDetails.gradePayId);
                this.calculateSixthBasic();
            }
        }
    }


    /**
     * @method onPayBandChange
     * @description Function is called when pay band value get changed in post details
     */
    onPayBandChange() {
        if (this.action === 'edit' || this.action === 'new') {
                this.postForm.patchValue({
                    basicPay : '',
                    gradePayId : null
                });
        }
        const sixData = _.cloneDeep(this.payMasterData['data']),
            payBandId = this.postForm.get('payBandId') ? this.postForm.get('payBandId').value : null;
        if (payBandId) {
            const gradePayData = sixData.filter((payBand) => {
                return Number(payBand.id) === Number(payBandId);
            });
            const setSelectedPayBand = gradePayData[0];
            // tslint:disable-next-line:max-line-length
            this.postForm.get('payBandValue').setValidators([Validators.min(setSelectedPayBand.startingValue), Validators.max(setSelectedPayBand.endValue)]);
            if (gradePayData[0]) {
                this.gradePayList = _.cloneDeep(gradePayData[0].gradePays);
                if (Number(this.employeeDetails.employee.payBandId) === Number(payBandId)) {
                    if (this.action !== 'view') {
                        this.gradePayList = this.gradePayList.filter((gradePay) => {
                            if ((Number(gradePay.gradePayValue) > Number(this.employeeDetails.employee.gradePayName))
                            && (Number(gradePay.id) !== Number(this.employeeDetails.employee.gradePayId))) {
                                return true;
                            }
                            return false;
                        });
                    }
                }

            }
            if (!this.postForm.get('payBandValue').value || this.action === 'edit' || this.action === 'new') {
                if (gradePayData[0].startingValue <= this.employeeDetails.employee.payBandValue
                    && gradePayData[0].endValue >= this.employeeDetails.employee.payBandValue) {
                    this.postForm.get('payBandValue').setValue(this.employeeDetails.employee.payBandValue);
                } else {
                    this.postForm.get('payBandValue').setValue(gradePayData[0].startingValue);
                }
            }
            this.setDateOfNxtIncr();
            if (this.isJudiciaryDepartment) {
                if (setSelectedPayBand.gradePays && setSelectedPayBand.gradePays[0]) {
                    this.postForm.get('gradePayId').patchValue(setSelectedPayBand.gradePays[0].id);
                }
                this.setCurrentPayValidation(setSelectedPayBand, this.postForm.get('payBandValue'));
                if (this.postForm.get('payBandValue')) {
                    this.calculateSixthBasic();
                }
            } else {
                this.calculateSixthBasic();
            }
        }
    }

    /**
     * @method calculateSixthBasic
     * @description Function called to calculate basic pay for 6 pay comm check for inreament date
     */
    calculateSixthBasic() {
        if ((this.postForm.get('payBandValue').status !== 'INVALID' && this.postForm.get('gradePayId').value)
        || this.postForm.get('payBandValue').status !== 'INVALID' ) {
            const payBandValue = Number(this.postForm.get('payBandValue').value);
            const gradePayValue = this.postForm.get('gradePayId').value ? this.getGradePayValue()
            : null;
            if (gradePayValue) {
                const basic = Number(gradePayValue) + payBandValue;
                this.postForm.get('basicPay').setValue(basic);
            }
        } else {
            this.postForm.get('basicPay').setValue('');
        }
    }

    setCurrentPayValidation(fifthData, control) {
        if (fifthData) {
            let payScaleName = fifthData.payBandName;
            if (fifthData.payBandName.includes('(')) {
                payScaleName = fifthData.payBandName.split('(')[0];
                payScaleName = payScaleName.trim();
            }
            this.rangeArray = payScaleName.split('-');
            this.fifthMin = Number(this.rangeArray[0]);
            const paySelectedLength = this.rangeArray.length;
            if (!isNaN(this.rangeArray[paySelectedLength - 1])) {
                this.fifthMax = Number(this.rangeArray[paySelectedLength - 1]);
            } else {
                this.fifthMax = Number(this.rangeArray[0]);
            }
            control.setValidators([Validators.required,
            Validators.min(this.fifthMin), Validators.max(this.fifthMax)]);
            control.updateValueAndValidity();
            if (control.value) {
                this.calculateFifthBasicPay(control);
            }
        }
    }

    onPayBandValueChange(control: AbstractControl) {
        this.calculateFifthBasicPay(control);
        if (!control.errors) {
            this.calculateSixthBasic();
        }
    }

    /**
     * @method getGradePayValue
     * @description function returns grade pay value for selected gradepayid
     */
    getGradePayValue() {
    const gradePayId = Number(this.postForm.get('gradePayId').value);
    const gradePay = this.gradePayList.filter( (gradepay) => {
        return gradePayId === Number(gradepay.id);
    });
    if (gradePay.length > 0) {
        return gradePay[0].gradePayValue;
        }
    return '0';
    }

    /**
     * @method getListAccEvent
     * @description function return spliced array according to current index
     * @param data array of values needed to splice
     * @param index from which index the array elements should be taken
     */
    getListAccEvent(data, index) {
        if (Number(this.eventForm.get('payCommId').value) === 151 || this.action === 'view') {
            return data.splice(index);
        }
        return data.splice(index + 1);
    }


     /**
     * @method setSeventhData
     * @description Function is called to set Seventh pay commission data
     */
    setSeventhData() {
        const sevenData = _.orderBy(_.cloneDeep(this.payMasterData['data']), 'order', 'asc');
        if (this.employeeDetails) {
            if (this.employeeDetails.employee.payLevelId) {
                let currentPayScale = 0;
                sevenData.forEach((payLevel, index) => {
                    if (Number(payLevel.id) === Number(this.employeeDetails.employee.payLevelId)) {
                        currentPayScale = index;
                    }
                });
                this.payLevelList = _.cloneDeep(this.getListAccEvent(sevenData, currentPayScale));
            }
        }
        if (this.eventDetails && this.employeeDetails) {
            if (this.eventDetails.payLevelId && (Number(this.employeeDetails.employee.employeeNo)
                === Number(this.eventDetails.employeeNo))) {
                this.postForm.get('payLevelId').patchValue(this.eventDetails.payLevelId);
                this.onPayLevelChange();
            }
        }
    }

     /**
     * @method onPayLevelChange
     * @description Function is called when pay Level value get changed in post details
     */
    onPayLevelChange() {
        const sevenData = _.cloneDeep(this.payMasterData['data']),
            payLevelId = this.postForm.get('payLevelId') ? this.postForm.get('payLevelId').value : null;
        if (payLevelId) {
            const cellData = sevenData.filter((payBand) => {
                return Number(payBand.id) === Number(payLevelId);
            });
            if (cellData[0]) {
                this.cellList = _.cloneDeep(cellData[0].cells);
                if (this.employeeDetails && this.employeeDetails.employee) {
                    this.calculateSeventhBasicPay();
                }
            }
        }
    }

    /**
     * @method calculateSeventhBasicPay
     * @description Function called to calculate basic pay for 7 pay comman check for inreament date
     */
    calculateSeventhBasicPay() {
        const self = this,
        params = {
            'request': {
                'newPaylevelId': Number(this.postForm.get('payLevelId').value),
                'oldPaylevelId': Number(this.employeeDetails.employee.payLevelId),
                'cellValue': this.employeeDetails.employee.empBasicPay
            }
        };
        this.eventService.calcSelectionGradeSeventhBasic(params).subscribe(res => {
            if (res['result'] && res['status'] === 200) {
                self.postForm.patchValue({
                    cellId: Number(res['result']['cId']),
                    basicPay: res['result']['cellValue'],
                    payLevelId: res['result']['paylevelId'],
                });
                this.changeDNI = res['result']['flag'];
                if (res['result']['flag']) {
                    this.setDateOfNxtIncr();
                } else {
                    const doi = this.getNextIncrementDate();
                    this.postForm.patchValue({
                        dateOfNextIncrement: doi
                    });
                }
            } else {
                self.postForm.patchValue({
                    cellId: null,
                    basicPay: ''
                });
                self.toastr.error(res['message']);
            }
        }, err => {
            self.postForm.patchValue({
                cellId: null,
                basicPay: ''
            });
            self.toastr.error(err);
        });
    }

    /**
     * @method saveDetails
     * @description function send values to pvu-events and save them
     */
    saveDetails() {
        if (this.employeeDetails) {
            if (this.employeeDetails.employee) {
                this.saveEvent.emit();
            }
        } else {
            this.toastr.error('Employee Details not available');
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
            if ( Number(this.postForm.get('basicPay').value) < Number(this.employeeDetails.employee.empBasicPay) ) {
                this.toastr.error('Post Basic Pay is less than Current Basic Pay');
                return false;
            }
        }
        return true;
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
     * @method ngOnChanges
     * @description Function is called to take necessary actions when input parameters are changed from outside
     */
    ngOnChanges() {
        if (this.eventDetails) {
            if (this.postForm) {
                this.postForm.patchValue({
                    designationId: this.eventDetails.designationId,
                    beneEffictDate: this.eventDetails.beneEffictDate,
                    basicPay: this.eventDetails.basicPay,
                    dateOfNextIncrement: this.eventDetails.dateOfNextIncrement
                });
                if (this.eventForm.get('payCommId') && this.eventForm.get('payCommId').value && this.payMasterData) {
                    this.setCommList(this.eventForm.get('payCommId').value);
                }
            }
        }
    }

     /**
     * @method resetForm
     * @description Function is called when reset is clicked and it further emits so event details can be reset
     */
    resetForm() {
        this.resetFormEvent.emit(this.postForm);
    }
}
