import { Component, ElementRef, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { Router } from '@angular/router';

import { doiMessage } from 'src/app/common/error-message/common-message.constants';
import { ListValue } from 'src/app/models/common-grant';
import { DoiDirectives } from 'src/app/models/doi/doi';
import { APIConst } from 'src/app/shared/constants/doi/doi-api.constants';

import { JpaQueryDialogComponent } from '../../jpa/jpa-query-dialog/jpa-query-dialog.component';

import { JpaRejectionQueryDialogComponent } from '../../jpa/jpa-rejection-query-dialog/jpa-rejection-query-dialog.component';
import { DoiService } from '../../service/doi.service';



@Component({
  selector: 'app-claim-entry-hba',
  templateUrl: './claim-entry-hba.component.html',
  styleUrls: ['./claim-entry-hba.component.css']
})
export class ClaimEntryHbaComponent implements OnInit {
  
  todayDate = new Date();
  claimEntryForm: FormGroup;
  errorMessage = doiMessage;

  policyNoList: ListValue[] = [];
  //   { value: '1', viewValue: 'OC-19-2201-4090-00000004' },
  //   { value: '2', viewValue: 'OC-19-2201-4090-00000078' },
  // ];
  anyOtherCompanyInsuranceList: ListValue[] = [];
  //   { value: '1', viewValue: 'Yes' },
  //   { value: '2', viewValue: 'No' },
  // ];
  recomnded_list: ListValue[] = [];
  //   { value: '1', viewValue: 'Recommonded to Query ' },
  //   { value: '4', viewValue: 'Recommonded for Rejection' },
  //   { value: '5', viewValue: 'Recommonded for Settlement' },
  //   { value: '6', viewValue: 'Recommonded For Investigation' },

  // ];
  surveyorNameList: ListValue[] = [];
  //   { value: '1', viewValue: 'Mr. Abhishek Gupta' },
  // ];

  policyNoCtrl: FormControl = new FormControl();
  anyOtherCompanyInsuranceCtrl: FormControl = new FormControl();
  recomndedCtrl: FormControl = new FormControl();
  surveyorNameCtrl: FormControl = new FormControl();

  displayedColumns1: string[] = [
    'companyName',
    'policyNo',
    'policyStartDate',
    'policyEndDate',
    'sumInsured',
    'receivedClaimAmount',
    'action',
  ];
  displayedColumns2: string[] = [
    'itemNoOfPolicy',
    'itemAffected',
    'actualValue',
    'lossTimeValue',
    'salvageDeductionValue',
    'amountClaim',
    'action',
  ];

  elementData: any[] = [
    {
      companyName: '',
      policyNo: '',
      policyStartDate: '',
      policyEndDate: '',
      sumInsured: '',
      receivedClaimAmount: '',
    }
  ];
  elementData1: any[] = [
    {
      itemNoOfPolicy: '',
      itemAffected: '',
      actualValue: '',
      lossTimeValue: '',
      salvageDeductionValue: '',
      amountClaim: '',
    }
  ];
  attachmentTypeCode: any[] = [];
  //   { value: '01', viewValue: 'Supporting Document' },
  //   { value: '02', viewValue: 'Sanction Order' },
  //   { value: '03', viewValue: 'Others' },
  //   // { type: 'view' }
  // ];
  selectedindex: number;

  dataSource = new MatTableDataSource<any>(this.elementData);
  dataSourceLossDetails = new MatTableDataSource<any>(this.elementData1);

  constructor(private el: ElementRef, public dialog: MatDialog, private router: Router,
     private workflowService: DoiService, private fb: FormBuilder,) { }
  directiveObject = new DoiDirectives(this.router, this.dialog);

  ngOnInit() {
    this.claimEntryForm = this.fb.group({
      clID: [{ value: '53624', disabled: true }],
      clDate: [{ value: new Date(), disabled: true }],
      claimNo: [{ value: '', disabled: true }],
      claimDate: [{ value: new Date(), disabled: true }],
      policyNo: [''],
      policyStartDate: [{ value: '', disabled: true }],
      policyEndDate: [{ value: '', disabled: true }],
      sumInsured: [{ value: '', disabled: true }],
      insuredName: [{ value: '', disabled: true }],
      address: [{ value: '', disabled: true }],
      aadharCardNo: [{ value: '', disabled: true }],
      mobileNo: [{ value: '', disabled: true }],
      emailId: ['', Validators.email],
      anyOtherCompanyInsurance: [''],
      dateOfLoss: [''],
      time: ['', Validators.pattern(/^(1[0-2]|0?[0-9]):([0-5][0-9]) ?([AaPp][Mm])?$/)],
      lossDamageCause: [''],
      lossExtend: [''],
      recomnded: [''],
      surveyorName: [''],
      billNo: [''],
      billDate: [''],
      feeAmount: [''],
      inwardNo: ['4567'],
      appClAmt: [''],
    });

    this.getAnyOtherCompanyInsuranceList();
    this.getPolicyNoList();
    this.getSurveyorNameList();
  }

  onSelectingPolicyNo(event) {
    if (event.value) {
      this.claimEntryForm.patchValue({
        policyStartDate: new Date('04/01/2018'),
        policyEndDate: new Date('03/30/2019'),
        sumInsured: '35465710000',
        insuredName: 'Gujarat State Electricity Corporation',
        address: 'Gandhinagar',
        aadharCardNo: '12345678910',
        mobileNo: '1234567890',
      })
    }
  }

  onSubmit() {
    if (this.claimEntryForm.controls.recomnded.value !== '') {
      if (this.claimEntryForm.controls.recomnded.value === '1') {
        const dialogRef = this.dialog.open(JpaQueryDialogComponent, {
          width: '1000px',
          height: '500px',
          disableClose: true

        });
      }

      if (this.claimEntryForm.controls.recomnded.value === '3') {
        const dialogRef = this.dialog.open(JpaRejectionQueryDialogComponent, {
          width: '1000px',
          height: '500px',
          disableClose: true

        });
      }
    }
  }

  addColumn() {
    const data = this.dataSource.data;
    data.push({
      companyName: '',
      policyNo: '',
      policyStartDate: '',
      policyEndDate: '',
      sumInsured: '',
      receivedClaimAmount: '',
    });
    this.dataSource.data = this.dataSource.data;

  }

  addColumnLossDetails() {
    const data = this.dataSourceLossDetails.data;
    data.push({
      itemNoOfPolicy: '',
      itemAffected: '',
      actualValue: '',
      lossTimeValue: '',
      salvageDeductionValue: '',
      amountClaim: '',
    });
    this.dataSourceLossDetails.data = this.dataSourceLossDetails.data;
  }

  deleteColumn(dataSource, index) {
    dataSource.data.splice(index, 1);
    dataSource.data = dataSource.data;
  }

  navigate() { }
  
  getPolicyNoList() {
    const params = {
      "name":"HBA_CLAIM_ENT_POLICY_NO"
    };
    this.workflowService.getDataPost(params, APIConst.COMMON_DROPDOWN_WITH_NAME).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          resp.result.forEach(element => {
            let data = new ListValue();
            data.value = element.id;
            data.viewValue = element.name;
            this.policyNoList.push(data);
          });
        }
      },
      err => {
  
      }
    );
  }
 
  getAnyOtherCompanyInsuranceList() {
    const params = {
      "name":"HBA_CLAIM_ENT_ANY_OTH_COMP_INSUR"
    };
    this.workflowService.getDataPost(params, APIConst.COMMON_DROPDOWN_WITH_NAME).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          resp.result.forEach(element => {
            let data = new ListValue();
            data.value = element.id;
            data.viewValue = element.name;
            this.anyOtherCompanyInsuranceList.push(data);
          });
        }
      },
      err => {
  
      }
    );
  }

  getSurveyorNameList() {
    const params = {
      "name":"HBA_CLAIM_ENT_SURVE_NAME"
    };
    this.workflowService.getDataPost(params, APIConst.COMMON_DROPDOWN_WITH_NAME).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          resp.result.forEach(element => {
            let data = new ListValue();
            data.value = element.id;
            data.viewValue = element.name;
            this.surveyorNameList.push(data);
          });
        }
      },
      err => {
  
      }
    );
  }

}
