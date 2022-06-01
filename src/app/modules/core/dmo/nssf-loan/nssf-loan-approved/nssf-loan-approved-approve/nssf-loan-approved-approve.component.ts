import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { dmoMessage } from 'src/app/common/error-message/common-message.constants';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NssfLoanService } from '../../../services/nssf-loan.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nssf-loan-approved-approve',
  templateUrl: './nssf-loan-approved-approve.component.html',
  styleUrls: ['./nssf-loan-approved-approve.component.css']
})
export class NssfLoanApprovedApproveComponent implements OnInit {

  errorMessages = dmoMessage;

  approveForm: FormGroup;
  maxDate = new Date();
  todayDate = Date.now();
  nssfLoanId: any;
  nssfLoanData: any;

  constructor(private fb: FormBuilder
    , private router: Router
    , private _nssfLoanService: NssfLoanService
    , private _toast: ToastrService) { }

  ngOnInit() {
    this.approveForm = this.fb.group({
      loanNo: ['', Validators.required],
      sanctionNo: ['', Validators.required],
      sanctionDate: ['', Validators.required],
      loanReceiptDate: ['', Validators.required],
      loanAmount: ['', Validators.required],
      loanTenure: ['', Validators.required],
      moratoriumPeriod: ['', Validators.required],
      rateOfInterest: ['', Validators.required],
      principalInstalmentsInYear: ['', Validators.required],
      principalTotalNoOfInstalments: ['', Validators.required],
      interestInstalmentsInYear: ['', Validators.required],
      interestTotalNoOfInstalments: ['', Validators.required]
    });
    this.nssfLoanId = this._nssfLoanService.getLoanId();
    if(!this.nssfLoanId) {
      this.router.navigate(['/dashboard/dmo/nssf-loan-approved']);
    }
    this.fetchNssfLoanDetails();
  }

  fetchNssfLoanDetails() {
    this._nssfLoanService.fetchNssfLoanReceivedDetails({id: this.nssfLoanId}).subscribe((res: any) => {
      if (res && res.result && res.status === 200) {
        const element = res.result;
        this.nssfLoanData = res.result;
        const formValueObj: any = {
          id: element && element.id ? element.id : null,
          sanctionNo: element && element.sanctionOrderNo ? element.sanctionOrderNo : '',
          sanctionDate: element && element.sanctionOrderDate ? element.sanctionOrderDate : '',
          loanReceiptDate: element && element.loanReceiptDate ? element.loanReceiptDate : '',
          loanAmount: element && element.loanAmount ? element.loanAmount : '',
          loanTenure: element && element.loanTenure ? element.loanTenure : '',
          moratoriumPeriod: element && element.moratariumPeriod ? element.moratariumPeriod : '',
          rateOfInterest: element && element.loanROI ? element.loanROI : '',
          principalInstalmentsInYear: element && element.prncplInstallYear ? element.prncplInstallYear : '',
          principalTotalNoOfInstalments: element && element.totalPrncplInstall ? element.totalPrncplInstall : '',
          interestInstalmentsInYear: element && element.intrestInstallYear ? element.intrestInstallYear : '',
          interestTotalNoOfInstalments: element && element.totalPrncplInstall ? element.totalPrncplInstall : ''
        };
        this.approveForm.patchValue(formValueObj);
      }
    }, error => {

    })
  }

  onCancel() {
    this._nssfLoanService.setLoanId(null);
    this.router.navigate(['/dashboard/dmo/nssf-loan-approved']);
  }

  onApproveAndGenerate() {
    if(this.approveForm.valid) {
      const formObj: any = this.approveForm.getRawValue();
      const reqObj: any = {
        "nssfLoanId": this.nssfLoanData.id ? this.nssfLoanData.id : null,
        "loanNumber": formObj.loanNo ? formObj.loanNo : '',
        "dpSheetId": this.nssfLoanData.dpSheetId ? this.nssfLoanData.dpSheetId : '',
        "dpSheetRecDate": moment(this.nssfLoanData.dpSheetRecDate).format('YYYY-MM-DD'),
        "memono": this.nssfLoanData.memoNo ? this.nssfLoanData.memoNo : '',
        "adviceNo": this.nssfLoanData.adviceNo ? this.nssfLoanData.adviceNo : '',
        "adviceDate": this.nssfLoanData.adviceDate ? moment(this.nssfLoanData.adviceDate).format('YYYY-MM-DD') : '',
        "adviceBy": this.nssfLoanData.adviceBy ? this.nssfLoanData.adviceBy : '',
        "transactionDesc": this.nssfLoanData.transactionDescription ? this.nssfLoanData.transactionDescription : '',
        "creditAmount": this.nssfLoanData.creditAmount ? this.nssfLoanData.creditAmount : '',
        "sanctionOrderNo": formObj.sanctionNo ? formObj.sanctionNo : '',
        "organizationName": this.nssfLoanData.organizationName ? this.nssfLoanData.organizationName : '',
        "sanctionOrderDate": formObj.sanctionDate ? formObj.sanctionDate : '',
        "loanReceiptDate": formObj.loanReceiptDate ? moment(formObj.loanReceiptDate).format('YYYY-MM-DD') : '',
        "loanAmount": formObj.loanAmount ? formObj.loanAmount : '',
        "loanTenure": formObj.loanTenure ? formObj.loanTenure : '',
        "moratariumPeriod": formObj.moratoriumPeriod ? formObj.moratoriumPeriod : '',
        "loanROI": formObj.rateOfInterest ? formObj.rateOfInterest : '',
        "prncplInstallYear": formObj.principalInstalmentsInYear ? formObj.principalInstalmentsInYear : '',
        "totalPrncplInstall": formObj.principalTotalNoOfInstalments ? formObj.principalTotalNoOfInstalments : '',
        "intrestInstallYear": formObj.interestInstalmentsInYear ? formObj.interestInstalmentsInYear : '',
        "firstInstallDate": moment().format('YYYY-MM-DD')
      }
      this._nssfLoanService.submitNssfLoanData(reqObj).subscribe(res => {
        if (res && res['status'] && res['status'] === 200) {
          this._toast.success('Data submitted successfully.');
          this._nssfLoanService.setLoanId(this.nssfLoanData.id);
          this.router.navigate(['/dashboard/dmo/loan-repayment-schedule']);
        }
      }, error => {
        this._toast.error('Something went wrong.');
      })
    } else {
      this.approveForm.markAllAsTouched();
    }
  }
}
