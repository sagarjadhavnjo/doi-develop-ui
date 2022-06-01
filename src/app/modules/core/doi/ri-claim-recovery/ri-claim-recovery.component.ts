import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DoiDirectives } from 'src/app/common/directive/doi';
import { doiMessage } from 'src/app/common/error-message/common-message.constants';
import { ListValue } from 'src/app/models/common-listing';
import { ReInsuranceClaimRecovery } from 'src/app/models/doi/doiModel';
import { DatePipe } from '@angular/common';
import { DoiService } from '../service/doi.service';
import { APIConst } from 'src/app/shared/constants/doi/doi-api.constants';

@Component({
  selector: 'app-ri-claim-recovery',
  templateUrl: './ri-claim-recovery.component.html',
  styleUrls: ['./ri-claim-recovery.component.css']
})
export class RiClaimRecoveryComponent implements OnInit {

  errorMessage = doiMessage;
  todayDate = new Date();
  isPolicyNo = false;
  riClaimRecoveryEntryForm: FormGroup;

  policyNoCtrl: FormControl = new FormControl();
  claimIdCtrl: FormControl = new FormControl();

  policyNoList: ListValue[] = [];

  claimIdList: ListValue[] = [];


  columns: string[] = [
    'companyName',
    'riShare',
    'riAmount',
    'challanNo',
    'challanDate',
    'remarks',
    'action',
  ];
  elementData: any[] = [
    {
      companyName: 'ABC Pvt. Ltd.',
      riShare: '5',
      riAmount: '6766767',
      challanNo: '',
      challanDate: '',
      remarks: '',
    }
  ];
  dataSource = new MatTableDataSource<any>(this.elementData);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private el: ElementRef, public dialog: MatDialog, private router: Router, private fb: FormBuilder, private workflowService: DoiService, private datePipe: DatePipe) { }
  directiveObject = new DoiDirectives(this.router, this.dialog);

  ngOnInit() {
    this.getPolicyNoList();
    this.getClaimIdList();
    this.dataSource.paginator = this.paginator;
    this.riClaimRecoveryEntryForm = this.fb.group({
      policyNo: [''],
      claimId: [''],
      insuredName: [{ value: '', disabled: true }],
      leaderName: [{ value: '', disabled: true }],
      claimAmount: [{ value: '', disabled: true }],
      gifShare: [{ value: '', disabled: true }],
      gifShareAmount: [{ value: '', disabled: true }],
    });
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
  private getClaimIdList() {
    let passData: any = {name:APIConst.DOI_CO_INSURANCE_CLAIM_ID}
    this.workflowService.getData(passData,APIConst.DOI_GET_DROPDOWN_DATA).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.claimIdList = resp.result;
          
        }
      }
    );
  }

  onSelectingPolicyNo(event) {
    if (event.value) {
      this.isPolicyNo = true;
      this.riClaimRecoveryEntryForm.patchValue({
        insuredName: 'Gujarat State Electricity Corporation',
        leaderName: 'Bajaj Allianz General Insurance Co. Ltd.',
      });
    }
  }

  onSelectingClaimId(event) {
    if (event.value) {
      if (this.isPolicyNo) {
        this.riClaimRecoveryEntryForm.patchValue({
          claimAmount: 95153840,
          gifShare: 25,
          gifShareAmount: 237884.6,
        });
      }
    }


  }

  calculateGifShareAmount() {
    let value = 0;
    let claimAmount = this.riClaimRecoveryEntryForm.controls['claimAmount'].value;
    let gifShare = this.riClaimRecoveryEntryForm.controls['gifShare'].value;
    value = Number(claimAmount) * (Number(gifShare) / 100);
    return value;
  }

  addColumn() {
    const data = this.dataSource.data;
    data.push({
      companyName: '',
      riShare: '',
      riAmount: '',
      challanNo: '',
      challanDate: '',
      remarks: '',
    });
    this.dataSource.data = data;
  }

  deleteColumn(index) {
    this.dataSource.data.splice(index, 1);
    this.dataSource.data = this.dataSource.data;
  }

  onSubmit() {
		if(this.riClaimRecoveryEntryForm.valid){
			let payload: ReInsuranceClaimRecovery = new ReInsuranceClaimRecovery();
			payload.riClaimId = this.riClaimRecoveryEntryForm.controls.claimId.value;
			payload.claimAmount = this.riClaimRecoveryEntryForm.controls.claimAmount.value;
			payload.claimId = this.riClaimRecoveryEntryForm.controls.claimId.value;
			payload.gifShareAmt = this.riClaimRecoveryEntryForm.controls.gifShareAmount.value;
			payload.gifSharePerc = this.riClaimRecoveryEntryForm.controls.gifShare.value;
			payload.insuredName = this.riClaimRecoveryEntryForm.controls.insuredName.value;
			payload.leaderName = this.riClaimRecoveryEntryForm.controls.leaderName.value;
			payload.policyNo = this.riClaimRecoveryEntryForm.controls.policyNo.value;
      payload.doiRiClaimDtl = [];
      this.dataSource.data.forEach((element, index) => {
				let temp:any = {};
				temp['riClaimDtlId'] = index;
				temp['challanDt'] = this.dateFormatter(element.challanDate,'yyyy-MM-dd');
				temp['challanNo'] = element.challanNo;
				temp['remarks'] = element.remarks;
				temp['riClaimAmt'] = element.riAmount;
				temp['riCompanyName'] = element.companyName;
				temp['riSharePerc'] = element.riShare;
				payload.doiRiClaimDtl.push(temp);
			});
      
      console.log(payload)
			this.workflowService.saveDocumentsData(APIConst.DOI_REINSURANCE_CLAIM_RECOVERY_ENTRY, payload).subscribe(
			  (data) => {},
			  error => {

			  }
			);
		}
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
    this.riClaimRecoveryEntryForm.reset();
  }
  goToListing() { }
  onCloseClaimEntry() { }

}
