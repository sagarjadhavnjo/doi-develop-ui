import { Component, ElementRef, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { hbaMessage } from 'src/app/common/error-message/common-message.constants';
import { ListValue } from 'src/app/models/common-grant';
import { CommonListing } from 'src/app/models/common-listing';

import { TalukaList } from 'src/app/models/doi/doiModel';
import { APIConst } from 'src/app/shared/constants/doi/doi-api.constants';
import { DoiService } from '../../service/doi.service';
import { HbaService } from '../../service/hba.service';



@Component({
  selector: 'app-hba-proposal-listing',
  templateUrl: './hba-proposal-listing.component.html',
  styleUrls: ['./hba-proposal-listing.component.css']
})
export class HbaProposalListingComponent implements OnInit {

  // date
  todayDate = new Date();
  // form group
  proposalForm: FormGroup;
  // form control
  districtCtrl: FormControl = new FormControl();
  talukaCtrl: FormControl = new FormControl();
  policyTypeCtrl: FormControl = new FormControl();

  // lists start

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
  talukaNamenodalList: any[];
  districtListApplicant: ListValue[] = [];
  districtListApplicantPer: ListValue[] = [];
  licType_List: any[] = [];

  // policyTypeList: CommonListing[] = [
  //   { value: '0', viewValue: 'Standard Fire & Special Perils Policy Schedule' },
  //   { value: '1', viewValue: 'Burglary & Housebreaking Policy' },
  //   { value: '2', viewValue: 'Electronics Equipment/Material Damage Schedule' },
  //   { value: '3', viewValue: 'Case-In-Transit Insurance' },
  //   { value: '4', viewValue: 'Terrorism Pool Insurance' }
  // ];
  // lists end

  // table data start
  columns: string[] = [
    'position',
    'proposalNo',
    'proposalDate',
    'dppfTakenLoan',
    'employeeNo',
    'employeeName',
    'officeAddress',
    'locationofProperty',
    'insTerm',
    'sumInsured',
    'createdDate',
    'createdBy',
    'updatedDate',
    'updatedBy',
    'status',
    'action'
  ];
  elementData: any[] = [];
  //   {
  //     proposalNo: '19-20/P/DB/SF/00019',
  //     proposalDate: '20-Jul-19',
  //     dppfLoanNo: '15700003',
  //     employeeName: 'Mr. Manubhai G Dodiya',
  //     employeeNo: '100000222',
  //     officeAdd: 'Block 2, Gandhinagar',
  //     locationofProperty: 'At Post Sarodhi, Pal, Surat',
  //     insTerm: '5',
  //     sumInsured: '1,00,000',
  //     createdon: '20-Jul-19',
  //     createdBy: 'Mr. J S Shah',
  //     modifiedon: '20-Jul-19',
  //     modifiedby: 'Mr. J S Shah',
  //     status: 'Approve',
  //   },
  //   {
  //     proposalNo: '19-20/P/DB/BH/00025',
  //     proposalDate: '20-Mar-20',
  //     dppfLoanNo: '15700020',
  //     employeeName: 'Mr. Champakbhai Patel',
  //     employeeNo: '100009394',
  //     officeAdd: 'P, Gandhinagar',
  //     locationofProperty: '2/4, Shiv Shakti, Near Megastore Complex, Vasad',
  //     insTerm: '3',
  //     sumInsured: '50,000',
  //     createdon: '20-Mar-20',
  //     createdby: 'Mr. J S Shah',
  //     modifiedon: '20-Mar-20',
  //     modifiedby: 'Mr. J S Shah',
  //     status: 'Approve',
  //   },
  //   {
  //     proposalNo: '20-21/P/DB/BH/00003',
  //     proposalDate: '22-Dec-20',
  //     dppfLoanNo: '15700050',
  //     employeeName: 'Mrs. Dakshaben Modi',
  //     employeeNo: '100009300',
  //     officeAdd: 'Block 20, Sardar Bhavan, Gandhinagar',
  //     locationofProperty: '24, Shivalai Compound, Anand',
  //     insTerm: '10',
  //     sumInsured: '1,00,000',
  //     createdon: '22-Dec-20',
  //     createdby: 'Mr. J S Shah',
  //     modifiedon: '22-Dec-20',
  //     modifiedby: 'Mr. J S Shah',
  //     status: 'Approve',
  //   },
  //   {
  //     proposalNo: '20-21/P/DB/EE/00014',
  //     proposalDate: '23-Jan-21',
  //     dppfLoanNo: '15700130',
  //     employeeName: 'Ms. Sejal Patel',
  //     employeeNo: '100000992',
  //     officeAdd: 'Sardar Bhavan, Gandhinagar',
  //     locationofProperty: 'Mahadev, NH 4 By-pass circle, Vaghol',
  //     insTerm: '20',
  //     sumInsured: '1,00,000',
  //     createdon: '23-Jan-21',
  //     createdby: 'Mr. J S Shah',
  //     modifiedon: '23-Jan-21',
  //     modifiedby: 'Mr. J S Shah',
  //     status: 'Pending',
  //   },
  // ];
  dataSource = new MatTableDataSource<any>(this.elementData);
  // table data end

  // constructor
  constructor(private fb: FormBuilder, private router: Router, private workflowService: DoiService, private hbaService: HbaService) { }

  ngOnInit() {
    this.proposalForm = this.fb.group({
      dppfLoanNo: [''],
      empNo: [''],
      empName: [''],
      district: [''],
      taluka: [''],
      loan: [''],
    });
    this.getDistrictList();
  }

  // reset form
  reset() {
    this.proposalForm.reset();
  }

  private getDistrictList() {
    this.workflowService.getDataWithoutParams(APIConst.JPA_DOI_GET_DISTRICT_LIST_GUJRAT).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.districtList = resp.result;
          this.districtListApplicant = resp.result;
          this.districtListApplicantPer = resp.result;
          this.licType_List = resp.result;
        }
      }
    );
  }

  selectDistrict() {

    const district = this.proposalForm.value.district;
    this.geTalukaList(district);
  }

  private geTalukaList(districtID: number) {
    this.workflowService.getRequestWithNumberPathVar(APIConst.GET_DOI_TALUKA_LIST, districtID).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          this.talukaList = resp.result;
          this.talukaNamenodalList = resp.result;
        }
      }
    );
  }
  onSearch() {
    this.hbaService.postHbaProposalListing(APIConst.DOI_HBA_POLICY_PROPOSAL_LISTING).subscribe(
      (resp: any) => {
        if (resp && resp.result && resp.status === 200) {
          // this.districtList = resp.result;
          // this.districtListApplicant = resp.result;
          // this.districtListApplicantPer = resp.result;
          // this.licType_List = resp.result;
          this.elementData = resp['result']
          this.dataSource = new MatTableDataSource<any>(this.elementData);

        }
      }
    );
  }


}
