import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { EventsService } from './../services/events.service';
import { Subscription } from 'rxjs';
import { EVENT_ERRORS } from './../index';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, Input, OnDestroy, OnChanges, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';

@Component({
    selector: 'app-promotion-forgo',
    templateUrl: './promotion-forgo.component.html',
    styleUrls: ['./promotion-forgo.component.css']
})
export class PromotionForgoComponent implements OnInit, OnDestroy, OnChanges {
    @Input() eventForm: FormGroup;
    @Input() action: string;
    @Input() eventType: string;
    @Input() eventDetails;
    @Output() saveEvent: EventEmitter<any> = new EventEmitter();
    @Output() resetEvent: EventEmitter<any> = new EventEmitter();
    @Output() employeeDetailChange: EventEmitter<any> = new EventEmitter();
    showExamDetails: boolean = false;
    currentDate = new Date();
    employeeDetails;
    lookUpData;
    payMasterData;
    classCtrl: FormControl = new FormControl();
    classList;
    designationCtrl: FormControl = new FormControl();
    designationList;
    optionAvailedCtrl: FormControl = new FormControl();
    optionAvailedList;
    payBandCtrl: FormControl = new FormControl();
    gradePayCtrl: FormControl = new FormControl();
    payLevelCtrl: FormControl = new FormControl();
    cellIdCtrl: FormControl = new FormControl();
    scaleCtrl: FormControl = new FormControl();
    higherGradeCtrl: FormControl = new FormControl();
    joinPromotionalPostCtrl: FormControl = new FormControl();
    setSelectedPayBand;
    payLevelList = [];
    cellList = [];
    bindedPromotionType: boolean = false;
    payBandList = [];
    gradePayList = [];
    title: string = 'Forgo Details';
    scaleList = [];
    notionalForm;
    postForm: FormGroup;
    empId;
    subscriber: Subscription[] = [];
    errorMessage = EVENT_ERRORS;
    constructor(
        private fb: FormBuilder,
        private eventService: EventsService,
        private dialog: MatDialog,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        const self = this;
        this.creatEmployeeForm();
        this.getPayMasters();
        // this.postForm.disable();
        this.getDesignations();
        this.getLookUpData();

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

    getStatus() {
        return true;
    }

    getLookUpData() {
        const self = this;
        // tslint:disable-next-line:max-line-length
        this.subscriber.push(this.eventService.getLookUp('Promotion_Forgo').subscribe(res => {
            if (res['status'] === 200 && res['result']) {
                self.lookUpData = _.cloneDeep(res['result']);
                if (self.lookUpData) {
                    self.classList = self.lookUpData.Dept_Class;
                    self.optionAvailedList = self.lookUpData.ConditionCheck;
                }
            } else {
                self.toastr.error(res['message']);
            }
        }, err => {
            self.toastr.error(err);
        }));
    }

    creatEmployeeForm() {
        const self = this;
        if (this.eventForm) {
            this.eventForm.removeControl('postForm');
            this.eventForm.addControl('postForm', self.fb.group({
                employeeClassId: [''],
                designationId: [''],
                basicPay: [''],
                dateOfNextIncrement: ['', Validators.required],
                remarks: [''],
                // eventEffectiveDate: ['', Validators.required],
                promoDate: ['', Validators.required],
                // joinPromotionPost: ['', Validators.required],
                // joinPromotionDate: [''],
                promoForgoDate: ['', Validators.required],
                // highGradeSel: ['', Validators.required],
                dateOfHighGrade1: [''],
                dateOfHighGrade2: [''],
                dateOfHighGrade3: ['']
            }));
        } else {
            this.eventForm = self.fb.group({
                postForm: self.fb.group({
                    employeeClassId: ['', Validators.required],
                    designationId: ['', Validators.required],
                    basicPay: [''],
                    dateOfNextIncrement: ['', Validators.required],
                    remarks: [''],
                    // eventEffectiveDate: ['', Validators.required],
                    promoDate: ['', Validators.required],
                    // joinPromotionPost: ['', Validators.required],
                    // joinPromotionDate: [''],
                    promoForgoDate: ['', Validators.required],
                    // highGradeSel: ['', Validators.required],
                    dateOfHighGrade1: [''],
                    dateOfHighGrade2: [''],
                    dateOfHighGrade3: ['']
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

    onYesNoChange(checkId, implementId) {
        if (this.postForm.get(checkId).value === 2) {
            this.postForm.get(implementId).setValidators(Validators.required);
            this.postForm.get(implementId).updateValueAndValidity();
        } else {
            this.postForm.get(implementId).setValidators(null);
            this.postForm.get(implementId).updateValueAndValidity();
        }
    }

    onEmployeeDetailsChange(empl) {
        this.employeeDetails = empl;
        if (this.eventForm.get('payCommId').value) {
            this.setCommList(this.eventForm.get('payCommId').value);
            // this.setCommList(this.eventForm.get('payCommId').value);
        }
        if (empl && empl.employee) {
            this.postForm.patchValue({
                dateOfNextIncrement : new Date(empl.employee.dateNxtIncr)
            });
            this.postForm.patchValue({
                promoForgoDate : this.eventForm.get('eventEffectiveDate').value  ?
                    new Date(this.eventForm.get('eventEffectiveDate').value) : null
            });
        }
        if (this.classList && this.classList.length > 0) {
            this.changeClassList();
        }
        this.employeeDetailChange.emit(empl);
    }
    changeClassList() {
        const self = this;
        if (this.employeeDetails && this.employeeDetails.employee) {
            if (this.employeeDetails.employee.classId) {
                    const classList = this.classList.filter((classC) => {
                        return (classC.lookupInfoId >= Number(self.employeeDetails.employee.classId));
                    });
                    this.classList = _.cloneDeep(classList);
            } else {
                this.classList = _.cloneDeep(this.classList);
            }
        }
    }
    saveDetails() {
        this.saveEvent.emit();
    }

    resetForm() {
        this.resetEvent.emit();
    }

    setEventPostData() {
        const self = this;
        self.postForm.patchValue({
            'employeeClassId': self.eventDetails.employeeClassId,
            'designationId': self.eventDetails.designationId,
            // 'eventEffectiveDate': self.eventDetails.eventEffectiveDate,
            'promoDate': self.eventDetails.promoDate,
            // 'joinPromotionPost': self.eventDetails.joinPromotionPost,
            // 'joinPromotionDate': self.eventDetails.joinPromotionDate,
            'promoForgoDate': self.eventDetails.promoForgoDate,
            // 'highGradeSel': self.eventDetails.highGradeSel,
            'dateOfHighGrade1': self.eventDetails.dateOfHighGrade1,
            'dateOfHighGrade2': self.eventDetails.dateOfHighGrade2,
            'dateOfHighGrade3': self.eventDetails.dateOfHighGrade3
        });
        this.checkForEnable();
    }

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

    onPayCommissionValueChange(payCommissionId) {
        this.postForm.removeControl('payLevelId');
        this.postForm.removeControl('cellId');
        this.postForm.removeControl('payBandId');
        this.postForm.removeControl('payBandValue');
        this.postForm.removeControl('gradePayId');
        this.postForm.removeControl('payScale');
        switch (payCommissionId) {
            case 148:
                // 3 comm
                break;
            case 149:
                // 4 comm
                break;
            case 150:
                let payScaleValue = null;
                if (this.eventDetails && this.eventDetails.payScale) {
                    payScaleValue = this.eventDetails.payScale;
                }
                this.postForm.addControl('payScale', new FormControl(payScaleValue, Validators.required));
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
        if (this.employeeDetails) {
            this.setCommList(payCommissionId);
        }
        this.checkForEnable();
    }

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
                this.onPayLevelChange();
                break;
        }
    }
    setFifthData(payCommissionId) {
        const self = this,
            scaleList = _.orderBy(_.cloneDeep(self.payMasterData[payCommissionId]), 'order', 'asc');
        // _.orderBy(scaleList, 'order', 'asc');
        if (self.employeeDetails) {
            if (self.employeeDetails.payScale) {
                let currentPayScale = 0;
                scaleList.forEach((payScale, index) => {
                    if (payScale.id === self.employeeDetails.payScale) {
                        currentPayScale = index;
                    }
                });
                self.scaleList = scaleList.splice(currentPayScale);
            }
        }
    }

    setSixthData(payCommissionId) {
        const self = this,
            sixData = _.orderBy(_.cloneDeep(self.payMasterData[payCommissionId]), 'order', 'asc');
        // _.orderBy(sixData, 'order', 'asc');
        if (self.employeeDetails && self.employeeDetails.employee) {
            if (self.employeeDetails.employee.payBandId) {
                let currentPayScale = 0;
                sixData.forEach((payBand, index) => {
                    if (payBand.id === self.employeeDetails.employee.payBandId) {
                        currentPayScale = index;
                    }
                });
                self.payBandList = _.cloneDeep(self.getListAccEvent(sixData, currentPayScale));
            }
        }

        if (this.eventDetails) {
            if (this.eventDetails.payBandId) {
                this.postForm.get('payBandId').patchValue(this.eventDetails.payBandId);
                this.postForm.get('payBandValue').patchValue(this.eventDetails.payBandValue);
                this.postForm.get('gradePayId').patchValue(this.eventDetails.gradePayId);
                this.onPayBandChange();
                // this.calculateBasicPay();
            }
        }
    }

    getListAccEvent(data, index) {
        return data.splice(0, (index + 1));
    }

    onPayBandChange() {
        const sixData = _.cloneDeep(this.payMasterData[this.eventForm.get('payCommId').value]),
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
            }
        }
    }

    onGradePayChange() {
        const gradePayId = this.postForm.get('gradePayId').value;
        if (gradePayId) {
            this.calculateSixthBasicPay();
        }
    }

    setSeventhData(payCommissionId) {
        const sevenData = _.orderBy(_.cloneDeep(this.payMasterData[payCommissionId]), 'order', 'asc');
        // _.orderBy(sevenData, 'order', 'asc');
        if (this.employeeDetails && this.employeeDetails.employee) {
            if (this.employeeDetails.employee.payLevelId) {
                let currentPayScale = 0;
                sevenData.forEach((payLevel, index) => {
                    if (payLevel.id === this.employeeDetails.employee.payLevelId) {
                        currentPayScale = index;
                    }
                });
                this.payLevelList = _.cloneDeep(this.getListAccEvent(sevenData, currentPayScale));
                // this.payLevelList = sevenData.splice(currentPayScale);
            }
        }
        if (this.eventDetails) {
            if (this.eventDetails.payLevelId) {
                this.postForm.get('payLevelId').patchValue(this.eventDetails.payLevelId);
                this.postForm.get('cellId').patchValue(this.eventDetails.cellId);
                this.onPayLevelChange();
            }
        }
    }

    onPayLevelChange() {
        const sevenData = _.cloneDeep(this.payMasterData[this.eventForm.get('payCommId').value]),
            payLevelId = this.postForm.get('payLevelId') ? this.postForm.get('payLevelId').value : null;
        if (payLevelId) {
            const cellData = sevenData.filter((payBand) => {
                return payBand.id === payLevelId;
            });
            if (cellData[0]) {
                this.cellList = _.cloneDeep(cellData[0].cells);
            }
            // this.calculateSeventhBasicPay();
        }
    }

    calculateSeventhBasicPay() {
        const self = this,
            params = {
                'request': {
                    'cellId': this.postForm.get('cellId').value,
                    'payLevelId': this.postForm.get('payLevelId').value
                }
            };
        this.eventService.calcSeventhBasic(params, self.eventType).subscribe(res => {
            if (res['result'] && res['status'] === 200) {
                if (+this.employeeDetails.employee.empBasicPay < +res['result']['cellValue']) {
                    this.toastr.error('Employee basic pay should not be greater than current pay.');
                    self.postForm.patchValue({
                        cellId: '',
                        basicPay: ''
                    });
                    return false;
                }
                self.postForm.patchValue({
                    basicPay: res['result']['cellValue']
                });
            }
        });
    }

    calculateSixthBasicPay() {
        const gradePayId = this.postForm.get('gradePayId').value != null &&
            this.postForm.get('gradePayId').value !== undefined ? this.postForm.get('gradePayId').value : 0;
        const payBandValue = this.postForm.get('payBandValue').value != null &&
            this.postForm.get('payBandValue').value !== undefined ? this.postForm.get('payBandValue').value : 0;
        const selectedGradePay = this.gradePayList ?
            this.gradePayList.filter(item => item.id === gradePayId)[0] : null;
        let basicPay = 0;
        if (selectedGradePay != null) {
            basicPay = +selectedGradePay['gradePayValue'] + +payBandValue;
        }
        this.postForm.patchValue({
            basicPay : basicPay
        });
    }

    ngOnChanges() {
        const self = this;
        if (self.action === 'edit' || self.action === 'view') {
            if (self.eventDetails && this.postForm) {
                this.postForm.patchValue({
                    basicPay: self.eventDetails.basicPay,
                    // tslint:disable-next-line:max-line-length
                    dateOfNextIncrement: self.eventDetails.dateOfNextIncrement ? new Date(self.eventDetails.dateOfNextIncrement) : null
                });
                this.setEventPostData();
            }
        }
        // tslint:disable-next-line:max-line-length
        if (this.employeeDetails && this.eventForm && this.eventForm.get('payCommId') && this.eventForm.get('payCommId').value) {
            this.setCommList(this.eventForm.get('payCommId').value);
        }
        this.checkForEnable();
        if (this.lookUpData) {
            this.classList = this.lookUpData.Dept_Class;
            this.optionAvailedList = this.lookUpData.ConditionCheck;
        }
    }

    checkForEnable() {
        // tslint:disable-next-line:max-line-length
        // if (this.employeeDetails && this.eventForm && this.eventForm.get('payCommId') && this.eventForm.get('payCommId').value
        //     && this.eventForm.get('employeeForm') && this.eventForm.get('eventCode')
        //     && this.eventForm.get('eventCode').value) {
        //     if (this.eventForm.get('eventCode').value == 'Promotion') {
        //         if (this.eventForm.get('employeeForm').get('promotionTypeId').value == 274) {
        //             this.postForm.enable();
        //         } else if (this.eventForm.get('employeeForm').get('promotionTypeId').value == 275) {
        //             this.postForm.get('employeeClassId').enable();
        //             this.postForm.get('designationId').enable();
        //             this.postForm.patchValue({});
        //         } else {
        //             this.postForm.disable();
        //         }
        //     } else {
        //         this.postForm.enable();
        //     }
        // } else {
        //     if (this.postForm) {
        //         this.postForm.disable();
        //     }
        // }
    }

    ngOnDestroy() { }

}
