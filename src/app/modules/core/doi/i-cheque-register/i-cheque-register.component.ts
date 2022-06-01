import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { doiMessage } from 'src/app/common/error-message/common-message.constants';
import { CheckRegister } from 'src/app/models/doi/doiModel';
import { DatePipe } from '@angular/common';
import { DoiService } from '../service/doi.service';
import { APIConst } from 'src/app/shared/constants/doi/doi-api.constants';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-i-cheque-register',
  templateUrl: './i-cheque-register.component.html',
  styleUrls: ['./i-cheque-register.component.css']
})
export class IChequeRegisterComponent implements OnInit {
  // Form Group
  chequeRegisterForm: FormGroup;
  // Date
  todayDate = new Date();
  // Form Control

  chequeTypeCtrl: FormControl = new FormControl();
  riskTypeCtrl: FormControl = new FormControl();
  bankCtrl: FormControl = new FormControl();
  branchNameCtrl: FormControl = new FormControl();
  // erromesage
  errorMessage = doiMessage;

  branchNameList: any[] = [];
  // Risk Type
  riskType_list: any[] = [];

  // cheque Type 
  chequeType_list: any[] = [
    {
      value: '1',
      viewValue: '2019'
    }
  ];
  // list
  bank_list: any[] = [];
  constructor(private fb: FormBuilder, private workflowService: DoiService, private datePipe: DatePipe, private toastr: ToastrService,) { }

  ngOnInit() {
    this.getBankList();
    this.getRiskTypeList();
    this.chequeRegisterForm = this.fb.group({
      agentCommission: [''],
      riskType: [''],
      challanNo: ['789'],
      challanDate: [new Date('30-May-18')],
      challanAmount: [''],
      amount: [''],
      chequeDate: [''],
      chequeNumber: [''],
      chequeType: [''],
      banName: [''],
      branchName: [''],
      placeDOBO: [''],
      receivedFrom: ['']
    });
  }

  private getBankList() {
    this.workflowService.getDataWithoutParams(APIConst.DOI_BANK_LIST).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.bank_list = resp.result;
          
        }
      }
    );
  }

  private getRiskTypeList() {
    let passData: any = {name:APIConst.DOI_RE_RISK_TYPE}
    this.workflowService.getData(passData,APIConst.DOI_GET_DROPDOWN_DATA).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.riskType_list = resp.result;
          
        }
      }
    );
  }

  // select taluka on basis of district
  selectBank() {
    const bank = this.chequeRegisterForm.value.banName;
    if (bank !== '' && bank != null) {
      this.workflowService.getRequestWithNumberPathVar(APIConst.DOI_BANK_BRANCH_LIST, bank).subscribe(
        (resp: any) => {
          if (resp && resp.result && resp.status === 200) {
            this.branchNameList = resp.result;
          }
        }
      );
      /*this.talukaNameList = this.taluka_list.filter(
        searchBy => searchBy.district.toLowerCase() === district.toLowerCase());*/
    }
  }

  onSubmit(){
	console.log(this.chequeRegisterForm.value);
	
	
	
  }
  
  saveData() {
	if(this.chequeRegisterForm.valid){
		let payload: CheckRegister = new CheckRegister();
		payload.agentCommission = this.chequeRegisterForm.controls.agentCommission.value;
		payload.riskTypeId = this.chequeRegisterForm.controls.riskType.value;
		payload.challanNo = this.chequeRegisterForm.controls.challanNo.value;
		payload.challanDt = this.dateFormatter(this.chequeRegisterForm.controls.challanDate.value,'yyyy-MM-dd');
		payload.challanAmount = this.chequeRegisterForm.controls.challanAmount.value;
		payload.transChequeAmount = this.chequeRegisterForm.controls.amount.value;
		payload.chequeDt = this.dateFormatter(this.chequeRegisterForm.controls.chequeDate.value,'yyyy-MM-dd');
		payload.chequeNo = this.chequeRegisterForm.controls.chequeNumber.value;
		payload.chequeTypeId = this.chequeRegisterForm.controls.chequeType.value;
		payload.bankId = this.chequeRegisterForm.controls.banName.value;
		payload.branchId = this.chequeRegisterForm.controls.branchName.value;
		payload.doBoPlace = this.chequeRegisterForm.controls.placeDOBO.value;
		payload.receivedFrom = this.chequeRegisterForm.controls.receivedFrom.value;
		console.log(payload)
		console.log(this.chequeRegisterForm.valid);
		this.workflowService.saveDocumentsData(APIConst.DOI_COINSURANCE_CHECK_REGISTER, payload).subscribe(
		  (data: any) => {
        if (data && data['result'] && data['status'] === 200) {
          this.toastr.success('Check Register Successfully');
        }
        
      },
		  error => {
        this.toastr.error(error);
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

}
