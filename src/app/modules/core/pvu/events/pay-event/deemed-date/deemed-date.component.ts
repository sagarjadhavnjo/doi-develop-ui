import { SearchEmployeeComponent } from './../../../pvu-common/search-employee/search-employee.component';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { EventsService } from './../services/events.service';
import { merge, Subscription } from 'rxjs';
import { EVENT_ERRORS } from './../index';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Component, OnInit, Input, OnDestroy, OnChanges, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'app-deemed-date',
    templateUrl: './deemed-date.component.html',
    styleUrls: ['./deemed-date.component.css']
})
export class DeemedDateComponent implements OnInit, OnChanges, OnDestroy {
    @Input() eventForm: FormGroup;
    @Input() action: string;
    @Input() eventType: string;
    @Input() eventDetails: any;
    @Input() lookUpData: any;
    @Output() saveEvent: EventEmitter<any> = new EventEmitter();
    @Output() resetEvent: EventEmitter<any> = new EventEmitter();
    @Output() employeeDetailChange: EventEmitter<any> = new EventEmitter();
    showExamDetails: boolean = false;
    employeeDetails: any = {};
    payMasterData: any;
    classCtrl: FormControl = new FormControl();
    classList: any;
    designationCtrl: FormControl = new FormControl();
    designationList;
    optionAvailedCtrl: FormControl = new FormControl();
    optionAvailedList;
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
    employeeTitle: string = 'Current Details of Senior Employee';
    scaleList = [];
    notionalForm: FormGroup;
    postForm: FormGroup;
    deemedJnrEmp: FormGroup;
    empId: number;
    subscriber: Subscription[] = [];
    errorMessage = EVENT_ERRORS;
    deemedEmpId: number;
    deemedEmployeeDetails: any;
    eventEffectiveDate: Date;
    deemToMinDate: Date;
    defaultClassList: any = [];
    eligible: boolean = false;
    optionMinDate: Date;
    seniorEmployeeSelected = false;
    startDateLesser = false;
    isFifth: boolean = false;
    currentPayscaleSelected: any = [];
    fifthMin: number = 0;
    fifthMax: number = 0;
    clearEmployeeCurrentDetails = false;
    todayDate: Date;
    previousEmployeeNo;
    loader: boolean = false;
    isJudiciaryDepartment: boolean = false;
    optionValid: boolean = false;
    dataSource = new MatTableDataSource<any>([]);
    examFooterColumns = ['examName'];
    examColumns = ['examName', 'examBody', 'examPassingDate', 'examStatus'];
    examColumns2 = ['examName', 'examBody', 'examPassingDate', 'examStatus', 'examBasic'];
    optionAvailedData: any;
    public columnsToDisplay: any = [];
    displayedColumns = [];
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
        self.title = 'Deemed Date Changes';
        self.getLookUpData();
        self.getDesignations();
        if (this.eventForm.get('payCommId').value) {
            self.onPayCommissionValueChange(this.eventForm.get('payCommId').value);
        }
        if (this.eventForm.get('eventEffectiveDate').value) {
            self.onEventEffectiveDateChange(this.eventForm.get('eventEffectiveDate').value);
        }
        this.subscriber.push(this.eventForm.get('payCommId').valueChanges.subscribe(res => {
            self.onPayCommissionValueChange(res);
        }));
        this.subscriber.push(this.eventForm.get('eventEffectiveDate').valueChanges.subscribe(res => {
            self.onEventEffectiveDateChange(res);
        }));
        if (self.action === 'view') {
            this.postForm.disable();
        }
        // this.postForm.get('benefitEffectiveDate').disable();

        this.postForm.get('optionAvailableId').valueChanges.subscribe(res => {
            if (res === 2) {
                this.optionValid = true;
            } else if (res === 1) {
                this.optionValid = false;
            }
        });
        merge(
            this.eventForm.get('payCommId').valueChanges,
            this.eventForm.get('eventCode').valueChanges,
            this.postForm.get('optionAvailableId').valueChanges,
            this.postForm.get('optionAvailableDate').valueChanges,

        ).subscribe(
            res => {
                if (this.eventForm.get('eventCode').value === 'Deemed_Date' &&
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
            benefitEffectiveDate: self.eventEffectiveDate
        });
        self.deemToMinDate = self.eventEffectiveDate;
    }

    /**
     * @method getLookUpData
     * @description Function is called to get all constant data from server
     */
    getLookUpData() {
        const self = this;
        // tslint:disable-next-line:max-line-length
        this.subscriber.push(this.eventService.getLookUp('Deemed_Date').subscribe(res => {
            if (res['status'] === 200 && res['result']) {
                self.lookUpData = _.cloneDeep(res['result']);
                if (self.lookUpData) {
                    self.defaultClassList = self.lookUpData.Dept_Class;
                    self.optionAvailedList = self.lookUpData.ConditionCheck;
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
            this.eventForm.removeControl('notionalForm');
            this.eventForm.removeControl('deemedJnrEmp');
            this.eventForm.addControl('postForm', self.fb.group({
                employeeClassId: [''],
                designationId: [''],
                benefitEffectiveDate: [''],
                optionAvailableId: ['', Validators.required],
                optionAvailableDate: [''],
                basicPay: [''],
                dateOfNextIncrement: [''],
                srSeniorNo: ['', Validators.required],
                jrSeniorNo: ['', Validators.required],
            }));
            this.eventForm.addControl('notionalForm', self.fb.group({
                deemedDate: [''],
                actualDatePromo: [''],
                duration: ['']
            }));
            self.eventForm.addControl('deemedJnrEmp', this.fb.group({
                employeeNumber: null,
                name: null,
                class: null,
                designation: null,
                basicPay: null,
                doj: null,
                dor: null,
                officeName: null,
                dateOfNextIncrement: null,
                againstEmployeeId: null
            }));
        } else {
            this.eventForm = self.fb.group({
                postForm: self.fb.group({
                    employeeClassId: [''],
                    designationId: [''],
                    benefitEffectiveDate: [''],
                    optionAvailableId: ['', Validators.required],
                    optionAvailableDate: [''],
                    basicPay: [''],
                    dateOfNextIncrement: [''],
                    srSeniorNo: ['', Validators.required],
                    jrSeniorNo: ['', Validators.required],
                }),
                notionalForm: self.fb.group({
                    deemedDate: [''],
                    actualDatePromo: [''],
                    duration: ['']
                }),
                deemedJnrEmp: self.fb.group({
                    employeeNumber: null,
                    name: null,
                    class: null,
                    designation: null,
                    basicPay: null,
                    doj: null,
                    dor: null,
                    officeName: null,
                    dateOfNextIncrement: null,
                    againstEmployeeId: null
                })
            });
        }
        this.postForm = this.eventForm.get('postForm') as FormGroup;
        this.deemedJnrEmp = this.eventForm.get('deemedJnrEmp') as FormGroup;
        this.notionalForm = this.eventForm.get('notionalForm') as FormGroup;
        this.postForm = this.eventForm.get('postForm') as FormGroup;
        if (self.eventDetails && this.postForm) {
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
     * as he is applicable for deemed date or not
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
                dateToSend += '' + (effDate.getMonth() + 1);
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
                        self.postForm.get('optionAvailableId').patchValue(self.eventDetails.optionAvailableId);
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
        if (this.action !== 'view') {
            this.postForm.enable();
        } else {
            this.postForm.disable();
        }
        if (this.postForm.get('cellId')) {
            this.postForm.get('cellId').disable();
            this.postForm.get('payLevelId').disable();
        }
        if (this.postForm.get('payBandId')) {
            this.postForm.get('payBandId').disable();
            this.postForm.get('gradePayId').disable();
        }
        if (this.postForm.get('payScale')) {
            this.postForm.get('payScale').disable();
        }
        // this.postForm.get('dateOfNextIncrement').disable();
        this.clearEmployeeCurrentDetails = false;
        if (this.employeeDetails && this.employeeDetails.employee) {
            if (this.employeeDetails.employee.departmentCategoryId === 17) {
                this.isJudiciaryDepartment = true;
            } else {
                this.isJudiciaryDepartment = false;
            }
            this.seniorEmployeeSelected = true;
            const demedJnrEmpno = this.deemedJnrEmp.get('employeeNumber').value;
            if (demedJnrEmpno && this.employeeDetails.employee.employeeNo === demedJnrEmpno) {
                this.toastr.error('Senior Employee no and Junior employee no cannot be same!');
                this.clearDeemedJnrEmployeeDetails();
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
            this.checkForEligibility();
        } else {
            this.seniorEmployeeSelected = false;
            this.clearDeemedJnrEmployeeDetails();
        }
        if (this.employeeDetails && this.employeeDetails.employee) {
            this.getPayMasters();
        } else {
            this.postForm.reset();
        }
        if (this.defaultClassList && this.defaultClassList.length > 0) {
            this.changeClassList();
        }
        this.employeeDetailChange.emit(empl);
    }

    /**
     * @method changeClassList
     * @description Function is called to assign class list which classes will be shown in dropdown
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
     * @method getStatus
     * @description Function is called to get status if this post details can be save or submit
     * @returns boolean value for status
     */
    getStatus() {
        if (this.postForm.invalid || !this.deemedJnrEmp.get('employeeNumber').value || this.notionalForm.invalid) {
            _.each(this.postForm.controls, control => {
                if (control.status === 'INVALID') {
                    control.markAsTouched({ onlySelf: true });
                }
            });
            _.each(this.notionalForm.controls, controlN => {
                if (controlN.status === 'INVALID') {
                    controlN.markAsTouched({ onlySelf: true });
                }
            });
            if (!this.deemedJnrEmp.get('employeeNumber').value) {
                this.toastr.error('Please enter Deemed Date against Junior Employee');
            }
            return false;
        } else {
            if (!this.checkForPayChange() || this.startDateLesser) {
                if (!this.checkForPayChange()) {
                    this.toastr.error('Please change Pay');
                }
                if (this.startDateLesser) {
                    this.toastr.error('Please change start date');
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
     * @method saveDetails
     * @description Function is called when save as draft is clicked and it further emits so event details can be saved
     */
    saveDetails() {
        this.saveEvent.emit(this.optionAvailedData);
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
     * @method setEventPostData
     * @description Function is called when we recieve saved event details
     */
    setEventPostData() {
        const self = this;
        self.notionalForm.patchValue({
            'deemedDate': self.eventDetails.deemedDate,
            'actualDatePromo': self.eventDetails.actualDatePromo,
            'duration': self.eventDetails.duration,
        });
        if (self.eventDetails.deemedDate) {
            this.deemToMinDate = new Date(self.eventDetails.deemedDate);
            this.deemToMinDate.setHours(0, 0, 0, 0);
        }
        if (self.eventDetails.againstEmployeeNo) {
            self.deemedJnrEmp.patchValue({
                'employeeNumber': self.eventDetails.againstEmployeeNo,
                'againstEmployeeId': self.eventDetails.againstEmployeeId
            });
            self.getEmployeeDetail();
        }
        self.postForm.patchValue({
            employeeClassId: self.eventDetails.employeeClassId ? self.eventDetails.employeeClassId : null,
            designationId: self.eventDetails.designationId ? self.eventDetails.designationId : null,
            optionAvailableId: self.eventDetails.optionAvailableId ? self.eventDetails.optionAvailableId : null,
            basicPay: self.eventDetails.basicPay ? self.eventDetails.basicPay : null,
            srSeniorNo: self.eventDetails.srSeniorNo ? self.eventDetails.srSeniorNo : null,
            jrSeniorNo: self.eventDetails.jrSeniorNo ? self.eventDetails.jrSeniorNo : null
        });
        let date;
        if (self.eventDetails.benefitEffectiveDate) {
            date = self.eventDetails.benefitEffectiveDate.split('-');
            date = new Date(date[0], Number(date[1]) - 1, date[2]);
            self.postForm.patchValue({
                benefitEffectiveDate: date
            });
        }
        if (self.eventDetails.optionAvailableDate) {
            date = self.eventDetails.optionAvailableDate.split('-');
            date = new Date(date[0], Number(date[1]) - 1, date[2]);
            self.postForm.patchValue({
                optionAvailableDate: date
            });
        }
        if (self.eventDetails.dateOfNextIncrement) {
            date = self.eventDetails.dateOfNextIncrement.split('-');
            date = new Date(date[0], Number(date[1]) - 1, date[2]);
            self.postForm.patchValue({
                dateOfNextIncrement: date
            });
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
        this.postForm.get('basicPay').setValidators(null);
        this.postForm.get('basicPay').updateValueAndValidity();
        this.isFifth = false;
        if (this.deemedJnrEmp) {
            this.deemedJnrEmp.removeControl('payLevelId');
            this.deemedJnrEmp.removeControl('cellId');
            this.deemedJnrEmp.removeControl('payBandValue');
            this.deemedJnrEmp.removeControl('payBandId');
            this.deemedJnrEmp.removeControl('payScale');
            this.deemedJnrEmp.removeControl('gradePayId');
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
                if (this.deemedJnrEmp) {
                    this.deemedJnrEmp.addControl('payScale', new FormControl(null));
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
                if (this.deemedJnrEmp) {
                    this.deemedJnrEmp.addControl('payBandId', new FormControl(null));
                    this.deemedJnrEmp.addControl('payBandValue', new FormControl(null));
                    this.deemedJnrEmp.addControl('gradePayId', new FormControl(null));
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
                if (this.eventDetails) {
                    if (this.eventDetails.payLevelId) {
                        payLevelId = this.eventDetails.payLevelId;
                    }
                    if (this.eventDetails.cellId) {
                        cellId = this.eventDetails.cellId;
                    }
                }
                if (this.deemedJnrEmp) {
                    this.deemedJnrEmp.addControl('payLevelId', new FormControl(null));
                    this.deemedJnrEmp.addControl('cellId', new FormControl(null));
                }
                this.postForm.addControl('payLevelId', new FormControl(payLevelId, Validators.required));
                this.postForm.addControl('cellId', new FormControl(cellId, Validators.required));
                this.postForm.get('cellId').disable();
                break;
        }
        if (this.employeeDetails && this.payMasterData && this.payMasterData.data) {
            this.setCommList(payCommissionId);
        }
        if (this.deemedJnrEmp.get('employeeNumber').value) {
            this.onEmployeeKeyUp();
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
            // if (this.employeeDetails.employee.payScale) {
            //     let currentPayScale = 0;
            //     scaleList.forEach((payScale, index) => {
            //         if (payScale.id === Number(this.employeeDetails.employee.payScale)) {
            //             currentPayScale = index;
            //         }
            //     });
            //     if (currentPayScale || currentPayScale === 0) {
            this.scaleList = _.cloneDeep(scaleList);
            //     }
            // }
            if (this.postForm.get('payScale').value) {
                this.setFifthBasicParams();
            }
            // tslint:disable-next-line:max-line-length
            if (this.employeeDetails && this.employeeDetails.employee && Number(this.previousEmployeeNo) !== Number(this.employeeDetails.employee.employeeNo)) {
                this.previousEmployeeNo = Number(this.employeeDetails.employee.employeeNo);
                // this.postForm.get('payScale').patchValue(null);
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
                    this.payBandList = _.cloneDeep(this.getListAccEvent(sixData, (currentPayScale - 1)));
                }
                if (this.postForm.get('payBandId').value) {
                    this.onPayBandChange();
                }
            }
        }

        // tslint:disable-next-line:max-line-length
        if (this.employeeDetails && this.employeeDetails.employee && Number(this.previousEmployeeNo) !== Number(this.employeeDetails.employee.employeeNo)) {
            this.previousEmployeeNo = Number(this.employeeDetails.employee.employeeNo);
            // this.postForm.get('payBandId').patchValue(null);
            // this.postForm.get('payBandValue').patchValue(null);
            // this.postForm.get('gradePayId').patchValue(null);
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
            // this.calculateSixthBasicPay();
            if (!self.eventDetails || (self.eventDetails && self.eventDetails.payBandId !== payBandId)) {
                // this.postForm.get('basicPay').patchValue('');
                // this.postForm.get('gradePayId').patchValue('');
            }
            // tslint:disable-next-line:max-line-length
            this.postForm.get('payBandValue').setValidators([Validators.min(setSelectedPayBand.startingValue), Validators.max(setSelectedPayBand.endValue)]);
            if (gradePayData[0]) {
                // let gradePayIndex = -1;
                // tslint:disable-next-line:max-line-length
                // if (this.employeeDetails && this.employeeDetails.employee && this.employeeDetails.employee.gradePayName) {
                //     for (let i = 0; i < gradePayData[0].gradePays.length; i++) {
                //         const gradePay = gradePayData[0].gradePays[i];
                //         if (gradePay.gradePayValue === this.employeeDetails.employee.gradePayName) {
                //             gradePayIndex = i;
                //         }
                //     }
                //     this.gradePayList = _.cloneDeep(this.getListAccEvent(gradePayData[0].gradePays, gradePayIndex));
                // } else {
                this.gradePayList = _.cloneDeep(gradePayData[0].gradePays);
                // }
            }
            this.calculateSixthBasicPay();
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
        if (params['request']['oldPayBandValue'] === 'HAG' || params['request']['oldPayBandValue'] === 'CS') {
            params['request']['oldPayBandValue'] = 0;
        }
        this.eventService.calcSixthBasic(params, self.eventType).subscribe(res => {
            if (res['result'] && res['status'] === 200) {
                self.postForm.patchValue({
                    payBandValue: res['result']['payBandValue']
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
            // if (this.employeeDetails.employee.payLevelId) {
            //     let currentPayScale = 0;
            //     sevenData.forEach((payLevel, index) => {
            //         if (payLevel.id === Number(this.employeeDetails.employee.payLevelId)) {
            //             currentPayScale = index;
            //         }
            //     });
            //     if (currentPayScale || currentPayScale === 0) {
            this.payLevelList = _.cloneDeep(sevenData);
            //     }
            // }
        }
        if (this.postForm.get('payLevelId').value) {
            this.onPayLevelChange();
        }
        // tslint:disable-next-line:max-line-length
        if (this.employeeDetails && this.employeeDetails.employee && Number(this.previousEmployeeNo) !== Number(this.employeeDetails.employee.employeeNo)) {
            this.previousEmployeeNo = Number(this.employeeDetails.employee.employeeNo);
            // this.postForm.get('payLevelId').patchValue(null);
            // this.postForm.get('cellId').patchValue(null);
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
            this.setEventPostData();
        }
        // }
        // tslint:disable-next-line:max-line-length
        if (this.employeeDetails && this.eventForm && this.eventForm.get('payCommId') && this.eventForm.get('payCommId').value && this.payMasterData && this.payMasterData.data) {
            this.setCommList(this.eventForm.get('payCommId').value);
        }
    }

    /**
     * @method onEmployeeKeyUp
     * @description Function is called to check if Junior employee details should be get from server
     * @param event Keybooard event is recieved to check Enter is pressed or not
     */
    onEmployeeKeyUp(event?: KeyboardEvent) {
        if (this.seniorEmployeeSelected) {
            const self = this,
                empNo = self.employeeDetails.employee.employeeNo,
                deemedEmpNo = self.deemedJnrEmp.get('employeeNumber').value;
            if (deemedEmpNo && deemedEmpNo.length === 10) {
                if (empNo !== deemedEmpNo) {
                    if (event) {
                        // tslint:disable-next-line: deprecation
                        if (event.keyCode === 13 || event.keyCode === 9) {
                            event.preventDefault();
                            event.stopPropagation();
                            self.getDeemedEmployeeDetail();
                        }
                    } else {
                        // if () {
                        self.getDeemedEmployeeDetail();
                        // }
                    }
                } else {
                    self.toastr.error('Please enter different employee number for Junior Employee');
                    self.deemedJnrEmp.patchValue({
                        employeeNumber: ''
                    });
                }
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
        if ((this.eventDetails && this.eventDetails.statusId !== 205 && this.eventDetails.statusId !== 0) || !this.seniorEmployeeSelected || this.action === 'view') {
            return;
        }
        if (!this.deemedJnrEmp.controls.employeeNumber.value) {
            const dialogRef = this.dialog.open(SearchEmployeeComponent, {
                width: '800px',
            }),
                self = this;

            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    self.deemedJnrEmp.patchValue({
                        employeeNumber: result.employeeNo
                    });
                    self.deemedEmpId = result.employeeId;
                    self.getDeemedEmployeeDetail();
                }
            });
        } else {
            this.onEmployeeKeyUp();
        }
    }

    /**
     * @method getDeemedEmployeeDetail
     * @description Function is called to check Junior employee is eligible or not
     */
    getDeemedEmployeeDetail() {
        const self = this,
            effectiveDate: Date = this.eventForm.get('eventEffectiveDate').value,
            dataToSend = {
                'data': {
                    // tslint:disable-next-line:max-line-length
                    'employeeSeniorNo': Number(this.employeeDetails ? (this.employeeDetails.employee ? this.employeeDetails.employee.employeeNo : 0) : 0),
                    'employeeNo': Number(self.deemedJnrEmp.get('employeeNumber').value),
                    'effectiveDate': '0',
                    'payCommissionId': this.eventForm.get('payCommId').value
                }
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
            dataToSend['data']['effectiveDate'] = effDateToSend;
        }
        if (this.eventForm.get('payCommId').value) {
            this.eventService.getDeemedEmployeeDetails(dataToSend).subscribe(res => {
                if (res['status'] === 200 && res['result']) {
                    this.getEmployeeDetail();
                } else {
                    self.clearDeemedJnrEmployeeDetails();
                    self.toastr.error(res['message']);
                }
            }, err => {
                self.clearDeemedJnrEmployeeDetails();
                self.toastr.error(err);
            });
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
                'pageIndex': 0,
                'pageElement': 10,
                'jsonArr': [
                    {
                        'key': 'empNo',
                        'value': Number(self.deemedJnrEmp.get('employeeNumber').value)
                    },
                    {
                        'key': 'effectiveDate',
                        'value': '0'
                    },
                    {
                        'key': 'payCommission',
                        'value': this.eventForm.get('payCommId').value
                    },
                    {
                        'key': 'eventId',
                        'value': '0'
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

        this.eventService.getEmployeeDetails(dataToSend).subscribe(res => {
            if (res['status'] === 200 && res['result']) {
                self.deemedEmployeeDetails = _.cloneDeep(res['result']);
                if (self.deemedEmployeeDetails.employee) {
                    const senCategoryId = this.employeeDetails.employee.departmentCategoryId,
                        jnrCategoryId = this.deemedEmployeeDetails.employee.departmentCategoryId;
                    if (senCategoryId === jnrCategoryId) {
                        self.deemedEmpId = self.deemedEmployeeDetails.employee.employeeId;
                        if (self.deemedJnrEmp) {
                            self.deemedJnrEmp.patchValue({
                                name: this.deemedEmployeeDetails.employee.employeeName,
                                class: this.deemedEmployeeDetails.employee.employeeClass,
                                designation: this.deemedEmployeeDetails.employee.designationName,
                                basicPay: this.deemedEmployeeDetails.employee.empBasicPay,
                                // tslint:disable-next-line:max-line-length
                                doj: this.deemedEmployeeDetails.employee.dateJoining ? this.deemedEmployeeDetails.employee.dateJoining.split(' ')[0] : null,
                                // tslint:disable-next-line:max-line-length
                                dor: this.deemedEmployeeDetails.employee.retirementDate ? this.deemedEmployeeDetails.employee.retirementDate.split(' ')[0] : null,
                                officeName: this.deemedEmployeeDetails.employee.officeName,
                                dateOfNextIncrement: this.deemedEmployeeDetails.employee.dateNxtIncr,
                                againstEmployeeId: self.deemedEmpId
                            });
                            // tslint:disable-next-line:max-line-length
                            if (this.deemedEmployeeDetails.employee.dateJoining && !(this.deemedEmployeeDetails.employee.dateJoining instanceof Date)) {
                                let doj;
                                if (this.deemedEmployeeDetails.employee.dateJoining.indexOf(' ') !== -1) {
                                    doj = this.deemedEmployeeDetails.employee.dateJoining.split(' ')[0].split('-');
                                    this.deemedJnrEmp.patchValue({
                                        doj: doj[2] + '/' + doj[1] + '/' + doj[0]
                                    });
                                } else if (this.deemedEmployeeDetails.employee.dateJoining.indexOf('T') !== -1) {
                                    doj = this.deemedEmployeeDetails.employee.dateJoining.split('T')[0].split('-');
                                    this.deemedJnrEmp.patchValue({
                                        doj: doj[2] + '/' + doj[1] + '/' + doj[0]
                                    });
                                }
                            }
                            // tslint:disable-next-line:max-line-length
                            if (this.deemedEmployeeDetails.employee.retirementDate && !(this.deemedEmployeeDetails.employee.retirementDate instanceof Date)) {
                                let doj;
                                if (this.deemedEmployeeDetails.employee.retirementDate.indexOf(' ') !== -1) {
                                    doj = this.deemedEmployeeDetails.employee.retirementDate.split(' ')[0].split('-');
                                    this.deemedJnrEmp.patchValue({
                                        dor: doj[2] + '/' + doj[1] + '/' + doj[0]
                                    });
                                } else if (this.deemedEmployeeDetails.employee.retirementDate.indexOf('T') !== -1) {
                                    doj = this.deemedEmployeeDetails.employee.retirementDate.split('T')[0].split('-');
                                    this.deemedJnrEmp.patchValue({
                                        dor: doj[2] + '/' + doj[1] + '/' + doj[0]
                                    });
                                }
                            }
                            // tslint:disable-next-line:max-line-length
                            if (this.deemedEmployeeDetails.employee.dateNxtIncr && !(this.deemedEmployeeDetails.employee.dateNxtIncr instanceof Date)) {
                                let doj;
                                if (this.deemedEmployeeDetails.employee.dateNxtIncr.indexOf(' ') !== -1) {
                                    doj = this.deemedEmployeeDetails.employee.dateNxtIncr.split(' ')[0].split('-');
                                    this.deemedJnrEmp.patchValue({
                                        dateOfNextIncrement: doj[2] + '/' + doj[1] + '/' + doj[0]
                                    });
                                } else if (this.deemedEmployeeDetails.employee.dateNxtIncr.indexOf('T') !== -1) {
                                    doj = this.deemedEmployeeDetails.employee.dateNxtIncr.split('T')[0].split('-');
                                    this.deemedJnrEmp.patchValue({
                                        dateOfNextIncrement: doj[2] + '/' + doj[1] + '/' + doj[0]
                                    });
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
                                        this.deemedJnrEmp.get('payScale').patchValue(this.deemedEmployeeDetails.employee.payScaleName);
                                        this.postForm.patchValue({
                                            payScale: this.deemedEmployeeDetails.employee.payScale,
                                            basicPay: this.deemedEmployeeDetails.employee.empBasicPay,

                                        });
                                        if (this.employeeDetails && this.employeeDetails.employee) {
                                            if (this.payMasterData) {
                                                this.setFifthBasicParams();
                                            }
                                        }
                                        // 5 comm
                                        break;
                                    case 151:
                                        // tslint:disable-next-line:max-line-length
                                        this.deemedJnrEmp.get('payBandId').patchValue(this.deemedEmployeeDetails.employee.payBandName);
                                        // tslint:disable-next-line:max-line-length
                                        this.deemedJnrEmp.get('payBandValue').patchValue(this.deemedEmployeeDetails.employee.payBandValue);
                                        // tslint:disable-next-line:max-line-length
                                        this.deemedJnrEmp.get('gradePayId').patchValue(this.deemedEmployeeDetails.employee.gradePayName);
                                        this.postForm.patchValue({
                                            payBandId: this.deemedEmployeeDetails.employee.payBandId,
                                            gradePayId: this.deemedEmployeeDetails.employee.gradePayId
                                        });
                                        if (this.employeeDetails && this.employeeDetails.employee) {
                                            if (this.payMasterData) {
                                                this.onPayBandChange();
                                            }
                                        }
                                        break;
                                    case 152:
                                        // tslint:disable-next-line:max-line-length
                                        this.deemedJnrEmp.get('payLevelId').patchValue(this.deemedEmployeeDetails.employee.payLevelName);
                                        // tslint:disable-next-line:max-line-length
                                        this.deemedJnrEmp.get('cellId').patchValue(this.deemedEmployeeDetails.employee.cellName);
                                        this.postForm.patchValue({
                                            payLevelId: this.deemedEmployeeDetails.employee.payLevelId
                                        });
                                        if (this.employeeDetails && this.employeeDetails.employee) {
                                            if (this.payMasterData) {
                                                this.onPayLevelChange();
                                            } else {
                                                this.calculateSeventhBasicPay();
                                            }
                                        }
                                        break;
                                }
                            }
                        } else {
                            self.clearDeemedJnrEmployeeDetails();
                        }
                    } else {
                        self.toastr.error('Junior Employee doesn\'t belong to same department category');
                        self.clearDeemedJnrEmployeeDetails();
                    }
                } else {
                    self.clearDeemedJnrEmployeeDetails();
                }
            } else {
                self.clearDeemedJnrEmployeeDetails();
                self.toastr.error(res['message']);
            }
        }, err => {
            self.clearDeemedJnrEmployeeDetails();
            self.toastr.error(err);
        });
    }

    /**
     * @method clearDeemedJnrEmployeeDetails
     * @description Function is called to clear junior employee details
     */
    clearDeemedJnrEmployeeDetails() {
        this.deemedEmployeeDetails = null;
        this.deemedJnrEmp.patchValue({
            employeeNumber: '',
            name: '',
            class: '',
            designation: '',
            basicPay: '',
            doj: '',
            dor: '',
            officeName: '',
            dateOfNextIncrement: '',
            againstEmployeeId: ''
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
                    this.deemedJnrEmp.get('payScale').patchValue('');
                    // 5 comm
                    break;
                case 151:
                    // tslint:disable-next-line:max-line-length
                    this.deemedJnrEmp.get('payBandId').patchValue('');
                    // tslint:disable-next-line:max-line-length
                    this.deemedJnrEmp.get('payBandValue').patchValue('');
                    // tslint:disable-next-line:max-line-length
                    this.deemedJnrEmp.get('gradePayId').patchValue('');
                    break;
                case 152:
                    // tslint:disable-next-line:max-line-length
                    this.deemedJnrEmp.get('payLevelId').patchValue('');
                    // tslint:disable-next-line:max-line-length
                    this.deemedJnrEmp.get('cellId').patchValue('');
            }
        }
    }

    /**
     * @method calculateDuration
     * @description Function is called to calculate notional period
     * @param startDate it is for start date selected in deemed notional start date
     * @param endDate it is for end date selected in deemed notional end date
     */
    calculateDuration(startDate, endDate) {
        if ((startDate instanceof Date) && (endDate instanceof Date)) {
            if (startDate <= endDate) {
                const diffTime: any = Math.abs(endDate.getTime() - startDate.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                this.startDateLesser = false;
                this.notionalForm.get('duration').patchValue(diffDays);
            } else {
                this.toastr.error('Start date should be lesser than End date!');
                this.startDateLesser = true;
            }
        }
    }

    /**
     * @method deemDuration
     * @description Function is called when either start or end date is changed
     */
    deemDuration() {
        this.deemToMinDate = this.notionalForm.controls.deemedDate.value;
        // tslint:disable-next-line:max-line-length
        this.calculateDuration(this.notionalForm.controls.deemedDate.value, this.notionalForm.controls.actualDatePromo.value);
    }

    /**
     * @method ngOnDestroy
     * @description Function is called when compnent is destroyed to take necessary calls on view destroy from browser
     * Kept for future purpose
     */
    ngOnDestroy() {
        this.eventForm.removeControl('notionalForm');
        this.eventForm.removeControl('deemedJnrEmp');
    }
}
