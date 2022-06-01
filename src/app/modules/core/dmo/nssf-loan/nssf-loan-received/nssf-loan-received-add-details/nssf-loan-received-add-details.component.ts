import { DataService } from 'src/app/common/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { dmoMessage } from 'src/app/common/error-message/common-message.constants';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WorkflowDmoComponent } from '../../../workflow-dmo/workflow-dmo.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { msgConst } from 'src/app/shared/constants/dmo/dmo-msg.constants';
import { NssfLoanService } from '../../../services/nssf-loan.service';

@Component({
  selector: 'app-nssf-loan-received-add-details',
  templateUrl: './nssf-loan-received-add-details.component.html',
  styleUrls: ['./nssf-loan-received-add-details.component.css']
})
export class NssfLoanReceivedAddDetailsComponent implements OnInit, OnDestroy {
  errorMessages = dmoMessage;

  addDetailsForm: FormGroup;
  maxDate = new Date();
  todayDate = Date.now();
  data;
  nssfId: any;
  nssfLoanData: any;

  constructor(private fb: FormBuilder
    , private router: Router
    , private dialog: MatDialog
    , private dataService: DataService
    , private route: ActivatedRoute
    , private _nssfLoanService: NssfLoanService) {
    this.data = this.dataService.getOption();
    this.route.params.subscribe( params => {
      this.nssfId = params.id
    });
  }

  ngOnInit() {
    this.addDetailsForm = this.fb.group({
      id: [null],
      sanctionNo: ['', Validators.compose([Validators.required, Validators.maxLength(30)])],
      sanctionDate: ['', Validators.required],
      loanReceiptDate: ['', Validators.required],
      loanAmount: ['', Validators.required],
      loanTenure: ['', Validators.required],
      moratoriumPeriod: ['', Validators.required],
      rateOfInterest: ['', Validators.required],
      principalInstalmentsInYear: ['', Validators.required],
      principalTotalNoOfInstalments: ['', Validators.required],
      interestInstalmentsInYear: ['', Validators.required],
      interestTotalNoOfInstalments: ['', Validators.required],
    });
    if (this.data['fromApproved'] === 'viewMode') {
      this.addDetailsForm.controls.sanctionNo.disable();
      this.addDetailsForm.controls.sanctionDate.disable();
      this.addDetailsForm.controls.loanReceiptDate.disable();
      this.addDetailsForm.controls.loanAmount.disable();
      this.addDetailsForm.controls.loanTenure.disable();
      this.addDetailsForm.controls.moratoriumPeriod.disable();
      this.addDetailsForm.controls.rateOfInterest.disable();
      this.addDetailsForm.controls.principalInstalmentsInYear.disable();
      this.addDetailsForm.controls.principalTotalNoOfInstalments.disable();
      this.addDetailsForm.controls.interestInstalmentsInYear.disable();
      this.addDetailsForm.controls.interestTotalNoOfInstalments.disable();
      // this.data['fromApproved'] = '';
    } else {
      this.data['fromApproved'] = ''
    }

    if(this.nssfId) {
      this.fetchNssfLoanDetails();   // Temporary commented
    } else {
      const obj = this._nssfLoanService.getDPObj();
      if(obj) {
        this.nssfLoanData = obj;
      } else {
        this.router.navigate(['/dashboard/dmo/nssf-loan-received'])
      }
    }
  }

  ngOnDestroy() {
    this.data['fromApproved'] = ''
  }
  
  fetchNssfLoanDetails() {
    this._nssfLoanService.fetchNssfLoanReceivedDetails({id: this.nssfId}).subscribe((res: any) => {
      if (res && res.result && res.status === 200) {
        const element = res.result;
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
        this.addDetailsForm.patchValue(formValueObj);
        // NSSF load data
        this.nssfLoanData = {
          "dpSheetId": element.dpSheetId ? element.dpSheetId : null,
          "memoNo": element && element.memono ? element.memono : '',
          "adviceNo": element && element.adviceNo ? element.adviceNo : '',
          "dpSheetReciveDate": element && element.dpSheetRecDate ? element.dpSheetRecDate : null,
          "adviceDate":element && element.adviceDate ? element.adviceDate : null,
          "adviceBy":element && element.adviceBy ? element.adviceBy : '',
          "transactionDescription":element && element.transactionDesc ? element.transactionDesc : '',
          "creditAmount":element && element.creditAmount ? element.creditAmount : null
        }
      }
    }, error => {

    })
  }

  onCancel() {
    this._nssfLoanService.setDPData(null);
    if(this.nssfId) {
      this.router.navigate(['/dashboard/dmo/nssf-loan-approved']);
    } else {
      this.router.navigate(['/dashboard/dmo/nssf-loan-received']);
    }
  }

  onSubmit(): void {
    if (this.addDetailsForm.valid) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          width: '360px',
          data: msgConst.CONFIRMATION_DIALOG.CONFIRMATION
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result === 'yes') {
          const workflowData = this.addDetailsForm.getRawValue();
          const dialogRef = this.dialog.open(WorkflowDmoComponent, {
            width: '1200px',
            height: '600px',
            data: {...workflowData, ...this.nssfLoanData}
          });
          dialogRef.afterClosed().subscribe(result => {
            if (result === 'submit') {
              this.router.navigate(['/dashboard/dmo/nssf-loan-approved']);
            }
          });
        }
      })
    } else {
      this.addDetailsForm.markAllAsTouched();
    }
  }
}
