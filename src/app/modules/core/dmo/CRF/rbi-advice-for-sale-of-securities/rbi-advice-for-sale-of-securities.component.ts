import { CommonDirective } from 'src/app/common/directive/validation.directive';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { RbiAdviceForSaleOfSecurities, RbiAdviceForSaleOfSecurities1 } from 'src/app/models/dmo/dmo';
import { MatTableDataSource } from '@angular/material/table';
import { CommonListing } from 'src/app/models/common-listing';
import { dmoMessage } from 'src/app/common/error-message/common-message.constants';
import { CommonService } from 'src/app/modules/services/common.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-rbi-advice-for-sale-of-securities',
    templateUrl: './rbi-advice-for-sale-of-securities.component.html',
    styleUrls: ['./rbi-advice-for-sale-of-securities.component.css']
})
export class RbiAdviceForSaleOfSecuritiesComponent implements OnInit {
    rbiAdviceForSaleOfSecuritiesForm: FormGroup;
    typeOfLoanCtrl = new FormControl();
    maxDate = new Date();
    todayDate = Date.now();
    accountType = null;
    // List
    // typeOfSecurity_list: CommonListing[] = [
    //     { value: '1', viewValue: 'Type 1' },
    //     { value: '2', viewValue: 'Type 2' }
    // ];

    typeOfSecurity_list = [];
    // table data
    Element_Data: RbiAdviceForSaleOfSecurities1[] = [
        {
            securityTypeId: '',
            currFaceValue: '',
            faceValSecSold: '',
            unitsSoldNo: '',
            salesPrice: '',
            saleSecRelzdAmt: '',
            brokenDays: '',
            accrIntrstRecv: '',
            totalRelzdAmt: ''
        }
    ];

    dataSource = new MatTableDataSource<RbiAdviceForSaleOfSecurities1>(this.Element_Data);

    displayedColumns: any[] = [
        'securityTypeId',
        'currFaceValue',
        'faceValSecSold',
        'unitsSoldNo',
        'salesPrice',
        'saleSecRelzdAmt',
        'brokenDays',
        'accrIntrstRecv',
        'totalRelzdAmt',
        'action'
    ];
    errorMessages = dmoMessage;
    directiveObj = new CommonDirective();
    constructor(
        private fb: FormBuilder,
        private toastr: ToastrService,
        private router: Router,
        private commanService: CommonService,
        private storageService: StorageService
    ) {}

    ngOnInit() {
        const obj = {
            access_token: 'c5263f0e-88aa-4058-81af-6884818fcbf6'
        };
        this.storageService.set('currentUser', obj);
        this.rbiAdviceForSaleOfSecuritiesForm = this.fb.group({
            dateOfSale: [''],
            balanceInCsfCurrentAc: [''],
            rbiAdviceNo: [''],
            rbiAdviceDate: [''],
            amountTransferredToStateAccountRs: [''],
            progressiveBalanceInCsfCurrentACRs: ['']
        });

        this.getAccoutType();
    }
    addRow() {
        this.dataSource.data.push({
            securityTypeId: '',
            currFaceValue: '',
            faceValSecSold: '',
            unitsSoldNo: '',
            salesPrice: '',
            saleSecRelzdAmt: '',
            brokenDays: '',
            accrIntrstRecv: '',
            totalRelzdAmt: ''
        });
        this.dataSource.data = this.dataSource.data;
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
        // console.log('saveDrailts call', this.dataSource.data);
        const payload = {
            accountType: this.accountType ? this.accountType.name : null,
            accountTypeId: this.accountType ? this.accountType.id : null,
            saleDt: this.formatDate(this.rbiAdviceForSaleOfSecuritiesForm.value.dateOfSale),
            rbiAdviceNo: this.rbiAdviceForSaleOfSecuritiesForm.value.rbiAdviceNo,
            rbiAdviceDt: this.formatDate(this.rbiAdviceForSaleOfSecuritiesForm.value.rbiAdviceDate),
            currAccBal: this.rbiAdviceForSaleOfSecuritiesForm.value.balanceInCsfCurrentAc,
            stAccTransfrAmt: this.rbiAdviceForSaleOfSecuritiesForm.value.amountTransferredToStateAccountRs,
            progBalAcc: this.rbiAdviceForSaleOfSecuritiesForm.value.progressiveBalanceInCsfCurrentACRs,
            totalSecurityAmt: null,
            transactTypeId: '1944',
            transactionDt: '2021-08-28',
            interestAmt: 100.0,
            secSaleId: 1
        };
        console.log('saveDrailts call1', this.dataSource.data);
        const dataTable_details = JSON.parse(JSON.stringify(this.dataSource.data));

        dataTable_details.filter(item => {
            Object.assign(item, payload);
        });
        console.log('saveDrailts call1', dataTable_details);

        const param = {
            salesSec: dataTable_details
        };

        const url = 'dmo/grfcrf/204';
        this.commanService.saleofSecurities(param, url).subscribe(
            res => {
                if (res && res['result'] && res['status'] === 200) {
                    if (res['result'] !== null) {
                        this.toastr.success(res['message']);
                        console.log('result', res['result']);
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

    getNameOfSecurity() {
        console.log('hii');
        const param = {
            accountType: this.accountType ? this.accountType.name : null,
            accountTypeId: this.accountType ? this.accountType.id : null
        };
        const url = 'dmo/grfcrf/202';
        this.commanService.getNameSecurity(param, url).subscribe(
            res => {
                if (res && res['result'] && res['status'] === 200) {
                    if (res['result'] !== null) {
                        console.log(res['result']);
                        this.typeOfSecurity_list = res['result'];
                    }
                }
            },
            err => {}
        );
    }
}
