import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { dmoMessage } from 'src/app/common/error-message/common-message.constants';
import { CommonService } from 'src/app/modules/services/common.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { CommonListing } from '../../../common/model/common-listing';

@Component({
    selector: 'app-intimation-for-purchase-sale',
    templateUrl: './intimation-for-purchase-sale.component.html',
    styleUrls: ['./intimation-for-purchase-sale.component.css']
})
export class IntimationForPurchaseSaleComponent implements OnInit {
    transType_List = [];

    chNo_List: CommonListing[] = [
        { value: '1', viewValue: '1' },
        { value: '2', viewValue: '2' }
    ];

    payType_List: CommonListing[] = [
        { value: '1', viewValue: 'Principal' },
        { value: '2', viewValue: 'Interest' }
    ];
    accountType = null;
    detailsForm: FormGroup;
    transTypeCtrl: FormControl = new FormControl();
    payTypeCtrl: FormControl = new FormControl();
    maxDate = new Date();
    todayDate = Date.now();
    chNoCtrl: FormControl = new FormControl();
    errorMessages = dmoMessage;

    constructor(
        private fb: FormBuilder,
        private storageService: StorageService,
        private router: Router,
        private commanService: CommonService
    ) { }

    ngOnInit() {
        const obj = {
            access_token: 'ae92c01a-a3bd-4d4b-b3db-32fe4aac6d32'
        };
        this.storageService.set('currentUser', obj);
        this.detailsForm = this.fb.group({
            transType: [''],
            intiNo: [''],
            intiDate: [''],
            princiContribu: [''],
            amtInti: [''],
            princiContribuAfter: [''],
            trensDate: ['']
        });
        this.getAccoutType();
        this.getTypeofTranscation();
    }
    getAccoutType() {
        const param = {
            name: 'Types of Loan Account'
        };
        const url = 'dmo/grfcrf/102';
        this.commanService.getAccoutType(param, url).subscribe(
            res => {
                if (res && res['result'] && res['status'] === 200) {
                    if (res['result'] !== null) {
                        res['result'].filter(item => {
                            if (item.name == 'GRF') {
                                this.accountType = item;
                            }
                        });
                    }
                }
            },
            err => { }
        );
    }

    getTypeofTranscation() {
        const param = {
            name: 'Intimation Type of Transaction'
        };
        const url = 'dmo/grfcrf/102';
        this.commanService.getTypeofTranscation(param, url).subscribe(
            res => {
                if (res && res['result'] && res['status'] === 200) {
                    if (res['result'] !== null) {
                        this.transType_List = res['result'];
                    }
                }
            },
            err => { }
        );
    }

    /**
     * To convert the date format into (yyyy-mm-dd)
     * @param date default date
     */
    formatDate(date) {
        if (date !== 0 && date !== null && date !== undefined && date !== '') {
            const datePipe = new DatePipe('en-US');
            return datePipe.transform(date, 'yyyy-MM-dd');
        } else {
            return '';
        }
    }

    saveDetails() {
        const param = {
            accountType: this.accountType ? this.accountType.name : null,
            accountTypeId: this.accountType ? this.accountType.id : null,
            transactTypeId: this.detailsForm.value.transType,
            intimationNo: this.detailsForm.value.intiNo,
            intimationDt: this.formatDate(this.detailsForm.value.intiDate),
            tillDtProgPncpl: this.detailsForm.value.princiContribu,
            intimatedAmt: this.detailsForm.value.amtInti,
            aftThisProgPncpl: this.detailsForm.value.princiContribuAfter,
            transactionDt: this.formatDate(this.detailsForm.value.trensDate)
        };
        const url = 'dmo/grfcrf/100';
        this.commanService.intimationforPurchaseSale(param, url).subscribe(
            res => {
                if (res && res['result'] && res['status'] === 200) {
                    if (res['result'] !== null) {
                        console.log(res['result']);
                    } else {

                    }
                }
            },
            err => {
            }
        );
    }

    onIntimationBlur() {
        this.getIntimationData();
    }
    getIntimationData() {
        const param = {
            accountType: this.accountType ? this.accountType.name : null,
            accountTypeId: this.accountType ? this.accountType.id : null,
            intimationNo: this.detailsForm.value.intiNo
        };
        const url = 'dmo/grfcrf/101';
        this.commanService.getIntimationData(param, url).subscribe(
            res => {
                if (res && res['result'] && res['status'] === 200) {
                    if (res['result'] !== null) {
                        console.log(res['result']);
                        const result = res['result'];
                        this.setUpdateData(result);
                    }
                }
            },
            err => { }
        );
    }
    setUpdateData(result) {
        console.log(result)

        this.detailsForm.setValue({
            transType: result.transactTypeId,
            intiNo: result.intimationNo,
            intiDate: result.intimationDt,
            princiContribu: result.tillDtProgPncpl,
            amtInti: result.intimatedAmt,
            princiContribuAfter: result.aftThisProgPncpl,
            trensDate: result.transactionDt
        });
    }
}
 