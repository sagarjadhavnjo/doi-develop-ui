import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { pvuMessage } from './../../../../../shared/constants/pvu/pvu-message.constants';
import * as _ from 'lodash';
import { FixToRegularService } from '../service/fix-to-regular.service';

@Component({
    selector: 'app-fifth-commition-pay',
    templateUrl: './fifth-commition-pay.component.html',
    styleUrls: ['./fifth-commition-pay.component.css']
})
export class FifthCommitionPayComponent implements OnInit, OnChanges {
    form5pc: FormGroup;
    payCommIdCtrl: FormControl = new FormControl();
    payScaleCtrl: FormControl = new FormControl();
    errorMessages = pvuMessage;
    @Input() payCommissionList = [];
    @Input() employeeDetail = null;
    @Input() effictiveDate = null;
    @Input() fixPay;

    // payBandList = [];
    payScaleList = [];
    payMasterData: any;
    payScaleValue: string;

    constructor(
        public fb: FormBuilder,
        private toastr: ToastrService,
        private fixToRegularService: FixToRegularService,
        private cd: ChangeDetectorRef
    ) {
        this.createForm();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.employeeDetail && changes.employeeDetail.previousValue !== changes.employeeDetail.currentValue) {
            this.getPayMasters(this.employeeDetail.departmentCategoryId, this.employeeDetail.empBasicPay);
        }

        if (
            changes.effictiveDate &&
            this.effictiveDate !== null &&
            changes.effictiveDate.previousValue !== changes.effictiveDate.currentValue
        ) {
            this.form5pc.patchValue({ benEffDate: this.fixToRegularService.changeDateFormat(this.effictiveDate) });
            const setDate = this.setNextIncrDate(this.effictiveDate);
            this.form5pc.patchValue({ dateOfNxtInc: setDate });
        }
    }
    setNextIncrDate(effictiveDate) {
        let effDateYear = new Date(effictiveDate).getFullYear();
        const effMonth = new Date(effictiveDate).getMonth() + 1;
        effDateYear = effDateYear + 1;
        return this.fixToRegularService.changeDateFormat(new Date(effMonth + '/' + 1 + '/' + effDateYear));
    }

    ngOnInit(): void {}

    /**
     * @method createEventForm
     * @description Function is called to initialize form group for event details
     */
    createForm() {
        this.form5pc = this.fb.group({
            payCommId: [150],
            payScaleId: ['', Validators.required],
            basicPay: ['', Validators.required],
            benEffDate: ['', Validators.required],
            dateOfNxtInc: ['', Validators.required]
        });
    }

    get payscaleId() {
        return this.form5pc.get('payScaleId').value;
    }

    /**
     * @method getPayMasters
     * @description Function is called to get all paymasters according to department category
     */
    getPayMasters(departmentCategoryId, basicPay) {
        const dataToSend = {
            deptCatId: departmentCategoryId,
            fixPay: basicPay
        };

        this.fixToRegularService.getPayScale(dataToSend).subscribe(
            res => {
                if (res['status'] === 200 && res['result']) {
                    this.payScaleList = res['result'];
                    if (this.payscaleId) {
                        const selectedPayScaleObj = this.payScaleList.find(elm => elm.payScaleId === this.payscaleId);
                        if (selectedPayScaleObj) {
                            this.payScaleValue = selectedPayScaleObj.scaleValue;
                            this.form5pc.get('basicPay').updateValueAndValidity();
                            this.cd.detectChanges();
                        }
                    }
                    if (this.payScaleList.length === 1) {
                        this.form5pc.patchValue({
                            payScaleId: this.payScaleList[0].payScaleId
                        });
                        this.onPayScaleChange(this.payScaleList[0].payScaleId);
                    }
                    // this.setFifthData(this.form5pc.get('payCommId').value);
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
    onPayScaleChange(payscaleId, resetBasicPay = false) {
        if (resetBasicPay) {
            this.form5pc.patchValue({
                basicPay: ''
            });
        }
        const selectedPayScaleObj = this.payScaleList.find(elm => elm.payScaleId === payscaleId);
        if (selectedPayScaleObj) {
            this.payScaleValue = selectedPayScaleObj.scaleValue;
            this.form5pc.get('basicPay').updateValueAndValidity();
            this.cd.detectChanges();
        }
    }
}
