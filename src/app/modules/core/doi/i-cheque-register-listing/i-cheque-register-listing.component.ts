import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DataService } from 'src/app/common/data.service';
import { CommonListing } from 'src/app/models/common-listing';
import { ListValue } from 'src/app/models/common-listing';
import { TalukaList } from 'src/app/models/doiModel';
import { APIConst } from 'src/app/shared/constants/doi/doi-api.constants';
import { DoiService } from '../service/doi.service';

@Component({
  selector: 'app-i-cheque-register-listing',
  templateUrl: './i-cheque-register-listing.component.html',
  styleUrls: ['./i-cheque-register-listing.component.css']
})
export class IChequeRegisterListingComponent implements OnInit {


  // date
  todayDate = new Date();
  // form group
  listingForm: FormGroup;
  // form control
  transTypeCtrl: FormControl = new FormControl();
  bankCtrl: FormControl = new FormControl();

  // lists start

  transType_list: CommonListing[] = [];
  bank_list: CommonListing[] = [];
  talukaNameList: CommonListing[];

  policyTypeList: CommonListing[] = [
    { value: '0', viewValue: 'Standard Fire & Special Perils Policy Schedule' },
    { value: '1', viewValue: 'Burglary & Housebreaking Policy' },
    { value: '2', viewValue: 'Electronics Equipment/Material Damage Schedule' },
    { value: '3', viewValue: 'Case-In-Transit Insurance' },
    { value: '4', viewValue: 'Terrorism Pool Insurance' }
  ];
  // lists end
  
  riskType_list: any[] = [];

  // table data start
  columns: string[] = [
    'position',
    'transType',
    'tranNo',
    'cheqDate',
    'bankName',
    'brName',
    'amt',
    'partyName',
    'challanNo',
    'challanDate',
    'doBoPlace',
    'riskType',
    'agenComm',
    'mobNo',
    'action'
  ];
  elementData: any[] = [];
  dataSource = new MatTableDataSource<any>(this.elementData);
  // table data end
  
  totalRecords: number = 0;
  pageSize:number = 10;
  pageIndex: number = 0;
	jsonArray: any = [];
  // constructor
  constructor(private fb: FormBuilder, private router: Router, private dataService: DataService, private workflowService: DoiService, private datePipe: DatePipe) { }

  ngOnInit() {
    this.getBankList();
    this.getRiskTypeList();
    this.getTransactionTypeList();
    this.listingForm = this.fb.group({
      transType: [''],
      challanTranNum: [''],
      monthVal: [''],
      banName: [''],
      partyName: [''],
      challNum: [''],
    });
	
	
	this.fetchAllCheckEntries();
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

  private getTransactionTypeList() {
    let passData: any = {name:APIConst.DOI_CO_INSURANCE_TRANSACTION_TYPE}
    this.workflowService.getData(passData,APIConst.DOI_GET_DROPDOWN_DATA).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.transType_list = resp.result;
          
        }
      }
    );
  }

  fetchAllCheckEntries() {
		const passData = {
      "pageIndex": this.pageIndex,
      "pageElement": this.pageSize,
	    "sortByColumn": 'transactionTypeId',
	    "sortOrder": 'asc',
      "jsonArr": this.jsonArray
    };
		this.workflowService.getData(passData,APIConst.DOI_COINSURANCE_CHECK_REGISTER_LISTING)
		.subscribe((data: any) => {
			const res = data && data.result ? data.result : null;
			const {size, totalElement} = res;
			this.totalRecords = totalElement;
			this.pageSize = size;
			this.dataSource = new MatTableDataSource<any>(this.listingData(data.result.result));
		});
	}
	
	listingData(result:any[]) {
		let Element_Data: any = [];
		let count :number = 1;
		result.forEach(element => {
		 let transTypeValue = this.transType_list.filter(x => x.value == (''+element.transactionTypeId));
		 let  transTypeValue1 = transTypeValue.length <= 0 ? '': transTypeValue[0].viewValue;
		 let riskTypeValue = this.riskType_list.filter(x => x.id == (''+element.riskTypeId));
		 let  riskTypeView = riskTypeValue.length <= 0 ? '': riskTypeValue[0].name;
		 const data = {
			srNo: count++,
			transType:  transTypeValue1,
			tranNo: element.transactionNo,
			cheqDate:element.chequeDt,
			bankName: element.bankName,
			brName: element.branchName,
			amt: element.transChequeAmount,
			partyName:element.partyName,
			challanNo: element.challanNo,
			challanDate: element.challanDt,
			doBoPlace: element.doBoPlace, 
			riskType: riskTypeView,
			agenComm:element.agentCommission,
			mobNo:element.mobileNo,
			action: '',
		}
		  
		 Element_Data.push(data);
		});
		return Element_Data;
	}
	
	searchDisplay() {
		const opt: any = [{}];
		let map = new Map<string, string>();
		let cnt = 0;
		if(this.listingForm.value.transType !== '' && this.listingForm.value.transType !==undefined) {
		  
		  opt[cnt++]= {'key':'transactionTypeId', 'value':this.listingForm.value.transType };
		}
		if(this.listingForm.value.challanTranNum !== '' && this.listingForm.value.challanTranNum !==undefined) {
		
		  opt[cnt++]= {'key':'transactionNo', 'value':this.listingForm.value.challanTranNum };
		}
		if(this.listingForm.value.banName !== '' && this.listingForm.value.banName !==undefined) {
	   
		  opt[cnt++]= {'key':'bankName', 'value':this.listingForm.value.banName };
		}
		if(this.listingForm.value.partyName !== '' && this.listingForm.value.partyName !==undefined) {
		  
		  opt[cnt++]= {'key':'partyName', 'value':this.listingForm.value.partyName };
		}
		if(this.listingForm.value.challNum !== '' && this.listingForm.value.challNum !==undefined) {
		  
		  opt[cnt++]= {'key':'challanNo', 'value':this.listingForm.value.challNum };
		}
		if(this.listingForm.value.monthVal !== '' && this.listingForm.value.monthVal !==undefined) {
		 
		  let date = this.dateFormatter(this.listingForm.value.monthVal,"yyyy-MM-dd");
		  opt[cnt++]= {'key':'month', 'value':date};
		}
		/*if(this.listingForm.value.toDate !== '' && this.listingForm.value.toDate !==undefined) {
		
		  let date = this.dateFormatter(this.listingForm.value.toDate,"dd/MM/yyyy");
		  opt[cnt++]= {'key':'chequeDt', 'value':date,'operation':'<=' };
		}
		opt[cnt++]= {'key':'activeStatus', 'value': "1" };
		*/
		this.jsonArray = opt;
		this.fetchAllCheckEntries();
	}
	
	dateFormatter(date:string, pattern: string) {
    let  date1 = new Date(date);
    return this.datePipe.transform(date, pattern);
   }
   
   onPaginateChange(event) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.fetchAllCheckEntries();
  }

  // reset form
  reset() {
    this.listingForm.reset();
  }

}
