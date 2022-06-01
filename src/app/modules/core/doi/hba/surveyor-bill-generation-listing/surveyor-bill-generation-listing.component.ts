import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ListValue } from 'src/app/models/doi/doiModel';
import { APIConst } from 'src/app/shared/constants/doi/doi-api.constants';
import { DoiService } from '../../service/doi.service';

@Component({
  selector: 'app-surveyor-bill-generation-listing',
  templateUrl: './surveyor-bill-generation-listing.component.html',
  styleUrls: ['./surveyor-bill-generation-listing.component.css']
})
export class SurveyorBillGenerationListingComponent implements OnInit {

  todayDate = new Date();
  surveyorMasterListingForm: FormGroup;

  surNameCtrl: FormControl = new FormControl();
  branAppCtrl: FormControl = new FormControl();
  clNoCtrl: FormControl = new FormControl();
  wStatusCtrl: FormControl = new FormControl();

  surNameList: ListValue[] = [];
  //   { value: '1', viewValue: 'Mr. Rakesh Patel' },
  //   { value: '2', viewValue: 'Mr. Dinesh Patel' }
  // ]
  branAppList: ListValue[] = [];
  //   { value: '1', viewValue: 'HBA' },
  //   { value: '2', viewValue: 'DB' }
  // ]
  clNoList: ListValue[] = [];
  //   { value: '1', viewValue: '256458' },
  //   { value: '2', viewValue: '325478' }
  // ]
  wStatusList: ListValue[] = [];
  //   { value: '1', viewValue: 'Approved' },
  //   { value: '2', viewValue: 'Pending' }
  // ]
  displayedColumns: string[] = [
    'srno',
    'transNo',
    'transDate',
    'surveryorName',
    'appoiBranch',
    'clNo',
    'billDate',
    'amt',
    'status',
    'action',
  ];
  elementData: any[] = [];
  //   {
  //     transNo: '3254786',
  //     transDate: '14-Apr-2020',
  //     surveryorName: 'Mr. Abhishek Sharma',
  //     appoiBranch: 'Ahmedabad',
  //     clNo: '254653',
  //     billDate: '14-Aug-2020',
  //     amt: '2000.00',
  //     status: 'Approved',
  //   }
  // ];
  dataSource = new MatTableDataSource<any>(this.elementData);
  constructor(private fb: FormBuilder, private workflowService: DoiService) { }

  ngOnInit() {
    this.surveyorMasterListingForm = this.fb.group({
      surName: [''],
      branApp: [''],
      clNo: [''],
      sBillNo: [''],
      wStatus: [''],
    });

    this.getSurveyorNameList();
    this.getBranAppList();
    this.getClNoList();
    this.getWorkflowStatusList();
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
            this.surNameList.push(data);
          });
        }
      },
      err => {
  
      }
    );
  }

  getBranAppList() {
    const params = {
      "name":"HBA_SUR_BIL_GEN_LIST_SUR_APPO_FOR_BRANCH"
    };
    this.workflowService.getDataPost(params, APIConst.COMMON_DROPDOWN_WITH_NAME).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          resp.result.forEach(element => {
            let data = new ListValue();
            data.value = element.id;
            data.viewValue = element.name;
            this.branAppList.push(data);
          });
        }
      },
      err => {
  
      }
    );
  }

  getClNoList() {
    const params = {
      "name":"HBA_SUR_BIL_GEN_LIST_CLAIM_NO"
    };
    this.workflowService.getDataPost(params, APIConst.COMMON_DROPDOWN_WITH_NAME).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          resp.result.forEach(element => {
            let data = new ListValue();
            data.value = element.id;
            data.viewValue = element.name;
            this.clNoList.push(data);
          });
        }
      },
      err => {
  
      }
    );
  }

  getWorkflowStatusList() {
    const params = {
      "name":"HBA_SUR_BIL_GEN_LIST_WORKFLOW_STATUS"
    };
    this.workflowService.getDataPost(params, APIConst.COMMON_DROPDOWN_WITH_NAME).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          resp.result.forEach(element => {
            let data = new ListValue();
            data.value = element.id;
            data.viewValue = element.name;
            this.wStatusList.push(data);
          });
        }
      },
      err => {
  
      }
    );
  }
}
