import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ListValue, SurveyorMasterListing, TalukaList } from 'src/app/models/doi/doiModel';
import { APIConst } from 'src/app/shared/constants/doi/doi-api.constants';
import { DoiService } from '../../service/doi.service';

@Component({
  selector: 'app-surveyor-master-listing',
  templateUrl: './surveyor-master-listing.component.html',
  styleUrls: ['./surveyor-master-listing.component.css']
})
export class SurveyorMasterListingComponent implements OnInit {

  todayDate = new Date();
  surveyorMasterListingForm: FormGroup;

  partTypeCtrl: FormControl = new FormControl();
  districtCtrl: FormControl = new FormControl();
  talukaCtrl: FormControl = new FormControl();
  officeLocationNameCtrl: FormControl = new FormControl();

  partyTypeList: ListValue[] = [];
  //   { value: '1', viewValue: 'Leader' },
  //   { value: '2', viewValue: 'Insured' },
  // ];

  districtList: ListValue[] = [];
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
  talukaNameList: ListValue[];

  officeLocationNameList: ListValue[] = [];
  //   { value: '1', viewValue: 'Ahmedabad' },
  //   { value: '2', viewValue: 'Gujarat' }
  // ]

  displayedColumns: string[] = [
    'srno',
    'surveryorName',
    'surveryorFirmName',
    'address',
    'district',
    'taluka',
    'contactNo',
    'emailId',
    'paymentPreferred',
    'createModeON',
    'modifyModeON',

    'status',
    'action',
  ];
  elementData: any[] = [];
  //   {
  //     surveryorName: 'Mr. Abhishek Sharma',
  //     surveryorFirmName: 'XYZ Co. Ltd.',
  //     address: 'Gandhinagar',
  //     district: 'Ahmedabad',
  //     taluka: 'City East',
  //     contactNo: '123456789101',
  //     emailId: 'abc@gmail.com',
  //     paymentPreferred: 'Cash',
  //     createModeON: '22-Apr-2018 12:22PM',
  //     modifyModeON: '22-Jun-2018 01:22PM',
  //     status: 'Active',
  //   }
  // ];
  dataSource = new MatTableDataSource<SurveyorMasterListing>(this.elementData);
  constructor(private fb: FormBuilder, private workflowService: DoiService) { }

  ngOnInit() {
    this.surveyorMasterListingForm = this.fb.group({
      partyType: [''],
      district: [''],
      taluka: [''],
      officeLocationName: [''],
    });

    this.getOfficeLocationNameList();
    this.getPartyTypeList();
  }

  selectDistrict() {
    const district = this.surveyorMasterListingForm.value.district;
    if (district !== '' && district != null) {
      this.talukaNameList = this.talukaList.filter(
        searchBy => searchBy.district.toLowerCase() === district.toLowerCase());
    }

  }

  getPartyTypeList() {
    const params = {
      "name":"HBA_SURY_PARTY_TYPE"
    };
    this.workflowService.getDataPost(params, APIConst.COMMON_DROPDOWN_WITH_NAME).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          resp.result.forEach(element => {
            let data = new ListValue();
            data.value = element.id;
            data.viewValue = element.name;
            this.partyTypeList.push(data);
          });
        }
      },
      err => {
  
      }
    );
  }

  getOfficeLocationNameList() {
    const params = {
      "name":"HBA_SURY_OFFI_LOCATION NAME"
    };
    this.workflowService.getDataPost(params, APIConst.COMMON_DROPDOWN_WITH_NAME).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          resp.result.forEach(element => {
            let data = new ListValue();
            data.value = element.id;
            data.viewValue = element.name;
            this.officeLocationNameList.push(data);
          });
        }
      },
      err => {
  
      }
    );
  }
}
