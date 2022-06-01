import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { pvuMessage } from './../../../../../shared/constants/pvu/pvu-message.constants';
import * as _ from 'lodash';
import { FixToRegularService } from '../service/fix-to-regular.service';

@Component({
    selector: 'app-six-commition-pay',
    templateUrl: './six-commition-pay.component.html',
    styleUrls: ['./six-commition-pay.component.css']
})
export class SixCommitionPayComponent implements OnInit, OnChanges {
    form6pc: FormGroup;

    payBandCtrl: FormControl = new FormControl();
    gradePayCtrl: FormControl = new FormControl();
    payCommIdCtrl: FormControl = new FormControl();
    errorMessages = pvuMessage;
    @Input() payCommissionList = [];
    @Input() employeeDetail;
    @Input() effictiveDate;
    @Input() fixPay;
    @Input() payLevelId;
    @Input() resetPaybandVal: boolean;

    // payBandList = [];
    payBandList = [];
    gradePayList = [];
    payBandValues = [];
    payMasterData: any;
    payBand: string = null;
    effDateYear: number;

    constructor(
        public fb: FormBuilder,
        private toastr: ToastrService,
        private fixToRegularService: FixToRegularService,
        private cd: ChangeDetectorRef
    ) {
        this.createForm();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (
            changes.effictiveDate &&
            this.effictiveDate !== null &&
            changes.effictiveDate.previousValue !== changes.effictiveDate.currentValue
        ) {
            const effDate = this.fixToRegularService.changeDateFormat(this.effictiveDate);
            this.effDateYear = new Date(this.effictiveDate).getFullYear();
            this.form6pc.patchValue({ benEffDate: effDate });
            const setDate = this.setNextIncrementDate(this.effictiveDate);
            this.form6pc.patchValue({ dateOfNxtInc: setDate });
        }

        if (
            changes.employeeDetail &&
            changes.employeeDetail.previousValue !== changes.employeeDetail.currentValue &&
            this.effDateYear &&
            this.effDateYear < 2016
        ) {
            this.getPayMasters(this.employeeDetail.departmentCategoryId, this.employeeDetail.empBasicPay);
        }

        if (
            changes.payLevelId &&
            changes.payLevelId.previousValue !== changes.payLevelId.currentValue &&
            this.employeeDetail &&
            this.employeeDetail.departmentCategoryId &&
            this.employeeDetail.empBasicPay
        ) {
            // tslint:disable-next-line:no-debugger
            this.getPayMasters(this.employeeDetail.departmentCategoryId, this.employeeDetail.empBasicPay);
        }
    }

    setNextIncrementDate(effectiveDate) {
        let effDateYear = new Date(effectiveDate).getFullYear();
        let effMonth = new Date(effectiveDate).getMonth() + 1;
        const effeDate = new Date(effectiveDate).getDate();
        if (!(effeDate === 1 && effMonth === 1)) {
            effDateYear = effDateYear + 1;
        }
        effMonth = 7;
        return this.fixToRegularService.changeDateFormat(new Date(effMonth + '/' + 1 + '/' + effDateYear));
    }

    ngOnInit(): void {}

    get payBandId() {
        return this.form6pc.get('payBandId').value;
    }

    get gradePayId() {
        return this.form6pc.get('gradePayId').value;
    }

    /**
     * @method createEventForm
     * @description Function is called to initialize form group for event details
     */
    createForm() {
        this.form6pc = this.fb.group({
            payCommId: [151],
            payBandId: ['', Validators.required],
            gradePayId: ['', Validators.required],
            payBandValue: ['', Validators.required],
            basicPay: ['', Validators.required],
            benEffDate: ['', Validators.required],
            dateOfNxtInc: ['', Validators.required]
        });
    }

    get paybandId() {
        return this.form6pc.get('payBandId').value;
    }
    /**
     * @method getPayMasters
     * @description Function is called to get all paymasters according to department category
     */
    getPayMasters(departmentCategoryId, basicPay) {
        const dataToSend = {
            deptCatId: departmentCategoryId,
            fixPay: basicPay,
            payLevel: this.payLevelId
        };

        this.fixToRegularService.getPayBand(dataToSend).subscribe(
            res => {
                if (res['status'] === 200 && res['result']) {
                    this.payBandList = res['result'];
                    if (this.payBandList.length === 1 && this.resetPaybandVal) {
                        this.form6pc.patchValue({
                            payBandId: this.payBandList[0].id
                        });
                        this.onPayBandChange(this.payBandList[0].id);
                        // this.resetPaybandVal = false;
                        const payBandObj = this.payBandList.find(pelm => pelm.id === this.payBandList[0].id);
                        if (payBandObj && !this.payBand) {
                            this.payBand = payBandObj.startingValue + '-' + payBandObj.endingValue;
                        }
                        this.cd.detectChanges();
                        this.form6pc.get('payBandValue').updateValueAndValidity();
                    }

                    if (this.payBandId) {
                        const payBandObj = this.payBandList.find(pelm => pelm.id === this.payBandId);
                        if (payBandObj && !this.payBand) {
                            this.payBand = payBandObj.startingValue + '-' + payBandObj.endingValue;
                        }
                        this.form6pc.get('payBandValue').updateValueAndValidity();
                        this.cd.detectChanges();
                    }
                } else {
                    this.toastr.error(res['message']);
                }
            },
            err => {
                this.toastr.error(err);
            }
        );
    }

    /**
     * @method onPayBandChange
     * @description Function is called to take necessary action on values change of pay band
     */
    onPayBandChange(payBandId, reset = false) {
        const dataToSend = {
            deptCatId: this.employeeDetail.departmentCategoryId,
            payBandId: payBandId,
            fixPay: this.employeeDetail.empBasicPay,
            payLevel: this.payLevelId
        };

        this.fixToRegularService.getGradePay(dataToSend).subscribe(
            res => {
                if (res['status'] === 200 && res['result']) {
                    this.gradePayList = res['result']['gradepay'] ? res['result']['gradepay'] : [];
                    this.payBandValues = res['result']['payBandValue'] ? res['result']['payBandValue'] : [];
                    let payBandObj = this.payBandList.find(pelm => pelm.id === payBandId);
                    if (payBandObj) {
                        this.payBand = payBandObj.startingValue + '-' + payBandObj.endingValue;
                    }
                    this.cd.detectChanges();
                    this.form6pc.get('payBandValue').updateValueAndValidity();
                    console.log(this.payBandValues);
                    if (this.resetPaybandVal || reset) {
                        this.form6pc.patchValue({
                            payBandValue: '',
                            gradePayId: '',
                            basicPay: ''
                        });
                        if (this.gradePayList.length === 1) {
                            this.form6pc.patchValue({
                                gradePayId: this.gradePayList[0].id
                            });
                            this.calculateSixthBasicPay(this.gradePayList[0].id, 1);
                        }
                        payBandObj = this.payBandList.find(pelm => pelm.id === payBandId);
                        if (payBandObj) {
                            this.payBand = payBandObj.startingValue + '-' + payBandObj.endingValue;
                        }
                        if (this.form6pc.get('gradePayId').value) {
                            this.calculateSixthBasicPay(this.form6pc.get('gradePayId').value);
                        }
                        this.cd.detectChanges();
                        this.form6pc.get('payBandValue').updateValueAndValidity();
                    }
                } else {
                    this.toastr.error(res['message']);
                }
            },
            err => {
                this.toastr.error(err);
            }
        );
    }

    /**
     * @method calculateSixthBasicPay
     * @description Function is called to get pay band and pay band value from server
     */
    calculateSixthBasicPay(gradePayId, fromGradePay = 0) {
        const selectedGradePayId = gradePayId ? gradePayId : 0;
        const payBandId = this.payBandId;

        const selectedBasicPay = this.payBandValues.find(elm => {
            return Number(elm.payBand) === Number(payBandId) && Number(elm.gradePay) === Number(selectedGradePayId);
        });

        const gradePayObj = this.gradePayList.find(elm => elm.id === selectedGradePayId);

        if (gradePayObj) {
            let basicSal = 0;
            if (this.form6pc.get('payBandValue').value && fromGradePay === 0) {
                basicSal = Number(gradePayObj.value) + Number(this.form6pc.get('payBandValue').value);
                this.form6pc.patchValue({
                    basicPay: basicSal
                });
            } else {
                basicSal = Number(gradePayObj.value) + Number(selectedBasicPay.enteryPay);
                this.form6pc.patchValue({
                    payBandValue: selectedBasicPay.enteryPay,
                    basicPay: basicSal
                });
                // this.form6pc.get('payBandValue').setErrors(null);
                const payBandObj = this.payBandList.find(pelm => pelm.id === payBandId);
                if (payBandObj) {
                    this.payBand = payBandObj.startingValue + '-' + payBandObj.endingValue;
                }
                this.cd.detectChanges();
                this.form6pc.get('payBandValue').updateValueAndValidity();
            }
        }
    }
}