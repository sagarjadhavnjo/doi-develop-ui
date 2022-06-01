import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { SearchEmployeeComponent } from './../../../pvu-common/search-employee/search-employee.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { EVENT_ERRORS } from './../index';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input, OnDestroy, OnChanges, Output, EventEmitter, ElementRef } from '@angular/core';
import { PVUEventsService } from '../services/pvu-event.service';
import * as _ from 'lodash';

@Component({
    selector: 'app-pvu-employee-current-details',
    templateUrl: './pvu-event-employee-current-details.component.html',
    styleUrls: ['./pvu-event-employee-current-details.component.css']
})
export class PVUEmployeeCurrentDetailsComponent implements OnInit, OnDestroy, OnChanges {
    @Input() eventForm: FormGroup;
    @Input() eventDetails: any;
    @Input() isTikuPay = false;
    @Input() action: string;
    @Input() isRework = false;
    @Input() title: string = 'Current Details';
    @Input() showExamDetails: boolean = false;
    @Input() clearEmployeeDetails: boolean = false;
    @Input() clearExamDetails: boolean = false;
    @Output() employeeDetailChange: EventEmitter<any> = new EventEmitter();
    @Input() isShettyPay: boolean = false;
    employeeCurrentForm: FormGroup;
    payCommSelected: any;
    empId: number;
    eventCtrl: FormControl = new FormControl();
    employeeDetails: any;
    enableEmployeeSearch: boolean = false;

    errorMessage = EVENT_ERRORS;
    subscriber: Subscription[] = [];

    cccExamData = [];
    departmentalExamData = [];
    languageExamData = [];

    cccExamDataSource = new MatTableDataSource(this.cccExamData);
    examColumns = ['examName', 'examBody', 'examPassingDate', 'examStatus'];
    examFooterColumns = ['examName'];

    departmentalExamDataSource = new MatTableDataSource(this.departmentalExamData);

    languageExamDataSource = new MatTableDataSource(this.languageExamData);
    effectiveDate: Date;
    isJudiciaryDepartment: boolean = false;
    constructor(
        private fb: FormBuilder,
        private eventService: PVUEventsService,
        private dialog: MatDialog,
        private toastr: ToastrService,
        private el: ElementRef,
        private datePipe: DatePipe
    ) { }

    /**
     * @method ngOnInit
     * @description Function is called when compnent is destroyed to take necessary calls on view destroy from browser
     */
    ngOnInit() {
        const self = this;
        this.creatEmployeeForm();
        if (this.employeeDetails && this.employeeDetails.employee) {
            this.setEmployeeInfo();
        }
        if (this.eventForm.get('payCommId').value) {
            self.onValueChange(this.eventForm.get('payCommId').value);
        }
        if (this.eventForm.get('eventEffectiveDate').value) {
            self.onEffectiveDateValueChange(this.eventForm.get('eventEffectiveDate').value);
        }
        this.subscriber.push(this.eventForm.get('payCommId').valueChanges.subscribe(res => {
            self.onValueChange(res);
        }));
        this.subscriber.push(this.eventForm.get('eventEffectiveDate').valueChanges.subscribe(res => {
            self.onEffectiveDateValueChange(res);
        }));
    }

    /**
     * @method creatEmployeeForm
     * @description Function is called to initialize form group for post details
     */
    creatEmployeeForm() {
        const self = this;
        if (this.eventForm) {
            this.eventForm.removeControl('employeeCurrentForm');
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
                })
            });
        }
        this.employeeCurrentForm = this.eventForm.get('employeeCurrentForm') as FormGroup;
        if (this.eventDetails && this.eventDetails.employeeNo) {
            this.employeeCurrentForm.get('employeeNo').patchValue(this.eventDetails.employeeNo);
            if (!this.eventForm.get('eventEffectiveDate').errors) {
                this.getEmployeeDetail();
            } else {
                this.eventForm.get('eventEffectiveDate').markAsTouched({ onlySelf: true });
            }
        }
    }

    /**
     * @method onValueChange
     * @description Function is called when pay commission is changed
     * @param payCommissionId what pay commission is selected, that id is provided
     */
    onValueChange(payCommissionId) {
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
                if (this.employeeDetails && this.employeeDetails.employee
                    && this.employeeDetails.employee.payScaleName) {
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
            });
            if (this.employeeDetails.employee.departmentCategoryId === 17) {
                this.isJudiciaryDepartment = true;
            } else {
                this.isJudiciaryDepartment = false;
            }
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
                dateOfNextIncrement: null
            });
            this.departmentalExamDataSource = new MatTableDataSource([]);
            this.languageExamDataSource = new MatTableDataSource([]);
            this.cccExamDataSource = new MatTableDataSource([]);
            this.employeeCurrentForm.get('employeeNo').patchValue('');
            setTimeout(() => {
                this.el.nativeElement.querySelector('.employee-number-field').focus();
            }, 0);
        }
        if (this.eventForm.get('payCommId') && this.eventForm.get('payCommId').value) {
            if (this.isJudiciaryDepartment && this.eventForm.get('payCommId').value === 152) {
                this.toastr.error('Please select 5 or 6 pay commission as 7 pay commission is not applicable!');
                this.employeeCurrentForm.reset();
                this.employeeDetails = {};
                this.departmentalExamDataSource = new MatTableDataSource([]);
                this.languageExamDataSource = new MatTableDataSource([]);
                this.cccExamDataSource = new MatTableDataSource([]);
                this.employeeCurrentForm.get('employeeNo').patchValue('');
            } else {
                this.onValueChange(this.eventForm.get('payCommId').value);
            }
        }
        this.employeeDetailChange.emit(this.employeeDetails);
    }

    /**
     * @method transforminYMDDateFormat
     * @description Function is called to get Date in format YYYY-MM-DD
     * @param date for which format is required
     */
    transforminYMDDateFormat(date) {
        if (date !== '' && date !== undefined && date !== null) {
            date = new Date(date);
            return this.datePipe.transform(date, 'dd/MM/yyyy');
        }
        return '';
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
     * @description Function is called to take necessary actions when input parameters are changed from outside
     */
    ngOnChanges() {
        const self = this;
        if (this.employeeCurrentForm && this.eventDetails && this.eventDetails.employeeNo) {
            this.employeeCurrentForm.get('employeeNo').patchValue(this.eventDetails.employeeNo);
            if (this.eventDetails && (this.eventDetails.statusId === 205 || this.eventDetails.statusId === 0)) {
                if (!this.eventForm.get('eventEffectiveDate').errors) {
                    this.getEmployeeDetail();
                } else {
                    this.eventForm.get('eventEffectiveDate').markAsTouched({ onlySelf: true });
                }
            } else {
                this.employeeDetails = {};
                this.employeeDetails['employee'] = {};
                const employee = this.employeeDetails.employee;
                employee['employeeNo'] = this.eventDetails.employeeNo;
                employee['employeeId'] = this.eventDetails.employeeId;
                employee['employeeName'] = this.eventDetails.cEmployeeName;
                employee['employeeClass'] = this.eventDetails.cClassName;
                employee['departmentCategoryId'] = this.eventDetails.departmentCategoryId;
                employee['designationName'] = this.eventDetails.cDesignationName;
                employee['empBasicPay'] = this.eventDetails.cBasicPay;
                employee['officeName'] = this.eventDetails.cOfficeName;
                employee['dateJoining'] = this.eventDetails.cDateOfJoining + 'T00:00:00.000+0530';
                employee['retirementDate'] = this.eventDetails.cDateOfRetirement + 'T00:00:00.000+0530';
                employee['dateNxtIncr'] = this.eventDetails.cDateOfNextIncrement + 'T00:00:00.000+0530';
                employee['cellId'] = this.eventDetails.cCellId;
                employee['cellName'] = this.eventDetails.cCellName;
                employee['gradePayId'] = this.eventDetails.cGradePayId;
                employee['gradePayName'] = this.eventDetails.cGradePayName;
                employee['payBandId'] = this.eventDetails.cPayBandId;
                employee['payBandName'] = this.eventDetails.cPayBandName;
                employee['payBandValue'] = this.eventDetails.cPayBandValue;
                employee['payLevelId'] = this.eventDetails.cPayLevelId;
                employee['payLevelName'] = this.eventDetails.cPayLevelName;
                employee['payScale'] = this.eventDetails.cPayScale;
                employee['payScaleName'] = this.eventDetails.cPayScaleName;
                employee['currentDetailsEventId'] = this.eventDetails.currentDetailsEventId;
                self.setEmployeeInfo();
                self.employeeDetailChange.emit(self.employeeDetails);
            }
        }
        if (this.action === 'view' && this.employeeCurrentForm) {
            this.employeeCurrentForm.get('employeeNo').disable();
        }
        if (this.clearEmployeeDetails && this.employeeCurrentForm) {
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
        if (this.clearExamDetails && this.employeeCurrentForm) {
            this.employeeDetails = null;
            this.departmentalExamDataSource = new MatTableDataSource([]);
            this.languageExamDataSource = new MatTableDataSource([]);
            this.cccExamDataSource = new MatTableDataSource([]);
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
                        if (!this.payCommSelected) {
                            this.payCommSelected = this.eventForm.get('payCommId').value;
                        }
                        self.getEmployeeDetail();
                    } else {
                        this.eventForm.get('eventEffectiveDate').markAsTouched({ onlySelf: true });
                    }
                }
            } else {
                if (!this.eventForm.get('eventEffectiveDate').errors) {
                    if (!this.payCommSelected) {
                        this.payCommSelected = this.eventForm.get('payCommId').value;
                    }
                    self.getEmployeeDetail();
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
                            self.getEmployeeDetail();
                        } else {
                            this.eventForm.get('eventEffectiveDate').markAsTouched({ onlySelf: true });
                        }
                    }
                });
            } else {
                const empNo = this.employeeCurrentForm.get('employeeNo').value;
                if (empNo && empNo.length === 10) {
                    if (!this.eventForm.get('eventEffectiveDate').errors) {
                        this.getEmployeeDetail();
                    } else {
                        this.eventForm.get('eventEffectiveDate').markAsTouched({ onlySelf: true });
                    }
                }
            }
        }
    }

    /**
     * @method getDeemedEmployeeDetail
     * @description Function is called to check Junior employee is eligible or not
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
                        'value': Number(self.employeeCurrentForm.get('employeeNo').value)
                    },
                    {
                        'key': 'effectiveDate',
                        'value': '0'
                    },
                    {
                        'key': 'payCommission',
                        'value': self.eventForm.get('payCommId').value
                    },
                    {
                        'key': 'eventId',
                        'value': '0'
                    },
                    {
                        'key' : 'isViewPage',
                        'value' : this.action === 'view'
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
            dataToSend['jsonArr'][1].value = effDateToSend;
        }
        // this.employeeDetails = null;
        // this.setEmployeeInfo();
        if (this.isShettyPay) {
            this.eventService.getEmployeeDetailsShettyPay(dataToSend).subscribe(res => {
               this.getEmployeeDetails(res);
            }, err => {
                this.errFunction(err);
            });
        } else {
            this.eventService.getEmployeeDetails(dataToSend).subscribe(res => {
                this.getEmployeeDetails(res);
            }, err => {
                this.errFunction(err);
            });
        }
    }

    errFunction(err) {
        this.employeeDetails = null;
        this.setEmployeeInfo();
        this.toastr.error(err);
    }

    /**
     * @method getEmployeeDetails
     * @description Function is called to set recieved details through current detail api
     * @param res result fetched by api
     */
    getEmployeeDetails(res) {
        const self = this;
        if (res['status'] === 200 && res['result']) {
            self.employeeDetails = _.cloneDeep(res['result']);
            self.empId = self.employeeDetails.employee.employeeId;
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
        } else {
            self.employeeDetails = null;
            self.toastr.error(res['message']);
        }
        self.employeeDetailChange.emit(self.employeeDetails);
        self.setEmployeeInfo();
    }

    /**
     * @method onEffectiveDateValueChange
     * @description Function is called on effective date change and sets minimum date
     * @param res Changed effective date
     */
    onEffectiveDateValueChange(res) {
        if (res) {
            if (this.effectiveDate !== res) {
                this.effectiveDate = res;
                this.employeeCurrentForm.get('employeeNo').enable();
                this.enableEmployeeSearch = true;
                this.onEmployeeKeyUp(null);
            }
            if (this.payCommSelected !== this.eventForm.get('payCommId').value
                && this.eventForm.get('payCommId').value && !this.employeeCurrentForm.controls.employeeNo.errors) {
                this.payCommSelected = this.eventForm.get('payCommId').value;
                this.enableEmployeeSearch = true;
                this.onEmployeeKeyUp(null);
            }
        } else {
            this.effectiveDate = res;
            this.employeeCurrentForm.get('employeeNo').disable();
            this.enableEmployeeSearch = false;
        }
    }
}
