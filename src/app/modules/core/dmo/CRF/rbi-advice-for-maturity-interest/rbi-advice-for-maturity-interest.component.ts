import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { dmoMessage } from 'src/app/common/error-message/common-message.constants';
import { CommonListing } from 'src/app/models/common-listing';
import { CommonService } from 'src/app/modules/services/common.service';
import { StorageService } from 'src/app/shared/services/storage.service';

@Component({
    selector: 'app-rbi-advice-for-maturity-interest',
    templateUrl: './rbi-advice-for-maturity-interest.component.html',
    styleUrls: ['./rbi-advice-for-maturity-interest.component.css']
})
export class RbiAdviceForMaturityInterestComponent implements OnInit {
    // Entry Field Details
    // transType_List: CommonListing[] = [
    //   { value: '1', viewValue: 'Interest Accured' },
    //   { value: '2', viewValue: 'Interest Maturity' },
    // ];

    transType_List = [];
    // secName_List: CommonListing[] = [
    //     { value: '1', viewValue: 'Mr. B.S.Patel' },
    //     { value: '2', viewValue: 'Mr. A.A.Patel' }
    // ];
    secName_List;


    detailsForm: FormGroup;
    transTypeCtrl: FormControl = new FormControl();
    secNameCtrl: FormControl = new FormControl();
    payTypeCtrl: FormControl = new FormControl();
    maxDate = new Date();
    todayDate = Date.now();
    chNoCtrl: FormControl = new FormControl();
    errorMessages = dmoMessage;
    accountType = null;
    constructor(
        private fb: FormBuilder,
        private router: Router,
        private toastr: ToastrService,
        private commanService: CommonService,
        private storageService: StorageService
    ) {}

    ngOnInit() {
        const obj = {
            access_token: 'c1221382-7b73-4082-ac56-055dc11dc039'
        };
        this.storageService.set('currentUser', obj);
        this.detailsForm = this.fb.group({
            transType: [''],
            balGrf: [''],
            rbiAdvNo: [''],
            rbiAdvDate: [''],
            secName: [''],
            trensDate: [''],
            intAmt: [''],
            totAmt: [''],
            progBal: ['']
        });

        this.getAccoutType();
        this.getTypeofTranscation();
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
        console.log('saveDrailts call');
        const param = {
            accountType: this.accountType ? this.accountType.name : null,
            accountTypeId: this.accountType ? this.accountType.id : null,
            transactTypeId: this.detailsForm.value.transType,
            rbiAdviceNo: this.detailsForm.value.rbiAdvNo,
            rbiAdviceDt: this.formatDate(this.detailsForm.value.rbiAdvDate),
            currAccBal: this.detailsForm.value.balGrf,
            securityTypeId: this.detailsForm.value.secName,
            transactionDt: this.formatDate(this.detailsForm.value.trensDate),
            interestAmt: this.detailsForm.value.intAmt,
            totalAmount: this.detailsForm.value.totAmt,
            progBalAcc: this.detailsForm.value.progBal
        };
        const url = 'dmo/grfcrf/201';
        this.commanService.adviceForAccuredInterest(param, url).subscribe(
            res => {
                if (res && res['result'] && res['status'] === 200) {
                    if (res['result'] !== null) {
                        this.toastr.success(res['message']);
                        console.log(res['result']);
                    } else {
                        this.toastr.error(res['message']);
                    }
                }
            },
            err => {
                this.toastr.error(err);
            }
        );
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
                            if (item.name == 'CRF') {
                                this.accountType = item;
                                this.getNameOfSecurity();
                            }
                        });
                    }
                }                
            },
            err => {}
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
            err => {}
        );
    }

    getNameOfSecurity() {
        console.log('hii')
        const param = {
            accountType: this.accountType ? this.accountType.name : null,
            accountTypeId: this.accountType ? this.accountType.id : null,
        };
        const url = 'dmo/grfcrf/202';
        this.commanService.getNameSecurity(param, url).subscribe(
            res => {
                if (res && res['result'] && res['status'] === 200) {
                    if (res['result'] !== null) {
                        console.log(res['result']);
                        this.secName_List = res['result'];
                    }
                }
            },
            err => {}
        );
    }
}
