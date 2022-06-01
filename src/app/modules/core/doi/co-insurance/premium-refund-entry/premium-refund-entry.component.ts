import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { doiMessage } from 'src/app/common/error-message/common-message.constants';
import { CommonListing, ListValue } from 'src/app/models/common-listing';
import { PremiumRefundEntry } from 'src/app/models/doi/doiModel';
import { DatePipe } from '@angular/common';
import { DoiService } from '../../service/doi.service';
import { APIConst } from 'src/app/shared/constants/doi/doi-api.constants';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-premium-refund-entry',
  templateUrl: './premium-refund-entry.component.html',
  styleUrls: ['./premium-refund-entry.component.css']
})
export class PremiumRefundEntryComponent implements OnInit {

  todayDate = new Date();
  premiumRefundEntryForm: FormGroup;
  errorMessage = doiMessage;

  nameCtrl: FormControl = new FormControl();
  policyNoCtrl: FormControl = new FormControl();
  majorHeadCtrl: FormControl = new FormControl();
  subMajorHeadCtrl: FormControl = new FormControl();
  minorHeadCtrl: FormControl = new FormControl();

  nameList: ListValue[] = [];

  policyNoList: ListValue[] = [];

  subMajorHeadList: CommonListing[] = [
    {
      value: '1',
      viewValue: '00:Secretariat-Economic Services'
    },

    {
      value: '2',
      viewValue: '00:Capital Outlay on other General Economics Services'
    },

    {
      value: '3',
      viewValue: '00:Crop Husbandry'
    },

    {
      value: '4',
      viewValue: '00:Secretariat-Economic Services'
    },

    {
      value: '5',
      viewValue: '00::Capital Outlay on other General Economics Services'
    },

    {
      value: '6',
      viewValue: '01:Civil'
    },

    {
      value: '7',
      viewValue: '00:Stationery and Printing'
    },

    {
      value: '8',
      viewValue: '00::Co-operation'
    },
  ];

  majorHead_list: CommonListing[] = [
    { value: '1', viewValue: '3451:Secretariat-Economic Services' },
    { value: '2', viewValue: '5475:Capital Outlay on other General Economics Services' },
    { value: '3', viewValue: '2401:Crop Husbandry' },
    { value: '4', viewValue: '2071:Pensions and Other Retirement Benefits' },
    { value: '5,', viewValue: '2058:Stationery and Printing' },
    { value: '6', viewValue: '8235:General & Other Reserve Fund' },
  ];

  minorHead_list: CommonListing[] = [];

  columns: string[] = [
    'leaderName',
    'policyNo',
    'period',
    'premiumAmount',
    'refundAmount',
    'reason',
    'majorHead',
    'subMajorHead',
    'minorHead',
    'action',
  ];
  elementData: any[] = [
    {
      leaderName: '',
      policyNo: '',
      period: '',
      premiumAmount: '',
      refundAmount: '',
      reason: '',
      majorHead: '',
      subMajorHead: '',
      minorHead: '',
    }
  ];
  dataSource = new MatTableDataSource<any>(this.elementData);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private fb: FormBuilder, private router: Router, private workflowService: DoiService, private datePipe: DatePipe, private toastr: ToastrService) { }

  ngOnInit() {
    this.getLeaderNameList();
    this.getPolicyNoList();
    this.getMinorHeadList();
    this.dataSource.paginator = this.paginator;
    this.premiumRefundEntryForm = this.fb.group({
      name: [''],
      policyNo: [''],
      chNo: [{ value: 'ACP/254454', disabled: true }],
      chDate: [{ value: new Date(), disabled: true }],
      policyStartDate: [{ value: '', disabled: true }],
      policyEndDate: [{ value: '', disabled: true }],
      insuredName: [{ value: '', disabled: true }],
      premiumAmount: [{ value: '', disabled: true }],
      refundAmount: [''],
      refundAmountWords: [{ value: '', disabled: true }],
      reason: [''],
      majorHead: ['6'],
      subMajorHead: [''],
      minorHead: [''],
      endorsementNo: [''],
      endorsementDate: [''],
      gIFPremiumRefundNo: ['']
    });
  }

  private getLeaderNameList() {
    let passData: any = {name:APIConst.DOI_CO_INSURANCE_LEADER_NAME}
    this.workflowService.getData(passData,APIConst.DOI_GET_DROPDOWN_DATA).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.nameList = resp.result;
          
        }
      }
    );
  }

  private getPolicyNoList() {
    let passData: any = {name:APIConst.DOI_COINS_POL_ENTRY_LIST_POLICY_NO}
    this.workflowService.getData(passData,APIConst.DOI_GET_DROPDOWN_DATA).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.policyNoList = resp.result;
          
        }
      }
    );
  }
  private getMinorHeadList() {
    let passData: any = {name:APIConst.DOI_CO_INSURANCE_MINOR_HEAD}
    this.workflowService.getData(passData,APIConst.DOI_GET_DROPDOWN_DATA).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.minorHead_list = resp.result;
          
        }
      }
    );
  }

  addRecord() {

  }

  onSubmit() {
	if(this.premiumRefundEntryForm.valid){
		let payload: PremiumRefundEntry = new PremiumRefundEntry();
		payload.coinsPremRefundId = this.premiumRefundEntryForm.controls.gIFPremiumRefundNo.value;
		payload.insuredName = this.premiumRefundEntryForm.controls.insuredName.value;
		//payload.leaderId = this.premiumRefundEntryForm.controls.challanNo.value;
		payload.leaderName = this.premiumRefundEntryForm.controls.name.value;
		payload.leaderPolicyNo = this.premiumRefundEntryForm.controls.policyNo.value;
		payload.majorheadId = this.premiumRefundEntryForm.controls.majorHead.value;
		payload.minorheadId = this.premiumRefundEntryForm.controls.minorHead.value;
		payload.policyEndDt = this.dateFormatter(this.premiumRefundEntryForm.controls.policyEndDate.value,'yyyy-MM-dd');
		payload.policyStartDt = this.dateFormatter(this.premiumRefundEntryForm.controls.policyStartDate.value,'yyyy-MM-dd');
		payload.premiumAmount = this.premiumRefundEntryForm.controls.premiumAmount.value;
		payload.referenceDt = this.dateFormatter(this.premiumRefundEntryForm.controls.endorsementDate.value,'yyyy-MM-dd');	
		payload.referenceNo = this.premiumRefundEntryForm.controls.endorsementNo.value;
		payload.refundAmount = this.premiumRefundEntryForm.controls.refundAmount.value;
		payload.refundAmountWords = this.premiumRefundEntryForm.controls.refundAmountWords.value;
		payload.refundReason = this.premiumRefundEntryForm.controls.reason.value;
		payload.submajorheadId = this.premiumRefundEntryForm.controls.subMajorHead.value;
		console.log(payload)
		this.workflowService.saveDocumentsData(APIConst.DOI_COINSURANCE_PREMIUM_REFUND_ENTRY, payload).subscribe(
		  (data) => {
        if (data && data['result'] && data['status'] === 200) {
          this.toastr.success('Premium Refund Policy Created Successfully');
        }
      },
		  error => {
        this.toastr.error(error);
		  }
		);
	}
  }
  changeAmount(){
    let number = this.premiumRefundEntryForm.controls.refundAmount.value
    const first = ['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ','eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '];
    const tens = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];
    const mad = ['', 'thousand', 'million', 'billion', 'trillion'];
    let word = '';

    for (let i = 0; i < mad.length; i++) {
      let tempNumber = number%(100*Math.pow(1000,i));
      if (Math.floor(tempNumber/Math.pow(1000,i)) !== 0) {
        if (Math.floor(tempNumber/Math.pow(1000,i)) < 20) {
          word = first[Math.floor(tempNumber/Math.pow(1000,i))] + mad[i] + ' ' + word;
        } else {
          word = tens[Math.floor(tempNumber/(10*Math.pow(1000,i)))] + '-' + first[Math.floor(tempNumber/Math.pow(1000,i))%10] + mad[i] + ' ' + word;
        }
      }

      tempNumber = number%(Math.pow(1000,i+1));
      if (Math.floor(tempNumber/(100*Math.pow(1000,i))) !== 0) word = first[Math.floor(tempNumber/(100*Math.pow(1000,i)))] + 'hunderd ' + word;
    }
    this.premiumRefundEntryForm.patchValue({
      refundAmountWords: word
    });
  }
  
  dateFormatter(date:string, pattern: string) {
    if(date !== undefined) {
      try {
        return this.datePipe.transform(new Date(date), pattern);
        } catch(Exception ) {
  
        }
    }
  }

  onReset() {
    this.premiumRefundEntryForm.reset();
  }

  goToListing() {
    this.router.navigate(['./dashboard/doi/co-insurance/premium-refund-listing']);
  }

  onCloseClaimEntry() {

  }

  edit() {

  }

  delete(index) {
    this.dataSource.data.splice(index, 1);
    this.dataSource.data = this.dataSource.data;
  }

  onPolicyNoSelection(event) {
    if (event.value) {
      this.premiumRefundEntryForm.patchValue({
        policyStartDate: new Date('04/01/2018'),
        policyEndDate: new Date('03/31/2019'),
        insuredName: 'Gujarat State Electricity Corporation',
        premiumAmount: '53275454',
      });
    }
  }

}
