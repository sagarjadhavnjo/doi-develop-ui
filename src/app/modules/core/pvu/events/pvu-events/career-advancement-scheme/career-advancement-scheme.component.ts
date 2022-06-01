import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { SearchEmployeeComponent } from './../../../pvu-common/search-employee/search-employee.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { merge, Subscription } from 'rxjs';
import { EVENT_ERRORS } from './../index';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Component, OnInit, Input, OnDestroy, OnChanges, Output, EventEmitter, ElementRef } from '@angular/core';
import { PVUEventsService } from '../services/pvu-event.service';
import { PvuCommonService } from './../../../pvu-common/services/pvu-common.service';
import * as _ from 'lodash';

@Component({
    selector: 'app-career-advancement-scheme',
    templateUrl: './career-advancement-scheme.component.html',
    styleUrls: ['./career-advancement-scheme.component.css']
})
export class CareerAdvancementSchemeComponent implements OnInit, OnChanges, OnDestroy {
    @Input() eventForm: FormGroup;
    @Input() action: string;
    @Input() eventType: string;
    @Input() eventDetails: any;
    @Input() lookupData: any;
    @Input() isRework;
    @Output() saveEvent: EventEmitter<any> = new EventEmitter();
    @Output() resetFormEvent: EventEmitter<any> = new EventEmitter();
    @Output() employeeDetailChange: EventEmitter<any> = new EventEmitter();

    employeeDetails: any;
    payMasterData: any;
    classCtrl: FormControl = new FormControl();
    defaultClassList: any = [];
    designationCtrl: FormControl = new FormControl();
    designationList: [];
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
    title: string = 'Current Detail';
    scaleList = [];
    postForm: FormGroup;
    empId: number;
    subscriber: Subscription[] = [];
    errorMessage = EVENT_ERRORS;
    eventEffectiveDate: Date;
    optionMinDate: Date;
    classList: any;
    isFifth: boolean = false;
    eligible: boolean = false;
    daysCheckEligible: boolean = false;
    currentPayscaleSelected: any = [];
    fifthMin: number = 0;
    fifthMax: number = 0;
    enableBasicPayEdit: boolean = true;
    employeeCurrentForm: FormGroup;
    enableEmployeeSearch: boolean = false;
    casEffDatePlaceholder = 'Benefit Effective Date';
    cccExamData = [];
    departmentalExamData = [];
    languageExamData = [];
    masterExamsData = [];
    payCommSelected: number;
    previousEmployeeNo;
    masterExamColumns = ['examName', 'courseName', 'examBody', 'examPassingDate', 'examStatus'];
    examColumns = ['examName', 'examBody', 'examPassingDate', 'examStatus'];
    examFooterColumns = ['examName'];

    // resetFormEvent: EventEmitter<any> = new EventEmitter();
    cccExamDataSource = new MatTableDataSource(this.cccExamData);
    departmentalExamDataSource = new MatTableDataSource(this.departmentalExamData);
    masterExamsDataSource = new MatTableDataSource(this.masterExamsData);
    languageExamDataSource = new MatTableDataSource(this.languageExamData);

    // Post
    casType: number;
    minRefDate;
    maxRefDate;

    public columnsToDisplay: any = [];
    displayedColumns = [];
    optionValid: boolean = false;
    dataSource = new MatTableDataSource<any>([]);
    examColumns2 = ['examName', 'examBody', 'examPassingDate', 'examStatus', 'examBasic'];
    optionAvailedData: any;
    constructor(
        private fb: FormBuilder,
        private eventService: PVUEventsService,
        private dialog: MatDialog,
        private toastr: ToastrService,
        private datepipe: DatePipe,
        private el: ElementRef,
        private pvuCommonService: PvuCommonService
    ) { }

    /**
     * @method ngOnInit
     * @description Call when component is load and initialize the view and load data
     */
    ngOnInit() {
        const self = this;
        this.creatEmployeeForm();
        this.getDesignations();
        this.employeeCurrentForm.get('employeeNo').disable();
        this.postForm.disable();
        if (this.eventForm.get('payCommId').value) {
            self.onPayCommissionValueChange(this.eventForm.get('payCommId').value);
        }
        if (this.eventForm.get('eventEffectiveDate').value) {
            self.onEventEffectiveDateChange(this.eventForm.get('eventEffectiveDate').value);
        }
        if (this.eventForm.get('casType').value) {
            self.onCasTypeChange(this.eventForm.get('casType').value);
        }
        this.subscriber.push(this.eventForm.get('payCommId').valueChanges.subscribe(res => {
            self.onPayCommissionValueChange(res);
        }));
        this.subscriber.push(this.eventForm.get('eventEffectiveDate').valueChanges.subscribe(res => {
            self.onEventEffectiveDateChange(res);
        }));
        this.subscriber.push(this.eventForm.get('casType').valueChanges.subscribe(res => {
            self.onCasTypeChange(res);
            if (self.action !== 'view' && self.action !== 'edit') {
                this.clearPostForm();
            }
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
                if (this.eventForm.get('eventCode').value === 'Career_Advancement_Scheme' &&
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
            cCellIdValue: +self.employeeDetails.employee.cell,
            cPayLevelValue: self.employeeDetails.employee.payLevel,
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
                } else {
                    this.dataSource = new MatTableDataSource([]);
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
            empDeptCatId: Number(this.employeeDetails.employee.deptCategory)
        };
        if (Number(this.employeeDetails.employee.deptCategory) == 17) {
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
    * @method onCasTypeChange
    * @description Function is called when Type is changed
    * @param res Type
    */
    onCasTypeChange(res) {
        this.casType = res;
        if (this.eventEffectiveDate && !this.employeeCurrentForm.get('employeeNo').value
            && !isNaN(this.casType)) {
            this.employeeCurrentForm.get('employeeNo').enable();
            this.enableEmployeeSearch = true;
            // tslint:disable-next-line:max-line-length
        } else if (this.eventEffectiveDate && this.casType && this.employeeCurrentForm.get('employeeNo').value) {
            this.onEmployeeKeyUp(null);
        } else {
            this.employeeCurrentForm.get('employeeNo').disable();
            this.enableEmployeeSearch = false;
        }
        if (typeof (res) === 'number') {
            switch (res) {
                case 312:
                    this.casEffDatePlaceholder = 'Effective Date of Senior Scale';
                    if (this.employeeCurrentForm.get('oriCertDate')) {
                        this.employeeCurrentForm.removeControl('oriCertDate');
                    }
                    if (this.employeeCurrentForm.get('ssrefCertDate')) {
                        this.employeeCurrentForm.removeControl('ssrefCertDate');
                    }
                    if (this.employeeCurrentForm.get('sgrefCertDate')) {
                        this.employeeCurrentForm.removeControl('sgrefCertDate');
                    }
                    if (this.employeeCurrentForm.get('sgrefCertDate3yr')) {
                        this.employeeCurrentForm.removeControl('sgrefCertDate3yr');
                    }
                    if (this.employeeCurrentForm.get('sgEffDate3Yr')) {
                        this.employeeCurrentForm.removeControl('sgEffDate3Yr');
                    }
                    if (this.employeeCurrentForm.get('uniAppLectType')) {
                        this.employeeCurrentForm.removeControl('uniAppLectType');
                    }
                    if (this.employeeCurrentForm.get('ssEffDate')) {
                        this.employeeCurrentForm.removeControl('ssEffDate');
                    }
                    if (this.employeeCurrentForm.get('sgEffDate3Yr')) {
                        this.employeeCurrentForm.removeControl('sgEffDate3Yr');
                    }
                    if (this.employeeCurrentForm.get('sgEffDate')) {
                        this.employeeCurrentForm.removeControl('sgEffDate');
                    }
                    if (!(this.postForm.get('optionAvailableId'))) {
                        this.postForm.addControl('optionAvailableId', this.fb.control('', [Validators.required]));
                        this.postForm.addControl('optionAvailableDate', this.fb.control('', [Validators.required]));
                    }
                    if (!(this.postForm.get('uniAppLectType'))) {
                        this.postForm.addControl('uniAppLectType', this.fb.control('', [Validators.required]));
                    }
                    break;
                case 313:
                    this.casEffDatePlaceholder = 'Effective Date of Selection Grade';
                    if (this.eventForm && this.postForm) {
                        // tslint:disable-next-line:max-line-length
                        this.employeeCurrentForm.addControl('oriCertDate', this.fb.control({ value: null, disabled: true }));
                        // tslint:disable-next-line:max-line-length
                        this.employeeCurrentForm.addControl('uniAppLectType', this.fb.control({ value: null, disabled: true }));
                        // tslint:disable-next-line:max-line-length
                        this.employeeCurrentForm.addControl('ssEffDate', this.fb.control({ value: null, disabled: true }));
                        // tslint:disable-next-line:max-line-length
                        this.employeeCurrentForm.addControl('ssrefCertDate', this.fb.control({ value: null, disabled: true }));
                        this.postForm.addControl('refCourAtte', this.fb.control('', [Validators.required]));
                        this.postForm.get('refCourAtte').setValue(2);
                        this.postForm.addControl('refCertDate', this.fb.control('', [Validators.required]));
                        this.postForm.addControl('oriCourAtte', this.fb.control('', [Validators.required]));
                        this.postForm.get('oriCourAtte').setValue(2);
                        this.postForm.addControl('oriCertDate', this.fb.control('', [Validators.required]));
                        this.employeeCurrentForm.removeControl('sgEffDate');
                        this.employeeCurrentForm.removeControl('sgEffDate3Yr');
                        this.employeeCurrentForm.removeControl('sgrefCertDate');
                        this.employeeCurrentForm.removeControl('sgrefCertDate3yr');
                    }
                    if (!(this.postForm.get('optionAvailableId'))) {
                        this.postForm.addControl('optionAvailableId', this.fb.control('', [Validators.required]));
                        this.postForm.addControl('optionAvailableDate', this.fb.control('', [Validators.required]));
                    }
                    if (!(this.postForm.get('uniAppLectType'))) {
                        this.postForm.addControl('uniAppLectType', this.fb.control('', [Validators.required]));
                    }
                    break;
                case 314:
                    this.casEffDatePlaceholder = 'Effective Date of Selection Grade (3 years) - 1';
                    if (this.eventForm && this.postForm) {
                        // tslint:disable-next-line:max-line-length
                        this.employeeCurrentForm.addControl('ssEffDate', this.fb.control({ value: null, disabled: true }));
                        // tslint:disable-next-line:max-line-length
                        this.employeeCurrentForm.addControl('sgEffDate', this.fb.control({ value: null, disabled: true }));
                        // tslint:disable-next-line:max-line-length
                        this.employeeCurrentForm.addControl('uniAppLectType', this.fb.control({ value: null, disabled: true }));
                        // tslint:disable-next-line:max-line-length
                        this.employeeCurrentForm.addControl('oriCertDate', this.fb.control({ value: null, disabled: true }));
                        // tslint:disable-next-line:max-line-length
                        this.employeeCurrentForm.addControl('ssrefCertDate', this.fb.control({ value: null, disabled: true }));
                        // tslint:disable-next-line:max-line-length
                        this.employeeCurrentForm.addControl('sgrefCertDate', this.fb.control({ value: null, disabled: true }));
                        this.postForm.addControl('refCourAtte', this.fb.control('', [Validators.required]));
                        this.postForm.get('refCourAtte').setValue(2);
                        this.postForm.addControl('refCertDate', this.fb.control('', [Validators.required]));
                        this.employeeCurrentForm.removeControl('sgEffDate3Yr');
                        this.employeeCurrentForm.removeControl('sgrefCertDate3yr');
                        this.postForm.removeControl('uniAppLectType');
                        this.postForm.removeControl('oriCourAtte');
                        this.postForm.removeControl('oriCertDate');
                        this.postForm.removeControl('optionAvailableId');
                        this.postForm.removeControl('optionAvailableDate');
                    }
                    break;
                case 315:
                    this.casEffDatePlaceholder = 'Effective Date of Selection Grade (3 years) - 2';
                    if (this.eventForm && this.postForm) {
                        // tslint:disable-next-line:max-line-length
                        this.employeeCurrentForm.addControl('ssEffDate', this.fb.control({ value: null, disabled: true }));
                        // tslint:disable-next-line:max-line-length
                        this.employeeCurrentForm.addControl('sgEffDate', this.fb.control({ value: null, disabled: true }));
                        // tslint:disable-next-line:max-line-length
                        this.employeeCurrentForm.addControl('uniAppLectType', this.fb.control({ value: null, disabled: true }));
                        // tslint:disable-next-line:max-line-length
                        this.employeeCurrentForm.addControl('oriCertDate', this.fb.control({ value: null, disabled: true }));
                        // tslint:disable-next-line:max-line-length
                        this.employeeCurrentForm.addControl('ssrefCertDate', this.fb.control({ value: null, disabled: true }));
                        // tslint:disable-next-line:max-line-length
                        this.employeeCurrentForm.addControl('sgrefCertDate', this.fb.control({ value: null, disabled: true }));
                        // tslint:disable-next-line:max-line-length
                        this.employeeCurrentForm.addControl('sgEffDate3Yr', this.fb.control({ value: null, disabled: true }));
                        // tslint:disable-next-line:max-line-length
                        this.employeeCurrentForm.addControl('sgrefCertDate3yr', this.fb.control({ value: null, disabled: true }));
                        this.postForm.removeControl('uniAppLectType');
                        this.postForm.removeControl('refCourAtte');
                        this.postForm.removeControl('refCertDate');
                        this.postForm.removeControl('oriCourAtte');
                        this.postForm.removeControl('oriCertDate');
                        this.postForm.removeControl('optionAvailableId');
                        this.postForm.removeControl('optionAvailableDate');
                    }
                    break;
            }
        }
        if (this.eventDetails && this.eventDetails.refCourAtte) {
            this.postForm.patchValue({
                refCourAtte: this.eventDetails.refCourAtte ? this.eventDetails.refCourAtte : 0,
                refCertDate: this.eventDetails.refCertDate ? new Date(this.eventDetails.refCertDate) : null,
            });
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
                employeeName: [{ value: null, disabled: true }],
                className: [{ value: null, disabled: true }],
                designationName: [{ value: null, disabled: true }],
                officeName: [{ value: null, disabled: true }],
                basicPay: [{ value: null, disabled: true }],
                dateJoining: [{ value: null, disabled: true }],
                retirementDate: [{ value: null, disabled: true }],
                dateNxtIncr: [{ value: null, disabled: true }],


            }));
            this.eventForm.addControl('postForm', self.fb.group({
                designationId: ['', Validators.required],
                uniAppLectType: ['', Validators.required],
                optionAvailableId: ['', Validators.required],
                optionAvailableDate: [''],
                basicPay: [''],
                dateOfNextIncrement: [''],
                beneEffictDate: [''],
                // remarks: ['']
            }));
        } else {
            this.eventForm = self.fb.group({
                employeeCurrentForm: self.fb.group({
                    employeeNo: [{ value: null, disabled: true }, Validators.required],
                    employeeName: [{ value: null, disabled: true }],
                    className: [{ value: null, disabled: true }],
                    designationName: [{ value: null, disabled: true }],
                    officeName: [{ value: null, disabled: true }],
                    basicPay: [{ value: null, disabled: true }],
                    dateJoining: [{ value: null, disabled: true }],
                    retirementDate: [{ value: null, disabled: true }],
                    dateNxtIncr: [{ value: null, disabled: true }],
                }),
                postForm: self.fb.group({
                    designationId: ['', Validators.required],
                    uniAppLectType: ['', Validators.required],
                    oriCertDate: [''],
                    oriCourAtte: ['', Validators.required],
                    refCertDate: [''],
                    refCourAtte: ['', Validators.required],
                    optionAvailableId: ['', Validators.required],
                    optionAvailableDate: [''],
                    basicPay: [''],
                    dateOfNextIncrement: [''],
                    beneEffictDate: [''],
                    //   remarks: ['']
                })
            });
        }
        this.employeeCurrentForm = this.eventForm.get('employeeCurrentForm') as FormGroup;
        this.postForm = this.eventForm.get('postForm') as FormGroup;
    }

    /**
     * @method setCASData
     * @description Function is called to set CAS saved data
     */
    setCASData() {
        const self = this;
        this.postForm.patchValue({
            uniAppLectType: this.eventDetails.uniAppLectType,
            optionAvailableId: this.eventDetails.optionAvailableId,
            // tslint:disable-next-line:max-line-length
            optionAvailableDate: this.eventDetails.optionAvailableDate ? new Date(this.eventDetails.optionAvailableDate) : null,
            basicPay: this.eventDetails.basicPay,
            // tslint:disable-next-line:max-line-length
            dateOfNextIncrement: this.eventDetails.dateOfNextIncrement ? new Date(this.eventDetails.dateOfNextIncrement) : null,
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
        this.onUniversityApprovedLectecture(this.eventDetails.uniAppLectType);
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
     * @method onEventEffectiveDateChange
     * @description Function is called on effective date change and sets minimum date
     * @param res Changed effective date
     */
    onEventEffectiveDateChange(res) {
        const self = this;
        if (res) {
            if (this.eventEffectiveDate !== res) {
                this.employeeCurrentForm.get('employeeNo').enable();
                this.enableEmployeeSearch = true;
                self.eventEffectiveDate = res;
                this.onEmployeeKeyUp(null);
            }
        } else {
            this.employeeCurrentForm.get('employeeNo').disable();
            this.enableEmployeeSearch = false;
        }
        self.eventEffectiveDate = res;
        this.postForm.patchValue({
            beneEffictDate: self.eventEffectiveDate
        });
    }

    /**
    * @method onUniversityApprovedLectecture
    * @description Function is called to check if university Approved Lecturer or not and changes acccording to it.
    * It is called from multiple dropdown change
    * @param eventVal In this is form control name is given
    */

    onUniversityApprovedLectecture(eventVal) {
        if (eventVal === 1) {
            this.postForm.get('uniAppLectType').setValue('');
            this.toastr.error('University Approved Lecturer Yes is mandatory for being eligible');
        } else {
            if (this.eventForm.get('casType').value === 312) {
                this.postForm.addControl('oriCertDate', new FormControl(''));
                this.postForm.addControl('oriCourAtte', new FormControl('', Validators.required));
                this.postForm.get('oriCourAtte').setValue(2);
                this.postForm.addControl('refCertDate', new FormControl(''));
                this.postForm.addControl('refCourAtte', new FormControl('', Validators.required));
                this.postForm.get('refCourAtte').setValue(2);
                if (this.eventDetails) {
                    this.postForm.patchValue({
                        oriCourAtte: this.eventDetails.oriCourAtte ? this.eventDetails.oriCourAtte : 0,
                        refCertDate: this.eventDetails.refCertDate ? new Date(this.eventDetails.refCertDate) : null,
                        refCourAtte: this.eventDetails.refCourAtte ? this.eventDetails.refCourAtte : 0,
                        oriCertDate: this.eventDetails.oriCertDate ? new Date(this.eventDetails.oriCertDate) : null,
                    });
                }
            } else if (this.eventForm.get('casType').value === 313) {
                if (this.eventDetails) {
                    this.postForm.patchValue({
                        oriCourAtte: this.eventDetails.oriCourAtte ? this.eventDetails.oriCourAtte : 0,
                        oriCertDate: this.eventDetails.oriCertDate ? new Date(this.eventDetails.oriCertDate) : null,
                    });
                }
            }
            // else {
            //     this.postForm.removeControl('oriCertDate');
            //     this.postForm.removeControl('oriCourAtte');
            //     this.postForm.removeControl('refCertDate');
            //     this.postForm.removeControl('refCourAtte');
            // }
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
                        if (this.eventForm.get('casType').value === 312 ||
                            this.eventForm.get('casType').value === 313) {
                            this.calculateSeventhBasicPay();
                        } else if (this.eventForm.get('casType').value === 314 ||
                            this.eventForm.get('casType').value === 315) {
                            this.calculateSeventhBasicPayForSelectionGrade3yr();
                        }
                    }
                    break;
            }
        }
    }

    /**
     * @method getCurrentEmpDetail
     * @description Function is called to get searched employee details
     */
    getCurrentEmpDetail() {
        const params: any = {},
            self = this;
        params['empNo'] = self.employeeCurrentForm.get('employeeNo').value;
        params['effectiveDate'] = self.eventForm.get('eventEffectiveDate').value;
        params['payCommission'] = self.payCommSelected;
        params['advSchType'] = self.eventForm.get('casType').value;
        params['isViewPage'] = this.action === 'view';
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
            params['effectiveDate'] = effDate;
        }
        this.eventService.getCurrentEmployeeDetails(params).subscribe(res => {
            if (res['status'] === 200 && res['result'] !== null) {
                self.employeeDetails = _.cloneDeep(res['result']);
                if (self.employeeDetails.employee) {
                    self.empId = self.employeeDetails.employee.empId;
                    self.employeeDetails.employee.employeeNo = this.employeeCurrentForm.get('employeeNo').value;
                    self.employeeDetails.employee.employeeId = self.employeeDetails.employee.empId;
                }
                if (self.employeeDetails) {
                    if (self.employeeDetails.exams) {
                        self.cccExamData = self.employeeDetails.exams.cccExams;
                        self.languageExamData = self.employeeDetails.exams.langExams;
                        self.departmentalExamData = self.employeeDetails.exams.deptExams;
                        self.masterExamsData = self.employeeDetails.exams.masterExams;

                        self.cccExamDataSource = new MatTableDataSource(self.cccExamData);
                        self.departmentalExamDataSource = new MatTableDataSource(self.departmentalExamData);
                        self.languageExamDataSource = new MatTableDataSource(self.languageExamData);
                        self.masterExamsDataSource = new MatTableDataSource(self.masterExamsData);
                    }
                }
                if (self.employeeDetails.employee) {
                    this.employeeCurrentForm.patchValue({
                        employeeName: this.employeeDetails.employee.employeeName,
                        className: this.employeeDetails.employee.className,
                        designationName: this.employeeDetails.employee.designationName,
                        officeName: this.employeeDetails.employee.officeName,
                        scaleName: this.employeeDetails.employee.scaleName,
                        payLevel: this.employeeDetails.employee.payLevel,
                        payBandName: this.employeeDetails.employee.payBandName,
                        payBandValue: this.employeeDetails.employee.payBandValue,
                        cellId: this.employeeDetails.employee.cellId,
                        gradePay: this.employeeDetails.employee.gradePay,
                        basicPay: this.employeeDetails.employee.empBasicPay,
                        dateJoining: this.employeeDetails.employee.dateJoining,
                        retirementDate: this.employeeDetails.employee.retirementDate,
                        dateNxtIncr: this.employeeDetails.employee.dateNxtIncr,
                        ssEffDate: this.employeeDetails.employee.ssEffDate,
                        sgEffDate: this.employeeDetails.employee.sgEffDate,
                        uniAppLectType: this.employeeDetails.employee.uniAppLectType,
                        oriCertDate: this.employeeDetails.employee.oriCertDate,
                        ssrefCertDate: this.employeeDetails.employee.ssrefCertDate,
                        sgrefCertDate: this.employeeDetails.employee.sgrefCertDate,
                        sgrefCertDate3yr: this.employeeDetails.employee.sgrefCertDate3yr,
                        sgEffDate3Yr: this.employeeDetails.employee.sgEffDate3Yr,

                    });
                    // tslint:disable-next-line:max-line-length
                    if (self.casType === 313) {
                        if (self.employeeDetails.employee.uniAppLectType) {
                            if (self.employeeDetails.employee.uniAppLectType.toLowerCase() === 'yes') {
                                this.postForm.get('uniAppLectType').setValue(2);
                                this.postForm.get('uniAppLectType').disable();
                            }
                        } else {
                            this.employeeCurrentForm.removeControl('uniAppLectType');
                        }
                        if (!(self.employeeDetails.employee.ssEffDate &&
                            this.employeeDetails.employee.ssrefCertDate)) {
                            self.employeeCurrentForm.removeControl('ssEffDate');
                            self.employeeCurrentForm.removeControl('ssrefCertDate');
                            self.employeeCurrentForm.removeControl('oriCertDate');
                        } else {
                            this.postForm.removeControl('oriCourAtte');
                            this.postForm.removeControl('oriCertDate');
                        }
                    }
                }
                self.checkForDateOfNxtIncr();
                self.setEmployeeInfo();
                self.onEmployeeEligible();
                self.eligible = true;
            } else {
                self.employeeDetails = null;
                self.eligible = false;
                this.postForm.disable();
                this.postForm.reset();
                this.postForm.get('beneEffictDate').patchValue(self.eventEffectiveDate);
                self.clearEmployeeDetails();
                self.toastr.error(res['message']);
            }
            self.employeeDetailChange.emit(self.employeeDetails);
        }, err => {
            self.employeeDetails = null;
            self.eligible = false;
            this.postForm.disable();
            this.postForm.reset();
            this.postForm.get('beneEffictDate').patchValue(self.eventEffectiveDate);
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
        params['data']['employeeId'] = self.employeeDetails.employee.empId;
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
            let dateJoining;
            if (this.employeeDetails.employee.dateNxtIncr.indexOf(' ') !== -1) {
                dateJoining = this.employeeDetails.employee.dateNxtIncr.split(' ')[0].split('-');
                params['data']['dateOfNextInc'] = dateJoining[1] + '/' + dateJoining[2] + '/' + dateJoining[0];
            } else if (this.employeeDetails.employee.dateNxtIncr.indexOf('T') !== -1) {
                dateJoining = this.employeeDetails.employee.dateNxtIncr.split('T')[0].split('-');
                params['data']['dateOfNextInc'] = dateJoining[1] + '/' + dateJoining[2] + '/' + dateJoining[0];
            }
        }
        this.eventService.checkDateNxtIncrCAS(params).subscribe(res => {
            if (res['status'] === 200 && res['result'] !== null) {
                self.daysCheckEligible = res['result'];
                if (res['result']) {
                    if (self.postForm.get('optionAvailableId')) {
                        self.postForm.get('optionAvailableId').disable();
                    }
                } else {
                    if (self.action !== 'view') {
                        if (self.postForm.get('optionAvailableId')) {
                            self.postForm.get('optionAvailableId').enable();
                        }
                    }
                }
                if (!self.eventDetails) {
                    if (self.postForm.get('optionAvailableId')) {
                        self.postForm.get('optionAvailableId').patchValue(1);
                    }
                } else {
                    if (self.postForm.get('optionAvailableId')) {
                        self.postForm.get('optionAvailableId').patchValue(self.eventDetails.optionAvailableId);
                    }
                }
                if (this.casType === 312 || this.casType === 313) {
                    self.setDateOfNxtIncr();
                }
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
                    designationId: null,
                    optionAvailableId: null,
                    optionAvailableDate: null,
                    basicPay: null,
                    dateOfNextIncrement: null,
                    beneEffictDate: null,
                });
                if (this.postForm.get('uniAppLectType')) {
                    this.postForm.get('uniAppLectType').patchValue(null);
                }
                if (this.postForm.get('oriCertDate')) {
                    this.postForm.get('oriCertDate').patchValue(null);
                }
                if (this.postForm.get('refCertDate')) {
                    this.postForm.get('refCertDate').patchValue(null);
                }
                this.clearPayDetails();
            }
        }
    }

    /**
     * @method setDateOfNxtIncr
     * @description Function is called to set date of next increment
     */
    setDateOfNxtIncr() {
        const eventDetail = this.eventForm.getRawValue(),
            payComm = eventDetail.payCommId;
        let optionAvail;
        if (this.postForm.get('optionAvailableId')) {
            optionAvail = this.postForm.get('optionAvailableId').value === 2;
        }
        // optionAvail = false;
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
                            if (this.casType !== 312 && this.casType !== 313) {
                                const currentBasic = Number(this.employeeDetails.employee.empBasicPay),
                                    postbasic = Number(this.postForm.get('basicPay').value);
                                if (postbasic && currentBasic !== postbasic) {
                                    this.postForm.patchValue({
                                        dateOfNextIncrement:
                                            new Date(doi.getFullYear() + 1, doi.getMonth(), doi.getDate())
                                    });
                                } else {
                                    this.postForm.patchValue({
                                        dateOfNextIncrement: doi
                                    });
                                }
                            } else {
                                this.postForm.patchValue({
                                    dateOfNextIncrement: new Date(doi.getFullYear() + 1, doi.getMonth(), doi.getDate())
                                });
                            }
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
                            if (this.casType !== 312 && this.casType !== 313) {
                                const currentBasicPay = Number(this.employeeDetails.employee.payBandValue),
                                    postBasicPay = Number(this.postForm.get('payBandValue').value);
                                if (postBasicPay && currentBasicPay !== postBasicPay) {
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
                            } else {
                                this.postForm.patchValue({
                                    dateOfNextIncrement: new Date(doi.getFullYear() + 1, 6, 1)
                                });
                            }
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
                            if (this.casType !== 312 && this.casType !== 313) {
                                const currentBasic = Number(this.employeeDetails.employee.empBasicPay),
                                    postbasic = Number(this.postForm.get('basicPay').value);
                                if (postbasic && currentBasic !== postbasic) {
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
                            } else {
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
                }
                break;
        }
        // this.postForm.get('dateOfNextIncrement').disable();
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
        if (this.employeeDetails && this.employeeDetails.employee.employeeNo && !this.eligible) {
            this.toastr.error('Employee is not eligible for CAS');

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
                this.toastr.error('Selected Employee is not eligible for CAS');
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

        if ((this.postForm.get('optionAvailableId')) && (this.postForm.get('optionAvailableId').value === 2)) {
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
        } else if (postValue.basicPay <= Number(employeeDetail.basicPay)) {
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
        this.resetFormEvent.emit();
    }

    /**
     * @method getPayMasters
     * @description Function is called to get all paymasters according to department category
     */
    getPayMasters() {
        const self = this,
            dataToSend = {
                request: {
                    departmentCategoryId: this.employeeDetails.employee.deptCategory,
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
    * @method onPayCommissionValueChange
    * @description Function is called when pay commission is changed
    * @param payCommissionId what pay commission is selected, that id is provided
    */
    onPayCommissionValueChange(payCommissionId) {
        // tslint:disable-next-line:max-line-length
        if (this.payCommSelected !== this.eventForm.get('payCommId').value && this.eventForm.get('payCommId').value && !this.employeeCurrentForm.controls.employeeNo.errors) {
            this.payCommSelected = this.eventForm.get('payCommId').value;
            if (this.casType) {
                this.enableEmployeeSearch = true;
                this.onEmployeeKeyUp(null);
            }
        }
        this.payCommSelected = payCommissionId;
        // this.setEmployeePayDetailsOnPayCommChange(payCommissionId);
        this.employeeCurrentForm.removeControl('payLevel');
        this.employeeCurrentForm.removeControl('cellId');
        this.employeeCurrentForm.removeControl('payBandName');
        this.employeeCurrentForm.removeControl('payBandValue');
        this.employeeCurrentForm.removeControl('gradePay');
        this.employeeCurrentForm.removeControl('scaleName');
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
                // tslint:disable-next-line:max-line-length
                this.employeeCurrentForm.addControl('scaleName', new FormControl({ value: null, disabled: true }, payScaleValue));
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
                this.postForm.addControl('payBandValue', new FormControl(payBandValue));
                this.postForm.addControl('gradePayId', new FormControl(gradePayId, Validators.required));
                // this.postForm.get('payBandValue').disable();
                this.employeeCurrentForm.addControl('payBandName', new FormControl(payBandId));
                this.employeeCurrentForm.addControl('payBandValue', new FormControl(payBandValue));
                this.employeeCurrentForm.addControl('gradePay', new FormControl(gradePayId));
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
                this.employeeCurrentForm.addControl('payLevel', new FormControl(payLevelId));
                this.employeeCurrentForm.addControl('cellId', new FormControl(cellId));
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
                        } else {
                            if (self.casType !== 312 && self.casType !== 313) {
                                this.setDateOfNxtIncr();
                            }
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
                    // if (currentPayScale !== 0) {
                    currentPayScale -= 1;
                    // }
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
                } // tslint:disable-next-line:max-line-length
                this.postForm.get('payBandValue').setValidators([Validators.min(setSelectedPayBand.startingValue), Validators.max(setSelectedPayBand.endValue)]);
                if (self.casType === 312 || self.casType === 313) {
                    this.calculateSixthBasicPay();
                } else {
                    if (setSelectedPayBand.startingValue > this.employeeDetails.employee.payBandValue) {
                        this.postForm.get('payBandValue').patchValue(setSelectedPayBand.startingValue);
                    } else {
                        this.postForm.get('payBandValue').patchValue(this.employeeDetails.employee.payBandValue);
                    }
                    this.setDateOfNxtIncr();
                }
                if (this.eventDetails) {
                    this.calculateSixthPayIncrement();
                }
            }
            if (gradePayData[0]) {
                let gradePayIndex = -1,
                    greaterValue = false;
                // tslint:disable-next-line:max-line-length
                for (let i = 0; i < gradePayData[0].gradePays.length; i++) {
                    const gradePay = gradePayData[0].gradePays[i];
                    if (Number(gradePay.gradePayValue) === Number(this.employeeDetails.employee.gradePay)) {
                        gradePayIndex = i;
                        break;
                    } else if (Number(gradePay.gradePayValue) >
                        Number(this.employeeDetails.employee.gradePay)) {
                        greaterValue = true;
                        gradePayIndex = i;
                        break;
                    }
                }
                if (gradePayIndex || gradePayIndex === 0) {
                    gradePayIndex = greaterValue ? gradePayIndex : (gradePayIndex + 1);
                    this.gradePayList = _.cloneDeep(gradePayData[0].gradePays.splice(gradePayIndex));
                }
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
        if (this.casType === 312 || this.casType === 313) {
            const self = this,
                params = {
                    'request': {
                        'oldPayBandValue': this.employeeDetails.employee.payBandValue,
                        'oldGradePay': this.employeeDetails.employee.gradePay,
                        'selectedPayBandId': this.postForm.get('payBandId').value,
                        'oldBasic': this.employeeDetails.employee.empBasicPay,
                        // tslint:disable-next-line:max-line-length
                        'optionalAvail': this.postForm.value.optionAvailableId && this.postForm.get('optionAvailableId').value === 2 ? 1 : 0
                    }
                };
            this.eventService.calcCasSixthBasic(params).subscribe(res => {
                if (res['result'] && res['status'] === 200) {
                    self.postForm.patchValue({
                        payBandValue: res['result']['payBandValue'],
                    });
                    if (self.postForm.get('gradePayId').value) {
                        self.calculateSixthBasicPayOnGrade();
                    }
                }
            });
        } else {

            if (this.postForm.get('gradePayId').value) {
                this.calculateSixthBasicPayOnGrade();
            }
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
        if (this.employeeDetails && this.employeeDetails.employee &&
            Number(this.previousEmployeeNo) !== Number(this.employeeDetails.employee.employeeNo)) {
            this.previousEmployeeNo = Number(this.employeeDetails.employee.employeeNo);
            this.postForm.get('payLevelId').patchValue(null);
            this.postForm.get('cellId').patchValue(null);
        } else if (this.eventDetails) {
            if (this.eventDetails.payLevelId) {
                this.postForm.get('payLevelId').patchValue(this.eventDetails.payLevelId);
            }
            if (this.eventDetails.cellId) {
                this.postForm.get('cellId').patchValue(this.eventDetails.cellId);
            }
            this.onPayLevelChange();
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
                if (this.eventForm.get('casType').value === 312 || this.eventForm.get('casType').value === 313) {
                    this.calculateSeventhBasicPay();
                } else if (this.eventForm.get('casType').value === 314 || this.eventForm.get('casType').value === 315) {
                    this.calculateSeventhBasicPayForSelectionGrade3yr();
                }
            }
        }
    }

    /**
     * @method calculateSeventhBasicPay for Senior Scale & Selection Grade
     * @description Function is called to assign cell id and basic pay from server when pay level is changed
     */
    calculateSeventhBasicPay() {
        const self = this,
            params = {
                'request': {
                    'oldPayLevelId': this.employeeDetails.employee.payLevelId,
                    'oldCellValue': this.employeeDetails.employee.empBasicPay,
                    'payLevelId': this.postForm.get('payLevelId').value,
                    'optionalAvail': this.postForm.get('optionAvailableId') ? 1 : 0
                }
            };
        this.eventService.calcCasSeventhBasic(params).subscribe(res => {
            if (res['result'] && res['status'] === 200) {
                self.postForm.patchValue({
                    cellId: res['result']['id'],
                    basicPay: res['result']['cellValue']
                });
            }
        });
    }

    /**
     * @method calculateSeventhBasicPay for Selection Grade(3 years) - 1 & Selection Grade (3 years) - 2
     * @description Function is called to assign cell id and basic pay from server when pay level is changed
     */
    calculateSeventhBasicPayForSelectionGrade3yr() {
        const self = this,
            params = {
                'request': {
                    'oldPayLevelId': this.employeeDetails.employee.payLevelId,
                    'oldCellValue': this.employeeDetails.employee.empBasicPay,
                    'payLevelId': this.postForm.get('payLevelId').value,
                    'optionalAvail': 0
                }
            };
        this.pvuCommonService.calcSeventhBasicPVU(params).subscribe(res => {
            if (res['result'] && res['status'] === 200) {
                self.postForm.patchValue({
                    cellId: res['result']['cellId'],
                    basicPay: res['result']['basicPay']
                });
                this.setDateOfNxtIncr();
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
                designationId: this.eventDetails.designationId,
                basicPay: self.eventDetails.basicPay
            });
            this.setCASData();
        }
        if (this.eventForm && this.eventForm.get('casType') && this.eventForm.get('casType').value && this.postForm) {
            self.onCasTypeChange(this.eventForm.get('casType').value);
        }
        // }
        // tslint:disable-next-line:max-line-length
        if (this.employeeDetails && this.eventForm && this.eventForm.get('payCommId') && this.eventForm.get('payCommId').value && this.payMasterData && this.payMasterData.data) {
            this.setCommList(this.eventForm.get('payCommId').value);
        }
        if (this.employeeCurrentForm && this.eventDetails && this.eventDetails.employeeNo) {
            this.employeeCurrentForm.get('employeeNo').patchValue(this.eventDetails.employeeNo);
            if (!this.eventForm.get('eventEffectiveDate').errors) {
                this.getCurrentEmpDetail();
            }
        }
        if (this.lookupData) {
            this.optionAvailedList = _.cloneDeep(this.lookupData['ConditionCheck']);
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
    * @method clearPostForm
    * @description Function is called to get clear PostForm details
    */
    clearPostForm() {
        const self = this;
        self.postForm.patchValue({
            basicPay: '',
            dateOfNextIncrement: '',
            beneEffictDate: ''
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
                    this.postForm.get('payScale').patchValue('');
                    // this.postForm.get('payScaleName').patchValue('');
                    // 5 comm
                    break;
                case 151:
                    // tslint:disable-next-line:max-line-length
                    this.postForm.get('payBandId').patchValue('');
                    // tslint:disable-next-line:max-line-length
                    this.postForm.get('payBandValue').patchValue('');
                    // tslint:disable-next-line:max-line-length
                    this.postForm.get('gradePayId').patchValue('');
                    break;
                case 152:
                    // tslint:disable-next-line:max-line-length
                    this.postForm.get('payLevelId').patchValue('');
                    // tslint:disable-next-line:max-line-length
                    this.postForm.get('cellId').patchValue('');
            }
        }
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
        this.masterExamsDataSource = new MatTableDataSource([]);
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
        this.employeeCurrentForm.removeControl('payBandName');
        this.employeeCurrentForm.removeControl('payBandValue');
        this.employeeCurrentForm.removeControl('gradePay');


        // this.postForm.get('basicPay').setValue('');
        // this.postForm.get('basicPay').setValidators([Validators.required]);
        // this.postForm.get('basicPay').updateValueAndValidity();
        // if (this.postForm.get('dateOfNextIncrement')) {
        //     this.postForm.get('dateOfNextIncrement').setValue('');
        // }
        // this.enableBasicPayEdit = true;
        // // this.employeeCurrentForm.removeControl('scale');

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
                this.enableBasicPayEdit = false;
                this.employeeCurrentForm.addControl('scaleName',
                    new FormControl({ value: null, disabled: true }, payScaleValue));
                // 5 comm
                break;
            case 151:
                let payBandId = null,
                    payBandValue = null,
                    gradePayId = null;
                if (this.employeeDetails && this.employeeDetails.employee) {
                    if (this.employeeDetails.employee.payBandId) {
                        payBandId = this.employeeDetails.employee.payBandName;
                    }
                    if (this.employeeDetails.employee.payBandValue) {
                        payBandValue = this.employeeDetails.employee.payBandValue;
                    }
                    if (this.employeeDetails.employee.gradePayId) {
                        gradePayId = this.employeeDetails.employee.gradePay;
                    }
                }
                this.employeeCurrentForm.addControl('payBandName', new FormControl(payBandId));
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
                        payLevelId = this.employeeDetails.employee.payLevel;
                    }
                    if (this.employeeDetails.employee.cellId) {
                        cellId = this.employeeDetails.employee.cell;
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
                // employeeNo: this.employeeDetails.employee.employeeNo,
                empId: this.employeeDetails.employee.empId,
                employeeName: this.employeeDetails.employee.employeeName,
                className: this.employeeDetails.employee.className,
                designationName: this.employeeDetails.employee.designationName,
                basicPay: this.employeeDetails.employee.empBasicPay,

            });
            // tslint:disable-next-line:max-line-length
            if (this.employeeDetails.employee.dateJoining && !(this.employeeDetails.employee.dateJoining instanceof Date)) {
                let dateJoining;
                if (this.employeeDetails.employee.dateJoining.indexOf(' ') !== -1) {
                    dateJoining = this.employeeDetails.employee.dateJoining.split(' ')[0].split('-');
                    this.employeeCurrentForm.patchValue({
                        dateJoining: dateJoining[2] + '/' + dateJoining[1] + '/' + dateJoining[0]
                    });
                } else if (this.employeeDetails.employee.dateJoining.indexOf('T') !== -1) {
                    dateJoining = this.employeeDetails.employee.dateJoining.split('T')[0].split('-');
                    this.employeeCurrentForm.patchValue({
                        dateJoining: dateJoining[2] + '/' + dateJoining[1] + '/' + dateJoining[0]
                    });
                }
            }
            // tslint:disable-next-line:max-line-length
            if (this.employeeDetails.employee.retirementDate && !(this.employeeDetails.employee.retirementDate instanceof Date)) {
                let dateJoining;
                if (this.employeeDetails.employee.retirementDate.indexOf(' ') !== -1) {
                    dateJoining = this.employeeDetails.employee.retirementDate.split(' ')[0].split('-');
                    this.employeeCurrentForm.patchValue({
                        retirementDate: dateJoining[2] + '/' + dateJoining[1] + '/' + dateJoining[0]
                    });
                } else if (this.employeeDetails.employee.retirementDate.indexOf('T') !== -1) {
                    dateJoining = this.employeeDetails.employee.retirementDate.split('T')[0].split('-');
                    this.employeeCurrentForm.patchValue({
                        retirementDate: dateJoining[2] + '/' + dateJoining[1] + '/' + dateJoining[0]
                    });
                }
            }
            // tslint:disable-next-line:max-line-length
            if (this.employeeDetails.employee.dateNxtIncr && !(this.employeeDetails.employee.dateNxtIncr instanceof Date)) {
                let dateJoining;
                if (this.employeeDetails.employee.dateNxtIncr.indexOf(' ') !== -1) {
                    dateJoining = this.employeeDetails.employee.dateNxtIncr.split(' ')[0].split('-');
                    this.employeeCurrentForm.patchValue({
                        dateNxtIncr: dateJoining[2] + '/' + dateJoining[1] + '/' + dateJoining[0]
                    });
                } else if (this.employeeDetails.employee.dateNxtIncr.indexOf('T') !== -1) {
                    dateJoining = this.employeeDetails.employee.dateNxtIncr.split('T')[0].split('-');
                    this.employeeCurrentForm.patchValue({
                        dateNxtIncr: dateJoining[2] + '/' + dateJoining[1] + '/' + dateJoining[0]
                    });
                }
            }
            // tslint:disable-next-line:max-line-length
            if (this.employeeDetails.employee.ssrefCertDate && !(this.employeeDetails.employee.ssrefCertDate instanceof Date)) {
                let dateJoining;
                if (this.employeeDetails.employee.ssrefCertDate.indexOf(' ') !== -1) {
                    dateJoining = this.employeeDetails.employee.ssrefCertDate.split(' ')[0].split('-');
                    this.employeeCurrentForm.patchValue({
                        ssrefCertDate: dateJoining[2] + '/' + dateJoining[1] + '/' + dateJoining[0]
                    });
                } else if (this.employeeDetails.employee.ssrefCertDate.indexOf('T') !== -1) {
                    dateJoining = this.employeeDetails.employee.ssrefCertDate.split('T')[0].split('-');
                    this.employeeCurrentForm.patchValue({
                        ssrefCertDate: dateJoining[2] + '/' + dateJoining[1] + '/' + dateJoining[0]
                    });
                }
            }
            // tslint:disable-next-line:max-line-length
            if (this.employeeDetails.employee.sgrefCertDate && !(this.employeeDetails.employee.sgrefCertDate instanceof Date)) {
                let dateJoining;
                if (this.employeeDetails.employee.sgrefCertDate.indexOf(' ') !== -1) {
                    dateJoining = this.employeeDetails.employee.sgrefCertDate.split(' ')[0].split('-');
                    this.employeeCurrentForm.patchValue({
                        sgrefCertDate: dateJoining[2] + '/' + dateJoining[1] + '/' + dateJoining[0]
                    });
                } else if (this.employeeDetails.employee.sgrefCertDate.indexOf('T') !== -1) {
                    dateJoining = this.employeeDetails.employee.sgrefCertDate.split('T')[0].split('-');
                    this.employeeCurrentForm.patchValue({
                        sgrefCertDate: dateJoining[2] + '/' + dateJoining[1] + '/' + dateJoining[0]
                    });
                }
            }
            // tslint:disable-next-line:max-line-length
            if (this.employeeDetails.employee.sgrefCertDate3yr && !(this.employeeDetails.employee.sgrefCertDate3yr instanceof Date)) {
                let dateJoining;
                if (this.employeeDetails.employee.sgrefCertDate3yr.indexOf(' ') !== -1) {
                    dateJoining = this.employeeDetails.employee.sgrefCertDate3yr.split(' ')[0].split('-');
                    this.employeeCurrentForm.patchValue({
                        sgrefCertDate3yr: dateJoining[2] + '/' + dateJoining[1] + '/' + dateJoining[0]
                    });
                } else if (this.employeeDetails.employee.sgrefCertDate3yr.indexOf('T') !== -1) {
                    dateJoining = this.employeeDetails.employee.sgrefCertDate3yr.split('T')[0].split('-');
                    this.employeeCurrentForm.patchValue({
                        sgrefCertDate3yr: dateJoining[2] + '/' + dateJoining[1] + '/' + dateJoining[0]
                    });
                }
            }
            // tslint:disable-next-line:max-line-length
            if (this.employeeDetails.employee.oriCertDate && !(this.employeeDetails.employee.oriCertDate instanceof Date)) {
                let dateJoining;
                if (this.employeeDetails.employee.oriCertDate.indexOf(' ') !== -1) {
                    dateJoining = this.employeeDetails.employee.oriCertDate.split(' ')[0].split('-');
                    this.employeeCurrentForm.patchValue({
                        oriCertDate: dateJoining[2] + '/' + dateJoining[1] + '/' + dateJoining[0]
                    });
                } else if (this.employeeDetails.employee.oriCertDate.indexOf('T') !== -1) {
                    dateJoining = this.employeeDetails.employee.oriCertDate.split('T')[0].split('-');
                    this.employeeCurrentForm.patchValue({
                        oriCertDate: dateJoining[2] + '/' + dateJoining[1] + '/' + dateJoining[0]
                    });
                }
            }
            // tslint:disable-next-line: max-line-length
            if (this.employeeDetails.employee.ssEffDate && !(this.employeeDetails.employee.ssEffDate instanceof Date)) {
                let dateJoining;
                if (this.employeeDetails.employee.ssEffDate.indexOf(' ') !== -1) {
                    dateJoining = this.employeeDetails.employee.ssEffDate.split(' ')[0].split('-');
                    this.employeeCurrentForm.patchValue({
                        ssEffDate: dateJoining[2] + '/' + dateJoining[1] + '/' + dateJoining[0]
                    });
                } else if (this.employeeDetails.employee.ssEffDate.indexOf('T') !== -1) {
                    dateJoining = this.employeeDetails.employee.ssEffDate.split('T')[0].split('-');
                    this.employeeCurrentForm.patchValue({
                        ssEffDate: dateJoining[2] + '/' + dateJoining[1] + '/' + dateJoining[0]
                    });
                }
            }
            // tslint:disable-next-line:max-line-length
            if (this.employeeDetails.employee.sgEffDate && !(this.employeeDetails.employee.sgEffDate instanceof Date)) {
                let dateJoining;
                if (this.employeeDetails.employee.sgEffDate.indexOf(' ') !== -1) {
                    dateJoining = this.employeeDetails.employee.sgEffDate.split(' ')[0].split('-');
                    this.employeeCurrentForm.patchValue({
                        sgEffDate: dateJoining[2] + '/' + dateJoining[1] + '/' + dateJoining[0]
                    });
                } else if (this.employeeDetails.employee.sgEffDate.indexOf('T') !== -1) {
                    dateJoining = this.employeeDetails.employee.sgEffDate.split('T')[0].split('-');
                    this.employeeCurrentForm.patchValue({
                        sgEffDate: dateJoining[2] + '/' + dateJoining[1] + '/' + dateJoining[0]
                    });
                }
            }
            // tslint:disable-next-line:max-line-length
            if (this.employeeDetails.employee.sgEffDate3Yr && !(this.employeeDetails.employee.sgEffDate3Yr instanceof Date)) {
                let dateJoining;
                if (this.employeeDetails.employee.sgEffDate3Yr.indexOf(' ') !== -1) {
                    dateJoining = this.employeeDetails.employee.sgEffDate3Yr.split(' ')[0].split('-');
                    this.employeeCurrentForm.patchValue({
                        sgEffDate3Yr: dateJoining[2] + '/' + dateJoining[1] + '/' + dateJoining[0]
                    });
                } else if (this.employeeDetails.employee.sgEffDate3Yr.indexOf('T') !== -1) {
                    dateJoining = this.employeeDetails.employee.sgEffDate3Yr.split('T')[0].split('-');
                    this.employeeCurrentForm.patchValue({
                        sgEffDate3Yr: dateJoining[2] + '/' + dateJoining[1] + '/' + dateJoining[0]
                    });
                }
            }
            switch (this.casType) {
                case 312:
                    this.minRefDate = new Date(this.employeeDetails.employee.dateJoining);
                    this.maxRefDate = this.eventForm.get('eventEffectiveDate').value;
                    break;
                case 313:
                    // tslint:disable-next-line:max-line-length
                    this.minRefDate = this.employeeDetails.employee.ssEffDate ? new Date(this.employeeDetails.employee.ssEffDate) : new Date(this.employeeDetails.employee.dateJoining);
                    this.maxRefDate = this.eventForm.get('eventEffectiveDate').value;
                    break;
                case 314:
                    this.minRefDate = new Date(this.employeeDetails.employee.sgEffDate);
                    this.maxRefDate = this.eventForm.get('eventEffectiveDate').value;
                    break;
            }
        } else {
            this.employeeCurrentForm.patchValue({
                employeeName: null,
                className: null,
                empId: null,
                designationName: null,
                basicPay: null,
                dateJoining: null,
                retirementDate: null,
                officeName: null,
                dateNxtIncr: null
            });
            if (this.employeeCurrentForm.get('uniAppLectType')) {
                this.employeeCurrentForm.get('uniAppLectType').patchValue(null);
            }
            if (this.employeeCurrentForm.get('oriCertDate')) {
                this.employeeCurrentForm.get('oriCertDate').patchValue(null);
            }
            if (this.employeeCurrentForm.get('ssrefCertDate')) {
                this.employeeCurrentForm.get('ssrefCertDate').patchValue(null);
            }
            if (this.employeeCurrentForm.get('ssEffDate')) {
                this.employeeCurrentForm.get('ssEffDate').patchValue(null);
            }
            if (this.employeeCurrentForm.get('sgEffDate')) {
                this.employeeCurrentForm.get('sgEffDate').patchValue(null);
            }
            if (this.employeeCurrentForm.get('sgrefCertDate')) {
                this.employeeCurrentForm.get('sgrefCertDate').patchValue(null);
            }
            if (this.employeeCurrentForm.get('sgEffDate3Yr')) {
                this.employeeCurrentForm.get('sgEffDate3Yr').patchValue(null);
            }
            if (this.employeeCurrentForm.get('sgrefCertDate3yr')) {
                this.employeeCurrentForm.get('sgrefCertDate3yr').patchValue(null);
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
        if (empNo && String(empNo).length === 10) {
            if (event) {
                if (event['keyCode'] === 13 || event['keyCode'] === 9) {
                    event.preventDefault();
                    event.stopPropagation();
                    if (!this.eventForm.get('eventEffectiveDate').errors) {
                        self.getCurrentEmpDetail();
                    } else {
                        this.eventForm.get('eventEffectiveDate').markAsTouched({ onlySelf: true });
                    }
                }
            } else {
                if (!this.eventForm.get('eventEffectiveDate').errors) {
                    self.getCurrentEmpDetail();
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
            // tslint:disable-next-line: no-use-before-declare
            // tslint:disable-next-line:max-line-length
            if ((this.eventDetails && this.eventDetails.statusId !== 205 && this.eventDetails.statusId !== 0) || this.action === 'view') {
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
                            self.getCurrentEmpDetail();
                        }
                    }
                });
            } else {
                if (!this.eventForm.get('eventEffectiveDate').errors) {
                    this.getCurrentEmpDetail();
                }
            }
        }
    }

    /**
     * @method refCourseSelect
     * @description Method called on Refresher Course Attended
     * @param eventVal value selected
     */
    refCourseSelect(eventVal) {
        if (eventVal === 1) {
            this.postForm.get('refCourAtte').setValue('');
            this.toastr.error('Refresher Course should be attended for being eligible');
        }
    }

    /**
     * @method oriCourSelect
     * @description Method called on Orientation Course Attended
     * @param eventVal value selected
     */
    oriCourSelect(eventVal) {
        if (eventVal === 1) {
            this.postForm.get('oriCourAtte').setValue('');
            this.toastr.error('Orientation Course Yes is mandatory for being eligible');
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
     * @method clearExmDetails
     * @description Method called to clear exam details
     */
    clearExmDetails() {
        this.departmentalExamDataSource = new MatTableDataSource([]);
        this.languageExamDataSource = new MatTableDataSource([]);
        this.cccExamDataSource = new MatTableDataSource([]);
        this.masterExamsDataSource = new MatTableDataSource([]);
    }
}
