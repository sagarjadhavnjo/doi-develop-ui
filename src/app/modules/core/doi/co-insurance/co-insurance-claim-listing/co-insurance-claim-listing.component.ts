import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DoiDirectives } from 'src/app/common/directive/doi';
import { ListValue } from 'src/app/models/common-listing';
import { CoInsuranceClaimEntryListing } from 'src/app/models/doiModel';
import { APIConst } from 'src/app/shared/constants/doi/doi-api.constants';
import { DoiService } from '../../service/doi.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-co-insurance-claim-listing',
  templateUrl: './co-insurance-claim-listing.component.html',
  styleUrls: ['./co-insurance-claim-listing.component.css']
})
export class CoInsuranceClaimListingComponent implements OnInit {

  todayDate = new Date();
  // Form Group
  coInsuranceClaimForm: FormGroup;
  // Control
  districtCtrl: FormControl = new FormControl();
  schemeTypeCtrl: FormControl = new FormControl();
  typeOfYearCtrl: FormControl = new FormControl();
  typeMonthCtrl: FormControl = new FormControl();
  // List
  schemeType_list: ListValue[] = [];
  districtList: ListValue[] = [];

  year_list: ListValue[] = [];
  month_list: ListValue[] = [];
  // Table Source

  ELEMENT_DATA: any[] = [];

  header1: string[] = [
    'selectHeader',
    'srnoHeader',
    'claimIdHeader',
    'policyNoHeader',
    'leaderNameHeader',
    'insuredNameHeader',
    'claimAmount',
    'createModeONHeader',
    'modifyModeONHeader',
    'statusHeader',
    'actionHeader',
  ];

  header2: string[] = [
    'claimAmountLeaderHeader',
    'claimAmountGifHeader',
  ];

  displayedColumns: string[] = [
    'select',
    'srno',
    'claimId',
    'policyNo',
    'leaderName',
    'insuredName',
    'claimAmountLeader',
    'claimAmountGif',
    'createModeON',
    'modifyModeON',
    'status',
    'action'

  ];

  dataSource = new MatTableDataSource<CoInsuranceClaimEntryListing>(this.ELEMENT_DATA);
  selection = new SelectionModel<CoInsuranceClaimEntryListing>(true, []);
  
  
  totalRecords: number = 0;
  pageSize:number = 10;
  pageIndex: number = 0;
  jsonArray: any = [];
  
  constructor(private router: Router, public dialog: MatDialog, private fb: FormBuilder, private workflowService: DoiService, private datePipe: DatePipe) { }
  directiveObject = new DoiDirectives(this.router, this.dialog);

  ngOnInit() {
    this.getDistrictList();
    this.getMasterSchemeListing();
    this.getMonthList();
    this.getYearList();
    this.coInsuranceClaimForm = this.fb.group({
      district: [''],
      month: [''],
      year: [''],
      fromDate: [''],
      endDate: [''],
      schemeType: ['']
    });
	  this.fetchAllClaimListing();
  }

  private getDistrictList() {
    this.workflowService.getDataWithoutParams(APIConst.JPA_DOI_GET_DISTRICT_LIST_GUJRAT).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.districtList = resp.result;
          
        }
      }
    );
  }

  private getMasterSchemeListing() {
    this.workflowService.getDataWithoutParams(APIConst.DOI_MASTER_SCHEME_POLICY_DROPDOWN).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          resp.result.forEach(element => {
            let data = new ListValue();
            data.value = element.schemeId;
            data.viewValue = element.schemeNameEnglish;
            this.schemeType_list.push(data);
          });
        }
      }
    );
  }

  private getMonthList() {
    /*this.workflowService.getDataWithoutParams(APIConst.DOI_MONTH_LIST_DROPDOWN).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.month_list = resp.result;
          
        }
      }
    );*/
    let passData: any = {name:APIConst.DOI_COINS_PRE_MONTH}
    this.workflowService.getData(passData,APIConst.DOI_GET_DROPDOWN_DATA).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.month_list = resp.result;
          
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
  
  fetchAllClaimListing() {
		const passData = {
			pageIndex: this.pageIndex,
			// pageElement: this.pageElements,
			pageElement: this.pageSize,

			sortByColumn: 'coinsClaimId',
			sortOrder: 'asc',
			jsonArr: this.jsonArray
		 
		}
		this.workflowService.getData(passData,APIConst.DOI_COINSURANCE_CLAIM_LISTING)
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
		const data = {
			claimId: element.coinsClaimId,
			policyNo: element.coinsPolicyNo,
			leaderName: element.leaderName,
			insuredName: element.insuredName,
			claimAmountLeader: element.leaderClaimAmt,
			claimAmountGif: element.gifClaimAmt,
			createModeON: element.createdDate,
			modifyModeON: element.updatedDate,
			status: element.activeStatus
		}
		  
		 Element_Data.push(data);
		});
		return Element_Data;
	}
	
	searchDisplay() {
		const opt: any = [{}];
		let map = new Map<string, string>();
		let cnt = 0;
		if(this.coInsuranceClaimForm.value.district !== '' && this.coInsuranceClaimForm.value.district !==undefined) {
		  
		  opt[cnt++]= {'key':'district', 'value':this.coInsuranceClaimForm.value.district };
		}
		if(this.coInsuranceClaimForm.value.schemeType !== '' && this.coInsuranceClaimForm.value.schemeType !==undefined) {
		
		  opt[cnt++]= {'key':'schemeType', 'value':this.coInsuranceClaimForm.value.schemeType };
		}
		if(this.coInsuranceClaimForm.value.month !== '' && this.coInsuranceClaimForm.value.month !==undefined) {
		  
		  opt[cnt++]= {'key':'month', 'value':this.coInsuranceClaimForm.value.month };
		}
		if(this.coInsuranceClaimForm.value.year !== '' && this.coInsuranceClaimForm.value.year !==undefined) {
		  
		  opt[cnt++]= {'key':'year', 'value':this.coInsuranceClaimForm.value.year };
		}
		if(this.coInsuranceClaimForm.value.fromDate !== '' && this.coInsuranceClaimForm.value.fromDate !==undefined) {
		 
		  let date = this.dateFormatter(this.coInsuranceClaimForm.value.fromDate,"yyyy-MM-dd");
		  opt[cnt++]= {'key':'createdDate', 'value':date, 'operation':'>='};
		}
		if(this.coInsuranceClaimForm.value.endDate !== '' && this.coInsuranceClaimForm.value.endDate !==undefined) {
		
		  let date = this.dateFormatter(this.coInsuranceClaimForm.value.endDate,"yyyy-MM-dd");
		  opt[cnt++]= {'key':'createdDate', 'value':date,'operation':'<=' };
		}
		/*opt[cnt++]= {'key':'activeStatus', 'value': "1" };
		*/
		
		this.jsonArray = opt;
		this.fetchAllClaimListing();
	}

  // Navigation Route
  navigate() {
    this.router.navigate(['./doi/co-insurance-claim-view']);
  }

  dateFormatter(date:string, pattern: string) {
    let  date1 = new Date(date);
    return this.datePipe.transform(date, pattern);
   }

	onPaginateChange(event) {
		this.pageSize = event.pageSize;
		this.pageIndex = event.pageIndex;
		this.fetchAllClaimListing();
	}
}
