import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { dmoMessage } from 'src/app/common/error-message/common-message.constants';
import { ListValue } from 'src/app/models/common-grant';
import { CommonService } from 'src/app/modules/services/common.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-rbi-advice-for-investment',
    templateUrl: './rbi-advice-for-investment.component.html',
    styleUrls: ['./rbi-advice-for-investment.component.css']
})
export class RBIAdviceForInvestmentComponent implements OnInit {
    // error msg
    errorMessages = dmoMessage;
    todayDate = new Date();
    // Form Group
    RBIAdviceForInvestmentForm: FormGroup;
    // Form Control
    investmentFromCtrl: FormControl = new FormControl();
    nameOfSecurityCtrl: FormControl = new FormControl();
    yearOfMaturityCtrl: FormControl = new FormControl();
    // List Value
    // investmentFromList: ListValue[] = [{ value: '1', viewValue: 'Normal Loan' }];
    investmentFromList = [];
    // investmentFromList  = [
    //     { id: 1946, name: 'Interest Earned', code: null, desc: null },
    //     { id: 1955, name: 'Principal Contribution', code: null, desc: null },
    //     { id: 1956, name: 'Maturity Proceeds', code: null, desc: null }
    // ];

    // nameOfSecurityList: ListValue[] = [{ value: '2', viewValue: 'Normal Loan' }];
    nameOfSecurityList = [];

    // yearOfMaturityList: ListValue[] = [{ value: '1', viewValue: 'Normal Loan' }];
    yearOfMaturityList = [];
    //   yearOfMaturityList = [ {
    //     "id": 1947,
    //     "name": "Normal Loan",
    //     "code": null,
    //     "desc": null
    // }];

    accountType = null;

    constructor(
        private fb: FormBuilder,
        private toastr: ToastrService,
        private commanService: CommonService,
        private storageService: StorageService
    ) {}

    ngOnInit() {
        const obj = {
            access_token: 'a932158a-4841-4e1c-ad9d-984dfecec332'
        };
        this.storageService.set('currentUser', obj);
        this.RBIAdviceForInvestmentForm = this.fb.group({
            dateOfInvestment: [''],
            balanceCSF: [''],
            RBIAdviceDate: [''],
            rbiAdviceno: [''],
            interestRate: [''],
            faceValue: [''],
            noOfUnits: [''],
            purchase: [''],
            brokenDays: [''],
            interestCost: [''],
            totalAmount: [''],
            investmentFrom: [''],
            nameOfSecurity: [''],
            yearOfMaturity: ['']
        });
        this.getAccoutType();
        this.getInvestmentForm();
        this.getYearsOfMaturity();
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
            investmentDt: this.formatDate(this.RBIAdviceForInvestmentForm.value.dateOfInvestment),
            investFrmId: this.RBIAdviceForInvestmentForm.value.investmentFrom,
            rbiAdviceNo: this.RBIAdviceForInvestmentForm.value.rbiAdviceno,
            rbiAdviceDt: this.formatDate(this.RBIAdviceForInvestmentForm.value.RBIAdviceDate),
            currAccBal: this.RBIAdviceForInvestmentForm.value.balanceCSF,
            securityTypeId: this.RBIAdviceForInvestmentForm.value.nameOfSecurity,
            interestRate: this.RBIAdviceForInvestmentForm.value.interestRate,
            yrOfMaturity: this.RBIAdviceForInvestmentForm.value.yearOfMaturity,
            investFaceVal: this.RBIAdviceForInvestmentForm.value.faceValue,
            noOfUnits: this.RBIAdviceForInvestmentForm.value.noOfUnits,
            purchasePrice: this.RBIAdviceForInvestmentForm.value.purchase,
            brokenDays: this.RBIAdviceForInvestmentForm.value.brokenDays,
            intrstBrknDays: this.RBIAdviceForInvestmentForm.value.interestCost,
            totDebitedAmt: this.RBIAdviceForInvestmentForm.value.totalAmount
        };

        const url = 'dmo/grfcrf/203';
        this.commanService.getAccoutType(param, url).subscribe(
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

    getInvestmentForm() {
        const param = {
            name: 'Investment Form'
        };
        const url = 'dmo/grfcrf/102';
        this.commanService.getInvestmentForm(param, url).subscribe(
            res => {
                if (res && res['result'] && res['status'] === 200) {
                    if (res['result'] !== null) {
                        console.log(res['result']);
                        this.investmentFromList = res['result'];
                    }
                }
            },
            err => {}
        );
    }

    getYearsOfMaturity() {
        const param = {
            name: 'Years of Maturity'
        };
        const url = 'dmo/grfcrf/102';
        this.commanService.getInvestmentForm(param, url).subscribe(
            res => {
                if (res && res['result'] && res['status'] === 200) {
                    if (res['result'] !== null) {
                        console.log(res['result']);
                        this.yearOfMaturityList = res['result'];
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
                        this.nameOfSecurityList = res['result'];
                    }
                }
            },
            err => {}
        );
    }
}
