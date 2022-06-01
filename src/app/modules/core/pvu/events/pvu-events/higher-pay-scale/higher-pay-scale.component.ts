// import { forEach } from '@angular/router/src/utils/collection';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { SearchEmployeeComponent } from './../../../pvu-common/search-employee/search-employee.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { merge, Subscription } from 'rxjs';
import { EVENT_ERRORS } from './../index';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Component, OnInit, Input, OnDestroy, OnChanges, Output, EventEmitter, ElementRef, SimpleChanges } from '@angular/core';
import { PVUEventsService } from '../services/pvu-event.service';
import * as _ from 'lodash';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-higher-pay-scale',
    templateUrl: './higher-pay-scale.component.html',
    styleUrls: ['./higher-pay-scale.component.css']
})
export class HigherPayScaleComponent implements OnInit, OnChanges, OnDestroy {
    @Input() eventForm: FormGroup;
    @Input() action: string;
    @Input() eventType: string;
    @Input() eventDetails: any;
    @Input() isRework = false;
    @Output() saveEvent: EventEmitter<any> = new EventEmitter();
    @Output() resetEvent: EventEmitter<any> = new EventEmitter();
    @Output() employeeDetailChange: EventEmitter<any> = new EventEmitter();
    @Input() lookUpData: any;
    optionAvailedData: any;
    employeeDetails: any;
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
    setSelectedPayBand: any;
    payLevelList = [];
    cellList = [];

    payBandList = [];
    gradePayList = [];
    title: string = 'Post Details';
    scaleList = [];
    postForm: FormGroup;
    empId: number;
    subscriber: Subscription[] = [];
    errorMessage = EVENT_ERRORS;
    eventEffectiveDate: Date;
    optionMinDate: Date;
    classList: any;
    isFifth: boolean = false;
    eligible: boolean = true;
    daysCheckEligible: boolean = false;
    currentPayscaleSelected: any = [];
    fifthMin: number = 0;
    fifthMax: number = 0;
    employeeCurrentForm: FormGroup;
    enableEmployeeSearch: boolean = false;
    hgEffDatePlaceholder = 'Higher Grade 1nd Effective Date';
    cccExamData = [];
    departmentalExamData = [];
    languageExamData = [];
    payCommSelected: number;
    previousEmployeeNo;
    cccExamDataSource = new MatTableDataSource(this.cccExamData);
    examColumns = ['examName', 'examBody', 'examPassingDate', 'examStatus'];
    examColumns2 = ['examName', 'examBody', 'examPassingDate', 'examStatus', 'examBasic'];
    examFooterColumns = ['examName'];
    employeeTypeSelected: number;
    resetFormEvent: EventEmitter<any> = new EventEmitter();
    departmentalExamDataSource = new MatTableDataSource(this.departmentalExamData);

    languageExamDataSource = new MatTableDataSource(this.languageExamData);
    dataSource = new MatTableDataSource<any>();
    // Post
    typeList = [];
    typeCtrl: FormControl = new FormControl();
    empTypeList = [];
    empTypeCtrl: FormControl = new FormControl();
    payScaleCtrl: FormControl = new FormControl();
    hpType: number;
    hpScaleType: any;
    hpScaleFor: any;
    public columnsToDisplay: any = [];
    displayedColumns = [];
    optionValid: boolean = false;
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
    commision: any;

    ngOnInit() {
        const self = this;
        this.creatEmployeeForm();
        this.employeeCurrentForm.get('employeeNo').disable();
        this.postForm.disable();
        if (this.eventForm.get('payCommId').value) {
            self.onPayCommissionValueChange(this.eventForm.get('payCommId').value);
        }
        if (this.eventForm.get('eventEffectiveDate').value) {
            self.onEventEffectiveDateChange(this.eventForm.get('eventEffectiveDate').value);
        }
        if (this.eventForm.get('hpScaleType').value) {
            self.onhpScaleTypeChange(this.eventForm.get('hpScaleType').value);
        }
        if (this.eventForm.get('hpScaleFor').value) {
            self.onHPScaleForChange(this.eventForm.get('hpScaleFor').value);
        }
        this.subscriber.push(this.eventForm.get('payCommId').valueChanges.subscribe(res => {
            self.onPayCommissionValueChange(res);
        }));
        this.subscriber.push(this.eventForm.get('eventEffectiveDate').valueChanges.subscribe(res => {
            self.onEventEffectiveDateChange(res);
        }));
        this.subscriber.push(this.eventForm.get('hpScaleType').valueChanges.subscribe(res => {
            self.onhpScaleTypeChange(res);
        }));
        this.subscriber.push(this.eventForm.get('hpScaleFor').valueChanges.subscribe(res => {
            self.onHPScaleForChange(res);
        }));
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
                if (this.eventForm.get('eventCode').value === 'Higher_Pay_Scale' &&
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
        seventhPayLevel = this.payLevelList.filter((payBand) => Number(payBand.id) == payLevelId);
        if (payLevelId) {
            data['pPayLevelValue'] = seventhPayLevel[0].payLevelValue;
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
                const oaCellIdValue = this.payLevelList.find((paylevel) => (paylevel.payLevelValue) == res['result']['pPayLevelValue']);
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
     * @method onHPScaleForChange
     * @description Function is called when Higher Pay Scale for is changed
     * @param res Changed Higher Pay Scale for
     */
    onHPScaleForChange(res) {
        this.hpScaleFor = res;
        // tslint:disable-next-line: max-line-length
        if (this.eventEffectiveDate && !this.employeeCurrentForm.get('employeeNo').value
            && !isNaN(this.hpScaleFor) && !isNaN(this.hpScaleType)) {
            this.employeeCurrentForm.get('employeeNo').enable();
            this.enableEmployeeSearch = true;
            // tslint:disable-next-line:max-line-length
        } else if (this.eventEffectiveDate && this.hpScaleFor && this.hpScaleType && this.employeeCurrentForm.get('employeeNo').value) {
            this.onEmployeeKeyUp(null);
        } else {
            this.employeeCurrentForm.get('employeeNo').disable();
            this.enableEmployeeSearch = false;
        }
    }

    /**
     * @method onhpScaleTypeChange
     * @description Function is called when Higher Pay Scale type is changed
     * @param res Changed Higher Pay Scale Type
     */
    onhpScaleTypeChange(res) {
        this.hpScaleType = res;
        switch (res) {
            case 328:
                this.hgEffDatePlaceholder = 'Higher Grade 1st Effective Date';
                break;
            case 329:
                this.hgEffDatePlaceholder = 'Higher Grade 2nd Effective Date';
                break;
            case 330:
                this.hgEffDatePlaceholder = 'Higher Grade 3rd Effective Date';
                break;
        }
        // tslint:disable-next-line:max-line-length
        if (this.eventEffectiveDate && !this.employeeCurrentForm.get('employeeNo').value
            && !isNaN(this.hpScaleFor) && !isNaN(this.hpScaleType)) {
            this.employeeCurrentForm.get('employeeNo').enable();
            this.enableEmployeeSearch = true;
            // tslint:disable-next-line:max-line-length
        } else if (this.eventEffectiveDate && this.hpScaleFor && this.hpScaleType && this.employeeCurrentForm.get('employeeNo').value) {
            this.onEmployeeKeyUp(null);
        } else {
            this.employeeCurrentForm.get('employeeNo').disable();
            this.enableEmployeeSearch = false;
        }
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
                promoDate: [''],
                promoDesignation: [''],
                promoScale: [''],
                hp1: [''],
                hp2: [''],
                promotionScale: [''],
                promotionCell: [''],
                promotionPayLevel: [''],
                promotionGradePay: [''],
                promotionPayBand: [''],
                promotionPayBandValue: [''],
                fixProbationalPayDate: [''],
                conversionDateToRegular: [''],
            }));
            this.eventForm.addControl('postForm', self.fb.group({
                hpType: ['', Validators.required],
                hpEmpType: [''],
                optionAvailableId: ['', Validators.required],
                optionAvailableDate: [''],
                basicPay: [''],
                dateOfNextIncrement: [''],
                hgEffDate: ['']
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
                    promoDate: [''],
                    promoDesignation: [''],
                    promoScale: [''],
                    hp1: [''],
                    hp2: [''],
                    promotionScale: [''],
                    promotionCell: [''],
                    promotionPayLevel: [''],
                    promotionGradePay: [''],
                    promotionPayBand: [''],
                    promotionPayBandValue: [''],
                    fixProbationalPayDate: [''],
                    conversionDateToRegular: [''],
                }),
                postForm: self.fb.group({
                    hpType: ['', Validators.required],
                    hpEmpType: [''],
                    optionAvailableId: ['', Validators.required],
                    optionAvailableDate: [''],
                    basicPay: [''],
                    dateOfNextIncrement: [''],
                    hgEffDate: ['']
                })
            });
        }
        this.employeeCurrentForm = this.eventForm.get('employeeCurrentForm') as FormGroup;
        this.postForm = this.eventForm.get('postForm') as FormGroup;
    }

    /**
     * @method onTypeChange
     * @description Function is called when Higher pay scale Promtional or Isolated type selected
     * @param res Changed Higher pay scale Promtional or Isolated type
     */
    onTypeChange(event) {
        const self = this;
        self.hpType = event.value;
        if (self.hpType === 321) {
            this.postForm.get('hpEmpType').setValidators(Validators.required);
        } else {
            this.postForm.get('hpEmpType').clearValidators();
            this.postForm.get('hpEmpType').patchValue('');
            this.eligible = true;
        }
        this.postForm.get('hpEmpType').updateValueAndValidity();
        if (this.eventDetails) {
            if (this.eventDetails.hpType !== self.hpType) {
                this.clearPayDetails();
            }
            if (this.eventDetails.hpEmpType) {
                this.onEmployeeTypeChange({ value: this.eventDetails.hpEmpType });
            }
        } else {
            this.clearPayDetails();
        }
        if (this.hpScaleFor && this.payMasterData && this.payMasterData.data) {
            this.setCommList(this.payCommSelected);
        }
    }

    clearExmDetails() {
        this.departmentalExamDataSource = new MatTableDataSource([]);
        this.languageExamDataSource = new MatTableDataSource([]);
        this.cccExamDataSource = new MatTableDataSource([]);
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
                    this.dataSource = new MatTableDataSource([]);
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
                    this.dataSource = new MatTableDataSource([]);
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
                    this.dataSource = new MatTableDataSource([]);
                }
                break;
        }
        this.postForm.patchValue({
            'basicPay': null
        });
    }

    /**
     * @method onEmployeeTypeChange
     * @description Function is called when employee type selected
     * @param res Changed employee type
     */
    onEmployeeTypeChange(res) {
        this.employeeTypeSelected = res.value;
        if (res.value === 168) { // NGO type
            if (this.employeeDetails && this.employeeDetails.exams && this.employeeDetails.exams.examCondition) {
                // tslint:disable-next-line:max-line-length
                if (this.employeeDetails.exams.examCondition.cccPlusExams) {
                    this.eligible = true;
                } else if (this.employeeDetails.exams.examCondition.cccExams) {
                    this.eligible = true;
                } else {
                    let elig = false;
                    if (this.employeeDetails.exams.cccExams && this.employeeDetails.exams.cccExams.length === 1) {
                        elig = (this.employeeDetails.exams.cccExams[0]['examStatus'] === 'Exempted' &&
                            this.employeeDetails.exams.cccExams[0]['examName'] === null);
                    }
                    this.eligible = elig;
                }
            } else {
                this.eligible = false;
            }
        } else if (res.value === 167) { // GO type
            if (this.employeeDetails && this.employeeDetails.exams && this.employeeDetails.exams.examCondition) {
                // tslint:disable-next-line:max-line-length
                if (this.employeeDetails.exams.examCondition.cccPlusExams) {
                    this.eligible = true;
                } else {
                    let elig = false;
                    if (this.employeeDetails.exams.cccExams && this.employeeDetails.exams.cccExams.length === 1) {
                        elig = (this.employeeDetails.exams.cccExams[0]['examStatus'] === 'Exempted' &&
                            this.employeeDetails.exams.cccExams[0]['examName'] === null);
                    }
                    this.eligible = elig;
                }
            } else {
                this.eligible = false;
            }
        }
    }

    /**
     * @method setHPData
     * @description Function is called to set higher pay scale saved data
     */
    setHPData() {
        const self = this;
        this.postForm.patchValue({
            hpType: this.eventDetails.hpType ? this.eventDetails.hpType : null,
            hpEmpType: this.eventDetails.hpEmpType ? this.eventDetails.hpEmpType : null,
            optionAvailableId: this.eventDetails.optionAvailableId ? this.eventDetails.optionAvailableId : null,
            basicPay: this.eventDetails.basicPay ? this.eventDetails.basicPay : null,
            hgEffDate: this.eventDetails.hgEffDate ? new Date(this.eventDetails.hgEffDate) : null,
            // tslint:disable-next-line:max-line-length
            optionAvailableDate: this.eventDetails.optionAvailableDate ? new Date(this.eventDetails.optionAvailableDate) : null,
            // tslint:disable-next-line:max-line-length
            dateOfNextIncrement: this.eventDetails.dateOfNextIncrement ? new Date(this.eventDetails.dateOfNextIncrement) : null
        });
        if (self.eventDetails.hgEffDate) {
            let hgEffDate = self.eventDetails.hgEffDate.split('-');
            hgEffDate = new Date(hgEffDate[0], hgEffDate[1] - 1, hgEffDate[2]);
            this.postForm.patchValue({
                hgEffDate: hgEffDate
            });
        }
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
                if (!isNaN(this.hpScaleType) && !isNaN(this.hpScaleFor)) {
                    this.employeeCurrentForm.get('employeeNo').enable();
                    this.enableEmployeeSearch = true;
                    self.eventEffectiveDate = res;
                    if (this.employeeCurrentForm.get('employeeNo').value) {
                        this.onEmployeeKeyUp(null);
                    }
                }
            }
        } else {
            this.employeeCurrentForm.get('employeeNo').disable();
            this.enableEmployeeSearch = false;
        }
        self.eventEffectiveDate = res;
        this.postForm.patchValue({
            hgEffDate: self.eventEffectiveDate
        });
        // this.postForm.get('hgEffDate').disable();
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
            this.dataSource = new MatTableDataSource();
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
     * as he is applicable for higher pay grade or not
     */
    checkForEligibility() {
        const params: any = { 'data': {} },
            self = this;
        params['data']['employeeNo'] = self.employeeCurrentForm.get('employeeNo').value;
        params['data']['payCommissionId'] = self.payCommSelected;
        params['data']['higherPayScaleType'] = (self.hpScaleType ? self.hpScaleType :
            (this.eventForm.get('hpScaleType') ? this.eventForm.get('hpScaleType').value : null));
        params['data']['higherPayScaleFor'] = (self.hpScaleFor ? self.hpScaleFor :
            (this.eventForm.get('hpScaleFor') ? this.eventForm.get('hpScaleFor').value : null));
        params['data']['isViewPage'] = this.action === 'view';
        if (self.eventEffectiveDate) {
            let effDate: any = self.eventEffectiveDate,
                dateToSend = '';
            dateToSend += effDate.getFullYear();
            dateToSend += '/';
            if (effDate.getMonth() < 9) {
                dateToSend += '0' + (effDate.getMonth() + 1);
                dateToSend += '/';
            } else {
                dateToSend += '' + (effDate.getMonth() + 1);
                dateToSend += '/';
            }
            if (effDate.getDate() <= 9) {
                dateToSend += '0' + effDate.getDate();
            } else {
                dateToSend += effDate.getDate();
            }
            effDate = dateToSend;
            params['data']['effectiveDate'] = effDate;
        }
        this.eventService.checkforHigherPayEligibility(params).subscribe(res => {
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
                }
                self.setEmployeeInfo();
                self.onEmployeeEligible();
                self.checkForDateOfNxtIncr();
                self.eligible = true;
            } else {
                self.employeeDetails = null;
                self.eligible = false;
                this.postForm.disable();
                self.clearEmployeeDetails();
                self.toastr.error(res['message']);
            }
            self.employeeDetailChange.emit(self.employeeDetails);
        }, err => {
            self.employeeDetails = null;
            self.eligible = false;
            this.postForm.disable();
            self.employeeDetailChange.emit(self.employeeDetails);
            self.clearEmployeeDetails();
            self.toastr.error(err);
        });
    }

    /**
     * @method checkForDateOfNxtIncr
     * @description Function is called to check for 180 days calculation
     * as he is applicable for higher pay grade or not
     */
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
                dateToSend = '' + (effDate.getMonth() + 1);
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
        this.eventService.checkforDateNxtIncr(params).subscribe(res => {
            if (res['status'] === 200 && res['result'] !== null) {
                self.daysCheckEligible = res['result'];
                if (res['result']) {
                    self.postForm.get('optionAvailableId').disable();
                } else {
                    if (self.action !== 'view') {
                        self.postForm.get('optionAvailableId').enable();
                    }
                }
                if (!self.eventDetails) {
                    self.postForm.get('optionAvailableId').patchValue(1);
                } else {
                    self.postForm.get('optionAvailableId').patchValue(self.eventDetails.optionAvailableId);
                }
                self.setDateOfNxtIncr();
            } else {
                self.toastr.error(res['message']);
            }
        }, err => {
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
        if (this.postForm.get('cellId')) {
            this.postForm.get('cellId').disable();
        }
        if (this.employeeDetails && this.employeeDetails.employee) {
            this.getPayMasters();
            if (!this.previousEmployeeNo) {
                this.previousEmployeeNo = this.employeeDetails.employee.employeeNo;
            }
            if (Number(this.previousEmployeeNo) !== Number(this.employeeDetails.employee.employeeNo)) {
                this.postForm.patchValue({
                    basicPay: null,
                    hpType: null,
                    hpEmpType: null,
                    optionAvailableId: null,
                    optionAvailableDate: null,
                    dateOfNextIncrement: null
                });
                if (this.eventDetails) {
                    if (this.eventDetails.hpType) {
                        this.eventDetails.hpType = null;
                    }
                    if (this.eventDetails.hpEmpType) {
                        this.eventDetails.hpEmpType = null;
                    }
                    if (this.eventDetails.optionAvailableId) {
                        this.eventDetails.optionAvailableId = null;
                    }
                    if (this.eventDetails.optionAvailableDate) {
                        this.eventDetails.optionAvailableDate = null;
                    }
                    if (this.eventDetails.dateOfNextIncrement) {
                        this.eventDetails.dateOfNextIncrement = null;
                    }
                }
                this.clearPayDetails();
            }
            if (this.eventDetails && this.eventDetails.hpType) {
                this.onTypeChange({ value: this.eventDetails.hpType });
            }
        }
        // this.employeeDetailChange.emit(this.employeeDetails);
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
                if (this.daysCheckEligible) {
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
                if (this.daysCheckEligible) {
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
                if (this.daysCheckEligible) {
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
     * @method transforminDDMYateFormat
     * @description Function is called to get Date in format YYYY-MM-DD
     * @param date for which format is required
     */
    transforminDDMYateFormat(date) {
        if (date !== '' && date !== undefined && date !== null) {
            date = new Date(date);
            return this.datepipe.transform(date, 'dd/MM/yyyy');
        }
        return '';
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
        if (!this.eligible) {
            if (this.employeeDetails && this.employeeDetails.exams &&
                this.employeeDetails.exams.cccExams && this.employeeDetails.exams.cccExams.length === 0) {
                this.toastr.error(this.errorMessage.CCC_EXAM_MANDATORY);
                return;
            }
            if (this.employeeTypeSelected === 168) {
                this.toastr.error('Employee must clear CCC or CCC+ exams!');
            } else if (this.employeeTypeSelected === 167) {
                this.toastr.error('Employee must clear CCC+ exams!');
            }
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
            if (!this.eligible) {
                if (this.employeeTypeSelected === 168) {
                    this.toastr.error('Employee must clear CCC or CCC+ exams!');
                } else if (this.employeeTypeSelected === 167) {
                    this.toastr.error('Employee must clear CCC+ exams!');
                }
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
        // tslint:disable-next-line:max-line-length
        if (this.payCommSelected !== this.eventForm.get('payCommId').value && this.eventForm.get('payCommId').value && !this.employeeCurrentForm.controls.employeeNo.errors) {
            this.payCommSelected = this.eventForm.get('payCommId').value;
            if (this.eventEffectiveDate && !isNaN(this.hpScaleFor) && !isNaN(this.hpScaleType)) {
                this.enableEmployeeSearch = true;
                this.onEmployeeKeyUp(null);
            }
        }
        this.payCommSelected = payCommissionId;
        // this.setEmployeePayDetailsOnPayCommChange(payCommissionId);
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
                this.setSixthData();
                // 6 comm
                break;
            case 152:
                // 7 comm
                this.setSeventhData();
                break;
        }
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
            if (this.hpType === 322) {
                let currentPayScale = 0;
                for (let index = 0; index < this.scaleList.length; index++) {
                    const payLevel = this.scaleList[index];
                    if (payLevel.name.includes('8500') && payLevel.name.includes('14050')) {
                        currentPayScale = index - 1;
                        break;
                    } else {
                        const currentPayscaleSelected = payLevel.name.split('-');
                        if ((Number(currentPayscaleSelected[0]) >= 8500)
                            || (Number(currentPayscaleSelected[currentPayscaleSelected.length - 1]) >= 14050)) {
                            currentPayScale = index - 1;
                            break;
                        }
                    }
                }
                if (currentPayScale) {
                    this.scaleList = this.scaleList.splice(0, currentPayScale);
                }
            }

            if (this.employeeDetails && this.employeeDetails.employee
                && Number(this.previousEmployeeNo) !== Number(this.employeeDetails.employee.employeeNo)) {
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
        if (Number(this.eventForm.get('payCommId').value) !== 150) {
            this.dataSource = new MatTableDataSource();
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
                    if (this.hpType === 322) {
                        if ((currentPayScale + 2) < sixData.length) {
                            this.payBandList = _.cloneDeep(this.getListAccEvent(sixData,
                                (currentPayScale - 1), (currentPayScale + 2)));
                        } else {
                            this.payBandList =
                                _.cloneDeep(this.getListAccEvent(sixData, (currentPayScale - 1)));
                        }
                    } else {
                        this.payBandList =
                            _.cloneDeep(this.getListAccEvent(sixData, (currentPayScale - 1)));
                    }
                }
                // if (this.hpType === 322) {
                //     currentPayScale = null;
                //     this.payBandList.forEach((payLevel, index) => {
                //         if (payLevel.payBandName.includes('15600 - 39100')) {
                //             currentPayScale = index;
                //         }
                //     });
                //     if (currentPayScale) {
                //         this.payBandList = this.payBandList.splice(0, currentPayScale);
                //     }
                // }
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
     * @method getListAccEvent
     * @description Function is called to extract values from array
     * @param data Array is provided
     * @param index from which index values are extracted till last index
     * @returns Extracted Array
     */
    getListAccEvent(data, index, lastIndex?) {
        if (this.hpType === 322) {
            if (lastIndex) {
                return data.slice(index + 1, lastIndex);
            }
            return data.slice(index + 1, index + 2);
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
                if (!self.eventDetails || (self.eventDetails && self.eventDetails.payBandId !== payBandId)) {
                    this.postForm.get('basicPay').patchValue('');
                    this.postForm.get('gradePayId').patchValue('');
                }
                this.calculateSixthBasicPay();
                // tslint:disable-next-line:max-line-length
                this.postForm.get('payBandValue').setValidators([Validators.min(setSelectedPayBand.startingValue), Validators.max(setSelectedPayBand.endValue)]);
            }
            if (gradePayData[0]) {
                let gradePayIndex = null,
                    greaterValue = false;
                // tslint:disable-next-line:max-line-length
                for (let gradePayIndexVaue = 0; gradePayIndexVaue < gradePayData[0].gradePays.length; gradePayIndexVaue++) {
                    const gradePay = gradePayData[0].gradePays[gradePayIndexVaue];
                    if (Number(gradePay.gradePayValue) === Number(this.employeeDetails.employee.gradePayName)) {
                        gradePayIndex = gradePayIndexVaue;
                        break;
                    } else if (Number(gradePay.gradePayValue) > Number(this.employeeDetails.employee.gradePayName)) {
                        greaterValue = true;
                        gradePayIndex = gradePayIndexVaue;
                        break;
                    }
                }
                if (gradePayIndex || gradePayIndex === 0) {
                    gradePayIndex = greaterValue ? gradePayIndex : (gradePayIndex + 1);
                    this.gradePayList = _.cloneDeep(gradePayData[0].gradePays.splice(gradePayIndex));
                }
                if (this.hpType === 322) {
                    this.gradePayList = this.gradePayList.filter((payLevel) => {
                        return Number(payLevel.gradePayValue) <= 5400;
                    });
                }
            }
        }
        if (this.eventDetails) {
            this.calculateSixthPayIncrement();
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
     * @method setSeventhData
     * @description Function is called to check set seven pay commission data in dropdown
     * @param payCommissionId what pay commission is selected, that id is provided
     */
    setSeventhData() {
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
                if (this.hpType === 322) {
                    this.payLevelList = this.payLevelList.filter((payLevel) => {
                        return (10 > Number(payLevel.payLevelValue) || payLevel.payLevelValue.includes('IS'));
                    });
                }
            }
        }
        if (this.employeeDetails && this.employeeDetails.employee &&
            Number(this.previousEmployeeNo) !== Number(this.employeeDetails.employee.employeeNo)) {
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
            // tslint:disable-next-line: max-line-length
            if (this.employeeDetails && this.employeeDetails.employee) { // this.hpType && this.hpType !== 321 &&
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
     * @method ngOnChanges
     * @description Function is called to take necessary actions when input parameters are changed from outside
     */
    ngOnChanges() {
        const self = this;
        // if (self.action === 'edit' || self.action === 'view') {
        if (self.eventDetails && this.postForm) {
            this.setHPData();
        }
        // }
        // tslint:disable-next-line:max-line-length
        if (this.employeeDetails && this.eventForm && this.eventForm.get('payCommId') && this.eventForm.get('payCommId').value && this.payMasterData && this.payMasterData.data) {
            this.setCommList(this.eventForm.get('payCommId').value);
        }
        if (this.employeeCurrentForm && this.eventDetails && this.eventDetails.employeeNo) {
            this.employeeCurrentForm.get('employeeNo').patchValue('' + this.eventDetails.employeeNo);
            if (!this.eventForm.get('eventEffectiveDate').errors) {
                this.checkForEligibility();
            } else {
                this.eventForm.get('eventEffectiveDate').markAsTouched({ onlySelf: true });
            }
        }
        if (this.lookUpData) {
            this.typeList = _.cloneDeep(this.lookUpData['Higher_Pay_Scale_Post_Type']);
            this.empTypeList = _.cloneDeep(this.lookUpData['Emp_Type']);
            this.optionAvailedList = _.cloneDeep(this.lookUpData['ConditionCheck']);
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


    /**
     * @method clearEmployeeDetails
     * @description Function is called when error or not eligible in fetching employee details
     * Kept for future purpose
     */
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
                conversionDateToRegular: this.transforminDDMYateFormat
                    (this.employeeDetails.employee.conversionDateToRegular),
                fixProbationalPayDate: this.transforminDDMYateFormat
                    (this.employeeDetails.employee.fixProbationalPayDate),
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
                promotionScale: null,
                promotionCell: null,
                promotionPayLevel: null,
                promotionGradePay: null,
                promotionPayBand: null,
                promoDate: null,
                promoDesignation: null,
                promotionPayBandValue: null,
                conversionDateToRegular: null,
                fixProbationalPayDate: null,
            });
            this.departmentalExamDataSource = new MatTableDataSource([]);
            this.languageExamDataSource = new MatTableDataSource([]);
            this.cccExamDataSource = new MatTableDataSource([]);
            this.employeeCurrentForm.get('employeeNo').patchValue('');
            setTimeout(() => {
                this.el.nativeElement.querySelector('.employee-number-field').focus();
            }, 0);
        }
        if (this.employeeDetails && this.employeeDetails.exams && this.employeeDetails.exams.promotion) {
            this.employeeCurrentForm.patchValue({
                promoDate: this.employeeDetails.exams.promotion.promotionEventdate,
                promoDesignation: this.employeeDetails.exams.promotion.promotionDesignation,
                promotionScale: this.employeeDetails.exams.promotion.promotionScale,
                promotionCell: this.employeeDetails.exams.promotion.promotionCell,
                promotionPayLevel: this.employeeDetails.exams.promotion.promotionPayLevel,
                promotionGradePay: this.employeeDetails.exams.promotion.promotionGradePay,
                promotionPayBand: this.employeeDetails.exams.promotion.promotionPayBand,
                promotionPayBandValue: this.employeeDetails.exams.promotion.promotionPayBandValue
            });
            if (this.employeeDetails.exams.promotion.promotionEventdate) {
                let promoDate;
                if (this.employeeDetails.exams.promotion.promotionEventdate.indexOf(' ') !== -1) {
                    promoDate = this.employeeDetails.exams.promotion.promotionEventdate.split(' ')[0].split('-');
                    this.employeeCurrentForm.patchValue({
                        promoDate: promoDate[2] + '/' + promoDate[1] + '/' + promoDate[0]
                    });
                } else if (this.employeeDetails.exams.promotion.promotionEventdate.indexOf('T') !== -1) {
                    promoDate = this.employeeDetails.exams.promotion.promotionEventdate.split('T')[0].split('-');
                    this.employeeCurrentForm.patchValue({
                        promoDate: promoDate[2] + '/' + promoDate[1] + '/' + promoDate[0]
                    });
                } else {
                    promoDate = this.employeeDetails.exams.promotion.promotionEventdate.split('-');
                    this.employeeCurrentForm.patchValue({
                        promoDate: promoDate[2] + '/' + promoDate[1] + '/' + promoDate[0]
                    });
                }
            }
        }
        if (this.employeeDetails && this.employeeDetails.exams && this.employeeDetails.exams.higherPayDate) {
            if (this.employeeDetails.exams.higherPayDate.firstHigherpayDate) {
                let hp1;
                hp1 = this.employeeDetails.exams.higherPayDate.firstHigherpayDate.split('-');
                this.employeeCurrentForm.patchValue({
                    hp1: hp1[2] + '/' + hp1[1] + '/' + hp1[0]
                });
            }
            if (this.employeeDetails.exams.higherPayDate.secondHigherpayDate) {
                let hp2;
                hp2 = this.employeeDetails.exams.higherPayDate.secondHigherpayDate.split('-');
                this.employeeCurrentForm.patchValue({
                    hp2: hp2[2] + '/' + hp2[1] + '/' + hp2[0]
                });
            }
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
        const self = this;
        const empNo = self.employeeCurrentForm.get('employeeNo').value;
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
                const employeeNo = this.employeeCurrentForm.get('employeeNo').value;
                if (employeeNo && employeeNo.length === 10) {
                    if (!this.eventForm.get('eventEffectiveDate').errors) {
                        this.checkForEligibility();
                    } else {
                        this.eventForm.get('eventEffectiveDate').markAsTouched({ onlySelf: true });
                    }
                }
            }
        }
    }

    /**
     * @description changes the value in datasource of optionAvail
     */
    optionAvailDateChanged() {
        if (this.postForm.get('optionAvailableId') && this.postForm.get('optionAvailableId').value === 2
                && this.postForm.get('optionAvailableDate') && this.postForm.get('optionAvailableDate').value) {
            const optDataSource = this.dataSource.data;
            if (optDataSource && optDataSource.length > 0 ) {
                optDataSource[0]['PayAsonIncrementDate'] = this.postForm.get('optionAvailableDate').value;
                this.dataSource = new MatTableDataSource(optDataSource);
            }
        }
    }

}
