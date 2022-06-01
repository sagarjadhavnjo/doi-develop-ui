import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { pvuMessage } from './../../../../../shared/constants/pvu/pvu-message.constants';
import * as _ from 'lodash';
import { FixToRegularService } from '../service/fix-to-regular.service';
import { DatePipe } from '@angular/common';
import { emit } from 'process';

@Component({
    selector: 'app-seven-commition-pay',
    templateUrl: './seven-commition-pay.component.html',
    styleUrls: ['./seven-commition-pay.component.css']
})
export class SevenCommitionPayComponent implements OnInit, OnChanges {
    form7pc: FormGroup;

    payBandCtrl: FormControl = new FormControl();
    // gradePayCtrl: FormControl = new FormControl;
    // payScaleCtrl: FormControl = new FormControl;
    payCommIdCtrl: FormControl = new FormControl();
    payLevelCtrl: FormControl = new FormControl();
    cellIdCtrl: FormControl = new FormControl();
    errorMessages = pvuMessage;
    @Input() payCommissionList = [];
    @Input() employeeDetail = null;
    @Input() effictiveDate = null;
    @Input() fixPay;
    @Input() resetPaybandVal: boolean;
    @Output() resetPaybandEvent: EventEmitter<boolean> = new EventEmitter();

    // payBandList = [];
    payLevelList = [];
    cellList = [];
    payMasterData: any;
    constructor(
        public fb: FormBuilder,
        private toastr: ToastrService,
        private fixToRegularService: FixToRegularService,
        private datepipe: DatePipe
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
            this.form7pc.patchValue({ benEffDate: this.fixToRegularService.changeDateFormat(this.effictiveDate) });

            const setDate = this.setNextIncrDate(this.effictiveDate);
            this.form7pc.patchValue({ dateOfNxtInc: setDate });
        }
    }

    setNextIncrDate(effictiveDate) {
        let effDateYear = new Date(effictiveDate).getFullYear();
        let effMonth = new Date(effictiveDate).getMonth() + 1;
        const effDate = new Date(effictiveDate).getDate();

        if (effDate === 1 && effMonth === 1) {
            effMonth = 7;
        } else if (effDate === 1 && effMonth === 7) {
            effDateYear = effDateYear + 1;
            effMonth = 1;
        } else if (effDate > 1 && effMonth >= 7) {
            effMonth = 7;
            effDateYear = effDateYear + 1;
        } else {
            effMonth = 1;
            effDateYear = effDateYear + 1;
        }
        return this.fixToRegularService.changeDateFormat(new Date(effMonth + '/' + 1 + '/' + effDateYear));
    }

    ngOnInit(): void {}

    /**
     * @method createEventForm
     * @description Function is called to initialize form group for event details
     */
    createForm() {
        this.form7pc = this.fb.group({
            payCommId: [152],
            payLevelId: [0, Validators.required],
            cellId: ['', Validators.required],
            cellPID: [''],
            basicPay: ['', Validators.required],
            benEffDate: ['', Validators.required],
            dateOfNxtInc: ['', Validators.required]
        });
    }

    onCellChange(cellId) {
        const cellObj = this.cellList.find(elm => elm.id === cellId);
        this.form7pc.patchValue({
            basicPay: cellObj.value
        });
    }

    /**
     * @method onPayLevelChange
     * @description Function is called to take necessary actions on pay level change
     */
    onPayLevelChange(value, reset = false) {
        if (!reset) {
            this.resetPaybandEvent.emit(this.resetPaybandVal);
        } else {
            this.resetPaybandEvent.emit(reset);
        }
        const dataToSend = {
            payLevel: value
        };

        this.fixToRegularService.getCell(dataToSend).subscribe(
            res => {
                if (res['status'] === 200 && res['result']) {
                    this.cellList = res['result'];
                    if (this.cellList.length > 0) {
                        this.form7pc.patchValue({
                            cellId: this.cellList[0].id,
                            cellPID: this.cellList[0].payCellId,
                        });
                        this.onCellChange(this.cellList[0].id);
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
     * @method getPayMasters
     * @description Function is called to get all paymasters according to department category
     */
    getPayMasters(departmentCategoryId, basicPay) {
        const dataToSend = {
            deptCatId: departmentCategoryId,
            fixPay: basicPay
        };

        this.fixToRegularService.getPayLevel(dataToSend).subscribe(
            res => {
                if (res['status'] === 200 && res['result']) {
                    this.payLevelList = res['result'];
                     if (this.payLevelList.length === 1) {
                        this.form7pc.patchValue({
                            payLevelId: this.payLevelList[0].id
                        });
                        this.onPayLevelChange(this.payLevelList[0].id);
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
}
