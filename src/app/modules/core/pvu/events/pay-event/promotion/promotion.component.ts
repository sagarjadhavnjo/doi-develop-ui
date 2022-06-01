import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { EventsService } from './../services/events.service';
import { Subscription } from 'rxjs';
import { EVENT_ERRORS } from './../index';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { merge } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'app-promotion',
    templateUrl: './promotion.component.html',
    styleUrls: ['./promotion.component.css']
})
export class PromotionComponent implements OnInit, OnChanges {
    @Input() eventForm: FormGroup;
    @Input() action: string;
    @Input() eventType: string;
    @Input() eventDetails: any;
    @Output() saveEvent: EventEmitter<any> = new EventEmitter();
    @Output() resetEvent: EventEmitter<any> = new EventEmitter();
    @Output() getLookupData: EventEmitter<any> = new EventEmitter();
    @Output() employeeDetailChange: EventEmitter<any> = new EventEmitter();
    showExamDetails: boolean = true;
    employeeDetails: any;
    lookUpData: any;
    payMasterData: any;
    classCtrl: FormControl = new FormControl();
    defaultClassList: any = [];
    designationCtrl: FormControl = new FormControl();
    designationList: any;
    optionAvailedCtrl: FormControl = new FormControl();
    optionAvailedList: any;
    payBandCtrl: FormControl = new FormControl();
    gradePayCtrl: FormControl = new FormControl();
    payLevelCtrl: FormControl = new FormControl();
    cellIdCtrl: FormControl = new FormControl();
    scaleCtrl: FormControl = new FormControl();
    joinPromotionalPostCtrl: FormControl = new FormControl();
    forenoonAfternoonCtrl: FormControl = new FormControl();
    forenoonList: any;
    clearEmployeeDetailsFlag: boolean = false;
    clearEmployeeDetailsFlagMsg = '';
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
    promotionType: number;
    eventEffectiveDate: Date;
    optionMinDate: Date;
    classList: any;
    isFifth: boolean = false;
    eligible: boolean = false;
    currentPayscaleSelected: any = [];
    fifthMin: number = 0;
    fifthMax: number = 0;
    clearEmployeeCurrentDetails = false;
    previousEmployeeNo;
    clearExamDetails = false;
    isJudiciaryDepartment: boolean = false;
    public columnsToDisplay: any = [];
    displayedColumns = [];
    optionValid: boolean = false;
    dataSource = new MatTableDataSource<any>([]);
    examFooterColumns = ['examName'];
    examColumns = ['examName', 'examBody', 'examPassingDate', 'examStatus'];
    examColumns2 = ['examName', 'examBody', 'examPassingDate', 'examStatus', 'examBasic'];
    optionAvailedData: any;
    seventhDateOfEffectiveFilter = (d: Date | null) => {
        // const Month = (d || new Date()).getMonth();
        // // Prevent Saturday and Sunday from being selected.
        // return Month === 0 || Month === 6;
        const payCommValue = this.eventForm.controls.payCommId.value;
        switch (payCommValue) {
            case 151:
                let month = (d || new Date()).getMonth(),
                    dateN = (d || new Date()).getDate();
                // Prevent Saturday and Sunday from being selected.
                return (month === 6) && dateN === 1;
                break;
            case 152:
                month = (d || new Date()).getMonth();
                dateN = (d || new Date()).getDate();
                // Prevent Saturday and Sunday from being selected.
                return (month === 0 || month === 6) && dateN === 1;
                break;
            default:
                return true;
                break;
        }
    }
    constructor(
        private fb: FormBuilder,
        private eventService: EventsService,
        private toastr: ToastrService,
        private datepipe: DatePipe
    ) { }

    /**
     * @method ngOnInit
     * @description Call when component is load and initialize the view and load data
     */
    ngOnInit() {
        const self = this;
        this.creatEmployeeForm();
        this.getDesignations();
        this.getLookUpData();
        this.postForm.disable();
        this.subscriber.push(this.eventForm.get('payCommId').valueChanges.subscribe(res => {
            self.onPayCommissionValueChange(res);
        }));
        if (this.eventForm.get('payCommId').value) {
            self.onPayCommissionValueChange(this.eventForm.get('payCommId').value);
        }
        if (this.eventForm.get('promotionTypeId').value) {
            self.onPromotionTypeChange(this.eventForm.get('promotionTypeId').value);
        }
        if (this.eventForm.get('eventEffectiveDate').value) {
            self.onEventEffectiveDateChange(this.eventForm.get('eventEffectiveDate').value);
        }
        this.subscriber.push(this.eventForm.get('promotionTypeId').valueChanges.subscribe(res => {
            self.onPromotionTypeChange(res);
        }));
        this.subscriber.push(this.eventForm.get('eventEffectiveDate').valueChanges.subscribe(res => {
            self.onEventEffectiveDateChange(res);
        }));

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
                if (this.eventForm.get('eventCode').value === 'Promotion' &&
                    this.postForm.get('optionAvailableId').value == 2) {
                    if (this.eventForm.get('payCommId').value == 150) {
                        this.calculateFifthPayIncrement();
                    }
                    if (this.eventForm.get('payCommId').value == 151) {
                        this.calculateSixthPayIncrement();
                    }
                    if (this.eventForm.get('payCommId').value == 152) {
                        this.calculateSeventhPayIncrement();
                    }
                }
            }
        );
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
    computeFifththIncrement(basicPay?: AbstractControl) {
        const self = this;
        const data = {
            cPayScaleId: +self.employeeDetails.employee.payScale,
            pBasicPayValue: +this.postForm.get('basicPay').value,
            pPayScaleId: this.postForm.get('payScale').value,
            payCommissionId: this.eventForm.get('payCommId').value
        };
        if (this.postForm.get('payScale').value && this.postForm.get('basicPay').value) {
            if (this.postForm.get('basicPay').valid || (basicPay && basicPay.valid)) {
                const selectedScale = this.scaleList.filter((scale) => Number(scale.id) === data.pPayScaleId);
                this.eventService.calculateOptionAvailedYes(data).subscribe(res => {
                    if (res['status'] === 200 && res['result'] !== null) {
                        this.dataSource = new MatTableDataSource([{
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
                this.dataSource = new MatTableDataSource([]);
            }
        } else {
            this.dataSource = new MatTableDataSource([]);
        }
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
        seventhPayLevel = this.payLevelList.filter((payBand) => Number(payBand.id) == payLevelId);
        if (payLevelId) {
            data['pPayLevelValue'] = seventhPayLevel[0].payLevelValue
        }
        if (this.postForm.get('payLevelId').value) {
            this.eventService.calculateOptionAvailedYes(data).subscribe(res => {
                if (res['status'] === 200 && res['result'] !== null) {
                    this.dataSource = new MatTableDataSource([{
                        PayAsonIncrementDate: this.postForm.get('optionAvailableDate').value,
                        payLevel: seventhPayLevel[0].payLevelValue,
                        cellId: res['result']['pCellIdValue'],
                        ...res['result']
                    }]);
                }
                const oaCellIdValue = this.payLevelList.find((paylevel) => (paylevel.payLevelValue) == res['result']['pPayLevelValue']);
                this.optionAvailedData = {
                    oaBasicPayValue: res['result']['oaBasicPayValue'],
                    oaPayLevelId: oaCellIdValue.id,
                    oaCellIdValue: res['result']['pCellIdValue'],
                    oaPayCellId: res['result']['pPayCellId']
                };
            });
        }
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
        if (this.employeeDetails.employee.departmentCategoryId == 17) {
            if (this.postForm.get('payBandId').value) {
                this.eventService.calculateOptionAvailedYes(data).subscribe(res => {
                    if (res['status'] === 200 && res['result'] !== null) {
                        const selectedPayBand = this.payBandList.filter((payBand) => Number(payBand.id) === data.pPayBandId);
                        this.dataSource = new MatTableDataSource([{
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
                this.dataSource = new MatTableDataSource([]);
            }
        } else {
            if (this.postForm.get('payBandId').value && this.postForm.get('gradePayId').value) {
                this.eventService.calculateOptionAvailedYes(data).subscribe(res => {
                    if (res['status'] === 200 && res['result'] !== null) {
                        const selectedPayBand = this.payBandList.filter((payBand) => Number(payBand.id) === data.pPayBandId);
                        const selectedGradePay = this.gradePayList.filter((gradePay) => Number(gradePay.id) === data.pGradePayId);
                        this.dataSource = new MatTableDataSource([{
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
                this.dataSource = new MatTableDataSource([]);
            }
        }
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
            dateOfJoining: self.eventEffectiveDate
        });
    }

    clearExmDetails() {
        this.clearExamDetails = true;
    }

    /**
     * @method getLookUpData
     * @description Function is called to get all constant data from server
     */
    getLookUpData() {
        const self = this;
        // tslint:disable-next-line:max-line-length
        this.subscriber.push(this.eventService.getLookUp('Promotion').subscribe(res => {
            if (res['status'] === 200 && res['result']) {
                self.lookUpData = _.cloneDeep(res['result']);
                if (self.lookUpData) {
                    self.defaultClassList = self.lookUpData.Dept_Class;
                    self.optionAvailedList = self.lookUpData.ConditionCheck;
                    self.forenoonList = self.lookUpData.Noon_Type;
                    self.getLookupData.emit(self.lookUpData.Promotion_Type);
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
     * @method onPromotionTypeChange
     * @description Function is called to get all constant data from server
     * @param res Changed Promotion type
     */
    onPromotionTypeChange(res) {
        const self = this;
        self.promotionType = res;
        if (self.promotionType === 275) {
            this.onEmployeeDetails();
            this.postForm.get('optionAvailableId').patchValue(null);
            this.postForm.get('optionAvailableDate').patchValue(null);
            this.postForm.get('optionAvailableId').setValidators(null);
            this.postForm.get('optionAvailableDate').setValidators(null);
            this.postForm.updateValueAndValidity();
            this.postForm.disable();
            if (this.action !== 'view') {
                this.postForm.controls.employeeClassId.enable();
                this.postForm.controls.designationId.enable();
                this.postForm.controls.noonTypeId.enable();
                this.postForm.controls.dateOfJoining.enable();
            }
        } else {
            this.postForm.get('optionAvailableId').setValidators(Validators.required);
            this.postForm.updateValueAndValidity();
            if (this.action !== 'view') {
                this.postForm.enable();
            } else {
                this.postForm.disable();
            }
            if (this.postForm.get('cellId')) {
                this.postForm.get('cellId').disable();
            }

            if (this.eventForm.get('payCommId').value) {
                this.clearPayDetails();
                if (self.employeeDetails && self.employeeDetails.employee) {
                    this.checkEmployeeEligibility();
                    this.getPayMasters();
                }
            }
        }
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
     * @method onEmployeeDetails
     * @description Function is called when promotion type is changed and selected as Promotion is same
     * Pay scale and take necessary actions if emloyee is searched
     */
    onEmployeeDetails() {
        let patchData;
        if (this.eventDetails) {
            patchData = _.cloneDeep(this.eventDetails);
            if ((patchData.departmentCategoryId === 17)
                && this.eventForm.get('payCommId').value === 151) {
                this.isJudiciaryDepartment = true;
            } else {
                this.isJudiciaryDepartment = false;
            }
            const dateOfJoining = patchData.dateOfJoining.split('-');
            let datNxtIncr = patchData.dateOfNextIncrement.split('-');
            datNxtIncr = new Date(datNxtIncr[0], datNxtIncr[1] - 1, datNxtIncr[2]);
            this.postForm.patchValue({
                dateOfJoining: new Date(dateOfJoining[0], dateOfJoining[1] - 1, dateOfJoining[2]),
                dateOfNextIncrement: datNxtIncr
            });
        } else if (this.employeeDetails && this.employeeDetails.employee) {
            patchData = _.cloneDeep(this.employeeDetails.employee);
            patchData['employeeClassId'] = Number(this.employeeDetails.employee.classId);
            patchData['designationId'] = Number(this.employeeDetails.employee.designationId);
            patchData['dateOfJoining'] = this.eventForm.get('eventEffectiveDate').value;
            patchData['basicPay'] = Number(this.employeeDetails.employee.empBasicPay);
            if ((this.employeeDetails.employee.departmentCategoryId === 17)
                && this.eventForm.get('payCommId').value === 151) {
                this.isJudiciaryDepartment = true;
            } else {
                this.isJudiciaryDepartment = false;
            }
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
                    dateOfNextIncrement: datNxtIncr,
                    dateOfJoining: this.eventForm.get('eventEffectiveDate').value
                });
            }
        }
        if (patchData) {
            if (this.postForm.get('employeeClassId').value) {
                if (Number(this.postForm.get('employeeClassId').value) !== Number(patchData.employeeClassId)) {
                    patchData.employeeClassId = this.postForm.get('employeeClassId').value;
                }
            }
            if (this.postForm.get('designationId').value) {
                if (Number(this.postForm.get('designationId').value) !== Number(patchData.designationId)) {
                    patchData.designationId = this.postForm.get('designationId').value;
                }
            }
            this.postForm.patchValue({
                // tslint:disable-next-line:max-line-length
                employeeClassId: Number(patchData.employeeClassId),
                designationId: Number(patchData.designationId),
                // tslint:disable-next-line:max-line-length
                basicPay: patchData.basicPay !== this.employeeDetails.employee.empBasicPay ? this.employeeDetails.employee.empBasicPay : patchData.basicPay,
            });
            if (this.eventForm.get('payCommId').value) {
                this.setCommData(this.eventForm.get('payCommId').value, patchData);
            }
        }
    }

    /**
     * @method setCommData
     * @description Function is called when promotion type is changed and selected as Promotion is same
     * Pay scale and if employee is searched and set pay commission data
     * @param payCommissionId Current selected pay commission
     * @param payData Saved post details
     */
    setCommData(payCommissionId, payData) {
        switch (payCommissionId) {
            case 148:
                // 3 comm
                break;
            case 149:
                // 4 comm
                break;
            case 150:
                if (payData.payScale) {
                    if (Number(payData.payScale) !== Number(this.employeeDetails.employee.payScale)) {
                        payData.payScale = Number(this.employeeDetails.employee.payScale);
                    }
                    this.postForm.patchValue({ 'payScale': Number(payData.payScale) });
                } else {
                    this.postForm.patchValue({ 'payScale': Number(this.employeeDetails.employee.payScale) });
                }
                if (this.payMasterData && this.payMasterData.data && this.payMasterData.data.length > 0) {
                    this.setFifthData(payCommissionId);
                }
                // 5 comm
                break;
            case 151:
                if (payData.payBandId) {
                    if (Number(payData.payBandId) !== Number(this.employeeDetails.employee.payBandId)) {
                        payData.payBandId = Number(this.employeeDetails.employee.payBandId);
                    }
                    if (Number(payData.payBandValue) !== Number(this.employeeDetails.employee.payBandValue)) {
                        payData.payBandValue = Number(this.employeeDetails.employee.payBandValue);
                    }
                    if (Number(payData.gradePayId) !== Number(this.employeeDetails.employee.gradePayId)) {
                        payData.gradePayId = Number(this.employeeDetails.employee.gradePayId);
                    }
                    this.postForm.patchValue({
                        'payBandId': Number(payData.payBandId),
                        'payBandValue': Number(payData.payBandValue),
                        'gradePayId': Number(payData.gradePayId)
                    });
                } else {
                    this.postForm.patchValue({
                        'payBandId': Number(this.employeeDetails.employee.payBandId),
                        'payBandValue': Number(this.employeeDetails.employee.payBandValue),
                        'gradePayId': Number(this.employeeDetails.employee.gradePayId)
                    });
                }
                if (this.payMasterData && this.payMasterData.data && this.payMasterData.data.length > 0) {
                    this.setSixthData(payCommissionId);
                    this.onPayBandChange();
                }
                // 6 comm
                break;
            case 152:
                // 7 comm
                if (payData.payLevelId) {
                    if (Number(payData.payLevelId) !== Number(this.employeeDetails.employee.payLevelId)) {
                        payData.payLevelId = Number(this.employeeDetails.employee.payLevelId);
                        payData.cellId = Number(this.employeeDetails.employee.cellId);
                    }
                    this.postForm.patchValue({
                        'payLevelId': Number(payData.payLevelId),
                        'cellId': Number(payData.cellId)
                    });
                } else {
                    this.postForm.patchValue({
                        'payLevelId': Number(this.employeeDetails.employee.payLevelId),
                        'cellId': Number(this.employeeDetails.employee.cellId)
                    });
                }
                if (this.payMasterData && this.payMasterData.data && this.payMasterData.data.length > 0) {
                    this.setSeventhData(payCommissionId);
                    this.onPayLevelChange();
                }
                break;
        }
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
                employeeClassId: ['', Validators.required],
                designationId: ['', Validators.required],
                basicPay: [''],
                dateOfNextIncrement: ['', Validators.required],
                dateOfJoining: [''],
                noonTypeId: ['', Validators.required],
                optionAvailableId: ['', Validators.required],
                optionAvailableDate: ['']
            }));
        } else {
            this.eventForm = self.fb.group({
                postForm: self.fb.group({
                    employeeClassId: ['', Validators.required],
                    designationId: ['', Validators.required],
                    basicPay: [''],
                    dateOfNextIncrement: ['', Validators.required],
                    dateOfJoining: [''],
                    noonTypeId: [''],
                    optionAvailableId: ['', Validators.required],
                    optionAvailableDate: ['']
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
        // this.postForm.get('dateOfNextIncrement').disable();
    }

    /**
     * @method onEmployeeDetailsChange
     * @description Function is called when employee is searched and assign appropriate values of Class
     * Designation and pay details
     * @param empl In this is employee details are provided
     */
    onEmployeeDetailsChange(empl) {
        this.employeeDetails = empl;
        this.clearEmployeeCurrentDetails = false;
        if (this.employeeDetails && this.employeeDetails.employee) {
            this.clearExamDetails = false;
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
            this.checkEmployeeEligibility();
        } else {
            this.employeeDetailChange.emit(this.employeeDetails);
        }
    }

    /**
     * @method checkEmployeeEligibility
     * @description Function is called to check eligibility of employee searched
     * as he is applicable for promotion or not on basis of class selection and
     * he has undergone for promotion forgo or not
     */
    checkEmployeeEligibility() {
        if (this.defaultClassList && this.defaultClassList.length > 0) {
            this.changeClassList();
        }
        this.checkForPromotionEligibility();
    }

    /**
     * @method checkForPromotionEligibility
     * @description Function is called to check eligibility of employee searched
     * from server
     */
    checkForPromotionEligibility() {
        const self = this,
            dataTosend = {
                employeeId: Number(this.employeeDetails.employee.employeeId),
                effectiveDate: this.transforminYMDDateFormat(this.eventEffectiveDate)
            };
        if (this.postForm.get('employeeClassId').value) {
            dataTosend['employeeClassId'] = '' + this.postForm.get('employeeClassId').value;
        }
        if (dataTosend['employeeId'] && dataTosend['effectiveDate'] && dataTosend['employeeClassId']) {
            this.eventService.checkforPromotionEligibility(dataTosend).subscribe(res => {
                if (res['status'] === 200) {
                    if (res['result']) {
                        self.clearEmployeeDetailsFlag = false;
                        self.onEmployeeEligible();
                    } else {
                        self.toastr.error(res['message']);
                        this.clearEmployeeDetailsFlagMsg = res['message'];
                        self.clearEmployeeDetailsFlag = true;
                    }
                } else {
                    self.toastr.error(res['message']);
                    this.clearEmployeeDetailsFlagMsg = res['message'];
                    self.clearEmployeeDetailsFlag = true;
                }
            }, err => {
                self.toastr.error(err);
                self.clearEmployeeDetailsFlag = true;
            });
        } else {
            self.clearEmployeeDetailsFlag = false;
            self.onEmployeeEligible();
        }
    }

    /**
     * @method onClassChange
     * @description Function is called when class is changed
     */
    onClassChange() {
        this.checkForPromotionEligibility();
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
     * @method onEmployeeEligible
     * @description Function is called to perform further on employee eligibility
     */
    onEmployeeEligible() {
        if (this.promotionType && this.promotionType === 275) {
            this.onEmployeeDetails();
        } else {
            if (this.action !== 'view') {
                this.postForm.enable();
            } else {
                this.postForm.disable();
            }
            if (this.postForm.get('cellId')) {
                this.postForm.get('cellId').disable();
            }
            if (this.employeeDetails && this.employeeDetails.employee) {
                if ((this.employeeDetails.employee.departmentCategoryId === 17)
                    && this.eventForm.get('payCommId').value === 151) {
                    this.isJudiciaryDepartment = true;
                } else {
                    this.isJudiciaryDepartment = false;
                }
                this.checkForEligibility();
            }
        }
        if (this.employeeDetails && this.employeeDetails.employee) {
            this.getPayMasters();
        }
        this.employeeDetailChange.emit(this.employeeDetails);
    }

    /**
     * @method changeClassList
     * @description Function is called to change class dropdown on employee curent class
     */
    changeClassList() {
        const self = this;
        if (this.employeeDetails && this.employeeDetails.employee) {
            if (this.employeeDetails.employee.classId) {
                if (Number(this.employeeDetails.employee.classId) !== 166) {
                    const classList = this.defaultClassList.filter((classC) => {
                        // tslint:disable-next-line:max-line-length
                        return (classC.lookupInfoId <= Number(self.employeeDetails.employee.classId)) && (classC.lookupInfoId !== 166);
                    });
                    this.classList = _.cloneDeep(classList);
                } else {
                    this.classList = [];
                }
                // const noGrade = this.defaultClassList.filter((classC) => {
                //     return classC.lookupInfoId === 166;
                // });
                _.orderBy(this.classList, 'lookupInfoId', 'desc');
                // this.classList.unshift(noGrade[0]);
            } else {
                this.classList = _.cloneDeep(this.defaultClassList);
            }
        }
    }

    /**
     * @method saveDetails
     * @description Function is called when save as draft is clicked and it further emits so event details can be saved
     */
    saveDetails() {
        if (this.clearEmployeeDetailsFlag) {
            // tslint:disable-next-line:max-line-length
            this.toastr.error(this.clearEmployeeDetailsFlagMsg);
            // this.toastr.error('Either this employee has undergone Promotion Forgo or the class selected is not eilgible to this employee. Please change!');
        } else {
            this.saveEvent.emit(this.optionAvailedData);
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
            if (this.clearEmployeeDetailsFlag) {
                // tslint:disable-next-line:max-line-length
                this.toastr.error(this.clearEmployeeDetailsFlagMsg);
                // this.toastr.error('Either this employee has undergone Promotion Forgo or the class selected is not eilgible to this employee. Please change!');
            } else {
                const postValue = this.postForm.getRawValue(),
                    employeeDetail = this.employeeDetails ? this.employeeDetails.employee : null;
                if (this.promotionType === 275) {
                    // tslint:disable-next-line:max-line-length
                    if (postValue['employeeClassId'] === Number(employeeDetail.classId) && postValue['designationId'] === Number(employeeDetail.designationId)) {
                        this.toastr.error('Please update Class or Designation');
                        return false;
                    }
                    return true;
                } else {
                    // tslint:disable-next-line:max-line-length
                    if (!this.checkForPayChange()) {
                        return false;
                    }
                    return true;
                }
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
        } else if (Number(postValue.basicPay) <= Number(employeeDetail.empBasicPay)) {
            this.toastr.error('Employee Basic Pay should be greater than current Basic Pay!');
            return false;
        }
        return true;

    }

    /**
     * @method resetForm
     * @description Function is called when reset is clicked and it further emits so event details can be reset
     */
    resetForm() {
        // this.clearEmployeeCurrentDetails = true;
        this.clearEmployeeDetailsFlag = false;
        this.resetEvent.emit();
    }

    /**
     * @method setEventPostData
     * @description Function is called when we recieve saved event details
     */
    setEventPostData() {
        const self = this;
        self.postForm.patchValue({
            'employeeClassId': self.eventDetails.employeeClassId ? self.eventDetails.employeeClassId : null,
            'basicPay': self.eventDetails.basicPay ? self.eventDetails.basicPay : null,
            'designationId': self.eventDetails.designationId ? self.eventDetails.designationId : null,
            'dateOfJoining': self.eventDetails.dateOfJoining ? new Date(self.eventDetails.dateOfJoining) : null,
            'noonTypeId': self.eventDetails.noonTypeId ? self.eventDetails.noonTypeId : null,
            'optionAvailableId': self.eventDetails.optionAvailableId ? self.eventDetails.optionAvailableId : null,
            // tslint:disable-next-line:max-line-length
            'optionAvailableDate': self.eventDetails.optionAvailableDate ? new Date(self.eventDetails.optionAvailableDate) : null
        });
        const dateOfJoining = self.eventDetails.dateOfJoining.split('-');
        let datNxtIncr = self.eventDetails.dateOfNextIncrement.split('-');
        datNxtIncr = new Date(datNxtIncr[0], datNxtIncr[1] - 1, datNxtIncr[2]);
        this.postForm.patchValue({
            dateOfJoining: new Date(dateOfJoining[0], dateOfJoining[1] - 1, dateOfJoining[2]),
            dateOfNextIncrement: datNxtIncr
        });
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
                this.dataSource = new MatTableDataSource([{
                    PayAsonIncrementDate: this.postForm.get('optionAvailableDate').value,
                    payBand: this.eventDetails.payBandName,
                    gradePay: this.eventDetails.gradePayName,
                    payBandValue: this.postForm.get('payBandValue').value,
                    ...this.eventDetails
                }]);
            } else if (this.eventForm.get('payCommId').value == 152) {
                this.dataSource = new MatTableDataSource([{
                    ...this.eventDetails,
                    PayAsonIncrementDate: this.postForm.get('optionAvailableDate').value,
                    payLevel: this.eventDetails.payLevelName,
                    cellId: this.eventDetails.oaCellIdValue,
                }]);
            } else if (this.eventForm.get('payCommId').value == 150) {
                this.dataSource = new MatTableDataSource([{
                    ...this.eventDetails,
                    PayAsonIncrementDate: this.postForm.get('optionAvailableDate').value,
                    payScale: this.eventDetails.scaleName,
                }]);
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
                if (this.promotionType === 275) {
                    this.onPromotionTypeChange(this.promotionType);
                }
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
        this.postForm.removeControl('payLevelId');
        this.postForm.removeControl('cellId');
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
                if (this.promotionType === 275) {
                    this.postForm.get('payScale').disable();
                }
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
                if (this.promotionType === 275) {
                    this.postForm.get('payBandId').disable();
                    this.postForm.get('gradePayId').disable();
                }
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
                if (this.promotionType === 275) {
                    this.postForm.get('payLevelId').disable();
                }
                break;
        }
        if (this.employeeDetails && this.payMasterData && this.payMasterData.data) {
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
                // 5 comm
                this.setFifthData(payCommissionId);
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
                this.postForm.get('payScale').patchValue(null);
            } else if (this.eventDetails) {
                if (this.promotionType === 275 && this.employeeDetails && this.employeeDetails.employee) {
                    if (Number(this.eventDetails.payScale) !== Number(this.employeeDetails.employee.payScale)) {
                        this.postForm.get('payScale').patchValue(this.employeeDetails.employee.payScale);
                    }
                } else {
                    this.postForm.get('payScale').patchValue(this.eventDetails.payScale);
                }
                this.setFifthBasicParams();
            }
        }
    }
    optionChange(data) {
        this.postForm.get('basicPay').reset();
        this.postForm.get('basicPay').updateValueAndValidity();
        this.computeFifththIncrement();
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
                this.calculateFifthBasic(this.postForm.get('basicPay'));
            }
            if (matEvent && matEvent.value) {
                this.postForm.get('basicPay').reset();
                this.postForm.get('basicPay').updateValueAndValidity();
                this.computeFifththIncrement();
            }
            // if (this.postForm.get('payCommId').value != 150) {
            //     this.dataSource = new MatTableDataSource();
            // }
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
                    if (this.promotionType === 275 && currentPayScale === 0) {
                        this.payBandList = _.cloneDeep(this.getListAccEvent(sixData, currentPayScale));
                    } else {
                        this.payBandList = _.cloneDeep(this.getListAccEvent(sixData, (currentPayScale - 1)));
                    }
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
            if (this.promotionType === 275 && this.employeeDetails && this.employeeDetails.employee) {
                if (Number(this.eventDetails.payBandId) !== Number(this.employeeDetails.employee.payBandId)) {
                    this.eventDetails.payBandId = Number(this.employeeDetails.employee.payBandId);
                }
                if (Number(this.eventDetails.payBandValue) !== Number(this.employeeDetails.employee.payBandValue)) {
                    this.eventDetails.payBandValue = Number(this.employeeDetails.employee.payBandValue);
                }
                if (Number(this.eventDetails.gradePayId) !== Number(this.employeeDetails.employee.gradePayId)) {
                    this.eventDetails.gradePayId = Number(this.employeeDetails.employee.gradePayId);
                }
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
     * @method getListAccEvent
     * @description Function is called to extract values from array
     * @param data Array is provided
     * @param index from which index values are extracted till last index
     * @returns Extracted Array
     */
    getListAccEvent(data, index) {
        if (this.promotionType === 275) {
            return data.splice(index);
        } else {
            return data.splice(index + 1);
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
                if (this.promotionType !== 275) {
                    if (!self.eventDetails || (self.eventDetails && self.eventDetails.payBandId !== payBandId)) {
                        this.postForm.get('basicPay').patchValue('');
                        this.postForm.get('gradePayId').patchValue('');
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
                // tslint:disable-next-line:max-line-length
                this.postForm.get('payBandValue').setValidators([Validators.min(setSelectedPayBand.startingValue), Validators.max(setSelectedPayBand.endValue)]);
            }
            if (gradePayData[0]) {
                if (this.promotionType !== 275 && !this.isJudiciaryDepartment) {
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
                } else {
                    this.gradePayList = _.cloneDeep(gradePayData[0].gradePays);
                }
            }
        }
        if (this.eventDetails) {
            this.calculateSixthPayIncrement();
        }
    }

    onPayBandValueChange(control: AbstractControl) {
        this.calculateFifthBasic(control);
        if (!control.errors) {
            this.calculateSixthBasicPayOnGrade();
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
        this.eventService.calcSixthBasic(params, self.eventType).subscribe(res => {
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
            if (this.promotionType === 275 && this.employeeDetails && this.employeeDetails.employee) {
                if (Number(this.eventDetails.payLevelId) !== Number(this.employeeDetails.employee.payLevelId)) {
                    this.eventDetails.payLevelId = Number(this.employeeDetails.employee.payLevelId);
                }
                if (Number(this.eventDetails.cellId) !== Number(this.employeeDetails.employee.cellId)) {
                    this.eventDetails.cellId = Number(this.employeeDetails.employee.cellId);
                }
            }
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
            if (this.promotionType && this.promotionType !== 275 && this.employeeDetails && this.employeeDetails.employee) {
                this.calculateSeventhBasicPay();
            }
        }
        if (this.eventDetails) {
            this.calculateSeventhPayIncrement();
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
        this.eventService.calcSeventhBasic(params, self.eventType).subscribe(res => {
            if (res['result'] && res['status'] === 200) {
                self.postForm.patchValue({
                    cellId: res['result']['id'],
                    basicPay: res['result']['cellValue']
                });
            }
        });
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
            this.setEventPostData();
            // }
        }
        // tslint:disable-next-line:max-line-length
        if (this.employeeDetails && this.eventForm && this.eventForm.get('payCommId') && this.eventForm.get('payCommId').value && this.payMasterData && this.payMasterData.data) {
            this.setCommList(this.eventForm.get('payCommId').value);
        }
    }

    /**
     * @method ngOnDestroy
     * @description Function is called when compnent is destroyed to take necessary calls on view destroy from browser
     * Kept for future purpose
     */
    // ngOnDestroy() { }

    /**
* @description changes the value in datasource of optionAvail
*/
    optionAvailDateChanged() {
        if (this.postForm.get('optionAvailableId') && this.postForm.get('optionAvailableId').value === 2
            && this.postForm.get('optionAvailableDate') && this.postForm.get('optionAvailableDate').value) {
            const optDataSource = this.dataSource.data;
            if (optDataSource && optDataSource.length > 0) {
                optDataSource[0]['PayAsonIncrementDate'] = this.postForm.get('optionAvailableDate').value;
                this.dataSource = new MatTableDataSource(optDataSource);
            }
        }
    }

}
