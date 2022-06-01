import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { CommonListing, ListValue } from 'src/app/models/common-listing';
import { PremiumRefundListing } from 'src/app/models/doiModel';
import { APIConst } from 'src/app/shared/constants/doi/doi-api.constants';
import { DoiService } from '../../service/doi.service';

@Component({
  selector: 'app-premium-refund-listing',
  templateUrl: './premium-refund-listing.component.html',
  styleUrls: ['./premium-refund-listing.component.css']
})
export class PremiumRefundListingComponent implements OnInit {

  todayDate = new Date();
  premiumRefundListingForm: FormGroup;

  nameCtrl: FormControl = new FormControl();
  policyNoCtrl: FormControl = new FormControl();
  claimIdCtrl: FormControl = new FormControl();
  insuredNameCtrl: FormControl = new FormControl();
  typeMonthCtrl: FormControl = new FormControl();
  typeOfYearCtrl: FormControl = new FormControl();

  nameList: ListValue[] = [];

  claimIdList: ListValue[] = [];

  insuredNameList: ListValue[] = [];

  year_list: ListValue[] = [];
  month_list: ListValue[] = [];

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

  minorHead_list: any[] = [];

  displayedColumns: string[] = [
    'srNo',
    'claimId',
    'policyNo',
    'leaderName',
    'insuredName',
    'premiumAmount',
    'refundAmount',
    'reason',
    'majorHead',
    'subMajorHead',
    'minorHead',
    'createModeON',
    'modifyModeON',
    'status',
    'action',
  ];

  ELEMENT_DATA: any[] = [
    {
      claimId: '271',
      policyNo: 'DOI/48/P/2019-20/000001',
      leaderName: 'Bajaj Allianz General Insurance Co. Ltd.',
      insuredName: 'Gujarat State Electricity Corporation',
      premiumAmount: '53275454',
      refundAmount: '237884.6',
      reason: 'Fire due to heavy flash over in joining kit of R-Phase of 400 KV 1200 sq. mm EHV XLPE cable',
      majorHead: '5475:Capital Outlay on other Economic Services',
      subMajorHead: '00: Co-operation',
      minorHead: '101:Direction and Adminstration',
      createModeON: '22-Apr-2018 12:22PM',
      modifyModeON: '22-Jun-2018 01:22PM',
      status: 'Approve'
    }

  ];
  

  dataSource = new MatTableDataSource<PremiumRefundListing>(this.ELEMENT_DATA);
  
  totalRecords: number = 0;
  pageSize:number = 10;
  pageIndex: number = 0;
  jsonArray: any = [];

  constructor(private fb: FormBuilder, private workflowService: DoiService) { }

	ngOnInit() {
    this.getMonthList();
    this.getLeaderNameList();
    this.getInsuredNameList();
    this.getPolicyNoList();
    this.getClaimIdList();
    this.getYearList();
    this.getMinorHeadList();
		this.premiumRefundListingForm = this.fb.group({
		  name: [''],
		  policyNo: [''],
		  claimId: [''],
		  insuredName: [''],
		  month: [''],
		  year: [''],
		});
		this.fetchAllRefundEntries();
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

  private getYearList() {
    this.workflowService.getDataWithoutParams(APIConst.DOI_YEAR_LIST_DROPDOWN).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.year_list = resp.result;
          
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
  
	fetchAllRefundEntries() {
		const passData = {
			pageIndex: this.pageIndex,
			// pageElement: this.pageElements,
			pageElement: this.pageSize,

			sortByColumn: 'coinsPremRefundId',
			sortOrder: 'asc',
			jsonArr: this.jsonArray
		 
		}
		this.workflowService.getData(passData,APIConst.DOI_COINSURANCE_PREMIUM_REFUND_LISTING)
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
		 let claimIdValue = this.claimIdList.filter(x => x.value == (''+element.coinsPremRefundId));
		 let claimIdValue1 = claimIdValue.length <= 0 ? '': claimIdValue[0].viewValue;
		 let majorHeadValue = this.majorHead_list.filter(x => x.value == (''+element.majorheadId));
		 let majorHeadValue1 = majorHeadValue.length <= 0 ? '': majorHeadValue[0].viewValue;
		 let subMajorHeadValue = this.subMajorHeadList.filter(x => x.value == (''+element.submajorheadId));
		 let subMajorHeadValue1 = subMajorHeadValue.length <= 0 ? '': subMajorHeadValue[0].viewValue;
		 let minorHeadValue = this.minorHead_list.filter(x => x.id == (''+element.minorheadId));
		 let minorHeadValue1 = minorHeadValue.length <= 0 ? '': minorHeadValue[0].name;
		 const data = {
			srNo: count++,
			claimId: claimIdValue1,
			policyNo: element.leaderPolicyNo,
			leaderName: element.leaderName,
			insuredName: element.insuredName,
			premiumAmount: element.premiumAmount,
			refundAmount: element.refundAmount,
			reason: element.refundReason,
			majorHead: majorHeadValue1,
			subMajorHead: subMajorHeadValue1,
			minorHead: minorHeadValue1,
			createModeON: element.createdDate,
			modifyModeON: element.updatedDate,
			status: element.activeStatus,
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
		if(this.premiumRefundListingForm.value.name !== '' && this.premiumRefundListingForm.value.name !==undefined) {
		  
		  opt[cnt++]= {'key':'leaderName', 'value':this.premiumRefundListingForm.value.name };
		}
		if(this.premiumRefundListingForm.value.policyNo !== '' && this.premiumRefundListingForm.value.policyNo !==undefined) {
		
		  opt[cnt++]= {'key':'leaderPolicyNo', 'value':this.premiumRefundListingForm.value.policyNo };
		}
		if(this.premiumRefundListingForm.value.insuredName !== '' && this.premiumRefundListingForm.value.insuredName !==undefined) {
	   
		  opt[cnt++]= {'key':'insuredName', 'value':this.premiumRefundListingForm.value.insuredName };
		}
		
		/*if(this.premiumRefundListingForm.value.claimId !== '' && this.premiumRefundListingForm.value.claimId !==undefined) {
	   
		  opt[cnt++]= {'key':'claimId', 'value':this.premiumRefundListingForm.value.claimId };
		}*/
		if(this.premiumRefundListingForm.value.month !== '' && this.premiumRefundListingForm.value.month !==undefined) {
	   
		  opt[cnt++]= {'key':'month', 'value':this.premiumRefundListingForm.value.month };
		}
		if(this.premiumRefundListingForm.value.year !== '' && this.premiumRefundListingForm.value.year !==undefined) {
	   
		  opt[cnt++]= {'key':'year', 'value':this.premiumRefundListingForm.value.year };
		}
		
		
		this.jsonArray = opt;
		this.fetchAllRefundEntries();
	}
	
	onPaginateChange(event) {
		this.pageSize = event.pageSize;
		this.pageIndex = event.pageIndex;
		this.fetchAllRefundEntries();
	}

	// reset form
	reset() {
	this.premiumRefundListingForm.reset();
	}


	navigate() {

	}

}
