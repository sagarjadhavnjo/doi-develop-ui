import { Component, ElementRef, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { doiMessage } from 'src/app/common/error-message/common-message.constants';
import { DoiDirectives } from 'src/app/models/doi/doi';
import { ListValue } from 'src/app/models/doi/doiModel';
import { APIConst } from 'src/app/shared/constants/doi/doi-api.constants';
import { DoiService } from '../../service/doi.service';

@Component({
  selector: 'app-surveyor-bill-generation',
  templateUrl: './surveyor-bill-generation.component.html',
  styleUrls: ['./surveyor-bill-generation.component.css']
})
export class SurveyorBillGenerationComponent implements OnInit {

  todayDate = new Date();
  surveyorForm: FormGroup;

  surNameCtrl: FormControl = new FormControl();
  branAppCtrl: FormControl = new FormControl();
  clNoCtrl: FormControl = new FormControl();
  errorMessage = doiMessage;
  directiveObject = new DoiDirectives(this.router, this.dialog);

  surNameList: ListValue[] = [];
  //   { value: '1', viewValue: 'Mr. Rakesh Patel' },
  //   { value: '2', viewValue: 'Mr. Dinesh Patel' }
  // ]
  branAppList: ListValue[] = [];
  //   { value: '1', viewValue: 'HBA' },
  //   { value: '2', viewValue: 'DB' }
  // ]
  clNoList: ListValue[] = []
  //   { value: '1', viewValue: '256458' },
  //   { value: '2', viewValue: '325478' }
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
  //     status: 'Active',
  //   }
  // ];
  dataSource = new MatTableDataSource<any>(this.elementData);
  constructor(private fb: FormBuilder,private router: Router, private el: ElementRef,
    public dialog: MatDialog, private workflowService: DoiService) { }

  ngOnInit() {
    this.surveyorForm = this.fb.group({
      transNo: ['65354'],
      transDate: [new Date()],
      surName: [''],
      branApp: [''],
      clNo: [''],
      sBillNo: [''],
      billDate: [''],
      amt: [''],
    });

    this.getSurveyorNameList();
    this.getBranAppList();
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

}
