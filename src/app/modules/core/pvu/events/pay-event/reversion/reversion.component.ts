import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { EventsService } from './../services/events.service';
import { Subscription } from 'rxjs';
import { EVENT_ERRORS } from './../index';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import {
    Component, OnInit, Input, OnDestroy, OnChanges, Output,
    EventEmitter, ChangeDetectionStrategy
} from '@angular/core';
import * as _ from 'lodash';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-reversion',
    templateUrl: './reversion.component.html',
    styleUrls: ['./reversion.component.css']
})
export class ReversionComponent implements OnInit, OnDestroy, OnChanges {
    @Input() eventForm: FormGroup;
    @Input() action: string;
    @Input() eventType: string;
    @Input() eventDetails;
    @Output() saveEvent: EventEmitter<any> = new EventEmitter();
    @Output() resetEvent: EventEmitter<any> = new EventEmitter();
    @Output() employeeDetailChange: EventEmitter<any> = new EventEmitter();
    employeeDateOfJoining: Date;
    showExamDetails: boolean = false;
    employeeDetails: any;
    lookUpData: any;
    payMasterData: any;
    classCtrl: FormControl = new FormControl();
    classList: any;
    designationCtrl: FormControl = new FormControl();
    designationList: any;
    payBandCtrl: FormControl = new FormControl();
    gradePayCtrl: FormControl = new FormControl();
    payLevelCtrl: FormControl = new FormControl();
    cellIdCtrl: FormControl = new FormControl();
    scaleCtrl: FormControl = new FormControl();
    setSelectedPayBand: any;
    payLevelList = [];
    cellList = [];
    bindedPromotionType: boolean = false;
    payBandList = [];
    gradePayList = [];
    title: string = 'Post Details';
    scaleList = [];
    postForm: FormGroup;
    empId: number;
    subscriber: Subscription[] = [];
    errorMessage = EVENT_ERRORS;
    defaultClassList: any = [];
    employeeJoiningDetails: any;
    currentPayscaleSelected: any = [];
    fifthMin: number = 0;
    fifthMax: number = 0;
    isFifth: boolean = false;
    clearEmployeeCurrentDetails = false;
    previousEmployeeNo;
    isJudiciaryDepartment: boolean = false;
    constructor(
        private fb: FormBuilder,
        private eventService: EventsService,
        private dialog: MatDialog,
        private datepipe: DatePipe,
        private toastr: ToastrService
    ) { }

    /**
     * @method ngOnInit
     * @description Call when component is load and initialize the view and load data
     */
    ngOnInit() {
        const self = this;
        this.creatEmployeeForm();
        // this.getLookUpData();
        this.getDesignations();
        this.subscriber.push(this.eventForm.get('payCommId').valueChanges.subscribe(res => {
            self.onPayCommissionValueChange(res);
        }));
        this.subscriber.push(this.eventForm.get('eventCode').valueChanges.subscribe(res => {
            self.eventType = res;
        }));
        if (this.eventForm.get('payCommId').value) {
            self.onPayCommissionValueChange(this.eventForm.get('payCommId').value);
        }
        if (self.action === 'view') {
            this.postForm.disable();
        }
    }

    /**
     * @method getLookUpData
     * @description Function is called to get all constant data from server
     */
    getLookUpData() {
        const self = this;
        // tslint:disable-next-line:max-line-length
        const payload = { 'id': this.employeeDetails.employee.employeeId };
        this.subscriber.push(this.eventService.getReversionData('Reversion', payload).subscribe(res => {
            if (res['status'] === 200 && res['result']) {
                self.lookUpData = _.cloneDeep(res['result']);
                if (self.lookUpData) {
                    self.defaultClassList = self.lookUpData.Dept_Class;
                    if (this.employeeDetails && this.employeeDetails.employee) {
                        this.changeClassList();
                    }
                }
            } else {
                self.toastr.error(res['message']);
            }
        }, err => {
            self.toastr.error(err);
        }));
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
                employeeClassId: [''],
                designationId: [''],
                basicPay: ['', Validators.required],
                effectiveDate: ['', Validators.required],
                dateOfNextIncrement: ['']
            }));
        } else {
            this.eventForm = self.fb.group({
                postForm: self.fb.group({
                    employeeClassId: ['', Validators.required],
                    designationId: ['', Validators.required],
                    basicPay: ['', Validators.required],
                    effectiveDate: ['', Validators.required],
                    dateOfNextIncrement: ['']
                })
            });
        }
        this.postForm = this.eventForm.get('postForm') as FormGroup;
        if (self.eventDetails && this.postForm) {
            this.postForm.patchValue({
                basicPay: self.eventDetails.basicPay,
                // tslint:disable-next-line:max-line-length
                dateOfNextIncrement: self.eventDetails.dateOfNextIncrement ? new Date(self.eventDetails.dateOfNextIncrement) : null
            });
            this.setEventPostData();
        }
    }

    /**
     * @method onYesNoChange
     * @description Function is called to check if option availed or not and changes acccording to it.
     * It is called from multiple dropdown change
     * @param checkId In this is form control name is given
     * @param implementId In this is form control value is given
     */
    onYesNoChange(checkId, implementId) {
        if (this.postForm.get(checkId).value === 2) {
            this.postForm.get(implementId).setValidators(Validators.required);
            this.postForm.get(implementId).updateValueAndValidity();
        } else {
            this.postForm.get(implementId).setValidators(null);
            this.postForm.get(implementId).updateValueAndValidity();
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
        if (this.eventForm.get('payCommId').value && this.payMasterData) {
            this.setCommList(this.eventForm.get('payCommId').value);
        }
        // this.postForm.get('dateOfNextIncrement').disable();
        if (this.defaultClassList && this.defaultClassList.length > 0) {
            this.changeClassList();
        }
        if (this.employeeDetails && this.employeeDetails.employee) {
            this.setEmployeeJoiningDate();
            this.getEmloyeeJoiningDetails();
        }
        this.clearEmployeeCurrentDetails = false;
        if (this.employeeDetails && this.employeeDetails.employee) {
            if ((this.employeeDetails.employee.departmentCategoryId === 17)
                && this.eventForm.get('payCommId').value === 151) {
                this.isJudiciaryDepartment = true;
            } else {
                this.isJudiciaryDepartment = false;
            }
            // tslint:disable-next-line:max-line-length
            if (this.employeeDetails.employee.dateNxtIncr && !(this.employeeDetails.employee.dateNxtIncr instanceof Date)) {
                let doj;
                if (this.employeeDetails.employee.dateNxtIncr.indexOf(' ') !== -1) {
                    doj = this.employeeDetails.employee.dateNxtIncr.split(' ')[0].split('-');
                    this.postForm.patchValue({
                        dateOfNextIncrement: new Date(doj[0], Number(doj[1]) - 1, doj[2])
                    });
                } else if (this.employeeDetails.employee.dateNxtIncr.indexOf('T') !== -1) {
                    doj = this.employeeDetails.employee.dateNxtIncr.split('T')[0].split('-');
                    this.postForm.patchValue({
                        dateOfNextIncrement: new Date(doj[0], Number(doj[1]) - 1, doj[2])
                    });
                }
            }
            if (!this.previousEmployeeNo) {
                this.previousEmployeeNo = this.employeeDetails.employee.employeeNo;
            }
            if (Number(this.previousEmployeeNo) !== Number(this.employeeDetails.employee.employeeNo)) {
                this.postForm.patchValue({
                    employeeClassId: null,
                    designationId: null,
                    basicPay: null
                });
            }
            this.getLookUpData();
            this.getPayMasters();
        }
        this.employeeDetailChange.emit(empl);
    }

    /**
     * @method setEmployeeJoiningDate
     * @description Function is called to set employee joining details in Date type
     */
    setEmployeeJoiningDate() {
        // tslint:disable-next-line:max-line-length
        if (this.employeeDetails.employee.dateJoining && !(this.employeeDetails.employee.dateJoining instanceof Date)) {
            let doj;
            if (this.employeeDetails.employee.dateJoining.indexOf(' ') !== -1) {
                doj = this.employeeDetails.employee.dateJoining.split(' ')[0].split('-');
                this.employeeDateOfJoining = new Date(doj[0], Number(doj[1]) - 1, doj[2]);
            } else if (this.employeeDetails.employee.dateJoining.indexOf('T') !== -1) {
                doj = this.employeeDetails.employee.dateJoining.split('T')[0].split('-');
                this.employeeDateOfJoining = new Date(doj[0], Number(doj[1]) - 1, doj[2]);
            }
        }
    }

    /**
     * @method getEmloyeeJoiningDetails
     * @description Function is called to get employee joining details from server
     */
    getEmloyeeJoiningDetails() {
        const self = this,
            effectiveDate = self.eventForm.get('eventEffectiveDate').value,
            params = {
                'empId': self.employeeDetails.employee.employeeId,
                'payCommision': this.eventForm.get('payCommId').value
            };
        if (effectiveDate) {
            let effDateToSend = '';
            if (effectiveDate.getDate() <= 9) {
                effDateToSend += '0' + effectiveDate.getDate();
                effDateToSend += '/';
            } else {
                effDateToSend += effectiveDate.getDate();
                effDateToSend += '/';
            }
            if (effectiveDate.getMonth() < 9) {
                effDateToSend += '0' + (effectiveDate.getMonth() + 1);
                effDateToSend += '/';
            } else {
                effDateToSend += '' + (effectiveDate.getMonth() + 1);
                effDateToSend += '/';
            }
            effDateToSend += effectiveDate.getFullYear();
            // tslint:disable-next-line:max-line-length
            params['effectiveDate'] = effDateToSend;
        }
        self.eventService.getEmployeeJoiningDetails(params).subscribe(res => {
            if (res['status'] === 200 && res['result']) {
                self.employeeJoiningDetails = _.cloneDeep(res['result']);
            }
        });
    }

    /**
     * @method changeClassList
     * @description Function is called to assign class list which classes will be shown in dropdown
     */
    changeClassList() {
        const self = this;
        if (this.employeeDetails && this.employeeDetails.employee) {
            if (this.employeeDetails.employee.classId && (Number(this.employeeDetails.employee.classId) !== 166)) {
                const classList = this.defaultClassList.filter((classC) => {
                    // tslint:disable-next-line:max-line-length
                    return (classC.lookupInfoId >= Number(self.employeeDetails.employee.classId)) && (classC.lookupInfoId !== 166);
                });
                this.classList = _.cloneDeep(classList);
                _.orderBy(this.classList, 'lookupInfoId', 'desc');
            } else {
                const classList = this.defaultClassList.filter((classC) => {
                    // tslint:disable-next-line:max-line-length
                    return (classC.lookupInfoId !== 166);
                });
                this.classList = _.cloneDeep(classList);
                _.orderBy(this.classList, 'lookupInfoId', 'desc');
                // const noGrade = this.defaultClassList.filter((classC) => {
                //     return classC.lookupInfoId === 166;
                // });
                // this.classList.unshift(noGrade[0]);
            }
        }
    }

    /**
     * @method saveDetails
     * @description Function is called when save as draft is clicked and it further emits so event details can be saved
     */
    saveDetails() {
        if (!(Number(this.postForm.controls.basicPay.value) >= Number(this.employeeJoiningDetails.actualBasicPay) &&
        Number(this.postForm.controls.basicPay.value) <= Number(this.employeeDetails.employee.empBasicPay))) {
            this.toastr.error('Please Change Basic Pay value and Try Again');
        } else if (this.postForm.invalid || !this.getStatus()) {
            this.toastr.error('Please fill mandatory fields for save as draft!');
        } else {
            this.saveEvent.emit();
        }
    }

    /**
     * @method resetForm
     * @description Function is called when reset is clicked and it further emits so event details can be reset
     */
    resetForm() {
        // this.clearEmployeeCurrentDetails = true;
        this.resetEvent.emit();
        this.gradePayList = [];
    }

    /**
     * @method setEventPostData
     * @description Function is called when we recieve saved event details
     */
    setEventPostData() {
        const self = this;
        self.postForm.patchValue({
            'employeeClassId': self.eventDetails.employeeClassId,
            'designationId': self.eventDetails.designationId,
            'effectiveDate': self.eventDetails.effectiveDate,
            'basicPay': self.eventDetails.basicPay,
        });
        if (self.eventDetails.effectiveDate) {
            const effectiveDate = self.eventDetails.effectiveDate.split('-');
            this.postForm.patchValue({
                effectiveDate: new Date(effectiveDate[0], effectiveDate[1] - 1, effectiveDate[2])
            });
        }
        if (self.eventDetails.dateOfNextIncrement) {
            let datNxtIncr = self.eventDetails.dateOfNextIncrement.split('-');
            datNxtIncr = new Date(datNxtIncr[0], datNxtIncr[1] - 1, datNxtIncr[2]);
            this.postForm.patchValue({
                dateOfNextIncrement: datNxtIncr
            });
        }
    }

    /**
     * @method getDesignations
     * @description Function is called to get all designations from server
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

    convertDateFormat(date) {
        if (date !== '' && date !== undefined && date !== null) {
            return this.datepipe.transform(date, 'yyyy-MM-dd');
        }
        return '';
    }

    /**
     * @method getPayMasters
     * @description Function is called to get all paymasters according to department category
     */
    getPayMasters() {
        const self = this,
            dataToSend = {
                data: {
                    departmentCategoryId: this.employeeDetails.employee.departmentCategoryId,
                    payCommissionId: this.eventForm.get('payCommId').value,
                    employeeId: this.employeeDetails.employee.employeeId,
                    effectiveDate: this.convertDateFormat(self.eventForm.get('eventEffectiveDate').value)
                }
            };
        this.eventService.getPayMastersCommission(dataToSend).subscribe(res => {
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
        const self = this;
        this.postForm.removeControl('payLevelId');
        this.postForm.removeControl('cellId');
        this.postForm.removeControl('payBandId');
        this.postForm.removeControl('payBandValue');
        this.postForm.removeControl('gradePayId');
        this.postForm.removeControl('payScale');
        this.postForm.get('basicPay').setValidators(null);
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
                this.postForm.get('basicPay').setValidators(Validators.required);
                this.postForm.get('basicPay').updateValueAndValidity();
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
                this.postForm.addControl('payBandValue', new FormControl(payBandValue, Validators.required));
                this.postForm.addControl('gradePayId', new FormControl(gradePayId, Validators.required));
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
                this.postForm.addControl('payLevelId', new FormControl(payLevelId, Validators.required));
                this.postForm.addControl('cellId', new FormControl(cellId, Validators.required));
                break;
        }
        if (this.employeeDetails && this.payMasterData && this.payMasterData.data) {
            this.setCommList(payCommissionId);
        }
        if (self.action === 'view') {
            this.postForm.disable();
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
        // this.scaleList = [];
        this.scaleList = _.orderBy(_.cloneDeep(this.payMasterData.data), 'order', 'asc');
        if (this.employeeDetails) {
            // if (this.employeeDetails.employee.payScale) {
            //     let currentPayScale;
            //     scaleList.forEach((payScale, index) => {
            //         if (payScale.id === Number(this.employeeDetails.employee.payScale)) {
            //             currentPayScale = index;
            //             this.scaleList.push(this.payMasterData.data[currentPayScale]);
            //         }
            //     });
            //     // if (currentPayScale || currentPayScale === 0) {
            //     //     this.scaleList = _.cloneDeep(this.getListAccEvent(scaleList, currentPayScale));
            //     // }
            // }


            // tslint:disable-next-line:max-line-length
            if (this.employeeDetails && this.employeeDetails.employee && Number(this.previousEmployeeNo) !== Number(this.employeeDetails.employee.employeeNo)) {
                this.previousEmployeeNo = Number(this.employeeDetails.employee.employeeNo);
                this.postForm.get('payScale').patchValue(null);
            } else if (this.eventDetails) {
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
            // if (!isNaN(this.currentPayscaleSelected[paySelectedLength - 1])) {
            //     this.fifthMax = Number(this.currentPayscaleSelected[paySelectedLength - 1]);
            // } else {
            //     this.fifthMax = Number(this.currentPayscaleSelected[0]);
            // }
            this.fifthMax = Number(this.employeeDetails.employee.empBasicPay);
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
        this.payBandList = _.orderBy(_.cloneDeep(this.payMasterData.data), 'order', 'asc');
        // if (this.employeeDetails && this.employeeDetails.employee) {
        //     if (this.employeeDetails.employee.payBandId) {
        //         let currentPayScale;
        //         sixData.forEach((payBand, index) => {
        //             if (payBand.id === Number(this.employeeDetails.employee.payBandId)) {
        //                 currentPayScale = index;
        //                 // this.payBandList.push(this.payMasterData.data[currentPayScale]);
        //             }
        //         });
        //         if (currentPayScale || currentPayScale === 0) {
        //             this.payBandList = _.cloneDeep(this.getListAccEvent(sixData, currentPayScale));
        //         }
        //     }
        // }


        // tslint:disable-next-line:max-line-length
        if (this.employeeDetails && this.employeeDetails.employee && Number(this.previousEmployeeNo) !== Number(this.employeeDetails.employee.employeeNo)) {
            this.previousEmployeeNo = Number(this.employeeDetails.employee.employeeNo);
            this.postForm.get('payBandId').patchValue(null);
            this.postForm.get('payBandValue').patchValue(null);
            this.postForm.get('gradePayId').patchValue(null);
        } else if (this.eventDetails) {
            if (this.eventDetails.departmentCategoryId && (this.eventDetails.departmentCategoryId === 17)
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
        return data.splice(0, (index + 1));
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
                    this.postForm.get('gradePayId').patchValue('');
                }
            }
            // tslint:disable-next-line:max-line-length
            this.postForm.get('payBandValue').setValidators([Validators.min(setSelectedPayBand.startingValue), Validators.max(setSelectedPayBand.endValue)]);
            if (gradePayData[0]) {
                const sampleData = _.cloneDeep(gradePayData[0].gradePays);
                this.gradePayList = sampleData.filter((gradepay) => {
                    return Number(gradepay.gradePayValue) < Number(this.employeeDetails.employee.gradePayName) + 1;
                });
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
                this.calculateSixthBasicPay();
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
            // tslint:disable-next-line:max-line-length
            if (this.employeeDetails && this.postForm.get('basicPay').value > this.employeeDetails.employee.empBasicPay || this.postForm.get('basicPay').value < this.employeeJoiningDetails.actualBasicPay) {
                this.postForm.controls['basicPay'].setErrors({'incorrect': true});
            }
        }
    }

    onPayBandValueChange(control: AbstractControl) {
        this.calculateFifthBasic(control);
        if (!control.errors) {
            this.calculateSixthBasicPay();
        }
    }

    /**
     * @method setSeventhData
     * @description Function is called to check set seven pay commission data in dropdown
     * @param payCommissionId what pay commission is selected, that id is provided
     */
    setSeventhData(payCommissionId) {
        // this.payLevelList = [];
        this.payLevelList = _.orderBy(_.cloneDeep(this.payMasterData.data), 'order', 'asc');
        if (this.employeeDetails && this.employeeDetails.employee) {
            if (this.employeeDetails.employee.payLevelId) {
                // let currentPayScale;
                // sevenData.forEach((payLevel, index) => {
                //     if (payLevel.id === Number(this.employeeDetails.employee.payLevelId)) {
                //         currentPayScale = index;
                //     }
                // });

                // sevenData.forEach((payLevel, index) => {
                //     if (payLevel.id === Number(this.employeeJoiningDetails.paylevel)) {
                //         currentPayScale = index;
                //         this.payLevelList.push(this.payMasterData.data[currentPayScale]);
                //     }
                // });

                // if (currentPayScale || currentPayScale === 0) {
                //     this.payLevelList = _.cloneDeep(this.getListAccEvent(sevenData, currentPayScale));
                // }
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
                this.calculateSeventhBasicPay();
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
            if (!this.eventDetails || (this.eventDetails && this.eventDetails.payLevelId !== payLevelId)) {
                this.postForm.get('basicPay').patchValue(null);
                this.postForm.get('cellId').patchValue(null);
            }
            if (cellData[0]) {
                const sampleData = _.orderBy(cellData[0].cells, 'cellValue', 'asc');
                cellData[0].cells = sampleData.filter((gradepay) => {
                    return Number(gradepay.cellValue) < Number(this.employeeDetails.employee.empBasicPay) + 1;
                });
                if (this.employeeDetails && this.employeeDetails.employee) {
                    // tslint:disable-next-line:max-line-length
                    if (this.employeeDetails.employee.payLevelId && Number(this.employeeDetails.employee.payLevelId) === payLevelId) {
                        this.cellList = _.cloneDeep(cellData[0].cells);
                        let currentCellIdIndex;
                        this.cellList.forEach((cellLevel, index) => {
                            if (cellLevel.cellId === Number(this.employeeDetails.employee.cellName)) {
                                currentCellIdIndex = index;
                            }
                        });
                        if (currentCellIdIndex || currentCellIdIndex === 0) {
                            // if (currentCellIdIndex !== 0) {
                            //     currentCellIdIndex -= 1;
                            // }
                            this.cellList = _.cloneDeep(this.getListAccEvent(this.cellList, currentCellIdIndex));
                        }
                    } else {
                        this.cellList = _.cloneDeep(cellData[0].cells);
                    }
                } else {
                    this.cellList = _.cloneDeep(cellData[0].cells);
                }
            }
            this.calculateSeventhBasicPay();
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
                    'cellId': this.postForm.get('cellId').value,
                    'payLevelId': this.postForm.get('payLevelId').value
                }
            };
        if (this.postForm.get('cellId').value && this.postForm.get('payLevelId').value) {
            this.eventService.calcSeventhBasic(params, self.eventType).subscribe(res => {
                if (res['result'] && res['status'] === 200) {
                    self.postForm.patchValue({
                        basicPay: res['result']['cellValue']
                    });
                } else {
                    self.postForm.patchValue({
                        basicPay: null
                    });
                }
            }, err => {
                self.postForm.patchValue({
                    basicPay: null
                });
            });
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
            let submitStatus = true;
            if (
                this.postForm.get('designationId').value === Number(this.employeeDetails.employee.designationId) &&
                (this.postForm.get('employeeClassId').value === Number(this.employeeDetails.employee.classId)
                    || this.postForm.get('employeeClassId').value > Number(this.employeeJoiningDetails.classId))) {
                submitStatus = false;
            }
            if (!this.postForm.invalid && !this.checkForPayChange()) {
                if (!submitStatus) {
                    // tslint:disable-next-line:max-line-length
                    this.toastr.error('Please change Pay detail or class or designation, And it should be greater than or equal to employee joining detail.');
                } else {
                    const postValue = this.postForm.getRawValue();

                    if ((Number(postValue.basicPay) < Number(this.employeeJoiningDetails.actualBasicPay))) {
                        // tslint:disable-next-line:max-line-length
                        this.toastr.error('Basic Pay should not be less than ' + this.employeeJoiningDetails.actualBasicPay);
                    // tslint:disable-next-line:max-line-length
                    } else if (this.postForm.controls.basicPay.value > Number(this.employeeDetails.employee.empBasicPay)) {
                        // tslint:disable-next-line:max-line-length
                        this.toastr.error('Basic Pay should not be more than ' + this.employeeDetails.employee.empBasicPay);
                    }
                }
                submitStatus = false;

            } else {
                submitStatus = true;
            }
            return submitStatus;
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
        // tslint:disable-next-line: max-line-length
        // if ((Number(employeeDetail.empBasicPay) === Number(this.employeeJoiningDetails.basicPay)) ||
        // (Number(postValue.basicPay) <= Number(employeeDetail.empBasicPay) &&
        // (Number(postValue.basicPay) >= Number(this.employeeJoiningDetails.actualBasicPay))))
        if ((Number(postValue.basicPay) <= Number(employeeDetail.empBasicPay) &&
        (Number(postValue.basicPay) >= Number(this.employeeJoiningDetails.actualBasicPay)))) {
            return true;
        } else {
            return false;
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

}
