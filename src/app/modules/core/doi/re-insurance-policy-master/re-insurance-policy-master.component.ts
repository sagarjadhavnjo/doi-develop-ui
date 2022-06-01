import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator';
import { doiMessage } from 'src/app/common/error-message/common-message.constants';
import { ListValue } from 'src/app/models/common-listing';
import { ReInsurancePolicyMaster } from 'src/app/models/doiModel';
import { ReInsurancePolicyMasterEntry } from 'src/app/models/doi/doiModel';
import { DatePipe } from '@angular/common';
import { DoiService } from '../service/doi.service';
import { APIConst } from 'src/app/shared/constants/doi/doi-api.constants';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-re-insurance-policy-master',
  templateUrl: './re-insurance-policy-master.component.html',
  styleUrls: ['./re-insurance-policy-master.component.css']
})
export class ReInsurancePolicyMasterComponent implements OnInit {

  todayDate = new Date();
  errorMessage = doiMessage;
  reInsurancePolicyMasterForm: FormGroup;

  typeCtrl: FormControl = new FormControl();
  departmentCtrl: FormControl = new FormControl();
  riskLocationCtrl: FormControl = new FormControl();
  policyNoCtrl: FormControl = new FormControl();

  typeList: ListValue[] = [];
  departmentList: ListValue[] = [];
  riskLocationList: ListValue[] = [

  ];
  policyNoList: ListValue[] = [];

  columns: string[] = [
    'riCompanyName',
    'location',
    'share',
    'premiumAmount',
    'challanNo',
    'challanDate',
    'remarks',
    'action1',
  ];
  elementData: ReInsurancePolicyMaster[] = [
    {
      riCompanyName: '',
      location: '',
      share: '',
      premiumAmount: '',
      challanNo: '',
      challanDate: '',
      remarks: '',
    }
  ];
  dataSource = new MatTableDataSource<ReInsurancePolicyMaster>(this.elementData);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  pageSize: number  = 5;
	pageIndex: number = 0;
  constructor(private fb: FormBuilder, private workflowService: DoiService, private datePipe: DatePipe, private toastr: ToastrService) { }

  ngOnInit() {
    this.getPolicyTypeList();
    this.getDepartmentList();
    this.getPolicyNoList();
    this.dataSource.paginator = this.paginator;
    this.reInsurancePolicyMasterForm = this.fb.group({
      type: [''],
      department: [''],
      riskLocation: [''],
      policyNo: [''],
      insuredName: [{ value: '', disabled: true }],
      insuredAddress: [{ value: '', disabled: true }],
      insuredStartDate: [{ value: '', disabled: true }],
      insuredEndDate: [{ value: '', disabled: true }],
      sumInsured: [{ value: '', disabled: true }],
      premiumAmount: [{ value: '', disabled: true }],
      agencyCommission: [''],
      amount: [''],
    });

  }

  private getPolicyTypeList() {
    this.workflowService.getDataWithoutParams(APIConst.DOI_POLICY_TYPES_DROPDOWN).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.typeList = resp.result;
          
        }
      }
    );
  }
  private getDepartmentList() {
    let passData: any = {name:APIConst.DOI_REINSU_POLICY_MASTER_DEPARTMENT}
    this.workflowService.getData(passData,APIConst.DOI_GET_DROPDOWN_DATA).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.departmentList = resp.result;
          
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

  onSelectingDepartment(event) {
    if (event.value) {
      this.riskLocationList = [];
      this.riskLocationList.push(
        {
          value: '1',
          viewValue: 'Ahmedabad'
        },
        {
          value: '2',
          viewValue: 'Dahod',
        },
        {
          value: '3',
          viewValue: 'Gandhhinagar',
        }
      );

      return this.riskLocationList;
    }
  }

  onSelectingRiskLocation(event) {
    /*if (event.value) {
      this.policyNoList = [];
      this.policyNoList.push(
        {
          value: '1',
          viewValue: 'DOI/48/P/2019-20/000001'
        },
        {
          value: '2',
          viewValue: 'DOI/48/P/2019-20/000002',
        },
        {
          value: '3',
          viewValue: 'DOI/48/P/2019-20/000003',
        }
      );

      return this.policyNoList;
    }*/
  }

  onSelectingPolicyNo(event) {
    if (event.value) {
      this.reInsurancePolicyMasterForm.patchValue({
        insuredName: 'Gujarat State Electricity Corporation',
        insuredAddress: 'Ukai',
        insuredStartDate: new Date('04/01/2018'),
        insuredEndDate: new Date('03/31/2019'),
        sumInsured: '35465710000',
        premiumAmount: '53275454',
      });
    }
  }

  addColumn() {
    const data = this.dataSource.data;
    data.push({
      riCompanyName: '',
      location: '',
      share: '',
      premiumAmount: '',
      challanNo: '',
      challanDate: '',
      remarks: '',
    });

    this.dataSource.data = data;
    this.dataSource.paginator = this.paginator;
  }
  onPaginateChange(event) {
		this.pageSize = event.pageSize;
		this.pageIndex = event.pageIndex;
	}

  deleteColumn(dataSource, index) {
    dataSource.data.splice(index, 1);
    dataSource.data = dataSource.data;
    if(dataSource.data.length%this.pageSize == 0){
      this.pageIndex = this.pageIndex-1;
    }
  }

  onSubmit() {
		if(this.reInsurancePolicyMasterForm.valid){
			let payload: ReInsurancePolicyMasterEntry = new ReInsurancePolicyMasterEntry();
			payload.agencyCommissPc = this.reInsurancePolicyMasterForm.controls.agencyCommission.value;
			payload.commissionAmt = this.reInsurancePolicyMasterForm.controls.amount.value;
			payload.departmentId = this.reInsurancePolicyMasterForm.controls.department.value;
			payload.insurEndDt = this.dateFormatter(this.reInsurancePolicyMasterForm.controls.insuredEndDate.value,'yyyy-MM-dd');
			payload.insurStartDt = this.dateFormatter(this.reInsurancePolicyMasterForm.controls.insuredStartDate.value,'yyyy-MM-dd');
			payload.insuredName = this.reInsurancePolicyMasterForm.controls.insuredName.value;
			payload.insuredAddress = this.reInsurancePolicyMasterForm.controls.insuredAddress.value;
			payload.policyNo = this.reInsurancePolicyMasterForm.controls.policyNo.value;
			payload.policyTypeId = this.reInsurancePolicyMasterForm.controls.type.value;
			payload.premiumAmount = this.reInsurancePolicyMasterForm.controls.premiumAmount.value;
			payload.riskLocationId = this.reInsurancePolicyMasterForm.controls.riskLocation.value;
			payload.sumInsuredAmt = this.reInsurancePolicyMasterForm.controls.sumInsured.value;
      payload.doiRiPolicyDtl = [];
      this.dataSource.data.forEach((element, index) => {
				let temp:any = {};
				temp['riPolicyDtlId'] = index;
				temp['challanDt'] = this.dateFormatter(element.challanDate,'yyyy-MM-dd');
				temp['challanNo'] = element.challanNo;
				temp['premShareAmt'] = this.calculatePremiumShareAmount(element);
				temp['remarks'] = element.remarks;
				temp['riLocation'] = element.location;
				temp['riName'] = element.riCompanyName;
				temp['riSharePc'] = element.share;
				payload.doiRiPolicyDtl.push(temp);
			});

      
      console.log(payload)
			this.workflowService.saveDocumentsData(APIConst.DOI_REINSURANCE_POLICY_MASTER, payload).subscribe(
			  (data) => {
          if (data && data['result'] && data['status'] === 200) {
            this.toastr.success('Re-insurance Policy Created Successfully');
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

  onReset() {
    this.reInsurancePolicyMasterForm.reset();
  }

  goToListing() { }

  onCloseClaimEntry() { }

  calculatePremiumShareAmount(element) {
    let value = 0;
    value = (Number(element.share) / 100) * Number(this.reInsurancePolicyMasterForm.controls['premiumAmount'].value);
    return value;
  }

}
