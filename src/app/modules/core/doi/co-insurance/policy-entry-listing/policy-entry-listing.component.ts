import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ListValue } from 'src/app/models/common-listing';
import { APIConst } from 'src/app/shared/constants/doi/doi-api.constants';
import { DoiService } from '../../service/doi.service';
@Component({
  selector: 'app-policy-entry-listing',
  templateUrl: './policy-entry-listing.component.html',
  styleUrls: ['./policy-entry-listing.component.css']
})
export class PolicyEntryListingComponent implements OnInit {

  policyEntryListingForm: FormGroup;
  todayDate = new Date();

  nameCtrl: FormControl = new FormControl();
  policyNoCtrl: FormControl = new FormControl();
  insuredNameCtrl: FormControl = new FormControl();
  typeMonthCtrl: FormControl = new FormControl();
  typeOfYearCtrl: FormControl = new FormControl();
  policyTypeCtrl: FormControl = new FormControl();
  riskTypeCtrl: FormControl = new FormControl();

  nameList: ListValue[] = [];

  policyTypeList: ListValue[] = [];

  insuredNameList: ListValue[] = [];

  year_list: ListValue[] = [];
  month_list: ListValue[] = [];

  policyNoList: ListValue[] = [];

  riskType_list: any[] = [];

  displayedColumns: string[] = [
    'srNo',
    'policyType',
    'policyNo',
    'leaderName',
    'insuredName',
    'riskType',
    'riskDetails',
    'policyStartDate',
    'policyEndDate',
    'policyStatus',
    'sumInsured',
    'createModeON',
    'modifyModeON',
    'action',
  ];
  elementData: any[] = [];
  dataSource = new MatTableDataSource<any>(this.elementData);
  
  totalRecords: number = 0;
  pageSize:number = 10;
  pageIndex: number = 0;
  jsonArray: any = [];
  
  constructor(private fb: FormBuilder, private workflowService: DoiService) { }

  ngOnInit() {
    this.getPolicyTypeList();
    this.getMonthList();
    this.getLeaderNameList();
    this.getInsuredNameList();
    this.getPolicyNoList();
    this.getRiskTypeList();
    this.getYearList();
    this.policyEntryListingForm = this.fb.group({
      policyType: [''],
      name: [''],
      insuredName: [''],
      policyNo: [''],
      riskType: [''],
      month: [''],
      year: [''],
    });
	
	this.fetchAllPolicyEntries();
  }

  private getPolicyTypeList() {
    this.workflowService.getDataWithoutParams(APIConst.DOI_POLICY_TYPES_DROPDOWN).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.policyTypeList = resp.result;
          
        }
      }
    );
  }

  private getMonthList() {
    let passData: any = {name:APIConst.DOI_COINS_PRE_MONTH}
    this.workflowService.getData(passData,APIConst.DOI_GET_DROPDOWN_DATA).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.month_list = resp.result;
          
        }
      }
    );
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
  private getInsuredNameList() {
    let passData: any = {name:APIConst.DOI_CO_INSURANCE_INSURED_NAME}
    this.workflowService.getData(passData,APIConst.DOI_GET_DROPDOWN_DATA).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.insuredNameList = resp.result;
          
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

  private getYearList() {
    this.workflowService.getDataWithoutParams(APIConst.DOI_YEAR_LIST_DROPDOWN).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.year_list = resp.result;
          
        }
      }
    );
  }

	fetchAllPolicyEntries() {
		const passData = {
			pageIndex: this.pageIndex,
			// pageElement: this.pageElements,
			pageElement: this.pageSize,

			sortByColumn: 'coinsPolicyHdrId',
			sortOrder: 'asc',
			jsonArr: this.jsonArray
		 
		}
		this.workflowService.getData(passData,APIConst.DOI_COINSURANCE_POLICY_ENTRY_LISTING)
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
		 let policyTypeValue = this.policyTypeList.filter(x => x.value == (''+element.policyTypeId));
		 let  policyTypeValue1 = policyTypeValue.length <= 0 ? '': policyTypeValue[0].viewValue;
		 let riskTypeValue = this.riskType_list.filter(x => x.id == (''+element.riskTypeId));
		 let  riskTypeView = riskTypeValue.length <= 0 ? '': riskTypeValue[0].name;
		 const data = {
			srNo: count++,
			policyType:  policyTypeValue1,
			policyNo: element.policyNo,
			leaderName:element.leaderName,
			insuredName: element.insuredName,
			riskType: riskTypeView,
			riskDetails: element.riskDetails,
			policyStartDate:element.policyStartDt,
			policyEndDate: element.policyEndDt,
			policyStatus: element.activeStatus,
			sumInsured: element.basicSumInsrd, 
			createModeON: element.createdDate,
			modifyModeON:element.updatedDate,
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
		if(this.policyEntryListingForm.value.policyType !== '' && this.policyEntryListingForm.value.policyType !==undefined) {
		  
		  opt[cnt++]= {'key':'policyTypeId', 'value':this.policyEntryListingForm.value.policyType };
		}
		if(this.policyEntryListingForm.value.name !== '' && this.policyEntryListingForm.value.name !==undefined) {
		
		  opt[cnt++]= {'key':'leaderName', 'value':this.policyEntryListingForm.value.name };
		}
		if(this.policyEntryListingForm.value.insuredName !== '' && this.policyEntryListingForm.value.insuredName !==undefined) {
	   
		  opt[cnt++]= {'key':'insuredName', 'value':this.policyEntryListingForm.value.insuredName };
		}
		if(this.policyEntryListingForm.value.policyNo !== '' && this.policyEntryListingForm.value.policyNo !==undefined) {
		  
		  opt[cnt++]= {'key':'policyNo', 'value':this.policyEntryListingForm.value.policyNo };
		}
		if(this.policyEntryListingForm.value.riskType !== '' && this.policyEntryListingForm.value.riskType !==undefined) {
		  
		  opt[cnt++]= {'key':'riskTypeId', 'value':this.policyEntryListingForm.value.riskType };
		}
		if(this.policyEntryListingForm.value.month !== '' && this.policyEntryListingForm.value.month !==undefined) {
		  
		  opt[cnt++]= {'key':'month', 'value':this.policyEntryListingForm.value.month };
		}
		if(this.policyEntryListingForm.value.year !== '' && this.policyEntryListingForm.value.year !==undefined) {
		  
		  opt[cnt++]= {'key':'year', 'value':this.policyEntryListingForm.value.year };
		}
		/*if(this.policyEntryListingForm.value.fromDate !== '' && this.policyEntryListingForm.value.fromDate !==undefined) {
		 
		  let date = this.dateFormatter(this.policyEntryListingForm.value.fromDate,"dd/MM/yyyy");
		  opt[cnt++]= {'key':'createdDate', 'value':date, 'operation':'>='};
		}
		if(this.policyEntryListingForm.value.createdDate !== '' && this.policyEntryListingForm.value.createdDate !==undefined) {
		
		  let date = this.dateFormatter(this.policyEntryListingForm.value.toDate,"dd/MM/yyyy");
		  opt[cnt++]= {'key':'createdDate', 'value':date,'operation':'<=' };
		}
		opt[cnt++]= {'key':'activeStatus', 'value': "1" };
		*/
		
		this.jsonArray = opt;
		this.fetchAllPolicyEntries();
	}
	
	onPaginateChange(event) {
		this.pageSize = event.pageSize;
		this.pageIndex = event.pageIndex;
		this.fetchAllPolicyEntries();
	}

}
