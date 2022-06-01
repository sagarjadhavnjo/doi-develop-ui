import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

import { CommonListing } from 'src/app/models/common-listing';

import { ListValue, TalukaList } from 'src/app/models/doi/doiModel';
import { APIConst } from 'src/app/shared/constants/doi/doi-api.constants';
import { DoiService } from '../../service/doi.service';



@Component({
  selector: 'app-claim-listing',
  templateUrl: './claim-listing.component.html',
  styleUrls: ['./claim-listing.component.css']
})
export class ClaimListingComponent implements OnInit {

  todayDate = new Date();
  claimListingForm: FormGroup;

  policyNoCtrl: FormControl = new FormControl();
  employeeNameCtrl: FormControl = new FormControl();
  districtCtrl: FormControl = new FormControl();
  talukaCtrl: FormControl = new FormControl();
  typeMonthCtrl: FormControl = new FormControl();
  typeOfYearCtrl: FormControl = new FormControl();

  employeeNameList: CommonListing[] = [];
  //   {
  //     value: '1', viewValue: 'Mr. Abhishek Gupta'
  //   }
  // ];

  policyNoList: ListValue[] = [];
  //   { value: '1', viewValue: 'OC-19-2201-4090-00000004' },
  //   { value: '2', viewValue: 'OC-19-2201-4090-00000078' },
  // ];

  districtList: CommonListing[] = [];
  //   { value: '00', viewValue: 'Ahmedabad' },
  //   { value: '01', viewValue: 'Amreli' },
  //   { value: '02', viewValue: 'Anand' },
  //   { value: '03', viewValue: 'Aravalli' },
  //   { value: '04', viewValue: 'Banaskantha' },
  //   { value: '05', viewValue: 'Bharuch' },
  //   { value: '06', viewValue: 'Bhavnagar' },
  // ];
  talukaList: TalukaList[] = [];
  //   { value: '01', district: '00', viewValue: 'City East' },
  //   { value: '02', district: '00', viewValue: 'City West' },
  //   { value: '03', district: '00', viewValue: 'Bavla' },
  //   { value: '04', district: '00', viewValue: 'Daskroi' },
  //   { value: '05', district: '00', viewValue: 'Detroj-Rampura' },
  //   { value: '06', district: '00', viewValue: 'Dhandhuka' },
  //   { value: '07', district: '00', viewValue: 'Dholera' },
  //   { value: '08', district: '00', viewValue: 'Dholka' },
  //   { value: '09', district: '00', viewValue: 'Mandal' },
  //   { value: '10', district: '00', viewValue: 'Sanand' },
  //   { value: '11', district: '00', viewValue: 'Viramgam' },
  //   { value: '01', district: '01', viewValue: 'Amreli' },
  //   { value: '02', district: '01', viewValue: 'Babra' },
  //   { value: '03', district: '01', viewValue: 'Bagasara' },
  //   { value: '04', district: '01', viewValue: 'Dhari' },
  //   { value: '05', district: '01', viewValue: 'Jafrabad' },
  //   { value: '06', district: '01', viewValue: 'Khambha' },
  //   { value: '07', district: '01', viewValue: 'Kunkavav vadia' },
  //   { value: '08', district: '01', viewValue: 'Lathi' },
  //   { value: '09', district: '01', viewValue: 'Lilia' },
  //   { value: '10', district: '01', viewValue: 'Rajula' },
  //   { value: '11', district: '01', viewValue: 'Savarkundla' },
  //   { value: '01', district: '02', viewValue: 'Anand' },
  //   { value: '02', district: '02', viewValue: 'Anklav' },
  //   { value: '03', district: '02', viewValue: 'Borsad' },
  //   { value: '04', district: '02', viewValue: 'Khambhat' },
  //   { value: '05', district: '02', viewValue: 'Petlad' },
  //   { value: '06', district: '02', viewValue: 'Sojitra' },
  //   { value: '07', district: '02', viewValue: 'Tarapur' },
  //   { value: '08', district: '02', viewValue: 'Umreth' },
  //   { value: '01', district: '03', viewValue: 'Bayad' },
  //   { value: '02', district: '03', viewValue: 'Bhiloda' },
  //   { value: '03', district: '03', viewValue: 'Dhansura' },
  //   { value: '04', district: '03', viewValue: 'Malpur' },
  //   { value: '05', district: '03', viewValue: 'Meghraj' },
  //   { value: '06', district: '03', viewValue: 'Modasa' },
  //   { value: '01', district: '04', viewValue: 'Amirgadh' },
  //   { value: '02', district: '04', viewValue: 'Bhabhar' },
  //   { value: '03', district: '04', viewValue: 'Danta' },
  //   { value: '04', district: '04', viewValue: 'Dantiwada' },
  //   { value: '05', district: '04', viewValue: 'Deesa' },
  //   { value: '06', district: '04', viewValue: 'Deodar' },
  //   { value: '07', district: '05', viewValue: 'Dhanera' },
  //   { value: '08', district: '04', viewValue: 'Kankrej' },
  //   { value: '09', district: '06', viewValue: 'Lakhani' },
  //   { value: '10', district: '04', viewValue: 'Palanpur' },
  // ];
  talukaNameList: CommonListing[];

  year_list: ListValue[] = [];
  //   { value: '1', viewValue: '2009' },
  //   { value: '2', viewValue: '2010' },
  //   { value: '3', viewValue: '2011' },
  //   { value: '4', viewValue: '2012' },
  //   { value: '5', viewValue: '2013' },
  //   { value: '6', viewValue: '2014' },
  //   { value: '7', viewValue: '2015' },
  //   { value: '8', viewValue: '2016' },
  //   { value: '9', viewValue: '2017' },
  //   { value: '10', viewValue: '2018' },
  //   { value: '11', viewValue: '2019' },
  //   { value: '12', viewValue: '2020' },
  // ];
  month_list: ListValue[] = [];
  //   { value: '1', viewValue: 'Jan' },
  //   { value: '2', viewValue: 'Feb' },
  //   { value: '3', viewValue: 'Mar' },
  //   { value: '4', viewValue: 'Apr' },
  //   { value: '5', viewValue: 'May' },
  //   { value: '6', viewValue: 'Jun' },
  //   { value: '7', viewValue: 'Jul' },
  //   { value: '8', viewValue: 'Aug' },
  //   { value: '9', viewValue: 'Sep' },
  //   { value: '10', viewValue: 'Oct' },
  //   { value: '11', viewValue: 'Nov' },
  //   { value: '12', viewValue: 'Dec' },

  // ];

  displayedColumns: string[] = [
    'srNo',
    'claimId',
    'policyNo',
    'employeeName',
    'officeName',
    'riskCovered',
    'propertyLocation',
    'inwardNo',
    'createModeON',
    'modifyModeON',
    'status',
    'action',
  ];
  elementData: any[] = [
    {
      claimId: 'OC-19-2201-4090-00000004',
      policyNo: 'OC-19-2201-4090-00000004',
      employeeName: 'Mr. Abhishek Gupta',
      officeName: 'Gujarat State Electricity Corporation',
      riskCovered: 'Fire',
      propertyLocation: 'Gandhinagar',
      inwardNo: '4567',
      createModeON: '22-Apr-2018 12:22PM',
      modifyModeON: '22-Jun-2018 01:22PM',
      status: 'Pending',
    }
  ];
  dataSource = new MatTableDataSource<any>(this.elementData);

  constructor(private fb: FormBuilder, private workflowService: DoiService) { }

  ngOnInit() {
    this.claimListingForm = this.fb.group({
      claimId: [''],
      policyNo: [''],
      employeeName: [''],
      district: [''],
      taluka: [''],
      month: [''],
      year: [''],
    });

    this.getPolicyNoList();
    this.getEmployeeNameList();
  }

  selectDistrict() {
    const district = this.claimListingForm.value.district;
    if (district !== '' && district != null) {
      this.talukaNameList = this.talukaList.filter(
        searchBy => searchBy.district.toLowerCase() === district.toLowerCase());
    }
  }

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

  getEmployeeNameList() {
    const params = {
      "name":"HBA_CLAIM_ENT_EMPLO_NAME"
    };
    this.workflowService.getDataPost(params, APIConst.COMMON_DROPDOWN_WITH_NAME).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          resp.result.forEach(element => {
            let data = new ListValue();
            data.value = element.id;
            data.viewValue = element.name;
            this.employeeNameList.push(data);
          });
        }
      },
      err => {
  
      }
    );
  }

}
