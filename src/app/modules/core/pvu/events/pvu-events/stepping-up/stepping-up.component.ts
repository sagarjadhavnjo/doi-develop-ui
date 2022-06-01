import { ToastrService } from 'ngx-toastr';
import { SearchEmployeeComponent } from './../../../pvu-common/search-employee/search-employee.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { EVENT_ERRORS } from './../index';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input, OnDestroy, OnChanges, Output, EventEmitter } from '@angular/core';
import { PVUEventsService } from '../services/pvu-event.service';
import * as _ from 'lodash';

@Component({
    selector: 'app-stepping-up',
    templateUrl: './stepping-up.component.html',
    styleUrls: ['./stepping-up.component.css']
})
export class SteppingUpComponent implements OnInit, OnChanges, OnDestroy {
    @Input() eventForm: FormGroup;
    @Input() action: string;
    @Input() eventDetails: any;
    @Input() lookUpData: any;
    @Output() saveEvent: EventEmitter<any> = new EventEmitter();
    @Output() resetFormEvent: EventEmitter<any> = new EventEmitter();
    @Output() employeeDetailChange: EventEmitter<any> = new EventEmitter();
    @Input() isRework;
    showExamDetails: boolean = false;
    employeeDetails: any = {};
    payMasterData: any;
    title: string = 'Post Details';
    employeeTitle: string = 'Current Details of Senior Employee';
    steppingUpJnr: FormGroup;
    postForm: FormGroup;
    otherDetailsForm: FormGroup;
    empId: number;
    subscriber: Subscription[] = [];
    errorMessage = EVENT_ERRORS;
    jnrEmpId: number;
    jnrEmployeeDetails: any;
    eventEffectiveDate: Date;
    actualMinDate: Date;
    eligible: boolean = false;
    seniorEmployeeSelected = false;
    isFifth: boolean = false;
    clearEmployeeCurrentDetails = false;
    todayDate: Date;
    isPayStepUp = false;
    isDateStepUp = false;
    payCheck: boolean = false;
    payCommCheck: boolean = false;
    joiningCheck: boolean = false;
    basicPayCheck: boolean = false;
    IncrCheck: boolean = false;
    ClassCheck: boolean = false;
    DeptCheck: boolean = false;
    DesignationCheck: boolean = false;
    isStpAvail: boolean = false;
    isJudiciaryDepartment: boolean = false;
    constructor(
        private fb: FormBuilder,
        private eventService: PVUEventsService,
        private dialog: MatDialog,
        private toastr: ToastrService
    ) { }

    /**
     * @method ngOnInit
     * @description Call when component is load and initialize the view and load data
     */
    ngOnInit() {
        const self = this;
        this.todayDate = new Date();
        this.todayDate.setHours(0, 0, 0, 0);
        this.creatEmployeeForm();
        self.title = 'Stepping Up Changes for Senior Employee';
        if (this.eventForm.get('steppingUpTypeId').value) {
            self.onStepUpTypeChange(this.eventForm.get('steppingUpTypeId').value);
        }
        // this.onStepUpTypeChange(1);
        if (this.eventForm.get('payCommId').value) {
            self.onPayCommissionValueChange(this.eventForm.get('payCommId').value);
        }
        if (this.eventForm.get('eventEffectiveDate').value) {
            self.onEventEffectiveDateChange(this.eventForm.get('eventEffectiveDate').value);
        }
        this.subscriber.push(
            this.eventForm.get('eventEffectiveDate').valueChanges.subscribe(res => {
                self.onEventEffectiveDateChange(res);
            })
        );
        this.subscriber.push(
            this.eventForm.get('steppingUpTypeId').valueChanges.subscribe(res => {
                this.isPayStepUp = false;
                this.isDateStepUp = false;
                self.onStepUpTypeChange(res);
                if (self.action !== 'view') {
                    this.clearJuniorEmpDetails();
                    this.clearPostForm();
                }
            })
        );
        this.subscriber.push(
            this.eventForm.get('payCommId').valueChanges.subscribe(res => {
                self.onPayCommissionValueChange(res);
                if (self.action !== 'view') {
                    this.clearJuniorEmpDetails();
                    this.clearPostForm();
                }
            })
        );
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
            chBeneEffDate: self.eventEffectiveDate
        });
    }

    /**
     * @method creatEmployeeForm
     * @description Function is called to initialize form group for post details
     */
    creatEmployeeForm() {
        const self = this;
        if (this.eventForm) {
            this.eventForm.removeControl('steppingUpJnr');
            this.eventForm.removeControl('postForm');
            self.eventForm.removeControl('otherDetailsForm');
            self.eventForm.addControl('steppingUpJnr', this.fb.group({
                jrEmpNo: null,
                name: null,
                class: null,
                designation: null,
                basicPay: null,
                doj: null,
                dor: null,
                officeName: null,
                dateOfNextIncrement: null,
                jrEmpId: null
            })
            );
            self.eventForm.addControl('postForm', this.fb.group({
                class: null,
                classId: null,
                designation: null,
                designationId: null,
                basicPay: null,
                dateOfNextIncrSrJnr: null,
                dateOfNextIncrSrJnrOf: null,
                chBeneEffDate: null,
            })
            );
            self.eventForm.addControl('otherDetailsForm', self.fb.group({
                srSeniorNo: ['', Validators.required],
                jrSeniorNo: ['', Validators.required],
                isStpAvail: [''],
                prvStpAvailDtls: [''],
            }));
        } else {
            this.eventForm = self.fb.group({
                steppingUpJnr: self.fb.group({
                    jrEmpNo: null,
                    name: null,
                    class: null,
                    designation: null,
                    basicPay: null,
                    doj: null,
                    dor: null,
                    officeName: null,
                    dateOfNextIncrement: null,
                    jrEmpId: null,

                }),
                postForm: self.fb.group({
                    class: null,
                    classId: null,
                    designation: null,
                    designationId: null,
                    basicPay: null,
                    dateOfNextIncrSrJnr: null,
                    dateOfNextIncrSrJnrOf: null,
                    chBeneEffDate: null,
                }),
                otherDetailsForm: self.fb.group({
                    srSeniorNo: ['', Validators.required],
                    jrSeniorNo: ['', Validators.required],
                    isStpAvail: [''],
                    prvStpAvailDtls: [''],
                })
            });
        }
        this.steppingUpJnr = this.eventForm.get('steppingUpJnr') as FormGroup;
        this.postForm = this.eventForm.get('postForm') as FormGroup;
        this.otherDetailsForm = this.eventForm.get('otherDetailsForm') as FormGroup;
    }

    /**
     * @description Function is called when Stepping Up Value Changes
     * @param value value of Stepping Up Type
     */
    onStepUpTypeChange(value) {
        switch (value) {
            case 489:
                this.isPayStepUp = true;
                break;
            case 490:
                this.isDateStepUp = true;
                break;
        }
    }

    /**
     * @method checkForEligibility
     * @description Function is called to check eligibility of employee searched
     * as he is applicable for stepping up or not
     */
    checkForEligibility() {
        const self = this,
            effectiveDate: Date = this.eventForm.controls.eventEffectiveDate.value,
            dataToSend1 = {
                pageIndex: 0,
                pageElement: 10,
                jsonArr: [
                    {
                        key: 'empNo',
                        value: Number(this.employeeDetails.employee.employeeNo)
                    },
                    {
                        key: 'effectiveDate',
                        value: '0'
                    },
                    {
                        key: 'payCommission',
                        value: this.eventForm.get('payCommId').value
                    },
                    {
                        key: 'eventId',
                        value: '0'
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
            dataToSend1['jsonArr'][1].value = effDateToSend;
        }
        this.eventService.getJnrEmpDetailss(dataToSend1).subscribe(
            res => {
                if (res['status'] === 200 && res['result'] !== null) {
                    self.eligible = res['result'];
                } else {
                    self.employeeDetails = null;
                    self.eligible = false;
                    this.postForm.disable();
                    self.clearEmployeeCurrentDetails = true;
                    self.toastr.error(res['message']);
                }
                self.onEmployeeEligible();
            },
            err => {
                self.employeeDetails = null;
                self.eligible = false;
                this.postForm.disable();
                self.clearEmployeeCurrentDetails = true;
                self.toastr.error(err);
            }
        );
    }

    /**
     * @method onClickAvailedReason
     * @description Function is called to show/hide Availed Reason text field
     */
    onClickAvailedReason(event) {
        if (event.checked === true) {
            this.isStpAvail = true;
            this.otherDetailsForm.controls.prvStpAvailDtls.setValidators(Validators.required);
            this.otherDetailsForm.controls.prvStpAvailDtls.updateValueAndValidity();
        } else {
            this.isStpAvail = false;
            this.otherDetailsForm.controls.prvStpAvailDtls.clearValidators();
            this.otherDetailsForm.controls.prvStpAvailDtls.setValue(null);
            this.otherDetailsForm.controls.prvStpAvailDtls.updateValueAndValidity();
        }
        if (this.action === 'view') {
            this.otherDetailsForm.controls.prvStpAvailDtls.disable();
        }
    }

    /**
     * @method onEmployeeEligible
     * @description Function is called to perform further on employee eligibility
     */
    onEmployeeEligible() {
        if (this.eventDetails) {
            this.otherDetailsForm.patchValue({
                'srSeniorNo': this.eventDetails.srSeniorNo,
                'jrSeniorNo': this.eventDetails.jrSeniorNo,
                'isStpAvail' : this.eventDetails.isStpAvail === 2,
                'prvStpAvailDtls' : this.eventDetails.prvStpAvailDtls
            });
            this.setEventPostData();
            this.isStpAvail = this.eventDetails.isStpAvail === 2;
            this.onClickAvailedReason({checked: this.isStpAvail});
            
        }
        if (this.employeeDetails && this.employeeDetails.employee) {
            if (this.action === 'view') {
                this.steppingUpJnr.disable();
                this.postForm.disable();
            }
            this.clearEmployeeCurrentDetails = false;

            this.seniorEmployeeSelected = true;
        } else {
            this.seniorEmployeeSelected = false;
            this.steppingUpJnr.patchValue({
                jrEmpNo: null,
                name: null,
                class: null,
                designation: null,
                basicPay: null,
                doj: null,
                dor: null,
                officeName: null,
                dateOfNextIncrement: null,
                jrEmpId: null
                // dateOfNextIncrSrJnr: null
            });
        }
        this.employeeDetailChange.emit(this.employeeDetails);
    }

    /**
     * @method onEmployeeDetailsChange
     * @description Function is called when employee is searched and assign appropriate values of Class
     * Designation and pay details
     * @param empl In this is employee details are provided
     */
    onEmployeeDetailsChange(empl) {
        this.employeeDetails = empl;
        if (this.employeeDetails.employee.departmentCategoryId === 17) {
            this.isJudiciaryDepartment = true;
        } else {
            this.isJudiciaryDepartment = false;
        }
        this.employeeDetailChange.emit(this.employeeDetails);
        this.checkForEligibility();
    }

    /**
     * @method getStatus
     * @description Function is called to get status if this post details can be save or submit
     * @returns boolean value for status
     */
    getStatus() {
        if (this.steppingUpJnr.invalid || !this.steppingUpJnr.get('jrEmpNo').value) {
            _.each(this.steppingUpJnr.controls, control => {
                if (control.status === 'INVALID') {
                    control.markAsTouched({ onlySelf: true });
                }
            });
            if (!this.steppingUpJnr.get('jrEmpNo').value) {
                this.toastr.error('Please enter Stepping Up against Junior Employee');
            }
            return false;
        } else {
            if (!this.checkForPayChange()) {
                if (!this.checkForPayChange()) {
                    this.toastr.error('Please change Pay');
                }
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
    // can be used for eligibility check for stepping up
    checkForPayChange() {
        const payComm = this.eventForm.get('payCommId').value,
            stepingUpJnrValue = this.jnrEmployeeDetails.employee,
            employeeDetail = this.employeeDetails ? this.employeeDetails.employee : null;
        switch (payComm) {
            case 150:
                if (stepingUpJnrValue.payScale === employeeDetail.payScale) {
                    return true;
                } else {
                    this.payCheck = true;
                    return false;
                }
                break;
            case 151:
                if (
                    stepingUpJnrValue.payBandId === employeeDetail.payBandId &&
                    stepingUpJnrValue.gradePayId === employeeDetail.gradePayId
                ) {
                    return true;
                } else {
                    this.payCheck = true;
                    return false;
                }
                break;
            case 152:
                if (stepingUpJnrValue.payLevelId === employeeDetail.payLevelId) {
                    return true;
                } else {
                    this.payCheck = true;
                    return false;
                }
                break;
        }
    }

    /**
     * @method checkForPayComm
     * @description Function is called to check if pay comm of sr and jr are same or not
     * @returns boolean value for pay detail validation
     */
    checkForPayComm() {
        const payCommSr = this.employeeDetails.employee.payCommId,
            payCommJr = this.jnrEmployeeDetails.employee.payCommId;
        if (payCommSr === payCommJr) {
            return true;
        } else {
            this.payCommCheck = true;
            return false;
        }
    }

    /**
     * @method checkForBasicPay
     * @description Function is called to check if basic pay of sr is less than jr or nor
     * @returns boolean value for pay detail validation
     */
    checkForBasicPay() {
        if (this.isPayStepUp) {
            const basicPaySr = this.employeeDetails.employee.empBasicPay,
                basicPayJr = this.jnrEmployeeDetails.employee.empBasicPay;
            if (basicPayJr > basicPaySr) {
                this.basicPayCheck = false;
                return true;
            } else if (basicPaySr >= basicPayJr) {
                this.basicPayCheck = true;
                return false;
            }
        } else {
            return true;
        }
    }

    /**
     * @method checkForNextInc
     * @description Function is called to check if date of nxt inc of sr is more than jr or not
     * @returns boolean value for date validation
     */
    checkForNextInc() {
        if (this.isDateStepUp) {
            let dateNxtIncrSr,
                dateNxtIncrJr;
            if (this.jnrEmployeeDetails.employee.dateNxtIncr.indexOf(' ') !== -1) {
                dateNxtIncrJr = this.jnrEmployeeDetails.employee.dateNxtIncr.split(' ')[0].split('-');
                dateNxtIncrJr = new Date(dateNxtIncrJr[0], Number(dateNxtIncrJr[1]) - 1, dateNxtIncrJr[2]);
            } else if (this.jnrEmployeeDetails.employee.dateNxtIncr.indexOf('T') !== -1) {
                dateNxtIncrJr = this.jnrEmployeeDetails.employee.dateNxtIncr.split('T')[0].split('-');
                dateNxtIncrJr = new Date(dateNxtIncrJr[0], dateNxtIncrJr(dateNxtIncrJr[1]) - 1, dateNxtIncrJr[2]);
            }

            if (this.employeeDetails.employee.dateNxtIncr.indexOf(' ') !== -1) {
                dateNxtIncrSr = this.employeeDetails.employee.dateNxtIncr.split(' ')[0].split('-');
                dateNxtIncrSr = new Date(dateNxtIncrSr[0], Number(dateNxtIncrSr[1]) - 1, dateNxtIncrSr[2]);
            } else if (this.employeeDetails.employee.dateNxtIncr.indexOf('T') !== -1) {
                dateNxtIncrSr = this.employeeDetails.employee.dateNxtIncr.split('T')[0].split('-');
                dateNxtIncrSr = new Date(dateNxtIncrSr[0], Number(dateNxtIncrSr[1]) - 1, dateNxtIncrSr[2]);
            }
            if (dateNxtIncrJr < dateNxtIncrSr) {
                this.IncrCheck = false;
                return true;
            } else if (dateNxtIncrSr <= dateNxtIncrJr) {
                this.IncrCheck = true;
                return false;
            }
        } else {
            return true;
        }
    }

    /**
     * @method checkForClass
     * @description Function is called to check if sr and jr are of same class
     * @returns boolean value class validation
     */
    checkForClass() {
        const SrClass = this.employeeDetails.employee.classId,
            JrClass = this.jnrEmployeeDetails.employee.classId;
        if (SrClass === JrClass) {
            this.ClassCheck = false;
            return true;
        } else {
            this.ClassCheck = true;
            return false;
        }
    }

    /**
     * @method checkForDesignation
     * @description Function is called to check if sr and jr are of same Designation
     * @returns boolean value Designation validation
     */
    checkForDesignation() {
        const SrDesignation = this.employeeDetails.employee.designationId,
            JrDesignation = this.jnrEmployeeDetails.employee.designationId;
        if (SrDesignation === JrDesignation) {
            this.DesignationCheck = false;
            return true;
        } else {
            this.DesignationCheck = true;
            return false;
        }
    }

    /**
     * @method checkForDepartment
     * @description Function is called to check if sr and jr are of same Department
     * @returns boolean value Department validation
     */
    checkForDepartment() {
        const SrDept = this.employeeDetails.employee.departmentCategoryId,
            JrDept = this.jnrEmployeeDetails.employee.departmentCategoryId;
        if (SrDept === JrDept) {
            this.DeptCheck = false;
            return true;
        } else {
            this.DeptCheck = true;
            return false;
        }
    }

    /**
     * @method checkForDoj
     * @description Function is called to check if junior DOJ is more than senior
     * @returns boolean value for joining validation
     */
    checkForDoj() {
        let dojSr, dojJr;
        if (this.jnrEmployeeDetails.employee.dateJoining.indexOf(' ') !== -1) {
            dojJr = this.jnrEmployeeDetails.employee.dateJoining.split(' ')[0].split('-');
            dojJr = new Date(dojJr[0], Number(dojJr[1]) - 1, dojJr[2]);
        } else if (this.jnrEmployeeDetails.employee.dateJoining.indexOf('T') !== -1) {
            dojJr = this.jnrEmployeeDetails.employee.dateJoining.split('T')[0].split('-');
            dojJr = new Date(dojJr[0], Number(dojJr[1]) - 1, dojJr[2]);
        }

        if (this.employeeDetails.employee.dateJoining.indexOf(' ') !== -1) {
            dojSr = this.employeeDetails.employee.dateJoining.split(' ')[0].split('-');
            dojSr = new Date(dojSr[0], Number(dojSr[1]) - 1, dojSr[2]);
        } else if (this.employeeDetails.employee.dateJoining.indexOf('T') !== -1) {
            dojSr = this.employeeDetails.employee.dateJoining.split('T')[0].split('-');
            dojSr = new Date(dojSr[0], Number(dojSr[1]) - 1, dojSr[2]);
        }
        if (dojSr < dojJr) {
            this.joiningCheck = false;
            return true;
        } else if (dojJr < dojSr) {
            this.joiningCheck = true;
            return false;
        }
    }

    /**
     * @method saveDetails
     * @description Function is called when save as draft is clicked and it further emits so event details can be saved
     */
    saveDetails() {
        if (this.eligible) {
            this.saveEvent.emit();
        }
    }

    /**
     * @method resetForm
     * @description Function is called when reset is clicked and it further emits so event details can be reset
     */
    resetForm() {
        this.resetFormEvent.emit();
    }

    /**
     * @method setEventPostData
     * @description Function is called when we recieve saved event details
     */
    setEventPostData() {
        const self = this;
        if (self.eventDetails.jrEmpNo) {
            self.steppingUpJnr.patchValue({
                jrEmpNo: self.eventDetails.jrEmpNo,
                jrEmpId: self.eventDetails.jrEmpId
            });
            if (this.eventForm.get('steppingUpTypeId').value) {
                this.onStepUpTypeChange(this.eventForm.get('steppingUpTypeId').value);
            }
            self.getJnrEmpDetails();
        }
    }

    /**
     * @method onPayCommissionValueChange
     * @description Function is called when pay commission is changed
     * @param payCommissionId what pay commission is selected, that id is provided
     */
    onPayCommissionValueChange(payCommissionId) {
        this.isFifth = false;
        if (this.steppingUpJnr) {
            this.steppingUpJnr.removeControl('payLevelId');
            this.steppingUpJnr.removeControl('cellId');
            this.steppingUpJnr.removeControl('payBandValue');
            this.steppingUpJnr.removeControl('payBandId');
            this.steppingUpJnr.removeControl('payScale');
            this.steppingUpJnr.removeControl('gradePayId');
        }
        if (this.postForm) {
            this.postForm.removeControl('payLevelId');
            this.postForm.removeControl('payLevelName');
            this.postForm.removeControl('cellId');
            this.postForm.removeControl('cellName');
            this.postForm.removeControl('payBandValue');
            this.postForm.removeControl('payBandId');
            this.postForm.removeControl('payBandName');
            this.postForm.removeControl('payScale');
            this.postForm.removeControl('payScaleName');
            this.postForm.removeControl('gradePayId');
            this.postForm.removeControl('gradePayName');
        }
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
                // let payScaleValue = null;
                // if (this.eventDetails && this.eventDetails.payScale) {
                //     payScaleValue = this.eventDetails.payScale;
                // }
                if (this.steppingUpJnr) {
                    this.steppingUpJnr.addControl('payScale', new FormControl(null));
                }
                if (this.postForm) {
                    this.postForm.addControl('payScale', new FormControl(null));
                    this.postForm.addControl('payScaleName', new FormControl(null));
                }
                break;
            case 151:
                // let payBandId = null,
                //     payBandValue = null,
                //     gradePayId = null;
                // if (this.eventDetails) {
                //     if (this.eventDetails.payBandId) {
                //         payBandId = this.eventDetails.payBandId;
                //     }
                //     if (this.eventDetails.payBandValue) {
                //         payBandValue = this.eventDetails.payBandValue;
                //     }
                //     if (this.eventDetails.gradePayId) {
                //         gradePayId = this.eventDetails.gradePayId;
                //     }
                // }
                if (this.steppingUpJnr) {
                    this.steppingUpJnr.addControl('payBandId', new FormControl(null));
                    this.steppingUpJnr.addControl('payBandValue', new FormControl(null));
                    this.steppingUpJnr.addControl('gradePayId', new FormControl(null));
                }
                if (this.postForm) {
                    this.postForm.addControl('payBandId', new FormControl(null));
                    this.postForm.addControl('payBandName', new FormControl(null));
                    this.postForm.addControl('payBandValue', new FormControl(null));
                    this.postForm.addControl('gradePayId', new FormControl(null));
                    this.postForm.addControl('gradePayName', new FormControl(null));
                }
                // 6 comm
                break;
            case 152:
                // 7 comm
                // let payLevelId = null,
                //     cellId = null;
                // if (this.eventDetails) {
                //     if (this.eventDetails.payLevelId) {
                //         payLevelId = this.eventDetails.payLevelId;
                //     }
                //     if (this.eventDetails.cellId) {
                //         cellId = this.eventDetails.cellId;
                //     }
                // }
                if (this.steppingUpJnr) {
                    this.steppingUpJnr.addControl('payLevelId', new FormControl(null));
                    this.steppingUpJnr.addControl('cellId', new FormControl(null));
                }
                if (this.postForm) {
                    this.postForm.addControl('payLevelId', new FormControl(null));
                    this.postForm.addControl('payLevelName', new FormControl(null));
                    this.postForm.addControl('cellId', new FormControl(null));
                    this.postForm.addControl('cellName', new FormControl(null));
                }
                // this.postForm.get('cellId').disable();
                break;
        }
        // if (this.employeeDetails && this.payMasterData && this.payMasterData.data) {
        //     //  this.setCommList(payCommissionId);
        // }
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
     * @method ngOnChanges
     * @description Function is called to take necessary actions when input parameters are changed from outside
     */
    ngOnChanges() {
        const self = this;
        if (self.eventDetails && self.steppingUpJnr) {
            this.setEventPostData();
        }
    }

    /**
     * @method onEmployeeKeyUp
     * @description Function is called to check if Junior employee details should be get from server
     * @param event Keybooard event is recieved to check Enter is pressed or not
     */
    onEmployeeKeyUp(event: KeyboardEvent) {
        if (this.seniorEmployeeSelected) {
            const self = this,
                empNo = self.employeeDetails.employee.employeeNo,
                jnrEmpNo = self.steppingUpJnr.get('jrEmpNo').value;
            if (empNo !== jnrEmpNo) {
                if (event) {
                    // tslint:disable-next-line: deprecation
                    if (event.keyCode === 13 || event['keyCode'] === 9) {
                        event.preventDefault();
                        event.stopPropagation();
                        self.getJnrEmpDetails();
                    }
                } else {
                    if (jnrEmpNo && jnrEmpNo.length === 10) {
                        self.getJnrEmpDetails();
                    }
                }
            } else {
                self.toastr.error('Please enter different employee number for Junior Employee');
            }
        }
    }

    /**
     * @method openSearchEmployeeDialog
     * @description Function is called if search icon is click, This help in searchng employee from other parameters
     */
    openSearchEmployeeDialog() {
        // tslint:disable-next-line: no-use-before-declare
        // tslint:disable-next-line: max-line-length
        if (
            (!this.isRework && this.eventDetails && this.eventDetails.statusId !== 205
                && this.eventDetails.statusId !== 0) ||
            !this.seniorEmployeeSelected ||
            this.action === 'view'
        ) {
            return;
        }
        if (!this.steppingUpJnr.controls.jrEmpNo.value) {
            const dialogRef = this.dialog.open(SearchEmployeeComponent, {
                width: '800px'
            }),
                self = this;

            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    self.steppingUpJnr.patchValue({
                        jrEmpNo: result.employeeNo
                    });
                    self.jnrEmpId = result.employeeId;
                    self.getJnrEmpDetails();
                }
            });
        } else {
            this.getJnrEmpDetails();
        }
    }

    /**
     * @method getJnrEmpDetails
     * @description Function is called to check Junior employee is eligible or not
     */
    getJnrEmpDetails() {
        if (this.action !== 'view') {
            this.clearJuniorEmpDetails();
            this.clearPostForm();
        }
        const self = this,
            effectiveDate: Date = this.eventForm.controls.eventEffectiveDate.value,
            dataToSend1 = {
                pageIndex: 0,
                pageElement: 10,
                jsonArr: [
                    {
                        key: 'empNo',
                        value: Number(self.steppingUpJnr.get('jrEmpNo').value)
                    },
                    {
                        key: 'effectiveDate',
                        value: '0'
                    },
                    {
                        key: 'payCommission',
                        value: this.eventForm.get('payCommId').value
                    },
                    {
                        key: 'eventId',
                        value: '0'
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
            dataToSend1['jsonArr'][1].value = effDateToSend;
        }
        this.eventService.getJnrEmpDetailss(dataToSend1).subscribe(
            res => {
                if (res['status'] === 200 && res['result']) {
                    this.getEmployeeDetail();
                    this.postForm.disable();
                } else {
                    self.toastr.error(res['message']);
                    this.clearJuniorEmpDetails();
                    self.clearEmployeeCurrentDetails = true;
                }
            },
            err => {
                this.clearJuniorEmpDetails();
                self.toastr.error(err);
            }
        );
    }
    /**
     * @method clearJuniorEmpDetails
     * @description Function is called to get clear junior employee details
     */
    clearJuniorEmpDetails() {
        const self = this;
        self.jnrEmployeeDetails = null;
        self.steppingUpJnr.patchValue({
            name: '',
            class: '',
            designation: '',
            basicPay: '',
            doj: '',
            dor: '',
            officeName: '',
            dateOfNextIncrement: '',
            jrEmpId: ''
        });
        if (this.eventForm && this.eventForm.get('payCommId')) {
            switch (this.eventForm.get('payCommId').value) {
                case 148:
                    // 3 comm
                    break;
                case 149:
                    // 4 comm
                    break;
                case 150:
                    // tslint:disable-next-line:max-line-length
                    this.steppingUpJnr.get('payScale').patchValue('');
                    // 5 comm
                    break;
                case 151:
                    // tslint:disable-next-line:max-line-length
                    this.steppingUpJnr.get('payBandId').patchValue('');
                    // tslint:disable-next-line:max-line-length
                    this.steppingUpJnr.get('payBandValue').patchValue('');
                    // tslint:disable-next-line:max-line-length
                    this.steppingUpJnr.get('gradePayId').patchValue('');
                    break;
                case 152:
                    // tslint:disable-next-line:max-line-length
                    this.steppingUpJnr.get('payLevelId').patchValue('');
                    // tslint:disable-next-line:max-line-length
                    this.steppingUpJnr.get('cellId').patchValue('');
            }
        }
    }

    /**
     * @method clearPostForm
     * @description Function is called to get clear PostForm details
     */
    clearPostForm() {
        const self = this;
        self.postForm.patchValue({
            class: '',
            classId: '',
            designation: '',
            designationId: '',
            basicPay: '',
            dateOfNextIncrSrJnr: '',
            dateOfNextIncrSrJnrOf: '',
        });
        if (this.eventForm && this.eventForm.get('payCommId')) {
            switch (this.eventForm.get('payCommId').value) {
                case 148:
                    // 3 comm
                    break;
                case 149:
                    // 4 comm
                    break;
                case 150:
                    this.postForm.get('payScale').patchValue('');
                    this.postForm.get('payScaleName').patchValue('');
                    // 5 comm
                    break;
                case 151:
                    this.postForm.get('payBandId').patchValue('');
                    this.postForm.get('payBandName').patchValue('');
                    this.postForm.get('payBandValue').patchValue('');
                    this.postForm.get('gradePayId').patchValue('');
                    this.postForm.get('gradePayName').patchValue('');
                    break;
                case 152:
                    this.postForm.get('payLevelId').patchValue('');
                    this.postForm.get('payLevelName').patchValue('');
                    this.postForm.get('cellId').patchValue('');
                    this.postForm.get('cellName').patchValue('');
            }
        }
    }

    /**
     * @method getEmployeeDetail
     * @description Function is called to get Junior employee details if he is eligible
     */
    getEmployeeDetail() {
        const self = this,
            effectiveDate: Date = this.eventForm.controls.eventEffectiveDate.value,
            dataToSend = {
                pageIndex: 0,
                pageElement: 10,
                jsonArr: [
                    {
                        key: 'empNo',
                        value: Number(self.steppingUpJnr.get('jrEmpNo').value)
                    },
                    {
                        key: 'effectiveDate',
                        value: '0'
                    },
                    {
                        key: 'payCommission',
                        value: this.eventForm.get('payCommId').value
                    },
                    {
                        key: 'eventId',
                        value: '0'
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

        this.eventService.getEmployeeDetails(dataToSend).subscribe(
            res => {
                if (res['status'] === 200 && res['result']) {
                    self.jnrEmployeeDetails = _.cloneDeep(res['result']);
                    if (self.jnrEmployeeDetails.employee) {
                        self.jnrEmpId = self.jnrEmployeeDetails.employee.employeeId;
                        if (
                            self.steppingUpJnr &&
                            this.checkForDoj() &&
                            this.checkForPayComm() &&
                            this.checkForDepartment() &&
                            this.checkForClass() &&
                            this.checkForDesignation() &&
                            this.checkForPayChange() &&
                            this.checkForBasicPay() &&
                            this.checkForNextInc()
                        ) { // && this.checkForDoj
                            if (this.isDateStepUp) {
                                self.postForm.get('basicPay').patchValue(this.employeeDetails.employee.empBasicPay);
                            } else if (this.isPayStepUp) {
                                self.postForm.get('basicPay').patchValue(this.jnrEmployeeDetails.employee.empBasicPay);
                            }

                            self.steppingUpJnr.patchValue({
                                name: this.jnrEmployeeDetails.employee.employeeName,
                                class: this.jnrEmployeeDetails.employee.employeeClass,
                                designation: this.jnrEmployeeDetails.employee.designationName,
                                basicPay: this.jnrEmployeeDetails.employee.empBasicPay,
                                // tslint:disable-next-line:max-line-length
                                doj: this.jnrEmployeeDetails.employee.dateJoining
                                    ? this.jnrEmployeeDetails.employee.dateJoining.split(' ')[0]
                                    : null,
                                // tslint:disable-next-line:max-line-length
                                dor: this.jnrEmployeeDetails.employee.retirementDate
                                    ? this.jnrEmployeeDetails.employee.retirementDate.split(' ')[0]
                                    : null,
                                officeName: this.jnrEmployeeDetails.employee.officeName,
                                dateOfNextIncrement: this.jnrEmployeeDetails.employee.dateNxtIncr,
                                jrEmpId: self.jnrEmpId
                            });
                            // tslint:disable-next-line:max-line-length
                            this.postForm.get('classId').patchValue(this.employeeDetails.employee.employeeClass);
                            this.postForm
                                .get('designationId')
                                .patchValue(this.employeeDetails.employee.designationName);
                            this.postForm.patchValue({
                                class: this.employeeDetails.employee.classId,
                                designation: this.employeeDetails.employee.designationId
                            });
                            if (
                                this.jnrEmployeeDetails.employee.dateJoining &&
                                !(this.jnrEmployeeDetails.employee.dateJoining instanceof Date)
                            ) {
                                let doj;
                                if (this.jnrEmployeeDetails.employee.dateJoining.indexOf(' ') !== -1) {
                                    doj = this.jnrEmployeeDetails.employee.dateJoining.split(' ')[0].split('-');
                                    this.steppingUpJnr.patchValue({
                                        doj: doj[2] + '/' + doj[1] + '/' + doj[0]
                                    });
                                } else if (this.jnrEmployeeDetails.employee.dateJoining.indexOf('T') !== -1) {
                                    doj = this.jnrEmployeeDetails.employee.dateJoining.split('T')[0].split('-');
                                    this.steppingUpJnr.patchValue({
                                        doj: doj[2] + '/' + doj[1] + '/' + doj[0]
                                    });
                                }
                            }
                            // tslint:disable-next-line:max-line-length
                            if (
                                this.jnrEmployeeDetails.employee.retirementDate &&
                                !(this.jnrEmployeeDetails.employee.retirementDate instanceof Date)
                            ) {
                                let doj;
                                if (this.jnrEmployeeDetails.employee.retirementDate.indexOf(' ') !== -1) {
                                    doj = this.jnrEmployeeDetails.employee.retirementDate.split(' ')[0].split('-');
                                    this.steppingUpJnr.patchValue({
                                        dor: doj[2] + '/' + doj[1] + '/' + doj[0]
                                    });
                                } else if (this.jnrEmployeeDetails.employee.retirementDate.indexOf('T') !== -1) {
                                    doj = this.jnrEmployeeDetails.employee.retirementDate.split('T')[0].split('-');
                                    this.steppingUpJnr.patchValue({
                                        dor: doj[2] + '/' + doj[1] + '/' + doj[0]
                                    });
                                }
                            }
                            // tslint:disable-next-line:max-line-length
                            if (this.employeeDetails && this.employeeDetails.employee) {
                                if (this.isPayStepUp) {
                                    if (
                                        this.employeeDetails.employee.dateNxtIncr &&
                                        !(this.employeeDetails.employee.dateNxtIncr instanceof Date)
                                    ) {
                                        let doj;
                                        if (this.employeeDetails.employee.dateNxtIncr.indexOf(' ') !== -1) {
                                            doj = this.employeeDetails.employee.dateNxtIncr.split(' ')[0].split('-');
                                            if (this.isPayStepUp) {
                                                this.postForm.get('dateOfNextIncrSrJnr')
                                                    .patchValue(doj[0] + '-' + doj[1] + '-' + doj[2]);
                                                this.postForm.get('dateOfNextIncrSrJnrOf')
                                                    .patchValue(doj[2] + '/' + doj[1] + '/' + doj[0]);
                                            }
                                        } else if (this.employeeDetails.employee.dateNxtIncr.indexOf('T') !== -1) {
                                            doj = this.employeeDetails.employee.dateNxtIncr.split('T')[0].split('-');
                                            if (this.isPayStepUp) {
                                                this.postForm.get('dateOfNextIncrSrJnr')
                                                    .patchValue(doj[0] + '-' + doj[1] + '-' + doj[2]);
                                                this.postForm.get('dateOfNextIncrSrJnrOf')
                                                    .patchValue(doj[2] + '/' + doj[1] + '/' + doj[0]);
                                            }
                                        }
                                    }
                                }
                            }
                            if (
                                this.jnrEmployeeDetails.employee.dateNxtIncr &&
                                !(this.jnrEmployeeDetails.employee.dateNxtIncr instanceof Date)
                            ) {
                                let doj;
                                if (this.jnrEmployeeDetails.employee.dateNxtIncr.indexOf(' ') !== -1) {
                                    doj = this.jnrEmployeeDetails.employee.dateNxtIncr.split(' ')[0].split('-');
                                    this.steppingUpJnr.patchValue({
                                        dateOfNextIncrement: doj[2] + '/' + doj[1] + '/' + doj[0]
                                    });
                                    if (this.isDateStepUp) {
                                        this.postForm
                                            .get('dateOfNextIncrSrJnrOf')
                                            .patchValue(doj[2] + '/' + doj[1] + '/' + doj[0]);
                                        this.postForm
                                            .get('dateOfNextIncrSrJnr')
                                            .patchValue(doj[0] + '-' + doj[1] + '-' + doj[2]);
                                    }
                                } else if (this.jnrEmployeeDetails.employee.dateNxtIncr.indexOf('T') !== -1) {
                                    doj = this.jnrEmployeeDetails.employee.dateNxtIncr.split('T')[0].split('-');
                                    this.steppingUpJnr.patchValue({
                                        dateOfNextIncrement: doj[2] + '/' + doj[1] + '/' + doj[0]
                                    });
                                    if (this.isDateStepUp) {
                                        this.postForm
                                            .get('dateOfNextIncrSrJnrOf')
                                            .patchValue(doj[2] + '/' + doj[1] + '/' + doj[0]);
                                        this.postForm
                                            .get('dateOfNextIncrSrJnr')
                                            .patchValue(doj[0] + '-' + doj[1] + '-' + doj[2]);
                                    }
                                }
                            }
                            if (this.eventForm && this.eventForm.get('payCommId')) {
                                switch (this.eventForm.get('payCommId').value) {
                                    case 148:
                                        // 3 comm
                                        break;
                                    case 149:
                                        // 4 comm
                                        break;
                                    case 150:
                                        // tslint:disable-next-line:max-line-length
                                        this.steppingUpJnr
                                            .get('payScale')
                                            .patchValue(this.jnrEmployeeDetails.employee.payScaleName);
                                        if (this.isDateStepUp) {
                                            this.postForm
                                                .get('payScale')
                                                .patchValue(this.employeeDetails.employee.payScale);
                                            this.postForm
                                                .get('payScaleName')
                                                .patchValue(this.employeeDetails.employee.payScaleName);
                                        } else if (this.isPayStepUp) {
                                            this.postForm
                                                .get('payScale')
                                                .patchValue(this.jnrEmployeeDetails.employee.payScale);
                                            this.postForm
                                                .get('payScaleName')
                                                .patchValue(this.jnrEmployeeDetails.employee.payScaleName);
                                        }
                                        // 5 comm
                                        break;
                                    case 151:
                                        // tslint:disable-next-line:max-line-length
                                        this.steppingUpJnr
                                            .get('payBandId')
                                            .patchValue(this.jnrEmployeeDetails.employee.payBandName);
                                        // tslint:disable-next-line:max-line-length
                                        this.steppingUpJnr
                                            .get('payBandValue')
                                            .patchValue(this.jnrEmployeeDetails.employee.payBandValue);
                                        // tslint:disable-next-line:max-line-length
                                        this.steppingUpJnr
                                            .get('gradePayId')
                                            .patchValue(this.jnrEmployeeDetails.employee.gradePayName);

                                        if (this.isDateStepUp) {
                                            this.postForm
                                                .get('payBandId')
                                                .patchValue(this.employeeDetails.employee.payBandId);
                                            this.postForm
                                                .get('payBandName')
                                                .patchValue(this.employeeDetails.employee.payBandName);
                                                this.postForm
                                                    .get('payBandValue')
                                                    .patchValue(this.employeeDetails.employee.payBandValue);
                                            this.postForm
                                                .get('gradePayId')
                                                .patchValue(this.employeeDetails.employee.gradePayId);
                                            this.postForm
                                                .get('gradePayName')
                                                .patchValue(this.employeeDetails.employee.gradePayName);
                                        } else if (this.isPayStepUp) {
                                            this.postForm
                                                .get('payBandId')
                                                .patchValue(this.jnrEmployeeDetails.employee.payBandId);
                                            this.postForm
                                                .get('payBandName')
                                                .patchValue(this.jnrEmployeeDetails.employee.payBandName);
                                                this.postForm
                                                    .get('payBandValue')
                                                    .patchValue(this.jnrEmployeeDetails.employee.payBandValue);
                                            this.postForm
                                                .get('gradePayId')
                                                .patchValue(this.jnrEmployeeDetails.employee.gradePayId);
                                            this.postForm
                                                .get('gradePayName')
                                                .patchValue(this.jnrEmployeeDetails.employee.gradePayName);
                                        }
                                        break;
                                    case 152:
                                        // tslint:disable-next-line:max-line-length
                                        this.steppingUpJnr
                                            .get('payLevelId')
                                            .patchValue(this.jnrEmployeeDetails.employee.payLevelName);
                                        // tslint:disable-next-line:max-line-length
                                        this.steppingUpJnr
                                            .get('cellId')
                                            .patchValue(this.jnrEmployeeDetails.employee.cellName);
                                        if (this.isDateStepUp) {
                                            this.postForm
                                                .get('payLevelId')
                                                .patchValue(this.employeeDetails.employee.payLevelId);
                                            this.postForm
                                                .get('payLevelName')
                                                .patchValue(this.employeeDetails.employee.payLevelName);
                                            this.postForm
                                                .get('cellId')
                                                .patchValue(this.employeeDetails.employee.cellId);
                                            this.postForm
                                                .get('cellName')
                                                .patchValue(this.employeeDetails.employee.cellName);
                                        } else if (this.isPayStepUp) {
                                            this.postForm
                                                .get('payLevelId')
                                                .patchValue(this.jnrEmployeeDetails.employee.payLevelId);
                                            this.postForm
                                                .get('payLevelName')
                                                .patchValue(this.jnrEmployeeDetails.employee.payLevelName);
                                            this.postForm
                                                .get('cellId')
                                                .patchValue(this.jnrEmployeeDetails.employee.cellId);
                                            this.postForm
                                                .get('cellName')
                                                .patchValue(this.jnrEmployeeDetails.employee.cellName);
                                        }
                                }
                            }
                        } else {
                            if (this.joiningCheck) {
                                self.toastr.error('Senior Date of Joining must be before junior');
                            } else if (this.payCommCheck) {
                                self.toastr.error('Not from same pay commission');
                            } else if (this.DeptCheck) {
                                self.toastr.error('Both employees must be of same Department');
                            } else if (this.ClassCheck) {
                                self.toastr.error('Both employees must be of same class');
                            } else if (this.DesignationCheck) {
                                self.toastr.error('Both employees must be of same Designation');
                            } else if (this.payCheck) {
                                self.toastr.error('Employee not eligibe for Stepping up');
                            } else if (this.basicPayCheck) {
                                self.toastr.error('Junior Pay must be greater than Senior');
                            } else if (this.IncrCheck) {
                                self.toastr.error('Junior Date of next increment must be prior to Senior');
                            }

                            self.jnrEmployeeDetails = null;
                        }
                    } else {
                        // self.toastr.error('Employee not eligibe for Stepping up');
                        self.jnrEmployeeDetails = null;
                    }
                } else {
                    self.jnrEmployeeDetails = null;
                    self.toastr.error(res['message']);
                }
            },
            err => {
                self.jnrEmployeeDetails = null;
                self.toastr.error(err);
            }
        );
    }

    /**
     * @method ngOnDestroy
     * @description Function is called when compnent is destroyed to take necessary calls on view destroy from browser
     * Kept for future purpose
     */
    ngOnDestroy() {
        this.eventForm.removeControl('steppingUpJnr');
        this.eventForm.removeControl('otherDetailsForm');
    }
}
